import { getMongoDb } from '../config/mongo.js';
import { User, Roles } from '../types/globalTypes.js';
import { ObjectId } from 'mongodb';

const COLLECTION = 'fitapp_users';

// Helper to convert MongoDB document to User type
function docToUser(doc: any): User {
  return {
    username: doc.username,
    password: doc.password,
    refreshToken: doc.refreshToken || doc.refresh_token,
    roles: doc.roles || { User: 2001 },
  };
}

class UsersRepositoryMongo {
  async getAll(): Promise<User[]> {
    const db = await getMongoDb();
    const docs = await db.collection(COLLECTION).find({}).toArray();
    return docs.map(docToUser);
  }

  async getByUsername(username: string): Promise<User | null> {
    const db = await getMongoDb();
    const doc = await db.collection(COLLECTION).findOne({ username });
    return doc ? docToUser(doc) : null;
  }

  async getById(id: string | number): Promise<User | null> {
    const db = await getMongoDb();
    let doc;

    if (typeof id === 'string' && ObjectId.isValid(id)) {
      doc = await db.collection(COLLECTION).findOne({ _id: new ObjectId(id) });
    } else {
      doc = await db.collection(COLLECTION).findOne({ id });
    }

    return doc ? docToUser(doc) : null;
  }

  async create(user: { username: string; password: string; roles?: Roles }): Promise<User> {
    const db = await getMongoDb();
    const roles = user.roles || { User: 2001 };

    const newUser = {
      username: user.username,
      password: user.password,
      roles,
      refreshToken: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    await db.collection(COLLECTION).insertOne(newUser);
    return docToUser(newUser);
  }

  async update(username: string, updates: Partial<User>): Promise<User | null> {
    const db = await getMongoDb();
    const updateDoc: any = { updatedAt: new Date() };

    if (updates.password !== undefined) {
      updateDoc.password = updates.password;
    }

    if (updates.roles !== undefined) {
      updateDoc.roles = updates.roles;
    }

    if (updates.refreshToken !== undefined) {
      updateDoc.refreshToken = updates.refreshToken;
    }

    const result = await db
      .collection(COLLECTION)
      .findOneAndUpdate({ username }, { $set: updateDoc }, { returnDocument: 'after' });

    return result ? docToUser(result) : null;
  }

  async updateRefreshToken(username: string, refreshToken: string): Promise<User | null> {
    const db = await getMongoDb();
    const result = await db
      .collection(COLLECTION)
      .findOneAndUpdate(
        { username },
        { $set: { refreshToken, updatedAt: new Date() } },
        { returnDocument: 'after' }
      );

    return result ? docToUser(result) : null;
  }

  async clearRefreshToken(username: string): Promise<User | null> {
    const db = await getMongoDb();
    const result = await db
      .collection(COLLECTION)
      .findOneAndUpdate(
        { username },
        { $set: { refreshToken: null, updatedAt: new Date() } },
        { returnDocument: 'after' }
      );

    return result ? docToUser(result) : null;
  }

  async delete(username: string): Promise<boolean> {
    const db = await getMongoDb();
    const result = await db.collection(COLLECTION).deleteOne({ username });
    return result.deletedCount > 0;
  }
}

export default new UsersRepositoryMongo();

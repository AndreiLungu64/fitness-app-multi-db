import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import usersRepository from '../repository/usersRepository.mongo.js';

const handleNewUser = async (req: Request, res: Response) => {
  const { user, pwd } = req.body;
  if (!user || !pwd) {
    res.status(400).json({ message: 'Username and password are required.' });
    return;
  }

  // check for duplicate usernames in the db
  const duplicate = await usersRepository.getByUsername(user);
  if (duplicate) {
    res.sendStatus(409); // conflict
    return;
  }

  try {
    // encrypt the password
    const hashedPassword = await bcrypt.hash(pwd, 10);

    // create new user in MongoDB
    await usersRepository.create({
      username: user,
      password: hashedPassword,
      roles: { User: 2001 },
    });

    res.status(201).json({ message: `New user ${user} created!` });
  } catch (err) {
    if (err instanceof Error) {
      res.status(500).json({ message: err.message });
    }
  }
};

export default { handleNewUser };

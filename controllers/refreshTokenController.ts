import { Request, Response } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { config } from 'dotenv';
config();

import usersRepository from '../repository/usersRepository.mongo.js';

const handleRefreshToken = async (req: Request, res: Response) => {
  const cookies = req.cookies;
  if (!cookies?.jwt) {
    res.sendStatus(401);
    return;
  }
  const refreshToken = cookies.jwt;

  const foundUsers = await usersRepository.getAll();
  const foundUser = foundUsers.find(person => person.refreshToken === refreshToken);

  if (!foundUser) {
    res.sendStatus(403); // forbidden
    return;
  }

  const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET;
  const refreshTokenSecret = process.env.REFRESH_TOKEN_SECRET;

  if (!accessTokenSecret || !refreshTokenSecret) {
    res.status(500).json({ message: 'Server configuration error' });
    return;
  }

  // evaluate jwt
  jwt.verify(
    refreshToken,
    process.env.REFRESH_TOKEN_SECRET!,
    (err: jwt.VerifyErrors | null, decoded: string | JwtPayload | undefined) => {
      if (err) {
        res.sendStatus(403); // forbidden
        return;
      }

      const decodedUsername = (decoded as JwtPayload).username;

      if (foundUser.username !== decodedUsername) {
        res.sendStatus(403); // forbidden
        return;
      }

      const roles = Object.values(foundUser.roles);
      const accessToken = jwt.sign(
        {
          userInfo: {
            username: foundUser.username,
            roles: roles,
          },
        },
        process.env.ACCESS_TOKEN_SECRET!,
        { expiresIn: '30s' }
      );

      res.json({ accessToken });
    }
  );
};

export default { handleRefreshToken };

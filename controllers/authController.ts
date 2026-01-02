import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { config } from 'dotenv';
config();

import usersRepository from '../repository/usersRepository.mongo.js';

const handleLogin = async (req: Request, res: Response) => {
  const { user, pwd } = req.body;
  if (!user || !pwd) {
    res.status(400).json({ message: 'Username and password are required.' });
    return;
  }

  const foundUser = await usersRepository.getByUsername(user);
  if (!foundUser) {
    res.sendStatus(401); // unauthorised
    return;
  }

  // evaluate password
  const match = await bcrypt.compare(pwd, foundUser.password);

  if (match) {
    const roles = Object.values(foundUser.roles);

    // create JWTs
    const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET;
    const refreshTokenSecret = process.env.REFRESH_TOKEN_SECRET;

    if (!accessTokenSecret || !refreshTokenSecret) {
      res.status(500).json({ message: 'Server configuration error' });
      return;
    }

    const accessToken = jwt.sign(
      {
        userInfo: {
          username: foundUser.username,
          roles: roles,
        },
      },
      process.env.ACCESS_TOKEN_SECRET!,
      { expiresIn: '30s' } // 5-15 min in production
    );

    const refreshToken = jwt.sign(
      { username: foundUser.username },
      process.env.REFRESH_TOKEN_SECRET!,
      { expiresIn: '1d' } // 24h in production
    );

    // save refresh token with current user in MongoDB
    await usersRepository.updateRefreshToken(foundUser.username, refreshToken);

    // send the refreshToken to the frontend as a httpOnly Cookie
    res.cookie('jwt', refreshToken, {
      httpOnly: true,
      sameSite: 'none',
      secure: true,
      maxAge: 24 * 60 * 60 * 1000,
    });

    // send the accessToken as JSON
    res.json({ accessToken });
  } else {
    res.sendStatus(401); // unauthorised
  }
};

export default { handleLogin };

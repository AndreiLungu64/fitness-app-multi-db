import { Request, Response } from 'express';
import usersRepository from '../repository/usersRepository.mongo.js';

const handleLogout = async (req: Request, res: Response) => {
  // on client, also delete the accessToken

  const cookies = req.cookies;
  if (!cookies?.jwt) {
    res.sendStatus(204); // successful - no content to send back
    return;
  }
  const refreshToken = cookies.jwt;

  // check if the refreshToken is in the DB
  const foundUser = await usersRepository.getAll();
  const user = foundUser.find(person => person.refreshToken === refreshToken);

  // if no user, but a cookie, delete the cookie
  if (!user) {
    res.clearCookie('jwt', { httpOnly: true, sameSite: 'none', secure: true });
    res.sendStatus(204);
    return;
  }

  // Delete the refreshToken from MongoDB
  await usersRepository.clearRefreshToken(user.username);

  res.clearCookie('jwt', { httpOnly: true, sameSite: 'none', secure: true });
  res.sendStatus(204);
};

export default { handleLogout };

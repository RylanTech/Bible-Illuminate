import jwt from 'jsonwebtoken';
import { user } from '../models/user';


const secret = 'Ai.@D#T$Q@#';

export const signUserToken = async (user) => {
  let token = jwt.sign(
      { userId: user.userId },
      secret
  );
  
  return token;
}

export const verifyUser = async (req) => {
  // Get the Authorization header from the request
  const authHeader = req.headers.authorization;

  // If header exists, parse token from `Bearer <token>`
  if (authHeader) {
      const token = authHeader.split(' ')[1];

      // Verify the token and get the user
      try {
          let decoded = await jwt.verify(token, secret);
          return user.findByPk(decoded.userId);
      }
      catch (err) {
          return null;
      }
  }
  else {
      return null;
  }
}

export const verifyToken = async (token) => {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY || 'default_secret_key');
    return decoded;
  } catch (err) {
    return null;
  }
};

import express, { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

export interface AuthRequest extends Request {
  user: { sub: string };
}

const router = express.Router();

const verifyJWT = (req: AuthRequest, res: Response, next: NextFunction): void => {
  const authHeader = req.header('Authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    console.error('Authorization header missing or malformed');
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }

  const token = authHeader.substring(7);
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET!, {
      algorithms: [process.env.JWT_ALGO!],
    }) as JwtPayload;
    const sub = payload.sub;
    if (!sub || typeof sub !== 'string') {
      console.error('JWT payload missing sub');
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }
    req.user = { sub };
    next();
  } catch (err) {
    console.error('JWT verification failed:', err);
    res.status(401).json({ error: 'Unauthorized' });
  }
};

async function getUserProfileFromDB(userId: string) {
  // Simulate a database fetch
  return {
    firstName: 'John',
    lastName: 'Doe',
    username: 'johndoe',
    email: 'john.doe@example.com',
  };
}

async function updateUserProfileInDB(
  userId: string,
  data: { firstName: string; lastName: string; username: string; email: string }
) {
  // Simulate a database update
  console.log(`Updating user ${userId} with data`, data);
}

router.get('/profile', verifyJWT, async (req: AuthRequest, res: Response) => {
  try {
    const profile = await getUserProfileFromDB(req.user.sub);
    res.json(profile);
  } catch (err) {
    console.error('Error fetching user profile:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.put(
  '/profile',
  verifyJWT,
  express.json(),
  async (req: AuthRequest, res: Response) => {
    const { firstName, lastName, username, email } = req.body;
    if (!firstName || !lastName || !username || !email) {
      console.error('Missing required profile fields');
      res.status(400).json({ error: 'Missing required profile fields' });
      return;
    }
    try {
      await updateUserProfileInDB(req.user.sub, {
        firstName,
        lastName,
        username,
        email,
      });
      res.json({ success: true });
    } catch (err) {
      console.error('Error updating user profile:', err);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
);

export default router;
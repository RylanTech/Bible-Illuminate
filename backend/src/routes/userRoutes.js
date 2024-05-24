import { Router } from 'express';
import { createUser, getUser, getallUsers, loginUser, verify } from '../controllers/userController';

const router = Router();

router.get('/', getallUsers);
router.get('/:id', getUser);
router.post('/verify', verify)
router.post('/', createUser);
router.post('/signin', loginUser);


export default router;
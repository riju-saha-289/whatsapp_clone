import express from 'express';
import { chatList } from '../controllers/chatListController.js';

const router = express.Router();

router.get('/chatlist', chatList);

export default router;

import express from 'express';
import {
  getMessages,
  getMessageById,
  updateMessageStatus,
  deleteMessage,
  createMessage,

} from '../controllers/messageController.js';

const router = express.Router();

router.get('/', getMessages);
router.get('/:msg_id', getMessageById);
router.put('/:msg_id/status', updateMessageStatus);
router.delete('/:msg_id', deleteMessage);
router.post('/', createMessage);

export default router;

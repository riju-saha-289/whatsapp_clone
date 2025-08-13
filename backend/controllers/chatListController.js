import Message from '../models/Message.js';

export const chatList = async (req, res) => {
  try {
    const chatList = await Message.aggregate([
      { $sort: { timestamp: -1 } }, // latest messages first
      {
        $group: {
          _id: "$wa_id",
          lastMsgId: { $first: "$msg_id" },
          lastMsgContent: { $first: "$content" },
          lastMsgTimestamp: { $first: "$timestamp" },
          contactName: { $first: "$contactName" },
          status: { $first: "$status" },
          from: { $first: "$from" },
          to: { $first: "$to" },
          type: { $first: "$type" },
          isFromUser: { $first: "$isFromUser" }
        }
      },
      { $sort: { lastMsgTimestamp: -1 } } // sort chats by latest message time
    ]);
    res.json(chatList);
  } catch (error) {
    console.error('Error fetching chat list:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

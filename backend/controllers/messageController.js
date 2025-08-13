import Message from "../models/Message.js";
import mongoose from "mongoose";

export const createMessage = async (req, res) => {
  try {
    const { wa_id, from, to, type, content, contactName, msg_id } = req.body;
    if (!wa_id || !from || !type || !content) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Use provided msg_id or generate new one
    const messageId = msg_id || new mongoose.Types.ObjectId().toString();

    const newMsg = new Message({
      msg_id: messageId,
      wa_id,
      from,
      to: to || "",
      type,
      content,
      timestamp: new Date(),
      status: "sent",
      isFromUser: from === wa_id,
      contactName: contactName || "",
    });

    await newMsg.save();

    res.status(201).json(newMsg);
  } catch (err) {
    console.error("Create message error:", err);
    res.status(500).json({ error: "Server error" });
  }
};

// Get all messages, with optional filters
export const getMessages = async (req, res) => {
  try {
    const { wa_id, status } = req.query;
    const filter = {};
    if (wa_id) filter.wa_id = wa_id;
    if (status) filter.status = status;

    const messages = await Message.find(filter).sort({ timestamp: -1 });
    res.json(messages);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

// Get a message by msg_id
export const getMessageById = async (req, res) => {
  try {
    const msg = await Message.findOne({ msg_id: req.params.msg_id });
    if (!msg) return res.status(404).json({ error: "Message not found" });
    res.json(msg);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

// Update message status by msg_id
export const updateMessageStatus = async (req, res) => {
  try {
    const { status } = req.body;
    if (!["sent", "delivered", "read", "pending"].includes(status)) {
      return res.status(400).json({ error: "Invalid status value" });
    }
    const updatedMsg = await Message.findOneAndUpdate(
      { msg_id: req.params.msg_id },
      { status },
      { new: true }
    );
    if (!updatedMsg)
      return res.status(404).json({ error: "Message not found" });
    res.json(updatedMsg);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

// Delete message by msg_id (optional)
export const deleteMessage = async (req, res) => {
  try {
    const deletedMsg = await Message.findOneAndDelete({
      msg_id: req.params.msg_id,
    });
    if (!deletedMsg)
      return res.status(404).json({ error: "Message not found" });
    res.json({ message: "Message deleted" });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};




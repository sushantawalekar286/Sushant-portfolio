import Message from '../models/Message.js';
import { sendContactEmail } from '../utils/email.js';
import { sendSuccess, sendError } from '../utils/response.js';

export const submitMessage = async (req, res, next) => {
  const { name, email, subject, message } = req.body;

  try {
    const newMessage = await Message.create({
      name,
      email,
      subject: subject || 'General Inquiry',
      message
    });

    // Send email alert asynchronously
    sendContactEmail({ name, email, subject, message });

    return sendSuccess(res, 'Thank you! Your message has been sent successfully.', newMessage, 201);
  } catch (error) {
    next(error);
  }
};

export const getMessages = async (req, res, next) => {
  try {
    const messages = await Message.find().sort({ date: -1 });
    return sendSuccess(res, 'Messages retrieved successfully', messages);
  } catch (error) {
    next(error);
  }
};

export const markMessageRead = async (req, res, next) => {
  try {
    const message = await Message.findById(req.params.id);
    if (!message) {
      return sendError(res, 'Message not found', null, 404);
    }
    message.read = true;
    await message.save();
    return sendSuccess(res, 'Message marked as read', message);
  } catch (error) {
    next(error);
  }
};

export const deleteMessage = async (req, res, next) => {
  try {
    const message = await Message.findById(req.params.id);
    if (!message) {
      return sendError(res, 'Message not found', null, 404);
    }
    await Message.findByIdAndDelete(req.params.id);
    return sendSuccess(res, 'Message deleted successfully');
  } catch (error) {
    next(error);
  }
};

import mongoose from "mongoose";

const Chatschema = mongoose.Schema({
  chats: {
    type: Array,
    chats: [
      {
        senderId: {
          type: String,
          required: true,
        },
        message: {
          type: String,
          required: true,
        },
      },
    ],
  },
  roomId: {
    type: String,
    required: true,
  },
});

const Chat = mongoose.model("chat", Chatschema);
export default Chat;

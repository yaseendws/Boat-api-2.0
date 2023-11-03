import mongoose from "mongoose";

const Chatschema = mongoose.Schema({
  user_id: {
    type: String,
    required: true,
  },
  text: {
    type: String,
    required: true,
  },
  roomId: {
    type: String,
    required: true,
  },
});

const Chat = mongoose.model("chat", Chatschema);
export default Chat;

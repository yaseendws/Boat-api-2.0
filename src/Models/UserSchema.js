import mongoose from "mongoose";

const UserSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    profilePhoto: {
      type: String,
      required: true,
    },
    phoneNumber: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      default: "user",
      enum:["vendor","user"]
    },
    verified:{
      type:Boolean,
      default:false
    },
    notificationToken:{
      type:String,
      required:true
    }
  },
  {
    timestamps: true,
  }
);

const otpSchema = mongoose.Schema(
  {
    userId:{
      type:String,
      required:true
    },
    otp:{
      type:String,
      required:true
    }
  }
)

const User = mongoose.model("User", UserSchema);
const Otp = mongoose.model("otp", otpSchema);
export default User;
export {Otp}

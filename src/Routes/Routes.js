import express from "express";
import {
  ForgotPassword,
  LoginUser,
  MakeVendor,
  NewPassword,
  RegisterdUser,
  VerifyOtp,
  getProfile,
} from "../Controllers/UserController.js";
import { checkToken, upload } from "../Middleware/index.js";
import {
  CreateBoat,
  UpdateBoat,
  getAllBoats,
} from "../Controllers/BoatController.js";
import { BookingApi, CancelBooking, getBooking } from "../Controllers/BookingController.js";
import { imageUpload } from "../Controllers/ImageUpload.js";

const route = express.Router();

route.route("/image").post(upload.single("file"), imageUpload);

//userRoutes---------------------------------

route.route("/registerd").post(RegisterdUser);
route.route("/login").post(LoginUser);
route.route("/user").put(checkToken, MakeVendor).get(getProfile)
route.route("/verify").post(checkToken, VerifyOtp);
route.route("/forgot").post(ForgotPassword);
route.route("/newpassword").post(checkToken,NewPassword);

//BoatsRoutes--------------------------------

route.route("/boat").get(getAllBoats);
route.route("/createboat").post(checkToken, CreateBoat);
route.route("/updateboat").post(checkToken, UpdateBoat);

//BookingRoutes--------------------------------

route.route("/booking").post(checkToken,BookingApi).get(getBooking).put(checkToken,CancelBooking)

export default route;

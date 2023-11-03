import mongoose from "mongoose";

const BookingSchema = mongoose.Schema(
  {
    user_id: {
      type: String,
      required: true,
    },
    boat_id: {
      type: String,
      required: true,
    },
    check_in_date: {
      type: String,
      required: true,
    },
    check_out_date: {
      type: String,
      required: true,
    },
    check_in_time: {
      type: String,
      required: true,
    },
    check_out_time: {
      type: String,
      required: true,
    },
    is_skipper: {
      type: Boolean,
      default:false
    },
    guest_number: {
      type: Number,
      required: true,
    },
    trip_type: {
      type: String,
      required: true,
    },
    services: {
      type: Array,
    },
    totalPayment: {
      type: String,
      required: true,
    },
    is_paid: {
      type: Boolean,
      default: false,
    },
    custom_offer_id: {
      type: String,
    },
    expire_offer: {
      type: String,
    },
    trip_duration: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Booking = mongoose.model("Booking", BookingSchema);
export default Booking;

import mongoose from "mongoose";

const BoatSchema = mongoose.Schema(
  {
    vendor_id: {
      type: String,
      required: true,
    },
    boat_name: {
      type: String,
      required: true,
    },
    boat_type: {
      type: String,
      required: true,
    },
    location: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    harbor: {
      type: String,
      required: true,
    },
    model: {
      type: String,
      required: true,
    },
    is_skipper: {
      type: Boolean,
      required: true,
    },
    is_professional: {
      type: Boolean,
      required: true,
    },
    boat_length: {
      type: String,
      required: true,
    },
    boat_fuel: {
      type: String,
      required: true,
    },
    boat_speed: {
      type: String,
      required: true,
    },
    number_of_people: {
      type: Number,
      required: true,
    },
    number_of_cabin: {
      type: Number,
      required: true,
    },
    number_of_berths: {
      type: Number,
      required: true,
    },
    price: {
      type: Object,
      required: true,
    },
    equipment: {
      type: Array,
      required: true,
    },
    services: {
      type: Array,
      required: true,
    },
    manufactured: {
      type: String,
      required: true,
    },
    cancel_conditions: {
      type: Array,
      required: true,
    },
    booked_dates: {
      type: Array,
    },
  },
  {
    timestamps: true,
  }
);

const Boat = mongoose.model("Boat", BoatSchema);
export default Boat;

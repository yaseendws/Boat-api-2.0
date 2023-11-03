import moment from "moment/moment.js";
import Booking from "../Models/BookingSchema.js";
import Boat from "../Models/BoatSchema.js";
import { errHandler, responseHandler } from "../helper/response.js";

function getDatesInRange(startDate, endDate) {
  const date = new Date(startDate.getTime());
  const dates = [];
  while (date <= endDate) {
    dates.push(new Date(date));
    date.setDate(date.getDate() + 1);
  }
  return dates;
}
const BookingApi = async (req, res) => {
  const {
    check_in_date,
    check_out_date,
    check_in_time,
    check_out_time,
    is_skipper,
    guest_number,
    trip_type,
    services,
    totalPayment,
    trip_duration,
  } = req.body;
  const { trip, boatId } = req.query;
  let BoatData = await Boat.findOne({ _id: boatId });
  let total = 400;
  let startDate = "2023-11-28";
  let endDate = "2023-11-30";
  const d1 = new Date(startDate);
  const d2 = new Date(endDate);
  let arr = getDatesInRange(check_in_date, check_out_date);
  let arr2 = [];
  for (let i = 0; i < arr.length; i++) {
    const element = arr[i];
    let d = moment(element).format("YYYY-DD-MM");
    arr2.push(d);
  }
  console.log(arr2);
  let tripType = "";
  const { _id } = req.user;

  if (BoatData.booked_dates) {
    for (let i = 0; i < arr2.length; i++) {
      const element1 = arr2[i];
      for (let j = 0; j < BoatData.booked_dates.length; j++) {
        const element2 = BoatData.booked_dates[j];
        if (element1 == element2) {
          errHandler(res, "Boat Was Not Avaliable on This Date", 403);
          return;
        }
      }
    }
  }
  
  if (arr2.length == "1") {
    tripType = "fullday";
    let num = BoatData.price["fullday"].price;
    total = Number(num);
  } else if (arr2.length >= "1" && arr2.length < "7") {
    tripType = "1-6";
    let num = BoatData.price["fullday"].price;
    total = Number(num) * Number(arr2.length);
  } else if (arr2.length == "7") {
    tripType = "weekly";
    let num = BoatData.price["weekly"].price;
    total = Number(num);
  } else if (arr2.length >= "30") {
    tripType = "monthly";
    let num = BoatData.price["monthly"].price;
    total = Number(num);
  } else {
    tripType = "duration";
    let num = BoatData.price["fullday"].price;
    total = Number(num) * Number(arr2.length) + 400;
  }

  if (guest_number > BoatData.number_of_people) {
    errHandler(res, 6, 403);
    return;
  }
  console.log(moment().date(d1).format("MMMM DD, YYYY"),"dd")
  console.log(tripType, "trip");
  let data = {
    user_id: _id,
    boat_id: boatId,
    trip_duration:
      arr2.length <= 9 ? "0" + arr2.length : JSON.stringify(arr2.length),
    trip_type: tripType,
    check_in_date: moment().date(check_in_date).format("MMMM DD, YYYY"),
    check_out_date: moment().date(check_out_date).format("MMMM DD, YYYY"),
    is_skipper,
    totalPayment: total,
    check_in_time: "00",
    check_out_time: "00",
    services: services,
    guest_number,
  };
  console.log(data);
  Booking.create(data)
    .then((Boats) => {
      Boat.findByIdAndUpdate(
        boatId,
        { booked_dates: [...BoatData.booked_dates, ...arr2] },
        { new: true }
      )
        .then((data11) => {
          console.log(data11);
        })
        .catch(() => {
          errHandler(res, 5, 403);
        });
      responseHandler(res, Boats);
    })
    .catch((err) => {
      console.log(err);
      errHandler(res, 5, 403);
    });
};

const getBooking = (req, res) => {
  let { id, boatId } = req.body;
  let obj = {};
  if (id) {
    obj.id = id;
  }
  if (boatId) {
    obj.boat_id = boatId;
  }
  Booking.find(obj)
    .then((data) => {
      responseHandler(res, data);
    })
    .catch(() => {
      errHandler(res, 5, 403);
    });
};

const CancelBooking = (req, res) => {
  let { bookingId } = req.query;
  let DateArr = [];
  Booking.findOne({ _id: bookingId })
    .then((Book) => {
      const d1 = new Date(Book.check_in_date);
      const d2 = new Date(Book.check_out_date);
      let arr = getDatesInRange(d1, d2);
      console.log(arr)
      return
      Boat.findOne({ _id: Book.boat_id })
        .then((boat) => {})
        .catch(() => {
          errHandler(res, 5, 403);
        });
    })
    .catch(() => {
      errHandler(res, 5, 403);
    });
};

export { BookingApi, getBooking,CancelBooking };

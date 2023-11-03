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

function formatDate(d1) {
  const date = new Date(d1);
  const options = { year: "numeric", month: "long", day: "numeric" };
  return date.toLocaleDateString("en-US", options);
}

const BookingApi = async (req, res) => {
  const { check_in_date, check_out_date, is_skipper, guest_number, services } =
    req.body;
  const { trip, boatId } = req.query;
  let BoatData = await Boat.findOne({ _id: boatId });
  console.log(BoatData);
  let total = 400;
  let startDate = moment(check_in_date, "DD MM YYYY").format("YYYY-MM-DD");
  let endDate = moment(check_out_date, "DD MM YYYY").format("YYYY-MM-DD");
  const d1 = new Date(startDate);
  const d2 = new Date(endDate);
  let arr = getDatesInRange(d1, d2);
  let arr2 = [];
  for (let i = 0; i < arr.length; i++) {
    const element = arr[i];
    let d = moment(element, "YYYY-MM-DD").format("YYYY-MM-DD");
    arr2.push(d);
  }
  console.log(arr2, "j");
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
  let ff = moment(check_out_date).format("YYYY MM DD");
  console.log(formatDate(check_in_date), "dd");
  console.log(tripType, "trip");
  let data = {
    user_id: _id,
    boat_id: boatId,
    trip_duration:
      arr2.length <= 9 ? "0" + arr2.length : JSON.stringify(arr2.length),
    trip_type: tripType,
    check_in_date: moment(check_in_date, "DD MM YYYY").format("MMMM DD, YYYY"),
    check_out_date: moment(check_out_date, "DD MM YYYY").format(
      "MMMM DD, YYYY"
    ),
    is_skipper,
    totalPayment: total,
    check_in_time: "00",
    check_out_time: "00",
    services: services,
    guest_number,
    custom_offer_id: trip == "custom" ? true : false,
  };

  console.log(check_in_date, "d");
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
      responseHandler(res, {
        Boats,
        text: `BOAT Bali - Catana Bali Catspace, DATES ${check_in_date} 07:00 AM ${check_out_date} 06:00 AM, Hello Adrew, I am interested in your catamaran, is it still available? If yes, can you please send me a offer? Thank you AHMED`,
      });
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
  Booking.findOne({ _id: bookingId })
    .then((Book) => {
      const d1 = new Date(Book.check_in_date);
      const d2 = new Date(Book.check_out_date);
      let arr = getDatesInRange(d1, d2);
      let arr2 = [];
      let arr3 = [];
      for (let i = 0; i < arr.length; i++) {
        const element = arr[i];
        let d = moment(element, "YYYY-MM-DD").format("YYYY-MM-DD");
        arr2.push(d);
      }

      Boat.findOne({ _id: Book.boat_id })
        .then((boat) => {
          console.log(boat.booked_dates);
          if (boat.booked_dates) {
            for (let i = 0; i < arr2.length; i++) {
              const element1 = arr2[i];
              for (let j = 0; j < boat.booked_dates.length; j++) {
                const element2 = boat.booked_dates[j];
                if (element1 == element2) {
                  arr3.push(element1);
                }
              }
            }
          }
          const resultArray = boat.booked_dates.filter(
            (item) => !arr3.includes(item)
          );
          console.log(arr3, "j");
          console.log(resultArray, "j2");
          Boat.findByIdAndUpdate(
            boat._id,
            { booked_dates: resultArray },
            { new: true }
          )
            .then((BookingCancel) => {
              Booking.findByIdAndDelete(Book._id).then(()=>{
                responseHandler(res, BookingCancel);
              }).catch(() => {
                errHandler(res, "deleting was not sucsse", 403);
              });
            })
            .catch(() => {
              errHandler(res, 5, 403);
            });
        })
        .catch(() => {
          errHandler(res, 5, 403);
        });
    })
    .catch(() => {
      errHandler(res, 5, 403);
    });
};

export { BookingApi, getBooking, CancelBooking };

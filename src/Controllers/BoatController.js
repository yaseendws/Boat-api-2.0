import Boat from "../Models/BoatSchema.js";
import { errHandler, responseHandler } from "../helper/response.js";

const CreateBoat = (req, res) => {
  const body = req.body;
  const id = req.user._id;
  console.log(id);
  if (!(Object.keys(body).length > 0)) {
    errHandler(res, "All Fields Are Required", 404);
    return;
  }
  Boat.create({ vendor_id: id, ...body })
    .then((data) => {
      responseHandler(res, data);
    })
    .catch((err) => {
      errHandler(res, 5, 500);
      console.log(err);
    });
};

const UpdateBoat = (req, res) => {
  const body = req.body;
  const { _id } = req.query;
  console.log(body);
  console.log(_id);
  if (!(Object.keys(body).length > 0)) {
    errHandler(res, "All Fields Are Required", 404);
    return;
  }
  Boat.findByIdAndUpdate(_id, { ...body }, { new: true })
    .then((data) => {
      responseHandler(res, data);
    })
    .catch((err) => {
      errHandler(res, 5, 500);
      console.log(err);
    });
};

const getAllBoats = (req, res) => {
  const { vendor_id } = req.query;
  let obj = {};
  if (vendor_id) {
    obj.vendor_id = vendor_id;
  }
  Boat.find({})
    .then((data) => {
      responseHandler(res, data);
    })
    .catch((err) => {
      errHandler(res, 5, 500);
      console.log(err);
    });
};

export { CreateBoat, getAllBoats, UpdateBoat };

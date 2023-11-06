import jsonwebtoken from "jsonwebtoken";
import User, { Otp } from "../Models/UserSchema.js";
import { errHandler, responseHandler } from "../helper/response.js";
import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: "yaseendws@gmail.com",
    pass: process.env.PASS,
  },
});


const SendHtml = (name,otp)=>{
return(
`<body style="font-family: Helvetica, Arial, sans-serif; margin: 0px; padding: 0px; background-color: #ffffff;">
  <table role="presentation"
    style="width: 100%; border-collapse: collapse; border: 0px; border-spacing: 0px; font-family: Arial, Helvetica, sans-serif; background-color: rgb(239, 239, 239);">
    <tbody>
      <tr>
        <td align="center" style="padding: 1rem 2rem; vertical-align: top; width: 100%;">
          <table role="presentation" style="max-width: 600px; border-collapse: collapse; border: 0px; border-spacing: 0px; text-align: left;">
            <tbody>
              <tr>
                <td style="padding: 40px 0px 0px;">
                  <div style="text-align: left;">
                    <div style="padding-bottom: 20px;"><div style="border-bottom:1px solid #eee">
                    <a href="" style="font-size:1.4em;color: 
                    rgba(252, 36, 105, 1);text-decoration:none;font-weight:600">Boat App</a>
                  </div></div>
                  </div>
                  <div style="padding: 20px; background-color: rgb(255, 255, 255);">
                    <div style="color: rgb(0, 0, 0); text-align: left;">
                      <h1 style="margin: 1rem 0">Verification code</h1>
                      <p style="padding-bottom: 16px;"><b>${name}</b> Thank you for choosing Boat App. Use the following OTP to complete your Registration procedures</p>
                      <h2 style="background: rgba(252, 36, 105, 0.6);margin: 0 auto;width: max-content;padding: 0 10px;color: #fff;border-radius: 4px;">BA-${otp}</h2>
                      <p style="padding-bottom: 16px">If you didn’t request this, you can ignore this email.</p>
                      <p style="padding-bottom: 16px">Thanks,<br>The Boat App team</p>
                    </div>
                  </div>
                  
                </td>
              </tr>
            </tbody>
          </table>
        </td>
      </tr>
    </tbody>
  </table>
  </body>`
)
}
 



const RegisterdUser = async (req, res) => {
  let { name, email, password, phoneNumber,notificationToken } = req.body;
  let profilePhoto = "https://placehold.co/100x100?text=";
  if (User && (await User.findOne({ email }))) {
    errHandler(res, 1, 403);
    return;
  }
  if (password?.trim().length < 8) {
    errHandler(res, 2, 403);
    return;
  }
  if (name?.trim().length < 3) {
    errHandler(res, 3, 403);
    return;
  }
  if (phoneNumber?.trim().length < 11) {
    errHandler(res, "Please Enter Correct PhoneNumber", 403);
    return;
  }

  let profileName = name.split(" ");
  if (profileName.length >= 2) {
    profileName = [profileName[0][0], profileName[1][0]]
      .join("")
      .toLocaleUpperCase();
  } else {
    profileName = profileName[0][0].toLocaleUpperCase();
  }

  User.create({
    name,
    email,
    password,
    phoneNumber,
    profilePhoto: profilePhoto + profileName,
    notificationToken
  })
    .then(async (data) => {
      let {
        name,
        email,
        profilePhoto,
        phoneNumber,
        _id,
        createdAt,
        role,
        verified,
        notificationToken
      } = data;
      let token = jsonwebtoken.sign(
        {
          name,
          email,
          profilePhoto,
          _id,
          createdAt,
          role,
          phoneNumber,
          verified,
          notificationToken
        },
        process.env.SECRET_KEY
      );
      const otp = Math.floor(1000 + Math.random() * 9000);
      const mailOptions = {
        from: "yaseendws@gmail.com",
        to: email,
        subject: "These was recived by Boat App || Please verify your self",
        html: SendHtml(name,otp),
      };
     transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log("Error occurred:", error.message);
      } else {
        console.log(info);
        Otp.create({ userId: _id, otp: otp }).then(()=>{
          responseHandler(res, {
            name,
            email,
            profilePhoto,
            _id,
            createdAt,
            token,
            phoneNumber,
            role,
            verified,
            notificationToken
          });
        })
      }
    });
      })
    .catch((err) => {
      errHandler(res, 5, 409);
      console.log(err);
    });
};

const LoginUser = (req, res) => {
  let { email, password } = req.body;
  if (password.trim().length < 8) {
    errHandler(res, 2, 403);
    return;
  }
  User.findOne({ email })
    .then((data) => {
      let {
        name,
        email,
        profilePhoto,
        phoneNumber,
        _id,
        createdAt,
        role,
        verified,
        notificationToken
      } = data;
      let token = jsonwebtoken.sign(
        {
          name,
          email,
          profilePhoto,
          phoneNumber,
          _id,
          createdAt,
          role,
          verified,
          notificationToken
        },
        process.env.SECRET_KEY
      );
      responseHandler(res, {
        name,
        email,
        profilePhoto,
        _id,
        createdAt,
        token,
        phoneNumber,
        role,
        verified,
        notificationToken
      });
    })
    .catch((err) => {
      errHandler(res, 5, 409);
    });
};
const MakeVendor = (req, res) => {
  const user = req.user;
  User.findByIdAndUpdate({ _id: user._id }, { role: "vendor" }, { new: true })
    .then((data) => {
      responseHandler(res, data);
    })
    .catch((err) => {
      errHandler(res, 5, 409);
    });
};

const ForgotPassword = async (req, res) => {
  const { email } = req.body;
  console.log(email);
  if (!email) {
    errHandler(res, "Account Was Not Found", 403);
    return;
  }

  User.findOne({ email }).then((userData) => {
    User.findByIdAndUpdate(
      { _id: userData._id },
      { verified: false },
      { new: true }
    )
      .then((data) => {
        let {
          name,
          email,
          profilePhoto,
          phoneNumber,
          _id,
          createdAt,
          role,
          verified,
          notificationToken
        } = data;
        let token = jsonwebtoken.sign(
          {
            name,
            email,
            profilePhoto,
            _id,
            createdAt,
            role,
            phoneNumber,
            verified,
            notificationToken
          },
          process.env.SECRET_KEY
        );
        const otp = Math.floor(1000 + Math.random() * 9000);
        const mailOptions = {
          from: "yaseendws@gmail.com",
          to: email,
          subject: "These was recived by Boat App || Please verify your self",
          html: SendHtml(name,otp),
        };
       transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.log("Error occurred:", error.message);
        } else {
          console.log(info);
          Otp.create({ userId: _id, otp: otp }).then(()=>{
            responseHandler(res, {
              name,
              email,
              profilePhoto,
              _id,
              createdAt,
              token,
              phoneNumber,
              role,
              verified,
              notificationToken
            });
          })
        }
      });
        responseHandler(res, {
          name,
          email,
          profilePhoto,
          phoneNumber,
          _id,
          createdAt,
          role,
          verified,
          token,
          notificationToken
        });
      })
      .catch((err) => {
        errHandler(res, 5, 409);
      });
  });
};
const NewPassword = async (req, res) => {
  const { password } = req.body;
  const user = req.user;
  console.log(password);
  if (!password) {
    errHandler(res, "Password Has Not Changed", 403);
    return;
  }
  if (password?.trim().length < 8) {
    errHandler(res, 2, 403);
    return;
  }
  User.findByIdAndUpdate({ _id: user._id }, { password }, { new: true }).then(
    (data) => {
      let {
        name,
        email,
        profilePhoto,
        phoneNumber,
        _id,
        createdAt,
        role,
        verified,
        notificationToken
      } = data;
      let token = jsonwebtoken.sign(
        {
          name,
          email,
          profilePhoto,
          _id,
          createdAt,
          role,
          phoneNumber,
          verified,
          notificationToken
        },
        process.env.SECRET_KEY
      );
      responseHandler(res, {
        name,
        email,
        profilePhoto,
        phoneNumber,
        _id,
        createdAt,
        role,
        verified,
        token,
        notificationToken
      });
    }
  );
};

const VerifyOtp = (req, res) => {
  const user = req.user;
  const { otp } = req.body;
  console.log(otp);

  Otp.find({ userId: user._id })
    .then((dataotp) => {
      console.log(dataotp);
      if (otp == dataotp[0].otp) {
        User.findByIdAndUpdate(
          { _id: user._id },
          { verified: true },
          { new: true }
        )
          .then((data) => {
            let {
              name,
              email,
              profilePhoto,
              phoneNumber,
              _id,
              createdAt,
              role,
              verified,
              notificationToken
            } = data;
            let token = jsonwebtoken.sign(
              {
                name,
                email,
                profilePhoto,
                _id,
                createdAt,
                role,
                phoneNumber,
                verified,
                notificationToken
              },
              process.env.SECRET_KEY
            );
            responseHandler(res, {
              name,
              email,
              profilePhoto,
              phoneNumber,
              _id,
              createdAt,
              role,
              verified,
              token,
              notificationToken
            });
            Otp.findByIdAndDelete(dataotp[0]._id)
              .then((datao) => {
                console.log(datao);
              })
              .catch((err) => {
                console.log(err);
              });
          })
          .catch((err) => {
            errHandler(res, 5, 409);
          });
      } else {
        errHandler(res, "Invalid Otp", 409);
      }
    })
    .catch(() => {
      errHandler(res, 5, 409);
    });
};

const getProfile = (req, res) => {
  const { id } = req.query;
  User.findOne({ _id: id })
    .then((data) => {
      let {
        name,
        email,
        profilePhoto,
        phoneNumber,
        _id,
        createdAt,
        role,
        verified,
        notificationToken
      } = data;
      let token = jsonwebtoken.sign(
        {
          name,
          email,
          profilePhoto,
          _id,
          createdAt,
          role,
          phoneNumber,
          verified,
          notificationToken
        },
        process.env.SECRET_KEY
      );
      responseHandler(res, {
        name,
        email,
        profilePhoto,
        phoneNumber,
        _id,
        createdAt,
        role,
        verified,
        token,
        notificationToken
      });
    })
    .catch(() => {
      errHandler(res, 5, 404);
    });
};

export {
  RegisterdUser,
  LoginUser,
  MakeVendor,
  VerifyOtp,
  ForgotPassword,
  NewPassword,
  getProfile,
};

import tbl_user from "../model/tbl_user.js";
import jwt from "jsonwebtoken";
import createAsyncError from "../middleware/createAsyncError.js";
import tbl_product from "../model/tbl_product.js";
import nodemailer from "nodemailer";
import cron from "node-cron";
const passwordRegex =
  /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

const currentTime = new Date();

// create or register user
const createUser = createAsyncError(async (req, res) => {
  const { email, password, name, mobile } = req.body;

  try {
    if (!email || !password || !name) {
      return res
        .status(401)
        .json({ message: "please fill the form properly", x: req.body });
    }
    // const existemail = await tbl_user.find({
    //   $or: [{ email: email }, { mobile: mobile }],
    // });

    // if (existemail.length > 0) {
    //   return res
    //     .status(401)
    //     .json({ message: "mobile number or email already register" });
    // }

    if (!passwordRegex.test(password)) {
      return res.status(400).json({
        message:
          "Your password must include at least one symbol and be 8 or more characters long",
      });
    }

    const createuser = await tbl_user.create({
      email,
      password,
      mobile,
      name,
    });

    res
      .status(201)
      .json({ user: createuser, message: "register successfully", status: 1 });
  } catch (err) {
    res.status(500).json({ message: "something went wrong", err: err.message });
    console.log(err.message);
  }
});

const loginUser = createAsyncError(async (req, res) => {
  const { email, password, mobile } = req.body;

  if (!password) {
    return res.status(401).json({ message: "please fill the form properly" });
  }
  try {
    const existuser = await tbl_user.findOne({
      $or: [{ email: email }, { mobile: mobile }],
    });

    if (!existuser) {
      return res.status(401).json({ message: "wrong email or password" });
    }

    const isPasswordMatched = await existuser.matchPassword(password);

    if (!isPasswordMatched) {
      return res.status(401).json({ message: "wrong email or password" });
    }

    const userid = existuser._id;

    const token = jwt.sign({ userid }, process.env.Token_Pass, {
      expiresIn: "30d",
    });

    const createtime = await tbl_user.updateOne(
      { email: existuser.email },
      { lastOnlineTime: currentTime.toISOString() },
      { new: true, runValidators: true, useFindAndModify: false }
    );

    res.status(201).json({
      createtime,
      token: token,
      message: "login successfully",
      status: 1,
    });
  } catch (err) {
    res.status(500).json({ message: "something went wrong", err: err.message });
  }
});

const uploadProduct = createAsyncError(async (req, res) => {
  const { title, description } = req.body;
  try {
    const createpro = await tbl_product.create({
      title,
      description,
      imagePath: req.file.path,
      postedBy: req.userInfo._id,
    });
    res.status(201).json({ message: createpro });
  } catch (err) {
    res.status(500).json({ message: "something went wrong", err: err.message });
  }
});
const getProduct = createAsyncError(async (req, res) => {
  try {
    const getuser = await tbl_user.findById({ _id: req.userInfo._id });

    if (!getuser) {
      return res.status(401).json({ message: "user not found" });
    }

    const getpro = await tbl_product.find({ postedBy: getuser._id });

    const getall = await Promise.all(
      getpro.map(async (e) => {
        const resp = {
          title: e.title,
          productId: e._id,
          postedBy: e.postedBy,
          description: e.description,
          imagePath: e.imagePath,
        };
        return resp;
      })
    );

    res.status(200).json({ getall: getall });
  } catch (err) {
    res.status(500).json({ message: "something went wrong", err: err.message });
  }
});

cron.schedule("*/30 * * * * *", async () => {
  try {
    const fiveDaysAgo = new Date(Date.now() - 5 * 24 * 60 * 60 * 1000);

    // const inactiveUsers = await tbl_user.find({
    //   lastOnlineTime: { $lt: fiveDaysAgo },
    // });
    const inactiveUsers = await tbl_user.find({});
    await sendEmail(inactiveUsers);
  } catch (error) {
    console.error("Error triggering inactive user notifications:", error);
  }
});
const sendEmail = async (option) => {
  let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,

    auth: {
      user: "sinhathailesh@gmail.com",
      pass: "jqvdilpoqyclznny",
    },
  });

  const allList = await Promise.all(
    option.map(async (e) => {
      const mailOptions = {
        from: "sinhathailesh@gmail.com",
        to: e.email,
        subject: "this mail for make fun",
        text: `check you mail ${e.name}`,
      };
      await transporter.sendMail(mailOptions);
    })
  );
};
export { createUser, loginUser, uploadProduct, getProduct };

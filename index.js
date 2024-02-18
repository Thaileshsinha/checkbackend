// import express from "express";
// import bodyParser from "body-parser";
// import mongoose from "mongoose";
// import cors from "cors";
// import dotenv from "dotenv";

// /* CONFIGURATION */
// dotenv.config();
// const app = express();
// app.use(express.json());
// app.use(bodyParser.urlencoded({ extended: false }));
// app.use(cors());

// /* MONGOOSE SETUP */
// const PORT = process.env.PORT || 5000;
// mongoose
//   .connect(
//     "mongodb+srv://user:shubhammahbuhs@cluster0.avo1rdr.mongodb.net/practice?retryWrites=true&w=majority"
//     // {
//     //   useNewUrlParser: true,
//     //   useUnifiedTopology: true,
//     // }
//   )
//   .then(() => {
//     app.listen(PORT, () => console.log(`Server Port: ${PORT}`));
//   })
//   .catch((error) => console.log(`${error} did not connect`));

import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();
import app from "./app.js";

const port = 5000;
const data =
  "mongodb+srv://user:shubhammahbuhs@cluster0.avo1rdr.mongodb.net/practice?retryWrites=true&w=majority";

app.get("/", (req, res) => {
  res.json("shubham sinha");
});

const currentTime = new Date();

mongoose
  .connect(data, {})
  .then(() => {
    console.log("connected with database");
  })
  .catch((err) => {
    console.log("err hai");
  });

app.listen(port, () => {
  console.log(`app listening on port ${port}`);
});

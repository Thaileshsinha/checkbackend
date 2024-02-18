import express from "express";
// import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import cors from "cors";
import user from "./routes/rt_user.js";

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use("*", cors({ origin: true, credentials: true }));

app.use(express.json());
// app.use(cookieParser());

app.use("/user", user);

export default app;

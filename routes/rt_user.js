import express from "express";
import {
  createUser,
  loginUser,
  uploadProduct,
  getProduct,
  getOneProduct,
} from "../controller/ct_user.js";
import { isAuthenticatedUser } from "../middleware/auth.js";
import multer from "multer";
const router = express.Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});
const upload = multer({ storage: storage });

router.route("/createuser").post(createUser);
router.route("/loginUser").post(loginUser);
router
  .route("/uploadproduct")
  .post(isAuthenticatedUser, upload.single("image"), uploadProduct);
// router.route("/getproduct").post(getProduct);
router.route("/getproduct").post(isAuthenticatedUser, getProduct);
router.route("/getoneproduct").post(isAuthenticatedUser, getOneProduct);

export default router;

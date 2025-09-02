const express = require("express");
const router = express.Router();
const {
  createUser,
  getAllUsers,
  getUserById,
  updateUserPutMethod,
  updateUserPatchMethod,
  deleteUser,
} = require("../controllers/users");
const {
  createUserSchema,
  updateUserPutSchema,
  updateUserSchema,
} = require("../utilts/validarion/user");
const validate = require("../middlewares/validate");
const{
    uploadLocal,
    uploadCDN
}= require('../middlewares/multer-upload');
const uploadImageKit = require("../middlewares/uplaodImageKit");




router.post(
  "/",
  uploadCDN.single('images'),
  uploadImageKit(false),
  validate(createUserSchema),
  createUser
);
router.get("/", getAllUsers);
router.get("/:id", getUserById);
router.put("/:id", validate(updateUserPutSchema), updateUserPutMethod);
router.patch("/:id", validate(updateUserSchema), updateUserPatchMethod);
router.delete("/:id", deleteUser);

module.exports = router;

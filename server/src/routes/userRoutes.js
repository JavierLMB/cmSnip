import express from "express";
import * as userController from "./../controllers/userController.js";
import * as authController from "./../controllers/authController.js";

const router = express.Router();

router.post("/signup", authController.signup);
router.post("/login", authController.login);
router.post("/forgotPassword", authController.forgotPassword);
router.patch("/resetPassword/:token", authController.resetPassword);

router.get("/verifyToken", authController.verifyToken);
router.get("/logout", authController.logout);

// Protect all routes after this middleware as middleware runs in sequence.
router.use(authController.protect);

router.patch("/updateMyPassword", authController.updatePassword);

router.get("/me", userController.getMe);
router.patch("/updateMe", userController.updateMe);
router.delete("/deleteMe", userController.deleteMe);

router.route("/").get(userController.getAllUsers);

// Restrict all routes after this middleware to admin only.
router.use(authController.restrictTo("admin"));

router
  .route("/:id")
  .get(userController.getUser)
  .patch(userController.updateUser)
  .delete(userController.deleteUser);

export default router;

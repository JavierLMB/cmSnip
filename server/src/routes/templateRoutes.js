import express from "express";
import * as templateController from "./../controllers/templateController.js";
import * as authController from "./../controllers/authController.js";

const router = express.Router();

router.use(authController.protect);

router.route("/").get(templateController.getAllTemplates);

// Restrict all routes after this middleware to editor and admin only.
router.use(authController.restrictTo("editor", "admin"));

router.route("/create").post(templateController.createTemplate);

router
  .route("/:id")
  .get(templateController.getTemplate)
  .patch(templateController.updateTemplate)
  .delete(templateController.deleteTemplate);

export default router;

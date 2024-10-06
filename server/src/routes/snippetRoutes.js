import express from "express";
import * as snippetController from "./../controllers/snippetController.js";
import * as authController from "./../controllers/authController.js";

const router = express.Router();

router.use(authController.protect);

router.route("/").get(snippetController.getAllSnippets);

// Restrict all routes after this middleware to editor and admin only.
router.use(authController.restrictTo("editor", "admin"));

router.route("/create").post(snippetController.createSnippet);

router
  .route("/:id")
  .get(snippetController.getSnippet)
  .patch(snippetController.updateSnippet)
  .delete(snippetController.deleteSnippet);

export default router;

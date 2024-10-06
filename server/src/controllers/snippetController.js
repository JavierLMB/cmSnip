import Snippet from "../models/snippetModel.js";
import catchAsync from "../utils/catchAsync.js";
import AppError from "../utils/appError.js";
import * as factory from "./handlerFactory.js";

// Factory-based controller actions
export const getSnippet = factory.getOne(Snippet);
export const getAllSnippets = factory.getAll(Snippet);
export const deleteSnippet = factory.deleteOne(Snippet);

export const updateSnippet = catchAsync(async (req, res, next) => {
  req.body.contentUpdatedBy = req.user.email;
  req.body.contentUpdatedAt = new Date().toLocaleString("en-GB", {
    dateStyle: "short",
    timeStyle: "medium",
  });
  factory.updateOne(Snippet)(req, res, next);
});

export const createSnippet = catchAsync(async (req, res, next) => {
  req.body.contentCreatedBy = req.user.email;
  factory.createOne(Snippet)(req, res, next);
});

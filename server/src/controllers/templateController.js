import Template from "../models/templateModel.js";
import catchAsync from "../utils/catchAsync.js";
import AppError from "../utils/appError.js";
import * as factory from "./handlerFactory.js";

// Factory-based controller actions
export const getTemplate = factory.getOne(Template);
export const getAllTemplates = factory.getAll(Template);
export const deleteTemplate = factory.deleteOne(Template);

export const updateTemplate = catchAsync(async (req, res, next) => {
  req.body.contentUpdatedBy = req.user.email;
  req.body.contentUpdatedAt = new Date().toLocaleString("en-GB", {
    dateStyle: "short",
    timeStyle: "medium",
  });
  factory.updateOne(Template)(req, res, next);
});

export const createTemplate = catchAsync(async (req, res, next) => {
  req.body.contentCreatedBy = req.user.email;
  factory.createOne(Template)(req, res, next);
});

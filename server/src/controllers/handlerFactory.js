import catchAsync from "../utils/catchAsync.js";
import AppError from "../utils/appError.js";
import APIFeatures from "../utils/apiFeatures.js";

// DeleteOne function
export const deleteOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndDelete(req.params.id);

    if (!doc) {
      return next(new AppError(`No ${Model.modelName.toLowerCase()} found with that ID`, 404));
    }

    res.status(204).send({
      status: "success",
      data: null,
    });
  });

// UpdateOne function
export const updateOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!doc) {
      return next(new AppError(`No ${Model.modelName.toLowerCase()} found with that ID`, 404));
    }

    res.status(200).send({
      status: "success",
      data: {
        [Model.modelName.toLowerCase()]: doc,
      },
    });
  });

// CreateOne function
export const createOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.create(req.body);

    res.status(201).json({
      status: "success",
      data: {
        [Model.modelName.toLowerCase()]: doc,
      },
    });
  });

// GetOne function
export const getOne = (Model, popOptions) =>
  catchAsync(async (req, res, next) => {
    const query = Model.findById(req.params.id);
    if (popOptions) query.populate(popOptions);
    const doc = await query;

    if (!doc) {
      return next(new AppError(`No ${Model.modelName.toLowerCase()} found with that ID`, 404));
    }

    res.status(200).json({
      status: "success",
      data: {
        [Model.modelName.toLowerCase()]: doc,
      },
    });
  });

// GetAll function
export const getAll = (Model) =>
  catchAsync(async (req, res, next) => {
    const totalCount = await Model.countDocuments();
    const features = new APIFeatures(Model.find(), req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();
    const doc = await features.query;

    if (!doc) {
      return next(new AppError(`No ${Model.modelName.toLowerCase()} found..`, 404));
    }

    res.status(200).json({
      status: "success",
      results: doc.length,
      totalCount,
      data: {
        [Model.modelName.toLowerCase()]: doc,
        results: doc.length,
        totalCount,
      },
    });
  });

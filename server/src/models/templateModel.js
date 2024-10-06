import mongoose from "mongoose";

const templateSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please provide a name for the template"],
  },
  content: {
    type: String,
    required: [true, "Please provide the template content"],
  },
  contentCreatedBy: {
    type: String,
  },
  contentUpdatedBy: {
    type: String,
    default: "No Changes",
  },
  contentCreatedAt: {
    type: String,
    default: new Date().toLocaleString("en-GB", { dateStyle: "short", timeStyle: "medium" }),
  },
  contentUpdatedAt: {
    type: String,
    default: "No Changes",
  },
  active: {
    type: Boolean,
    default: true,
  },
});

const Template = mongoose.model("Template", templateSchema);

export default Template;

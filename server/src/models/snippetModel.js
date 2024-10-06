import mongoose from "mongoose";

const snippetSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please provide a name for the snippet"],
  },
  content: {
    type: String,
    required: [true, "Please provide the snippet content"],
  },
  fields: {
    type: Object,
  },
  templateID: {
    type: String,
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

const Snippet = mongoose.model("Snippet", snippetSchema);

export default Snippet;

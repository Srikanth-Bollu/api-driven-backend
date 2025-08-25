import mongoose from "mongoose";

const resultSchema = new mongoose.Schema({
  keyword: String,
  results: [
    {
      name: String,
      url: String,
      description: String
    }
  ],
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("Result", resultSchema);

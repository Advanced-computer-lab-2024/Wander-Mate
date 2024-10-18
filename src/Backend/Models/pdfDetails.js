const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const pdfSchema = new Schema(
  {
    Title: {
      type: String,
      required: true,
    },
    pdf: {
      type: String,
      required: true,
    },
    Owner: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      refPath: "ownerModel", // Dynamic reference based on the 'ownerModel' field
    },
    ownerModel: {
      type: String,
      required: true, // This will contain the model name
      enum: ["TourGuide", "Advertiser", "Seller"], // Limit to valid model names
    },
  },
  { timestamps: true, strict: false }
);

const PdfDetails = mongoose.model("PdfDetails", pdfSchema);
module.exports = PdfDetails;

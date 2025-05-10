// models/InvestorResponse.js
import mongoose from "mongoose";

const InvestorResponseSchema = new mongoose.Schema({
  investorName: {
    type: String,
    required: true,
  },
  investorEmail: {
    type: String,
    required: true,
    lowercase: true,
  },
  
  startupName: {
    type: String,
    required: true,
  },
  liked: {
    type: Boolean,
    default: false,
  },
  invested: {
    type: Boolean,
    default: false,
  }
}, {
  timestamps: true
});

export default mongoose.models.InvestorResponse || mongoose.model("InvestorResponse", InvestorResponseSchema);

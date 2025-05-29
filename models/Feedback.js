import mongoose from "mongoose";

const FeedbackSchema = new mongoose.Schema({
  clarity: String,
  feasibility: String,
  uniqueness: String,
  improvementSuggestions: String,
  overallRating: String,
  investorName: String,       
  investorEmail: String,   
  startupName:String,   
  clientEmail:String,
  
});

export default mongoose.models.Feedback || mongoose.model("Feedback", FeedbackSchema);

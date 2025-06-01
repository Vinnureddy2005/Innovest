import mongoose from "mongoose";

const FeedbackSchema = new mongoose.Schema({
  clarity: String,
  feasibility: String,
  uniqueness: String,
  improvementSuggestions: String,
  overallRating: String,
  investorName: String,       
  investorEmail: String,   
  startupId:String,
  startupName:String,   
  clientEmail:String,
  date:String,
  Invphoto:String
  
});

export default mongoose.models.Feedback || mongoose.model("Feedback", FeedbackSchema);

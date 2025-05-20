import mongoose from 'mongoose';

const Invsetor_meetingSchema = new mongoose.Schema({
 
  startupName: {
    type: String,
    required: true,
  },
  meetingLink: {
    type: String,
    required: true,
  },
  startDateTime: {
    type: String, 
    required: true,
  },
  client_name: {
    type: String, 
    required: true,
  },
  client_mail: {
    type: String, 
    required: true,
  },
  investor_name: {
    type: String, 
    required: true,
  },

  linkedIn:{
    type:String
  },
  investor_email: {
    type: String, 
    required: true,
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Meeting = mongoose.models.Meeting || mongoose.model('Meeting', Invsetor_meetingSchema);

export default Meeting;

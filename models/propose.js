import mongoose from 'mongoose';

const proposeSchema = new mongoose.Schema({
  startupName: String,
  website: String,
  industry: String,
  stage: String,
  funding: String,
  file: {
    data: Buffer,
    contentType: String,
    name: String,
  },
  likes: {
    type: Number,
    default: 0,
  }, 
  client_mail:String ,
  clientName :String,
  photo: { type: String },
  invested: {type:Boolean}
}, { timestamps: true });

export default mongoose.models.Propose || mongoose.model('Propose', proposeSchema);
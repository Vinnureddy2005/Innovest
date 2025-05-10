import mongoose from 'mongoose';

const InvestorSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },
  phone: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },

  // Investment Profile
  companyName: {
    type: String,
    default: '',
  },
  linkedIn: {
    type: String,
    default: '',
  },
  investmentFocus: {
    type: String,
    enum: ['Early-Stage', 'Growth-Stage', 'Late-Stage'],
  },
  preferredIndustries: {
    type: [String], // e.g., ['Tech', 'Finance']
  },
  investmentSize: {
    type: String,
    enum: ['<$50k', '$50k-$500k', '$500k-$5M', '$5M+'],
  },
  pastInvestments: {
    type: String,
    default: '',
  },
  philosophy: {
    type: String,
    default: '',
  },

  // Membership
  membershipPlan:{
   type:String
   
  },

  photo: { type: String },
  validUpto:String,

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.models.Investor || mongoose.model('Investor', InvestorSchema);

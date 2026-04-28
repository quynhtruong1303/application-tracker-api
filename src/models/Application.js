import mongoose from "mongoose"

const applicationSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    company: { type: String, required: true },
    role: { type: String, required: true },
    jobURL: { type: String },
    status: { type: String, enum: ['Applied', 'Interviewing', 'Offered', 'Rejected'], default: 'Applied' },
    dateApplied: { type: Date, default: Date.now },
    followUpdate: { type: Date },
    recruiterContact: { type: String, default: 'N/A' },
    notes: { type: String }
}, { timestamps: true })

export default mongoose.model('Application', applicationSchema)
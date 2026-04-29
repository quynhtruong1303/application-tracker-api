import mongoose from "mongoose"

const companyNoteSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    companyName: { type: String, required: true },
    background: { type: String },
    interviewTips: { type: String },
    contacts: { type: String },
    generalNotes: { type: String }
}, { timestamps: true })

export default mongoose.model('CompanyNote', companyNoteSchema)

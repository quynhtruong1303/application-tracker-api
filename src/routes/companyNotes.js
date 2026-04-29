import express from "express"
import CompanyNote from "../models/CompanyNote.js"
import authenticateToken from "../middleware/auth.js"

const router = express.Router()

// GET all notes for the logged-in user
router.get('/', authenticateToken, async (req, res) => {
    try {
        const notes = await CompanyNote.find({ user: req.user.id }).sort({ updatedAt: -1 })
        res.json(notes)
    } catch (err) {
        res.status(500).json({ message: 'Server error' })
    }
})

// POST create a new note
router.post('/', authenticateToken, async (req, res) => {
    try {
        const { companyName, background, interviewTips, contacts, generalNotes } = req.body
        const note = await CompanyNote.create({
            user: req.user.id,
            companyName,
            background,
            interviewTips,
            contacts,
            generalNotes
        })
        res.status(201).json(note)
    } catch (err) {
        res.status(500).json({ message: 'Server error' })
    }
})

// PUT update a note
router.put('/:id', authenticateToken, async (req, res) => {
    try {
        const { companyName, background, interviewTips, contacts, generalNotes } = req.body
        const note = await CompanyNote.findOneAndUpdate(
            { _id: req.params.id, user: req.user.id },
            { companyName, background, interviewTips, contacts, generalNotes },
            { new: true }
        )
        if (!note) return res.status(404).json({ message: 'Note not found' })
        res.json(note)
    } catch (err) {
        res.status(500).json({ message: 'Server error' })
    }
})

// DELETE a note
router.delete('/:id', authenticateToken, async (req, res) => {
    try {
        const note = await CompanyNote.findOneAndDelete({ _id: req.params.id, user: req.user.id })
        if (!note) return res.status(404).json({ message: 'Note not found' })
        res.json({ message: 'Note deleted' })
    } catch (err) {
        res.status(500).json({ message: 'Server error' })
    }
})

export default router

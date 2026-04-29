import express from 'express'
import mongoose from 'mongoose'
import Application from '../models/Application.js'
import authenticateToken from '../middleware/auth.js'

const router = express.Router()

// GET /applications
// Get all applications for the authenticated user
router.get('/', authenticateToken, async (req, res) => {
    try {
        const applications = await Application.find({ user: req.user.id }).sort({ dateApplied: -1 })
        res.status(200).json(applications)
    } catch (err) {
        console.error(err)
        res.status(500).json({ message: 'Server error' })
    }
})

// POST /applications
// Add a new application for the authenticated user
router.post('/', authenticateToken, async (req, res) => {
    const { company, role, jobURL, status, dateApplied, followUpdate, recruiterContact, notes } = req.body

    try {
        const newApp = new Application({
            user: req.user.id,
            company: company,
            role: role,
            jobURL: jobURL,
            status: status,
            dateApplied: dateApplied,
            followUpdate: followUpdate,
            recruiterContact: recruiterContact,
            notes: notes
        })
        await newApp.save()
        res.status(201).json(newApp)
    } catch (err) {
        console.error(err)
        res.status(500).json({ message: 'Server error' })
    }
})

// GET /applications/stats
// Get application statistics for the authenticated user (e.g. count by status)
// Optional query param: ?year=2024 — filters by the year of dateApplied
router.get('/stats', authenticateToken, async (req, res) => {
    try {
        const { year } = req.query

        const match = { user: new mongoose.Types.ObjectId(req.user.id) }

        if (year) {
            const y = parseInt(year)
            match.dateApplied = {
                $gte: new Date(`${y}-01-01`),
                $lt: new Date(`${y + 1}-01-01`)
            }
        }

        const stats = await Application.aggregate([
            { $match: match },
            { $group: { _id: '$status', count: { $sum: 1 } } }
        ])
        res.status(200).json(stats)
    } catch (err) {
        console.error(err)
        res.status(500).json({ message: 'Server error' })
    }
})


// GET /applications/:id
// Get a specific application by ID (only if it belongs to the authenticated user)
router.get('/:id', authenticateToken, async (req, res) => {
    try {
        const app = await Application.findOne({ _id: req.params.id, user: req.user.id })
        if (!app) return res.status(404).json({message: 'Application not found' })
        
        res.status(200).json(app)
    } catch (err) {
        console.error(err)
        res.status(500).json({ message: 'Server error' })
    }
})

// PUT /applications/:id
// Update an application by ID (only if it belongs to the authenticated user)
router.put('/:id', authenticateToken, async (req, res) => {
    try {
        const app = await Application.findOne({ _id: req.params.id, user: req.user.id })
        if (!app) return res.status(404).json({ message: 'Application not found' })
        
        // Update fields
        const updated = await Application.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        )
        res.status(200).json(updated)
    } catch (err) {
        console.error(err)
        res.status(500).json({ message: 'Server error' })
    }
})

// DELETE /applications/:id
router.delete('/:id', authenticateToken, async (req, res) => {
    try {
        const app = await Application.findOne({ _id: req.params.id, user: req.user.id })
        if (!app) return res.status(404).json({ message: 'Application not found' })
        
        await Application.findByIdAndDelete(req.params.id)
        res.status(200).json({ message: 'Application deleted' })
    } catch (err) {
        console.error(err)
        res.status(500).json({ message: 'Server error' })
    }
})

export default router

import express from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import User from '../models/User.js'

const router = express.Router()

// POST /auth/register
router.post('/register', async (req, res) => {
    const { name, email, password } = req.body

    try {
        // Check if user already exists
        const existingUser = await User.findOne({ email })
        if (existingUser) return res.status(400).json({ message: 'Email already taken' })
        
        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10)

        // Create new user
        const newUser = new User({ name, email, password: hashedPassword })
        await newUser.save()

        // Generate JWT token
        const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, { expiresIn: '7d'})
        res.status(201).json({token})
    } catch (err) {
        console.error(err)
        res.status(500).json({ message: 'Server error' })
    }
})

// POST /auth/login
router.post('/login', async (req, res) => {
    const { email, password } = req.body

    try {
        // Find user by email
        const user = await User.findOne({ email })
        if (!user) return res.status(401).json({ message: 'Invalid email or password' })
        
        // Compare password
        const isMatch = await bcrypt.compare(password, user.password)
        if (!isMatch) return res.status(401).json({ message: 'Invalid email or password' })

        // Generate JWT token
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' })
        res.status(200).json({ token })
    } catch (err) {
        console.error(err)
        res.status(500).json({ message: 'Server error' })
    }
})

export default router
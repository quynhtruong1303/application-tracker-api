import 'dotenv/config'
import express from 'express'
import mongoose from 'mongoose'
import cors from 'cors'
import authRoutes from './routes/auth.js'
import applicationRoutes from './routes/applications.js'
import companyNoteRoutes from './routes/companyNotes.js'

const app = express()
app.use(cors())
app.use(express.json())

app.use('/auth', authRoutes)
app.use('/applications', applicationRoutes)
app.use('/company-notes', companyNoteRoutes)

mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log('Connected to MongoDB')
        app.listen(process.env.PORT || 3000, () => {
            console.log(`Server running on port ${process.env.PORT || 3000}`)
        })
    })
    .catch(err => console.error(err))
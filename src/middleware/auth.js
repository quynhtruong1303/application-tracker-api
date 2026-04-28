import jwt from 'jsonwebtoken'

const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization']
    // the header format is Bearer <token>, so we split on the space
    const token = authHeader && authHeader.split(' ')[1]

    if (!token) return res.status(401).json({ message: 'No token provided' })

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) return res.status(401).json({ message: 'Invalid token.' })
        req.user = decoded
        next()
    })
}

export default authenticateToken
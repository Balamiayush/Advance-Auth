import jwt from 'jsonwebtoken'
import cookieparser from 'cookie-parser'

export  const verifyToken= (req, res, next) =>{
    const token = jwt.cookies.token
    if(!token){
        return res.status(401).json({message: 'No token, authorization denied'})
    }
    try {
        const decoded = jwt.verify(token,process.env.JWT_SECRET)
        if(!decoded) return res.status(401).json({
            message: 'Token is expired'

        })
        req.userId - decoded.userId
        next()
    } catch (error) {
        return res.status(403).json({message: 'Token is invalid'})
    }

}
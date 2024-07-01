const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || ".sZz=x9OfY`2o4X";

function verifyTokens(req, res, next) {
    const token = req.headers.token;
    if (!token) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.userData = decoded;
        next();
    } catch (error) {
        return res.status(401).json({ message: 'Invalid token' });
    }
}
// the user only can update his information and the admin so can
// the user only can get his information and the admin so can
function verifyTokensAndAuthorization(req, res, next) {
    verifyTokens(req, res, (err) => {
        if (err) {
            return res.status(401).json({ message: 'Invalid token' });
        }

        if (req.userData._id === req.params.id || req.userData.isAdmin) {
            return next();
        } else {
            return res.status(403).json({ message: 'You are not allowed to update this user, you can only update your account' });
        }
    });
}
//admin only can get All Users
function verifyTokensAndAdmin(req, res, next) {
    verifyTokens(req, res, (err) => {
        if (err) {
            return res.status(401).json({ message: 'Invalid token' });
        }

        if (req.userData.isAdmin) {
            return next();
        } else {
            console.log(req.userData); // سجل بيانات المستخدم لأغراض تصحيح الأخطاء
            return res.status(403).json({ message: 'You are not allowed, only admin is allowed' });
        }
    });
}

module.exports = { verifyTokens, verifyTokensAndAuthorization, verifyTokensAndAdmin };

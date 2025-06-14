import jwt from 'jsonwebtoken';

const userAuth = (req, res, next) => {
  try {
    // 1) Extract token from 'token' header or Authorization Bearer
    let token = req.headers.token;
    if (!token && req.headers.authorization) {
      const [scheme, t] = req.headers.authorization.split(' ');
      if (scheme === 'Bearer' && t) {
        token = t;
      }
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "No token provided. Please login again.",
      });
    }

    // 2) Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded?.userId) {
      return res.status(401).json({
        success: false,
        message: "Invalid token. Login again.",
      });
    }

    // 3) Attach user ID to request
    req.user = { userId: decoded.userId };
    next();

  } catch (error) {
    console.error('Auth middleware error:', error);
    const msg = error.name === 'TokenExpiredError'
      ? 'Token expired. Please login again.'
      : 'Invalid token. Please login again.';
    return res.status(401).json({ success: false, message: msg });
  }
};

export default userAuth;




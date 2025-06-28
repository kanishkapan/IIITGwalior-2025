import jwt from "jsonwebtoken";

export const authMiddleware = (roles = []) => (req, res, next) => {
  console.log("Cookies:", req.cookies);
  try {
    const token = req.cookies.jwt;
    if (!token) return res.status(401).json({ message: "Unauthorized" });

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) return res.status(403).json({ message: "Forbidden" });

      req.user = decoded;
      if (roles.length && !roles.includes(req.user.role)) {
        return res.status(403).json({ message: "Access Denied" });
      }
      next();
    });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};

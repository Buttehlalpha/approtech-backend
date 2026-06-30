import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];

      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET
      );

      console.log("Decoded token:", decoded); // Debug log

      // ✅ FIX: Check both 'id' and 'userId' in the decoded token
      const userId = decoded.id || decoded.userId || decoded._id;
      
      if (!userId) {
        return res.status(401).json({
          success: false,
          message: "Invalid token: No user ID found",
        });
      }

      const user = await User.findById(userId).select("-password");
      
      if (!user) {
        return res.status(401).json({
          success: false,
          message: "User not found",
        });
      }

      // ✅ Set both req.user and req.userId for compatibility
      req.user = user;
      req.userId = userId;

      next();

    } catch (error) {
      console.error("Auth error:", error);
      return res.status(401).json({
        success: false,
        message: "Not authorized",
      });
    }
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "No token provided",
    });
  }
};
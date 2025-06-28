import { Notification } from "../models/index.js";
export const getUserNotifications = async (req, res) => {
    try {
      const userId = req.user.id;
      const notifications = await Notification.find({ recipientId: userId }).sort({ createdAt: -1 });
  
      res.status(200).json({ success: true, notifications });
      console.log("....fetched data.... ");
    } catch (error) {
        console.log("error in fetching , notifications ")
      res.status(500).json({ success: false, message: "Server error" });
    }
  };
  
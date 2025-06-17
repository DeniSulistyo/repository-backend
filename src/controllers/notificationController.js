const prisma = require("../db/prisma");

exports.getNotifications = async (req, res) => {
  try {
    const notifications = await prisma.notification.findMany();
    res
      .status(200)
      .json({ message: "Notifications found", data: notifications });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching notifications." });
  }
};

exports.deleteNotifications = async (req, res) => {
  try {
    const notifications = await prisma.notification.deleteMany();
    res
      .status(200)
      .json({ message: "Notifications deleted", data: notifications });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error deleting notifications." });
  }
};

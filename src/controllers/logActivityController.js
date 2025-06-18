const prisma = require("../db/prisma");

exports.getAllActivityLog = async (req, res) => {
  try {
    const activityLogs = await prisma.activityLog.findMany({
      include: {
        user: {
          select: {
            id: true,
            name: true,
            username: true,
            role: true,
          },
        },
        programStudi: {
          select: {
            id: true,
            name: true,
          },
        },
        document: {
          select: {
            id: true,
            title: true,
          },
        },
      },
    });
    res
      .status(200)
      .json({ message: "Activity logs found", data: activityLogs });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error fetching activity logs." });
  }
};

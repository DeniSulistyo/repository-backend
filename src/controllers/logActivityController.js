const prisma = require("../db/prisma");

exports.getAllActivityLog = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const activityLogs = await prisma.activityLog.findMany({
      skip,
      take: limit,
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

    const total = await prisma.activityLog.count();
    res.status(200).json({
      message: "Activity logs found",
      data: activityLogs,
      meta: { page, total, lastPage: Math.ceil(total / page) },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error fetching activity logs." });
  }
};

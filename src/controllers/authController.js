const prisma = require("../db/prisma");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET || "secretkey";

exports.login = async (req, res) => {
  const { username, password } = req.body;
  const user = await prisma.user.findUnique({
    where: { username },
    include: { programStudi: true },
  });
  if (!user) return res.status(401).json({ message: "Invalid credentials" });

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.status(401).json({ message: "Invalid credentials" });

  const token = jwt.sign(
    {
      id: user.id,
      role: user.role,
      username: user.username,
      name: user.name,
      programStudiId: user.programStudiId,
    },
    JWT_SECRET,
    { expiresIn: "1d" }
  );

  const log = await prisma.activityLog.create({
    data: {
      userId: user.id,
      programStudiId:
        user.role === "ADMINISTRATOR" ? null : user.programStudiId,
      documentId: null,
      activity: "Login Sistem",
    },
    include: {
      user: {
        select: { id: true, name: true, role: true },
      },
      programStudi: {
        select: { id: true, name: true },
      },
    },
  });

  res.json({
    token,
    user: {
      id: user.id,
      name: user.name,
      username: user.username,
      role: user.role,
    },
    programStudi: user.programStudi,
    log,
  });
};

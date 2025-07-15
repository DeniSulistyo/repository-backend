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
    { expiresIn: "1h" }
  );

  const refreshToken = jwt.sign(
    { id: user.id, role: user.role },
    process.env.REFRESH_TOKEN_SECRET || "refreshsecret",
    { expiresIn: "7d" }
  );

  // Simpan refreshToken di cookie (atau kirimkan langsung — tergantung cara penyimpananmu)
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "Strict",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 hari
  });

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
    refreshToken,
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

exports.refreshToken = async (req, res) => {
  const refreshToken = req.cookies.refreshToken;

  if (!refreshToken) {
    return res.status(401).json({ message: "Refresh token tidak ditemukan" });
  }

  jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET || "refreshsecret", async (err, userData) => {
    if (err) {
      return res.status(403).json({ message: "Refresh token tidak valid" });
    }

    const user = await prisma.user.findUnique({ where: { id: userData.id } });

    if (!user) {
      return res.status(404).json({ message: "User tidak ditemukan" });
    }

    const newAccessToken = jwt.sign(
      {
        id: user.id,
        role: user.role,
        username: user.username,
        name: user.name,
        programStudiId: user.programStudiId,
      },
      process.env.JWT_SECRET || "secretkey",
      { expiresIn: "1d" }
    );

    res.json({ token: newAccessToken });
  });
};


const prisma = require("../db/prisma");

exports.getAllProgramStudi = async (req, res) => {
  try {
    const programStudi = await prisma.programStudi.findMany();
    res
      .status(200)
      .json({
        message: "Data program studi berhasil diambil.",
        data: programStudi,
      });
  } catch (error) {
    res.status(500).json({ message: "Error mengambil data program studi." });
  }
}

exports.getProgramStudiById = async(req, res) => {
  try {
    const programStudi = await prisma.programStudi.findUnique({
      where: { id: Number(req.params.id) },
    });
    res
      .status(200)
      .json({
        message: "Data program studi berhasil diambil.",
        data: programStudi,
      });
  } catch (error) {
    res.status(500).json({ message: "Error mengambil data program studi." });
  }
}

exports.getProgramStudiById = async(req, res) => {
  try {
    const programStudi = await prisma.programStudi.findUnique({
      where: { id: Number(req.params.id) },
    });
    res
      .status(200)
      .json({
        message: "Data program studi berhasil diambil.",
        data: programStudi,
      });
  } catch (error) {
    res.status(500).json({ message: "Error mengambil data program studi." });
  }
}
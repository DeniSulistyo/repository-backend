const prisma = require("../db/prisma");
const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const path = require("path");
const cloudinary = require("../config/cloudinary");

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "repository_dokumen",
    resource_type: "raw", // WAJIB untuk PDF, DOCX, dll.
    public_id: (req, file) => {
      const originalName = path.parse(file.originalname).name;
      const ext = path.extname(file.originalname);
      const timestamp = Date.now();
      return `${originalName}${ext}`; // Beri nama + ekstensi
    },
  },
});

// Setup multer storage
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, './uploads'); // pastikan folder ini ada
//   },
//   filename: (req, file, cb) => {
//     const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
//     cb(null, uniqueSuffix + path.extname(file.originalname));
//   },
// });

exports.upload = multer({ storage });

// POST /documents (upload dokumen local storage)
// exports.createDocument = async (req, res) => {
//   try {
//     const { chapterId, title, description, subSubChapterId } = req.body;

//     if (!req.file) {
//       return res.status(400).json({ message: "File harus diupload" });
//     }

//     const filePath = `/uploads/${req.file.filename}`;
//     const uploadedById = req.user.id;

//     const document = await prisma.document.create({
//       data: {
//         chapterId: parseInt(chapterId),
//         title,
//         description,
//         subSubChapterId: subSubChapterId ? parseInt(subSubChapterId) : null,
//         filePath,
//         uploadedById,
//       },
//     });

//     res.status(201).json({ message: "Dokumen berhasil diupload", document });
//   } catch (error) {
//     console.error(error);
//     res
//       .status(500)
//       .json({ message: "Gagal upload dokumen", error: error.message });
//   }
// };

// POST /documents (upload dokumen cloudinary storage)
// POST /documents (upload dokumen)
exports.createDocument = async (req, res) => {
  try {
    const { chapterId, title, description, subSubChapterId } = req.body;

    if (!req.file || !req.file.path) {
      return res.status(400).json({ message: "File harus diupload" });
    }

    const fileUrl = req.file.path; // Cloudinary URL
    const cloudinaryId = req.file.filename;
    const uploadedById = req.user.id;

    const document = await prisma.document.create({
      data: {
        chapterId: parseInt(chapterId),
        title,
        description,
        subSubChapterId: subSubChapterId ? parseInt(subSubChapterId) : null,
        filePath: fileUrl,
        cloudinaryId,
        uploadedById,
      },
    });

    res.status(201).json({ message: "Dokumen berhasil diupload", document });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Gagal upload dokumen", error: error.message });
  }
};

// GET /documents (list semua dokumen)
exports.getDocuments = async (req, res) => {
  try {
    const documents = await prisma.document.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        uploadedBy: { select: { id: true, name: true, username: true } },
        validator: { select: { id: true, name: true, username: true } }, // ✅ yang benar
        chapter: { select: { id: true, title: true } },
        SubSubChapter: { select: { id: true, title: true } },
      },
    });
    res.json(documents);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Gagal mengambil dokumen", error: error.message });
  }
};

// GET /documents/subchapter/:id (list dokumen berdasar subchapter)
exports.getDocumentsBySubChapter = async (req, res) => {
  const subChapterId = Number(req.params.id);
  try {
    const documents = await prisma.document.findMany({
      where: { subChapterId },
      orderBy: { createdAt: "desc" },
      include: {
        uploadedBy: { select: { id: true, name: true, username: true } },
        validator: { select: { id: true, name: true, username: true } }, // ✅
        chapter: { select: { id: true, title: true } },
        SubSubChapter: { select: { id: true, title: true } },
      },
    });
    res.json(documents);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Gagal mengambil dokumen", error: error.message });
  }
};

// PATCH /documents/:id/status (validasi dokumen)
exports.validateDocument = async (req, res) => {
  try {
    const id = Number(req.params.id);
    const { status } = req.body;

    if (!["VALID", "PENDING", "DITOLAK"].includes(status)) {
      return res.status(400).json({ message: "Status tidak valid" });
    }

    if (req.user.role !== "VALIDATOR" && req.user.role !== "ADMINISTRATOR") {
      return res
        .status(403)
        .json({ message: "Hanya Validator yang bisa validasi dokumen" });
    }

    const validatedBy = req.user.id;

    const updated = await prisma.document.update({
      where: { id },
      data: { status, validatedBy },
    });

    const notification = await prisma.notification.create({
      data: {
        title: `Dokumen ${updated.title} telah divalidasi`,
        message: `Dokumen ${updated.title} telah divalidasi oleh ${req.user.name}.`,
        userId: updated.uploadedById,
      },
    });

    res.json({
      message: "Status dokumen berhasil divalidasi",
      document: updated,
      notification,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Gagal update status dokumen", error: error.message });
  }
};

// GET /documents/:id (preview dokumen)
exports.getDocumentById = async (req, res) => {
  try {
    const id = Number(req.params.id);
    const document = await prisma.document.findUnique({
      where: { id },
      include: {
        uploadedBy: { select: { id: true, name: true, username: true } },
        validator: { select: { id: true, name: true, username: true } }, // ✅
        chapter: { select: { id: true, title: true } },
        SubSubChapter: { select: { id: true, title: true } },
      },
    });
    if (!document)
      return res.status(404).json({ message: "Dokumen tidak ditemukan" });
    res.json(document);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Gagal mengambil dokumen", error: error.message });
  }
};

// PUT /documents/:id (edit metadata dokumen)

exports.updateDocument = async (req, res) => {
  try {
    const id = Number(req.params.id);
    const { title, description } = req.body;

    // Ambil dokumen lama
    const existingDoc = await prisma.document.findUnique({ where: { id } });
    if (!existingDoc) {
      return res.status(404).json({ message: "Dokumen tidak ditemukan" });
    }

    let updatedData = {
      title,
      description,
    };

    // Kalau user upload file baru
    if (req.file && req.file.path) {
      // Hapus file lama dari Cloudinary jika ada
      if (existingDoc.cloudinaryId) {
        await cloudinary.uploader.destroy(existingDoc.cloudinaryId, {
          resource_type: "raw", // karena file bukan image
        });
      }

      // Simpan file baru ke data update
      updatedData.filePath = req.file.path;
      updatedData.cloudinaryId = req.file.filename;
    }

    // Update dokumen
    const updated = await prisma.document.update({
      where: { id },
      data: updatedData,
    });

    res.json({
      message: "Dokumen berhasil diperbarui",
      document: updated,
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Gagal update dokumen", error: error.message });
  }
};

// DELETE /documents/:id ( local storage)
// exports.deleteDocument = async (req, res) => {
//   try {
//     const id = Number(req.params.id);
//     await prisma.document.delete({ where: { id } });
//     res.json({ message: "Dokumen berhasil dihapus" });
//   } catch (error) {
//     res
//       .status(500)
//       .json({ message: "Gagal hapus dokumen", error: error.message });
//   }
// };

// DELETE /documents/:id (Cloudinary)

exports.deleteDocument = async (req, res) => {
  try {
    const id = Number(req.params.id);

    // Ambil dokumen dari DB
    const document = await prisma.document.findUnique({ where: { id } });
    if (!document) {
      return res.status(404).json({ message: "Dokumen tidak ditemukan" });
    }

    // Hapus dari Cloudinary jika ada cloudinaryId
    if (document.cloudinaryId) {
      await cloudinary.uploader.destroy(document.cloudinaryId, {
        resource_type: "raw", // karena dokumen .pdf
      });
    }

    // Hapus dari database
    await prisma.document.delete({ where: { id } });

    res.json({
      message: "Dokumen berhasil dihapus (termasuk dari Cloudinary)",
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Gagal hapus dokumen", error: error.message });
  }
};

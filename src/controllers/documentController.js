const prisma = require("../db/prisma");
const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const path = require("path");
const cloudinary = require("../config/cloudinary");
const { v4: uuidv4 } = require("uuid");
const slugify = require("../utils/slugify");

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "repository_dokumen",
    resource_type: "raw", // WAJIB untuk PDF, DOCX, dll.
    public_id: (req, file) => {
      const originalName = path.parse(file.originalname).name;
      const ext = path.extname(file.originalname);
      return `${originalName}${ext}`; // Nama + ekstensi
    },
  },
});

exports.upload = multer({ storage });

// POST /documents
exports.createDocument = async (req, res) => {
  try {
    const { chapterId, subChapterId, subSubChapterId, title, description } =
      req.body;

    // Validasi minimal salah satu ID struktur bab terisi
    if (!chapterId && !subChapterId && !subSubChapterId) {
      return res.status(400).json({
        message:
          "Minimal salah satu dari chapterId, subChapterId, atau subSubChapterId harus diisi",
      });
    }

    // Validasi urutan struktur jika subChapterId atau subSubChapterId digunakan
    if (subSubChapterId && !subChapterId) {
      return res
        .status(400)
        .json({ message: "subSubChapterId membutuhkan subChapterId" });
    }
    if (subChapterId && !chapterId) {
      return res
        .status(400)
        .json({ message: "subChapterId membutuhkan chapterId" });
    }

    // Validasi file upload
    if (!req.file || !req.file.path) {
      return res.status(400).json({ message: "File harus diupload" });
    }

    const fileUrl = req.file.path;
    const slug = slugify(title);
    const cloudinaryId = req.file.filename;
    const uploadedById = req.user.id;

    const existing = await prisma.document.findFirst({ where: { slug } });
    if (existing) {
      return res.status(400).json({
        message: "Judul dokumen sudah digunakan, silakan ubah judul.",
      });
    }

    const document = await prisma.document.create({
      data: {
        chapterId: chapterId ? parseInt(chapterId) : null,
        subChapterId: subChapterId ? parseInt(subChapterId) : null,
        subSubChapterId: subSubChapterId ? parseInt(subSubChapterId) : null,
        slug,
        title,
        description,
        filePath: fileUrl,
        cloudinaryId,
        uploadedById,
      },
    });

    res.status(201).json({ message: "Dokumen berhasil diupload", document });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ message: "Gagal upload dokumen", error: error.message });
  }
};

// GET /documents
exports.getDocuments = async (req, res) => {
  try {
    const documents = await prisma.document.findMany({
      where: { isDeleted: false },
      orderBy: { createdAt: "desc" },
      include: {
        uploadedBy: { select: { id: true, name: true, username: true } },
        validator: { select: { id: true, name: true, username: true } },
        chapter: { select: { id: true, title: true } },
        subChapter: { select: { id: true, title: true } },
        subSubChapter: { select: { id: true, title: true } },
      },
    });

    const totalDocument = await prisma.document.count({
      where: { isDeleted: false },
    });

    const totalRejectedDocument = await prisma.document.count({
      where: { isDeleted: false, status: "DITOLAK" },
    });

    const totalValidDocument = await prisma.document.count({
      where: { isDeleted: false, status: "VALID" },
    });

    res.json({
      documents,
      totalDocument,
      totalRejectedDocument,
      totalValidDocument,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Gagal mengambil dokumen", error: error.message });
  }
};

// GET /documents/subchapter/:id
exports.getDocumentsBySubChapter = async (req, res) => {
  const subChapterId = Number(req.params.id);
  try {
    const documents = await prisma.document.findMany({
      where: {
        subChapterId,
        isDeleted: false,
      },
      orderBy: { createdAt: "desc" },
      include: {
        uploadedBy: { select: { id: true, name: true, username: true } },
        validator: { select: { id: true, name: true, username: true } },
        chapter: { select: { id: true, title: true } },
        subSubChapter: { select: { id: true, title: true } },
      },
    });
    res.json(documents);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Gagal mengambil dokumen", error: error.message });
  }
};

exports.getAllDocumentRejected = async (req, res) => {
  try {
    const document = await prisma.document.findMany({
      where: {
        isDeleted: false,
        status: "DITOLAK",
      },
      orderBy: { createdAt: "desc" },
      include: {
        uploadedBy: { select: { id: true, name: true, username: true } },
        validator: { select: { id: true, name: true, username: true } },
        chapter: { select: { id: true, title: true } },
        subChapter: { select: { id: true, title: true } },
        subSubChapter: { select: { id: true, title: true } },
      },
    });

    res.json(document);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Gagal mengambil dokumen yang ditolak",
      error: error.message,
    });
  }
};

// GET /documents/search?query=judul
exports.searchDocuments = async (req, res) => {
  try {
    const { query = "" } = req.query;

    if (!query.trim()) {
      return res
        .status(400)
        .json({ message: "Kata kunci pencarian tidak boleh kosong" });
    }

    const documents = await prisma.document.findMany({
      where: {
        isDeleted: false,
        title: {
          contains: query,
          mode: "insensitive", // case-insensitive search
        },
      },
      orderBy: { createdAt: "desc" },
      include: {
        uploadedBy: { select: { id: true, name: true, username: true } },
        validator: { select: { id: true, name: true, username: true } },
        chapter: { select: { id: true, title: true } },
        subChapter: { select: { id: true, title: true } },
        subSubChapter: { select: { id: true, title: true } },
      },
    });

    res.json({
      message: "Pencarian berdasarkan judul berhasil",
      total: documents.length,
      data: documents,
    });
  } catch (error) {
    res.status(500).json({
      message: "Gagal mencari dokumen",
      error: error.message,
    });
  }
};

// GET /documents/:id
exports.getDocumentById = async (req, res) => {
  try {
    const id = Number(req.params.id);
    const document = await prisma.document.findFirst({
      where: { id, isDeleted: false },
      include: {
        uploadedBy: { select: { id: true, name: true, username: true } },
        validator: { select: { id: true, name: true, username: true } },
        chapter: { select: { id: true, title: true } },
        subSubChapter: { select: { id: true, title: true } },
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

// GET /documents/slug/:slug
exports.getDocumentBySlug = async (req, res) => {
  try {
    const { slug } = req.params;

    const document = await prisma.document.findFirst({
      where: { slug, isDeleted: false },
      include: {
        uploadedBy: { select: { id: true, name: true, username: true } },
        validator: { select: { id: true, name: true, username: true } },
        chapter: { select: { id: true, title: true } },
        subChapter: { select: { id: true, title: true } },
        subSubChapter: { select: { id: true, title: true } },
      },
    });

    if (!document) {
      return res.status(404).json({ message: "Dokumen tidak ditemukan" });
    }

    res.json({
      message: "Berhasil mengambil dokumen berdasarkan slug",
      document,
    });
  } catch (error) {
    res.status(500).json({
      message: "Gagal mengambil dokumen berdasarkan slug",
      error: error.message,
    });
  }
};

// PATCH /documents/:id/status
// PATCH /documents/:id/status
exports.validateDocument = async (req, res) => {
  try {
    const id = Number(req.params.id);
    const { status, rejectionNote } = req.body; // ✅ Tambahkan rejectionNote dari body

    if (!["VALID", "PENDING", "DITOLAK"].includes(status)) {
      return res.status(400).json({ message: "Status tidak valid" });
    }

    if (req.user.role !== "VALIDATOR" && req.user.role !== "ADMINISTRATOR") {
      return res
        .status(403)
        .json({ message: "Hanya Validator yang bisa validasi dokumen" });
    }

    const existingDoc = await prisma.document.findFirst({
      where: { id, isDeleted: false },
    });

    if (!existingDoc) {
      return res.status(404).json({ message: "Dokumen tidak ditemukan" });
    }

    const validatedBy = req.user.id;

    const updated = await prisma.document.update({
      where: { id },
      data: {
        status,
        validatedBy,
        rejectionNote: status === "DITOLAK" ? rejectionNote : null, // ✅ Simpan alasan hanya jika ditolak
      },
    });

    const notifTitle =
      status === "DITOLAK"
        ? `Dokumen ${updated.title} ditolak`
        : `Dokumen ${updated.title} telah divalidasi`;

    const notifMsg =
      status === "DITOLAK"
        ? `Dokumen ${updated.title} ditolak oleh ${req.user.name}.`
        : `Dokumen ${updated.title} telah divalidasi oleh ${req.user.name}.`;

    const notification = await prisma.notification.create({
      data: {
        title: notifTitle,
        message: notifMsg,
        userId: updated.uploadedById,
      },
    });

    res.json({
      message: "Status dokumen berhasil divalidasi",
      document: updated,
      notification,
    });
  } catch (error) {
    res.status(500).json({
      message: "Gagal update status dokumen",
      error: error.message,
    });
  }
};

// PUT /documents/:id
exports.updateDocument = async (req, res) => {
  try {
    const id = Number(req.params.id);
    const { title, description } = req.body;

    const existingDoc = await prisma.document.findFirst({
      where: { id, isDeleted: false },
    });

    if (!existingDoc) {
      return res.status(404).json({ message: "Dokumen tidak ditemukan" });
    }

    let updatedData = { title, description };

    if (req.file && req.file.path) {
      if (existingDoc.cloudinaryId) {
        await cloudinary.uploader.destroy(existingDoc.cloudinaryId, {
          resource_type: "raw",
        });
      }
      updatedData.filePath = req.file.path;
      updatedData.cloudinaryId = req.file.filename;
    }

    const updated = await prisma.document.update({
      where: { id },
      data: updatedData,
    });

    res.json({
      message: "Dokumen berhasil diperbarui",
      document: updated,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Gagal update dokumen", error: error.message });
  }
};

// DELETE /documents/:id (soft delete)
exports.deleteDocument = async (req, res) => {
  try {
    const id = Number(req.params.id);

    const document = await prisma.document.findFirst({
      where: { id, isDeleted: false },
    });
    if (!document) {
      return res.status(404).json({ message: "Dokumen tidak ditemukan" });
    }

    const softDeleted = await prisma.document.update({
      where: { id },
      data: {
        isDeleted: true,
        deletedAt: new Date(),
      },
    });

    res.json({
      message: "Dokumen berhasil dipindahkan ke Recycle Bin",
      document: softDeleted,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Gagal soft delete", error: error.message });
  }
};

// GET /documents/:id/download
exports.downloadDocument = async (req, res) => {
  try {
    const id = Number(req.params.id);

    const document = await prisma.document.findFirst({
      where: { id, isDeleted: false },
    });

    if (!document || !document.filePath) {
      return res
        .status(404)
        .json({ message: "Dokumen tidak ditemukan atau belum memiliki file" });
    }

    if (!document.filePath.includes("/upload/")) {
      return res
        .status(400)
        .json({ message: "Format filePath tidak valid untuk download" });
    }

    const downloadUrl = document.filePath.replace(
      "/upload/",
      "/upload/fl_attachment/"
    );
    res.redirect(downloadUrl);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Gagal mendownload dokumen", error: error.message });
  }
};

// GET /documents/deleted (Recycle Bin)
exports.getDeletedDocuments = async (req, res) => {
  try {
    const deletedDocs = await prisma.document.findMany({
      where: { isDeleted: true },
      orderBy: { deletedAt: "desc" },
      include: {
        uploadedBy: { select: { id: true, name: true } },
        validator: { select: { id: true, name: true } },
        chapter: { select: { id: true, title: true } },
        subSubChapter: { select: { id: true, title: true } },
      },
    });

    res.json(deletedDocs);
  } catch (error) {
    res.status(500).json({
      message: "Gagal mengambil dokumen terhapus",
      error: error.message,
    });
  }
};

// PATCH /documents/:id/restore
exports.restoreDocument = async (req, res) => {
  try {
    const id = Number(req.params.id);

    const existing = await prisma.document.findFirst({
      where: { id, isDeleted: true },
    });

    if (!existing) {
      return res
        .status(404)
        .json({ message: "Dokumen tidak ditemukan di Recycle Bin" });
    }

    const restored = await prisma.document.update({
      where: { id },
      data: {
        isDeleted: false,
        deletedAt: null,
      },
    });

    res.json({ message: "Dokumen berhasil direstore", document: restored });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Gagal restore dokumen", error: error.message });
  }
};

// DELETE /documents/:id/permanent
exports.permanentlyDeleteDocument = async (req, res) => {
  try {
    const id = Number(req.params.id);

    const existing = await prisma.document.findFirst({
      where: { id, isDeleted: true },
    });

    if (!existing) {
      return res
        .status(404)
        .json({ message: "Dokumen tidak ditemukan di Recycle Bin" });
    }

    // Hapus dari Cloudinary (jika ada)
    if (existing.cloudinaryId) {
      await cloudinary.uploader.destroy(existing.cloudinaryId, {
        resource_type: "raw",
      });
    }

    // Hapus permanen dari database
    await prisma.document.delete({ where: { id } });

    res.json({ message: "Dokumen berhasil dihapus permanen" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Gagal hapus permanen", error: error.message });
  }
};

// POST /documents/:id/share
exports.shareDocument = async (req, res) => {
  try {
    const documentId = Number(req.params.id);

    if (!["ADMINISTRATOR", "OPERATOR"].includes(req.user.role)) {
      return res.status(403).json({
        message: "Hanya Administrator dan Operator yang bisa share dokumen",
      });
    }

    const document = await prisma.document.findFirst({
      where: { id: documentId, isDeleted: false },
    });

    if (!document) {
      return res.status(404).json({ message: "Dokumen tidak ditemukan" });
    }

    const token = uuidv4();
    const slug = document.slug;

    await prisma.sharedLink.create({
      data: {
        documentId,
        token,
        expiresAt: null,
      },
    });

    const shareUrl = `${process.env.FRONTEND_URL}/shared/${slug}`;

    res.status(201).json({
      message: "Link share berhasil dibuat",
      shareUrl,
    });
  } catch (error) {
    res.status(500).json({
      message: "Gagal membuat link share",
      error: error.message,
    });
  }
};

// GET /shared/:token
exports.accessSharedDocument = async (req, res) => {
  try {
    const tokenWithSlug = req.params.token; // token-slug
    const token = tokenWithSlug.split("-")[0]; // Ambil hanya bagian token

    const shared = await prisma.sharedLink.findFirst({
      where: { token },
      include: {
        document: {
          where: { isDeleted: false },
          include: {
            chapter: { select: { id: true, title: true } },
            subChapter: { select: { id: true, title: true } },
            subSubChapter: { select: { id: true, title: true } },
            uploadedBy: { select: { id: true, name: true } },
          },
        },
      },
    });

    if (!shared || !shared.document) {
      return res
        .status(404)
        .json({ message: "Dokumen tidak ditemukan atau link tidak valid" });
    }

    res.json({
      message: "Berhasil mengakses dokumen dari link",
      document: shared.document,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Gagal akses dokumen dari link", error: error.message });
  }
};

const prisma = require('../db/prisma');
const multer = require('multer');
const path = require('path');

// Setup multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './uploads'); // pastikan folder ini ada
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

exports.upload = multer({ storage });

// POST /documents (upload dokumen)
exports.createDocument = async (req, res) => {
  try {
    const { chapterId, title, description, subSubChapterId } = req.body;

    if (!req.file) {
      return res.status(400).json({ message: 'File harus diupload' });
    }

    const filePath = `/uploads/${req.file.filename}`;
    const uploadedById = req.user.id;

    const document = await prisma.document.create({
      data: {
        chapterId: parseInt(chapterId),
        title,
        description,
        subSubChapterId: subSubChapterId ? parseInt(subSubChapterId) : null,
        filePath,
        uploadedById,
        // status otomatis 'PENDING' dari default
      },
    });

    res.status(201).json({ message: 'Dokumen berhasil diupload', document });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Gagal upload dokumen', error: error.message });
  }
};


// GET /documents (list semua dokumen)
exports.getDocuments = async (req, res) => {
  try {
    const documents = await prisma.document.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        validator: { select: { id: true, name: true, username: true } },
        uploader: { select: { id: true, name: true, username: true } },
      },
    });
    res.json(documents);
  } catch (error) {
    res.status(500).json({ message: 'Gagal mengambil dokumen', error: error.message });
  }
};

// GET /subchapters/:id/documents (list dokumen berdasar subchapter)
exports.getDocumentsBySubChapter = async (req, res) => {
  const subChapterId = Number(req.params.id);
  try {
    const documents = await prisma.document.findMany({
      where: { subChapterId },
      orderBy: { createdAt: 'desc' },
      include: {
        validator: { select: { id: true, name: true, username: true } },
        uploader: { select: { id: true, name: true, username: true } },
      },
    });
    res.json(documents);
  } catch (error) {
    res.status(500).json({ message: 'Gagal mengambil dokumen', error: error.message });
  }
};

// PATCH /documents/:id/validate (validasi dokumen)
exports.validateDocument = async (req, res) => {
  try {
    const id = Number(req.params.id);
    const { status } = req.body; // VALID, PENDING, DITOLAK
    if (!['VALID', 'PENDING', 'DITOLAK'].includes(status)) {
      return res.status(400).json({ message: 'Status tidak valid' });
    }

    if (req.user.role !== 'VALIDATOR') {
      return res.status(403).json({ message: 'Hanya Validator yang bisa validasi dokumen' });
    }

    const validatedBy = req.user.id;

    const updated = await prisma.document.update({
      where: { id },
      data: { status, validatedBy },
    });
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: 'Gagal update status dokumen', error: error.message });
  }
};

// GET /documents/:id (preview dokumen)
exports.getDocumentById = async (req, res) => {
  try {
    const id = Number(req.params.id);
    const document = await prisma.document.findUnique({ where: { id } });
    if (!document) return res.status(404).json({ message: 'Dokumen tidak ditemukan' });
    res.json(document);
  } catch (error) {
    res.status(500).json({ message: 'Gagal mengambil dokumen', error: error.message });
  }
};

// PUT /documents/:id (edit metadata dokumen)
exports.updateDocument = async (req, res) => {
  try {
    const id = Number(req.params.id);
    const { fileName, status } = req.body;

    const updated = await prisma.document.update({
      where: { id },
      data: { fileName, status },
    });
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: 'Gagal update dokumen', error: error.message });
  }
};

// DELETE /documents/:id
exports.deleteDocument = async (req, res) => {
  try {
    const id = Number(req.params.id);
    await prisma.document.delete({ where: { id } });
    res.json({ message: 'Dokumen berhasil dihapus' });
  } catch (error) {
    res.status(500).json({ message: 'Gagal hapus dokumen', error: error.message });
  }
};

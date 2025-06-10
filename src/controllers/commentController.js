const prisma = require("../db/prisma");

const createComment = async (req, res) => {
  const { content, documentId } = req.body;
  const userId = req.user.id;
  if (!content || !documentId) {
    return res
      .status(400)
      .json({ message: "Content and documentId are required." });
  }

  const document = await prisma.document.findUnique({
    where: { id: documentId },
  });

  if (!document) {
    return res.status(404).json({ message: "Document not found." });
  }

  if (req.user.role !== "VALIDATOR") {
    return res.status(403).json({ message: "Only users can create comments." });
  }
  try {
    const comment = await prisma.comment.create({
      data: {
        content,
        documentId,
        userId,
      },
    });
    res.json({ message: "Comment created successfully.", data: comment });
  } catch (error) {
    res.status(500).json({ message: "Error creating comment." });
  }
};

module.exports = { createComment };

const prisma = require('../db/prisma');

exports.createDocument = async (req, res) => {
  const { title, content } = req.body;
  const document = await prisma.document.create({
    data: { title, content, validated: false },
  });
  res.status(201).json(document);
};

exports.getDocuments = async (req, res) => {
  const documents = await prisma.document.findMany();
  res.json(documents);
};

exports.updateDocument = async (req, res) => {
  const { title, content } = req.body;
  const document = await prisma.document.update({
    where: { id: parseInt(req.params.id) },
    data: { title, content },
  });
  res.json(document);
};

exports.deleteDocument = async (req, res) => {
  await prisma.document.delete({ where: { id: parseInt(req.params.id) } });
  res.json({ message: 'Document deleted' });
};

exports.validateDocument = async (req, res) => {
  const document = await prisma.document.update({
    where: { id: parseInt(req.params.id) },
    data: { validated: true },
  });
  res.json(document);
};

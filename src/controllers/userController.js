const prisma = require('../db/prisma');
const bcrypt = require('bcryptjs');

exports.createUser = async (req, res) => {
  try {
    const { name, username, password, role, programStudiId } = req.body;
    const hashedPassword = await bcrypt.hash(password || 'default123', 10);

    const user = await prisma.user.create({
      data: {
        name,
        username,
        password: hashedPassword,
        role,
        programStudiId: programStudiId || null
      }
    });

    const { password: _, ...userWithoutPassword } = user;
    res.status(201).json(userWithoutPassword);
  } catch (error) {
    console.error("❌ Error saat membuat user:", error); // Tambahkan baris ini
    res.status(500).json({ message: 'Error membuat user.' });
  }
};


exports.getUsers = async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      include: {
        programStudi: {
          select: { id: true, name: true }
        }
      },
    });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Error mengambil data user.' });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, username, password, role, programStudiId } = req.body;
    let dataToUpdate = { name, username, role, programStudiId };

    if (password) {
      dataToUpdate.password = await bcrypt.hash(password, 10);
    }

    const updatedUser = await prisma.user.update({
      where: { id: Number(id) },
      data: dataToUpdate,
    });

    const { password: _, ...userWithoutPassword } = updatedUser;
    res.json(userWithoutPassword);
  } catch (error) {
    res.status(500).json({ message: 'Error memperbarui user.' });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.user.delete({ where: { id: Number(id) } });
    res.json({ message: 'User berhasil dihapus.' });
  } catch (error) {
    res.status(500).json({ message: 'Error menghapus user.' });
  }
};

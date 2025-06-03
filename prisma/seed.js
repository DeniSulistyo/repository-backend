const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  // Contoh buat program studi (boleh kamu sesuaikan)
  const programStudis = [
    'Teknik Industri (S1)',
    'Teknik Informatika (S1)',
    'Teknik Mesin (S1)',
    'Teknologi Informasi (D3)',
    'Mesin Otomotif (D3)',
  ];

  // Insert Program Studi
  for (const name of programStudis) {
    await prisma.programStudi.upsert({
      where: { name },
      update: {},
      create: { name },
    });
  }

  console.log(' Program Studi berhasil di-seed.');

  // Buat 1 Administrator khusus dengan username dan password yang kamu mau
  const username = 'admin1';
  const existingAdmin = await prisma.user.findUnique({ where: { username } });

  if (!existingAdmin) {
    const hashedPassword = await bcrypt.hash('admin123', 10);

    await prisma.user.create({
      data: {
        name: 'Administrator Utama',
        username: username,
        password: hashedPassword,
        role: 'ADMINISTRATOR',
        programStudiId: null, // bisa null kalau admin umum
      },
    });

    console.log(` Administrator berhasil dibuat dengan username "${username}" dan password "admin123".`);
  } else {
    console.log(` Administrator dengan username "${username}" sudah ada.`);
  }

  console.log(' Seeder selesai.');
}

main()
  .catch((e) => {
    console.error(' Error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

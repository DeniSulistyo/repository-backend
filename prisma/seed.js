const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

async function main() {
  // Program Studi
  const programStudis = [
    "Teknik Industri (S1)",
    "Teknik Informatika (S1)",
    "Teknik Mesin (S1)",
    "Teknologi Informasi (D3)",
    "Mesin Otomotif (D3)",
  ];

  // Insert Program Studi dan buat validator untuk masing-masing
  for (const name of programStudis) {
    const program = await prisma.programStudi.upsert({
      where: { name },
      update: {},
      create: { name },
    });

    // Username dibuat dari nama program studi
    const shortName = name
      .toLowerCase()
      .replace(/[^a-z]/g, "_")
      .replace(/_+/g, "_")
      .replace(/^_|_$/g, "");

    const username = `validator_${shortName}`;
    const existingValidator = await prisma.user.findUnique({
      where: { username },
    });

    if (!existingValidator) {
      const hashedPassword = await bcrypt.hash("validator123", 10);

      await prisma.user.create({
        data: {
          name: `Validator ${name}`,
          username: username,
          password: hashedPassword,
          role: "VALIDATOR",
          programStudiId: program.id,
        },
      });

      console.log(`✅ Validator dibuat: ${username} (program: ${name})`);
    } else {
      console.log(`⚠️ Validator dengan username "${username}" sudah ada.`);
    }
  }

  // Admin utama
  const adminUsername = "admin1";
  const existingAdmin = await prisma.user.findUnique({
    where: { username: adminUsername },
  });

  if (!existingAdmin) {
    const hashedPassword = await bcrypt.hash("admin123", 10);

    await prisma.user.create({
      data: {
        name: "Administrator Utama",
        username: adminUsername,
        password: hashedPassword,
        role: "ADMINISTRATOR",
        programStudiId: null,
      },
    });

    console.log(`✅ Administrator berhasil dibuat: ${adminUsername}`);
  } else {
    console.log(`⚠️ Administrator "${adminUsername}" sudah ada.`);
  }

  console.log("🎉 Seeder selesai.");
}

main()
  .catch((e) => {
    console.error("❌ Error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

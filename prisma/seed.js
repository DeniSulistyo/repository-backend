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

  const validatorUsername = "validator";
  const existingValidator = await prisma.user.findUnique({
    where: { username: validatorUsername },
  });

  if (!existingValidator) {
    const hashedPassword = await bcrypt.hash("validator123", 10);

    await prisma.user.create({
      data: {
        name: `Validator `,
        username: validatorUsername,
        password: hashedPassword,
        role: "VALIDATOR",
        programStudiId: null,
      },
    });

    console.log(`✅ Validator dibuat: ${validatorUsername} `);
  } else {
    console.log(`⚠️ Validator dengan username "${username}" sudah ada.`);
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

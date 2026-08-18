import "dotenv/config";
import bcrypt from "bcryptjs";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

async function main() {
  const email = process.env.OWNER_EMAIL;
  const password = process.env.OWNER_PASSWORD;
  const name = process.env.OWNER_NAME ?? "Owner";

  if (!email || !password) {
    throw new Error(
      "OWNER_EMAIL және OWNER_PASSWORD env айнымалыларын .env файлында орнатыңыз (алғашқы Owner аккаунтын жасау үшін)."
    );
  }
  if (password.length < 8) {
    throw new Error("OWNER_PASSWORD кемінде 8 таңбадан тұруы керек.");
  }

  const passwordHash = await bcrypt.hash(password, 12);

  const owner = await prisma.user.upsert({
    where: { email: email.toLowerCase() },
    update: {},
    create: {
      email: email.toLowerCase(),
      name,
      role: "OWNER",
      passwordHash,
    },
  });

  console.log(`Owner ready: ${owner.email} (${owner.id})`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

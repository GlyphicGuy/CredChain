const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log("Clearing VerificationLog...");
  await prisma.verificationLog.deleteMany({});
  
  console.log("Clearing CredentialRecord...");
  await prisma.credentialRecord.deleteMany({});
  
  console.log("Database cleared successfully!");
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const students = [
    { name: 'Alice', email: 'alice@credchain.dev' },
    { name: 'Bob', email: 'bob@credchain.dev' },
    { name: 'Charlie', email: 'charlie@credchain.dev' },
    { name: 'Eve', email: 'eve@credchain.dev' },
  ];

  for (const s of students) {
    await prisma.student.upsert({
      where: { email: s.email },
      update: {},
      create: { name: s.name, email: s.email },
    });
  }
  console.log('Seeded students');
}
main().catch(console.error).finally(() => prisma.$disconnect());

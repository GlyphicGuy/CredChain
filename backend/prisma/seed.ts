import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  const institution = await prisma.institution.upsert({
    where: { did: 'did:credchain:stanford' },
    update: {},
    create: {
      name: 'Stanford University',
      did: 'did:credchain:stanford',
      walletAddress: '0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80',
    },
  })
  
  const student = await prisma.student.upsert({
    where: { email: 'alice@example.com' },
    update: {},
    create: {
      name: 'Alice Johnson',
      email: 'alice@example.com',
    },
  })
  
  console.log({ institution, student })
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })

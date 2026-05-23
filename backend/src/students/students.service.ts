import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class StudentsService {
  constructor(private readonly prisma: PrismaService) {}

  async getAllStudents() {
    return this.prisma.student.findMany({
      select: {
        id: true,
        name: true,
        email: true,
      },
      orderBy: {
        name: 'asc',
      }
    });
  }

  async getPublicProfile(identifier: string) {
    const isEmail = identifier.includes('@');
    const student = await this.prisma.student.findFirst({
      where: isEmail ? { email: identifier } : { id: identifier },
      include: {
        credentials: {
          where: { status: 'ISSUED' },
          include: { institution: true },
          orderBy: { issueDate: 'desc' }
        }
      }
    });

    if (!student) {
      throw new Error('Student not found');
    }

    return {
      id: student.id,
      name: student.name,
      credentials: student.credentials.map(c => ({
        id: c.credentialHash,
        title: c.credentialTitle,
        issuer: c.institution.name,
        date: c.issueDate,
        status: c.status
      }))
    };
  }
}

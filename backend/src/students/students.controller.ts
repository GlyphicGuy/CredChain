import { Controller, Get, Param } from '@nestjs/common';
import { StudentsService } from './students.service';
import { Roles } from '../auth/roles.decorator';
import { Public } from '../auth/public.decorator';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('Students')
@Controller('students')
export class StudentsController {
  constructor(private readonly studentsService: StudentsService) {}

  @Get()
  @Roles('Institution')
  @ApiOperation({ summary: 'Get all students for institution autocomplete' })
  async getAllStudents() {
    return this.studentsService.getAllStudents();
  }

  @Get('profile/:id')
  @Public()
  @ApiOperation({ summary: 'Get public profile for a student' })
  async getPublicProfile(@Param('id') id: string) {
    return this.studentsService.getPublicProfile(id);
  }
}

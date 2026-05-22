import { IsString, IsNotEmpty, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class IssueCredentialDto {
  @ApiProperty({ example: 'Alice Johnson' })
  @IsString()
  @IsNotEmpty()
  recipientName: string;

  @ApiProperty({ example: 'B.Sc Computer Science' })
  @IsString()
  @IsNotEmpty()
  credentialTitle: string;

  @ApiProperty({ example: 'student@example.com' })
  @IsString()
  @IsNotEmpty()
  studentEmail: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  metadata?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  documentHash?: string;
}

export class RevokeCredentialDto {
  @ApiProperty({ example: '0x123...abc' })
  @IsString()
  @IsNotEmpty()
  hash: string;
}

export class VerifyCredentialDto {
  @ApiProperty({ example: '0x123...abc' })
  @IsString()
  @IsNotEmpty()
  hash: string;
}

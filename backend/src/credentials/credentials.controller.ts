import { Controller, Post, Body, Get, Param, Req } from '@nestjs/common';
import { CredentialsService } from './credentials.service';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { IssueCredentialDto, RevokeCredentialDto, VerifyCredentialDto } from './dto/credential.dto';
import { Roles } from '../auth/roles.decorator';
import { Public } from '../auth/public.decorator';

@ApiTags('Credentials')
@Controller('credentials')
export class CredentialsController {
  constructor(private readonly credentialsService: CredentialsService) {}

  @Post('issue')
  @Roles('Institution')
  @ApiOperation({ summary: 'Issue a new credential' })
  async issueCredential(@Body() body: IssueCredentialDto) {
    return this.credentialsService.issueCredential(body);
  }

  @Get('wallet')
  @Roles('Student')
  @ApiOperation({ summary: 'Get credentials for student wallet' })
  async getWalletCredentials(@Req() req: any) {
    return this.credentialsService.getWalletCredentials(req.user);
  }

  @Get('records')
  @Roles('Institution')
  @ApiOperation({ summary: 'Get all credentials issued by institution' })
  async getInstitutionRecords() {
    return this.credentialsService.getInstitutionRecords();
  }

  @Post('revoke')
  @Roles('Institution')
  @ApiOperation({ summary: 'Revoke a credential' })
  async revokeCredential(@Body() body: RevokeCredentialDto) {
    return this.credentialsService.revokeCredential(body.hash);
  }

  @Get('verify/:id')
  @Public()
  @ApiOperation({ summary: 'Verify a credential by ID/hash' })
  async verifyCredential(@Param('id') id: string) {
    return this.credentialsService.verifyCredential(id);
  }
}

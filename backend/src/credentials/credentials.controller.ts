import { Controller, Post, Body, Get, Param, Req, Delete } from '@nestjs/common';
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

  @Post('issue-demo')
  @Roles('Student')
  @ApiOperation({ summary: 'Issue a demo sandbox credential to self' })
  async issueDemoCredential(@Req() req: any) {
    return this.credentialsService.issueDemoCredential(req.user);
  }

  @Post('issue-batch')
  @Roles('Institution')
  @ApiOperation({ summary: 'Issue multiple credentials at once from CSV' })
  async issueBatch(@Body() body: { credentials: IssueCredentialDto[] }) {
    return this.credentialsService.issueBatch(body.credentials);
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

  @Get('network-stats')
  @Public()
  @ApiOperation({ summary: 'Get global network statistics for landing page' })
  async getNetworkStats() {
    return this.credentialsService.getNetworkStats();
  }

  @Get('public/:email')
  @Public()
  @ApiOperation({ summary: 'Get public verified credentials for a user profile' })
  async getPublicProfile(@Param('email') email: string) {
    return this.credentialsService.getPublicProfile(email);
  }

  @Delete(':hash')
  @Roles('Institution')
  @ApiOperation({ summary: 'Hard delete a credential record' })
  async deleteCredential(@Param('hash') hash: string) {
    return this.credentialsService.deleteCredential(hash);
  }
}

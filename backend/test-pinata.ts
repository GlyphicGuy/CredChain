import { NestFactory } from '@nestjs/core';
import { AppModule } from './src/app.module';
import { CredentialsService } from './src/credentials/credentials.service';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const credentialsService = app.get(CredentialsService);

  try {
    console.log('--- ISSUANCE ---');
    const startIssue = performance.now();
    const result = await credentialsService.issueCredential({
      recipientName: 'Alice Validation',
      credentialTitle: 'Sprint 7 Degree'
    });
    const endIssue = performance.now();
    
    console.log(`CID: ${result.ipfsCid}`);
    console.log(`Gateway URL: ${process.env.PINATA_GATEWAY}/ipfs/${result.ipfsCid}`);
    console.log(`Issue latency: ${(endIssue - startIssue).toFixed(2)}ms\n`);

    console.log('--- VERIFICATION ---');
    const startVerify = performance.now();
    const verifyResult = await credentialsService.verifyCredential(result.credentialHash);
    const endVerify = performance.now();
    
    console.log(`Verify Result: ${verifyResult.status}`);
    console.log(`Verification latency: ${(endVerify - startVerify).toFixed(2)}ms\n`);

    console.log('--- REVOCATION ---');
    console.log('Waiting for block confirmation before revoking...');
    await new Promise(res => setTimeout(res, 2000));
    
    await credentialsService.revokeCredential(result.credentialHash);
    
    const postRevoke = await credentialsService.verifyCredential(result.credentialHash);
    console.log(`Post-Revoke Status: ${postRevoke.status}`);
    console.log('\n--- SUCCESS ---');
  } catch (e) {
    console.error('FAILED:', e.message);
  } finally {
    await app.close();
  }
}

bootstrap();

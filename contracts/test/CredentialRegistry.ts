import { expect } from "chai";
import { ethers } from "hardhat";
import { CredentialRegistry } from "../typechain-types";

describe("CredentialRegistry", function () {
  let registry: CredentialRegistry;
  let owner: any;
  let addr1: any;

  beforeEach(async function () {
    const CredentialRegistryFactory = await ethers.getContractFactory("CredentialRegistry");
    [owner, addr1] = await ethers.getSigners();
    registry = await CredentialRegistryFactory.deploy();
  });

  it("Should set the right admin", async function () {
    expect(await registry.admin()).to.equal(owner.address);
  });

  it("Should allow admin to add an issuer", async function () {
    await registry.addIssuer(addr1.address);
    expect(await registry.authorizedIssuers(addr1.address)).to.be.true;
  });

  it("Should issue and verify a credential", async function () {
    const hash = ethers.keccak256(ethers.toUtf8Bytes("credential123"));
    await registry.issueCredential(hash);

    const result = await registry.verifyCredential(hash);
    expect(result.isValid).to.be.true;
    expect(result.issuer).to.equal(owner.address);
  });

  it("Should allow issuer to revoke a credential", async function () {
    const hash = ethers.keccak256(ethers.toUtf8Bytes("credential123"));
    await registry.issueCredential(hash);
    await registry.revokeCredential(hash);

    const result = await registry.verifyCredential(hash);
    expect(result.isValid).to.be.false;
  });
});

# CredChain

CredChain is a decentralized platform for issuing and verifying digital credentials using cryptographic proofs anchored to a blockchain. By abstracting away the complexity of managing private keys and on-chain interactions, CredChain provides a seamless "Zero-Knowledge" experience for students, institutions, and verifiers.

## Features

- **Issuer Studio**: Institutions can batch issue credentials via CSV or manual entry.
- **Student Wallet**: Students can view all their cryptographically proven certificates.
- **Verification Portal**: Third parties can instantly verify the authenticity of a credential using a SHA-256 footprint and Smart Contract validation.
- **Ultra-Premium UI**: Fully responsive, physically modeled interface with 3D WebGL elements and smooth Framer Motion animations.

## Repository Structure

CredChain is built as a monorepo consisting of:
- `src/` - The Next.js 15 frontend application (App Router, Tailwind CSS, Shadcn UI, React Three Fiber).
- `backend/` - The NestJS API that orchestrates the Clerk authentication, IPFS uploads, and smart contract transactions.
- `contracts/` - The Hardhat environment containing the Solidity smart contracts.

## How to Fork and Run Locally

### 1. Fork and Clone
Fork the repository on GitHub, then clone it to your local machine:
```bash
git clone https://github.com/YOUR_USERNAME/credchain.git
cd credchain
```

### 2. Install Dependencies
You will need to install dependencies for the root frontend, the backend, and the smart contracts:
```bash
# Install frontend dependencies
npm install

# Install backend dependencies
cd backend
npm install

# Install smart contract dependencies
cd ../contracts
npm install
```

### 3. Environment Variables
To prevent sharing private data, we use `.env` files which are safely ignored by git.
You must create two `.env` files based on `.env.example`:

**Frontend (`.env.local` in root):**
```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key
```

**Backend (`backend/.env`):**
```env
DATABASE_URL="file:./prisma/dev.db"
PINATA_API_KEY=your_pinata_api_key
PINATA_SECRET_KEY=your_pinata_secret_key
WEB3_PROVIDER_URL=your_infura_or_alchemy_url
PRIVATE_KEY=your_wallet_private_key
```

### 4. Database Setup
Inside the `backend` folder, run Prisma to set up your local SQLite database:
```bash
cd backend
npx prisma generate
npx prisma db push
```

### 5. Running the Application

You need to run both the frontend and backend servers simultaneously. Open two terminal windows.

**Terminal 1 (Frontend):**
```bash
npm run dev
```
*Runs the Next.js app on `http://localhost:3000`*

**Terminal 2 (Backend):**
```bash
cd backend
npm run start:dev
```
*Runs the NestJS API on `http://localhost:3002`*

### Privacy & Security
All sensitive information, such as `dev.db`, API keys, and environment variables, are strictly ignored in `.gitignore`. **Never commit your `.env` files to GitHub.**

## License
MIT

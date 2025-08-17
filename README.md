# 🌐 Living Internet Protocol (LIP)

**Proof of Human. Proof of Life. The Internet Reborn.**

## Overview

Living Internet Protocol (LIP) is a decentralized human verification system built on the Internet Computer. Using ARC-AGI style challenges that humans can solve easily (95% success rate) but AI struggles with (1.3% success rate), LIP creates an immune system for the internet against bot traffic.

## Key Features

- 🧩 **2x2 Grid Pattern Challenges**: Simple visual puzzles that test human reasoning
- 🎯 **Proof-of-Humanity NFTs**: Mint your verification as an on-chain asset
- ⏰ **24-Hour Token System**: Time-based verification for continuous liveness
- 💬 **Verified Forum POC**: Reddit-like forum where only verified humans can post

## Tech Stack

- **Backend**: Rust canister on Internet Computer Protocol (ICP)
- **Frontend**: React + TypeScript + Tailwind CSS
- **Blockchain**: Internet Computer
- **Authentication**: Internet Identity

## Quick Start

### Prerequisites

- Node.js 18+
- Rust
- DFX (Internet Computer SDK)

### Installation

1. Clone the repository:

```bash
git clone https://github.com/syahiidkamil/living-internet-protocol.git
cd living-internet-protocol
```

2. Install dependencies:

```bash
npm install
```

3. Start local Internet Computer replica:

```bash
dfx start --clean
```

4. Deploy canisters:

```bash
dfx deploy
```

5. Start frontend development server:

```bash
npm start
```

## How It Works

### 1. Human Verification Flow

Users complete 3 pattern-based challenges:

- **Rotation Challenge**: Identify 90° rotation patterns
- **Color Sequence**: Recognize color progressions
- **Transformation**: Apply abstract transformations

### 2. NFT Minting

Upon successful completion:

- Proof-of-humanity NFT is minted
- 24-hour humanity token is issued
- Access to verified-only features

### 3. Forum Demonstration

The POC forum showcases real-world usage:

- Only verified humans can create posts
- Tokens expire after 24 hours
- Re-verification requires only 1 challenge
- Failed verification = immediate logout

## Project Structure

```
living-internet-protocol/
├── src/
│   ├── backend/              # Rust canister (verification logic)
│   │   └── src/lib.rs       # Challenge generation & token management
│   └── frontend/            # React application
│       ├── views/           # Main UI components
│       │   ├── HumanVerificationView.tsx
│       │   └── ForumView.tsx
│       └── components/      # Reusable components
├── dfx.json                 # IC configuration
└── README.md
```

## Testing

Run the test suite:

```bash
npm test
```

Backend tests:

```bash
npm run test:backend
```

Frontend tests:

```bash
npm run test:frontend
```

## Deployment

### Local Deployment

```bash
dfx deploy
```

### Mainnet Deployment

```bash
dfx deploy --network ic
```

## Security Considerations

- All challenge validation happens on-chain
- No client-side correct answers
- Rate limiting prevents brute force
- Session management with 30-minute timeout

## Future Enhancements

- [ ] More challenge types (3x3 grids, temporal patterns)
- [ ] Social features (challenge friends, leaderboards)
- [ ] SDK for third-party integration
- [ ] Mobile app support
- [ ] Advanced NFT metadata

## Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

## Resources

- [ICP Documentation](https://internetcomputer.org/docs)
- [ARC-AGI Benchmarks](https://github.com/fchollet/ARC-AGI)
- [Project Vision Document](DOCS/LIP_VISION_HUSTLE.md)

## License

MIT License - see [LICENSE](LICENSE) file for details.

---

**Join the revolution. Prove you're human. Resurrect the living internet.**

Built with ❤️ for IC Vibe Coding Bootcamp

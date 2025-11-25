# SIWx - Sign-In with X

A chain-agnostic authentication library implementing the [CAIP-122](https://github.com/ChainAgnostic/CAIPs/blob/master/CAIPs/caip-122.md) standard for Sign-In with X (SIWx) across multiple blockchain ecosystems.

## Features

- 🔗 **Chain Agnostic**: Unified API for multiple blockchain namespaces
- 🔐 **Secure**: Follows CAIP-122 standard for authentication
- 🚀 **Easy to Use**: Simple and intuitive API
- 📦 **TypeScript**: Full TypeScript support with type definitions
- ⚡ **Lightweight**: Minimal dependencies

## Supported Chains

- **EIP-155** (Ethereum and EVM-compatible chains)
- **Solana** (Solana blockchain)
- **BIP-322** (Bitcoin)

## Installation

```bash
npm install siwx
```

## Quick Start

### Basic Usage

```typescript
import { SIWx } from "siwx";

// Create a message
const message = SIWx.createMessage({
  domain: "example.com",
  address: "0x1234567890123456789012345678901234567890",
  chainId: "eip155:1",
  uri: "https://example.com/login",
  statement: "Sign in to Example.com",
});

// Sign the message
const result = await SIWx.signMessage(message, privateKey);
console.log(result.signature);

// Verify the signature
const isValid = await SIWx.verifySignature(message, result.signature);
console.log(isValid); // true
```

### Chain-Specific Usage

#### Ethereum (EIP-155)

```typescript
import { eip155, createMessage } from "siwx";

const message = createMessage({
  domain: "example.com",
  address: "0x1234567890123456789012345678901234567890",
  chainId: "eip155:1", // Ethereum mainnet
  uri: "https://example.com/login",
  statement: "Sign in with Ethereum",
  nonce: "random-nonce",
  issuedAt: new Date().toISOString(),
});

// Sign with Ethereum private key
const result = await eip155.signMessage(message, "0x...");

// Verify
const isValid = await eip155.verifySignature({
  message,
  signature: result.signature,
});
```

#### Solana

```typescript
import { solana, createMessage } from "siwx";

const message = createMessage({
  domain: "example.com",
  address: "GwAF45zjfyGzUbd3i3hXxzGeuchzEZXwpRYHZM5912F1",
  chainId: "solana:mainnet",
  uri: "https://example.com/login",
  statement: "Sign in with Solana",
});

// Sign with Solana keypair
const result = await solana.signMessage(message, keypairSecretKey);

// Verify
const isValid = await solana.verifySignature({
  message,
  signature: result.signature,
});
```

## API Reference

### `SIWx`

The main unified API object.

#### `SIWx.createMessage(options)`

Creates a SIWx message object.

**Options:**
- `domain` (string, required): The domain requesting the signature
- `address` (string, required): The blockchain address
- `chainId` (ChainId, required): The CAIP-2 chain ID (e.g., "eip155:1")
- `uri` (string, required): The URI of the service
- `version` (string, optional): Version of the message (default: "1")
- `statement` (string, optional): Human-readable statement
- `nonce` (string, optional): Random nonce (auto-generated if not provided)
- `issuedAt` (string, optional): ISO 8601 timestamp (default: current time)
- `expirationTime` (string, optional): ISO 8601 timestamp
- `notBefore` (string, optional): ISO 8601 timestamp
- `requestId` (string, optional): Request identifier
- `resources` (string[], optional): List of resources

## Standards

This library implements:
- [CAIP-2](https://github.com/ChainAgnostic/CAIPs/blob/master/CAIPs/caip-2.md): Blockchain ID Specification
- [CAIP-10](https://github.com/ChainAgnostic/CAIPs/blob/master/CAIPs/caip-10.md): Account ID Specification
- [CAIP-122](https://github.com/ChainAgnostic/CAIPs/blob/master/CAIPs/caip-122.md): Sign in With X (SIWx)
- [EIP-191](https://eips.ethereum.org/EIPS/eip-191): Signed Data Standard (for Ethereum)
- [EIP-4361](https://eips.ethereum.org/EIPS/eip-4361): Sign-In with Ethereum
- [BIP-322](https://github.com/bitcoin/bips/blob/master/bip-0322.mediawiki): Generic Signed Message Format

## Publishing to npm

Before publishing to npm, make sure to:

1. **Update package.json**:
   - Change `repository`, `bugs`, `homepage` URLs to your GitHub repository
   - Update `author` field with your name

2. **Build the package**:
   ```bash
   npm run build
   ```

3. **Test locally** (optional but recommended):
   ```bash
   npm link
   # In another project
   npm link siwx
   ```

4. **Login to npm**:
   ```bash
   npm login
   ```

5. **Publish**:
   ```bash
   npm publish
   ```

6. **For updates**:
   - Update version in package.json (following [semver](https://semver.org/))
   - Or use: `npm version patch|minor|major`
   - Then: `npm publish`

## Contributing

If you want to contribute to this project:

```bash
# Clone the repository
git clone https://github.com/lofee488/siwx.git
cd siwx

# Install dependencies
npm install

# Run tests
npm test

# Build
npm run build
```

## License

MIT

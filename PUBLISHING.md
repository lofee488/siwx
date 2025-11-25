# Publishing Checklist

## Before Publishing

### 1. Update Package Metadata

Edit [package.json](package.json):

```json
{
  "repository": {
    "type": "git",
    "url": "https://github.com/YOUR_USERNAME/siwx"  // ← Change this
  },
  "bugs": {
    "url": "https://github.com/YOUR_USERNAME/siwx/issues"  // ← Change this
  },
  "homepage": "https://github.com/YOUR_USERNAME/siwx#readme",  // ← Change this
  "author": "Your Name"  // ← Change this
}
```

### 2. Verify Everything Works

```bash
# Run tests
npm test

# Build the package
npm run build

# Check what will be published
npm pack --dry-run
```

### 3. Update Version (if needed)

```bash
# For first publish, version is already 0.1.0
# For updates:
npm version patch  # 0.1.0 -> 0.1.1
npm version minor  # 0.1.0 -> 0.2.0
npm version major  # 0.1.0 -> 1.0.0
```

## Publishing

### 4. Login to npm

```bash
npm login
```

You'll need:
- npm username
- password
- email
- 2FA code (if enabled)

### 5. Publish

```bash
npm publish
```

The `prepublishOnly` script will automatically run the build before publishing.

### 6. Verify

Check your package on npm:
```
https://www.npmjs.com/package/siwx
```

Test installation in a new project:
```bash
mkdir test-install && cd test-install
npm init -y
npm install siwx
```

## After Publishing

### Tag the Release on GitHub

```bash
git tag v0.1.0
git push origin v0.1.0
```

### Create GitHub Release

Go to your repository on GitHub and create a release with the tag.

## Package Info

- **Name**: siwx
- **Version**: 0.1.0
- **Size**: ~12.4 kB
- **Files**: 9 (dist files + README + LICENSE)
- **License**: MIT

## Test Results

✅ 44 tests passing
- Message formatting: 6 tests
- Solana adapter: 9 tests
- EIP-155 adapter: 11 tests
- Unified API: 18 tests

## Supported Chains

- **EIP-155**: Ethereum, Polygon, Optimism, Arbitrum, Base, BNB Chain, Avalanche, Fantom, Gnosis
- **Solana**: Mainnet, Devnet, Testnet
- **BIP-322**: Bitcoin

## What Gets Published

```
dist/
├── index.cjs          # CommonJS build
├── index.cjs.map      # CJS source map
├── index.d.cts        # CJS type definitions
├── index.d.ts         # ESM type definitions
├── index.js           # ESM build
└── index.js.map       # ESM source map
README.md
LICENSE
package.json
```

## What's NOT Published

- Source code (src/)
- Tests (*.test.ts)
- Config files (tsconfig.json, vitest.config.ts, etc.)
- Examples
- Development files

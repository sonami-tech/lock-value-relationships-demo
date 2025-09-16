# CKB Lock Value Relationships Demo

This project demonstrates the relationships of different lock values used in Nervos CKB blockchain development. Our code walks through each of the steps to convert values from one to another to show how each one is derived using both CCC and Lumos.

## What This Demonstrates

The complete value derivation chain:
```
Private Key (32 bytes)
    ↓ secp256k1 elliptic curve
Public Key (33 bytes, compressed)
    ↓ ckbhash, truncate to 20 bytes (blake160)
Lock Arg (20 bytes)
    ↓ combine with code_hash + hash_type
Lock Script (structure)
    ├── ckbhash of molecule-serialized script
    │   └── Lock Hash (32 bytes)
    └── bech32m encoding with prefix
        └── Address (human-readable string)
```

Each step in this chain serves a specific purpose and follows well-defined cryptographic standards:

- **Private Key**: Your secret authority that must never be shared.
- **Public Key**: Your public identity derived via secp256k1 elliptic curve cryptography.
- **Lock Arg**: Your unique identifier (blake160) used in the script args field.
- **Lock Script**: Your complete ownership specification combining code_hash + hash_type + args.
- **Lock Hash**: Your script's unique fingerprint calculated from the serialized script.
- **Address**: Your human-readable identifier that encodes the entire lock script.

## Files

- **`ccc.js`** - CCC implementation (recommended).
- **`lumos.js`** - Lumos implementation (not recommended).
- **`utils.js`** - Various utility functions.
- **`config.json`** - CKB configuration for Lumos on testnet.

## Usage

### Installation
```bash
npm install
```

### Get Instructions
```bash
npm start
```

### Run CCC Version (Recommended)
```bash
npm run ccc
# or
node ccc.js
```

### Run Lumos Version
```bash
npm run lumos
# or
node lumos.js
```

## License

See [LICENSE](LICENSE) file.
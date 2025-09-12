# CKB Lock Value Relationships Demo

This project demonstrates the relationships of different lock values used in Nervos CKB blockchain development. Our code walks through each of the steps to convert values from one to another to show how each one is derived using both CCC and Lumos.

## What This Demonstrates

The transformation chain:
```
Private Key (32 bytes)
    ↓ secp256k1 elliptic curve
Public Key (33 bytes, compressed)
    ↓ ckbhash, truncate to 20 bytes (blake160)
Lock Arg (20 bytes)
    ↓ combine with code_hash + hash_type
Lock Script (structure)
    ↓ ckbhash of molecule-serialized script
Lock Hash (32 bytes)
    ↓ bech32m encoding with prefix
Address (human-readable string)
```

## Files

- **`ccc.js`** - CCC implementation (recommended).
- **`lumos.js`** - Lumos implementation (not recommended).
- **`util.js`** - Various utility functions.
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
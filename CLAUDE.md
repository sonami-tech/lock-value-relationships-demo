# CKB Lock Value Relationships Demo - Claude Instructions

## Project Overview
This is an educational demo showing the complete cryptographic transformation chain in CKB (Nervos) blockchain development. It demonstrates how all lock-related values connect from private key to address using two different library approaches.

## Core Architecture

### Transformation Chain
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

### Key Files
- `ccc.js` - Modern CCC library implementation with higher-level abstractions.
- `lumos.js` - Explicit Lumos implementation with step-by-step transformations.
- `util.js` - Utility functions for hex/byte conversions.
- `config.json` - CKB configuration for Lumos (testnet settings).

## Dependencies

### Core Libraries
- `@ckb-lumos/base` - Core utilities (`ckbHash`, `computeScriptHash`).
- `@ckb-lumos/config-manager` - Configuration management.
- `@ckb-lumos/helpers` - Address encoding/decoding.
- `@ckb-ccc/core` - Modern CCC library for cleaner API.

### Cryptography
- `secp256k1` - Elliptic curve operations (private → public key).
- `blake2b` - Blake2b hashing with CKB's "ckb-default-hash" personalization.

## Technical Reference

### Cryptographic Constants
- Blake160 = Blake2b-256 truncated to 160 bits (20 bytes).
- ckbhash = Blake2b-256 with "ckb-default-hash" personalization.
- Default secp256k1 code hash: `0x9bd7e06f3ecf4be0f2fcd2188b23f1b9fcc88e5d4b65a8637b17723bbda3cce8`.

### Key Operations
- Private key to public key: `secp256k1.publicKeyCreate()`.
- Public key to lock arg: `ckbHash(publicKey).substring(0, 42)`.
- Lock script to hash: `computeScriptHash(lockScript)` or `lockScript.hash()`.
- Lock script to address: `encodeToAddress(lockScript)` or `addressObj.toString()`.

## Testing
When making changes, verify both implementations still produce matching results:
- Same lock args from public key.
- Same lock script structure.
- Same lock hash values.
- Same addresses.

Run both `npm run lumos` and `npm run ccc` to ensure consistency after modifications.
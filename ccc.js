/**
 * CKB Lock Value Relationships Demo - CCC Version
 * 
 * This demonstrates the complete chain of relationships between:
 * Private Key → Public Key → Lock Arg → Lock Script → Lock Hash → Address
 */

import * as ccc from "@ckb-ccc/core";
import secp256k1 from "secp256k1";
import blake2b from "blake2b";
import { hexToUint8Array, uint8ArrayToHex } from "./utils.js";

// Setup - Create a mock CCC client for testnet.
const PRIVATE_KEY = "0xd00c06bfd800d27397002dca6fb0993d5ba6399b4238b2f29ee9deb97593d2bc";
const client = new ccc.ClientPublicTestnet();
const signer = new ccc.SignerCkbPrivateKey(client, PRIVATE_KEY);

console.log("=".repeat(80));
console.log("CKB Lock Value Relationships Demo - Using CCC Library");
console.log("=".repeat(80));

// Step 1: Private Key (32 bytes)
console.log(`\n1. Private Key:\t\t${PRIVATE_KEY}`);
console.log(`   Length:\t\t${PRIVATE_KEY.length - 2} hex chars (32 bytes)`);
console.log(`   Purpose:\t\tSecret key that is the basis of all derived values.`);

// Step 2: Public Key - Both Methods
const publicKeyBuiltIn = signer.publicKey;
const publicKeyStandalone = uint8ArrayToHex(secp256k1.publicKeyCreate(hexToUint8Array(PRIVATE_KEY)));
const publicKey = publicKeyBuiltIn; // Use built-in for rest of demo

console.log(`\n2. Public Key:`);
console.log(`   CCC built-in:\t${publicKeyBuiltIn}`);
console.log(`   Secp256k1 lib:\t${publicKeyStandalone}`);
console.log(`   Match:\t\t${publicKeyBuiltIn === publicKeyStandalone ? "✓ Yes" : "✗ No"}`);
console.log(`   Length:\t\t${publicKey.length - 2} hex chars (33 bytes)`);
console.log(`   Generation:\t\tCCC signer.publicKey vs secp256k1.publicKeyCreate().`);
console.log(`   Purpose:\t\tPublic component of cryptographic key pair for digital signatures.`);

// Step 3: Lock Arg
// Get lock arg from CCC built-in method.
const tempAddressObj = await signer.getAddressObjSecp256k1();
const cccLockArg = tempAddressObj.script.args;

// Manual Lock Arg calculation for comparison.
const manualLockArg = uint8ArrayToHex(
	blake2b(32, null, null, new TextEncoder().encode("ckb-default-hash"))
		.update(hexToUint8Array(publicKey))
		.digest()
).substring(0, 42);

console.log(`\n3. Lock Arg:`);
console.log(`   CCC built-in:\t${cccLockArg}`);
console.log(`   Manual calc:\t\t${manualLockArg}`);
console.log(`   Match:\t\t${cccLockArg === manualLockArg ? "✓ Yes" : "✗ No"}`);
console.log(`   Length:\t\t${cccLockArg.length - 2} hex chars (20 bytes)`);
console.log(`   Generation:\t\tCCC signer.getAddressObjSecp256k1().script.args vs blake2b().substring(0, 42).`);
console.log(`   Purpose:\t\tUnique identifier derived from public key to specify ownership.`);

// Use CCC lock arg for the rest of the demo.
const lockArg = cccLockArg;

// Step 4: Lock Script
// CCC built-in method (from address object we already have).
const cccLockScript = tempAddressObj.script;

// Manual construction for comparison.
const manualLockScript = new ccc.Script(
	"0x9bd7e06f3ecf4be0f2fcd2188b23f1b9fcc88e5d4b65a8637b17723bbda3cce8",
	"type",
	lockArg
);

console.log(`\n4. Lock Script:`);
console.log(`   CCC built-in:`);
console.log(`     codeHash:\t\t${cccLockScript.codeHash}`);
console.log(`     hashType:\t\t${cccLockScript.hashType}`);
console.log(`     args:\t\t${cccLockScript.args}`);
console.log(`   Manual construction:`);
console.log(`     codeHash:\t\t${manualLockScript.codeHash}`);
console.log(`     hashType:\t\t${manualLockScript.hashType}`);
console.log(`     args:\t\t${manualLockScript.args}`);
console.log(`   Match:\t\t${JSON.stringify(cccLockScript) === JSON.stringify(manualLockScript) ? "✓ Yes" : "✗ No"}`);
console.log(`   Generation:\t\tCCC signer.getAddressObjSecp256k1().script vs new ccc.Script().`);
console.log(`   Purpose:\t\tComplete specification of lock ownership rules.`);

// Use CCC lock script for the rest of the demo.
const lockScript = cccLockScript;

// Step 5: Lock Hash
const lockHash = lockScript.hash();
console.log(`\n5. Lock Hash:\t\t${lockHash}`);
console.log(`   Length:\t\t${lockHash.length - 2} hex chars (32 bytes)`);
console.log(`   Generation:\t\tCCC lockScript.hash().`);
console.log(`   Purpose:\t\tUnique fingerprint of the complete lock script.`);

// Step 6: Address
const addressObj = ccc.Address.fromScript(lockScript, client);
const address = addressObj.toString();
console.log(`\n6. Address:\t\t${address}`);
console.log(`   Length:\t\t${address.length} characters.`);
console.log(`   Generation:\t\tCCC Address.fromScript(lockScript, client).toString().`);
console.log(`   Purpose:\t\tHuman-readable encoding of the lock script for transactions.`);

// Summary
console.log(`\n${"=".repeat(80)}`);
console.log("TRANSFORMATION SUMMARY:");
console.log(`${"=".repeat(80)}`);
console.log("Private Key (32B) → secp256k1 (built-in vs standalone) → Public Key (33B).");
console.log("Public Key (33B) → ckbhash (blake160) → Lock Arg (20B).");
console.log("Lock Arg (20B) + codeHash + hashType → Lock Script.");
console.log("Lock Script → ckbHash(molecule_encode) → Lock Hash (32B).");
console.log("Lock Script (formatted) → bech32m encode → Address.");

// Completion Message
console.log(`\n${"=".repeat(80)}`);
console.log("Demo completed successfully!");
console.log(`${"=".repeat(80)}`);
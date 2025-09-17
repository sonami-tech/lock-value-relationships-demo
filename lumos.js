/**
 * CKB Lock Value Relationships Demo - Lumos Version
 * 
 * This demonstrates the complete chain of relationships between:
 * Private Key → Public Key → Lock Arg → Lock Script → Lock Hash → Address
 */

import fs from "fs";
import blake2b from "blake2b";
import secp256k1 from "secp256k1";
import { utils as lumosUtils } from "@ckb-lumos/base";
import { initializeConfig } from "@ckb-lumos/config-manager";
import { encodeToAddress, addressToScript } from "@ckb-lumos/helpers";
import { key } from "@ckb-lumos/hd";
import { hexToUint8Array, uint8ArrayToHex } from "./utils.js";

const { ckbHash, computeScriptHash } = lumosUtils;

// Setup - Load configuration and initialize Lumos.
const PRIVATE_KEY = "0xd00c06bfd800d27397002dca6fb0993d5ba6399b4238b2f29ee9deb97593d2bc";
const CONFIG = JSON.parse(fs.readFileSync("./config.json", "utf8"));
initializeConfig(CONFIG);

console.log("=".repeat(80));
console.log("CKB Lock Value Relationships Demo - Using Lumos Library");
console.log("=".repeat(80));

// Step 1: Private Key (32 bytes)
console.log(`\n1. Private Key:\t\t${PRIVATE_KEY}`);
console.log(`   Length:\t\t${PRIVATE_KEY.length - 2} hex chars (32 bytes)`);
console.log(`   Purpose:\t\tSecret key that is the basis of all derived values.`);

// Step 2: Public Key - Both Methods
const publicKeyBuiltIn = key.privateToPublic(PRIVATE_KEY);
const publicKeyStandalone = uint8ArrayToHex(secp256k1.publicKeyCreate(hexToUint8Array(PRIVATE_KEY)));
const publicKey = publicKeyStandalone; // Use standalone for rest of demo

console.log(`\n2. Public Key:`);
console.log(`   Lumos built-in:\t${publicKeyBuiltIn}`);
console.log(`   Secp256k1 lib:\t${publicKeyStandalone}`);
console.log(`   Match:\t\t${publicKeyBuiltIn === publicKeyStandalone ? "✓ Yes" : "✗ No"}`);
console.log(`   Length:\t\t${publicKey.length - 2} hex chars (33 bytes)`);
console.log(`   Generation:\t\tLumos key.privateToPublic() vs secp256k1.publicKeyCreate().`);
console.log(`   Purpose:\t\tPublic component of cryptographic key pair for digital signatures.`);

// Step 3: Lock Arg
const lockArg = ckbHash(publicKey).substring(0, 42); // 0x + 40 hex chars = 20 bytes

// Manual Lock Arg calculation for comparison.
const manualLockArg = uint8ArrayToHex(
	blake2b(32, null, null, new TextEncoder().encode("ckb-default-hash"))
		.update(hexToUint8Array(publicKey))
		.digest()
).substring(0, 42);

console.log(`\n3. Lock Arg:`);
console.log(`   Lumos built-in:\t${lockArg}`);
console.log(`   Manual calc:\t\t${manualLockArg}`);
console.log(`   Match:\t\t${lockArg === manualLockArg ? "✓ Yes" : "✗ No"}`);
console.log(`   Length:\t\t${lockArg.length - 2} hex chars (20 bytes)`);
console.log(`   Generation:\t\tLumos ckbHash().substring(0, 42) vs blake2b().substring(0, 42).`);
console.log(`   Purpose:\t\tUnique identifier derived from public key to specify ownership.`);

// Step 4: Lock Script
// Lumos built-in method (using helpers).
const tempAddress = encodeToAddress({
	codeHash: "0x9bd7e06f3ecf4be0f2fcd2188b23f1b9fcc88e5d4b65a8637b17723bbda3cce8",
	hashType: "type",
	args: lockArg
});
const lumosLockScript = addressToScript(tempAddress);

// Manual object construction for comparison.
const manualLockScript = {
	codeHash: "0x9bd7e06f3ecf4be0f2fcd2188b23f1b9fcc88e5d4b65a8637b17723bbda3cce8",
	hashType: "type",
	args: lockArg
};

console.log(`\n4. Lock Script:`);
console.log(`   Lumos built-in:`);
console.log(`     codeHash:\t\t${lumosLockScript.codeHash}`);
console.log(`     hashType:\t\t${lumosLockScript.hashType}`);
console.log(`     args:\t\t${lumosLockScript.args}`);
console.log(`   Manual construction:`);
console.log(`     codeHash:\t\t${manualLockScript.codeHash}`);
console.log(`     hashType:\t\t${manualLockScript.hashType}`);
console.log(`     args:\t\t${manualLockScript.args}`);
console.log(`   Match:\t\t${JSON.stringify(lumosLockScript) === JSON.stringify(manualLockScript) ? "✓ Yes" : "✗ No"}`);
console.log(`   Generation:\t\tLumos helpers.addressToScript() vs manual object construction.`);
console.log(`   Purpose:\t\tComplete specification of lock ownership rules.`);

// Use Lumos lock script for the rest of the demo.
const lockScript = lumosLockScript;

// Step 5: Lock Hash
const lockHash = computeScriptHash(lockScript);
console.log(`\n5. Lock Hash:\t\t${lockHash}`);
console.log(`   Length:\t\t${lockHash.length - 2} hex chars (32 bytes)`);
console.log(`   Generation:\t\tLumos utils.computeScriptHash(lockScript).`);
console.log(`   Purpose:\t\tUnique fingerprint of the complete lock script.`);

// Step 6: Address
const address = encodeToAddress(lockScript);
console.log(`\n6. Address:\t\t${address}`);
console.log(`   Length:\t\t${address.length} characters.`);
console.log(`   Generation:\t\tLumos helpers.encodeToAddress(lockScript).`);
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
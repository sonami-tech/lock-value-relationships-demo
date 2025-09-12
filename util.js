/**
 * Utility functions for CKB lock value relationships demo.
 */

/**
 * Convert hex string to Uint8Array
 * @param {string} hexString - Hex string (with or without 0x prefix)
 * @returns {Uint8Array}
 */
export function hexToUint8Array(hexString) {
	// Remove 0x prefix if present.
	const hex = hexString.startsWith('0x') ? hexString.slice(2) : hexString;
	
	// Convert hex to Uint8Array.
	const bytes = new Uint8Array(hex.length / 2);
	for (let i = 0; i < hex.length; i += 2) {
		bytes[i / 2] = parseInt(hex.substr(i, 2), 16);
	}
	
	return bytes;
}

/**
 * Convert Uint8Array to hex string
 * @param {Uint8Array} uint8Array
 * @returns {string} Hex string with 0x prefix
 */
export function uint8ArrayToHex(uint8Array) {
	return '0x' + Array.from(uint8Array)
		.map(b => b.toString(16).padStart(2, '0'))
		.join('');
}
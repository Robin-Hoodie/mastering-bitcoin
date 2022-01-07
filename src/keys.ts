import { ECPair } from "ecpair";
import { crypto, payments } from "bitcoinjs-lib";
import bs58check from "bs58check";

const { hash256, ripemd160 } = crypto;

export function main() {
  const { privateKey, publicKey } = ECPair.makeRandom({ compressed: false });
  const { address } = payments.p2pkh({ pubkey: publicKey });
  if (privateKey) {
    const privateKeyWithVersionPrefix = Buffer.concat([
      Buffer.alloc(1, 0x80),
      privateKey,
    ]);
    const privateKeyWithVersionPrefixCompressed = Buffer.concat([
      privateKeyWithVersionPrefix,
      Buffer.alloc(1, 0x01),
    ]);
    console.log(
      "Private key - without version prefix - (hex) is ",
      privateKey.toString("hex")
    );
    console.log(
      "Private key - with version prefix - (hex) is ",
      privateKeyWithVersionPrefix.toString("hex")
    );
    console.log(
      "Private key compressed - with version prefix - (hex) is ",
      privateKeyWithVersionPrefixCompressed.toString("hex")
    );
    console.log(
      "Private key (WIF) is ",
      bs58check.encode(privateKeyWithVersionPrefix)
    );
    console.log(
      "Private key (WIF compressed) is ",
      bs58check.encode(privateKeyWithVersionPrefixCompressed)
    );
    const publicKeyHex = publicKey.toString("hex");
    console.log("Public key (hex) is ", publicKeyHex);
    console.log("Public key (hex) length is ", publicKeyHex.length);
    const publicKeyHexWithoutPrefix = publicKeyHex.slice(2);
    console.log("Public key without prefix (hex)", publicKeyHexWithoutPrefix);
    console.log(
      "Public key x (hex) value is ",
      publicKeyHexWithoutPrefix.slice(0, publicKeyHexWithoutPrefix.length / 2)
    );
    const publicKeyHash = ripemd160(hash256(publicKey));
    const publicKeyHashWithVersionPrefix = Buffer.concat([
      Buffer.alloc(1, 0x00),
      publicKeyHash,
    ]);
    console.log(
      "Uncompressed address is ",
      bs58check.encode(publicKeyHashWithVersionPrefix)
    );
    console.log("Address from lib is ", address);
  }
}

import { ECPair } from "ecpair";
import bitcoin from "bitcoinjs-lib";
import bs58check from "bs58check";


function main() {
  const keyPair = ECPair.makeRandom();
  const { address } = bitcoin.payments.p2pkh({ pubkey: keyPair.publicKey });
  const privateKeyWithVersionPrefix = Buffer.concat([Buffer.alloc(1, 0x80), keyPair.privateKey]);
  const privateKeyWithVersionPrefixCompressed = Buffer.concat([privateKeyWithVersionPrefix, Buffer.alloc(1, 0x01)]);
  console.log("Private key - without version prefix - (hex) is ", keyPair.privateKey.toString("hex"));
  console.log("Private key - with version prefix - (hex) is ", privateKeyWithVersionPrefix.toString("hex"));
  console.log("Private key compressed - with version prefix - (hex) is ", privateKeyWithVersionPrefixCompressed.toString("hex"));
  console.log("Private key (WIF) is ", bs58check.encode(privateKeyWithVersionPrefix));
  console.log("private key (WIF compressed) is ", bs58check.encode(privateKeyWithVersionPrefixCompressed));
}

main();

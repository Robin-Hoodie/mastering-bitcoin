import { sha512 } from "../utils/hash";
import bs58check from "bs58check";
import { addBuffers } from "../utils/buffer";
import { ECPair } from "ecpair";
import { logChildKeys } from "./log";

const PREFIX_PRIVATE_KEY = Buffer.alloc(4, 0x0488ade4);
const PREFIX_PUBLIC_KEY = Buffer.alloc(4, 0x0488b21e);

const INDEX_MAX_CKD_NORMAL = Math.pow(2, 31) - 1;
const INDEX_MAX_CKD_HARDENED = Math.pow(2, 32) - 1;

export const toMasterPrivateKeyExtended = (
  privateKey: Buffer,
  chainCode: Buffer
) => Buffer.concat([privateKey, chainCode]);

export const toMasterPublicKeyExtended = (
  publicKey: Buffer,
  chainCode: Buffer
) => Buffer.concat([publicKey, chainCode]);

export const deriveChildKeysPrivateAndPublicNormal = (
  publicKey: Buffer,
  privateKey: Buffer,
  chainCode: Buffer,
  index: number
) => {
  if (index > INDEX_MAX_CKD_NORMAL) {
    throw new Error(
      `Max index to be used for normal CKD is ${INDEX_MAX_CKD_NORMAL}. Index given was ${index}`
    );
  }
  const indexAsBuffer = Buffer.alloc(32, index);
  const hash = sha512(Buffer.concat([publicKey, indexAsBuffer, chainCode]));
  const hashMiddleIndex = hash.length / 2;
  const childPrivateKey = addBuffers(
    privateKey,
    hash.slice(0, hashMiddleIndex)
  );
  const childChainCode = hash.slice(hashMiddleIndex);
  const { publicKey: childPublicKey } = ECPair.fromPrivateKey(childPrivateKey);
  logChildKeys(childPrivateKey, childPublicKey, childChainCode);
};

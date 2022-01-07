import { sha512 } from "../utils/hash";
import { addBuffers } from "../utils/buffer";
import { ECPair } from "ecpair";
import bs58check from "bs58check";

// See https://learnmeabitcoin.com/technical/extended-keys for more info

const MAX_INDEX_NUMBER = Math.pow(2, 32);

export const seedToMasterKeysAndChainCode = (seed: Buffer) => {
  const seedHash = sha512(seed);
  const {
    privateKey: masterPrivateKey,
    publicKey: masterPublicKey,
    chainCode: masterChainCode,
  } = privateKeyPublicKeyAndChainCode(seedHash);
  const extendedPrivateKey = toExtendedPrivateKey(
    masterPrivateKey,
    masterChainCode
  );
  const extendedPublicKey = toExtendedPublicKey(
    masterPublicKey,
    masterChainCode
  );
  return {
    masterPrivateKey,
    masterPublicKey,
    masterChainCode,
    extendedPrivateKey,
    extendedPublicKey,
  };
};

const toExtendedPrivateKey = (privateKey: Buffer, chainCode: Buffer) =>
  toExtendedKey(privateKey, chainCode, Buffer.alloc(4, 0x0488ade4));

const toExtendedPublicKey = (publicKey: Buffer, chainCode: Buffer) =>
  toExtendedKey(publicKey, chainCode, Buffer.alloc(4, 0x0488b21e));

//
const toExtendedKey = (key: Buffer, chainCode: Buffer, prefix: Buffer) =>
  bs58check.encode(Buffer.concat([prefix, key, chainCode]));

const deriveChildKey = (
  privateKey: Buffer,
  publicKey: Buffer,
  chainCode: Buffer,
  index: number
) => {
  const hash = sha512(
    Buffer.concat([publicKey, chainCode, Buffer.from(index.toString())])
  );
  return privateKeyPublicKeyAndChainCode(hash, privateKey);
};

const privateKeyPublicKeyAndChainCode = (
  hash: Buffer,
  parentPrivateKey?: Buffer
) => {
  const hashMiddleIndex = hash.length / 2;
  const hashFirstHalf = hash.slice(0, hashMiddleIndex);
  const hashSecondHalf = hash.slice(hashMiddleIndex);
  const privateKey = parentPrivateKey
    ? addBuffers(hashFirstHalf, parentPrivateKey)
    : hashFirstHalf;
  const chainCode = hashSecondHalf;
  const { publicKey } = ECPair.fromPrivateKey(privateKey);
  return {
    privateKey,
    publicKey,
    chainCode,
  };
};

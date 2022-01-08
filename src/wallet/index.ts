import { sha512 } from "../utils/hash";
import { logMasterKeys } from "./log";
import { ECPair } from "ecpair";
import {
  deriveChildKeysPrivateAndPublicNormal,
  toMasterPrivateKeyExtended,
  toMasterPublicKeyExtended,
} from "./extended-key";

// See https://learnmeabitcoin.com/technical/extended-keys for more info

export const seedToMasterKeysAndChainCode = (seed: Buffer) => {
  const {
    privateKey: masterPrivateKey,
    publicKey: masterPublicKey,
    chainCode: masterChainCode,
  } = privateKeyPublicKeyAndChainCode(seed);
  const masterPrivateKeyExtended = toMasterPrivateKeyExtended(
    masterPrivateKey,
    masterChainCode
  );
  const masterPublicKeyExtended = toMasterPublicKeyExtended(
    masterPublicKey,
    masterChainCode
  );
  logMasterKeys(
    masterPrivateKey,
    masterPublicKey,
    masterChainCode,
    masterPrivateKeyExtended,
    masterPublicKeyExtended
  );
  deriveChildKeysPrivateAndPublicNormal(
    masterPublicKey,
    masterPrivateKey,
    masterChainCode,
    0
  );
};

const privateKeyPublicKeyAndChainCode = (seed: Buffer) => {
  const hash = sha512(seed);
  const hashMiddleIndex = hash.length / 2;
  const privateKey = hash.slice(0, hashMiddleIndex);
  const chainCode = hash.slice(hashMiddleIndex);
  const { publicKey } = ECPair.fromPrivateKey(privateKey);
  return {
    privateKey,
    publicKey,
    chainCode,
  };
};

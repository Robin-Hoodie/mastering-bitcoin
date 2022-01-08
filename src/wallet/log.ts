import { bufferAsHex } from "../utils/buffer";

export const logMasterKeys = (
  masterPrivateKey: Buffer,
  masterPublicKey: Buffer,
  chainCode: Buffer,
  masterPrivateKeyExtended: Buffer,
  masterPublicKeyExtended: Buffer
) => {
  console.log(`Generated Master Private Key ${bufferAsHex(masterPrivateKey)}`);
  console.log(`Generated Master Public Key ${bufferAsHex(masterPublicKey)}`);
  console.log(`Generated Master Chain Code ${bufferAsHex(chainCode)}`);
  console.log(
    `Generated Master Private Key Extended ${bufferAsHex(
      masterPrivateKeyExtended
    )}`
  );
  console.log(
    `Generated Master Public Key Extended ${bufferAsHex(
      masterPublicKeyExtended
    )}`
  );
};

export const logChildKeys = (
  childPrivateKey: Buffer,
  childPublicKey: Buffer,
  childChainCode: Buffer
) => {
  console.log(`Generated Child Private Key ${childPrivateKey}`);
  console.log(`Generated Child Public Key ${childPublicKey}`);
  console.log(`Generated Child Chain Code ${childChainCode}`);
};

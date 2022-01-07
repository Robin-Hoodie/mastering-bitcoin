import { mnemonicToSeed } from "./bip39/mnemonic-to-seed";
import { entropyToMnemonic } from "./bip39/entropy-to-mnemonic";
import { seedToMasterKeysAndChainCode } from "./wallet";

const main = (entropyLengthBytes = 32, passPhrase = "") => {
  console.log(
    `Generating seed from entropy of ${
      entropyLengthBytes * 8
    } bits and a passphrase of ${passPhrase}`
  );
  const mnemonic = entropyToMnemonic(entropyLengthBytes);
  console.log('Generated mnemonic is "', mnemonic, '"');
  const seed = mnemonicToSeed(mnemonic, passPhrase);
  console.log("Generated seed is ", seed.toString("hex"));
  const {
    masterPrivateKey,
    masterPublicKey,
    masterChainCode,
    extendedPrivateKey,
    extendedPublicKey,
  } = seedToMasterKeysAndChainCode(seed);
  console.log("Master Private Key: ", masterPrivateKey.toString("hex"));
  console.log("Master Public Key:  ", masterPublicKey.toString("hex"));
  console.log("Master Chain Code:  ", masterChainCode.toString("hex"));
  console.log("Master Extended Private Key ", extendedPrivateKey);
  console.log("Master Extended Public Key", extendedPublicKey);
};

main();

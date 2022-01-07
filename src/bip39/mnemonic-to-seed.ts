import { pbkdf2Sync } from "pbkdf2";

export const mnemonicToSeed = (mnemonic: string, passPhrase: string) => {
  const salt = "mnemonic" + passPhrase;
  return pbkdf2Sync(mnemonic, salt, 2048, 64, "sha512");
};

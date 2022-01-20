import { mnemonicToSeed } from "./bip39/mnemonic-to-seed";
import { entropyToMnemonic } from "./bip39/entropy-to-mnemonic";
import { seedToMasterKeysAndChainCode } from "./wallet";
import { decodeTransaction } from "./transactions";
import { performProofOfWork } from "./pow";

// const generateWallet = (entropyLengthBytes = 32, passPhrase = "") => {
//   console.log(
//     `Generating seed from entropy of ${
//       entropyLengthBytes * 8
//     } bits and a passphrase of ${passPhrase}`
//   );
//   const mnemonic = entropyToMnemonic(entropyLengthBytes);
//   console.log('Generated mnemonic is "', mnemonic, '"');
//   const seed = mnemonicToSeed(mnemonic, passPhrase);
//   console.log("Generated seed is ", seed.toString("hex"));
//   seedToMasterKeysAndChainCode(seed);
// };

// const transaction = decodeTransaction(
//   "0100000001186f9f998a5aa6f048e51dd8419a14d8a0f1a8a2836dd734d2804fe65fa35779000000008b483045022100884d142d86652a3f47ba4746ec719bbfbd040a570b1deccbb6498c75c4ae24cb02204b9f039ff08df09cbe9f6addac960298cad530a863ea8f53982c09db8f6e381301410484ecc0d46f1918b30928fa0e4ed99f16a0fb4fde0735e7ade8416ab9fe423cc5412336376789d172787ec3457eee41c04f4938de5cc17b4a10fa336a8d752adfffffffff0260e31600000000001976a914ab68025513c3dbd2f7b92a94e0581f5d50f654e788acd0ef8000000000001976a9147f9b1a7fb68d60c536c2fd8aeaa53a8f3cc025a888ac00000000"
// );

// console.log("Decoded transaction is ", transaction);

performProofOfWork();
import fs from "fs";
import { webcrypto } from "crypto";
import { crypto } from "bitcoinjs-lib";
import {pbkdf2Sync } from "pbkdf2";

const SEGMENT_SIZE = 11;

const wordList = JSON.parse(fs.readFileSync("./word-list.json", "utf-8"));

const bufferToBitArray = (buffer) => Array.from(buffer).map(x => x.toString(2).padStart(8, "0")).join("").split("");

export function main(entropyLengthBytes = 32, passPhrase = "") {
  console.log(`Generating seed from entropy of ${entropyLengthBytes * 8} bits and a passphrase of ${passPhrase}`);
  const mnemonic = entropyToMnemonic(entropyLengthBytes);
  console.log("Generated mnemonic is ", mnemonic);
  const seed = mnemonicToSeed(mnemonic, passPhrase);
  console.log("Generated seed is ", seed.toString("hex"));
}

function entropyToMnemonic (entropyLengthBytes = 32) {
  const entropy = Buffer.alloc(entropyLengthBytes);
  webcrypto.getRandomValues(entropy);
  console.log("Generated entropy: ", entropy.toString("hex"));

  const checksum = crypto.sha256(entropy).slice(0, entropyLengthBytes / 32);
  console.log("Calculated checksum of entropy: ", checksum.toString("hex"));

  const randomSeedWithChecksum = Buffer.concat([entropy, checksum]);
  const randomSeedWithChecksumAsBits = bufferToBitArray(randomSeedWithChecksum);
  const randomSeedWithChecksumSegments = randomSeedWithChecksumAsBits.reduce((segments, bit, index) => {
    const segmentIndex = Math.floor(index / SEGMENT_SIZE);
    if (!segments[segmentIndex]) {
      segments[segmentIndex] = [];
    }
    segments[segmentIndex] = [...segments[segmentIndex], bit];
    return segments;
  }, []);
  const wordIndices = randomSeedWithChecksumSegments.map(segment => parseInt(segment.join(""), 2));
  return wordIndices.map(wordIndex => wordList[wordIndex]).join(" ");
}

function mnemonicToSeed (mnemonic, passPhrase) {
  const salt = "mnemonic" + passPhrase;
  return pbkdf2Sync(mnemonic, salt, 2048, 64, "sha512");
}

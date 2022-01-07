import fs from "fs";
import path from "path";
import { randomBytes } from "crypto";
import { sha256 } from "../utils/hash";
import { bufferToBitArray } from "../utils/buffer";

const SEGMENT_SIZE = 11;
const wordListPath = path.resolve(__dirname, "word-list.json");

const wordList = JSON.parse(fs.readFileSync(wordListPath, "utf-8"));

export const entropyToMnemonic = (entropyLengthBytes = 32) => {
  const entropy = randomBytes(entropyLengthBytes);
  console.log("Generated entropy: ", entropy.toString("hex"));

  const checksum = sha256(entropy).slice(0, entropyLengthBytes / 32);

  const randomSeedWithChecksum = Buffer.concat([entropy, checksum]);
  const randomSeedWithChecksumAsBits = bufferToBitArray(randomSeedWithChecksum);
  const randomSeedWithChecksumSegments = randomSeedWithChecksumAsBits.reduce<
    string[][]
  >((segments, bit, index) => {
    const segmentIndex = Math.floor(index / SEGMENT_SIZE);
    if (!segments[segmentIndex]) {
      segments[segmentIndex] = [];
    }
    segments[segmentIndex] = [...segments[segmentIndex], bit];
    return segments;
  }, []);
  const wordIndices = randomSeedWithChecksumSegments.map((segment) =>
    parseInt(segment.join(""), 2)
  );
  return wordIndices.map((wordIndex) => wordList[wordIndex]).join(" ");
};

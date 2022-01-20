import { createHash } from "crypto";
const maxNonce = 2 ** 32;

const proofOfWork = (header: string, difficultyBits: number) => {
  const target = 2 ** (256 - difficultyBits);
  for (let nonce = 0; nonce < maxNonce; nonce++) {
    const hashResult = parseInt(
      createHash("sha256")
        .update(header + nonce)
        .digest("hex"),
      16
    );
    if (hashResult < target) {
      console.log(`Success with nonce ${nonce}`);
      console.log(`Hash is ${hashResult}`);
      return {
        hashResult,
        nonce,
      };
    }
  }
  throw new Error(`Failed after ${maxNonce} tries`);
};

export const performProofOfWork = (maxDifficultyBits = 32) => {
  let prevHashResult = 0;
  for (
    let difficultyBits = 0;
    difficultyBits < maxDifficultyBits;
    difficultyBits++
  ) {
    const difficulty = 2 ** difficultyBits;
    const difficultyWithBits = `difficulty ${difficulty} (${difficultyBits} bits)`;
    console.log(difficultyWithBits);
    console.log("Starting search...");
    console.time(`Search with difficulty ${difficultyWithBits}`);
    const newBlock = `Test block with transactions ${prevHashResult}`;

    const startTime = Date.now();
    const { hashResult, nonce } = proofOfWork(newBlock, difficultyBits);
    const endTime = Date.now();
    const elapsedTime = endTime - startTime;
    const elapsedTimeInSeconds = elapsedTime / 1000;

    console.log(
      `Search for ${difficultyWithBits} took ${elapsedTimeInSeconds.toPrecision(
        4
      )} seconds`
    );
    prevHashResult = hashResult;
    const hashPower = Math.round(nonce / elapsedTimeInSeconds);
    console.log(`Hashing power ${hashPower} hashes per second`);
  }
};

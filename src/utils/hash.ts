import createHash from "create-hash";

export const sha256 = (buffer: Buffer | string) => sha(buffer, "sha256");
export const sha512 = (buffer: Buffer | string) => sha(buffer, "sha512");

const sha = (buffer: Buffer | string, hashType: "sha256" | "sha512") =>
  createHash(hashType).update(buffer).digest();

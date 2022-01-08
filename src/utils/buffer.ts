export const bufferToBitArray = (buffer: Buffer) =>
  Array.from(buffer)
    .map((x) => x.toString(2).padStart(8, "0"))
    .join("")
    .split("");

export const addBuffers = (bufferOne: Buffer, bufferTwo: Buffer) => {
  console.log("bufferOne", bufferOne.toString("hex"));
  console.log("bufferTwo", bufferTwo.toString("hex"));
  const sum = Number(bufferOne.toString()) + Number(bufferTwo.toString());
  const sumAsBuffer = Buffer.alloc(32);
  sumAsBuffer.write(sum.toString());
  return sumAsBuffer;
};

export const bufferAsHex = (buffer: Buffer) => buffer.toString("hex");

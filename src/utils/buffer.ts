export const bufferToBitArray = (buffer: Buffer) =>
  Array.from(buffer)
    .map((x) => x.toString(2).padStart(8, "0"))
    .join("")
    .split("");

export const addBuffers = (bufferOne: Buffer, bufferTwo: Buffer) => {
  const sum = Number(bufferOne.toString()) + Number(bufferTwo.toString());
  console.log("sum", sum);
  const sumAsBuffer = Buffer.alloc(32);
  sumAsBuffer.write(sum.toString());
  return sumAsBuffer;
};

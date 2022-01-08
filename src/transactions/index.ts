const CHARS_PER_BYTE = 2;
const CHARS_OUTPUT_VALUE = 8 * CHARS_PER_BYTE;
const CHARS_OUTPUT_LOCKING_SCRIPT_SIZE = 1 * CHARS_PER_BYTE; // This is actually 2-18
const CHARS_INPUT_TXID = 32 * CHARS_PER_BYTE;
const CHARS_INPUT_OUTPUT_INDEX = 4 * CHARS_PER_BYTE;
const CHARS_INPUT_UNLOCKING_SCRIPT_SIZE = 1 * CHARS_PER_BYTE; // This is actually 2-18
const CHARS_INPUT_SEQUENCE = 4 * CHARS_PER_BYTE;
const CHARS_INITIAL_OFFSET = 5 * CHARS_PER_BYTE;
const DEMARCATOR_INPUT_OUTPUT = Number(2).toString(16).padStart(2, "0");
const { length: DEMARCATOR_INPUT_OUTPUT_LENGTH } = DEMARCATOR_INPUT_OUTPUT;
const DEMARCATOR_END = "00000000";
const SATS_PER_BTC = 100000000;

export const decodeTransaction = (rawTransaction: string) => {
  const { inputs, outputIndexStart } = decodeInputs(rawTransaction);
  const outputs = decodeOutputs(rawTransaction, outputIndexStart);
  return {
    vin: inputs,
    vout: outputs,
  };
};

const decodeInputs = (rawTransaction: string) => {
  const inputs = [];
  let inputIndexStart = CHARS_INITIAL_OFFSET;
  while (true) {
    const { input, inputIndexEnd } = decodeInput(
      rawTransaction,
      inputIndexStart
    );
    inputs.push(input);
    const demarcatorInputOutputIndexStart = inputIndexEnd;
    const demarcatorInputOutputIndexEnd =
      demarcatorInputOutputIndexStart + DEMARCATOR_INPUT_OUTPUT_LENGTH;
    if (
      rawTransaction.slice(
        demarcatorInputOutputIndexStart,
        demarcatorInputOutputIndexEnd
      ) === DEMARCATOR_INPUT_OUTPUT
    ) {
      return {
        inputs,
        outputIndexStart: demarcatorInputOutputIndexEnd,
      };
    }
    inputIndexStart = inputIndexEnd;
  }
};

const decodeInput = (rawTransaction: string, indexStart: number) => {
  const txIndexStart = indexStart;
  const txIndexEnd = indexStart + CHARS_INPUT_TXID;
  const txId = convertToLE(rawTransaction.slice(txIndexStart, txIndexEnd)); // txId is stored in reverse order

  const vOutIndexStart = txIndexEnd;
  const vOutIndexEnd = vOutIndexStart + CHARS_INPUT_OUTPUT_INDEX;
  const vOut = rawTransaction.slice(vOutIndexStart, vOutIndexEnd);
  const vOutAsNumber = parseInt(vOut, 16);

  const unlockingScriptSizeIndexStart = vOutIndexEnd;
  const unlockingScriptSizeIndexEnd =
    unlockingScriptSizeIndexStart + CHARS_INPUT_UNLOCKING_SCRIPT_SIZE;
  const unlockingScriptSize = rawTransaction.slice(
    unlockingScriptSizeIndexStart,
    unlockingScriptSizeIndexEnd
  );
  const unlockingScriptSizeBytes = parseInt(unlockingScriptSize, 16);
  const scriptSigIndexStart = unlockingScriptSizeIndexEnd;
  const scriptSigIndexEnd =
    scriptSigIndexStart + unlockingScriptSizeBytes * CHARS_PER_BYTE;
  const scriptSig = rawTransaction.slice(
    scriptSigIndexStart,
    scriptSigIndexEnd
  );

  const sequenceIndexStart = scriptSigIndexEnd;
  const sequenceIndexEnd = sequenceIndexStart + CHARS_INPUT_SEQUENCE;
  const sequence = rawTransaction.slice(sequenceIndexStart, sequenceIndexEnd);
  const sequenceAsNumber = parseInt(sequence, 16);

  return {
    input: {
      txid: txId,
      vout: vOutAsNumber,
      scriptSig,
      sequence: sequenceAsNumber,
    },
    inputIndexEnd: sequenceIndexEnd,
  };
};

const decodeOutputs = (rawTransaction: string, indexStart: number) => {
  const outputs = [];
  let outputIndexStart = indexStart;
  while (true) {
    const { output, outputIndexEnd } = decodeOutput(
      rawTransaction,
      outputIndexStart
    );
    outputs.push(output);
    const demarcatorEndIndexStart = outputIndexEnd;
    if (rawTransaction.slice(demarcatorEndIndexStart) === DEMARCATOR_END) {
      return outputs;
    }
    outputIndexStart = outputIndexEnd;
  }
};

const decodeOutput = (rawTransaction: string, indexStart: number) => {
  const valueIndexStart = indexStart;
  const valueIndexEnd = valueIndexStart + CHARS_OUTPUT_VALUE;
  const value = convertToLE(
    rawTransaction.slice(valueIndexStart, valueIndexEnd)
  ); // Amount is stored reversed
  const valueInBtc = parseInt(value, 16) / SATS_PER_BTC;

  const lockingScriptSizeIndexStart = valueIndexEnd;
  const lockingScriptSizeIndexEnd =
    lockingScriptSizeIndexStart + CHARS_OUTPUT_LOCKING_SCRIPT_SIZE;
  const lockingScriptSize = rawTransaction.slice(
    lockingScriptSizeIndexStart,
    lockingScriptSizeIndexEnd
  );
  const lockingScriptSizeBytes = parseInt(lockingScriptSize, 16);

  const lockingScriptIndexStart = lockingScriptSizeIndexEnd;
  const lockingScriptIndexEnd =
    lockingScriptIndexStart + lockingScriptSizeBytes * CHARS_PER_BYTE;
  const lockingScript = rawTransaction.slice(
    lockingScriptIndexStart,
    lockingScriptIndexEnd
  );
  return {
    output: {
      value: valueInBtc,
      scriptPubKey: lockingScript,
    },
    outputIndexEnd: lockingScriptIndexEnd,
  };
};

const convertToLE = (hex: string) => {
  const hexBytes = hex.match(/[\da-f][\da-f]/g);
  if (!hexBytes) {
    throw new Error(`Amount ${hex} is not a hex string`);
  }
  return hexBytes.reverse().join("");
};

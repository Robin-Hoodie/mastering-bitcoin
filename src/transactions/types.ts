interface Input {
  txid: string;
  vout: number;
  scriptSig: string;
  sequence: number;
}

export interface InputWithIndexEnd {
  input: Input;
  indexEnd: number;
}

interface Output {
  value: number;
  scriptPubKey: string;
}

export interface OutputWithIndexEnd {
  output: Output;
  indexEnd: number;
}

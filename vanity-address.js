export function main(prefixWanted) {
  console.time("Vanity address generation");
  for (let tries = 1; tries++;) {
    const { publicKey } = ECPair.makeRandom();
    const { address } = bitcoin.payments.p2pkh({ pubkey: publicKey });
    if (tries % 1000 === 0) {
      console.log("Current amount of tries: ", tries);
    }
    if (address.slice(1).startsWith(prefixWanted)) {
      console.log(`Vanity address generation took ${tries} tries`);
      console.timeEnd("Vanity address generation");
      return address;
    }
  }
}

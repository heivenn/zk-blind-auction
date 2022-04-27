const wc = require('./witness_calculator.js');

export async function generateWitness(input) {
  const response = await fetch('../highestbidder.wasm');
  const buffer = await response.arrayBuffer();
  console.log(buffer);
  let buff;

  await wc(buffer).then(async (witnessCalculator) => {
    buff = await witnessCalculator.calculateWTNSBin(input, 0);
  });
  return buff;
}

import { generateWitness } from './generate_witness';
import { groth16 } from 'snarkjs';
import { utils } from 'ffjavascript';
import { parseEther } from 'ethers/lib/utils';

const { unstringifyBigInts } = utils;

// input should be like input.json
/**
 *
 * @param {*} input
 *
 */
export async function generateVerifierCalldata(input) {
  // const formatted = {
  //   blindedBids: input.blindedBids,
  //   bids: input.bids.map(([amount, secret]) => [parseEther(amount), secret]),
  // };
  // console.log({ formatted });
  let generateWitnessSuccess = true;
  let witness = await generateWitness(input)
    .then()
    .catch((error) => {
      console.error(error);
      generateWitnessSuccess = false;
    });
  if (!generateWitnessSuccess) {
    return;
  }
  // .zkey file is found in public folder
  const { proof, publicSignals } = await groth16.prove(
    '../highestbidder_final.zkey',
    witness
  );
  const editedPublicSignals = unstringifyBigInts(publicSignals);
  const editedProof = unstringifyBigInts(proof);
  const calldata = await groth16.exportSolidityCallData(
    editedProof,
    editedPublicSignals
  );

  const argv = calldata
    .replace(/["[\]\s]/g, '')
    .split(',')
    .map((x) => BigInt(x).toString());

  //console.log(argv);

  const a = [argv[0], argv[1]];
  const b = [
    [argv[2], argv[3]],
    [argv[4], argv[5]],
  ];
  const c = [argv[6], argv[7]];
  const Input = argv.slice(8);

  return [a, b, c, Input];
}

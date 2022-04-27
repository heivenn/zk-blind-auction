# Compile the circuit to get system of arithmetic equations representing it
# --r1cs: it generates the file multiplier2.r1cs that contains the R1CS constraint system of the circuit in binary format.
# --wasm: it generates the directory multiplier2_js that contains the Wasm code (multiplier2.wasm) and other files needed to generate the witness.
# --sym : it generates the file multiplier2.sym , a symbols file required for debugging or for printing the constraint system in an annotated mode.
# --c : it generates the directory multiplier2_cpp that contains several files (multiplier2.cpp, multiplier2.dat, and other common files for every compiled program like main.cpp, MakeFile, etc) needed to compile the C code to generate the witness.

echo "Compiling $1.circom"
circom $1.circom --r1cs --wasm --sym --verbose

# Gernating Snarks: trusted setup with Groth16 zk-SNARK
# 1. Powers of tau, independent of circuit
# 2. Phase 2, dependent on circuit

echo "Generating first zkey from hermez ptau file"
# generate .zkey file that contains proving and verification keys along with phase 2 contributions
snarkjs zkey new $1.r1cs powersOfTau28_hez_final_10.ptau $1_0000.zkey 

echo "Phase 2 of trusted setup"
# phase 2
# generation

# Contribute to the phase 2 of the ceremony --> generates final .zkey file
snarkjs zkey contribute $1_0000.zkey $1_final.zkey

# export the verification key
snarkjs zkey export verificationkey $1_final.zkey $1_verification_key.json

# Generating a proof
# compute the witness with web assembly
echo "Computing the witness"

node $1_js/generate_witness.js $1_js/$1.wasm $1_input.json $1_js/witness.wtns

# compute the witness with cpp
# make sure we have nlohmann-json3-dev, libgmp-dev and nasm
# cd $1_cpp
# make
# ./$1 input.json witness.wtns

echo "Generating proof"
snarkjs groth16 prove $1_final.zkey $1_js/witness.wtns $1_js/proof.json $1_js/public.json

echo "Verifying proof"
# verify a proof
snarkjs groth16 verify $1_verification_key.json $1_js/public.json $1_js/proof.json
# generate solidity verifier contract
snarkjs zkey export solidityverifier $1_final.zkey $1.sol
# generate solidity calldata
snarkjs zkey export soliditycalldata $1_js/public.json $1_js/proof.json

pragma circom 2.0.3;

include "../node_modules/circomlib/circuits/poseidon.circom";

// Prove that the revealed secret and value correspond to the blinded bid
template GetHighestBidder (nBids) {
    // blindedbid = Poseidon(value, secret)
    signal input blindedBids[nBids];

    // each bid has a value and secret
    signal input bids[nBids][2];

    signal output highestBid[2];
    signal output bidsWithValidityStatus[nBids];

    component hashes[nBids];
    var highestVal = 0;
    var highestBlindedBid = 0;
    for (var i = 0; i < nBids; i++) {
      hashes[i] = Poseidon(2);
      hashes[i].inputs[0] <== bids[i][0];
      hashes[i].inputs[1] <== bids[i][1];

      if (hashes[i].out == blindedBids[i]) {
        // bid was valid
        if (bids[i][0] > highestVal) {
          // bid value is higher than previously recorded bid
          highestVal = bids[i][0];
          highestBlindedBid = blindedBids[i];
        }
      }
      // 0 if bid was invalid, 1 if valid 
      bidsWithValidityStatus[i] <-- hashes[i].out == blindedBids[i];

    }
    log(highestVal);

  highestBid[0] <-- highestVal;
  highestBid[1] <-- highestBlindedBid;

}

component main { public [ blindedBids ] } = GetHighestBidder(4);

/* INPUT = {
    "blindedBids": ["14829661078755452231420445082416535460451393402374125723096801939703538813624", 
    "18492744225100146689686516206566825915834837132961559311973652074722466053781", 
    "2243820949055196761166884933669249247950111863991145656119364250341089250289", 
    "3087912"],
    "bids": [["10", "276493910927104206225793465378762856788547525410735445355386653182898671962"], 
    ["15", "145153374249673047216413803798375737926277454578172975255049250085490173295"], 
    ["22", "352275327439015942835713349749961149172466588155936243892021288726228976124"],
    ["2", "312"]]
} */
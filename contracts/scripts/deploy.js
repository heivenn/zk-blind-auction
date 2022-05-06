const main = async () => {
  const [auctioneer] =
    await hre.ethers.getSigners();

  // Circuit verifier contract
  const highestBidderContractFactory = await hre.ethers.getContractFactory(
    "HighestBidderVerifier"
  );
  const highestBidderVerifierContract =
    await highestBidderContractFactory.deploy();
  await highestBidderVerifierContract.deployed();
  console.log("Verifier deployed to:", highestBidderVerifierContract.address);

  // Blind auction contract implementation
  const blindAuctionContractFactory = await hre.ethers.getContractFactory(
    "BlindAuction"
  );
  //  address _verifierAddress,
  //  uint256 _biddingTime,
  //  uint256 _revealTime,
  //  address payable _beneficiaryAddress
  const blindAuctionContract = await blindAuctionContractFactory.deploy();
  await blindAuctionContract.deployed();
  console.log("Blind Auction deployed to:", blindAuctionContract.address);

  // Blind auction factory contract
  const blindAuctionFactoryContractFactory =
    await hre.ethers.getContractFactory("BlindAuctionFactory");
  const blindAuctionFactoryContract =
    await blindAuctionFactoryContractFactory.deploy(
      blindAuctionContract.address,
      highestBidderVerifierContract.address
    );
  await blindAuctionFactoryContract.deployed();
  console.log(
    "Blind Auction Factory deployed to:",
    blindAuctionFactoryContract.address
  );
};

const runMain = async () => {
  try {
    await main();
    process.exit(0);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

runMain();

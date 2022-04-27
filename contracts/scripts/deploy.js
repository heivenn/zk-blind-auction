const main = async () => {
  const [auctioneer, bidder1, bidder2, bidder3, fakebidder, seller] =
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

  let txn = await blindAuctionFactoryContract
    .connect(auctioneer)
    .createBlindAuctionProxy(30, 30, seller.address);
  const { events } = await txn.wait();
  const { args } = events.find(Boolean);
  const proxyAddress = args[0];

  txn = await blindAuctionFactoryContract.connect(auctioneer).getAllAuctions();
  console.log(proxyAddress, txn);
  txn = await blindAuctionFactoryContract.connect(auctioneer).getAuctionById(0);
  console.log(txn);
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

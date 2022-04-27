/* eslint-disable no-undef */
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

  const { interface } = await hre.ethers.getContractFactory("BlindAuction");
  const instance = new hre.ethers.Contract(proxyAddress, interface, auctioneer);
  txn = await instance
    .connect(bidder1)
    .bid("0x20C94A6CDBFACFE7727216C2A561D6D6F9BD263BAFD40D0D160D4180E9168AB8", {
      value: hre.ethers.utils.parseEther("1"),
    });
  await txn.wait();

  // second bidder bids
  txn = await instance
    .connect(bidder2)
    .bid("0x28E285B63A725D4DBCEEEFDC1E44501CC27C4427AE2DD58D259D3C567A0DBE95", {
      value: hre.ethers.utils.parseEther("1"),
    });
  await txn.wait();

  // oops, insufficient deposit test
  try {
    txn = await instance
      .connect(bidder3)
      .bid(
        "0x4F5F528A71BD198AAE6B4187263D0CAE82C5B780D10BBD7AFEDEB90B06C8BF1",
        {
          value: hre.ethers.utils.parseEther("0.5"),
        }
      );
    await txn.wait();
  } catch (error) {
    console.log("Insufficient deposit for the bid");
  }

  // Contract should have about 2 eth
  let balance = await hre.ethers.provider.getBalance(proxyAddress);
  console.log(
    "2 successful bids. Contract balance:",
    hre.ethers.utils.formatEther(balance)
  );

  // correct third bidder bid
  txn = await instance
    .connect(bidder3)
    .bid("0x04F5F528A71BD198AAE6B4187263D0CAE82C5B780D10BBD7AFEDEB90B06C8BF1", {
      value: hre.ethers.utils.parseEther("1"),
    });
  await txn.wait();

  // fourth bidder bid
  txn = await instance
    .connect(fakebidder)
    .bid("0x15C2BAF4667773E819DEAC25309D7B80DEADF27BE8207587D041DB197675372E", {
      value: hre.ethers.utils.parseEther("1"),
    });
  await txn.wait();

  balance = await hre.ethers.provider.getBalance(proxyAddress);
  console.log(
    "4 successful bids. Contract balance:",
    hre.ethers.utils.formatEther(balance)
  );

  // fast-forward to biddingEnd
  await hre.network.provider.send("evm_increaseTime", [30]);
  await hre.network.provider.send("evm_mine");

  // solidity calldata
  const [a, b, c, input] = [
    [
      "0x28df8d5a4a9ea9bfb87f51bc7d9b1402a2211b405e61e59c32f2400ca18da8cb",
      "0x26bee71673ccde0d5141e6a06c922006bbe6528b89dd460b6e7b373c38620177",
    ],
    [
      [
        "0x0815343184d9fb35244952934a950419d6a1051b9adc1236f7873fa3856d5423",
        "0x22af215ec5f59ff5c35222d8e89112cf1e2b74e04b6fc59f1c5227883cb24aae",
      ],
      [
        "0x2f43a1fb187f61dc10b171797ce730b0fd432fa3625c2b2521320cce0e783c8b",
        "0x24b192e12e9c3cf140df3a679fc6775357d5192a573738d4ab561e533a52d198",
      ],
    ],
    [
      "0x1d7662dd73e6089e17c7b8d363b1bf45f04ed7d1a90545cc6adc43140795589c",
      "0x2431058b37158b5bb12448f0857c16ab00afdeda02323c13ccb64bae5cbd5e72",
    ],
    [
      "0x000000000000000000000000000000000000000000000000000000000000000f",
      "0x28e285b63a725d4dbceeefdc1e44501cc27c4427ae2dd58d259d3c567a0dbe95",
      "0x0000000000000000000000000000000000000000000000000000000000000001",
      "0x0000000000000000000000000000000000000000000000000000000000000001",
      "0x0000000000000000000000000000000000000000000000000000000000000000",
      "0x0000000000000000000000000000000000000000000000000000000000000000",
      "0x20c94a6cdbfacfe7727216c2a561d6d6f9bd263bafd40d0d160d4180e9168ab8",
      "0x28e285b63a725d4dbceeefdc1e44501cc27c4427ae2dd58d259d3c567a0dbe95",
      "0x04f5f528a71bd198aae6b4187263d0cae82c5b780d10bbd7afedeb90b06c8bf1",
      "0x15c2baf4667773e819deac25309d7b80deadf27be8207587d041db197675372e",
    ],
  ];
  txn = await instance.connect(auctioneer).getHighestBidder(a, b, c, input);
  await txn.wait();

  const bidder1balance = await hre.ethers.provider.getBalance(bidder1.address);
  console.log(
    "First bidder balance:",
    hre.ethers.utils.formatEther(bidder1balance)
  );
  const bidder2balance = await hre.ethers.provider.getBalance(bidder2.address);
  console.log(
    "2nd bidder balance:",
    hre.ethers.utils.formatEther(bidder2balance)
  );
  const bidder3balance = await hre.ethers.provider.getBalance(bidder3.address);
  console.log(
    "3rd bidder balance:",
    hre.ethers.utils.formatEther(bidder3balance)
  );
  const lastbidderbalance = await hre.ethers.provider.getBalance(
    fakebidder.address
  );
  console.log(
    "4th bidder balance:",
    hre.ethers.utils.formatEther(lastbidderbalance)
  );

  // fast-forward to revealEnd
  await hre.network.provider.send("evm_increaseTime", [30]);
  await hre.network.provider.send("evm_mine");

  // bidder 2 won, has to pay
  txn = await instance.connect(bidder2).winnerPay({
    value: hre.ethers.utils.parseEther("14"),
  });
  await txn.wait();

  // fast-forward to paymentEnd
  await hre.network.provider.send("evm_increaseTime", [259200]);
  await hre.network.provider.send("evm_mine");
  const winnerBalance = await hre.ethers.provider.getBalance(bidder2.address);
  console.log("winner balance:", hre.ethers.utils.formatEther(winnerBalance));

  // end auction, seller gets funds transferred
  txn = await instance.connect(auctioneer).auctionEnd();
  await txn.wait();
  const sellerBalance = await hre.ethers.provider.getBalance(seller.address);
  console.log("seller balance:", hre.ethers.utils.formatEther(sellerBalance));
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

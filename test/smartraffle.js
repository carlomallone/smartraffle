var SmartRaffle = artifacts.require("./SmartRaffle.sol");

contract('SmartRaffle', accounts => {
  let finneyToWei = (amount) => {
    return amount*1000000000000000
  }

  let contract

  beforeEach(async () => {
    contract = await SmartRaffle.new(
      finneyToWei(10),
      finneyToWei(1000),
      finneyToWei(1500)
    )
  });

  it("should correct ly calculate entries for a 150 finney bet", async () => {
    let result = await contract.ticketsNumberForBet.call(finneyToWei(150));
    assert.equal(result, 15);
  })

  it("should correctly calculate entries for a 10 finney bet", async () => {
    let result = await contract.ticketsNumberForBet.call(finneyToWei(10));
    assert.equal(result, 1);
  })

  it("should correctly calculate entries for a 1000 finney bet", async () => {
    let result = await contract.ticketsNumberForBet.call(finneyToWei(1000));
    assert.equal(result, 100);
  })

  it("should have a initial jackpot of 0 finney", async () => {
    assert.equal(await contract.jackpot.call(), 0);
  })

  it("should have a capped jackpot of 1500 finney", async () => {
    assert.equal(await contract.jackpotLimit.call(), finneyToWei(1500));
  })

  it("should correctly handle jackpot limits", async () => {
    assert.equal(await contract.jackpotLimit.call(), finneyToWei(1500));

    let account_one = accounts[0];
    let account_two = accounts[1];
    let account_three = accounts[2];

    await contract.placeBet({ from: account_one, value: finneyToWei(100) });
    assert.equal(await contract.jackpot.call(), finneyToWei(100))

    await contract.placeBet({ from: account_two, value: finneyToWei(1000) });
    assert.equal(await contract.jackpot.call(), finneyToWei(1100))

    await contract.placeBet({ from: account_three, value: finneyToWei(450) });
    assert.equal(await contract.jackpot.call(), finneyToWei(0))

    // UPDATE: It can't fail since as soon as jackpot limit is hit
    //         the prize is sent therefore the jackpot is zeroed
    //         and the transaction takes place for the next run
    // Now we're over the jackpot limit of 1500 finney so it must fail
    // try {
    //   await contract.placeBet({ from: account_one, value: finneyToWei(10) });
    // } catch (e) {
    //   return true;
    // }

    // throw new Error("Test failed")
  })

  it("should correctly set default minimum and maximum bet", async () => {
    assert.equal(await contract.minimumBet.call(), finneyToWei(10))
    assert.equal(await contract.maximumBet.call(), finneyToWei(1000))
  })

  it("should accept a bet within boundaries", async () => {
    assert.equal(await contract.jackpot.call(), 0)
    let account_one = accounts[0];
    let betAmount = finneyToWei(100);

    await contract.placeBet({ from: account_one, value: betAmount });
    let jackpot = await contract.jackpot.call()
    assert.equal(jackpot, finneyToWei(100))
  })

  it("should not accept a bet below minimumBet", async () => {
    let account_one = accounts[0];
    let betAmount = finneyToWei(5);

    try {
      await contract.placeBet({ from: account_one, value: betAmount });
    } catch (e) {
      return true;
    }

    throw new Error("Test failed")
  })

  it("should not accept a bet over maximumBet", async () => {
    let account_one = accounts[0];
    let betAmount = finneyToWei(2000);

    try {
      await contract.placeBet({ from: account_one, value: betAmount });
    } catch (e) {
      return true;
    }

    throw new Error("Test failed")
  })
});

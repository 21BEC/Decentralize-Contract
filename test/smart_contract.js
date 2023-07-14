const { expect } = require("chai");

describe("Smart Contract", function () {
  let SMART_CONTRACT;
  let smart_contract;
  let owner;
  let alice;

  before(async function () {
    SMART_CONTRACT = await ethers.getContractFactory("SMART_CONTRACT");
  });

  beforeEach(async function () {
    [owner, alice] = await ethers.getSigners();

    smart_contract = await SMART_CONTRACT.deploy();
    await smart_contract.deployed();
  });

  it("Should deposit funds", async function () {
    const depositAmount = ethers.utils.parseEther("1.0");
    await smart_contract.deposit({ value: depositAmount });

    const balance = await smart_contract.getBalance();
    expect(balance).to.equal(depositAmount);
  });

  it("Should withdraw funds", async function () {
    const depositAmount = ethers.utils.parseEther("2.0");
    await smart_contract.deposit({ value: depositAmount });

    const withdrawAmount = ethers.utils.parseEther("1.0");
    await smart_contract.withdraw(withdrawAmount);

    const balance = await smart_contract.getBalance();
    expect(balance).to.equal(depositAmount.sub(withdrawAmount));
  });

  it("Should not allow withdrawal if balance is insufficient", async function () {
    const depositAmount = ethers.utils.parseEther("0.5");
    await smart_contract.deposit({ value: depositAmount });

    const withdrawAmount = ethers.utils.parseEther("1.0");
    await expect(smart_contract.withdraw(withdrawAmount)).to.be.revertedWith(
      "Insufficient balance"
    );
  });

  it("Should get the balance of an account", async function () {
    const depositAmount = ethers.utils.parseEther("1.5");
    await smart_contract.deposit({ value: depositAmount });

    const balance = await smart_contract.getBalance();
    expect(balance).to.equal(depositAmount);
  });
});

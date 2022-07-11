const { inputToConfig } = require("@ethereum-waffle/compiler")
const { deployments, ethers, getNamedAccounts, network } = require("hardhat")
const { expect, assert } = require("chai")

describe("Lottery", async function () {
  let lottery
  let deployer
  let interval
  const sValue = "100000000000000000" // 0.1 eth
  beforeEach(async function () {
    deployer = (await getNamedAccounts()).deployer
    await deployments.fixture(["all"])
    lottery = await ethers.getContract("Lottery", deployer)
    interval = await lottery.getInterval()
  })

  describe("constructor", async function () {
    it("Inits lottery properly", async function () {
      const CurrentState = await lottery.getLotteryState()
      assert.equal(CurrentState.toString(), "0")
    })
  })

  describe("EnterLottery", async function () {
    it("fails if user doesnt use enough eth", async function () {
      await expect(lottery.EnterLottery()).to.be.reverted
    })
    it("fails when trying to input the same address", async function () {
      await lottery.EnterLottery({ value: sValue })
      await expect(lottery.EnterLottery({ value: sValue })).to.be.reverted
    })
    it("adds address to the entries array", async function () {
      await lottery.EnterLottery({ value: sValue })
      const response = await lottery.viewContestant(0)
      assert.equal(response, deployer)
    })
    it("emits event on enter", async function () {
      await expect(lottery.EnterLottery({ value: sValue })).to.emit(
        lottery,
        "EnteredLottery"
      )
    })
    it("fails to open when lottery is closed", async function () {
      await lottery.EnterLottery({ value: sValue })
      await network.provider.send("evm_increaseTime", [interval.toNumber() + 1])
      await network.provider.send("evm_mine", [])
      await lottery.performUpkeep([])
      await expect(lottery.EnterLottery({ value: sValue })).to.be.reverted
    })
  })
})

const { ethers } = require("hardhat")
const fs = require("fs")

const FRONT_END_ADDY = "../lotteryfrontend/constants/contractAdresses.json"
const FRONT_END_ABI = "../lotteryfrontend/constants/abi.json"

module.exports = async function () {
  if (process.env.UPDATE_FRONT_END) {
    updateContractAdresses()
    updateAbi()
  }
}

async function updateAbi() {
  const lottery = await ethers.getContract("Lottery")
  fs.writeFileSync(
    FRONT_END_ABI,
    lottery.interface.format(ethers.utils.FormatTypes.json)
  )
}

async function updateContractAdresses() {
  const lottery = await ethers.getContract("Lottery")
  const chainId = network.config.chainId.toString()
  const currentAddresses = JSON.parse(fs.readFileSync(FRONT_END_ADDY, "utf8"))
  if (chainId in currentAddresses) {
    if (!currentAddresses[chainId].includes(lottery.address)) {
      currentAddresses[chainId].push(lottery.address)
    }
  }
  {
    currentAddresses[chainId] = [lottery.address]
  }
  fs.writeFileSync(FRONT_END_ADDY, JSON.stringify(currentAddresses))
}

module.exports.tags = ("all", "frontend")

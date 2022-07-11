const networkConfig = {
  4: {
    name: "goerli",
    vrfCoordinatorV2: "",
    gasLane:
      "0xd89b2bf150e3b9e13446986e571fb9cab24b13cea0a43ea20a6049a85cc807cc",
  },
  1337: {
    name: "hardhat",
    gasLane:
      "0xd89b2bf150e3b9e13446986e571fb9cab24b13cea0a43ea20a6049a85cc807cc",
    callbackGasLimit: "500000",
    interval: "30",
  },
}

const developmentChains = ["hardhat", "localhost", "goerli"]

module.exports = {
  networkConfig,
  developmentChains,
}

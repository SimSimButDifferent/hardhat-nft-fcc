// fulfill random words.

const { assert } = require("chai")
const { network, deployments, ethers, getNamedAccounts } = require("hardhat")
const { isCallTrace } = require("hardhat/internal/hardhat-network/stack-traces/message-trace")
const { developmentChains } = require("../helper-hardhat-config")

!developmentChains.includes(network.name)
    ? describe.skip
    : describe("Random Ipfs NFT unit tests", async function () {
          let basicNft, deployer
          chainId = network.config.chainId

          beforeEach(async function () {
              accounts = await ethers.getSigners()
              deployer = (await getNamedAccounts()).deployer
              await deployments.fixture(["mocks", "randomipfs"])
              randomIpfsNft = await ethers.getContract("RandomipfsNft")
              vrfCoordinatorV2Mock = await ethers.getContract("VRFCoordinatorV2Mock", deployer)
              mintFee = await randomIpfsNft.getMintFee()
          })

          describe("constructor", async function () {
              it("initialises NFT correctly")
          })
      })

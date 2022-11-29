const { assert } = require("chai")
const { network, deployments, ethers, getNamedAccounts } = require("hardhat")
const { developmentChains } = require("../helper-hardhat-config")

!developmentChains.includes(network.name)
    ? describe.skip
    : describe("BasicNFT unit tests", async function () {
          let basicNft, deployer
          chainId = network.config.chainId

          beforeEach(async function () {
              accounts = await ethers.getSigners()
              deployer = accounts[0]
              await deployments.fixture(["mocks", "basicnft"])
              basicNft = await ethers.getContract("BasicNFT")
          })

          describe("constructer", function () {
              it("Mints NFT succesfully and updates properly", async function () {
                  const txResponse = await basicNft.mintNft()
                  await txResponse.wait(1)
                  const tokenURI = await basicNft.tokenURI(0)
                  tokenCounter = await basicNft.getTokenCounter()
                  assert.equal(tokenCounter.toString(), "0")
              })
          })
      })

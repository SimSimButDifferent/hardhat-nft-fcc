const { assert } = require("chai")
const { network, deployments, ethers } = require("hardhat")
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

          describe("constructer", async function () {
              it("Initializes NFT correctly", async function () {
                  const name = await basicNft.name()
                  const symbol = await basicNft.symbol()
                  const tokenCounter = await basicNft.getTokenCounter()

                  assert.equal(name, "Dogie")
                  assert.equal(symbol, "Dog")
                  assert.equal(tokenCounter, "0")
              })
          })

          describe("Mint NFT", async function () {
              beforeEach(async function () {
                  const txResponse = await basicNft.mintNft()
                  await txResponse.wait(1)
              })

              it("Mints NFT succesfully and updates properly", async function () {
                  const tokenURI = await basicNft.tokenURI(0)
                  const tokenCounter = await basicNft.getTokenCounter()

                  assert.equal(tokenCounter.toString(), "1")
                  assert.equal(tokenURI, await basicNft.TOKEN_URI())
              })

              it("Shows correct balance and owner of NFT", async function () {
                  const deployerAddress = deployer.address
                  const deployerBalance = await basicNft.balanceOf(deployerAddress)
                  const owner = await basicNft.ownerOf("1")

                  assert.equal(deployerBalance.toString(), "1")
                  assert.equal(owner, deployerAddress)
              })
          })
      })

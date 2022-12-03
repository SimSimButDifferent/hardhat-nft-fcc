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

          describe("constructer", async function () {
              it("Mints NFT succesfully and updates properly", async function () {
                  const txResponse = await basicNft.mintNft()
                  await txResponse.wait(1)
                  tokenCounter = await basicNft.getTokenCounter()
                  assert.equal(tokenCounter.toString(), "1")
              })
          })

          describe("Token URI", async function () {
              it("Has the correct token URI", async function () {
                  const tokenURI = await basicNft.tokenURI(0)
                  assert.equal(
                      tokenURI,
                      "ipfs://bafybeig37ioir76s7mg5oobetncojcm3c3hxasyd4rvid4jqhy4gkaheg4/?filename=0-PUG.json"
                  )
              })
          })
      })

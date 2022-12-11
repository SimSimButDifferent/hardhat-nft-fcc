// fulfill random words.

const { assert } = require("chai")
const { network, deployments, ethers, getNamedAccounts } = require("hardhat")
const { developmentChains } = require("../helper-hardhat-config")

!developmentChains.includes(network.name)
    ? describe.skip
    : describe("Random Ipfs NFT unit tests", function () {
          let randomIpfsNft, deployer, accounts, mintFee, vrfCoordinatorV2Mock
          chainId = network.config.chainId

          beforeEach(async function () {
              accounts = await ethers.getSigners()
              deployer = accounts[0]
              await deployments.fixture(["mocks", "randomipfs"])
              randomIpfsNft = await ethers.getContract("RandomipfsNft")
              vrfCoordinatorV2Mock = await ethers.getContract("VRFCoordinatorV2Mock", deployer)
              mintFee = await randomIpfsNft.getMintFee()
          })

          describe("constructor", function () {
              it("initialises NFT correctly", async function () {
                  const dogTokenUriZero = await randomIpfsNft.getDogTokenUris(0)
                  const initialized = await randomIpfsNft.getInitialized()
                  assert(dogTokenUriZero.includes("ipfs://"))
                  assert.equal(initialized, true)
              })
          })
      })

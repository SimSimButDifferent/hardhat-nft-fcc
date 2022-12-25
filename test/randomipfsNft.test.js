// fulfill random words.

const { assert, expect } = require("chai")
const { network, deployments, ethers, getNamedAccounts } = require("hardhat")
const { developmentChains, networkConfig } = require("../helper-hardhat-config")

!developmentChains.includes(network.name)
    ? describe.skip
    : describe("Random Ipfs NFT unit tests", function () {
          let randomIpfsNft, deployer, accounts, vrfCoordinatorV2Mock
          chainId = network.config.chainId

          beforeEach(async function () {
              accounts = await ethers.getSigners()
              deployer = accounts[0]
              await deployments.fixture(["mocks", "randomipfs"])
              randomIpfsNft = await ethers.getContract("RandomipfsNft")
              vrfCoordinatorV2Mock = await ethers.getContract("VRFCoordinatorV2Mock", deployer)
          })

          describe("constructor", function () {
              it("initialises NFT correctly", async function () {
                  const dogTokenUriZero = await randomIpfsNft.getDogTokenUris(0)
                  const initialized = await randomIpfsNft.getInitialized()
                  const name = await randomIpfsNft.name()
                  const symbol = await randomIpfsNft.symbol()
                  assert(dogTokenUriZero.includes("ipfs://"))
                  assert.equal(initialized, true)
                  assert.equal(name, "Random IPFS NFT")
                  assert.equal(symbol, "RAN")
              })
          })

          describe("request nft", function () {
              it("reverts when payment not sent", async function () {
                  await expect(randomIpfsNft.requestNft()).to.be.revertedWith(
                      "RandomipfsNft__NeedMoreETHSent"
                  )
              })

              it("reverts if payment amount is less than the mint fee", async function () {
                  const mintFee = await randomIpfsNft.getMintFee()
                  await expect(
                      randomIpfsNft.requestNft({
                          value: mintFee.sub(ethers.utils.parseEther("0.001")),
                      })
                  ).to.be.revertedWith("RandomipfsNft__NeedMoreETHSent")
              })

              it("emits an event begins a random word request", async function () {
                  const mintFee = await randomIpfsNft.getMintFee()
                  await expect(
                      randomIpfsNft.requestNft({
                          value: mintFee.toString(),
                      })
                  ).to.emit(randomIpfsNft, "NftRequested")
              })
          })

          describe("fulfillRandomWords", function () {
              it("mints an NFT after a random number is returned", async function () {
                  await new Promise(async (resolve, reject) => {
                      randomIpfsNft.once("NftMinted", async function () {
                          try {
                              const tokenURI = await randomIpfsNft.tokenURI(0)
                              const tokenCounter = await randomIpfsNft.getTokenCounter()
                              assert.equal(tokenURI.toString().includes("ipfs://"), true)
                              assert.equal(tokenCounter.toString(), "1")
                              resolve()
                          } catch (e) {
                              console.log(e)
                              reject(e)
                          }
                      })
                      try {
                          const fee = await randomIpfsNft.getMintFee()
                          const requestNftResponse = await randomIpfsNft.requestNft({
                              value: fee.toString(),
                          })
                          const requestReciept = await requestNftResponse.wait(1)
                          await vrfCoordinatorV2Mock.fulfillRandomWords(
                              requestReciept.events[1].args.requestId,
                              randomIpfsNft.address
                          )
                      } catch (e) {
                          console.log(e)
                          reject(e)
                      }
                  })
              })
          })

          describe("getBreedFromModedRng", function () {
              it("Should return a Pug if rng is less than 10", async function () {
                  const expectedValue = await randomIpfsNft.getBreedFromModdedRng(7)
                  assert.equal(0, expectedValue)
              })

              it("Should return a Shiba-Inu if rng is between 10 - 39", async function () {
                  const expectedValue = await randomIpfsNft.getBreedFromModdedRng(24)
                  assert.equal(1, expectedValue)
              })

              it("Should return a St. Bernard if rng is less than 40 - 99", async function () {
                  const expectedValue = await randomIpfsNft.getBreedFromModdedRng(87)
                  assert.equal(2, expectedValue)
              })

              it("Should revert in rng returns anything above 99", async function () {
                  await expect(randomIpfsNft.getBreedFromModdedRng(100)).to.be.revertedWith(
                      "RandomipfsNft__RangeOutOfBounds"
                  )
              })
          })
      })

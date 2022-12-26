const { ethers, network, getNamedAccounts } = require("hardhat")
const { resolve } = require("path")
const { developmentChains, networkConfig } = require("../helper-hardhat-config")

module.exports = async function ({ getNamedAccounts }) {
    const { deployer } = await getNamedAccounts()
    chainId = network.config.chainId

    // Basic NFT
    const basicNft = await ethers.getContract("BasicNFT", deployer)
    const basicMintTx = await basicNft.mintNft()
    await basicMintTx.wait(1)
    console.log(`Basic NFT index 0 has tokenURI: ${await basicNft.tokenURI(0)}`)

    // Random Ipfs NFT
    const randomIpfsNft = await ethers.getContract("RandomipfsNft", deployer)
    const mintFee = await randomIpfsNft.getMintFee()
    const randomMintNftTx = await randomIpfsNft.requestNft({ value: mintFee.toString() })
    const randomMintNftTxReciept = await randomMintNftTx.wait(1)

    await new Promise(async (resolve, reject) => {
        setTimeout(() => reject("Timeout: 'NFTMinted' event did not fire"), 300000) // 5 mins
        randomIpfsNft.once("NftMinted", async function () {
            resolve()
        })
        if (developmentChains.includes(network.name)) {
            const requestId = randomMintNftTxReciept.events[1].args.requestId.toString()
            const vrfCoordinatorV2Mock = await ethers.getContract("VRFCoordinatorV2Mock", deployer)
            await vrfCoordinatorV2Mock.fulfillRandomWords(requestId, randomIpfsNft.address)
        }
    })
    console.log(`Random IPFS NFT index 0 tokenURI: ${await randomIpfsNft.tokenURI(0)}`)

    // Dynamic Svg NFT
    const highVal = ethers.utils.parseEther("2000")
    const dynamicSvgNft = await ethers.getContract("DynamicSvgNft", deployer)
    const dynamicMintNftTx = await dynamicSvgNft.mintNft(highVal)
    await dynamicMintNftTx.wait(1)
    console.log(`Dynamic SVG NFT index 0 tokenURI: ${await dynamicSvgNft.tokenURI(0)}`)
}

module.exports.tags = ["all", "mint"]

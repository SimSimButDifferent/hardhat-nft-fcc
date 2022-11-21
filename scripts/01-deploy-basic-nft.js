const { network } = require("hardhat")
const { developmentchains } = require("../helper-hardhat-config")
const { verify } = require("../utils/verify")

async function main() {}

main().catch((error) => {
    console.error(error)
    process.exitCode = 1
})

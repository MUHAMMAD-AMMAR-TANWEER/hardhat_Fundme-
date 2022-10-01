const { deployments, ethers, getNamedAccounts } = require("hardhat")
const { assert } = require("chai")
describe("FundMe test", async function () {
    let fundMe
    let deployer
    let mockV3Aggregator
    beforeEach(async function () {
        deployer = (await getNamedAccounts()).deployer //account which will be deploying
        await deployments.fixture(["all"]) //this line will give us latest deployment
        fundMe = await ethers.getContract("FundMe", deployer) // get the contract
        mockV3Aggregator = await ethers.getContract(
            "MockV3Aggregator",
            deployer
        )
    })

    describe("constructor ", async function () {
        it("sets the aggregator address correctly", async function () {
            const response = await fundMe.priceFeed()
            assert.equal(response, mockV3Aggregator.address)
        })
    })
})

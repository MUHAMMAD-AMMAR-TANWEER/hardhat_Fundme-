const { deployments, ethers, getNamedAccounts } = require("hardhat")
const { assert, expect } = require("chai")
const { developmentChains } = require("../../helper-hardhat-cofig")

!developmentChains.includes(network.name) 
? describe.skip
:describe("FundMe test", async function () {
    let fundMe
    let deployer
    let mockV3Aggregator
    const sendValue = ethers.utils.parseEther("1")
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
            const response = await fundMe.getPriceFeed()
            assert.equal(response, mockV3Aggregator.address)
        })
    })

    describe("fund", async function () {
        it("Fails when you don't send enough ETH", async function (){
            await expect(fundMe.fund()).to.be.revertedWith(
                "You need to spend more ETH!"
            )
        })
        it("updated the amount funded data structure", async function (){
            await fundMe.fund({value:sendValue})
            const response = await fundMe.getAddressToAmountFunded(deployer)
            assert.equal(response.toString(), sendValue.toString())
            }
        )
        it("Adds funders to fund array", async function () {
            await fundMe.fund({value:sendValue})
            const funder = await fundMe.getFunder(0)
            assert.equal(funder, deployer)
        })



    })


    describe("withdraw ", async function (){
        beforeEach(async function () {
            await fundMe.fund({value: sendValue})
        }) 
        it("Withdraw ETH from contract", async function (){
            //Arrange
            const startingFundMeBalance = await fundMe.provider.getBalance(
                fundMe.address
            )
            const startingDeployerBalance = await fundMe.provider.getBalance(
                deployer
            )
            //Act

            const transactionResponse  = await fundMe.withdraw()
            const transactionRecipt = await transactionResponse.wait(1)
            const {gasUsed , effectiveGasPrice} = transactionRecipt
            const gasCost = gasUsed.mul(effectiveGasPrice)

            //Test

            const endingFundMeBalance = await fundMe.provider.getBalance(
                fundMe.address
            )
            const endingDeployerBalance = await fundMe.provider.getBalance(
                deployer
            )

            assert.equal(endingFundMeBalance,0)
            assert.equal(startingDeployerBalance.add(startingFundMeBalance).toString(), endingDeployerBalance.add(gasCost).toString())
        })

        it("Allows us to withdraw with multiple funders", async function() {
            const accounts = await ethers.getSigners()
            for (let i=1; i<6; i++){
                const fundMeConnectedContract = await fundMe.connect( accounts[i])
                await fundMeConnectedContract.fund({value:sendValue})
            }

            const startingFundMeBalance = await fundMe.provider.getBalance(
                fundMe.address
            )
            const startingDeployerBalance = await fundMe.provider.getBalance(
                deployer
            )

            const transactionResponse  = await fundMe.withdraw()
            const transactionRecipt = await transactionResponse.wait(1)
            const {gasUsed , effectiveGasPrice} = transactionRecipt
            const gasCost = gasUsed.mul(effectiveGasPrice)

            
            const endingFundMeBalance = await fundMe.provider.getBalance(
                fundMe.address
            )
            const endingDeployerBalance = await fundMe.provider.getBalance(
                deployer
            )

            assert.equal(endingFundMeBalance,0)
            assert.equal(startingDeployerBalance.add(startingFundMeBalance).toString(), endingDeployerBalance.add(gasCost).toString())

            await expect(fundMe.getFunder(0)).to.be.reverted

            for (let i=1;i<6;i++){
                assert.equal(await fundMe.getAddressToAmountFunded(accounts[i].address),0)
            }




        })
        it("Only owner allowed to withdraw", async function (){
            const accounts = await ethers.getSigners()
            const fundMeConnectedContract = await fundMe.connect(
                accounts[1]
            )
            await expect(
                fundMeConnectedContract.withdraw()
            ).to.be.reverted

        })

        it("cheaper Withdraw pending..........", async function() {
            const accounts = await ethers.getSigners()
            for (let i=1; i<6; i++){
                const fundMeConnectedContract = await fundMe.connect( accounts[i])
                await fundMeConnectedContract.fund({value:sendValue})
            }

            const startingFundMeBalance = await fundMe.provider.getBalance(
                fundMe.address
            )
            const startingDeployerBalance = await fundMe.provider.getBalance(
                deployer
            )

            const transactionResponse  = await fundMe.cheapWithDraw()
            const transactionRecipt = await transactionResponse.wait(1)
            const {gasUsed , effectiveGasPrice} = transactionRecipt
            const gasCost = gasUsed.mul(effectiveGasPrice)

            
            const endingFundMeBalance = await fundMe.provider.getBalance(
                fundMe.address
            )
            const endingDeployerBalance = await fundMe.provider.getBalance(
                deployer
            )

            assert.equal(endingFundMeBalance,0)
            assert.equal(startingDeployerBalance.add(startingFundMeBalance).toString(), endingDeployerBalance.add(gasCost).toString())

            await expect(fundMe.getFunder(0)).to.be.reverted

            for (let i=1;i<6;i++){
                assert.equal(await fundMe.getAddressToAmountFunded(accounts[i].address),0)
            }

            




        })

        it("CheapWithdraw ETH from contract", async function (){
            //Arrange
            const startingFundMeBalance = await fundMe.provider.getBalance(
                fundMe.address
            )
            const startingDeployerBalance = await fundMe.provider.getBalance(
                deployer
            )
            //Act

            const transactionResponse  = await fundMe.cheapWithDraw()
            const transactionRecipt = await transactionResponse.wait(1)
            const {gasUsed , effectiveGasPrice} = transactionRecipt
            const gasCost = gasUsed.mul(effectiveGasPrice)

            //Test

            const endingFundMeBalance = await fundMe.provider.getBalance(
                fundMe.address
            )
            const endingDeployerBalance = await fundMe.provider.getBalance(
                deployer
            )

            assert.equal(endingFundMeBalance,0)
            assert.equal(startingDeployerBalance.add(startingFundMeBalance).toString(), endingDeployerBalance.add(gasCost).toString())
        })
    })
})
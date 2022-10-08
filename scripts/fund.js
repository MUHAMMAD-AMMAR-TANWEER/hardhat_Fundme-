const { deployments, ethers, getNamedAccounts } = require("hardhat")

async function main () {
    const deployer = (await getNamedAccounts()).deployer
    const fundme = await ethers.getContract("FundMe", deployer)
    console.log("Deploying the contract")
    const transactionResponse = await fundme.fund({value:ethers.utils.parseEther("0.1")})
    await transactionResponse.wait(1)
    console.log("Deployment has been done")
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.log(error)
        process.exit(1)
    })
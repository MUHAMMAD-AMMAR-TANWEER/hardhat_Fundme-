// import
// main function
// calling of main function

const { network } = require("hardhat")

// function deployFunc() {
//     console.log("Hi")
//     hre.getNamedAccounts
//     hre.deployments
// }

// module.exports.default = deployFunc
//I am comfortable with below syntax

module.exports = async ({ getNamedAccounts, deployments }) => {
    const { deploy, log } = deployments
    const { deployer } = await getNamedAccounts()
    const { chainId } = network.config.chainId
}

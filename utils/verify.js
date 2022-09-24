const { run } = require("hardhat")

const verify = async (contractAddress, args) => {
    console.log("Verifying contract")
    try {
        await run("verify::verify", {
            address: contractAddress,
            constructorArgumnets: args,
        })
    } catch (e) {
        if (e.message.toLowerCase().includes("already verified!")) {
            console.log("Already Verified!")
        } else {
            console.log(e)
        }
    }
}

module.exports = { verify }

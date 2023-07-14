async function main() {
    const [deployer] = await ethers.getSigners();
  
    console.log("Deploying contracts with the account:", deployer.address);
  
    const SMART_CONTRACT = await ethers.getContractFactory("smart_contract");
    const smart_contract = await SMART_CONTRACT.deploy();
  
    console.log("smart contract deployed to:", smart_contract.address);
  }
  
  main()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
    
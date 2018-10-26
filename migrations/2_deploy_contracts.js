var SmartRaffle = artifacts.require("./SmartRaffle.sol");

module.exports = function(deployer) {
  deployer.deploy(SmartRaffle, 10000000000000000, 1000000000000000000, 10000000000000000000);
};

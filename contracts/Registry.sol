pragma solidity ^0.4.19;

import "./Owned.sol";

contract Registry is Owned {

  struct ModuleForSale {
      uint price;
      bytes32 sellerUsername;
      bytes32 moduleName;
      address sellerAddress;
      bytes4 licenseId;
  }

  mapping(string => uint) moduleIds;
  mapping(uint => ModuleForSale) modules;

  uint public numModules;

  // ------------------------------------------------------------------------
  // Constructor, establishes ownership because contract is owned
  // ------------------------------------------------------------------------
  function Registry() public {
    numModules = 0;
  }

  function listModule(uint price, bytes32 sellerUsername, bytes32 moduleName, string usernameAndProjectName, bytes4 licenseId) public {
    // make sure the name isn't already taken
    require(moduleIds[usernameAndProjectName] == 0);

    numModules += 1;
    moduleIds[usernameAndProjectName] = numModules;

    var module = modules[numModules];

    module.price = price;
    module.sellerUsername = sellerUsername;
    module.moduleName = moduleName;
    module.sellerAddress = msg.sender;
    module.licenseId = licenseId;
  }

  function getModuleId(string usernameAndProjectName) public view returns (uint) {
    return moduleIds[usernameAndProjectName];
  }

  function getModule(uint moduleId) public view returns (uint price, bytes32 sellerUsername, bytes32 moduleName, address sellerAddress, bytes4 licenseId) {
    var module = modules[moduleId];

    price = module.price;
    sellerUsername = module.sellerUsername;
    moduleName = module.moduleName;
    sellerAddress = module.sellerAddress;
    licenseId = module.licenseId;
  }

  function editModule(uint moduleId, uint price, address sellerAddress, bytes4 licenseId) public onlyOwner {
    var module = modules[moduleId];

    module.price = price;
    module.sellerAddress = sellerAddress;
    module.licenseId = licenseId;
  }
}
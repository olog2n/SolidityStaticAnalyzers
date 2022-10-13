# GBS Checker

## Installation

```bash
$ chmod 777 install
$ ./install
```

## Using

Firsly, you need to go to the directory with contracts, and then starts script
```bash
$ node ../gbs.js TOOL_NAME ./CONTRACT_NAME.solW
$ node ../gbs.js slither ./FarmingFlat.sol
$ node gbs.js <arguments>
$ node gbs.js -h


## Results of slither

For example we use Avata Farming, and we get these notes
P.S: Every note were improved.

Reentrancy in Farming.deposit(uint256) (contracts/farming/Farming.sol#138-153):
        External calls:
        - _harvest() (contracts/farming/Farming.sol#144)
                - returndata = address(token).functionCall(data,SafeERC20: low-level call failed) (node_modules/@openzeppelin/contracts-upgradeable/token/ERC20/utils/SafeERC20Upgradeable.sol#93)
                - token_.safeTransfer(to_,balance) (contracts/farming/Farming.sol#215)
                - token_.safeTransfer(to_,amount_) (contracts/farming/Farming.sol#217)
                - farmingFactory.mintTokens(msg.sender,pendingAvat) (contracts/farming/Farming.sol#197)
                - (success,returndata) = target.call{value: value}(data) (node_modules/@openzeppelin/contracts-upgradeable/utils/AddressUpgradeable.sol#132)
        External calls sending eth:
        - _harvest() (contracts/farming/Farming.sol#144)
                - (success,returndata) = target.call{value: value}(data) (node_modules/@openzeppelin/contracts-upgradeable/utils/AddressUpgradeable.sol#132)
        State variables written after the call(s):
        - user.amount = user.amount.add(_amount) (contracts/farming/Farming.sol#147)
        - user.rewardAvatTokenDebt = user.amount.mul(accAvatTokenPerShare).div(ATPS_PRECISION) (contracts/farming/Farming.sol#148)
        - user.rewardBonusTokenDebt = user.amount.mul(accBonusTokenPerShare).div(ATPS_PRECISION) (contracts/farming/Farming.sol#149)
Reentrancy in Farming.withdraw(uint256) (contracts/farming/Farming.sol#160-173):
        External calls:
        - _harvest() (contracts/farming/Farming.sol#165)
                - returndata = address(token).functionCall(data,SafeERC20: low-level call failed) (node_modules/@openzeppelin/contracts-upgradeable/token/ERC20/utils/SafeERC20Upgradeable.sol#93)
                - token_.safeTransfer(to_,balance) (contracts/farming/Farming.sol#215)
                - token_.safeTransfer(to_,amount_) (contracts/farming/Farming.sol#217)
                - farmingFactory.mintTokens(msg.sender,pendingAvat) (contracts/farming/Farming.sol#197)
                - (success,returndata) = target.call{value: value}(data) (node_modules/@openzeppelin/contracts-upgradeable/utils/AddressUpgradeable.sol#132)
        External calls sending eth:
        - _harvest() (contracts/farming/Farming.sol#165)
                - (success,returndata) = target.call{value: value}(data) (node_modules/@openzeppelin/contracts-upgradeable/utils/AddressUpgradeable.sol#132)
        State variables written after the call(s):
        - user.amount = user.amount.sub(_amount) (contracts/farming/Farming.sol#167)
        - user.rewardAvatTokenDebt = user.amount.mul(accAvatTokenPerShare).div(ATPS_PRECISION) (contracts/farming/Farming.sol#168)
        - user.rewardBonusTokenDebt = user.amount.mul(accBonusTokenPerShare).div(ATPS_PRECISION) (contracts/farming/Farming.sol#169)
Reference: https://github.com/crytic/slither/wiki/Detector-Documentation#reentrancy-vulnerabilities

Farming.updatePool() (contracts/farming/Farming.sol#224-245) uses a dangerous strict equality:
        - lpSupply == 0 (contracts/farming/Farming.sol#231)
Reference: https://github.com/crytic/slither/wiki/Detector-Documentation#dangerous-strict-equalities

Reentrancy in Farming.emergencyWithdraw() (contracts/farming/Farming.sol#178-188):
        External calls:
        - lpToken.safeTransfer(address(msg.sender),user.amount) (contracts/farming/Farming.sol#181)
        State variables written after the call(s):
        - user.amount = 0 (contracts/farming/Farming.sol#183)
        - user.rewardAvatTokenDebt = 0 (contracts/farming/Farming.sol#184)
        - user.rewardBonusTokenDebt = 0 (contracts/farming/Farming.sol#185)
Reference: https://github.com/crytic/slither/wiki/Detector-Documentation#reentrancy-vulnerabilities-1

Reentrancy in Farming._harvest() (contracts/farming/Farming.sol#193-205):
        External calls:
        - farmingFactory.mintTokens(msg.sender,pendingAvat) (contracts/farming/Farming.sol#197)
        - _safeTransfer(bonusToken,msg.sender,pendingBonus) (contracts/farming/Farming.sol#201)
                - returndata = address(token).functionCall(data,SafeERC20: low-level call failed) (node_modules/@openzeppelin/contracts-upgradeable/token/ERC20/utils/SafeERC20Upgradeable.sol#93)
                - token_.safeTransfer(to_,balance) (contracts/farming/Farming.sol#215)
                - token_.safeTransfer(to_,amount_) (contracts/farming/Farming.sol#217)
                - (success,returndata) = target.call{value: value}(data) (node_modules/@openzeppelin/contracts-upgradeable/utils/AddressUpgradeable.sol#132)
        External calls sending eth:
        - _safeTransfer(bonusToken,msg.sender,pendingBonus) (contracts/farming/Farming.sol#201)
                - (success,returndata) = target.call{value: value}(data) (node_modules/@openzeppelin/contracts-upgradeable/utils/AddressUpgradeable.sol#132)
        Event emitted after the call(s):
        - Harvest(msg.sender,pendingAvat,pendingBonus) (contracts/farming/Farming.sol#204)
Reentrancy in Farming.deposit(uint256) (contracts/farming/Farming.sol#138-153):
        External calls:
        - _harvest() (contracts/farming/Farming.sol#144)
                - returndata = address(token).functionCall(data,SafeERC20: low-level call failed) (node_modules/@openzeppelin/contracts-upgradeable/token/ERC20/utils/SafeERC20Upgradeable.sol#93)
                - token_.safeTransfer(to_,balance) (contracts/farming/Farming.sol#215)
                - token_.safeTransfer(to_,amount_) (contracts/farming/Farming.sol#217)
                - farmingFactory.mintTokens(msg.sender,pendingAvat) (contracts/farming/Farming.sol#197)
                - (success,returndata) = target.call{value: value}(data) (node_modules/@openzeppelin/contracts-upgradeable/utils/AddressUpgradeable.sol#132)
        - lpToken.safeTransferFrom(address(msg.sender),address(this),_amount) (contracts/farming/Farming.sol#151)
        External calls sending eth:
        - _harvest() (contracts/farming/Farming.sol#144)
                - (success,returndata) = target.call{value: value}(data) (node_modules/@openzeppelin/contracts-upgradeable/utils/AddressUpgradeable.sol#132)
        Event emitted after the call(s):
        - Deposit(msg.sender,_amount) (contracts/farming/Farming.sol#152)
Reentrancy in Farming.emergencyWithdraw() (contracts/farming/Farming.sol#178-188):
        External calls:
        - lpToken.safeTransfer(address(msg.sender),user.amount) (contracts/farming/Farming.sol#181)
        Event emitted after the call(s):
        - EmergencyWithdraw(msg.sender,user.amount) (contracts/farming/Farming.sol#187)
Reentrancy in Farming.withdraw(uint256) (contracts/farming/Farming.sol#160-173):
        External calls:
        - _harvest() (contracts/farming/Farming.sol#165)
                - returndata = address(token).functionCall(data,SafeERC20: low-level call failed) (node_modules/@openzeppelin/contracts-upgradeable/token/ERC20/utils/SafeERC20Upgradeable.sol#93)
                - token_.safeTransfer(to_,balance) (contracts/farming/Farming.sol#215)
                - token_.safeTransfer(to_,amount_) (contracts/farming/Farming.sol#217)
                - farmingFactory.mintTokens(msg.sender,pendingAvat) (contracts/farming/Farming.sol#197)
                - (success,returndata) = target.call{value: value}(data) (node_modules/@openzeppelin/contracts-upgradeable/utils/AddressUpgradeable.sol#132)
        - lpToken.safeTransfer(address(msg.sender),_amount) (contracts/farming/Farming.sol#171)
        External calls sending eth:
        - _harvest() (contracts/farming/Farming.sol#165)
                - (success,returndata) = target.call{value: value}(data) (node_modules/@openzeppelin/contracts-upgradeable/utils/AddressUpgradeable.sol#132)
        Event emitted after the call(s):
        - Withdraw(msg.sender,_amount) (contracts/farming/Farming.sol#172)
Reference: https://github.com/crytic/slither/wiki/Detector-Documentation#reentrancy-vulnerabilities-3

Farming.initialize(address,address,address,address,uint256,uint256) (contracts/farming/Farming.sol#76-98) uses timestamp for comparisons
        Dangerous comparisons:
        - block.timestamp > startTimestamp_ (contracts/farming/Farming.sol#95)
Farming.pending(address) (contracts/farming/Farming.sol#105-131) uses timestamp for comparisons
        Dangerous comparisons:
        - block.timestamp > lastRewardTimestamp && lpSupply != 0 (contracts/farming/Farming.sol#112)
        - block.timestamp > lastRewardTimestamp && lpSupply != 0 (contracts/farming/Farming.sol#124)
Farming.updatePool() (contracts/farming/Farming.sol#224-245) uses timestamp for comparisons
        Dangerous comparisons:
        - block.timestamp <= lastRewardTimestamp (contracts/farming/Farming.sol#225)
Reference: https://github.com/crytic/slither/wiki/Detector-Documentation#block-timestamp

AddressUpgradeable.isContract(address) (node_modules/@openzeppelin/contracts-upgradeable/utils/AddressUpgradeable.sol#27-37) uses assembly
        - INLINE ASM (node_modules/@openzeppelin/contracts-upgradeable/utils/AddressUpgradeable.sol#33-35)
AddressUpgradeable.verifyCallResult(bool,bytes,string) (node_modules/@openzeppelin/contracts-upgradeable/utils/AddressUpgradeable.sol#169-189) uses assembly
        - INLINE ASM (node_modules/@openzeppelin/contracts-upgradeable/utils/AddressUpgradeable.sol#181-184)
Reference: https://github.com/crytic/slither/wiki/Detector-Documentation#assembly-usage

Different versions of Solidity are used:
        - Version used: ['0.8.12', '^0.8.0']
        - 0.8.12 (contracts/farming/Farming.sol#2)
        - 0.8.12 (contracts/farming/interfaces/IFarmingFactory.sol#2)
        - ^0.8.0 (node_modules/@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol#4)
        - ^0.8.0 (node_modules/@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol#4)
        - ^0.8.0 (node_modules/@openzeppelin/contracts-upgradeable/security/ReentrancyGuardUpgradeable.sol#4)
        - ^0.8.0 (node_modules/@openzeppelin/contracts-upgradeable/token/ERC20/IERC20Upgradeable.sol#4)
        - ^0.8.0 (node_modules/@openzeppelin/contracts-upgradeable/token/ERC20/utils/SafeERC20Upgradeable.sol#4)
        - ^0.8.0 (node_modules/@openzeppelin/contracts-upgradeable/utils/AddressUpgradeable.sol#4)
        - ^0.8.0 (node_modules/@openzeppelin/contracts-upgradeable/utils/ContextUpgradeable.sol#4)
        - ^0.8.0 (node_modules/@openzeppelin/contracts/utils/math/SafeMath.sol#4)
Reference: https://github.com/crytic/slither/wiki/Detector-Documentation#different-pragma-directives-are-used

AddressUpgradeable.functionCall(address,bytes) (node_modules/@openzeppelin/contracts-upgradeable/utils/AddressUpgradeable.sol#80-82) is never used and should be removed
AddressUpgradeable.functionCallWithValue(address,bytes,uint256) (node_modules/@openzeppelin/contracts-upgradeable/utils/AddressUpgradeable.sol#109-115) is never used and should be removed
AddressUpgradeable.functionStaticCall(address,bytes) (node_modules/@openzeppelin/contracts-upgradeable/utils/AddressUpgradeable.sol#142-144) is never used and should be removed
AddressUpgradeable.functionStaticCall(address,bytes,string) (node_modules/@openzeppelin/contracts-upgradeable/utils/AddressUpgradeable.sol#152-161) is never used and should be removed
AddressUpgradeable.sendValue(address,uint256) (node_modules/@openzeppelin/contracts-upgradeable/utils/AddressUpgradeable.sol#55-60) is never used and should be removed
ContextUpgradeable.__Context_init() (node_modules/@openzeppelin/contracts-upgradeable/utils/ContextUpgradeable.sol#18-20) is never used and should be removed
ContextUpgradeable._msgData() (node_modules/@openzeppelin/contracts-upgradeable/utils/ContextUpgradeable.sol#28-30) is never used and should be removed
ReentrancyGuardUpgradeable.__ReentrancyGuard_init() (node_modules/@openzeppelin/contracts-upgradeable/security/ReentrancyGuardUpgradeable.sol#40-42) is never used and should be removed
ReentrancyGuardUpgradeable.__ReentrancyGuard_init_unchained() (node_modules/@openzeppelin/contracts-upgradeable/security/ReentrancyGuardUpgradeable.sol#44-46) is never used and should be removed
SafeERC20Upgradeable.safeApprove(IERC20Upgradeable,address,uint256) (node_modules/@openzeppelin/contracts-upgradeable/token/ERC20/utils/SafeERC20Upgradeable.sol#45-58) is never used and should be removed
SafeERC20Upgradeable.safeDecreaseAllowance(IERC20Upgradeable,address,uint256) (node_modules/@openzeppelin/contracts-upgradeable/token/ERC20/utils/SafeERC20Upgradeable.sol#69-80) is never used and should be removed
SafeERC20Upgradeable.safeIncreaseAllowance(IERC20Upgradeable,address,uint256) (node_modules/@openzeppelin/contracts-upgradeable/token/ERC20/utils/SafeERC20Upgradeable.sol#60-67) is never used and should be removed
SafeMath.div(uint256,uint256,string) (node_modules/@openzeppelin/contracts/utils/math/SafeMath.sol#191-200) is never used and should be removed
SafeMath.mod(uint256,uint256) (node_modules/@openzeppelin/contracts/utils/math/SafeMath.sol#151-153) is never used and should be removed
SafeMath.mod(uint256,uint256,string) (node_modules/@openzeppelin/contracts/utils/math/SafeMath.sol#217-226) is never used and should be removed
SafeMath.sub(uint256,uint256,string) (node_modules/@openzeppelin/contracts/utils/math/SafeMath.sol#168-177) is never used and should be removed
SafeMath.tryAdd(uint256,uint256) (node_modules/@openzeppelin/contracts/utils/math/SafeMath.sol#22-28) is never used and should be removed
SafeMath.tryDiv(uint256,uint256) (node_modules/@openzeppelin/contracts/utils/math/SafeMath.sol#64-69) is never used and should be removed
SafeMath.tryMod(uint256,uint256) (node_modules/@openzeppelin/contracts/utils/math/SafeMath.sol#76-81) is never used and should be removed
SafeMath.tryMul(uint256,uint256) (node_modules/@openzeppelin/contracts/utils/math/SafeMath.sol#47-57) is never used and should be removed
SafeMath.trySub(uint256,uint256) (node_modules/@openzeppelin/contracts/utils/math/SafeMath.sol#35-40) is never used and should be removed
Reference: https://github.com/crytic/slither/wiki/Detector-Documentation#dead-code

Pragma version0.8.12 (contracts/farming/Farming.sol#2) necessitates a version too recent to be trusted. Consider deploying with 0.6.12/0.7.6/0.8.7
Pragma version0.8.12 (contracts/farming/interfaces/IFarmingFactory.sol#2) necessitates a version too recent to be trusted. Consider deploying with 0.6.12/0.7.6/0.8.7
Pragma version^0.8.0 (node_modules/@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol#4) allows old versions
Pragma version^0.8.0 (node_modules/@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol#4) allows old versions
Pragma version^0.8.0 (node_modules/@openzeppelin/contracts-upgradeable/security/ReentrancyGuardUpgradeable.sol#4) allows old versions
Pragma version^0.8.0 (node_modules/@openzeppelin/contracts-upgradeable/token/ERC20/IERC20Upgradeable.sol#4) allows old versions
Pragma version^0.8.0 (node_modules/@openzeppelin/contracts-upgradeable/token/ERC20/utils/SafeERC20Upgradeable.sol#4) allows old versions
Pragma version^0.8.0 (node_modules/@openzeppelin/contracts-upgradeable/utils/AddressUpgradeable.sol#4) allows old versions
Pragma version^0.8.0 (node_modules/@openzeppelin/contracts-upgradeable/utils/ContextUpgradeable.sol#4) allows old versions
Pragma version^0.8.0 (node_modules/@openzeppelin/contracts/utils/math/SafeMath.sol#4) allows old versions
solc-0.8.12 is not recommended for deployment
Reference: https://github.com/crytic/slither/wiki/Detector-Documentation#incorrect-versions-of-solidity

Low level call in AddressUpgradeable.sendValue(address,uint256) (node_modules/@openzeppelin/contracts-upgradeable/utils/AddressUpgradeable.sol#55-60):
        - (success) = recipient.call{value: amount}() (node_modules/@openzeppelin/contracts-upgradeable/utils/AddressUpgradeable.sol#58)
Low level call in AddressUpgradeable.functionCallWithValue(address,bytes,uint256,string) (node_modules/@openzeppelin/contracts-upgradeable/utils/AddressUpgradeable.sol#123-134):
        - (success,returndata) = target.call{value: value}(data) (node_modules/@openzeppelin/contracts-upgradeable/utils/AddressUpgradeable.sol#132)
Low level call in AddressUpgradeable.functionStaticCall(address,bytes,string) (node_modules/@openzeppelin/contracts-upgradeable/utils/AddressUpgradeable.sol#152-161):
        - (success,returndata) = target.staticcall(data) (node_modules/@openzeppelin/contracts-upgradeable/utils/AddressUpgradeable.sol#159)
Reference: https://github.com/crytic/slither/wiki/Detector-Documentation#low-level-calls

Parameter Farming.pending(address)._user (contracts/farming/Farming.sol#105) is not in mixedCase
Parameter Farming.deposit(uint256)._amount (contracts/farming/Farming.sol#138) is not in mixedCase
Parameter Farming.withdraw(uint256)._amount (contracts/farming/Farming.sol#160) is not in mixedCase
Variable Farming.ATPS_PRECISION (contracts/farming/Farming.sol#57) is not in mixedCase
Function OwnableUpgradeable.__Ownable_init() (node_modules/@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol#29-32) is not in mixedCase
Function OwnableUpgradeable.__Ownable_init_unchained() (node_modules/@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol#34-36) is not in mixedCase
Variable OwnableUpgradeable.__gap (node_modules/@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol#82) is not in mixedCase
Function ReentrancyGuardUpgradeable.__ReentrancyGuard_init() (node_modules/@openzeppelin/contracts-upgradeable/security/ReentrancyGuardUpgradeable.sol#40-42) is not in mixedCase
Function ReentrancyGuardUpgradeable.__ReentrancyGuard_init_unchained() (node_modules/@openzeppelin/contracts-upgradeable/security/ReentrancyGuardUpgradeable.sol#44-46) is not in mixedCase
Variable ReentrancyGuardUpgradeable.__gap (node_modules/@openzeppelin/contracts-upgradeable/security/ReentrancyGuardUpgradeable.sol#68) is not in mixedCase
Function ContextUpgradeable.__Context_init() (node_modules/@openzeppelin/contracts-upgradeable/utils/ContextUpgradeable.sol#18-20) is not in mixedCase
Function ContextUpgradeable.__Context_init_unchained() (node_modules/@openzeppelin/contracts-upgradeable/utils/ContextUpgradeable.sol#22-23) is not in mixedCase
Variable ContextUpgradeable.__gap (node_modules/@openzeppelin/contracts-upgradeable/utils/ContextUpgradeable.sol#31) is not in mixedCase
Reference: https://github.com/crytic/slither/wiki/Detector-Documentation#conformance-to-solidity-naming-conventions

ReentrancyGuardUpgradeable.__gap (node_modules/@openzeppelin/contracts-upgradeable/security/ReentrancyGuardUpgradeable.sol#68) is never used in Farming (contracts/farming/Farming.sol#12-246)
Reference: https://github.com/crytic/slither/wiki/Detector-Documentation#unused-state-variable

initialize(address,address,address,address,uint256,uint256) should be declared external:
        - Farming.initialize(address,address,address,address,uint256,uint256) (contracts/farming/Farming.sol#76-98)
deposit(uint256) should be declared external:
        - Farming.deposit(uint256) (contracts/farming/Farming.sol#138-153)
withdraw(uint256) should be declared external:
        - Farming.withdraw(uint256) (contracts/farming/Farming.sol#160-173)
emergencyWithdraw() should be declared external:
        - Farming.emergencyWithdraw() (contracts/farming/Farming.sol#178-188)
renounceOwnership() should be declared external:
        - OwnableUpgradeable.renounceOwnership() (node_modules/@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol#60-62)
Reference: https://github.com/crytic/slither/wiki/Detector-Documentation#public-function-that-could-be-declared-external

So, what this info gives to us? 
After reading we can understand that we got reentrancy in daposit method, then we can see that we get reentrancy at internal method _harvest with full info about it
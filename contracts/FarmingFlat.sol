// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

library AddressUpgradeable {

    function isContract(address account) internal view returns (bool) {

        uint256 size;
        assembly {
            size := extcodesize(account)
        }
        return size > 0;
    }

    function sendValue(address payable recipient, uint256 amount) internal {
        require(address(this).balance >= amount, "Address: insufficient balance");

        (bool success, ) = recipient.call{value: amount}("");
        require(success, "Address: unable to send value, recipient may have reverted");
    }

    function functionCall(address target, bytes memory data) internal returns (bytes memory) {
        return functionCall(target, data, "Address: low-level call failed");
    }

    function functionCall(
        address target,
        bytes memory data,
        string memory errorMessage
    ) internal returns (bytes memory) {
        return functionCallWithValue(target, data, 0, errorMessage);
    }

    function functionCallWithValue(
        address target,
        bytes memory data,
        uint256 value
    ) internal returns (bytes memory) {
        return functionCallWithValue(target, data, value, "Address: low-level call with value failed");
    }

    function functionCallWithValue(
        address target,
        bytes memory data,
        uint256 value,
        string memory errorMessage
    ) internal returns (bytes memory) {
        require(address(this).balance >= value, "Address: insufficient balance for call");
        require(isContract(target), "Address: call to non-contract");

        (bool success, bytes memory returndata) = target.call{value: value}(data);
        return verifyCallResult(success, returndata, errorMessage);
    }

    function functionStaticCall(address target, bytes memory data) internal view returns (bytes memory) {
        return functionStaticCall(target, data, "Address: low-level static call failed");
    }

    function functionStaticCall(
        address target,
        bytes memory data,
        string memory errorMessage
    ) internal view returns (bytes memory) {
        require(isContract(target), "Address: static call to non-contract");

        (bool success, bytes memory returndata) = target.staticcall(data);
        return verifyCallResult(success, returndata, errorMessage);
    }

    function verifyCallResult(
        bool success,
        bytes memory returndata,
        string memory errorMessage
    ) internal pure returns (bytes memory) {
        if (success) {
            return returndata;
        } else {
            if (returndata.length > 0) {

                assembly {
                    let returndata_size := mload(returndata)
                    revert(add(32, returndata), returndata_size)
                }
            } else {
                revert(errorMessage);
            }
        }
    }
}

pragma solidity ^0.8.0;

abstract contract Initializable {
    bool private _initialized;

    bool private _initializing;

    modifier initializer() {
        require(_initializing ? _isConstructor() : !_initialized, "Initializable: contract is already initialized");

        bool isTopLevelCall = !_initializing;
        if (isTopLevelCall) {
            _initializing = true;
            _initialized = true;
        }

        _;

        if (isTopLevelCall) {
            _initializing = false;
        }
    }
    modifier onlyInitializing() {
        require(_initializing, "Initializable: contract is not initializing");
        _;
    }

    function _isConstructor() private view returns (bool) {
        return !AddressUpgradeable.isContract(address(this));
    }
}

pragma solidity ^0.8.0;

abstract contract ContextUpgradeable is Initializable {
    function __Context_init() internal onlyInitializing {
        __Context_init_unchained();
    }

    function __Context_init_unchained() internal onlyInitializing {
    }
    function _msgSender() internal view virtual returns (address) {
        return msg.sender;
    }

    function _msgData() internal view virtual returns (bytes calldata) {
        return msg.data;
    }
    uint256[50] private __gap;
}

pragma solidity ^0.8.0;

interface IERC20Upgradeable {

    function totalSupply() external view returns (uint256);

    function balanceOf(address account) external view returns (uint256);

    function transfer(address recipient, uint256 amount) external returns (bool);

    function allowance(address owner, address spender) external view returns (uint256);

    function approve(address spender, uint256 amount) external returns (bool);

    function transferFrom(
        address sender,
        address recipient,
        uint256 amount
    ) external returns (bool);

    event Transfer(address indexed from, address indexed to, uint256 value);

    event Approval(address indexed owner, address indexed spender, uint256 value);
}
      
pragma solidity ^0.8.0;

interface IFarmingFactory {
    function countRewardAmount(
        uint256 start_,
        uint256 end_,
        address farmingAddress
    ) external view returns (uint256);

    function mintTokens(address to, uint256 amount) external;
}

pragma solidity ^0.8.0;

abstract contract ReentrancyGuardUpgradeable is Initializable {

    uint256 private constant _NOT_ENTERED = 1;
    uint256 private constant _ENTERED = 2;

    uint256 private _status;

    function __ReentrancyGuard_init() internal onlyInitializing {
        __ReentrancyGuard_init_unchained();
    }

    function __ReentrancyGuard_init_unchained() internal onlyInitializing {
        _status = _NOT_ENTERED;
    }

    modifier nonReentrant() {

        require(_status != _ENTERED, "ReentrancyGuard: reentrant call");

        _status = _ENTERED;

        _;

        _status = _NOT_ENTERED;
    }
    uint256[49] private __gap;
}

pragma solidity ^0.8.0;

abstract contract OwnableUpgradeable is Initializable, ContextUpgradeable {
    address private _owner;

    event OwnershipTransferred(address indexed previousOwner, address indexed newOwner);
    function __Ownable_init() internal onlyInitializing {
        __Context_init_unchained();
        __Ownable_init_unchained();
    }

    function __Ownable_init_unchained() internal onlyInitializing {
        _transferOwnership(_msgSender());
    }

    function owner() public view virtual returns (address) {
        return _owner;
    }

    modifier onlyOwner() {
        require(owner() == _msgSender(), "Ownable: caller is not the owner");
        _;
    }

    function renounceOwnership() public virtual onlyOwner {
        _transferOwnership(address(0));
    }

    function transferOwnership(address newOwner) public virtual onlyOwner {
        require(newOwner != address(0), "Ownable: new owner is the zero address");
        _transferOwnership(newOwner);
    }

    function _transferOwnership(address newOwner) internal virtual {
        address oldOwner = _owner;
        _owner = newOwner;
        emit OwnershipTransferred(oldOwner, newOwner);
    }
    uint256[49] private __gap;
}

pragma solidity ^0.8.0;

library SafeMath {

    function tryAdd(uint256 a, uint256 b) internal pure returns (bool, uint256) {
        unchecked {
            uint256 c = a + b;
            if (c < a) return (false, 0);
            return (true, c);
        }
    }

    function trySub(uint256 a, uint256 b) internal pure returns (bool, uint256) {
        unchecked {
            if (b > a) return (false, 0);
            return (true, a - b);
        }
    }

    function tryMul(uint256 a, uint256 b) internal pure returns (bool, uint256) {
        unchecked {

            if (a == 0) return (true, 0);
            uint256 c = a * b;
            if (c / a != b) return (false, 0);
            return (true, c);
        }
    }

    function tryDiv(uint256 a, uint256 b) internal pure returns (bool, uint256) {
        unchecked {
            if (b == 0) return (false, 0);
            return (true, a / b);
        }
    }

    function tryMod(uint256 a, uint256 b) internal pure returns (bool, uint256) {
        unchecked {
            if (b == 0) return (false, 0);
            return (true, a % b);
        }
    }

    function add(uint256 a, uint256 b) internal pure returns (uint256) {
        return a + b;
    }

    function sub(uint256 a, uint256 b) internal pure returns (uint256) {
        return a - b;
    }

    function mul(uint256 a, uint256 b) internal pure returns (uint256) {
        return a * b;
    }

    function div(uint256 a, uint256 b) internal pure returns (uint256) {
        return a / b;
    }

    function mod(uint256 a, uint256 b) internal pure returns (uint256) {
        return a % b;
    }

    function sub(
        uint256 a,
        uint256 b,
        string memory errorMessage
    ) internal pure returns (uint256) {
        unchecked {
            require(b <= a, errorMessage);
            return a - b;
        }
    }

    function div(
        uint256 a,
        uint256 b,
        string memory errorMessage
    ) internal pure returns (uint256) {
        unchecked {
            require(b > 0, errorMessage);
            return a / b;
        }
    }

    function mod(
        uint256 a,
        uint256 b,
        string memory errorMessage
    ) internal pure returns (uint256) {
        unchecked {
            require(b > 0, errorMessage);
            return a % b;
        }
    }
}

pragma solidity ^0.8.0;

library SafeERC20Upgradeable {
    using AddressUpgradeable for address;

    function safeTransfer(
        IERC20Upgradeable token,
        address to,
        uint256 value
    ) internal {
        _callOptionalReturn(token, abi.encodeWithSelector(token.transfer.selector, to, value));
    }

    function safeTransferFrom(
        IERC20Upgradeable token,
        address from,
        address to,
        uint256 value
    ) internal {
        _callOptionalReturn(token, abi.encodeWithSelector(token.transferFrom.selector, from, to, value));
    }

    function safeApprove(
        IERC20Upgradeable token,
        address spender,
        uint256 value
    ) internal {
        require(
            (value == 0) || (token.allowance(address(this), spender) == 0),
            "SafeERC20: approve from non-zero to non-zero allowance"
        );
        _callOptionalReturn(token, abi.encodeWithSelector(token.approve.selector, spender, value));
    }

    function safeIncreaseAllowance(
        IERC20Upgradeable token,
        address spender,
        uint256 value
    ) internal {
        uint256 newAllowance = token.allowance(address(this), spender) + value;
        _callOptionalReturn(token, abi.encodeWithSelector(token.approve.selector, spender, newAllowance));
    }

    function safeDecreaseAllowance(
        IERC20Upgradeable token,
        address spender,
        uint256 value
    ) internal {
        unchecked {
            uint256 oldAllowance = token.allowance(address(this), spender);
            require(oldAllowance >= value, "SafeERC20: decreased allowance below zero");
            uint256 newAllowance = oldAllowance - value;
            _callOptionalReturn(token, abi.encodeWithSelector(token.approve.selector, spender, newAllowance));
        }
    }
    function _callOptionalReturn(IERC20Upgradeable token, bytes memory data) private {
        bytes memory returndata = address(token).functionCall(data, "SafeERC20: low-level call failed");
        if (returndata.length > 0) {
            require(abi.decode(returndata, (bool)), "SafeERC20: ERC20 operation did not succeed");
        }
    }
}

pragma solidity ^0.8.0;

contract Farming is OwnableUpgradeable, ReentrancyGuardUpgradeable {
    using SafeMath for uint256;
    using SafeERC20Upgradeable for IERC20Upgradeable;
        struct UserInfo {
        uint256 amount;
        uint256 rewardAvatTokenDebt;
        uint256 rewardBonusTokenDebt;
    }

    IERC20Upgradeable public avatToken;

    IERC20Upgradeable public bonusToken;

    IERC20Upgradeable public lpToken;

    IFarmingFactory public farmingFactory;

    uint256 public lastRewardTimestamp;

    uint256 public accAvatTokenPerShare;

    uint256 public accBonusTokenPerShare;

    uint256 public bonusTokenPerSec;

    mapping(address => UserInfo) public userInfo;

    uint256 public ATPS_PRECISION;

    event Deposit(address indexed user, uint256 amount);
    event Withdraw(address indexed user, uint256 amount);
    event UpdatePool(uint256 lastRewardTimestamp, uint256 lpSupply, uint256 accBonusTokenPerShare, uint256 accAvatTokenPerShare);
    event Harvest(address indexed user, uint256 amountAvat, uint256 amountBonus);
    event EmergencyWithdraw(address indexed user, uint256 amount);

    function initialize(
        address owner_,
        address avatToken_,
        address lpToken_,
        address bonusToken_,
        uint256 bonusTokenPerSec_,
        uint256 startTimestamp_
    ) public initializer {
        __Ownable_init();
        transferOwnership(owner_);

        require(lpToken_ != address(0x0), "I0");
        lpToken = IERC20Upgradeable(lpToken_);

        farmingFactory = IFarmingFactory(msg.sender);
        avatToken = IERC20Upgradeable(avatToken_);
        bonusToken = IERC20Upgradeable(bonusToken_);

        bonusTokenPerSec = bonusTokenPerSec_;
        lastRewardTimestamp = block.timestamp > startTimestamp_ ? block.timestamp : startTimestamp_;

        ATPS_PRECISION = 1e36;
    }

    function pending(address _user) public view returns (uint256 pendingAvat, uint256 pendingBonus) {
        UserInfo storage user = userInfo[_user];
        uint256 lpSupply = lpToken.balanceOf(address(this));

        if (address(bonusToken) != address(0)) {
            uint256 accTokenPerShare = accBonusTokenPerShare;

            if (block.timestamp > lastRewardTimestamp && lpSupply != 0) {
                uint256 multiplier = block.timestamp.sub(lastRewardTimestamp);
                uint256 reward = multiplier.mul(bonusTokenPerSec);
                accTokenPerShare = accTokenPerShare.add(reward.mul(ATPS_PRECISION).div(lpSupply));
            }

            pendingBonus = user.amount.mul(accTokenPerShare).div(ATPS_PRECISION).sub(user.rewardBonusTokenDebt);
        }

        if (address(avatToken) != address(0)) {
            uint256 accTokenPerShare = accAvatTokenPerShare;

            if (block.timestamp > lastRewardTimestamp && lpSupply != 0) {
                uint256 reward = farmingFactory.countRewardAmount(lastRewardTimestamp, block.timestamp, address(this));
                accTokenPerShare = accTokenPerShare.add(reward.mul(ATPS_PRECISION).div(lpSupply));
            }

            pendingAvat = user.amount.mul(accTokenPerShare).div(ATPS_PRECISION).sub(user.rewardAvatTokenDebt);
        }
    }

    function deposit(uint256 _amount) public nonReentrant {
        UserInfo storage user = userInfo[msg.sender];

        updatePool();

        if (user.amount > 0) {
            _harvest();
        }

        user.amount = user.amount.add(_amount);
        user.rewardAvatTokenDebt = user.amount.mul(accAvatTokenPerShare).div(ATPS_PRECISION);
        user.rewardBonusTokenDebt = user.amount.mul(accBonusTokenPerShare).div(ATPS_PRECISION);

        lpToken.safeTransferFrom(address(msg.sender), address(this), _amount);
        emit Deposit(msg.sender, _amount);
    }

    function withdraw(uint256 _amount) public nonReentrant {
        UserInfo storage user = userInfo[msg.sender];
        require(user.amount >= _amount, "W0");

        updatePool();
        _harvest();

        user.amount = user.amount.sub(_amount);
        user.rewardAvatTokenDebt = user.amount.mul(accAvatTokenPerShare).div(ATPS_PRECISION);
        user.rewardBonusTokenDebt = user.amount.mul(accBonusTokenPerShare).div(ATPS_PRECISION);

        lpToken.safeTransfer(address(msg.sender), _amount);
        emit Withdraw(msg.sender, _amount);
    }

    function emergencyWithdraw() public {
        UserInfo storage user = userInfo[msg.sender];

        lpToken.safeTransfer(address(msg.sender), user.amount);

        user.amount = 0;
        user.rewardAvatTokenDebt = 0;
        user.rewardBonusTokenDebt = 0;

        emit EmergencyWithdraw(msg.sender, user.amount);
    }

    function _harvest() internal {
        (uint256 pendingAvat, uint256 pendingBonus) = pending(msg.sender);

        if (pendingAvat != 0) {
            farmingFactory.mintTokens(msg.sender, pendingAvat);
        }

        if (pendingBonus != 0) {
            _safeTransfer(bonusToken, msg.sender, pendingBonus);
        }

        emit Harvest(msg.sender, pendingAvat, pendingBonus);
    }

    function _safeTransfer(
        IERC20Upgradeable token_,
        address to_,
        uint256 amount_
    ) internal {
        uint256 balance = token_.balanceOf(address(this));

        if (amount_ > balance) {
            token_.safeTransfer(to_, balance);
        } else {
            token_.safeTransfer(to_, amount_);
        }
    }

    function updatePool() public {
        if (block.timestamp <= lastRewardTimestamp) {
            return;
        }

        uint256 lpSupply = lpToken.balanceOf(address(this));

        if (lpSupply == 0) {
            lastRewardTimestamp = block.timestamp;
            return;
        }

        uint256 multiplier = block.timestamp.sub(lastRewardTimestamp);
        uint256 bonusReward = multiplier.mul(bonusTokenPerSec);
        accBonusTokenPerShare = accBonusTokenPerShare.add(bonusReward.mul(ATPS_PRECISION).div(lpSupply));

        uint256 reward = farmingFactory.countRewardAmount(lastRewardTimestamp, block.timestamp, address(this));
        accAvatTokenPerShare = accAvatTokenPerShare.add(reward.mul(ATPS_PRECISION).div(lpSupply));

        lastRewardTimestamp = block.timestamp;
        emit UpdatePool(lastRewardTimestamp, lpSupply, accBonusTokenPerShare, accAvatTokenPerShare);
    }
}


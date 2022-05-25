// Load environment variables
require("dotenv").config();
const { rejects } = require("assert");
const open = require("open");
const readline = require("readline");

// Connect to Ethereum node
const Web3 = require("web3");
const rpcURL = "https://mainnet.infura.io/v3/" + process.env.INFURA_ID;
const web3 = new Web3(rpcURL);

const AAVE_LENDING_POOL_ABI = [
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "reserve",
        type: "address",
      },
      {
        indexed: false,
        internalType: "address",
        name: "user",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "onBehalfOf",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "borrowRateMode",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "borrowRate",
        type: "uint256",
      },
      {
        indexed: true,
        internalType: "uint16",
        name: "referral",
        type: "uint16",
      },
    ],
    name: "Borrow",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "reserve",
        type: "address",
      },
      {
        indexed: false,
        internalType: "address",
        name: "user",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "onBehalfOf",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
      {
        indexed: true,
        internalType: "uint16",
        name: "referral",
        type: "uint16",
      },
    ],
    name: "Deposit",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "target",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "initiator",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "asset",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "premium",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint16",
        name: "referralCode",
        type: "uint16",
      },
    ],
    name: "FlashLoan",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "collateralAsset",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "debtAsset",
        type: "address",
      },
      { indexed: true, internalType: "address", name: "user", type: "address" },
      {
        indexed: false,
        internalType: "uint256",
        name: "debtToCover",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "liquidatedCollateralAmount",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "address",
        name: "liquidator",
        type: "address",
      },
      {
        indexed: false,
        internalType: "bool",
        name: "receiveAToken",
        type: "bool",
      },
    ],
    name: "LiquidationCall",
    type: "event",
  },
  { anonymous: false, inputs: [], name: "Paused", type: "event" },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "reserve",
        type: "address",
      },
      { indexed: true, internalType: "address", name: "user", type: "address" },
    ],
    name: "RebalanceStableBorrowRate",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "reserve",
        type: "address",
      },
      { indexed: true, internalType: "address", name: "user", type: "address" },
      {
        indexed: true,
        internalType: "address",
        name: "repayer",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "Repay",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "reserve",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "liquidityRate",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "stableBorrowRate",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "variableBorrowRate",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "liquidityIndex",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "variableBorrowIndex",
        type: "uint256",
      },
    ],
    name: "ReserveDataUpdated",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "reserve",
        type: "address",
      },
      { indexed: true, internalType: "address", name: "user", type: "address" },
    ],
    name: "ReserveUsedAsCollateralDisabled",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "reserve",
        type: "address",
      },
      { indexed: true, internalType: "address", name: "user", type: "address" },
    ],
    name: "ReserveUsedAsCollateralEnabled",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "reserve",
        type: "address",
      },
      { indexed: true, internalType: "address", name: "user", type: "address" },
      {
        indexed: false,
        internalType: "uint256",
        name: "rateMode",
        type: "uint256",
      },
    ],
    name: "Swap",
    type: "event",
  },
  { anonymous: false, inputs: [], name: "Unpaused", type: "event" },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "reserve",
        type: "address",
      },
      { indexed: true, internalType: "address", name: "user", type: "address" },
      { indexed: true, internalType: "address", name: "to", type: "address" },
      {
        indexed: false,
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "Withdraw",
    type: "event",
  },
  {
    inputs: [],
    name: "FLASHLOAN_PREMIUM_TOTAL",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "LENDINGPOOL_REVISION",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "MAX_NUMBER_RESERVES",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "MAX_STABLE_RATE_BORROW_SIZE_PERCENT",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "asset", type: "address" },
      { internalType: "uint256", name: "amount", type: "uint256" },
      { internalType: "uint256", name: "interestRateMode", type: "uint256" },
      { internalType: "uint16", name: "referralCode", type: "uint16" },
      { internalType: "address", name: "onBehalfOf", type: "address" },
    ],
    name: "borrow",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "asset", type: "address" },
      { internalType: "uint256", name: "amount", type: "uint256" },
      { internalType: "address", name: "onBehalfOf", type: "address" },
      { internalType: "uint16", name: "referralCode", type: "uint16" },
    ],
    name: "deposit",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "asset", type: "address" },
      { internalType: "address", name: "from", type: "address" },
      { internalType: "address", name: "to", type: "address" },
      { internalType: "uint256", name: "amount", type: "uint256" },
      { internalType: "uint256", name: "balanceFromBefore", type: "uint256" },
      { internalType: "uint256", name: "balanceToBefore", type: "uint256" },
    ],
    name: "finalizeTransfer",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "receiverAddress", type: "address" },
      { internalType: "address[]", name: "assets", type: "address[]" },
      { internalType: "uint256[]", name: "amounts", type: "uint256[]" },
      { internalType: "uint256[]", name: "modes", type: "uint256[]" },
      { internalType: "address", name: "onBehalfOf", type: "address" },
      { internalType: "bytes", name: "params", type: "bytes" },
      { internalType: "uint16", name: "referralCode", type: "uint16" },
    ],
    name: "flashLoan",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "getAddressesProvider",
    outputs: [
      {
        internalType: "contract ILendingPoolAddressesProvider",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "asset", type: "address" }],
    name: "getConfiguration",
    outputs: [
      {
        components: [
          { internalType: "uint256", name: "data", type: "uint256" },
        ],
        internalType: "struct DataTypes.ReserveConfigurationMap",
        name: "",
        type: "tuple",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "asset", type: "address" }],
    name: "getReserveData",
    outputs: [
      {
        components: [
          {
            components: [
              { internalType: "uint256", name: "data", type: "uint256" },
            ],
            internalType: "struct DataTypes.ReserveConfigurationMap",
            name: "configuration",
            type: "tuple",
          },
          { internalType: "uint128", name: "liquidityIndex", type: "uint128" },
          {
            internalType: "uint128",
            name: "variableBorrowIndex",
            type: "uint128",
          },
          {
            internalType: "uint128",
            name: "currentLiquidityRate",
            type: "uint128",
          },
          {
            internalType: "uint128",
            name: "currentVariableBorrowRate",
            type: "uint128",
          },
          {
            internalType: "uint128",
            name: "currentStableBorrowRate",
            type: "uint128",
          },
          {
            internalType: "uint40",
            name: "lastUpdateTimestamp",
            type: "uint40",
          },
          { internalType: "address", name: "aTokenAddress", type: "address" },
          {
            internalType: "address",
            name: "stableDebtTokenAddress",
            type: "address",
          },
          {
            internalType: "address",
            name: "variableDebtTokenAddress",
            type: "address",
          },
          {
            internalType: "address",
            name: "interestRateStrategyAddress",
            type: "address",
          },
          { internalType: "uint8", name: "id", type: "uint8" },
        ],
        internalType: "struct DataTypes.ReserveData",
        name: "",
        type: "tuple",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "asset", type: "address" }],
    name: "getReserveNormalizedIncome",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "asset", type: "address" }],
    name: "getReserveNormalizedVariableDebt",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getReservesList",
    outputs: [{ internalType: "address[]", name: "", type: "address[]" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "user", type: "address" }],
    name: "getUserAccountData",
    outputs: [
      { internalType: "uint256", name: "totalCollateralETH", type: "uint256" },
      { internalType: "uint256", name: "totalDebtETH", type: "uint256" },
      { internalType: "uint256", name: "availableBorrowsETH", type: "uint256" },
      {
        internalType: "uint256",
        name: "currentLiquidationThreshold",
        type: "uint256",
      },
      { internalType: "uint256", name: "ltv", type: "uint256" },
      { internalType: "uint256", name: "healthFactor", type: "uint256" },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "user", type: "address" }],
    name: "getUserConfiguration",
    outputs: [
      {
        components: [
          { internalType: "uint256", name: "data", type: "uint256" },
        ],
        internalType: "struct DataTypes.UserConfigurationMap",
        name: "",
        type: "tuple",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "asset", type: "address" },
      { internalType: "address", name: "aTokenAddress", type: "address" },
      { internalType: "address", name: "stableDebtAddress", type: "address" },
      { internalType: "address", name: "variableDebtAddress", type: "address" },
      {
        internalType: "address",
        name: "interestRateStrategyAddress",
        type: "address",
      },
    ],
    name: "initReserve",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "contract ILendingPoolAddressesProvider",
        name: "provider",
        type: "address",
      },
    ],
    name: "initialize",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "collateralAsset", type: "address" },
      { internalType: "address", name: "debtAsset", type: "address" },
      { internalType: "address", name: "user", type: "address" },
      { internalType: "uint256", name: "debtToCover", type: "uint256" },
      { internalType: "bool", name: "receiveAToken", type: "bool" },
    ],
    name: "liquidationCall",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "paused",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "asset", type: "address" },
      { internalType: "address", name: "user", type: "address" },
    ],
    name: "rebalanceStableBorrowRate",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "asset", type: "address" },
      { internalType: "uint256", name: "amount", type: "uint256" },
      { internalType: "uint256", name: "rateMode", type: "uint256" },
      { internalType: "address", name: "onBehalfOf", type: "address" },
    ],
    name: "repay",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "asset", type: "address" },
      { internalType: "uint256", name: "configuration", type: "uint256" },
    ],
    name: "setConfiguration",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "bool", name: "val", type: "bool" }],
    name: "setPause",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "asset", type: "address" },
      { internalType: "address", name: "rateStrategyAddress", type: "address" },
    ],
    name: "setReserveInterestRateStrategyAddress",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "asset", type: "address" },
      { internalType: "bool", name: "useAsCollateral", type: "bool" },
    ],
    name: "setUserUseReserveAsCollateral",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "asset", type: "address" },
      { internalType: "uint256", name: "rateMode", type: "uint256" },
    ],
    name: "swapBorrowRateMode",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "asset", type: "address" },
      { internalType: "uint256", name: "amount", type: "uint256" },
      { internalType: "address", name: "to", type: "address" },
    ],
    name: "withdraw",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "nonpayable",
    type: "function",
  },
];

const DyDx_LENDING_POOL_ABI = [
  {
    constant: false,
    inputs: [
      { name: "marketId", type: "uint256" },
      {
        components: [{ name: "value", type: "uint256" }],
        name: "spreadPremium",
        type: "tuple",
      },
    ],
    name: "ownerSetSpreadPremium",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    constant: true,
    inputs: [{ name: "operator", type: "address" }],
    name: "getIsGlobalOperator",
    outputs: [{ name: "", type: "bool" }],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: true,
    inputs: [{ name: "marketId", type: "uint256" }],
    name: "getMarketTokenAddress",
    outputs: [{ name: "", type: "address" }],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: false,
    inputs: [
      { name: "marketId", type: "uint256" },
      { name: "interestSetter", type: "address" },
    ],
    name: "ownerSetInterestSetter",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    constant: true,
    inputs: [
      {
        components: [
          { name: "owner", type: "address" },
          { name: "number", type: "uint256" },
        ],
        name: "account",
        type: "tuple",
      },
    ],
    name: "getAccountValues",
    outputs: [
      {
        components: [{ name: "value", type: "uint256" }],
        name: "",
        type: "tuple",
      },
      {
        components: [{ name: "value", type: "uint256" }],
        name: "",
        type: "tuple",
      },
    ],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: true,
    inputs: [{ name: "marketId", type: "uint256" }],
    name: "getMarketPriceOracle",
    outputs: [{ name: "", type: "address" }],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: true,
    inputs: [{ name: "marketId", type: "uint256" }],
    name: "getMarketInterestSetter",
    outputs: [{ name: "", type: "address" }],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: true,
    inputs: [{ name: "marketId", type: "uint256" }],
    name: "getMarketSpreadPremium",
    outputs: [
      {
        components: [{ name: "value", type: "uint256" }],
        name: "",
        type: "tuple",
      },
    ],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: true,
    inputs: [],
    name: "getNumMarkets",
    outputs: [{ name: "", type: "uint256" }],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: false,
    inputs: [
      { name: "token", type: "address" },
      { name: "recipient", type: "address" },
    ],
    name: "ownerWithdrawUnsupportedTokens",
    outputs: [{ name: "", type: "uint256" }],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    constant: false,
    inputs: [
      {
        components: [{ name: "value", type: "uint256" }],
        name: "minBorrowedValue",
        type: "tuple",
      },
    ],
    name: "ownerSetMinBorrowedValue",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    constant: false,
    inputs: [
      {
        components: [{ name: "value", type: "uint256" }],
        name: "spread",
        type: "tuple",
      },
    ],
    name: "ownerSetLiquidationSpread",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    constant: false,
    inputs: [
      {
        components: [{ name: "value", type: "uint256" }],
        name: "earningsRate",
        type: "tuple",
      },
    ],
    name: "ownerSetEarningsRate",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    constant: true,
    inputs: [
      { name: "owner", type: "address" },
      { name: "operator", type: "address" },
    ],
    name: "getIsLocalOperator",
    outputs: [{ name: "", type: "bool" }],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: true,
    inputs: [
      {
        components: [
          { name: "owner", type: "address" },
          { name: "number", type: "uint256" },
        ],
        name: "account",
        type: "tuple",
      },
      { name: "marketId", type: "uint256" },
    ],
    name: "getAccountPar",
    outputs: [
      {
        components: [
          { name: "sign", type: "bool" },
          { name: "value", type: "uint128" },
        ],
        name: "",
        type: "tuple",
      },
    ],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: false,
    inputs: [
      { name: "marketId", type: "uint256" },
      {
        components: [{ name: "value", type: "uint256" }],
        name: "marginPremium",
        type: "tuple",
      },
    ],
    name: "ownerSetMarginPremium",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    constant: true,
    inputs: [],
    name: "getMarginRatio",
    outputs: [
      {
        components: [{ name: "value", type: "uint256" }],
        name: "",
        type: "tuple",
      },
    ],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: true,
    inputs: [{ name: "marketId", type: "uint256" }],
    name: "getMarketCurrentIndex",
    outputs: [
      {
        components: [
          { name: "borrow", type: "uint96" },
          { name: "supply", type: "uint96" },
          { name: "lastUpdate", type: "uint32" },
        ],
        name: "",
        type: "tuple",
      },
    ],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: true,
    inputs: [{ name: "marketId", type: "uint256" }],
    name: "getMarketIsClosing",
    outputs: [{ name: "", type: "bool" }],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: true,
    inputs: [],
    name: "getRiskParams",
    outputs: [
      {
        components: [
          {
            components: [{ name: "value", type: "uint256" }],
            name: "marginRatio",
            type: "tuple",
          },
          {
            components: [{ name: "value", type: "uint256" }],
            name: "liquidationSpread",
            type: "tuple",
          },
          {
            components: [{ name: "value", type: "uint256" }],
            name: "earningsRate",
            type: "tuple",
          },
          {
            components: [{ name: "value", type: "uint256" }],
            name: "minBorrowedValue",
            type: "tuple",
          },
        ],
        name: "",
        type: "tuple",
      },
    ],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: true,
    inputs: [
      {
        components: [
          { name: "owner", type: "address" },
          { name: "number", type: "uint256" },
        ],
        name: "account",
        type: "tuple",
      },
    ],
    name: "getAccountBalances",
    outputs: [
      { name: "", type: "address[]" },
      {
        components: [
          { name: "sign", type: "bool" },
          { name: "value", type: "uint128" },
        ],
        name: "",
        type: "tuple[]",
      },
      {
        components: [
          { name: "sign", type: "bool" },
          { name: "value", type: "uint256" },
        ],
        name: "",
        type: "tuple[]",
      },
    ],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: false,
    inputs: [],
    name: "renounceOwnership",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    constant: true,
    inputs: [],
    name: "getMinBorrowedValue",
    outputs: [
      {
        components: [{ name: "value", type: "uint256" }],
        name: "",
        type: "tuple",
      },
    ],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: false,
    inputs: [
      {
        components: [
          { name: "operator", type: "address" },
          { name: "trusted", type: "bool" },
        ],
        name: "args",
        type: "tuple[]",
      },
    ],
    name: "setOperators",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    constant: true,
    inputs: [{ name: "marketId", type: "uint256" }],
    name: "getMarketPrice",
    outputs: [
      {
        components: [{ name: "value", type: "uint256" }],
        name: "",
        type: "tuple",
      },
    ],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: true,
    inputs: [],
    name: "owner",
    outputs: [{ name: "", type: "address" }],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: true,
    inputs: [],
    name: "isOwner",
    outputs: [{ name: "", type: "bool" }],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: false,
    inputs: [
      { name: "marketId", type: "uint256" },
      { name: "recipient", type: "address" },
    ],
    name: "ownerWithdrawExcessTokens",
    outputs: [{ name: "", type: "uint256" }],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    constant: false,
    inputs: [
      { name: "token", type: "address" },
      { name: "priceOracle", type: "address" },
      { name: "interestSetter", type: "address" },
      {
        components: [{ name: "value", type: "uint256" }],
        name: "marginPremium",
        type: "tuple",
      },
      {
        components: [{ name: "value", type: "uint256" }],
        name: "spreadPremium",
        type: "tuple",
      },
    ],
    name: "ownerAddMarket",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    constant: false,
    inputs: [
      {
        components: [
          { name: "owner", type: "address" },
          { name: "number", type: "uint256" },
        ],
        name: "accounts",
        type: "tuple[]",
      },
      {
        components: [
          { name: "actionType", type: "uint8" },
          { name: "accountId", type: "uint256" },
          {
            components: [
              { name: "sign", type: "bool" },
              { name: "denomination", type: "uint8" },
              { name: "ref", type: "uint8" },
              { name: "value", type: "uint256" },
            ],
            name: "amount",
            type: "tuple",
          },
          { name: "primaryMarketId", type: "uint256" },
          { name: "secondaryMarketId", type: "uint256" },
          { name: "otherAddress", type: "address" },
          { name: "otherAccountId", type: "uint256" },
          { name: "data", type: "bytes" },
        ],
        name: "actions",
        type: "tuple[]",
      },
    ],
    name: "operate",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    constant: true,
    inputs: [{ name: "marketId", type: "uint256" }],
    name: "getMarketWithInfo",
    outputs: [
      {
        components: [
          { name: "token", type: "address" },
          {
            components: [
              { name: "borrow", type: "uint128" },
              { name: "supply", type: "uint128" },
            ],
            name: "totalPar",
            type: "tuple",
          },
          {
            components: [
              { name: "borrow", type: "uint96" },
              { name: "supply", type: "uint96" },
              { name: "lastUpdate", type: "uint32" },
            ],
            name: "index",
            type: "tuple",
          },
          { name: "priceOracle", type: "address" },
          { name: "interestSetter", type: "address" },
          {
            components: [{ name: "value", type: "uint256" }],
            name: "marginPremium",
            type: "tuple",
          },
          {
            components: [{ name: "value", type: "uint256" }],
            name: "spreadPremium",
            type: "tuple",
          },
          { name: "isClosing", type: "bool" },
        ],
        name: "",
        type: "tuple",
      },
      {
        components: [
          { name: "borrow", type: "uint96" },
          { name: "supply", type: "uint96" },
          { name: "lastUpdate", type: "uint32" },
        ],
        name: "",
        type: "tuple",
      },
      {
        components: [{ name: "value", type: "uint256" }],
        name: "",
        type: "tuple",
      },
      {
        components: [{ name: "value", type: "uint256" }],
        name: "",
        type: "tuple",
      },
    ],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: false,
    inputs: [
      {
        components: [{ name: "value", type: "uint256" }],
        name: "ratio",
        type: "tuple",
      },
    ],
    name: "ownerSetMarginRatio",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    constant: true,
    inputs: [],
    name: "getLiquidationSpread",
    outputs: [
      {
        components: [{ name: "value", type: "uint256" }],
        name: "",
        type: "tuple",
      },
    ],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: true,
    inputs: [
      {
        components: [
          { name: "owner", type: "address" },
          { name: "number", type: "uint256" },
        ],
        name: "account",
        type: "tuple",
      },
      { name: "marketId", type: "uint256" },
    ],
    name: "getAccountWei",
    outputs: [
      {
        components: [
          { name: "sign", type: "bool" },
          { name: "value", type: "uint256" },
        ],
        name: "",
        type: "tuple",
      },
    ],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: true,
    inputs: [{ name: "marketId", type: "uint256" }],
    name: "getMarketTotalPar",
    outputs: [
      {
        components: [
          { name: "borrow", type: "uint128" },
          { name: "supply", type: "uint128" },
        ],
        name: "",
        type: "tuple",
      },
    ],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: true,
    inputs: [
      { name: "heldMarketId", type: "uint256" },
      { name: "owedMarketId", type: "uint256" },
    ],
    name: "getLiquidationSpreadForPair",
    outputs: [
      {
        components: [{ name: "value", type: "uint256" }],
        name: "",
        type: "tuple",
      },
    ],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: true,
    inputs: [{ name: "marketId", type: "uint256" }],
    name: "getNumExcessTokens",
    outputs: [
      {
        components: [
          { name: "sign", type: "bool" },
          { name: "value", type: "uint256" },
        ],
        name: "",
        type: "tuple",
      },
    ],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: true,
    inputs: [{ name: "marketId", type: "uint256" }],
    name: "getMarketCachedIndex",
    outputs: [
      {
        components: [
          { name: "borrow", type: "uint96" },
          { name: "supply", type: "uint96" },
          { name: "lastUpdate", type: "uint32" },
        ],
        name: "",
        type: "tuple",
      },
    ],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: true,
    inputs: [
      {
        components: [
          { name: "owner", type: "address" },
          { name: "number", type: "uint256" },
        ],
        name: "account",
        type: "tuple",
      },
    ],
    name: "getAccountStatus",
    outputs: [{ name: "", type: "uint8" }],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: true,
    inputs: [],
    name: "getEarningsRate",
    outputs: [
      {
        components: [{ name: "value", type: "uint256" }],
        name: "",
        type: "tuple",
      },
    ],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: false,
    inputs: [
      { name: "marketId", type: "uint256" },
      { name: "priceOracle", type: "address" },
    ],
    name: "ownerSetPriceOracle",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    constant: true,
    inputs: [],
    name: "getRiskLimits",
    outputs: [
      {
        components: [
          { name: "marginRatioMax", type: "uint64" },
          { name: "liquidationSpreadMax", type: "uint64" },
          { name: "earningsRateMax", type: "uint64" },
          { name: "marginPremiumMax", type: "uint64" },
          { name: "spreadPremiumMax", type: "uint64" },
          { name: "minBorrowedValueMax", type: "uint128" },
        ],
        name: "",
        type: "tuple",
      },
    ],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: true,
    inputs: [{ name: "marketId", type: "uint256" }],
    name: "getMarket",
    outputs: [
      {
        components: [
          { name: "token", type: "address" },
          {
            components: [
              { name: "borrow", type: "uint128" },
              { name: "supply", type: "uint128" },
            ],
            name: "totalPar",
            type: "tuple",
          },
          {
            components: [
              { name: "borrow", type: "uint96" },
              { name: "supply", type: "uint96" },
              { name: "lastUpdate", type: "uint32" },
            ],
            name: "index",
            type: "tuple",
          },
          { name: "priceOracle", type: "address" },
          { name: "interestSetter", type: "address" },
          {
            components: [{ name: "value", type: "uint256" }],
            name: "marginPremium",
            type: "tuple",
          },
          {
            components: [{ name: "value", type: "uint256" }],
            name: "spreadPremium",
            type: "tuple",
          },
          { name: "isClosing", type: "bool" },
        ],
        name: "",
        type: "tuple",
      },
    ],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: false,
    inputs: [
      { name: "marketId", type: "uint256" },
      { name: "isClosing", type: "bool" },
    ],
    name: "ownerSetIsClosing",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    constant: false,
    inputs: [
      { name: "operator", type: "address" },
      { name: "approved", type: "bool" },
    ],
    name: "ownerSetGlobalOperator",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    constant: false,
    inputs: [{ name: "newOwner", type: "address" }],
    name: "transferOwnership",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    constant: true,
    inputs: [
      {
        components: [
          { name: "owner", type: "address" },
          { name: "number", type: "uint256" },
        ],
        name: "account",
        type: "tuple",
      },
    ],
    name: "getAdjustedAccountValues",
    outputs: [
      {
        components: [{ name: "value", type: "uint256" }],
        name: "",
        type: "tuple",
      },
      {
        components: [{ name: "value", type: "uint256" }],
        name: "",
        type: "tuple",
      },
    ],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: true,
    inputs: [{ name: "marketId", type: "uint256" }],
    name: "getMarketMarginPremium",
    outputs: [
      {
        components: [{ name: "value", type: "uint256" }],
        name: "",
        type: "tuple",
      },
    ],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: true,
    inputs: [{ name: "marketId", type: "uint256" }],
    name: "getMarketInterestRate",
    outputs: [
      {
        components: [{ name: "value", type: "uint256" }],
        name: "",
        type: "tuple",
      },
    ],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        components: [
          {
            components: [{ name: "value", type: "uint256" }],
            name: "marginRatio",
            type: "tuple",
          },
          {
            components: [{ name: "value", type: "uint256" }],
            name: "liquidationSpread",
            type: "tuple",
          },
          {
            components: [{ name: "value", type: "uint256" }],
            name: "earningsRate",
            type: "tuple",
          },
          {
            components: [{ name: "value", type: "uint256" }],
            name: "minBorrowedValue",
            type: "tuple",
          },
        ],
        name: "riskParams",
        type: "tuple",
      },
      {
        components: [
          { name: "marginRatioMax", type: "uint64" },
          { name: "liquidationSpreadMax", type: "uint64" },
          { name: "earningsRateMax", type: "uint64" },
          { name: "marginPremiumMax", type: "uint64" },
          { name: "spreadPremiumMax", type: "uint64" },
          { name: "minBorrowedValueMax", type: "uint128" },
        ],
        name: "riskLimits",
        type: "tuple",
      },
    ],
    payable: false,
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, name: "owner", type: "address" },
      { indexed: false, name: "operator", type: "address" },
      { indexed: false, name: "trusted", type: "bool" },
    ],
    name: "LogOperatorSet",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, name: "previousOwner", type: "address" },
      { indexed: true, name: "newOwner", type: "address" },
    ],
    name: "OwnershipTransferred",
    type: "event",
  },
];

const AAVE_LENDING_POOL_ADDRESS = "0x7d2768dE32b0b80b7a3454c06BdAc94A69DDc7A9";
const DyDx_LENDING_POOL_ADDRESS = "0x1E0447b19BB6EcFdAe1e4AE1694b0C3659614e4e";

const aaveLendingPool = new web3.eth.Contract(
  AAVE_LENDING_POOL_ABI,
  AAVE_LENDING_POOL_ADDRESS
);

const dydxLendingPool = new web3.eth.Contract(
  DyDx_LENDING_POOL_ABI,
  DyDx_LENDING_POOL_ADDRESS
);

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const q2prompt = (question) =>
  new Promise((resolve, reject) => {
    rl.question(question, function (choice) {
      resolve(choice);
      reject(new Error("Prompt cancelled"));
    });
  });

q2prompt("Enter a choice: ").then((choice) => {
  q2prompt("Enter start block: ")
    .then(async (sb) => {
      console.log({ choice, sb });
      if (choice == "1") {
        await getAavePool(sb);
      } else if (choice == "2") {
        await getdydxLendingPool(sb);
      } else {
        console.error("Error: Exiting prompt!");
        process.exit(1);
      }
    })
    .catch((err) => {
      console.log(err);
      process.exit(1);
    });
});

const mapEvents = (events) =>
  setTimeout(() => {
    events.map((event) => {
      open(`https://etherscan.io/tx/${event.transactionHash}`);
    });
  }, 1300);

const logEvents = (events) => console.log(events);
const logCount = (events) => console.log(`Found ${events.length} events.\n Opening in 1 second...`);

const getAavePool = async (startBlock) => {
  await aaveLendingPool
    .getPastEvents("FlashLoan", {
      fromBlock: startBlock,
      toBLock: "latest",
    })
    .then((events) => {
      logCount(events);
      logEvents;
      mapEvents(events);
    })
    .then(rl.close());
};

const getdydxLendingPool = async (startBlock) => {
  await dydxLendingPool
    .getPastEvents("FlashLoan", {
      fromBlock: startBlock,
      toBLock: "latest",
    })
    .then((events) => {
      logCount(events);
      logEvents;
      mapEvents(events);
    })
    .then(rl.close());
};

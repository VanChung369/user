<div align="center"><a name="readme-top"></a>
<h1>NFT Marketplace</h1>
  
![tw-banner](hhttps://github.com/VanChung369/user/blob/develop/public/assets/20250222003214.png)

## Introduction

It is a platform that allows users to connect their MetaMask wallet, browse NFT information, perform buying/ seling transactions, search for products and manage their account.

## ✨ Features

- 🌈 Connect MetaMask.
- 📦 View NFT Information.
- 🛡 Buy NFT.
- ⚙️ Sell NFT.
- 🌍 Search NFT.
- 🎨 Manage Account.
  ...

## Environment Variables

To run this project, you will need to add the following environment variables to your .env file:

- `NEXT_PUBLIC_TEMPLATE_CLIENT_ID` - Client ID for thirdweb API.
- `NEXT_PUBLIC_APP_CHAIN_ID` - Blockchain chain ID.
- `NEXT_PUBLIC_APP_RPC` - RPC URL for interacting with the blockchain.
- `NEXT_PUBLIC_APP_API` - Backend API endpoint.
- `NEXT_PUBLIC_ERC_721` - Smart contract address for ERC-721 NFTs.
- `NEXT_PUBLIC_ERC_1155` - Smart contract address for ERC-1155 NFTs.
- `NEXT_PUBLIC_ERC_20` - ERC-20 token contract address for transactions.
- `NEXT_PUBLIC_PROXY_ADDRESS` - Proxy contract address.
- `NEXT_PUBLIC_IMAGE_DOMAINS` - Allowed image domains for Next.js.

To learn how to create a client ID, refer to the [client documentation](https://portal.thirdweb.com/typescript/v5/client).

## 📦 Run locally

Install dependencies

```bash
yarn install # or npm install
```

Start development server

```bash
yarn dev # or npm run dev
```

Create a production build

```bash
yarn build # or npm run build
```

Preview the production build

```bash
yarn start # or npm run start
```

## Need help?

---
slug: project
title: Project Info
subtitle: Details about my NFT Project
---

This project is an experiment in technology, art, and cryptography. [We are absolutely doing this shit live](/bval-token). Every line of code and all assets for this project are [open source](https://github.com/bvalosek/bval-nft) with the hopes that others use my ideas as a jumping off point for their own projects.

<!-- snip -->

## Goals

I started this project as I dove into the world of crypto towards the beginning of 2021, with the following goals:

* Explore the world of crypto art and smart contracts
* Create a scalable and durable way to distribute and represent my art
* Deploy a powerful and flexible smart contract that is compatible with all major marketplaces
* Build cool web3 applications to showcase and interact with my art
* Understand how traditional cloud platforms can interact with on-chain events and data
* Connect with others in the crypto art space

## Decentralization

An important goal with this project was to ensure I fully embraced the decentralized ethos and not have any dependencies on a traditional web server or even a commercial service of any kind.

* I use [IPFS to host all my token assets and metadata](/ipfs)
* My `tokenURI` ERC-721 method does not have a hardcoded gateway URL and [uses the ipfs uri scheme](https://github.com/bvalosek/bval-nft/blob/main/packages/solidity-contracts/contracts/CoreERC721.sol#L67)
* Minting is handled via [simple React app](https://github.com/bvalosek/bval-nft/tree/main/packages/app-tokens) I can run locally, not a platform
* Dynamic metadata is resolved JIT when the `tokenURI` method is called, ensuring I don't need to pay gas or require any upkeep for my dynamic NFTs

## Smart Contracts

My NFTs have some custom features, powered by a series of [smart contracts](https://github.com/bvalosek/bval-nft/tree/main/packages/solidity-contracts) that are verified on Etherscan.

Ensure you verify the contract you are interacting with before purchasing my art or **BVAL**:

* NFT ERC-721 Contract:<br/> `0x02d91986f0c2b02830bdfc022f0da83529b78334` [etherscan](https://etherscan.io/address/0x02d91986f0c2b02830bdfc022f0da83529b78334)
* **BVAL** ERC-20 Contract:<br/> `0x27525344bbba0dDb182251387AEdd0Bde7d466B2` [etherscan](https://etherscan.io/address/0x27525344bbba0dDb182251387AEdd0Bde7d466B2)



## Roadmap

There is none.

But there are several things I have planned, designed, or semi-executed at this time. If you are curious, [get in touch](/contact), I'd love to share some of my thoughts on what's next.


---
slug: ipfs
title: IPFS Content
subtitle: Token Asset and Metadata Storage
pageComponent: IpfsPage.tsx
---

My NFT collection has all token metadata, images, and other assets stored on [IPFS](https://ipfs.io), a distributed, content-addressed file system. This ensures my NFTs are not dependent on a traditional centralized cloud backend to store images or host metadata.

<!-- snip -->

This page provides some info on IPFS, as well as lists all CIDs associated with the progress for others who may which to pin my files on their nodes.

## IPFS CIDs and Data Integrity

IPFS uses content addressing, which means that the identifier for a specific file is derived from its contents. This is a powerful feature, since consumers can verify that the contents have not been tampered with by re-computing the CID (content identifier) locally after receiving the file from the network.

My [NFT smart contract](https://etherscan.io/address/0x02d91986f0c2b02830bdfc022f0da83529b78334) stores the IPFS hash of the metadata associated with each token I mint. This not only allows my contract to point marketplaces to the location of the metadata, but creates an on-chain assertion about their contents.

## Pinning Files

By default, IPFS network nodes will [garbage collect](https://docs.ipfs.io/concepts/persistence/) files under certain circumstances. Files can be "pinned" on an IPFS node, which will prevent this process from occurring. Currently I use a commercial service to pin all of the files associated with my tokens across a few different regions, but will be hosting my own node(s) in the future.

Anybody can pin any file, and by having my collectors, friends, colleagues, or archivists pin the hashes associated with my content, the files will always* be available on the network.

_What happens if I am no longer pinning the files?_ Eventually, if I neglect my commercial pinning service, or shut down all of my personal nodes, and nobody else is pinning the files... they will be garbage collected out of any other nodes in the network over time. This is the case for all data hosted on IPFS.

## My CIDs

The CIDs of all files associated with this project are available in the [GitHub repo](https://github.com/bvalosek/bval-nft) (currently in the `token-manifest` package), and all currently "active" metadata hashes are directly queryable on-chain (metadata variations that are not active are not directly queryable, though any web3 client can [read private contract data](https://medium.com/coinmonks/how-to-read-private-variables-in-contract-storage-with-truffle-ethernaut-lvl-8-walkthrough-b2382741da9f)).

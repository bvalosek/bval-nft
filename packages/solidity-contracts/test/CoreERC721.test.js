// eslint-disable-next-line @typescript-eslint/no-var-requires
const truffleAssert = require('truffle-assertions');
const timeMachine = require('ganache-time-traveler');

const CoreERC721 = artifacts.require('CoreERC721');
const MockMetadataIndexResolver = artifacts.require('MockMetadataIndexResolver');
const SYMBOL = 'BVAL';
const NAME = '@bvalosek Collection';

// if no from, defaults to default address for wallet
const factory = () =>
  CoreERC721.new({
    name: NAME,
    symbol: SYMBOL,
    feeBps: 1000,
    collectionMetadataCID: 'blah',
  });

// max gas for deployment
const MAX_DEPLOYMENT_GAS = 3500000;

// max amount of gas we want to allow for basic on-chain mutations
const MAX_MUTATION_GAS = 250000;

// max amount of gas we want to allow for basic on-chain logs
const MAX_ANNOUNCE_GAS = 60000;

// decimal tokens , generated with token ID encoder util
const TOKENS = [
  // 1 - 1
  '784480123722078113148356789948666198514632284540374567697738922716045508609',
  // 2 - 10
  '575992170078640138396857986371540555942628522335297214605797785929353527306',
];

// start a sequence and mint
const simpleMint = async (instance, tokenId = TOKENS[0]) => {
  await instance.startSequence({ sequenceNumber: '1', name: 'name', description: 'desc', image: 'data' });
  const res = await instance.mint({
    tokenId,
    metadataCIDs: ['cid'],
  });
  return res;
};

// set the date of the local blockchain
const setNetworkTime = async (date) => {
  const timestamp = Math.round(new Date(date).getTime() / 1000);
  await timeMachine.advanceBlockAndSetTime(timestamp);
};

// helps keeps tests more consistent when messing with network time
let snapshotId;
beforeEach(async () => {
  const snapshot = await timeMachine.takeSnapshot();
  snapshotId = snapshot['result'];
});
afterEach(async () => {
  await timeMachine.revertToSnapshot(snapshotId);
});

contract('CoreERC721', (accounts) => {
  describe('gas constraints', () => {
    it('should deploy with less than target deployment gas', async () => {
      const instance = await factory();
      let { gasUsed } = await web3.eth.getTransactionReceipt(instance.transactionHash);
      assert.isBelow(gasUsed, MAX_DEPLOYMENT_GAS);
      console.log('deploy', gasUsed);
    });
    it('mint should cost less than target mutation gas', async () => {
      const instance = await factory();
      const res = await simpleMint(instance);
      assert.isBelow(res.receipt.gasUsed, MAX_MUTATION_GAS);
      console.log('mint', res.receipt.gasUsed);
    });
    it('mint with longer strings should cost less than target mutation gas', async () => {
      const instance = await factory();
      const tokenId = TOKENS[0];
      await instance.startSequence({ sequenceNumber: '1', name: 'name', description: 'desc', image: 'data' });
      const res = await instance.mint({
        tokenId,
        metadataCIDs: ['QmY7Yh4UquoXHLPFo2XbhXkhBvFoPwmQUSa92pxnxjQuPU'],
      });
      assert.isBelow(res.receipt.gasUsed, MAX_MUTATION_GAS);
      console.log('mint', res.receipt.gasUsed);
    });
    it('mint with 3 metadata variations should cost lest than target mutation gas + 50%', async () => {
      const instance = await factory();
      const tokenId = TOKENS[0];
      await instance.startSequence({ sequenceNumber: '1', name: 'name', description: 'desc', image: 'data' });
      const res = await instance.mint({
        tokenId,
        metadataCIDs: [
          'QmY7Yh4UquoXHLPFo2XbhXkhBvFoPwmQUSa92pxnxjQuPU',
          'QmXgbjFDaVLBUTYhJz6J5ss7rNC6EGnuvhVn9hPARa7K8F',
          'QmZYcPoWP5arnjbBr2SYAEFJTcU3jB8vAABiRoejA3AWjn',
        ],
      });
      assert.isBelow(res.receipt.gasUsed, MAX_MUTATION_GAS * 1.5);
      console.log('mint w/ 3 variations', res.receipt.gasUsed);
    });
    it('atomic mint of a 9-piece sequence should cost less than target mutationgas * 9', async () => {
      const instance = await factory();
      const seq = {
        sequenceNumber: '1',
        name: 'ARCH DESCENT',
        description: 'Journey Through a Fractaled Space',
        image: 'QmY7Yh4UquoXHLPFo2XbhXkhBvFoPwmQUSa92pxnxjQuPU',
      };
      const tokens = [
        {
          tokenId: '0x018500010001490548a300010001010960096000000000000000000000000001',
          metadataCIDs: ['QmXHdB2P9CJJKXFCtCs4w1wFtjxD4W65nCJsFvH6sFvimg'],
        },
        {
          tokenId: '0x017a00010001490548a400010001010960096000000000000000000000000002',
          metadataCIDs: ['QmXHdB2P9CJJKXFCtCs4w1wFtjxD4W65nCJsFvH6sFvimg'],
        },
        {
          tokenId: '0x019300010001490548a500010001010960096000000000000000000000000003',
          metadataCIDs: ['QmXHdB2P9CJJKXFCtCs4w1wFtjxD4W65nCJsFvH6sFvimg'],
        },
        {
          tokenId: '0x01e800010001490548a600010001010960096000000000000000000000000004',
          metadataCIDs: ['QmXHdB2P9CJJKXFCtCs4w1wFtjxD4W65nCJsFvH6sFvimg'],
        },
        {
          tokenId: '0x012c00010001490548a700010001010960096000000000000000000000000005',
          metadataCIDs: ['QmXHdB2P9CJJKXFCtCs4w1wFtjxD4W65nCJsFvH6sFvimg'],
        },
        {
          tokenId: '0x017200010001490548a800010001010960096000000000000000000000000006',
          metadataCIDs: ['QmXHdB2P9CJJKXFCtCs4w1wFtjxD4W65nCJsFvH6sFvimg'],
        },
        {
          tokenId: '0x016200010001490548a900010001010960096000000000000000000000000007',
          metadataCIDs: ['QmXHdB2P9CJJKXFCtCs4w1wFtjxD4W65nCJsFvH6sFvimg'],
        },
        {
          tokenId: '0x016200010001490548aa00010001010960096000000000000000000000000008',
          metadataCIDs: ['QmXHdB2P9CJJKXFCtCs4w1wFtjxD4W65nCJsFvH6sFvimg'],
        },
        {
          tokenId: '0x017f00010001490548ab00010001010960096000000000000000000000000009',
          metadataCIDs: ['QmXHdB2P9CJJKXFCtCs4w1wFtjxD4W65nCJsFvH6sFvimg'],
        },
      ];
      const res = await instance.atomicMint(seq, tokens);
      assert.isBelow(res.receipt.gasUsed, MAX_MUTATION_GAS * 9);
      console.log('atomic mint w/ 9 tokens', res.receipt.gasUsed);
    });
    it('start sequence should cost less than target announce gas', async () => {
      const instance = await factory();
      const res = await instance.startSequence({
        sequenceNumber: '1',
        name: 'name',
        description: 'desc',
        image: 'data',
      });
      assert.isBelow(res.receipt.gasUsed, MAX_ANNOUNCE_GAS);
      console.log('start sequence', res.receipt.gasUsed);
    });
    it('start seqeunce with longer strings should cost less than target announce gas', async () => {
      const instance = await factory();
      const res = await instance.startSequence({
        sequenceNumber: '1',
        name: 'Example Sequence Name',
        description:
          'This is a bit more realistic example of sequence metadata. At least two sentences for plenty of detail',
        image: 'QmY7Yh4UquoXHLPFo2XbhXkhBvFoPwmQUSa92pxnxjQuPU',
      });
      assert.isBelow(res.receipt.gasUsed, MAX_ANNOUNCE_GAS);
      console.log('start sequence', res.receipt.gasUsed);
    });
    it('complete seqeunce should cost less than target announce gas', async () => {
      const instance = await factory();
      await instance.startSequence({ sequenceNumber: '1', name: 'name', description: 'desc', image: 'data' });
      const res = await instance.completeSequence('1');
      assert.isBelow(res.receipt.gasUsed, MAX_ANNOUNCE_GAS);
      console.log('complete sequence', res.receipt.gasUsed);
    });
  });
  describe('erc165 checks', () => {
    it('should implement ERC-165', async () => {
      const instance = await factory();
      assert.isTrue(await instance.supportsInterface('0x01ffc9a7'));
    });
    it('should implement ERC-721', async () => {
      const instance = await factory();
      assert.isTrue(await instance.supportsInterface('0x80ac58cd'));
    });
    it('should implement ERC-721Metadata', async () => {
      const instance = await factory();
      assert.isTrue(await instance.supportsInterface('0x5b5e139f'));
    });
    it('should implement ERC-721Enumerable', async () => {
      const instance = await factory();
      assert.isTrue(await instance.supportsInterface('0x780e9d63'));
    });
    it('should implement Rarible HasSecondarySaleFees', async () => {
      const instance = await factory();
      assert.isTrue(await instance.supportsInterface('0xb7799584'));
    });
    it('should implement OpenSea Collection Metadata', async () => {
      const instance = await factory();
      assert.isTrue(await instance.supportsInterface('0xe8a3d485'));
    });
    it('should implement IERC2981', async () => {
      const instance = await factory();
      assert.isTrue(await instance.supportsInterface('0xcef6d368'));
    });
  });

  describe('ERC721 Metadata', () => {
    it('should have a name', async () => {
      const instance = await factory();
      const name = await instance.name();
      assert.isString(name);
      assert.isAbove(name.length, 0);
    });
    it('should have a symbol', async () => {
      const instance = await factory();
      const symbol = await instance.symbol();
      assert.isString(symbol);
      assert.isAbove(symbol.length, 0);
    });
    it('should have a tokenURI', async () => {
      const instance = await factory();
      const tokenId = TOKENS[0];
      await simpleMint(instance, tokenId);
      const uri = await instance.tokenURI(tokenId);
      assert.typeOf(uri, 'string');
    });
    it('should have a contractURI', async () => {
      const instance = await factory();
      const uri = await instance.contractURI();
      assert.isString(uri);
    });
  });
  describe('IPFS base URI override', () => {
    it('should allow owner to override', async () => {
      const instance = await factory();
      const override = 'https://override/';
      await instance.setIPFSBaseURI(override);
      const tokenId = TOKENS[0];
      await simpleMint(instance, tokenId);
      const uri = await instance.tokenURI(tokenId);
      assert.isString(uri);
      assert.include(uri, override);
    });
    it('should revert if non-owner tries to override', async () => {
      const [, a2] = accounts;
      const instance = await factory();
      const override = 'https://override';
      const task = instance.setIPFSBaseURI(override, { from: a2 });
      await truffleAssert.fails(task, truffleAssert.ErrorType.REVERT, 'requires DEFAULT_ADMIN_ROLE');
    });
  });
  describe('royalty recipient change', () => {
    it('should revert if non-admin tries to change recipient', async () => {
      const [, a2] = accounts;
      const instance = await factory();
      const task = instance.setRoyaltyRecipient(a2, { from: a2 });
      await truffleAssert.fails(task, truffleAssert.ErrorType.REVERT, 'requires DEFAULT_ADMIN_ROLE');
    });
    it('should allow ADMIN to change recipient', async () => {
      const [, a2] = accounts;
      const instance = await factory();
      const tokenId = TOKENS[0];
      await simpleMint(instance, tokenId);
      await instance.setRoyaltyRecipient(a2);
      const [recipient] = await instance.getFeeRecipients(tokenId);
      assert.equal(recipient, a2);
    });
  });
  describe('minting', () => {
    it('should allow owner to mint', async () => {
      const instance = await factory();
      await simpleMint(instance);
    });
    it('should revert if non-owner attempts to mint', async () => {
      const [, a2] = accounts;
      const instance = await factory();
      const tokenId = TOKENS[0];
      await instance.startSequence({ sequenceNumber: '1', name: 'name', description: 'desc', image: 'data' });
      const task = instance.mint(
        {
          tokenId,
          metadataCIDs: ['cid'],
        },
        { from: a2 }
      );
      await truffleAssert.fails(task, truffleAssert.ErrorType.REVERT, 'requires MINTER_ROLE');
    });
    it('should revert if minting before starting first sequence', async () => {
      const instance = await factory();
      const task = instance.mint({
        tokenId: TOKENS[0],
        metadataCIDs: ['cid'],
      });
      await truffleAssert.fails(task, truffleAssert.ErrorType.REVERT, 'sequence is not active');
    });
    it('should revert if minted with wrong sequence number', async () => {
      const instance = await factory();
      await instance.startSequence({ sequenceNumber: '1', name: 'name', description: 'desc', image: 'data' });
      const task = instance.mint({
        tokenId: TOKENS[1],
        metadataCIDs: ['cid'],
      });
      await truffleAssert.fails(task, truffleAssert.ErrorType.REVERT, 'sequence is not active');
    });
    it('should emit a SecondarySaleFees event on minting', async () => {
      const [a1] = accounts;
      const instance = await factory();
      const tokenId = TOKENS[0];
      await instance.startSequence({ sequenceNumber: '1', name: 'name', description: 'desc', image: 'data' });
      const res = await instance.mint({ tokenId, metadataCIDs: ['cid'] });
      truffleAssert.eventEmitted(res, 'SecondarySaleFees', (event) => {
        return (
          event.tokenId.toString() === tokenId &&
          event.recipients[0].toString() === a1.toString() &&
          event.bps[0].toNumber() === 1000
        );
      });
    });
  });
  describe('burning', () => {
    it('should allow owner to burn', async () => {
      const [a1] = accounts;
      const instance = await factory();
      const tokenId = TOKENS[0];
      assert.equal(await instance.balanceOf(a1), 0);
      await simpleMint(instance, tokenId);
      assert.equal(await instance.balanceOf(a1), 1);
      await instance.burn(tokenId);
      assert.equal(await instance.balanceOf(a1), 0);
    });
    it('should allow (non owner) token holder to burn', async () => {
      const [a1, a2] = accounts;
      const instance = await factory();
      const tokenId = TOKENS[0];
      await simpleMint(instance, tokenId);
      await instance.safeTransferFrom(a1, a2, tokenId);
      assert.equal(await instance.balanceOf(a1), 0);
      assert.equal(await instance.balanceOf(a2), 1);
      await instance.burn(tokenId, { from: a2 });
      assert.equal(await instance.balanceOf(a1), 0);
      assert.equal(await instance.balanceOf(a2), 0);
    });
    it('should revert if non-owner attempts to burn', async () => {
      const [a1, a2] = accounts;
      const instance = await factory();
      const tokenId = TOKENS[0];
      await simpleMint(instance, tokenId);
      assert.equal(await instance.balanceOf(a1), 1);
      const task = instance.burn(tokenId, { from: a2 });
      await truffleAssert.fails(task, truffleAssert.ErrorType.REVERT, 'not token owner');
      assert.equal(await instance.balanceOf(a1), 1);
    });
    it('should revert if owner attempts to burn non-held token', async () => {
      const [a1, a2] = accounts;
      const instance = await factory();
      const tokenId = TOKENS[0];
      await simpleMint(instance, tokenId);
      await instance.safeTransferFrom(a1, a2, tokenId);
      const task = instance.burn(tokenId);
      await truffleAssert.fails(task, truffleAssert.ErrorType.REVERT, 'not token owner');
      assert.equal(await instance.balanceOf(a1), 0);
      assert.equal(await instance.balanceOf(a2), 1);
    });
  });
  describe('rarible royalties', () => {
    it('should return fee bps value', async () => {
      const instance = await factory();
      const tokenId = TOKENS[0];
      await instance.startSequence({ sequenceNumber: '1', name: 'name', description: 'desc', image: 'data' });
      await instance.mint({ tokenId, metadataCIDs: ['cid'] });
      const fee = await instance.getFeeBps(tokenId);
      assert.isNumber(fee[0].toNumber());
      assert.lengthOf(fee, 1);
    });
    it('should return owner as fee recipient', async () => {
      const [a1] = accounts;
      const instance = await factory();
      const tokenId = TOKENS[0];
      await instance.startSequence({ sequenceNumber: '1', name: 'name', description: 'desc', image: 'data' });
      await instance.mint({ tokenId, metadataCIDs: ['cid'] });
      const rec = await instance.getFeeRecipients(tokenId);
      assert.equal(rec[0], a1);
      assert.lengthOf(rec, 1);
    });
  });
  describe('IERC2981 royalities', () => {
    it('should return royality information', async () => {
      const [a1] = accounts;
      const instance = await factory();
      const tokenId = TOKENS[0];
      await instance.startSequence({ sequenceNumber: '1', name: 'name', description: 'desc', image: 'data' });
      await instance.mint({ tokenId, metadataCIDs: ['cid'] });
      const rec = await instance.royaltyInfo(tokenId);
      assert.equal(rec[0].toString(), a1);
      assert.equal(rec[1].toNumber(), 100000);
    });
  });
  describe('resolving metadata index', () => {
    it('should allow setting a metadata resolver', async () => {
      const instance = await factory();
      const resolver = await MockMetadataIndexResolver.new();
      await instance.startSequence({ sequenceNumber: '1', name: 'name', description: 'desc', image: 'data' });
      await instance.setMetadataIndexResolver(1, resolver.address); // does not revert
    });
    it('should delegate metadata index resolution to registered resolver', async () => {
      const instance = await factory();
      const resolver = await MockMetadataIndexResolver.new();
      const tokenId = TOKENS[0];
      await instance.startSequence({ sequenceNumber: '1', name: 'name', description: 'desc', image: 'data' });
      await instance.mint({ tokenId, metadataCIDs: ['cid1', 'cid2'] });
      await instance.setMetadataIndexResolver(1, resolver.address);

      assert.equal(await instance.tokenURI(tokenId), 'ipfs://ipfs/cid1'); // default
      await resolver.setIndex(1);
      assert.equal(await instance.tokenURI(tokenId), 'ipfs://ipfs/cid2');
    });
    it('should fallback to index=0 if resolved index is out of bounds', async () => {
      const instance = await factory();
      const resolver = await MockMetadataIndexResolver.new();
      const tokenId = TOKENS[0];
      await instance.startSequence({ sequenceNumber: '1', name: 'name', description: 'desc', image: 'data' });
      await instance.mint({ tokenId, metadataCIDs: ['cid1', 'cid2'] });
      await instance.setMetadataIndexResolver(1, resolver.address);
      await resolver.setIndex(500); // out of bounds
      assert.equal(await instance.tokenURI(tokenId), 'ipfs://ipfs/cid1');
    });
    it('should revert if setting a metadata resolver that does not implement the correct interface', async () => {
      const instance = await factory();
      await instance.startSequence({ sequenceNumber: '1', name: 'name', description: 'desc', image: 'data' });
      const task = instance.setMetadataIndexResolver(1, instance.address);
      await truffleAssert.fails(
        task,
        truffleAssert.ErrorType.REVERT,
        'resolver does not implement IMetadataIndexResolver'
      );
    });
    it('should revert if sequence hasnt started', async () => {
      const instance = await factory();
      const resolver = await MockMetadataIndexResolver.new();
      const task = instance.setMetadataIndexResolver(1, resolver.address);
      await truffleAssert.fails(task, truffleAssert.ErrorType.REVERT, 'sequence is not active');
    });
    it('should revert if sequence has completed', async () => {
      const instance = await factory();
      const resolver = await MockMetadataIndexResolver.new();
      await instance.startSequence({ sequenceNumber: '1', name: 'name', description: 'desc', image: 'data' });
      await instance.completeSequence(1);
      const task = instance.setMetadataIndexResolver(1, resolver.address);
      await truffleAssert.fails(task, truffleAssert.ErrorType.REVERT, 'sequence is not active');
    });
    it('should should revert if resolver is already set', async () => {
      const instance = await factory();
      const resolver = await MockMetadataIndexResolver.new();
      await instance.startSequence({ sequenceNumber: '1', name: 'name', description: 'desc', image: 'data' });
      await instance.setMetadataIndexResolver(1, resolver.address);
      const task = instance.setMetadataIndexResolver(1, resolver.address);
      await truffleAssert.fails(task, truffleAssert.ErrorType.REVERT, 'metadata index resolver already set');
    });
    it('should revert if caller does not have MINTER role', async () => {
      const [, a2] = accounts;
      const instance = await factory();
      const resolver = await MockMetadataIndexResolver.new();
      await instance.startSequence({ sequenceNumber: '1', name: 'name', description: 'desc', image: 'data' });
      const task = instance.setMetadataIndexResolver(1, resolver.address, { from: a2 });
      await truffleAssert.fails(task, truffleAssert.ErrorType.REVERT, 'requires MINTER_ROLE');
    });
  });
});

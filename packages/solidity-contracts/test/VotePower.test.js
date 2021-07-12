const truffleAssert = require('truffle-assertions');

const Vibes = artifacts.require('Vibes');
const TokenLockManager = artifacts.require('TokenLockManager');
const NFTTokenFaucetV2 = artifacts.require('NFTTokenFaucetV2');
const MockERC721 = artifacts.require('MockERC721');
const VotePower = artifacts.require('VotePower');
const ERC20BalanceStrategy = artifacts.require('ERC20BalanceStrategy');
const NFTTokenFaucetStrategy = artifacts.require('NFTTokenFaucetStrategy');
const MockPair = artifacts.require('MockPair');
const UniswapPoolStrategy = artifacts.require('UniswapPoolStrategy');

const factory = async () => {
  const vibes = await Vibes.new();
  const otherToken = await Vibes.new();
  const nft = await MockERC721.new();
  const lock = await TokenLockManager.new(nft.address);
  const faucet = await NFTTokenFaucetV2.new({ token: vibes.address, nft: nft.address, lock: lock.address });
  const pair = await MockPair.new(vibes.address, otherToken.address);
  await vibes.approve(faucet.address, '0xffffffffffffffffffffffffffffffff');

  const erc20Strategy = await ERC20BalanceStrategy.new(vibes.address);
  const faucetStrategy = await NFTTokenFaucetStrategy.new(faucet.address);
  const uniswapStrategy = await UniswapPoolStrategy.new(pair.address, vibes.address);
  const votePower = await VotePower.new();

  // doesnt include uniswap strat cuz the mock hardcodes stuff
  await votePower.setStrategies([erc20Strategy.address, faucetStrategy.address]);

  return { vibes, nft, lock, faucet, votePower, erc20Strategy, faucetStrategy, uniswapStrategy, pair };
};

const BN = (amount) => `${amount}000000000000000000`;

contract('VotePower', (accounts) => {
  it('should handle zero power fine', async () => {
    const [, a2] = accounts;
    const { votePower } = await factory();
    assert.equal(await votePower.getVotePower(a2), 0);
  });
  it('should factor in erc20 balance in vote power', async () => {
    const [a1] = accounts;
    const { vibes, votePower } = await factory();
    await vibes.mintTo(a1, BN(1000));
    const power = await votePower.getVotePower(a1);
    assert.equal(power, BN(1000));
  });
  it('should factor in claimable tokens from the faucet', async () => {
    const [a1] = accounts;
    const { nft, faucet, vibes, faucetStrategy, votePower } = await factory();
    const tokenId1 = '1';
    const tokenId2 = '2';

    await vibes.mintTo(a1, BN(100 * 10)); // create tokens
    await nft.mint(tokenId1); // mint NFTs
    await nft.mint(tokenId2);
    await faucet.seed(tokenId1, BN(100), 5, 10); // seed w/ backdated starts
    await faucet.seed(tokenId2, BN(100), 4, 10);

    assert.equal(await faucetStrategy.getVotePower(a1), BN(900));
    assert.equal(await votePower.getVotePower(a1), BN(1000));
  });
  it('should process uniswap strategy', async () => {
    const [a1] = accounts;
    const { uniswapStrategy } = await factory();
    // lp = 100 / 1000, token0 reserve = 500, so pooled = 50
    assert.equal(await uniswapStrategy.getVotePower(a1), BN(50));
  });
  it('it should do all the above shit at once lmao LFG', async () => {
    const [a1, a2] = accounts;
    const { nft, faucet, vibes, faucetStrategy, votePower, uniswapStrategy, erc20Strategy } = await factory();

    const tokenId1 = '1';
    const tokenId2 = '2';

    await vibes.mintTo(a1, BN(100 * 10)); // create 1000 tokens
    await nft.mint(tokenId1); // mint NFTs
    await nft.mint(tokenId2, { from: a2 });
    await faucet.seed(tokenId1, BN(100), 5, 10); // seed / backdate 500 tokens
    await faucet.seed(tokenId2, BN(100), 4, 10); // seed 400, shouldnt count, owned by a2
    await votePower.setStrategies([faucetStrategy.address, uniswapStrategy.address, erc20Strategy.address]); // apply all

    // total should be 100 tokens left in wallet + 500 from token1 + 50 from uniswap hard code
    assert.equal(await votePower.getVotePower(a1), BN(650));

    // a2 has 400 from token2A + 50 from uniswap hardcode
    assert.equal(await votePower.getVotePower(a2), BN(450));

    await votePower.setStrategies([faucetStrategy.address]); // just faucet, to check
    assert.equal(await votePower.getVotePower(a1), BN(500));
    assert.equal(await votePower.getVotePower(a2), BN(400));
  });
  it('should not allow instantiating a uniswap strategy with a mismatched token', async () => {
    const token1 = await Vibes.new();
    const token2 = await Vibes.new();
    const token3 = await Vibes.new();
    const pair = await MockPair.new(token1.address, token2.address);

    // does not revert
    await UniswapPoolStrategy.new(pair.address, token1.address);
    await UniswapPoolStrategy.new(pair.address, token2.address);

    const task = UniswapPoolStrategy.new(pair.address, token3.address);
    await truffleAssert.fails(task, truffleAssert.ErrorType.REVERT, 'token is not part pair');
  });
  it('should throw of non admin attempts to set strategies', async () => {
    const [, a2] = accounts;
    const { votePower } = await factory();
    const task = votePower.setStrategies([], { from: a2 });
    await truffleAssert.fails(task, truffleAssert.ErrorType.REVERT, 'requires DEFAULT_ADMIN_ROLE');
  });
});

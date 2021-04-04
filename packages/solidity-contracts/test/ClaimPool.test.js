const truffleAssert = require('truffle-assertions');

const ClaimPool = artifacts.require('ClaimPool');
const BVAL20 = artifacts.require('BVAL20');

const factory = async () => {
  const token = await BVAL20.new();
  const pool = await ClaimPool.new(token.address);
  return { token, pool };
};

contract.only('ClaimPool', (accounts) => {
  describe('poolReserve', () => {
    it('start at zero', async () => {
      const { pool } = await factory();
      assert.equal(await pool.poolReserve(), 0);
    });
    it('should reflect directly transfered ERC20s', async () => {
      const { pool, token } = await factory();
      await token.mintTo(pool.address, 1000);
      assert.equal(await pool.poolReserve(), 1000);
    });
    it('should go down after claims', async () => {
      const [, a2] = accounts;
      const { pool, token } = await factory();
      await pool.addClaims([{ payee: a2, amount: 400 }]);
      assert.equal(await pool.poolReserve(), 0);
      await token.mintTo(pool.address, 1000);
      await pool.claim({ from: a2 });
      assert.equal(await pool.poolReserve(), 600);
    });
  });
  describe('claim', () => {
    it('should revert if nothing to claim', async () => {
      const { pool } = await factory();
      const task = pool.claim();
      await truffleAssert.fails(task, truffleAssert.ErrorType.REVERT, 'nothing to claim');
    });
    it('should only claim whats avail in the pool', async () => {
      const [a1] = accounts;
      const { pool, token } = await factory();
      await pool.addClaims([{ payee: a1, amount: 1000 }]);
      await token.mintTo(pool.address, 200);
      await pool.claim();
      assert.equal(await token.balanceOf(a1), 200);
      assert.equal(await pool.poolReserve(), 0);
      assert.equal(await pool.totalOutstandingClaims(), 800);
    });
  });
});

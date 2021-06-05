const truffleAssert = require('truffle-assertions');

const CoreERC20 = artifacts.require('CoreERC20');

const factory = async () => {
  return CoreERC20.new('Name', 'SYMBOL');
};

// max gas for deployment
const MAX_DEPLOYMENT_GAS = 2200000;

contract.only('CoreERC20', (accounts) => {
  describe('gas constraints', () => {
    it('should deploy with less than target deployment gas', async () => {
      const instance = await factory();
      let { gasUsed } = await web3.eth.getTransactionReceipt(instance.transactionHash);
      assert.isBelow(gasUsed, MAX_DEPLOYMENT_GAS);
      console.log('deployment', gasUsed);
    });
  });
  describe('metadata', () => {
    it('should return name', async () => {
      const instance = await factory();
      const name = await instance.name();
      assert.isString(name);
    });
    it('should return symbol', async () => {
      const instance = await factory();
      const symbol = await instance.symbol();
      assert.isString(symbol);
    });
  });
  describe('burn', () => {
    it('should allow burning held tokens', async () => {
      const [a1] = accounts;
      const instance = await factory();
      await instance.mintTo(a1, 1000);
      assert.equal(await instance.balanceOf(a1), 1000);
      await instance.burn(1000);
      assert.equal(await instance.balanceOf(a1), 0);
      const task = instance.burn(1000);
      await truffleAssert.fails(task, truffleAssert.ErrorType.REVERT, 'burn amount exceeds balance');
    });
    it('should not allow burning more than balance', async () => {
      const instance = await factory();
      const task = instance.burn(1000);
      await truffleAssert.fails(task, truffleAssert.ErrorType.REVERT, 'burn amount exceeds balance');
    });
  });
  // mostly proving to myself this works like i think it does, this is
  // really testing the underlying AccessControl functionality from open zep
  describe('role renouncement', () => {
    it('should allow eventual minting lockout', async () => {
      const [a1, a2] = accounts;
      const instance = await factory();
      await instance.revokeRole(await instance.MINTER_ROLE(), a1);
      await instance.revokeRole(await instance.MINTER_ADMIN_ROLE(), a1);

      // can no longer mint
      const task1 = instance.mintTo(a1, 1000);
      await truffleAssert.fails(task1, truffleAssert.ErrorType.REVERT, 'requires MINTER_ROLE');

      // can no longer assign mint role
      const task2 = instance.grantRole(await instance.MINTER_ROLE(), a1);
      await truffleAssert.fails(task2, truffleAssert.ErrorType.REVERT, 'is missing role');

      assert.equal(await instance.getRoleMemberCount(await instance.MINTER_ROLE()), 0);
      assert.equal(await instance.getRoleMemberCount(await instance.MINTER_ADMIN_ROLE()), 0);
    });
  });
});

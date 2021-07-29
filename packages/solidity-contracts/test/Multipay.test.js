const truffleAssert = require('truffle-assertions');

const MockERC20 = artifacts.require('MockERC20');
const Multipay = artifacts.require('Multipay');

const { toWei, fromWei } = web3.utils;

contract.only('Multipay', (accounts) => {
  const [a1, a2, a3, a4, a5] = accounts;
  describe('payments', () => {
    it('should increment batch id', async () => {
      const multipay = await Multipay.new();
      const token = await MockERC20.new();
      assert.equal(await multipay.nextBatchId(), 1);
      await multipay.pay(token.address, 'summmary', []);
      assert.equal(await multipay.nextBatchId(), 2);
    });
    it('should send payments', async () => {
      const multipay = await Multipay.new();
      const token = await MockERC20.new();
      await token.mint(toWei('1000'));
      await token.approve(multipay.address, toWei('1000'));

      const resp = await multipay.pay(token.address, 'summary', [
        { to: a2, amount: toWei('100'), reason: 'a2-1' },
        { to: a3, amount: toWei('150'), reason: 'a3' },
        { to: a4, amount: toWei('200'), reason: 'a4' },
        { to: a5, amount: toWei('250'), reason: 'a5' },
        { to: a2, amount: toWei('300'), reason: 'a2-2' },
      ]);

      assert.equal(await token.balanceOf(multipay.address), 0);
      assert.equal(await token.balanceOf(a1), 0);
      assert.equal(await token.balanceOf(a2), toWei('400'));
      assert.equal(await token.balanceOf(a3), toWei('150'));
      assert.equal(await token.balanceOf(a4), toWei('200'));
      assert.equal(await token.balanceOf(a5), toWei('250'));

      truffleAssert.eventEmitted(resp, 'PaymentSent', (event) => {
        return (
          event.to === a2 &&
          event.batchId.toNumber() === 1 &&
          event.token === token.address &&
          event.amount.toString() === toWei('100') &&
          event.reason === 'a2-1'
        );
      });

      truffleAssert.eventEmitted(resp, 'PaymentBatch', (event) => {
        return event.batchId.toNumber() === 1 && event.summary === 'summary';
      });
    });
  });
});

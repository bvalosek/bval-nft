const BVAL20 = artifacts.require('BVAL20');

const factory = async () => {
  return BVAL20.new();
};

contract('BVAL20', (accounts) => {
  describe('metadata', () => {
    it('should return name', async () => {
      const instance = await factory();
      const name = await instance.name();
      assert.equal(name, '@bvalosek');
    });
    it('should return symbol', async () => {
      const instance = await factory();
      const symbol = await instance.symbol();
      assert.equal(symbol, 'BVAL');
    });
  });
});

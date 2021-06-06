const VIBES = artifacts.require('VIBES');

const factory = async () => {
  return VIBES.new();
};

contract('VIBES', (accounts) => {
  describe('metadata', () => {
    it('should return name', async () => {
      const instance = await factory();
      const name = await instance.name();
      assert.equal(name, 'Vibes');
    });
    it('should return symbol', async () => {
      const instance = await factory();
      const symbol = await instance.symbol();
      assert.equal(symbol, 'VIBES');
    });
  });
});

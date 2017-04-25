import Purchase from 'sm/models/purchase';

describe('Model Purchase', () => {
    it('can be instantiated', () => {
        const model = new Purchase();
        expect(model).toBeInstanceOf(Purchase);
    });
});

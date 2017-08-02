import Redemption from 'sm/models/redemption';

describe('Model Redemption', () => {
    it('can be instantiated', () => {
        const model = new Redemption();
        expect(model).toBeInstanceOf(Redemption);
    });
});

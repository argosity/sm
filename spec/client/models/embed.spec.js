import Embed from 'sm/models/embed';

describe('Model Embed', () => {
    it('can be instantiated', () => {
        const model = new Embed();
        expect(model).toBeInstanceOf(Embed);
    });
});

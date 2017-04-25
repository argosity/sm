import Venue from 'sm/models/venue';

describe('Model Venue', () => {
    it('can be instantiated', () => {
        const model = new Venue();
        expect(model).toBeInstanceOf(Venue);
    });
});

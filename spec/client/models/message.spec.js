import Message from 'sm/models/message';

describe('Model Message', () => {
    it('can be instantiated', () => {
        const model = new Message();
        expect(model).toBeInstanceOf(Message);
    });
});

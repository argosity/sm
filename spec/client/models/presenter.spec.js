import Presenter from 'sm/models/presenter';

describe('Model Presenter', () => {
    it('can be instantiated', () => {
        const model = new Presenter();
        expect(model).toBeInstanceOf(Presenter);
    });
});

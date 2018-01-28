import { JSDOM } from 'jsdom';
import Embed from 'sm/embed/shows/embed';

jest.mock('hippo/lib/xhr', () => (
    (opt, cb) => {
        cb.success({
            response: '<p>hello world!</p>',
        });
    }
));

describe('Embedded Shows', () => {
    let embed;
    let doc;

    beforeEach(() => {
        doc = new JSDOM('<!DOCTYPE html><body><div></div></body>')
            .window.document;
        embed = new Embed(
            doc.querySelector('div'),
            'test.test.com',
            { embedId: '1234' },
        );
    });

    it('renders show listing', () => {
        expect(doc.querySelector('div').textContent)
            .toEqual('hello world!');
        expect(embed.view.constructor.name).toEqual('Listing');
    });
});

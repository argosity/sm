import Sale from 'sm/models/sale';
import Show from 'sm/models/show';
import Form from 'sm/components/sale/form';
import chronokinesis from 'chronokinesis';
import moment from 'moment-timezone';

jest.mock('sm/extension', () => ({
    paymentsVendor: 'Square',
}));

describe('Payment Form', () => {
    let props;

    beforeEach(() => {
        chronokinesis.travel(new Date('2017-05-01T21:00:00.000Z'));
        moment.tz.setDefault('America/Los_Angeles');
        props = {
            sale: new Sale({
                noCharge: true,
                show: new Show({
                    times: [{
                        occurs_at: new Date('2017-11-01T02:38:38.600Z'),
                        price: 12.3,
                    }],
                }),
            }),
            onComplete: jest.fn(),
        };
    });

    it('matches snapshot', () => {
        expect(<Form {...props} />).toMatchSnapshot();
    });

    it('sets sale values', () => {
        const form = mount(<Form {...props} />);
        form.find('input[name="qty"]').simulate(
            'change', { target: { value: 3 } },
        );
        form.find('input[name="name"]').simulate(
            'change', { target: { value: 'My Name' } },
        );
        form.find('input[name="email"]').simulate(
            'change', { target: { value: 'test@test.com' } },
        );
        form.find('input[name="phone"]').simulate(
            'change', { target: { value: '123-456-7890' } },
        );

        return form.instance().saveState().then((sale) => {
            expect(sale.qty).toEqual(3);
            expect(sale.name).toEqual('My Name');
            expect(sale.email).toEqual('test@test.com');
            expect(sale.phone).toEqual('123-456-7890');
        });
    });
});

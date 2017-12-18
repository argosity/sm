PAYMENT_CONFIGS = {
    'Braintree' => {
        'config' => {
            'sandbox_mode' => true,
            'merchant_id'  => 'dshtky2jcjpr96z3',
            'public_key'   => 'hm7n6vc84jbr962w',
            'private_key'  => '413cb3c8af29b3c3ba340cfb715f4532'
        },
        'settings' => {},
        'nonce' => 'fake-valid-nonce'
    },
    'Square' => {
        'config' => {
            'location_id' => 'CBASEDPaLCabJaF09RCTuXK7uZYgAQ',
            'token' => 'sandbox-sq0atb-Zefd9e__fbXtLIJYiJaiOA'
        },
        'settings' => {
            'application_id' => 'sandbox-sq0idp-i06hC8ZeXrqOujH_QfYt5Q'
        },
        'nonce' => 'fake-card-nonce-ok'
    }
}

module PaymentHelpers
    def with_payment_proccessor(vendor)
        vendorModule = SM::Payments.const_get(vendor)
        allow(SM::Payments).to receive(:vendor) { vendorModule }
        allow(vendorModule).to receive(:system_settings_values) {
            PAYMENT_CONFIGS[vendor]['settings'];
        }
        allow(vendorModule).to receive(:client_config_values) {
            PAYMENT_CONFIGS[vendor]['config'];
        }
        yield
    end

    def payment_processor_nonce(vendor)
        PAYMENT_CONFIGS[vendor]['nonce'];
    end

    def payment_processor_make_sale_invalid(show, vendor)
        case vendor
        when 'Braintree'
            show.update_attributes(price: '2001.00')
        when 'Square'
            show.update_attributes(price: '4.03')
        end
    end
end

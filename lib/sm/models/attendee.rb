module SM

    class Attendee < Model

        belongs_to_tenant
        has_many :shows

        def first_name
            name.split(' ', 2).first
        end

        def last_name
            name.split(' ', 2).last
        end

        def square_customer_id
            metadata['square_customer_id'] || create_square_customer
        end

        def has_10_digit_phone?
            phone.to_s.gsub(/\D/, '').length == 10
        end

        def formatted_phone
            phone.to_s.gsub(/\D/, '').gsub(/^(\d{3})(\d+)(\d{4})$/, '\1-\2-\3')
        end

        def create_square_customer
            ca = SquareConnect::CustomersApi.new(
                SM::Payments::Square.api_client
            )
            attrs = {}
            attrs['email_address'] = email if email.present?
            attrs['given_name'] = name if name.present?
            attrs['phone_number'] = formatted_phone if has_10_digit_phone?
            begin
                reply = ca.create_customer(attrs)
                metadata['square_customer_id'] = reply.customer.id
                save!
                return reply.customer.id
            rescue SquareConnect::ApiError => e
                Hippo.logger.warn "Failed to create square customer: #{e}"
            end
        end

        def self.for_sale_data(data)
            record = find_or_initialize_by(
                email: data['email']
            )
            record.attributes = data.slice('name', 'phone')
            record
        end

    end

end

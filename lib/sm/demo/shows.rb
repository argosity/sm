module SM::Demo

    module Shows
        IDS = %w(
            gZm7pgNjEgLP swjUR3Zgammx FQDu4hasAzAf EdhY9z9KHpPC cKALCaEzSbUm
            tm5rLjCbbu43 h3EPk6VXyTZS URezGrz74dJQ juUzEKJUPFsH kHehgHbTPqFV
        )

        TIME_IDS = [
            ["n6cVU26RdCR4", "NshbQAKeAQQj"],
            ["FcUySfpv3nPW", "eLxrpGKdPKUy", "ppAsP2pZyLj4"],
            ["rdrsAQHYdeyT"],
            ["zeZwZLheFEVE", "9QCqSL4VvUc7", "GTHvZDK26qGb"],
            ["gPSErjqZaQky"],
            ["3DzAXZnxbsCJ", "rFN7SHLKLrnN"],
            ["zZbQRgpdYkEk"],
            ["WxFubZeze3Vw"],
            ["RzxDLVJyARkA", "5sJwdqY75WDR"],
            ["qcWszUAtgt2T"]
          ]

        def self.update
            SM::Show.where('identifier not in (?)', IDS).delete_all
            IDS.map.with_index do |identifier, index|
                venue = SM::Demo.venues[
                    index % SM::Demo.venues.length
                ]
                presenter = nil
                unless 0 == Faker::Number.between(0, 4)
                    presenter = SM::Demo.presenters[
                        index % SM::Demo.presenters.length
                    ]
                end
                attrs = FactoryBot.attributes_for(
                    :show, identifier: identifier,
                ).merge(venue: venue, presenter: presenter)
                show = SM::Show.find_by(identifier: identifier) || SM::Show.build(attrs)

                open(Faker::Avatar.image, "rb") do |avatar|
                    show.build_image unless show.image
                    show.image.file = avatar
                end

                show.image
                show.update_attributes!(attrs)
                show_times = TIME_IDS[index]
                show.times.where('identifier not in (?)', show_times).delete_all
                show_times.each do |showid|
                    time = show.times.find_by(identifier: showid) || show.times.build
                    time.update_attributes!(
                        FactoryBot.attributes_for(
                            :show_time, show: show, identifier: showid
                        )
                    )
                    if time.can_purchase?
                        Faker::Number.between(1, 10).times do |sid|
                            identifier = "${time.identifier}#{sid}"
                            attendee = SM::Attendee.find_or_create_by(
                                FactoryBot.attributes_for(:attendee)
                            )
                            sale = time.sales.find_by(identifier: identifier) ||
                                   time.sales.build
                            sale.update_attributes!(
                                FactoryBot.attributes_for(
                                    :sale, show_time: time
                                ).merge(
                                    attendee: attendee
                                )
                            )
                        end
                    end
                end
                show
            end
        end
    end

end

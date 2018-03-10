module SM::Demo

    module Presenters
        IDS = {
            "WZ98" => 'HOT HITS WZ98',
            "RADTUNZE" => 'Rad Tunz',
            "WATZICA" => 'The Watzinca'
        }

        def self.update
            SM::Presenter.where('code not in (?)', IDS.keys).delete_all
            IDS.map do |code, name|
                presenter = SM::Presenter.find_by(code: code) || SM::Presenter.new
                presenter.build_logo unless presenter.logo
                open(Faker::Company.logo, "rb") do |avatar|
                    presenter.logo.file = avatar
                end
                presenter.update_attributes!({ code: code, name: name })
                presenter
            end
        end

    end
end

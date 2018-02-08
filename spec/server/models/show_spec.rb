require_relative '../spec_helper'

describe SM::Show do
    it "can be instantiated" do
        show = FactoryBot.build :show

        image = show.build_image
        image.file = Pathname.new(__FILE__).dirname.join('../../fixtures', 'stitt-spark-plug-logo.gif').open

        page = show.build_page(html: '<p>hi!</p>', contents: { })
        image = page.images.build
        image.file = Pathname.new(__FILE__).dirname.join('../../fixtures', 'stitt-spark-plug-logo.gif').open
        expect(show.save).to be true
        expect(image.new_record?).to eq(false)
        expect(image.owner_id).to eq(page.id)
    end
end

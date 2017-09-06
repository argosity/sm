require_relative '../spec_helper'

describe SM::Show do
    it "can be instantiated" do
        show = FactoryGirl.build :show

        image = show.build_image
        image.file = Pathname.new(__FILE__).dirname.join('../../fixtures', 'stitt-spark-plug-logo.gif').open

        image = show.page_images.build
        image.file = Pathname.new(__FILE__).dirname.join('../../fixtures', 'stitt-spark-plug-logo.gif').open
        expect(show.save).to be true
        expect(image.new_record?).to eq(false)
        expect(image.owner_id).to eq(show.id)
    end
end

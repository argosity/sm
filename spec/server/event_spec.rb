require_relative 'spec_helper'

describe SM::Event do
    it "can be instantiated" do
        event = FactoryGirl.build :event

        image = event.build_image
        image.file = Pathname.new(__FILE__).dirname.join("..","fixtures", 'stitt-spark-plug-logo.gif').open

        image = event.page_images.build
        image.file = Pathname.new(__FILE__).dirname.join("..","fixtures", 'stitt-spark-plug-logo.gif').open
        expect(event.save).to be true

        event = SM::Event.find( event.id )
        expect(event.image).not_to be_nil
        expect(event.page_images.length).to eq(1)
    end
end

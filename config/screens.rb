Lanes::Screen.define_group 'events' do | group |
    group.title       = "Events"
    group.description = "Screens relating to Events"
    group.icon        = "heart"
end

Lanes::Screen.for_extension 'sh' do | screens |
    screens.define "events" do | screen |
        screen.title       = "Events"
        screen.description = ""
        screen.icon        = ""
        screen.group_id    = "events"
        screen.model_class = ""
        screen.view_class  = "Events"
        screen.asset       = "events"
    end
end

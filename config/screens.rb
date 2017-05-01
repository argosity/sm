Lanes::Screen.enabled_group_ids = [
    'events', 'system-settings'
]

Lanes::Screen.define_group 'events' do | group |
    group.title       = "Events"
    group.description = "Screens relating to Events"
    group.icon        = "heart"
end

Lanes::Screen.for_extension 'sm' do | screens |
    screens.define "presenters" do | screen |
        screen.title       = "Presenters"
        screen.description = ""
        screen.icon        = ""
        screen.group_id    = "events"
    end
    screens.define "venues" do | screen |
        screen.title       = "Venues"
        screen.description = ""
        screen.icon        = ""
        screen.group_id    = "events"
    end
    screens.define "events" do | screen |
        screen.title       = "Listing"
        screen.description = ""
        screen.icon        = ""
        screen.group_id    = "events"
    end
    screens.define "embeds" do | screen |
        screen.title       = "Embedding"
        screen.description = ""
        screen.icon        = ""
        screen.group_id    = "events"
    end
end

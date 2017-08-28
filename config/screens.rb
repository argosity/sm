# Hippo::Screen.enabled_group_ids = [
#     'events', 'system-settings'
# ]

# Hippo::Screen.define_group 'events' do | group |
#     group.title       = "Events"
#     group.description = "Screens relating to Events"
#     group.icon        = "heart"
# end

Hippo::Screen.for_extension 'sm' do | screens |
    screens.define "box-office" do | screen |
        screen.title       = "Box Office"
        screen.icon        = "ticket"
        screen.group_id    = ""
    end

    screens.define "events" do | screen |
        screen.title       = "Events"
        screen.description = ""
        screen.icon        = "id-card-o"
        screen.group_id    = ""
    end
    screens.define "presenters" do | screen |
        screen.title       = "Presenters"
        screen.description = ""
        screen.icon        = "magic"
        screen.group_id    = ""
    end
    screens.define "venues" do | screen |
        screen.title       = "Venues"
        screen.description = ""
        screen.icon        = "building-o"
        screen.group_id    = ""
    end
    screens.define "embeds" do | screen |
        screen.title       = "Embedding"
        screen.description = ""
        screen.icon        = "list-alt"
        screen.group_id    = ""
    end

    screens.extend 'user-management' do | screen |
        screen.group_id = ''
        screen.icon        = "users"
    end
    screens.extend 'system-settings' do | screen |
        screen.group_id = ''
        screen.icon        = "cogs"
    end

end

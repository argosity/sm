require "lanes/guard_tasks"

Lanes::GuardTasks.run(self, name: "sh") do | tests |

    tests.client do

    end

    tests.server do
        watch(%r{^templates/latex/*}) { "spec/server/print_form_spec.rb" }
    end

end

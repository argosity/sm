module SM

    class Embed < Model
        acts_as_tenant

        has_random_identifier
    end

end

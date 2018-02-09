module SM
    module Concerns

        # A collection of handly utility methods to generate queries
        module HasPage

            module IncludedMetods
                def with_page_details_view
                    view = 'page_details'
                    q = select("#{view}.page").joins(
                        "join #{view} on owner_id = #{table_name}.id and owner_type='#{name}'"
                    )
                    if current_scope.nil? || current_scope.select_values.exclude?("#{table_name}.*")
                        q = q.select("#{table_name}.*")
                    end
                    q
                end
            end

            extend ActiveSupport::Concern

            module ClassMethods

                def has_page
                    has_one :page, as: :owner, dependent: :destroy, export: true
                    extend IncludedMetods
                end

            end
        end
    end
end

import Query    from 'lanes/models/query';


export default function createEventQuery() {
    const query = new Query({
        src: EventModel,
        syncOptions: { with: 'with_details' },
        fields: [
            { id: 'id', visible: false },
            'slug',
            'title',
            'sub_title',
            'description',
            'event_image',
            'venue_info',
            'occurs_at',
            'visible_after', 'visible_until',
            'onsale_after', 'onsale_until',
            'tickets_remaining',
        ],
    });

    return query;
}

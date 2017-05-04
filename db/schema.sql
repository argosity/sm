--
-- PostgreSQL database dump
--

-- Dumped from database version 9.6.2
-- Dumped by pg_dump version 9.6.2

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SET check_function_bodies = false;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: plpgsql; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS plpgsql WITH SCHEMA pg_catalog;


--
-- Name: EXTENSION plpgsql; Type: COMMENT; Schema: -; Owner: -
--

COMMENT ON EXTENSION plpgsql IS 'PL/pgSQL procedural language';


--
-- Name: pgcrypto; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS pgcrypto WITH SCHEMA public;


--
-- Name: EXTENSION pgcrypto; Type: COMMENT; Schema: -; Owner: -
--

COMMENT ON EXTENSION pgcrypto IS 'cryptographic functions';


SET search_path = public, pg_catalog;

--
-- Name: btree_hstore_ops; Type: OPERATOR FAMILY; Schema: public; Owner: -
--

CREATE OPERATOR FAMILY btree_hstore_ops USING btree;


--
-- Name: gin_hstore_ops; Type: OPERATOR FAMILY; Schema: public; Owner: -
--

CREATE OPERATOR FAMILY gin_hstore_ops USING gin;


--
-- Name: gist_hstore_ops; Type: OPERATOR FAMILY; Schema: public; Owner: -
--

CREATE OPERATOR FAMILY gist_hstore_ops USING gist;


--
-- Name: hash_hstore_ops; Type: OPERATOR FAMILY; Schema: public; Owner: -
--

CREATE OPERATOR FAMILY hash_hstore_ops USING hash;


SET default_tablespace = '';

SET default_with_oids = false;

--
-- Name: ar_internal_metadata; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE ar_internal_metadata (
    key character varying NOT NULL,
    value character varying,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL
);


--
-- Name: assets; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE assets (
    id integer NOT NULL,
    owner_type character varying NOT NULL,
    owner_id integer NOT NULL,
    "order" integer,
    file_data jsonb DEFAULT '{}'::jsonb NOT NULL,
    tenant_id integer NOT NULL
);


--
-- Name: assets_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE assets_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: assets_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE assets_id_seq OWNED BY assets.id;


--
-- Name: embeds; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE embeds (
    id integer NOT NULL,
    tenant_id integer NOT NULL,
    name text NOT NULL,
    identifier text NOT NULL,
    tenants text[] DEFAULT '{}'::text[],
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL
);


--
-- Name: embeds_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE embeds_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: embeds_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE embeds_id_seq OWNED BY embeds.id;


--
-- Name: events; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE events (
    id integer NOT NULL,
    tenant_id integer NOT NULL,
    identifier character varying NOT NULL,
    title text NOT NULL,
    page_html text,
    page_src text,
    sub_title text,
    description text,
    occurs_at timestamp without time zone NOT NULL,
    visible_after timestamp without time zone NOT NULL,
    visible_until timestamp without time zone NOT NULL,
    onsale_after timestamp without time zone NOT NULL,
    onsale_until timestamp without time zone NOT NULL,
    price numeric(15,2) NOT NULL,
    capacity integer NOT NULL,
    presenter_id integer,
    venue_id integer NOT NULL,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL
);


--
-- Name: venues; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE venues (
    id integer NOT NULL,
    tenant_id integer NOT NULL,
    code character varying NOT NULL,
    name text NOT NULL,
    address text,
    phone_number text,
    capacity integer NOT NULL,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL
);


--
-- Name: event_details; Type: VIEW; Schema: public; Owner: -
--

CREATE VIEW event_details AS
 SELECT ev.id AS event_id,
    json_build_object('id', event_asset.id, 'file_data', event_asset.file_data) AS image_details,
    json_build_object('id', venues.id, 'name', venues.name, 'address', venues.address, 'phone_number', venues.phone_number, 'logo', venue_asset.file_data) AS venue_details
   FROM (((events ev
     LEFT JOIN venues ON ((venues.id = ev.venue_id)))
     LEFT JOIN assets event_asset ON ((((event_asset.owner_type)::text = 'SM::Event'::text) AND (event_asset.owner_id = ev.id))))
     LEFT JOIN assets venue_asset ON ((((venue_asset.owner_type)::text = 'SM::Venue'::text) AND (venue_asset.owner_id = ev.venue_id))));


--
-- Name: events_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE events_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: events_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE events_id_seq OWNED BY events.id;


--
-- Name: payments; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE payments (
    id integer NOT NULL,
    tenant_id integer NOT NULL,
    purchase_id integer NOT NULL,
    amount numeric(15,2) NOT NULL,
    card_type text NOT NULL,
    digits text NOT NULL,
    processor_transaction text NOT NULL
);


--
-- Name: payments_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE payments_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: payments_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE payments_id_seq OWNED BY payments.id;


--
-- Name: presenters; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE presenters (
    id integer NOT NULL,
    tenant_id integer NOT NULL,
    code character varying NOT NULL,
    name character varying NOT NULL,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL
);


--
-- Name: presenters_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE presenters_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: presenters_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE presenters_id_seq OWNED BY presenters.id;


--
-- Name: tenants; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE tenants (
    id integer NOT NULL,
    slug character varying NOT NULL,
    email character varying NOT NULL,
    identifier text NOT NULL,
    name text NOT NULL,
    address text,
    phone_number text,
    subscription smallint,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL
);


--
-- Name: public_events; Type: VIEW; Schema: public; Owner: -
--

CREATE VIEW public_events AS
 SELECT em.identifier AS embed_identifier,
    tenant.slug AS tenant_slug,
    ev.identifier AS event_identifier,
    ev.title,
    ev.sub_title,
    ev.description,
    ev.page_html,
    ev.occurs_at,
    ev.onsale_after,
    ev.onsale_until,
    ev.price,
    ev.capacity,
    json_build_object('file_data', event_asset.file_data) AS image,
    json_build_object('name', presenter.name, 'logo', presenter_asset.file_data) AS presenter,
    json_build_object('name', venues.name, 'address', venues.address, 'phone_number', venues.phone_number, 'logo', venue_asset.file_data) AS venue
   FROM (((((((embeds em
     JOIN tenants tenant ON (((tenant.slug)::text IN ( SELECT unnest(em.tenants) AS unnest))))
     JOIN events ev ON (((ev.tenant_id = tenant.id) AND (ev.visible_after <= now()) AND (ev.visible_until >= now()))))
     LEFT JOIN venues ON ((venues.id = ev.venue_id)))
     LEFT JOIN presenters presenter ON ((presenter.id = ev.presenter_id)))
     LEFT JOIN assets event_asset ON ((((event_asset.owner_type)::text = 'SM::Event'::text) AND (event_asset.owner_id = ev.id))))
     LEFT JOIN assets presenter_asset ON ((((presenter_asset.owner_type)::text = 'SM::Presenter'::text) AND (presenter_asset.owner_id = presenter.id))))
     LEFT JOIN assets venue_asset ON ((((venue_asset.owner_type)::text = 'SM::Venue'::text) AND (venue_asset.owner_id = ev.venue_id))));


--
-- Name: purchases; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE purchases (
    id integer NOT NULL,
    tenant_id integer NOT NULL,
    event_id integer NOT NULL,
    qty integer NOT NULL,
    identifier text NOT NULL,
    name text NOT NULL,
    phone text,
    email text,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL
);


--
-- Name: purchases_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE purchases_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: purchases_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE purchases_id_seq OWNED BY purchases.id;


--
-- Name: schema_migrations; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE schema_migrations (
    version character varying NOT NULL
);


--
-- Name: system_settings; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE system_settings (
    id integer NOT NULL,
    configuration_id integer,
    settings jsonb DEFAULT '{}'::jsonb NOT NULL,
    tenant_id integer NOT NULL
);


--
-- Name: system_settings_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE system_settings_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: system_settings_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE system_settings_id_seq OWNED BY system_settings.id;


--
-- Name: tenants_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE tenants_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: tenants_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE tenants_id_seq OWNED BY tenants.id;


--
-- Name: users; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE users (
    id integer NOT NULL,
    login character varying NOT NULL,
    name character varying NOT NULL,
    email character varying NOT NULL,
    password_digest character varying NOT NULL,
    role_names character varying[] DEFAULT '{}'::character varying[] NOT NULL,
    options jsonb DEFAULT '{}'::jsonb NOT NULL,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL,
    tenant_id integer NOT NULL
);


--
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE users_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE users_id_seq OWNED BY users.id;


--
-- Name: venues_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE venues_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: venues_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE venues_id_seq OWNED BY venues.id;


--
-- Name: assets id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY assets ALTER COLUMN id SET DEFAULT nextval('assets_id_seq'::regclass);


--
-- Name: embeds id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY embeds ALTER COLUMN id SET DEFAULT nextval('embeds_id_seq'::regclass);


--
-- Name: events id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY events ALTER COLUMN id SET DEFAULT nextval('events_id_seq'::regclass);


--
-- Name: payments id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY payments ALTER COLUMN id SET DEFAULT nextval('payments_id_seq'::regclass);


--
-- Name: presenters id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY presenters ALTER COLUMN id SET DEFAULT nextval('presenters_id_seq'::regclass);


--
-- Name: purchases id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY purchases ALTER COLUMN id SET DEFAULT nextval('purchases_id_seq'::regclass);


--
-- Name: system_settings id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY system_settings ALTER COLUMN id SET DEFAULT nextval('system_settings_id_seq'::regclass);


--
-- Name: tenants id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY tenants ALTER COLUMN id SET DEFAULT nextval('tenants_id_seq'::regclass);


--
-- Name: users id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY users ALTER COLUMN id SET DEFAULT nextval('users_id_seq'::regclass);


--
-- Name: venues id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY venues ALTER COLUMN id SET DEFAULT nextval('venues_id_seq'::regclass);


--
-- Name: ar_internal_metadata ar_internal_metadata_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY ar_internal_metadata
    ADD CONSTRAINT ar_internal_metadata_pkey PRIMARY KEY (key);


--
-- Name: assets assets_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY assets
    ADD CONSTRAINT assets_pkey PRIMARY KEY (id);


--
-- Name: embeds embeds_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY embeds
    ADD CONSTRAINT embeds_pkey PRIMARY KEY (id, tenant_id);


--
-- Name: events events_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY events
    ADD CONSTRAINT events_pkey PRIMARY KEY (id, tenant_id);


--
-- Name: payments payments_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY payments
    ADD CONSTRAINT payments_pkey PRIMARY KEY (id, tenant_id);


--
-- Name: presenters presenters_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY presenters
    ADD CONSTRAINT presenters_pkey PRIMARY KEY (id, tenant_id);


--
-- Name: purchases purchases_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY purchases
    ADD CONSTRAINT purchases_pkey PRIMARY KEY (id, tenant_id);


--
-- Name: schema_migrations schema_migrations_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY schema_migrations
    ADD CONSTRAINT schema_migrations_pkey PRIMARY KEY (version);


--
-- Name: system_settings system_settings_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY system_settings
    ADD CONSTRAINT system_settings_pkey PRIMARY KEY (id);


--
-- Name: tenants tenants_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY tenants
    ADD CONSTRAINT tenants_pkey PRIMARY KEY (id);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: venues venues_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY venues
    ADD CONSTRAINT venues_pkey PRIMARY KEY (id, tenant_id);


--
-- Name: index_assets_on_owner_id_and_owner_type; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_assets_on_owner_id_and_owner_type ON assets USING btree (owner_id, owner_type);


--
-- Name: index_embeds_on_identifier; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX index_embeds_on_identifier ON embeds USING btree (identifier);


--
-- Name: index_events_on_identifier; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX index_events_on_identifier ON events USING btree (identifier);


--
-- Name: index_events_on_presenter_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_events_on_presenter_id ON events USING btree (presenter_id);


--
-- Name: index_events_on_tenant_id_and_visible_after_and_visible_until; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_events_on_tenant_id_and_visible_after_and_visible_until ON events USING btree (tenant_id, visible_after, visible_until);


--
-- Name: index_events_on_venue_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_events_on_venue_id ON events USING btree (venue_id);


--
-- Name: index_purchases_on_identifier; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX index_purchases_on_identifier ON purchases USING btree (identifier);


--
-- Name: index_system_settings_on_id_and_tenant_id; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX index_system_settings_on_id_and_tenant_id ON system_settings USING btree (id, tenant_id);


--
-- Name: index_tenants_on_identifier; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX index_tenants_on_identifier ON tenants USING btree (identifier);


--
-- Name: index_tenants_on_slug; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX index_tenants_on_slug ON tenants USING btree (slug);


--
-- Name: index_users_on_login_and_tenant_id; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX index_users_on_login_and_tenant_id ON users USING btree (login, tenant_id);


--
-- Name: index_users_on_role_names; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_users_on_role_names ON users USING gin (role_names);


--
-- PostgreSQL database dump complete
--

SET search_path TO "$user", public;

INSERT INTO "schema_migrations" (version) VALUES
('1'),
('2'),
('20140615031600'),
('20170305000101'),
('20170305000102'),
('20170305000201'),
('20170305000202'),
('20170305000314'),
('20170319000314'),
('20170406005123'),
('20170501012828'),
('20170502012828');



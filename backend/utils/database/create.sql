CREATE DATABASE postgres 

CREATE TABLE public.users (
    user_id integer NOT NULL,
    username text NOT NULL,
    preferences numeric(2,1)[] DEFAULT ARRAY[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    rating real,
    email text NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.users OWNER TO postgres;

CREATE SEQUENCE public."User_user_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."User_user_id_seq" OWNER TO postgres;

ALTER SEQUENCE public."User_user_id_seq" OWNED BY public.users.user_id;

CREATE TABLE public.day (
    day_id integer NOT NULL,
    user_id integer NOT NULL,
    day_date timestamp without time zone,
    events_list integer[]
);


ALTER TABLE public.day OWNER TO postgres;

CREATE SEQUENCE public.day_day_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.day_day_id_seq OWNER TO postgres;

ALTER SEQUENCE public.day_day_id_seq OWNED BY public.day.day_id;


CREATE TABLE public.event (
    event_id integer NOT NULL,
    title text NOT NULL,
    start_date timestamp without time zone,
    end_date timestamp without time zone,
    address text,
    price numeric(10,2),
    categories numeric(2,1)[],
    description text,
    images text[],
    lat double precision,
    long double precision
);


ALTER TABLE public.event OWNER TO postgres;


CREATE SEQUENCE public.event_event_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.event_event_id_seq OWNER TO postgres;


ALTER SEQUENCE public.event_event_id_seq OWNED BY public.event.event_id;


CREATE TABLE public.participation_history (
    participant_id integer NOT NULL,
    event_id integer NOT NULL,
    day_id integer NOT NULL,
    rating real,
    comments text
);


ALTER TABLE public.participation_history OWNER TO postgres;

CREATE SEQUENCE public.participation_history_day_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.participation_history_day_id_seq OWNER TO postgres;

ALTER SEQUENCE public.participation_history_day_id_seq OWNED BY public.participation_history.day_id;


CREATE TABLE public.past_events (
    event_id integer DEFAULT nextval('public.event_event_id_seq'::regclass) NOT NULL,
    title text NOT NULL,
    start_date timestamp without time zone NOT NULL,
    end_date timestamp without time zone NOT NULL,
    address text,
    price numeric(10,2),
    categories numeric(2,1)[],
    description text
);


ALTER TABLE public.past_events OWNER TO postgres;

ALTER TABLE ONLY public.day ALTER COLUMN day_id SET DEFAULT nextval('public.day_day_id_seq'::regclass);

ALTER TABLE ONLY public.event ALTER COLUMN event_id SET DEFAULT nextval('public.event_event_id_seq'::regclass);

ALTER TABLE ONLY public.participation_history ALTER COLUMN day_id SET DEFAULT nextval('public.participation_history_day_id_seq'::regclass);

ALTER TABLE ONLY public.users ALTER COLUMN user_id SET DEFAULT nextval('public."User_user_id_seq"'::regclass);

ALTER TABLE ONLY public.users
    ADD CONSTRAINT "User_email_key" UNIQUE (email);



ALTER TABLE ONLY public.users
    ADD CONSTRAINT "User_pkey" PRIMARY KEY (user_id);




ALTER TABLE ONLY public.day
    ADD CONSTRAINT day_pkey PRIMARY KEY (day_id, user_id);



ALTER TABLE ONLY public.event
    ADD CONSTRAINT event_pkey PRIMARY KEY (event_id);



ALTER TABLE ONLY public.participation_history
    ADD CONSTRAINT participation_history_pkey PRIMARY KEY (participant_id, event_id, day_id);



ALTER TABLE ONLY public.past_events
    ADD CONSTRAINT past_events_pkey PRIMARY KEY (event_id);



ALTER TABLE ONLY public.day
    ADD CONSTRAINT day_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(user_id);


ALTER TABLE ONLY public.participation_history
    ADD CONSTRAINT participation_history_event_id_fkey FOREIGN KEY (event_id) REFERENCES public.event(event_id) ON DELETE CASCADE;


ALTER TABLE ONLY public.participation_history
    ADD CONSTRAINT participation_history_participant_id_fkey FOREIGN KEY (participant_id) REFERENCES public.users(user_id) ON DELETE CASCADE;




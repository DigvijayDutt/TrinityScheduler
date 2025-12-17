--
-- PostgreSQL database dump
--

\restrict RcvSRxkzoH2Z7xXRxE0iPqdaBGF7uhMUlv6Uua5EhvR2pLahMFLyW4nzXN7sO96

-- Dumped from database version 17.2
-- Dumped by pg_dump version 18.0

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: assignments; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.assignments (
    id integer NOT NULL,
    jobid text,
    empid integer,
    jobdate date
);


ALTER TABLE public.assignments OWNER TO admin;

--
-- Name: assignments_id_seq; Type: SEQUENCE; Schema: public; Owner: admin
--

CREATE SEQUENCE public.assignments_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.assignments_id_seq OWNER TO admin;

--
-- Name: assignments_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: admin
--

ALTER SEQUENCE public.assignments_id_seq OWNED BY public.assignments.id;


--
-- Name: employees; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.employees (
    name character varying(255),
    teamlead integer,
    lister integer,
    mover_packer integer,
    cleaner integer,
    truck_driver integer,
    car_driver integer,
    id integer NOT NULL
);


ALTER TABLE public.employees OWNER TO admin;

--
-- Name: employees_id_seq; Type: SEQUENCE; Schema: public; Owner: admin
--

CREATE SEQUENCE public.employees_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.employees_id_seq OWNER TO admin;

--
-- Name: employees_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: admin
--

ALTER SEQUENCE public.employees_id_seq OWNED BY public.employees.id;


--
-- Name: jobs; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.jobs (
    type character varying(255),
    teamlead integer,
    lister integer,
    mover_packer integer,
    cleaner integer,
    truck_driver integer,
    car_driver integer,
    min_staff integer
);


ALTER TABLE public.jobs OWNER TO admin;

--
-- Name: scheduledjobs; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.scheduledjobs (
    id character varying(50) NOT NULL,
    address character varying(255),
    client character varying(255),
    assigned integer[],
    start_date date,
    status character varying(50) NOT NULL,
    type character varying(255)
);


ALTER TABLE public.scheduledjobs OWNER TO admin;

--
-- Name: skills; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.skills (
    onsite_work character varying(255)
);


ALTER TABLE public.skills OWNER TO admin;

--
-- Name: users; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.users (
    id integer NOT NULL,
    username character varying(50) NOT NULL,
    email character varying(255) NOT NULL,
    password_hash text NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.users OWNER TO admin;

--
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: admin
--

CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.users_id_seq OWNER TO admin;

--
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: admin
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- Name: assignments id; Type: DEFAULT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.assignments ALTER COLUMN id SET DEFAULT nextval('public.assignments_id_seq'::regclass);


--
-- Name: employees id; Type: DEFAULT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.employees ALTER COLUMN id SET DEFAULT nextval('public.employees_id_seq'::regclass);


--
-- Name: users id; Type: DEFAULT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- Data for Name: assignments; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.assignments (id, jobid, empid, jobdate) FROM stdin;
1	J-84687	3	2025-12-25
2	J-84687	5	2025-12-25
4	J-12516	3	2025-12-20
5	J-12516	5	2025-12-20
6	J-65419	3	2025-12-17
7	J-65419	7	2025-12-17
8	J-65419	9	2025-12-17
9	J-65419	5	2025-12-17
10	J-65419	6	2025-12-17
\.


--
-- Data for Name: employees; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.employees (name, teamlead, lister, mover_packer, cleaner, truck_driver, car_driver, id) FROM stdin;
ALEJANDRO MUNOZ	0	1	0	3	1	0	1
ARIANE OGG	1	1	1	1	3	0	2
BALRAJ SIDHU	3	1	3	3	1	3	3
ESHA HURRY	0	1	2	1	1	0	4
FRANCISCO DELGADO	2	1	2	3	2	0	5
GIOVANNA OGG	2	1	3	3	3	0	6
HARISH KUMAR	3	1	3	3	1	3	7
HUMBERTA RAMALHO	3	1	3	3	2	0	8
HUMBERTO SOARES	2	1	0	2	2	3	9
JUAN ESCOBAR	0	1	3	2	0	0	10
MANDEEP KAUR	2	1	2	3	3	0	11
MANUELA FARIA	3	1	0	3	3	0	12
NERY MUNOZ	0	1	0	3	2	0	13
RICHARD PLAZA	0	1	0	3	3	0	14
TONY VIEIRA	0	1	0	2	1	3	15
SUZI CROCKETT	3	1	3	3	3	0	16
\.


--
-- Data for Name: jobs; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.jobs (type, teamlead, lister, mover_packer, cleaner, truck_driver, car_driver, min_staff) FROM stdin;
Small Pack out (with listing)	1	1	1	2	1	0	3
Medium Pack out (with listing)	1	2	3	2	1	1	4
Large Pack out (with listing)	1	3	4	2	1	1	5
Small Content Manipulation (with listing)	1	1	1	2	0	1	2
Medium Content Manipulation (with listing)	1	2	3	2	0	1	3
Large Content Manipulation (with listing)	1	2	4	2	0	1	4
Small Job (Listing Only)	1	1	0	2	0	1	2
Medium Job (Listing Only)	1	2	0	2	0	1	2
Large Job (Listing Only)	1	3	0	2	0	1	3
Small Job (Electronics & Appliances Inspection)	1	1	2	2	1	0	2
Medium Job (Electronics & Appliances Inspection)	1	1	2	2	1	0	2
Large Job (Electronics & Appliances Inspection)	1	2	2	2	1	1	2
Small Job (On-Site Cleaning)	1	2	0	2	0	1	2
Medium Job (On-Site Cleaning)	1	2	0	3	0	1	3
Large Job (On-Site Cleaning)	1	2	0	4	0	1	4
Small Pack Back	1	2	1	1	1	0	2
Medium Pack Back	1	2	3	2	1	1	3
Large Pack Back	1	2	5	3	1	1	5
Small Pack out / Move (no listing)	1	2	1	2	1	0	2
Medium Pack out / Move (no listing)	1	2	3	2	1	0	3
Large Pack out / Move (no listing)	1	2	4	2	1	1	4
Small Content Manipulation (no listing)	1	2	1	2	0	1	2
Medium Content Manipulation (no listing)	1	2	3	2	0	1	3
Large Content Manipulation (no listing)	1	2	4	2	0	1	3
Small Job (Art Assessment/Restoration)	1	2	1	2	1	0	2
Medium Job (Art Assessment/Restoration)	1	2	1	2	1	0	2
Large Job (Art Assessment/Restoration)	1	2	1	2	1	0	2
Small Job (Furniture Assessment/Restoration)	1	2	1	2	1	0	2
Medium Job (Furniture Assessment/Restoration)	1	2	1	2	1	0	2
Large Job (Furniture Assessment/Restoration)	1	2	1	2	1	0	2
Small Job (Dry-Cleaning)	1	2	1	2	0	1	2
Medium Job (Dry-Cleaning)	1	2	1	2	1	0	2
Large Job (Dry-Cleaning)	1	2	2	2	1	0	3
\.


--
-- Data for Name: scheduledjobs; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.scheduledjobs (id, address, client, assigned, start_date, status, type) FROM stdin;
J-84687	asdads	Client 1	{3,5}	2025-12-25	Scheduled	Small Pack out / Move (no listing)
J-12516	asdada	Client 1	{3,5}	2025-12-20	Scheduled	Small Pack out / Move (no listing)
J-65419	asdasd	Client 1	{3,7,9,5,6}	2025-12-17	Completed	Large Pack out (with listing)
\.


--
-- Data for Name: skills; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.skills (onsite_work) FROM stdin;
teamlead
lister
mover_packer
cleaner
truck_driver
car_driver
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.users (id, username, email, password_hash, created_at) FROM stdin;
1	testuser	test@example.com	$2b$10$Lz5bamZD1uUPVZQ8xFfZoOmjY66O0g4YwYdo.ZjE4mNQYy4hZO2uG	2025-11-13 17:50:47.834204
2	testuser2	test2@example.com	password123	2025-11-13 18:31:52.828029
\.


--
-- Name: assignments_id_seq; Type: SEQUENCE SET; Schema: public; Owner: admin
--

SELECT pg_catalog.setval('public.assignments_id_seq', 21, true);


--
-- Name: employees_id_seq; Type: SEQUENCE SET; Schema: public; Owner: admin
--

SELECT pg_catalog.setval('public.employees_id_seq', 16, true);


--
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: admin
--

SELECT pg_catalog.setval('public.users_id_seq', 2, true);


--
-- Name: assignments assignments_pkey; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.assignments
    ADD CONSTRAINT assignments_pkey PRIMARY KEY (id);


--
-- Name: employees employees_pkey; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.employees
    ADD CONSTRAINT employees_pkey PRIMARY KEY (id);


--
-- Name: assignments onejob; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.assignments
    ADD CONSTRAINT onejob UNIQUE (empid, jobdate);


--
-- Name: scheduledjobs scheduledjobs_pkey; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.scheduledjobs
    ADD CONSTRAINT scheduledjobs_pkey PRIMARY KEY (id);


--
-- Name: users users_email_key; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: users users_username_key; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_username_key UNIQUE (username);


--
-- Name: assignments assignments_empid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.assignments
    ADD CONSTRAINT assignments_empid_fkey FOREIGN KEY (empid) REFERENCES public.employees(id);


--
-- Name: assignments assignments_jobid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.assignments
    ADD CONSTRAINT assignments_jobid_fkey FOREIGN KEY (jobid) REFERENCES public.scheduledjobs(id) ON DELETE CASCADE;


--
-- Name: SCHEMA public; Type: ACL; Schema: -; Owner: pg_database_owner
--

GRANT ALL ON SCHEMA public TO admin;


--
-- PostgreSQL database dump complete
--

\unrestrict RcvSRxkzoH2Z7xXRxE0iPqdaBGF7uhMUlv6Uua5EhvR2pLahMFLyW4nzXN7sO96


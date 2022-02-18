--
-- PostgreSQL database dump
--

-- Dumped from database version 14.1 (Debian 14.1-1.pgdg110+1)
-- Dumped by pg_dump version 14.1

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

ALTER TABLE ONLY public."user" DROP CONSTRAINT "FK_33ef35730946bd2289747a0d7eb";
ALTER TABLE ONLY public."user" DROP CONSTRAINT "REL_33ef35730946bd2289747a0d7e";
ALTER TABLE ONLY public."user" DROP CONSTRAINT "PK_a95e949168be7b7ece1a2382fed";
ALTER TABLE ONLY public.address DROP CONSTRAINT "PK_496d4a29b0dfa82ede19a4bcad0";
DROP TABLE public."user";
DROP TABLE public.typeorm_metadata;
DROP TABLE public.address;
DROP TYPE public.user_role_enum;
DROP EXTENSION "uuid-ossp";
--
-- Name: uuid-ossp; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA public;


--
-- Name: EXTENSION "uuid-ossp"; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION "uuid-ossp" IS 'generate universally unique identifiers (UUIDs)';


--
-- Name: user_role_enum; Type: TYPE; Schema: public; Owner: db_user
--

CREATE TYPE public.user_role_enum AS ENUM (
    'USER',
    'ADMIN'
);


ALTER TYPE public.user_role_enum OWNER TO db_user;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: address; Type: TABLE; Schema: public; Owner: db_user
--

CREATE TABLE public.address (
    uuid uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    "createdAt" timestamp without time zone DEFAULT now() NOT NULL,
    "lastModifiedAt" timestamp without time zone DEFAULT now() NOT NULL,
    "deletedAt" timestamp without time zone,
    street character varying NOT NULL,
    number character varying NOT NULL,
    city character varying NOT NULL,
    "zipCode" character varying NOT NULL
);


ALTER TABLE public.address OWNER TO db_user;

--
-- Name: typeorm_metadata; Type: TABLE; Schema: public; Owner: db_user
--

CREATE TABLE public.typeorm_metadata (
    type character varying NOT NULL,
    database character varying,
    schema character varying,
    "table" character varying,
    name character varying,
    value text
);


ALTER TABLE public.typeorm_metadata OWNER TO db_user;

--
-- Name: user; Type: TABLE; Schema: public; Owner: db_user
--

CREATE TABLE public."user" (
    uuid uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    "createdAt" timestamp without time zone DEFAULT now() NOT NULL,
    "lastModifiedAt" timestamp without time zone DEFAULT now() NOT NULL,
    "deletedAt" timestamp without time zone,
    role public.user_role_enum DEFAULT 'USER'::public.user_role_enum NOT NULL,
    username character varying NOT NULL,
    "fullName" character varying NOT NULL,
    email character varying NOT NULL,
    phone character varying NOT NULL,
    birthdate timestamp without time zone NOT NULL,
    "addressUuid" uuid
);


ALTER TABLE public."user" OWNER TO db_user;

--
-- Data for Name: address; Type: TABLE DATA; Schema: public; Owner: db_user
--

COPY public.address (uuid, "createdAt", "lastModifiedAt", "deletedAt", street, number, city, "zipCode") FROM stdin;
1952e16c-11e1-4a23-861c-9566686cc5f4	2022-02-18 09:47:47.526119	2022-02-18 09:47:47.526119	\N	mühlebachstrasse	88	Zürich	8008
\.


--
-- Data for Name: typeorm_metadata; Type: TABLE DATA; Schema: public; Owner: db_user
--

COPY public.typeorm_metadata (type, database, schema, "table", name, value) FROM stdin;
\.


--
-- Data for Name: user; Type: TABLE DATA; Schema: public; Owner: db_user
--

COPY public."user" (uuid, "createdAt", "lastModifiedAt", "deletedAt", role, username, "fullName", email, phone, birthdate, "addressUuid") FROM stdin;
284e9d97-4f99-4dd0-b62e-af8d74e0e41a	2022-02-18 09:50:21.982371	2022-02-18 09:50:21.982371	\N	ADMIN	david-admin	hhaa	david.wyss@hotmail.ch	0817334728	1994-02-18 10:50:08	1952e16c-11e1-4a23-861c-9566686cc5f4
\.


--
-- Name: address PK_496d4a29b0dfa82ede19a4bcad0; Type: CONSTRAINT; Schema: public; Owner: db_user
--

ALTER TABLE ONLY public.address
    ADD CONSTRAINT "PK_496d4a29b0dfa82ede19a4bcad0" PRIMARY KEY (uuid);


--
-- Name: user PK_a95e949168be7b7ece1a2382fed; Type: CONSTRAINT; Schema: public; Owner: db_user
--

ALTER TABLE ONLY public."user"
    ADD CONSTRAINT "PK_a95e949168be7b7ece1a2382fed" PRIMARY KEY (uuid);


--
-- Name: user REL_33ef35730946bd2289747a0d7e; Type: CONSTRAINT; Schema: public; Owner: db_user
--

ALTER TABLE ONLY public."user"
    ADD CONSTRAINT "REL_33ef35730946bd2289747a0d7e" UNIQUE ("addressUuid");


--
-- Name: user FK_33ef35730946bd2289747a0d7eb; Type: FK CONSTRAINT; Schema: public; Owner: db_user
--

ALTER TABLE ONLY public."user"
    ADD CONSTRAINT "FK_33ef35730946bd2289747a0d7eb" FOREIGN KEY ("addressUuid") REFERENCES public.address(uuid);


--
-- PostgreSQL database dump complete
--


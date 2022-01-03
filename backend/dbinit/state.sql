--
-- PostgreSQL database dump
--

-- Dumped from database version 14.0 (Debian 14.0-1.pgdg110+1)
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

ALTER TABLE ONLY public.offer DROP CONSTRAINT "FK_e8635e2c8e3f27813847955f170";
ALTER TABLE ONLY public.public_file DROP CONSTRAINT "FK_e4250ab32f42ee78762eb0c6160";
ALTER TABLE ONLY public.company DROP CONSTRAINT "FK_e2ec6ea5ec961bdd0fc7c986267";
ALTER TABLE ONLY public.dossier DROP CONSTRAINT "FK_d5fc778ba89eeef772d68ac09f0";
ALTER TABLE ONLY public.employee DROP CONSTRAINT "FK_d51fc1f836fee82c6c77d913806";
ALTER TABLE ONLY public.dossier DROP CONSTRAINT "FK_ca26615c2fb1cb3be481b381f2c";
ALTER TABLE ONLY public.company DROP CONSTRAINT "FK_a9f680ed13cbcbb4bb1387b04bd";
ALTER TABLE ONLY public.comment DROP CONSTRAINT "FK_9c51df74fc7f7b59a6b2645c543";
ALTER TABLE ONLY public.bank DROP CONSTRAINT "FK_899821e269947d54e371c2a741e";
ALTER TABLE ONLY public.comment DROP CONSTRAINT "FK_7b6ea5bd28ac07eb1383034ee48";
ALTER TABLE ONLY public.offer DROP CONSTRAINT "FK_68cd3351a7128468f3de8fb487a";
ALTER TABLE ONLY public."user" DROP CONSTRAINT "FK_33ef35730946bd2289747a0d7eb";
ALTER TABLE ONLY public.dossier DROP CONSTRAINT "FK_27152041ea6d74671df043499ee";
ALTER TABLE ONLY public."user" DROP CONSTRAINT "UQ_33ef35730946bd2289747a0d7eb";
ALTER TABLE ONLY public.company DROP CONSTRAINT "REL_e2ec6ea5ec961bdd0fc7c98626";
ALTER TABLE ONLY public.dossier DROP CONSTRAINT "REL_d5fc778ba89eeef772d68ac09f";
ALTER TABLE ONLY public.dossier DROP CONSTRAINT "REL_ca26615c2fb1cb3be481b381f2";
ALTER TABLE ONLY public.company DROP CONSTRAINT "REL_a9f680ed13cbcbb4bb1387b04b";
ALTER TABLE ONLY public.bank DROP CONSTRAINT "REL_899821e269947d54e371c2a741";
ALTER TABLE ONLY public.dossier DROP CONSTRAINT "REL_27152041ea6d74671df043499e";
ALTER TABLE ONLY public.dossier DROP CONSTRAINT "PK_f9f49ba689e2abb87eaeded1d27";
ALTER TABLE ONLY public.comment DROP CONSTRAINT "PK_e45a9d11ff7a3cf11f6c42107b4";
ALTER TABLE ONLY public.public_file DROP CONSTRAINT "PK_ba13d24107ee3497d7d71f81be3";
ALTER TABLE ONLY public."user" DROP CONSTRAINT "PK_a95e949168be7b7ece1a2382fed";
ALTER TABLE ONLY public.soiemployee DROP CONSTRAINT "PK_9700773a76dd555d212de68e598";
ALTER TABLE ONLY public.bank DROP CONSTRAINT "PK_83a8522f1861bee5e13f4cba127";
ALTER TABLE ONLY public.soiadmin DROP CONSTRAINT "PK_7d6bdc6e4ceb6b1160167116acc";
ALTER TABLE ONLY public.employee DROP CONSTRAINT "PK_54452b02a5a8c125422e3697495";
ALTER TABLE ONLY public.address DROP CONSTRAINT "PK_496d4a29b0dfa82ede19a4bcad0";
ALTER TABLE ONLY public.offer DROP CONSTRAINT "PK_41c06b86e503ef9018af0d5e0dc";
ALTER TABLE ONLY public.company DROP CONSTRAINT "PK_3fa0b2af99d910864a56bb10c9e";
ALTER TABLE ONLY public.private_file DROP CONSTRAINT "PK_19ac201a356fa3aacef66563869";
ALTER TABLE ONLY public.product DROP CONSTRAINT "PK_1442fd7cb5e0b32ff5d0b6c13d0";
DROP TABLE public."user";
DROP TABLE public.typeorm_metadata;
DROP TABLE public.soiemployee;
DROP TABLE public.soiadmin;
DROP TABLE public.public_file;
DROP TABLE public.product;
DROP TABLE public.private_file;
DROP TABLE public.offer;
DROP TABLE public.employee;
DROP TABLE public.dossier;
DROP TABLE public.company;
DROP TABLE public.comment;
DROP TABLE public.bank;
DROP TABLE public.address;
DROP TYPE public.user_status_enum;
DROP TYPE public.user_role_enum;
DROP TYPE public.product_status_enum;
DROP TYPE public.product_currency_enum;
DROP TYPE public.product_category_enum;
DROP TYPE public.dossier_status_enum;
DROP TYPE public.company_creation_state_enum;
DROP SCHEMA public;
--
-- Name: public; Type: SCHEMA; Schema: -; Owner: db_user
--

CREATE SCHEMA public;


ALTER SCHEMA public OWNER TO db_user;

--
-- Name: SCHEMA public; Type: COMMENT; Schema: -; Owner: db_user
--

COMMENT ON SCHEMA public IS 'standard public schema';


--
-- Name: company_creation_state_enum; Type: TYPE; Schema: public; Owner: db_user
--

CREATE TYPE public.company_creation_state_enum AS ENUM (
    'APPLIED',
    'AWAITING_DOCUMENTS',
    'DOCUMENTS_UPLOADED',
    'DONE'
);


ALTER TYPE public.company_creation_state_enum OWNER TO db_user;

--
-- Name: dossier_status_enum; Type: TYPE; Schema: public; Owner: db_user
--

CREATE TYPE public.dossier_status_enum AS ENUM (
    'CREATED',
    'ACCEPTED',
    'REJECTED'
);


ALTER TYPE public.dossier_status_enum OWNER TO db_user;

--
-- Name: product_category_enum; Type: TYPE; Schema: public; Owner: db_user
--

CREATE TYPE public.product_category_enum AS ENUM (
    'CARS',
    'CELEBRITIES',
    'COOKING',
    'FASHION',
    'MUSIC',
    'OUTDOOR',
    'SPORTS',
    'TECHNOLOGY',
    'TOOLS',
    'TRAVELLING',
    'WATCHES'
);


ALTER TYPE public.product_category_enum OWNER TO db_user;

--
-- Name: product_currency_enum; Type: TYPE; Schema: public; Owner: db_user
--

CREATE TYPE public.product_currency_enum AS ENUM (
    'CHF',
    'EUR',
    'USD'
);


ALTER TYPE public.product_currency_enum OWNER TO db_user;

--
-- Name: product_status_enum; Type: TYPE; Schema: public; Owner: db_user
--

CREATE TYPE public.product_status_enum AS ENUM (
    'DRAFT',
    'VALID',
    'ARCHIVED'
);


ALTER TYPE public.product_status_enum OWNER TO db_user;

--
-- Name: user_role_enum; Type: TYPE; Schema: public; Owner: db_user
--

CREATE TYPE public.user_role_enum AS ENUM (
    'PLAYER',
    'PARTNER',
    'ADMIN',
    'NONE'
);


ALTER TYPE public.user_role_enum OWNER TO db_user;

--
-- Name: user_status_enum; Type: TYPE; Schema: public; Owner: db_user
--

CREATE TYPE public.user_status_enum AS ENUM (
    'APPLIED',
    'ACTIVE',
    'DISABLED',
    'NONE'
);


ALTER TYPE public.user_status_enum OWNER TO db_user;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: address; Type: TABLE; Schema: public; Owner: db_user
--

CREATE TABLE public.address (
    uuid uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    street character varying NOT NULL,
    number character varying NOT NULL,
    city character varying NOT NULL,
    "zipCode" character varying NOT NULL
);


ALTER TABLE public.address OWNER TO db_user;

--
-- Name: bank; Type: TABLE; Schema: public; Owner: db_user
--

CREATE TABLE public.bank (
    uuid uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    last_modified_at timestamp without time zone DEFAULT now() NOT NULL,
    deleted_at timestamp without time zone,
    first_name character varying NOT NULL,
    last_name character varying NOT NULL,
    email character varying NOT NULL,
    readable_id character varying NOT NULL,
    "addressUuid" uuid
);


ALTER TABLE public.bank OWNER TO db_user;

--
-- Name: comment; Type: TABLE; Schema: public; Owner: db_user
--

CREATE TABLE public.comment (
    uuid uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    content character varying NOT NULL,
    "productUuid" uuid,
    "userUuid" character varying
);


ALTER TABLE public.comment OWNER TO db_user;

--
-- Name: company; Type: TABLE; Schema: public; Owner: db_user
--

CREATE TABLE public.company (
    uuid uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    last_modified_at timestamp without time zone DEFAULT now() NOT NULL,
    deleted_at timestamp without time zone,
    first_name character varying NOT NULL,
    last_name character varying NOT NULL,
    email character varying NOT NULL,
    readable_id character varying NOT NULL,
    company_name character varying NOT NULL,
    language character varying NOT NULL,
    uid character varying NOT NULL,
    phone character varying NOT NULL,
    branch_structure boolean NOT NULL,
    creation_state public.company_creation_state_enum DEFAULT 'APPLIED'::public.company_creation_state_enum NOT NULL,
    "domicileAddressUuid" uuid,
    "correspondenceAddressUuid" uuid
);


ALTER TABLE public.company OWNER TO db_user;

--
-- Name: dossier; Type: TABLE; Schema: public; Owner: db_user
--

CREATE TABLE public.dossier (
    uuid uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    last_modified_at timestamp without time zone DEFAULT now() NOT NULL,
    deleted_at timestamp without time zone,
    first_name character varying NOT NULL,
    last_name character varying NOT NULL,
    email character varying NOT NULL,
    readable_id character varying NOT NULL,
    born timestamp without time zone NOT NULL,
    loan_sum integer NOT NULL,
    non_arrangeable boolean NOT NULL,
    status public.dossier_status_enum DEFAULT 'CREATED'::public.dossier_status_enum NOT NULL,
    "correspondenceAddressUuid" uuid,
    "originalBankUuid" uuid,
    "propertyAddressUuid" uuid
);


ALTER TABLE public.dossier OWNER TO db_user;

--
-- Name: employee; Type: TABLE; Schema: public; Owner: db_user
--

CREATE TABLE public.employee (
    uuid uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    last_modified_at timestamp without time zone DEFAULT now() NOT NULL,
    deleted_at timestamp without time zone,
    first_name character varying NOT NULL,
    last_name character varying NOT NULL,
    email character varying NOT NULL,
    readable_id character varying NOT NULL,
    language character varying NOT NULL,
    function character varying NOT NULL,
    phone character varying NOT NULL,
    gender character varying NOT NULL,
    "companyUuid" uuid
);


ALTER TABLE public.employee OWNER TO db_user;

--
-- Name: offer; Type: TABLE; Schema: public; Owner: db_user
--

CREATE TABLE public.offer (
    uuid uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    last_modified_at timestamp without time zone DEFAULT now() NOT NULL,
    deleted_at timestamp without time zone,
    "dossierUuid" uuid,
    "bankUuid" uuid
);


ALTER TABLE public.offer OWNER TO db_user;

--
-- Name: private_file; Type: TABLE; Schema: public; Owner: db_user
--

CREATE TABLE public.private_file (
    uuid uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    owner character varying NOT NULL,
    key character varying NOT NULL
);


ALTER TABLE public.private_file OWNER TO db_user;

--
-- Name: product; Type: TABLE; Schema: public; Owner: db_user
--

CREATE TABLE public.product (
    uuid uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    title character varying NOT NULL,
    description character varying,
    brand character varying,
    category public.product_category_enum,
    value integer,
    currency public.product_currency_enum DEFAULT 'CHF'::public.product_currency_enum,
    start timestamp without time zone,
    "end" timestamp without time zone,
    status public.product_status_enum DEFAULT 'DRAFT'::public.product_status_enum NOT NULL,
    sponsored boolean DEFAULT false,
    "directBuyLink" character varying,
    "directBuyLinkClicks" integer DEFAULT 0,
    "directBuyLinkMaxClicks" integer,
    "directBuyLinkCost" integer DEFAULT 0,
    "directBuyLinkMaxCost" integer,
    "brandLink" character varying,
    "brandLinkClicks" integer DEFAULT 0,
    "brandLinkMaxClicks" integer,
    "brandLinkCost" integer DEFAULT 0,
    "brandLinkMaxCost" integer,
    "minBet" integer,
    "maxBet" integer,
    tags text[] DEFAULT '{}'::text[],
    likes integer DEFAULT 0
);


ALTER TABLE public.product OWNER TO db_user;

--
-- Name: public_file; Type: TABLE; Schema: public; Owner: db_user
--

CREATE TABLE public.public_file (
    uuid uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    url character varying NOT NULL,
    key character varying NOT NULL,
    "productUuid" uuid
);


ALTER TABLE public.public_file OWNER TO db_user;

--
-- Name: soiadmin; Type: TABLE; Schema: public; Owner: db_user
--

CREATE TABLE public.soiadmin (
    uuid uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    last_modified_at timestamp without time zone DEFAULT now() NOT NULL,
    deleted_at timestamp without time zone,
    first_name character varying NOT NULL,
    last_name character varying NOT NULL,
    email character varying NOT NULL,
    readable_id character varying NOT NULL
);


ALTER TABLE public.soiadmin OWNER TO db_user;

--
-- Name: soiemployee; Type: TABLE; Schema: public; Owner: db_user
--

CREATE TABLE public.soiemployee (
    uuid uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    last_modified_at timestamp without time zone DEFAULT now() NOT NULL,
    deleted_at timestamp without time zone,
    first_name character varying NOT NULL,
    last_name character varying NOT NULL,
    email character varying NOT NULL,
    readable_id character varying NOT NULL
);


ALTER TABLE public.soiemployee OWNER TO db_user;

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
    role public.user_role_enum DEFAULT 'NONE'::public.user_role_enum NOT NULL,
    uuid character varying NOT NULL,
    status public.user_status_enum DEFAULT 'NONE'::public.user_status_enum NOT NULL,
    "createdAt" timestamp without time zone DEFAULT now() NOT NULL,
    username character varying NOT NULL,
    "fullName" character varying NOT NULL,
    email character varying NOT NULL,
    phone character varying NOT NULL,
    birthdate timestamp without time zone NOT NULL,
    interests text[] NOT NULL,
    "lastModifiedAt" timestamp without time zone DEFAULT now() NOT NULL,
    "deletedAt" timestamp without time zone,
    "addressUuid" uuid
);


ALTER TABLE public."user" OWNER TO db_user;

--
-- Data for Name: address; Type: TABLE DATA; Schema: public; Owner: db_user
--

INSERT INTO public.address VALUES ('9053ee58-b6bb-4f47-ac65-482be30ad209', 'Kleinfeldstrasse', '15', 'Mels', '8887');


--
-- Data for Name: bank; Type: TABLE DATA; Schema: public; Owner: db_user
--



--
-- Data for Name: comment; Type: TABLE DATA; Schema: public; Owner: db_user
--



--
-- Data for Name: company; Type: TABLE DATA; Schema: public; Owner: db_user
--



--
-- Data for Name: dossier; Type: TABLE DATA; Schema: public; Owner: db_user
--



--
-- Data for Name: employee; Type: TABLE DATA; Schema: public; Owner: db_user
--



--
-- Data for Name: offer; Type: TABLE DATA; Schema: public; Owner: db_user
--



--
-- Data for Name: private_file; Type: TABLE DATA; Schema: public; Owner: db_user
--



--
-- Data for Name: product; Type: TABLE DATA; Schema: public; Owner: db_user
--

INSERT INTO public.product VALUES ('82cc8b96-5330-45a7-ab8f-142292f9cbca', 'Draft for Heli', 'todo', NULL, NULL, NULL, 'CHF', NULL, NULL, 'DRAFT', NULL, NULL, 0, NULL, 0, NULL, NULL, 0, NULL, 0, NULL, NULL, NULL, NULL, 0);
INSERT INTO public.product VALUES ('c5d3b5e1-d3d5-4b7e-bdc5-8223f857b832', 'A fancy car', 'very fast', 'Ferrari', 'TECHNOLOGY', 100000, 'CHF', '2021-12-14 00:00:00', '2022-01-06 00:00:00', 'VALID', true, NULL, 0, NULL, 0, NULL, NULL, 0, NULL, 0, NULL, 10, 100, '{car,fast,"sports car"}', 0);
INSERT INTO public.product VALUES ('09f56113-cf2d-4114-a4b5-47c214a4e029', 'A fancy House', 'very big, very wow', 'House co.', 'TECHNOLOGY', 2000000, 'CHF', '2021-12-17 00:00:00', '2021-12-28 00:00:00', 'VALID', false, NULL, 0, NULL, 0, NULL, NULL, 0, NULL, 0, NULL, 1, 1000, '{house,big,fancy,villa}', 0);
INSERT INTO public.product VALUES ('cd1f1233-d626-496d-8689-f54a038cf1f1', 'Second house', 'i add more info later, maybe.', NULL, NULL, NULL, 'CHF', NULL, NULL, 'DRAFT', NULL, NULL, 0, NULL, 0, NULL, NULL, 0, NULL, 0, NULL, NULL, NULL, NULL, 0);
INSERT INTO public.product VALUES ('2f94aa33-5f64-4fb9-8a14-fbd4c5e93b69', 'Old something', 'archiverino', 'test brand', 'TECHNOLOGY', 10000, 'CHF', '2021-12-16 00:00:00', '2021-12-18 00:00:00', 'ARCHIVED', false, NULL, 0, NULL, 0, NULL, NULL, 0, NULL, 0, NULL, 1, 10, '{test,asdf,something}', 0);
INSERT INTO public.product VALUES ('f3d208ff-f3b8-4052-89f4-25cf10a409fa', 'Copy of draft for Heli', 'todo', NULL, NULL, NULL, 'CHF', NULL, NULL, 'DRAFT', NULL, NULL, 0, NULL, 0, NULL, NULL, 0, NULL, 0, NULL, NULL, NULL, NULL, 0);
INSERT INTO public.product VALUES ('6c4653ba-5bc5-4d6f-87f5-cfdd9200cc13', 'Duped fancy car', 'very fast', 'Ferrari', 'TECHNOLOGY', 100000, 'CHF', NULL, NULL, 'DRAFT', true, NULL, 0, NULL, 0, NULL, NULL, 0, NULL, 0, NULL, 10, 100, '{car,fast,"sports car"}', 0);
INSERT INTO public.product VALUES ('4c4a8232-3ccc-4791-bf4d-b90e679ff926', 'Copy of second house', 'i add more info later, maybe.', NULL, NULL, NULL, 'CHF', NULL, NULL, 'DRAFT', NULL, NULL, 0, NULL, 0, NULL, NULL, 0, NULL, 0, NULL, NULL, NULL, NULL, 0);


--
-- Data for Name: public_file; Type: TABLE DATA; Schema: public; Owner: db_user
--

INSERT INTO public.public_file VALUES ('699937c8-8bb9-4743-b426-2aa006d79414', 'https://bigabig-public-bucket.s3.eu-central-1.amazonaws.com/4784658c-a564-4c3e-b593-ff8dab2c1ff2-A fancy car_0.jpg', '4784658c-a564-4c3e-b593-ff8dab2c1ff2-A fancy car_0.jpg', NULL);
INSERT INTO public.public_file VALUES ('052f5986-ac04-4652-933a-4e25e663ffc5', 'https://bigabig-public-bucket.s3.eu-central-1.amazonaws.com/7b7a595c-2abf-4161-b744-837cb9184ebb-A fancy hosue_0.jpg', '7b7a595c-2abf-4161-b744-837cb9184ebb-A fancy hosue_0.jpg', NULL);
INSERT INTO public.public_file VALUES ('c8dc11ca-d269-4209-b5ff-209b6149dcb5', 'https://bigabig-public-bucket.s3.eu-central-1.amazonaws.com/e685187a-fc81-4b68-9fc8-02c660b026aa-A fancy hosue_1.jpg', 'e685187a-fc81-4b68-9fc8-02c660b026aa-A fancy hosue_1.jpg', NULL);
INSERT INTO public.public_file VALUES ('ea0b4dd6-246f-48f6-8a2c-5f81fdcbc63b', 'https://bigabig-public-bucket.s3.eu-central-1.amazonaws.com/42767013-75ae-47ad-96e0-c027e02f6ae5-Draft for Heli_0.jpg', '42767013-75ae-47ad-96e0-c027e02f6ae5-Draft for Heli_0.jpg', NULL);
INSERT INTO public.public_file VALUES ('a742f882-95bc-4040-83e5-1f1265d1c1e1', 'https://bigabig-public-bucket.s3.eu-central-1.amazonaws.com/ad88d503-a877-4ae7-82c9-4286a4c6f309-Second house_0.jpg', 'ad88d503-a877-4ae7-82c9-4286a4c6f309-Second house_0.jpg', NULL);
INSERT INTO public.public_file VALUES ('3e8b031b-5c04-413d-bac2-17ddc029ed62', 'https://bigabig-public-bucket.s3.eu-central-1.amazonaws.com/69f0b40e-3944-481a-88d2-1e91f233e473-Old something_0.jpg', '69f0b40e-3944-481a-88d2-1e91f233e473-Old something_0.jpg', NULL);
INSERT INTO public.public_file VALUES ('d1ec392e-c30f-4e7f-8c93-aef2a2813202', 'https://bigabig-public-bucket.s3.eu-central-1.amazonaws.com/cd58e36d-7667-439c-b93c-76eabc62ffad-Draft for Heli_0.jpg', 'cd58e36d-7667-439c-b93c-76eabc62ffad-Draft for Heli_0.jpg', NULL);
INSERT INTO public.public_file VALUES ('be3c2943-277d-4418-b173-fba905935598', 'https://bigabig-public-bucket.s3.eu-central-1.amazonaws.com/4272faf7-2133-4bb0-b84f-5646bab06ad3-A fancy car_0.jpg', '4272faf7-2133-4bb0-b84f-5646bab06ad3-A fancy car_0.jpg', NULL);
INSERT INTO public.public_file VALUES ('cebc883b-3371-45a5-af44-533ee947c58e', 'https://bigabig-public-bucket.s3.eu-central-1.amazonaws.com/7fa7d265-7a07-4376-b94e-7efd64c97a06-Second house_0.jpg', '7fa7d265-7a07-4376-b94e-7efd64c97a06-Second house_0.jpg', NULL);


--
-- Data for Name: soiadmin; Type: TABLE DATA; Schema: public; Owner: db_user
--



--
-- Data for Name: soiemployee; Type: TABLE DATA; Schema: public; Owner: db_user
--



--
-- Data for Name: typeorm_metadata; Type: TABLE DATA; Schema: public; Owner: db_user
--



--
-- Data for Name: user; Type: TABLE DATA; Schema: public; Owner: db_user
--

INSERT INTO public."user" VALUES ('ADMIN', '4d91df80-763b-4a71-ba37-36390ae142f7', 'ACTIVE', '2022-01-03 08:49:26.225797', 'admindave', 'David Wyss', 'david.wyss@hotmail.ch', '123123123', '1997-01-03 09:48:58', '{TECHNOLOGY}', '2022-01-03 08:49:26.225797', NULL, NULL);
INSERT INTO public."user" VALUES ('PARTNER', '050c1f77-3b8e-4d64-ad72-bde739e40c3e', 'ACTIVE', '2022-01-03 08:54:42.219417', 'partnerdave', 'partner daverino', 'david.wyss@polygon-software.ch', '7876432356', '1993-01-03 09:54:30', '{}', '2022-01-03 08:54:42.219417', NULL, NULL);
INSERT INTO public."user" VALUES ('PLAYER', 'a4d951be-5b37-4c69-9081-14d623274387', 'APPLIED', '2022-01-03 08:53:38.020027', 'playerdave', 'Dave wys', 'david.wyss@hotmail.ch', '1231235421', '2000-01-07 09:53:20', '{TECHNOLOGY,WATCHES}', '2022-01-03 08:53:38.020027', NULL, '9053ee58-b6bb-4f47-ac65-482be30ad209');


--
-- Name: product PK_1442fd7cb5e0b32ff5d0b6c13d0; Type: CONSTRAINT; Schema: public; Owner: db_user
--

ALTER TABLE ONLY public.product
    ADD CONSTRAINT "PK_1442fd7cb5e0b32ff5d0b6c13d0" PRIMARY KEY (uuid);


--
-- Name: private_file PK_19ac201a356fa3aacef66563869; Type: CONSTRAINT; Schema: public; Owner: db_user
--

ALTER TABLE ONLY public.private_file
    ADD CONSTRAINT "PK_19ac201a356fa3aacef66563869" PRIMARY KEY (uuid);


--
-- Name: company PK_3fa0b2af99d910864a56bb10c9e; Type: CONSTRAINT; Schema: public; Owner: db_user
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "PK_3fa0b2af99d910864a56bb10c9e" PRIMARY KEY (uuid);


--
-- Name: offer PK_41c06b86e503ef9018af0d5e0dc; Type: CONSTRAINT; Schema: public; Owner: db_user
--

ALTER TABLE ONLY public.offer
    ADD CONSTRAINT "PK_41c06b86e503ef9018af0d5e0dc" PRIMARY KEY (uuid);


--
-- Name: address PK_496d4a29b0dfa82ede19a4bcad0; Type: CONSTRAINT; Schema: public; Owner: db_user
--

ALTER TABLE ONLY public.address
    ADD CONSTRAINT "PK_496d4a29b0dfa82ede19a4bcad0" PRIMARY KEY (uuid);


--
-- Name: employee PK_54452b02a5a8c125422e3697495; Type: CONSTRAINT; Schema: public; Owner: db_user
--

ALTER TABLE ONLY public.employee
    ADD CONSTRAINT "PK_54452b02a5a8c125422e3697495" PRIMARY KEY (uuid);


--
-- Name: soiadmin PK_7d6bdc6e4ceb6b1160167116acc; Type: CONSTRAINT; Schema: public; Owner: db_user
--

ALTER TABLE ONLY public.soiadmin
    ADD CONSTRAINT "PK_7d6bdc6e4ceb6b1160167116acc" PRIMARY KEY (uuid);


--
-- Name: bank PK_83a8522f1861bee5e13f4cba127; Type: CONSTRAINT; Schema: public; Owner: db_user
--

ALTER TABLE ONLY public.bank
    ADD CONSTRAINT "PK_83a8522f1861bee5e13f4cba127" PRIMARY KEY (uuid);


--
-- Name: soiemployee PK_9700773a76dd555d212de68e598; Type: CONSTRAINT; Schema: public; Owner: db_user
--

ALTER TABLE ONLY public.soiemployee
    ADD CONSTRAINT "PK_9700773a76dd555d212de68e598" PRIMARY KEY (uuid);


--
-- Name: user PK_a95e949168be7b7ece1a2382fed; Type: CONSTRAINT; Schema: public; Owner: db_user
--

ALTER TABLE ONLY public."user"
    ADD CONSTRAINT "PK_a95e949168be7b7ece1a2382fed" PRIMARY KEY (uuid);


--
-- Name: public_file PK_ba13d24107ee3497d7d71f81be3; Type: CONSTRAINT; Schema: public; Owner: db_user
--

ALTER TABLE ONLY public.public_file
    ADD CONSTRAINT "PK_ba13d24107ee3497d7d71f81be3" PRIMARY KEY (uuid);


--
-- Name: comment PK_e45a9d11ff7a3cf11f6c42107b4; Type: CONSTRAINT; Schema: public; Owner: db_user
--

ALTER TABLE ONLY public.comment
    ADD CONSTRAINT "PK_e45a9d11ff7a3cf11f6c42107b4" PRIMARY KEY (uuid);


--
-- Name: dossier PK_f9f49ba689e2abb87eaeded1d27; Type: CONSTRAINT; Schema: public; Owner: db_user
--

ALTER TABLE ONLY public.dossier
    ADD CONSTRAINT "PK_f9f49ba689e2abb87eaeded1d27" PRIMARY KEY (uuid);


--
-- Name: dossier REL_27152041ea6d74671df043499e; Type: CONSTRAINT; Schema: public; Owner: db_user
--

ALTER TABLE ONLY public.dossier
    ADD CONSTRAINT "REL_27152041ea6d74671df043499e" UNIQUE ("correspondenceAddressUuid");


--
-- Name: bank REL_899821e269947d54e371c2a741; Type: CONSTRAINT; Schema: public; Owner: db_user
--

ALTER TABLE ONLY public.bank
    ADD CONSTRAINT "REL_899821e269947d54e371c2a741" UNIQUE ("addressUuid");


--
-- Name: company REL_a9f680ed13cbcbb4bb1387b04b; Type: CONSTRAINT; Schema: public; Owner: db_user
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "REL_a9f680ed13cbcbb4bb1387b04b" UNIQUE ("correspondenceAddressUuid");


--
-- Name: dossier REL_ca26615c2fb1cb3be481b381f2; Type: CONSTRAINT; Schema: public; Owner: db_user
--

ALTER TABLE ONLY public.dossier
    ADD CONSTRAINT "REL_ca26615c2fb1cb3be481b381f2" UNIQUE ("originalBankUuid");


--
-- Name: dossier REL_d5fc778ba89eeef772d68ac09f; Type: CONSTRAINT; Schema: public; Owner: db_user
--

ALTER TABLE ONLY public.dossier
    ADD CONSTRAINT "REL_d5fc778ba89eeef772d68ac09f" UNIQUE ("propertyAddressUuid");


--
-- Name: company REL_e2ec6ea5ec961bdd0fc7c98626; Type: CONSTRAINT; Schema: public; Owner: db_user
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "REL_e2ec6ea5ec961bdd0fc7c98626" UNIQUE ("domicileAddressUuid");


--
-- Name: user UQ_33ef35730946bd2289747a0d7eb; Type: CONSTRAINT; Schema: public; Owner: db_user
--

ALTER TABLE ONLY public."user"
    ADD CONSTRAINT "UQ_33ef35730946bd2289747a0d7eb" UNIQUE ("addressUuid");


--
-- Name: dossier FK_27152041ea6d74671df043499ee; Type: FK CONSTRAINT; Schema: public; Owner: db_user
--

ALTER TABLE ONLY public.dossier
    ADD CONSTRAINT "FK_27152041ea6d74671df043499ee" FOREIGN KEY ("correspondenceAddressUuid") REFERENCES public.address(uuid);


--
-- Name: user FK_33ef35730946bd2289747a0d7eb; Type: FK CONSTRAINT; Schema: public; Owner: db_user
--

ALTER TABLE ONLY public."user"
    ADD CONSTRAINT "FK_33ef35730946bd2289747a0d7eb" FOREIGN KEY ("addressUuid") REFERENCES public.address(uuid);


--
-- Name: offer FK_68cd3351a7128468f3de8fb487a; Type: FK CONSTRAINT; Schema: public; Owner: db_user
--

ALTER TABLE ONLY public.offer
    ADD CONSTRAINT "FK_68cd3351a7128468f3de8fb487a" FOREIGN KEY ("bankUuid") REFERENCES public.bank(uuid);


--
-- Name: comment FK_7b6ea5bd28ac07eb1383034ee48; Type: FK CONSTRAINT; Schema: public; Owner: db_user
--

ALTER TABLE ONLY public.comment
    ADD CONSTRAINT "FK_7b6ea5bd28ac07eb1383034ee48" FOREIGN KEY ("userUuid") REFERENCES public."user"(uuid);


--
-- Name: bank FK_899821e269947d54e371c2a741e; Type: FK CONSTRAINT; Schema: public; Owner: db_user
--

ALTER TABLE ONLY public.bank
    ADD CONSTRAINT "FK_899821e269947d54e371c2a741e" FOREIGN KEY ("addressUuid") REFERENCES public.address(uuid);


--
-- Name: comment FK_9c51df74fc7f7b59a6b2645c543; Type: FK CONSTRAINT; Schema: public; Owner: db_user
--

ALTER TABLE ONLY public.comment
    ADD CONSTRAINT "FK_9c51df74fc7f7b59a6b2645c543" FOREIGN KEY ("productUuid") REFERENCES public.product(uuid);


--
-- Name: company FK_a9f680ed13cbcbb4bb1387b04bd; Type: FK CONSTRAINT; Schema: public; Owner: db_user
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "FK_a9f680ed13cbcbb4bb1387b04bd" FOREIGN KEY ("correspondenceAddressUuid") REFERENCES public.address(uuid);


--
-- Name: dossier FK_ca26615c2fb1cb3be481b381f2c; Type: FK CONSTRAINT; Schema: public; Owner: db_user
--

ALTER TABLE ONLY public.dossier
    ADD CONSTRAINT "FK_ca26615c2fb1cb3be481b381f2c" FOREIGN KEY ("originalBankUuid") REFERENCES public.bank(uuid);


--
-- Name: employee FK_d51fc1f836fee82c6c77d913806; Type: FK CONSTRAINT; Schema: public; Owner: db_user
--

ALTER TABLE ONLY public.employee
    ADD CONSTRAINT "FK_d51fc1f836fee82c6c77d913806" FOREIGN KEY ("companyUuid") REFERENCES public.company(uuid);


--
-- Name: dossier FK_d5fc778ba89eeef772d68ac09f0; Type: FK CONSTRAINT; Schema: public; Owner: db_user
--

ALTER TABLE ONLY public.dossier
    ADD CONSTRAINT "FK_d5fc778ba89eeef772d68ac09f0" FOREIGN KEY ("propertyAddressUuid") REFERENCES public.address(uuid);


--
-- Name: company FK_e2ec6ea5ec961bdd0fc7c986267; Type: FK CONSTRAINT; Schema: public; Owner: db_user
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "FK_e2ec6ea5ec961bdd0fc7c986267" FOREIGN KEY ("domicileAddressUuid") REFERENCES public.address(uuid);


--
-- Name: public_file FK_e4250ab32f42ee78762eb0c6160; Type: FK CONSTRAINT; Schema: public; Owner: db_user
--

ALTER TABLE ONLY public.public_file
    ADD CONSTRAINT "FK_e4250ab32f42ee78762eb0c6160" FOREIGN KEY ("productUuid") REFERENCES public.product(uuid);


--
-- Name: offer FK_e8635e2c8e3f27813847955f170; Type: FK CONSTRAINT; Schema: public; Owner: db_user
--

ALTER TABLE ONLY public.offer
    ADD CONSTRAINT "FK_e8635e2c8e3f27813847955f170" FOREIGN KEY ("dossierUuid") REFERENCES public.dossier(uuid);


--
-- PostgreSQL database dump complete
--


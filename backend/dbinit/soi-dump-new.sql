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

ALTER TABLE ONLY public.dossier DROP CONSTRAINT "FK_fed05b9ba6da9391363e26528ea";
ALTER TABLE ONLY public.offer DROP CONSTRAINT "FK_e8635e2c8e3f27813847955f170";
ALTER TABLE ONLY public.company DROP CONSTRAINT "FK_e2ec6ea5ec961bdd0fc7c986267";
ALTER TABLE ONLY public.employee DROP CONSTRAINT "FK_d51fc1f836fee82c6c77d913806";
ALTER TABLE ONLY public.dossier DROP CONSTRAINT "FK_ca26615c2fb1cb3be481b381f2c";
ALTER TABLE ONLY public.private_file DROP CONSTRAINT "FK_bcebcab2d56ae0199407ecc4f62";
ALTER TABLE ONLY public.private_file DROP CONSTRAINT "FK_b902bc0f8d39a9d0beaa25070b8";
ALTER TABLE ONLY public.company DROP CONSTRAINT "FK_a9f680ed13cbcbb4bb1387b04bd";
ALTER TABLE ONLY public.comment DROP CONSTRAINT "FK_9c51df74fc7f7b59a6b2645c543";
ALTER TABLE ONLY public.bank DROP CONSTRAINT "FK_899821e269947d54e371c2a741e";
ALTER TABLE ONLY public.comment DROP CONSTRAINT "FK_7b6ea5bd28ac07eb1383034ee48";
ALTER TABLE ONLY public.offer DROP CONSTRAINT "FK_68cd3351a7128468f3de8fb487a";
ALTER TABLE ONLY public.private_file DROP CONSTRAINT "FK_494136f6e6f996fe77ed1a3249a";
ALTER TABLE ONLY public.dossier DROP CONSTRAINT "FK_2a26706528112ef56e5f7601c8d";
ALTER TABLE ONLY public.dossier DROP CONSTRAINT "FK_012c5092b7dd1f0a3adf05223de";
ALTER TABLE ONLY public.dossier DROP CONSTRAINT "UQ_fed05b9ba6da9391363e26528ea";
ALTER TABLE ONLY public.bank DROP CONSTRAINT "UQ_bba3c6c58751099874df530192c";
ALTER TABLE ONLY public.bank DROP CONSTRAINT "UQ_11f196da2e68cef1c7e84b4fe94";
ALTER TABLE ONLY public.dossier DROP CONSTRAINT "UQ_012c5092b7dd1f0a3adf05223de";
ALTER TABLE ONLY public.company DROP CONSTRAINT "REL_e2ec6ea5ec961bdd0fc7c98626";
ALTER TABLE ONLY public.company DROP CONSTRAINT "REL_a9f680ed13cbcbb4bb1387b04b";
ALTER TABLE ONLY public.bank DROP CONSTRAINT "REL_899821e269947d54e371c2a741";
ALTER TABLE ONLY public.dossier DROP CONSTRAINT "PK_f9f49ba689e2abb87eaeded1d27";
ALTER TABLE ONLY public.soi_employee DROP CONSTRAINT "PK_eb0ff739846aad9d81bf90ea43f";
ALTER TABLE ONLY public.comment DROP CONSTRAINT "PK_e45a9d11ff7a3cf11f6c42107b4";
ALTER TABLE ONLY public.public_file DROP CONSTRAINT "PK_ba13d24107ee3497d7d71f81be3";
ALTER TABLE ONLY public."user" DROP CONSTRAINT "PK_a95e949168be7b7ece1a2382fed";
ALTER TABLE ONLY public.soiemployee DROP CONSTRAINT "PK_9700773a76dd555d212de68e598";
ALTER TABLE ONLY public.bank DROP CONSTRAINT "PK_83a8522f1861bee5e13f4cba127";
ALTER TABLE ONLY public.employee DROP CONSTRAINT "PK_54452b02a5a8c125422e3697495";
ALTER TABLE ONLY public.address DROP CONSTRAINT "PK_496d4a29b0dfa82ede19a4bcad0";
ALTER TABLE ONLY public.offer DROP CONSTRAINT "PK_41c06b86e503ef9018af0d5e0dc";
ALTER TABLE ONLY public.company DROP CONSTRAINT "PK_3fa0b2af99d910864a56bb10c9e";
ALTER TABLE ONLY public.soi_admin DROP CONSTRAINT "PK_217c42248c5d20c501c5c30c53e";
ALTER TABLE ONLY public.private_file DROP CONSTRAINT "PK_19ac201a356fa3aacef66563869";
ALTER TABLE ONLY public.product DROP CONSTRAINT "PK_1442fd7cb5e0b32ff5d0b6c13d0";
DROP TABLE public.zip_codes;
DROP TABLE public.value_development;
DROP TABLE public."user";
DROP TABLE public.typeorm_metadata;
DROP TABLE public.soiemployee;
DROP TABLE public.soi_employee;
DROP TABLE public.soi_admin;
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
DROP TYPE public.user_role_enum;
DROP TYPE public.product_status_enum;
DROP TYPE public.product_currency_enum;
DROP TYPE public.product_category_enum;
DROP TYPE public.private_file_file_type_enum;
DROP TYPE public.offer_status_enum;
DROP TYPE public.dossier_status_enum;
DROP TYPE public.dossier_property_type_enum;
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
-- Name: dossier_property_type_enum; Type: TYPE; Schema: public; Owner: db_user
--

CREATE TYPE public.dossier_property_type_enum AS ENUM (
    'ONE_FAMILY_HOUSE',
    'APARTMENT',
    'APARTMENT_BUILDING'
);


ALTER TYPE public.dossier_property_type_enum OWNER TO db_user;

--
-- Name: dossier_status_enum; Type: TYPE; Schema: public; Owner: db_user
--

CREATE TYPE public.dossier_status_enum AS ENUM (
    'OPEN',
    'SIGNED',
    'REJECTED',
    'SUBMITTED',
    'OFFERED',
    'COMPLETED',
    'IN_PROGRESS',
    'SENT'
);


ALTER TYPE public.dossier_status_enum OWNER TO db_user;

--
-- Name: offer_status_enum; Type: TYPE; Schema: public; Owner: db_user
--

CREATE TYPE public.offer_status_enum AS ENUM (
    'INTERESTED',
    'RETRACTED',
    'ACCEPTED',
    'IN_PROCESS'
);


ALTER TYPE public.offer_status_enum OWNER TO db_user;

--
-- Name: private_file_file_type_enum; Type: TYPE; Schema: public; Owner: db_user
--

CREATE TYPE public.private_file_file_type_enum AS ENUM (
    'NONE',
    'ID',
    'SALARY',
    'PENSION',
    'LAST_YEAR_TAX',
    'PENSION_ID',
    'LAST_YEAR_SALARY',
    'DEBT_COLLECTION',
    'OWN_FUNDS',
    'THREE_A',
    'LIFE_INSURANCE',
    'LEASING_CONTRACT',
    'CREDIT_CONTRACT',
    'WORK_CONTRACT',
    'MARRIAGE_CONTRACT',
    'MORTGAGE_CONTRACT',
    'PRODUCT_AGREEMENT',
    'BUILDING_INSURANCE',
    'OWNER_REGULATIONS',
    'MANAGEMENT_REGULATIONS',
    'FLOOR_PLANS',
    'PICTURES',
    'PURCHASE_CONTRACT',
    'RENOVATIONS',
    'LEGACY_CADASTER',
    'LAND_REGISTER_EXTRACT',
    'BUILDING_DESCRIPTION',
    'RESERVATION_CONTRACT',
    'MARKET_VALUE_ESTIMATE',
    'SALES_DOCUMENTATION',
    'SITUATION_PLAN',
    'ADDITIONAL_DOCUMENTS',
    'DUMMY'
);


ALTER TYPE public.private_file_file_type_enum OWNER TO db_user;

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
    'BANK',
    'COMPANY',
    'EMPLOYEE',
    'SOI_ADMIN',
    'SOI_EMPLOYEE',
    'NONE'
);


ALTER TYPE public.user_role_enum OWNER TO db_user;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: address; Type: TABLE; Schema: public; Owner: db_user
--

CREATE TABLE public.address (
    uuid uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    last_modified_at timestamp without time zone DEFAULT now() NOT NULL,
    deleted_at timestamp without time zone,
    street character varying NOT NULL,
    number character varying NOT NULL,
    city character varying NOT NULL,
    zip_code character varying NOT NULL
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
    "addressUuid" uuid,
    name character varying NOT NULL,
    abbreviation character varying NOT NULL,
    phone character varying
);


ALTER TABLE public.bank OWNER TO db_user;

--
-- Name: comment; Type: TABLE; Schema: public; Owner: db_user
--

CREATE TABLE public.comment (
    uuid uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    last_modified_at timestamp without time zone DEFAULT now() NOT NULL,
    deleted_at timestamp without time zone,
    content character varying NOT NULL,
    "userUuid" character varying,
    "productUuid" uuid
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
    non_arrangeable boolean NOT NULL,
    status public.dossier_status_enum DEFAULT 'OPEN'::public.dossier_status_enum NOT NULL,
    "originalBankUuid" uuid,
    "employeeUuid" uuid,
    "finalDocumentUuid" uuid,
    phone character varying NOT NULL,
    birthdate timestamp without time zone NOT NULL,
    property_type public.dossier_property_type_enum NOT NULL,
    owner_occupied boolean NOT NULL,
    purchase_date timestamp without time zone NOT NULL,
    purchase_price integer NOT NULL,
    market_value_estimation integer NOT NULL,
    mortgage_amount integer NOT NULL,
    has_amortisation boolean NOT NULL,
    direct_amortisation boolean,
    amortisation_amount integer,
    has_building_lease boolean NOT NULL,
    public_landlord boolean,
    building_lease_expiration_date timestamp without time zone,
    building_lease_interest integer,
    has_renovation boolean NOT NULL,
    renovation_year integer,
    renovation_price integer,
    incomes integer[] NOT NULL,
    child_allowances integer NOT NULL,
    bonus integer NOT NULL,
    assets integer NOT NULL,
    leasing integer NOT NULL,
    credit integer NOT NULL,
    alimony integer NOT NULL,
    various integer NOT NULL,
    prosecutions boolean NOT NULL,
    loss_certificates boolean NOT NULL,
    "addressUuid" uuid,
    eligible_income integer NOT NULL,
    total_costs integer NOT NULL,
    value_estimate_low integer NOT NULL,
    value_estimate_high integer NOT NULL,
    affordability double precision NOT NULL,
    enfeoffment_estimate_low double precision NOT NULL,
    enfeoffment_estimate_high double precision NOT NULL,
    partition_amounts integer[] NOT NULL,
    partition_dates date[] NOT NULL
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
    "bankUuid" uuid,
    status public.offer_status_enum DEFAULT 'INTERESTED'::public.offer_status_enum NOT NULL
);


ALTER TABLE public.offer OWNER TO db_user;

--
-- Name: private_file; Type: TABLE; Schema: public; Owner: db_user
--

CREATE TABLE public.private_file (
    uuid uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    last_modified_at timestamp without time zone DEFAULT now() NOT NULL,
    deleted_at timestamp without time zone,
    owner character varying NOT NULL,
    key character varying NOT NULL,
    "companyUuid" uuid,
    "dossierUuid" uuid,
    "offerUuid" uuid,
    file_type public.private_file_file_type_enum DEFAULT 'NONE'::public.private_file_file_type_enum NOT NULL
);


ALTER TABLE public.private_file OWNER TO db_user;

--
-- Name: product; Type: TABLE; Schema: public; Owner: db_user
--

CREATE TABLE public.product (
    uuid uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    last_modified_at timestamp without time zone DEFAULT now() NOT NULL,
    deleted_at timestamp without time zone,
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
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    last_modified_at timestamp without time zone DEFAULT now() NOT NULL,
    deleted_at timestamp without time zone,
    url character varying NOT NULL,
    key character varying NOT NULL
);


ALTER TABLE public.public_file OWNER TO db_user;

--
-- Name: soi_admin; Type: TABLE; Schema: public; Owner: db_user
--

CREATE TABLE public.soi_admin (
    uuid uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    last_modified_at timestamp without time zone DEFAULT now() NOT NULL,
    deleted_at timestamp without time zone,
    first_name character varying NOT NULL,
    last_name character varying NOT NULL,
    email character varying NOT NULL,
    readable_id character varying NOT NULL
);


ALTER TABLE public.soi_admin OWNER TO db_user;

--
-- Name: soi_employee; Type: TABLE; Schema: public; Owner: db_user
--

CREATE TABLE public.soi_employee (
    uuid uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    last_modified_at timestamp without time zone DEFAULT now() NOT NULL,
    deleted_at timestamp without time zone,
    first_name character varying NOT NULL,
    last_name character varying NOT NULL,
    email character varying NOT NULL,
    readable_id character varying NOT NULL,
    phone character varying NOT NULL,
    gender character varying NOT NULL
);


ALTER TABLE public.soi_employee OWNER TO db_user;

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
    fk character varying NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    last_modified_at timestamp without time zone DEFAULT now() NOT NULL,
    deleted_at timestamp without time zone
);


ALTER TABLE public."user" OWNER TO db_user;

--
-- Name: value_development; Type: TABLE; Schema: public; Owner: db_user
--

CREATE TABLE public.value_development (
    "20001" double precision NOT NULL,
    "20002" double precision NOT NULL,
    "20003" double precision NOT NULL,
    "20004" double precision NOT NULL,
    "20011" double precision NOT NULL,
    "20012" double precision NOT NULL,
    "20013" double precision NOT NULL,
    "20014" double precision NOT NULL,
    "20021" double precision NOT NULL,
    "20022" double precision NOT NULL,
    "20023" double precision NOT NULL,
    "20024" double precision NOT NULL,
    "20031" double precision NOT NULL,
    "20032" double precision NOT NULL,
    "20033" double precision NOT NULL,
    "20034" double precision NOT NULL,
    "20041" double precision NOT NULL,
    "20042" double precision NOT NULL,
    "20043" double precision NOT NULL,
    "20044" double precision NOT NULL,
    "20051" double precision NOT NULL,
    "20052" double precision NOT NULL,
    "20053" double precision NOT NULL,
    "20054" double precision NOT NULL,
    "20061" double precision NOT NULL,
    "20062" double precision NOT NULL,
    "20063" double precision NOT NULL,
    "20064" double precision NOT NULL,
    "20071" double precision NOT NULL,
    "20072" double precision NOT NULL,
    "20073" double precision NOT NULL,
    "20074" double precision NOT NULL,
    "20081" double precision NOT NULL,
    "20082" double precision NOT NULL,
    "20083" double precision NOT NULL,
    "20084" double precision NOT NULL,
    "20091" double precision NOT NULL,
    "20092" double precision NOT NULL,
    "20093" double precision NOT NULL,
    "20094" double precision NOT NULL,
    "20101" double precision NOT NULL,
    "20102" double precision NOT NULL,
    "20103" double precision NOT NULL,
    "20104" double precision NOT NULL,
    "20111" double precision NOT NULL,
    "20112" double precision NOT NULL,
    "20113" double precision NOT NULL,
    "20114" double precision NOT NULL,
    "20121" double precision NOT NULL,
    "20122" double precision NOT NULL,
    "20123" double precision NOT NULL,
    "20124" double precision NOT NULL,
    "20131" double precision NOT NULL,
    "20132" double precision NOT NULL,
    "20133" double precision NOT NULL,
    "20134" double precision NOT NULL,
    "20141" double precision NOT NULL,
    "20142" double precision NOT NULL,
    "20143" double precision NOT NULL,
    "20144" double precision NOT NULL,
    "20151" double precision NOT NULL,
    "20152" double precision NOT NULL,
    "20153" double precision NOT NULL,
    "20154" double precision NOT NULL,
    "20161" double precision NOT NULL,
    "20162" double precision NOT NULL,
    "20163" double precision NOT NULL,
    "20164" double precision NOT NULL,
    "20171" double precision NOT NULL,
    "20172" double precision NOT NULL,
    "20173" double precision NOT NULL,
    "20174" double precision NOT NULL,
    "20181" double precision NOT NULL,
    "20182" double precision NOT NULL,
    "20183" double precision NOT NULL,
    "20184" double precision NOT NULL,
    "20191" double precision NOT NULL,
    "20192" double precision NOT NULL,
    "20193" double precision NOT NULL,
    "20194" double precision NOT NULL,
    "20201" double precision NOT NULL,
    "20202" double precision NOT NULL,
    "20203" double precision NOT NULL,
    "20204" double precision NOT NULL,
    "20211" double precision NOT NULL,
    "20212" double precision NOT NULL,
    "20213" double precision NOT NULL,
    region_name text NOT NULL,
    region text NOT NULL
);


ALTER TABLE public.value_development OWNER TO db_user;

--
-- Name: zip_codes; Type: TABLE; Schema: public; Owner: db_user
--

CREATE TABLE public.zip_codes (
    zip_code text,
    region text
);


ALTER TABLE public.zip_codes OWNER TO db_user;

--
-- Data for Name: address; Type: TABLE DATA; Schema: public; Owner: db_user
--

INSERT INTO public.address VALUES ('5510735a-4077-4360-8ed2-3607ad7f4154', '2021-12-20 09:34:52.229216', '2021-12-20 09:34:52.229216', NULL, 'Thurgauerstrasse', '117', 'Opfikon', '8152');
INSERT INTO public.address VALUES ('2344a722-1579-4be1-8e2c-ed022f30ce95', '2021-12-20 09:34:52.229216', '2021-12-20 09:34:52.229216', NULL, 'Thurgauerstrasse', '117', 'Opfikon', '8152');
INSERT INTO public.address VALUES ('81fa8c90-fb9a-4ddb-b353-fbb034c6b2ef', '2021-12-22 07:39:07.912671', '2021-12-22 07:39:07.912671', NULL, 'Irrelevant Street', '6', 'Unimportant City', '8620');
INSERT INTO public.address VALUES ('b27c8cdb-7b77-4e24-be30-1d268b7688d2', '2021-12-22 07:39:07.912671', '2021-12-22 07:39:07.912671', NULL, 'Unknown Street', '7', 'Genf', '8720');
INSERT INTO public.address VALUES ('ffac495a-b24b-46cd-ba1d-c97605b3ec11', '2021-12-22 07:39:10.24558', '2021-12-22 07:39:10.24558', NULL, 'Irrelevant Street', '6', 'Unimportant City', '8620');
INSERT INTO public.address VALUES ('104ebd0e-ad78-4601-911f-e6fd23c5d542', '2021-12-22 07:39:10.24558', '2021-12-22 07:39:10.24558', NULL, 'Unknown Street', '7', 'Genf', '8720');
INSERT INTO public.address VALUES ('f371c8f7-a629-467a-ae27-bf24a9d5eb51', '2021-12-22 07:39:11.297114', '2021-12-22 07:39:11.297114', NULL, 'Irrelevant Street', '6', 'Unimportant City', '8620');
INSERT INTO public.address VALUES ('bbb70385-2600-4a7c-a1d6-a67ef541fe10', '2021-12-22 07:39:11.297114', '2021-12-22 07:39:11.297114', NULL, 'Unknown Street', '7', 'Sion', '8720');
INSERT INTO public.address VALUES ('0a2099c1-e9cc-46c2-9c60-788aea5707d7', '2021-12-22 07:39:36.850581', '2021-12-22 07:39:36.850581', NULL, 'Irrelevant Street', '6', 'Unimportant City', '8620');
INSERT INTO public.address VALUES ('599c1f4a-0b1d-44ed-9c07-3cd8d093f1d5', '2021-12-22 07:39:36.850581', '2021-12-22 07:39:36.850581', NULL, 'Unknown Street', '7', 'Sion', '8720');
INSERT INTO public.address VALUES ('7b1fa312-b925-4d0f-807c-597aada93d0f', '2021-12-22 07:39:42.098611', '2021-12-22 07:39:42.098611', NULL, 'Irrelevant Street', '6', 'Unimportant City', '8620');
INSERT INTO public.address VALUES ('e97c5379-4bd8-4cdd-b264-d09600f21481', '2021-12-22 07:39:42.098611', '2021-12-22 07:39:42.098611', NULL, 'Unknown Street', '7', 'Zürich', '8720');
INSERT INTO public.address VALUES ('57cd9e48-9a36-439e-b71d-e5df46c4373d', '2021-12-22 07:39:43.075676', '2021-12-22 07:39:43.075676', NULL, 'Irrelevant Street', '6', 'Unimportant City', '8620');
INSERT INTO public.address VALUES ('c4a64839-76d0-4a42-be01-16cfb8beaea0', '2021-12-22 07:39:43.075676', '2021-12-22 07:39:43.075676', NULL, 'Unknown Street', '7', 'Zug', '8720');
INSERT INTO public.address VALUES ('4a2542fa-410a-41ad-98f3-4343f4710bca', '2021-12-22 07:41:56.357573', '2021-12-22 07:41:56.357573', NULL, 'Irrelevant Street', '6', 'Unimportant City', '8620');
INSERT INTO public.address VALUES ('33eea83b-6bc0-449d-9ec4-91e9ad3a765f', '2021-12-22 07:41:56.357573', '2021-12-22 07:41:56.357573', NULL, 'Unknown Street', '7', 'Basel', '8720');
INSERT INTO public.address VALUES ('bb6b9533-1602-4bc8-8f82-c65ed13fde42', '2021-12-22 07:42:08.702713', '2021-12-22 07:42:08.702713', NULL, 'Irrelevant Street', '6', 'Unimportant City', '8620');
INSERT INTO public.address VALUES ('10ae2436-2640-4f23-a7c7-7d570023ad4d', '2021-12-22 07:42:08.702713', '2021-12-22 07:42:08.702713', NULL, 'Unknown Street', '7', 'Sion', '8720');
INSERT INTO public.address VALUES ('e6a2941e-4898-4008-821a-0ec80d9c519f', '2021-12-22 07:42:09.945936', '2021-12-22 07:42:09.945936', NULL, 'Irrelevant Street', '6', 'Unimportant City', '8620');
INSERT INTO public.address VALUES ('de8a5aea-b34b-4177-b4c7-55a4189f6bb7', '2021-12-22 07:42:09.945936', '2021-12-22 07:42:09.945936', NULL, 'Unknown Street', '7', 'Sion', '8720');
INSERT INTO public.address VALUES ('3d447a3f-49d5-4a8e-8d65-a0c9bff50949', '2021-12-22 07:42:11.163017', '2021-12-22 07:42:11.163017', NULL, 'Irrelevant Street', '6', 'Unimportant City', '8620');
INSERT INTO public.address VALUES ('b613ccc8-2b4b-491d-a6e8-4693ad872913', '2021-12-22 07:42:11.163017', '2021-12-22 07:42:11.163017', NULL, 'Unknown Street', '7', 'Sion', '8720');
INSERT INTO public.address VALUES ('5e7cfbee-8251-4524-ab30-02765d152ecd', '2021-12-22 07:42:13.722838', '2021-12-22 07:42:13.722838', NULL, 'Irrelevant Street', '6', 'Unimportant City', '8620');
INSERT INTO public.address VALUES ('4d5468af-41e9-40b1-be54-f0ca60797ed2', '2021-12-22 07:42:13.722838', '2021-12-22 07:42:13.722838', NULL, 'Unknown Street', '7', 'Bern', '8720');
INSERT INTO public.address VALUES ('0e2049b6-7289-4052-98ae-10ae1c84309e', '2021-12-22 08:18:30.99939', '2021-12-22 08:18:30.99939', NULL, 'Irrelevant Street', '6', 'Unimportant City', '8620');
INSERT INTO public.address VALUES ('2e8e08fa-02ac-4687-9bd4-edafef30529c', '2021-12-22 08:18:30.99939', '2021-12-22 08:18:30.99939', NULL, 'Unknown Street', '7', 'Bern', '8720');
INSERT INTO public.address VALUES ('10a7deca-d5bb-45d9-92eb-69c2d2921dc7', '2021-12-22 08:18:32.437388', '2021-12-22 08:18:32.437388', NULL, 'Irrelevant Street', '6', 'Unimportant City', '8620');
INSERT INTO public.address VALUES ('4cff63e4-5c5d-461e-87fa-4e3b588c5722', '2021-12-22 08:18:32.437388', '2021-12-22 08:18:32.437388', NULL, 'Unknown Street', '7', 'Basel', '8720');
INSERT INTO public.address VALUES ('2a9258c4-11b3-4193-b347-3d4d7202671d', '2021-12-22 08:18:33.616782', '2021-12-22 08:18:33.616782', NULL, 'Irrelevant Street', '6', 'Unimportant City', '8620');
INSERT INTO public.address VALUES ('af460d9f-6482-406b-b588-2c0cf0b34e3d', '2021-12-22 08:18:33.616782', '2021-12-22 08:18:33.616782', NULL, 'Unknown Street', '7', 'Winterthur', '8720');
INSERT INTO public.address VALUES ('64cffc21-b7ec-4af8-8028-66d9491f8de9', '2021-12-22 08:18:36.469737', '2021-12-22 08:18:36.469737', NULL, 'Irrelevant Street', '6', 'Unimportant City', '8620');
INSERT INTO public.address VALUES ('d65a3849-1896-448b-bb00-4dd8e3977794', '2021-12-22 08:18:36.469737', '2021-12-22 08:18:36.469737', NULL, 'Unknown Street', '7', 'Zug', '8720');
INSERT INTO public.address VALUES ('d69684fe-b876-4cb7-b861-2e3707f9db8b', '2021-12-22 08:18:38.835289', '2021-12-22 08:18:38.835289', NULL, 'Irrelevant Street', '6', 'Unimportant City', '8620');
INSERT INTO public.address VALUES ('23f7c037-ca66-4b65-a2a2-657cdda079a7', '2021-12-22 08:18:38.835289', '2021-12-22 08:18:38.835289', NULL, 'Unknown Street', '7', 'Basel', '8720');
INSERT INTO public.address VALUES ('91d5610c-4b37-4afd-8f96-696953e5d854', '2021-12-22 08:18:41.91115', '2021-12-22 08:18:41.91115', NULL, 'Irrelevant Street', '6', 'Unimportant City', '8620');
INSERT INTO public.address VALUES ('f2250267-6ce7-4a36-8e41-31722e411ca5', '2021-12-22 08:18:41.91115', '2021-12-22 08:18:41.91115', NULL, 'Unknown Street', '7', 'Winterthur', '8720');
INSERT INTO public.address VALUES ('143c2050-58af-4ee6-bbcc-be50bcd7ed70', '2021-12-22 08:18:44.274276', '2021-12-22 08:18:44.274276', NULL, 'Irrelevant Street', '6', 'Unimportant City', '8620');
INSERT INTO public.address VALUES ('49b27c9f-bb4e-4ffb-acb5-eb058125d6fc', '2021-12-22 08:18:44.274276', '2021-12-22 08:18:44.274276', NULL, 'Unknown Street', '7', 'Genf', '8720');
INSERT INTO public.address VALUES ('198cde00-7687-4055-abe2-7d05c18600e3', '2021-12-22 08:18:45.478947', '2021-12-22 08:18:45.478947', NULL, 'Irrelevant Street', '6', 'Unimportant City', '8620');
INSERT INTO public.address VALUES ('51b5d44a-11c8-4585-9a4c-b3fa1a4b4f3c', '2021-12-22 08:18:45.478947', '2021-12-22 08:18:45.478947', NULL, 'Unknown Street', '7', 'Bern', '8720');
INSERT INTO public.address VALUES ('cb087b8a-793f-44cd-a3a7-ff5204c31356', '2021-12-22 08:18:46.638769', '2021-12-22 08:18:46.638769', NULL, 'Irrelevant Street', '6', 'Unimportant City', '8620');
INSERT INTO public.address VALUES ('730588ee-d2fd-4c6a-b69a-22bc40ddc6a3', '2021-12-22 08:18:46.638769', '2021-12-22 08:18:46.638769', NULL, 'Unknown Street', '7', 'Basel', '8720');
INSERT INTO public.address VALUES ('52bdc473-d780-48c6-b4a8-ad5da5a2f8df', '2021-12-22 08:18:47.547033', '2021-12-22 08:18:47.547033', NULL, 'Irrelevant Street', '6', 'Unimportant City', '8620');
INSERT INTO public.address VALUES ('becc3e88-0625-4eda-ac09-5d2acf68a789', '2021-12-22 08:18:47.547033', '2021-12-22 08:18:47.547033', NULL, 'Unknown Street', '7', 'Sion', '8720');
INSERT INTO public.address VALUES ('9ce1d49a-ee22-4fe0-977f-6cdeb7545bd9', '2021-12-22 08:19:45.911799', '2021-12-22 08:19:45.911799', NULL, 'Irrelevant Street', '6', 'Unimportant City', '8620');
INSERT INTO public.address VALUES ('c50e8a2d-5c42-4f87-8fdc-3f51adc203c7', '2021-12-22 08:19:45.911799', '2021-12-22 08:19:45.911799', NULL, 'Unknown Street', '7', 'Genf', '8720');
INSERT INTO public.address VALUES ('3991e954-9be2-4b4b-8e82-48f96d2671e3', '2021-12-22 08:19:47.121004', '2021-12-22 08:19:47.121004', NULL, 'Irrelevant Street', '6', 'Unimportant City', '8620');
INSERT INTO public.address VALUES ('3ff05d67-ff5a-431b-8e2c-bef0d65f1fbc', '2021-12-22 08:19:47.121004', '2021-12-22 08:19:47.121004', NULL, 'Unknown Street', '7', 'Zug', '8720');
INSERT INTO public.address VALUES ('2d69e8a4-d24d-47bc-bd1b-ed3d30c5f48b', '2021-12-22 08:20:22.738128', '2021-12-22 08:20:22.738128', NULL, 'Irrelevant Street', '6', 'Unimportant City', '8620');
INSERT INTO public.address VALUES ('7bfd6e7e-2125-42ac-a13b-070dd5af25e9', '2021-12-22 08:20:22.738128', '2021-12-22 08:20:22.738128', NULL, 'Unknown Street', '7', 'Zürich', '8720');
INSERT INTO public.address VALUES ('ec73cda1-8f72-4ed2-83a6-cbc01b093098', '2021-12-22 08:20:32.748419', '2021-12-22 08:20:32.748419', NULL, 'Irrelevant Street', '6', 'Unimportant City', '8620');
INSERT INTO public.address VALUES ('f5de3b10-a436-403e-86bb-c48b8bc0742f', '2021-12-22 08:20:32.748419', '2021-12-22 08:20:32.748419', NULL, 'Unknown Street', '7', 'Zürich', '8720');
INSERT INTO public.address VALUES ('f1846b3d-b298-474b-9166-75f3664a5972', '2021-12-22 08:20:33.973201', '2021-12-22 08:20:33.973201', NULL, 'Irrelevant Street', '6', 'Unimportant City', '8620');
INSERT INTO public.address VALUES ('fbc1a24e-ff15-4900-9a37-50ba89bd1c08', '2021-12-22 08:20:33.973201', '2021-12-22 08:20:33.973201', NULL, 'Unknown Street', '7', 'Basel', '8720');
INSERT INTO public.address VALUES ('b4dada40-585a-4aac-95c8-9ba4e0f1d206', '2021-12-22 08:20:39.037814', '2021-12-22 08:20:39.037814', NULL, 'Irrelevant Street', '6', 'Unimportant City', '8620');
INSERT INTO public.address VALUES ('6a17c43f-9447-47fb-8ac0-5e88c5dc370c', '2021-12-22 08:20:39.037814', '2021-12-22 08:20:39.037814', NULL, 'Unknown Street', '7', 'Zürich', '8720');
INSERT INTO public.address VALUES ('1728b335-643d-425b-ac96-f142c95197d4', '2021-12-22 08:20:39.979582', '2021-12-22 08:20:39.979582', NULL, 'Irrelevant Street', '6', 'Unimportant City', '8620');
INSERT INTO public.address VALUES ('33587e40-18f5-45ae-89df-bea76218567a', '2021-12-22 08:20:39.979582', '2021-12-22 08:20:39.979582', NULL, 'Unknown Street', '7', 'Zug', '8720');
INSERT INTO public.address VALUES ('77ae7c9d-4910-4b5e-9456-a0544335b5fc', '2021-12-22 08:20:43.615992', '2021-12-22 08:20:43.615992', NULL, 'Irrelevant Street', '6', 'Unimportant City', '8620');
INSERT INTO public.address VALUES ('45eed4fa-c664-466b-81a5-37d436b42580', '2021-12-22 08:20:43.615992', '2021-12-22 08:20:43.615992', NULL, 'Unknown Street', '7', 'Bern', '8720');
INSERT INTO public.address VALUES ('5a390cef-4df1-41f4-baf0-a473ec8c5e39', '2021-12-22 08:20:44.539165', '2021-12-22 08:20:44.539165', NULL, 'Irrelevant Street', '6', 'Unimportant City', '8620');
INSERT INTO public.address VALUES ('504b5048-2e66-49a2-b04c-8aa3b5a7721b', '2021-12-22 08:20:44.539165', '2021-12-22 08:20:44.539165', NULL, 'Unknown Street', '7', 'Bern', '8720');
INSERT INTO public.address VALUES ('3705356c-3e96-4b84-b8d0-72d2139c3e97', '2021-12-22 08:20:45.690168', '2021-12-22 08:20:45.690168', NULL, 'Irrelevant Street', '6', 'Unimportant City', '8620');
INSERT INTO public.address VALUES ('6ff61a24-95ab-4ea9-90ad-0a62d699279a', '2021-12-22 08:20:45.690168', '2021-12-22 08:20:45.690168', NULL, 'Unknown Street', '7', 'Winterthur', '8720');
INSERT INTO public.address VALUES ('305286d2-06f6-43e4-a853-ab5e81d477fd', '2021-12-22 08:20:47.042493', '2021-12-22 08:20:47.042493', NULL, 'Irrelevant Street', '6', 'Unimportant City', '8620');
INSERT INTO public.address VALUES ('aef9ef50-e2f8-4b28-bd0b-2f084071740b', '2021-12-22 08:20:47.042493', '2021-12-22 08:20:47.042493', NULL, 'Unknown Street', '7', 'Zug', '8720');
INSERT INTO public.address VALUES ('fbbd12eb-886e-4633-959a-03dbb97deb63', '2021-12-22 08:20:48.015494', '2021-12-22 08:20:48.015494', NULL, 'Irrelevant Street', '6', 'Unimportant City', '8620');
INSERT INTO public.address VALUES ('2c6f9014-09fa-45b9-929b-f1bd0d0b85cf', '2021-12-22 08:20:48.015494', '2021-12-22 08:20:48.015494', NULL, 'Unknown Street', '7', 'Genf', '8720');
INSERT INTO public.address VALUES ('9c40e306-bd47-4a43-ade3-17d64f780367', '2021-12-22 08:20:50.104522', '2021-12-22 08:20:50.104522', NULL, 'Irrelevant Street', '6', 'Unimportant City', '8620');
INSERT INTO public.address VALUES ('71f70402-a9fa-40be-b67c-f5841a5cf3e9', '2021-12-22 08:20:50.104522', '2021-12-22 08:20:50.104522', NULL, 'Unknown Street', '7', 'Bern', '8720');
INSERT INTO public.address VALUES ('e1eaa2e0-78ca-4bf3-8e73-7ff5cc25c504', '2021-12-22 08:20:52.424154', '2021-12-22 08:20:52.424154', NULL, 'Irrelevant Street', '6', 'Unimportant City', '8620');
INSERT INTO public.address VALUES ('696b031e-fae3-4b3c-8b45-081bbeb01a43', '2021-12-22 08:20:52.424154', '2021-12-22 08:20:52.424154', NULL, 'Unknown Street', '7', 'Zürich', '8720');
INSERT INTO public.address VALUES ('96effafe-16f7-4bce-bf3d-6b854f037470', '2021-12-22 08:20:53.653284', '2021-12-22 08:20:53.653284', NULL, 'Irrelevant Street', '6', 'Unimportant City', '8620');
INSERT INTO public.address VALUES ('eac1878d-02eb-4478-af82-96d01b393977', '2021-12-22 08:20:53.653284', '2021-12-22 08:20:53.653284', NULL, 'Unknown Street', '7', 'Bern', '8720');
INSERT INTO public.address VALUES ('6fa8f656-cb81-4211-a276-c456e91ed883', '2021-12-22 08:21:17.910008', '2021-12-22 08:21:17.910008', NULL, 'Irrelevant Street', '6', 'Unimportant City', '8620');
INSERT INTO public.address VALUES ('483df248-4a45-46d3-8bd4-028a6a6c58a7', '2021-12-22 08:21:17.910008', '2021-12-22 08:21:17.910008', NULL, 'Unknown Street', '7', 'Winterthur', '8720');
INSERT INTO public.address VALUES ('80b0e40e-9c61-4cb2-9609-d352654c1d5c', '2021-12-22 08:21:19.062081', '2021-12-22 08:21:19.062081', NULL, 'Irrelevant Street', '6', 'Unimportant City', '8620');
INSERT INTO public.address VALUES ('9ba5e82c-21b9-4fe7-b0bb-a1625f8d9533', '2021-12-22 08:21:19.062081', '2021-12-22 08:21:19.062081', NULL, 'Unknown Street', '7', 'Basel', '8720');
INSERT INTO public.address VALUES ('31776043-6819-4bb6-9ea7-4b138a5d298e', '2021-12-22 08:21:20.494152', '2021-12-22 08:21:20.494152', NULL, 'Irrelevant Street', '6', 'Unimportant City', '8620');
INSERT INTO public.address VALUES ('b9491f3f-6567-4827-bd1d-b332cbae7dc8', '2021-12-22 08:21:20.494152', '2021-12-22 08:21:20.494152', NULL, 'Unknown Street', '7', 'Winterthur', '8720');
INSERT INTO public.address VALUES ('4eefb7f3-20e6-4597-a555-6935f760502d', '2021-12-22 08:21:21.869813', '2021-12-22 08:21:21.869813', NULL, 'Irrelevant Street', '6', 'Unimportant City', '8620');
INSERT INTO public.address VALUES ('b6e7c4ac-3910-4431-95e2-8a2d7d9d5b0c', '2021-12-22 08:21:21.869813', '2021-12-22 08:21:21.869813', NULL, 'Unknown Street', '7', 'Sion', '8720');
INSERT INTO public.address VALUES ('a417c6cb-01c3-46fd-9b30-6853489be7ac', '2021-12-22 08:21:23.416781', '2021-12-22 08:21:23.416781', NULL, 'Irrelevant Street', '6', 'Unimportant City', '8620');
INSERT INTO public.address VALUES ('c4c48a38-61f5-41db-83e2-1277566b08e3', '2021-12-22 08:21:23.416781', '2021-12-22 08:21:23.416781', NULL, 'Unknown Street', '7', 'Bern', '8720');
INSERT INTO public.address VALUES ('987506b0-b320-4cbb-b7e7-c784807e6e87', '2021-12-22 08:21:39.521751', '2021-12-22 08:21:39.521751', NULL, 'Irrelevant Street', '6', 'Unimportant City', '8620');
INSERT INTO public.address VALUES ('fc592608-8272-4e89-8dc4-ed8186f182a9', '2021-12-22 08:21:39.521751', '2021-12-22 08:21:39.521751', NULL, 'Unknown Street', '7', 'Zug', '8720');
INSERT INTO public.address VALUES ('5e2f54ea-1980-4217-af1e-8e8020b9a7dd', '2021-12-22 08:21:41.366261', '2021-12-22 08:21:41.366261', NULL, 'Irrelevant Street', '6', 'Unimportant City', '8620');
INSERT INTO public.address VALUES ('8e714eaf-0e68-4c30-9b87-824dd6ba2a69', '2021-12-22 08:21:41.366261', '2021-12-22 08:21:41.366261', NULL, 'Unknown Street', '7', 'Bern', '8720');
INSERT INTO public.address VALUES ('89dae271-239b-46a0-9bc6-b00539452976', '2021-12-22 08:21:42.959926', '2021-12-22 08:21:42.959926', NULL, 'Irrelevant Street', '6', 'Unimportant City', '8620');
INSERT INTO public.address VALUES ('a206de29-fbb8-4174-95cf-a25eb90df5a4', '2021-12-22 08:21:42.959926', '2021-12-22 08:21:42.959926', NULL, 'Unknown Street', '7', 'Zürich', '8720');
INSERT INTO public.address VALUES ('9f7c7b68-bc36-4e0a-8938-dcaeb56e3c65', '2021-12-22 08:21:44.753808', '2021-12-22 08:21:44.753808', NULL, 'Irrelevant Street', '6', 'Unimportant City', '8620');
INSERT INTO public.address VALUES ('9899d7be-dceb-4fc5-a1b1-795361e280c2', '2021-12-22 08:21:44.753808', '2021-12-22 08:21:44.753808', NULL, 'Unknown Street', '7', 'Zug', '8720');
INSERT INTO public.address VALUES ('59348c46-d4b2-4cda-8289-66b8491647be', '2021-12-22 08:22:03.509211', '2021-12-22 08:22:03.509211', NULL, 'Irrelevant Street', '6', 'Unimportant City', '8620');
INSERT INTO public.address VALUES ('09a3f05f-5ad2-4a05-b49f-61fcc5e20ce6', '2021-12-22 08:22:03.509211', '2021-12-22 08:22:03.509211', NULL, 'Unknown Street', '7', 'Bern', '8720');
INSERT INTO public.address VALUES ('1e41c517-8b51-4ea1-8b62-e6449a77ff5b', '2021-12-22 08:22:04.576454', '2021-12-22 08:22:04.576454', NULL, 'Irrelevant Street', '6', 'Unimportant City', '8620');
INSERT INTO public.address VALUES ('862ec816-96f1-4e0b-987d-58aa5e1d9669', '2021-12-22 08:22:04.576454', '2021-12-22 08:22:04.576454', NULL, 'Unknown Street', '7', 'Zürich', '8720');
INSERT INTO public.address VALUES ('a671ec64-201c-4809-9758-bb0f643f6271', '2021-12-22 08:22:07.124578', '2021-12-22 08:22:07.124578', NULL, 'Irrelevant Street', '6', 'Unimportant City', '8620');
INSERT INTO public.address VALUES ('b7920ab8-6bdf-48e5-9bd8-fc2c55f0fb86', '2021-12-22 08:22:07.124578', '2021-12-22 08:22:07.124578', NULL, 'Unknown Street', '7', 'Sion', '8720');
INSERT INTO public.address VALUES ('1ef3f87c-e6d9-4874-a65d-00d45c17b4e8', '2021-12-22 08:22:08.220348', '2021-12-22 08:22:08.220348', NULL, 'Irrelevant Street', '6', 'Unimportant City', '8620');
INSERT INTO public.address VALUES ('edc9130e-195d-4987-b2d0-73961bb499f8', '2021-12-22 08:22:08.220348', '2021-12-22 08:22:08.220348', NULL, 'Unknown Street', '7', 'Zürich', '8720');
INSERT INTO public.address VALUES ('75999988-a9b5-48c5-b21e-d3e003b1650b', '2021-12-22 08:22:09.516973', '2021-12-22 08:22:09.516973', NULL, 'Irrelevant Street', '6', 'Unimportant City', '8620');
INSERT INTO public.address VALUES ('a8e5bce8-fd07-40e4-8ade-3e892c7db149', '2021-12-22 08:22:09.516973', '2021-12-22 08:22:09.516973', NULL, 'Unknown Street', '7', 'Zürich', '8720');
INSERT INTO public.address VALUES ('323979c7-0a19-49ab-a01e-4a9385e313b2', '2021-12-22 08:22:18.168434', '2021-12-22 08:22:18.168434', NULL, 'Irrelevant Street', '6', 'Unimportant City', '8620');
INSERT INTO public.address VALUES ('dae6a7ef-96ea-4fb5-8eb9-c31533a4bb68', '2021-12-22 08:22:18.168434', '2021-12-22 08:22:18.168434', NULL, 'Unknown Street', '7', 'Zürich', '8720');
INSERT INTO public.address VALUES ('ac047243-6bb8-47bf-8ddf-15fb4c9f94e6', '2021-12-22 08:22:19.796257', '2021-12-22 08:22:19.796257', NULL, 'Irrelevant Street', '6', 'Unimportant City', '8620');
INSERT INTO public.address VALUES ('448f9839-43a9-4afc-8968-f6341fc425e7', '2021-12-22 08:22:19.796257', '2021-12-22 08:22:19.796257', NULL, 'Unknown Street', '7', 'Winterthur', '8720');
INSERT INTO public.address VALUES ('5b02bbe4-affe-4165-8776-0f8eea0246d8', '2021-12-22 08:22:21.820198', '2021-12-22 08:22:21.820198', NULL, 'Irrelevant Street', '6', 'Unimportant City', '8620');
INSERT INTO public.address VALUES ('aa85d8be-d06d-4d76-a5c0-bbbca676649c', '2021-12-22 08:22:21.820198', '2021-12-22 08:22:21.820198', NULL, 'Unknown Street', '7', 'Sion', '8720');
INSERT INTO public.address VALUES ('e4b52f91-da07-48d0-ac0e-d0f67f921e12', '2021-12-22 14:01:37.373173', '2021-12-22 14:01:37.373173', NULL, 'Irrelevant Street', '6', 'Unimportant City', '8620');
INSERT INTO public.address VALUES ('96cf2973-8019-4838-a6fb-c3ccdec090c2', '2021-12-22 14:01:37.373173', '2021-12-22 14:01:37.373173', NULL, 'Unknown Street', '7', 'Genf', '8720');
INSERT INTO public.address VALUES ('71c32b70-3f60-4968-bd6b-d03c53dac32c', '2021-12-22 14:01:39.407428', '2021-12-22 14:01:39.407428', NULL, 'Irrelevant Street', '6', 'Unimportant City', '8620');
INSERT INTO public.address VALUES ('e22f16af-e1ba-4969-bdf4-3e8d5142bfa0', '2021-12-22 14:01:39.407428', '2021-12-22 14:01:39.407428', NULL, 'Unknown Street', '7', 'Basel', '8720');
INSERT INTO public.address VALUES ('51508c5e-bc3c-49b5-a29f-dae2c8ae57e1', '2021-12-22 14:01:44.232829', '2021-12-22 14:01:44.232829', NULL, 'Irrelevant Street', '6', 'Unimportant City', '8620');
INSERT INTO public.address VALUES ('f145b423-1be3-40fa-b534-1945e75723d2', '2021-12-22 14:01:44.232829', '2021-12-22 14:01:44.232829', NULL, 'Unknown Street', '7', 'Zürich', '8720');
INSERT INTO public.address VALUES ('10f3cdfb-e834-41fd-8a9e-d64527518850', '2021-12-22 14:02:29.872876', '2021-12-22 14:02:29.872876', NULL, 'Irrelevant Street', '6', 'Unimportant City', '8620');
INSERT INTO public.address VALUES ('78243bab-9c61-4754-ae26-4662ca47f3cb', '2021-12-22 14:02:29.872876', '2021-12-22 14:02:29.872876', NULL, 'Unknown Street', '7', 'Sion', '8720');
INSERT INTO public.address VALUES ('5174a6e5-2b9b-49f6-a0b0-2a300173d3b9', '2021-12-22 14:02:31.222437', '2021-12-22 14:02:31.222437', NULL, 'Irrelevant Street', '6', 'Unimportant City', '8620');
INSERT INTO public.address VALUES ('9f26c896-4141-45c6-b48a-5de7f42b9141', '2021-12-22 14:02:31.222437', '2021-12-22 14:02:31.222437', NULL, 'Unknown Street', '7', 'Basel', '8720');
INSERT INTO public.address VALUES ('0c3625a3-4433-4ee7-b363-f3153c973c6d', '2021-12-22 14:02:33.118076', '2021-12-22 14:02:33.118076', NULL, 'Irrelevant Street', '6', 'Unimportant City', '8620');
INSERT INTO public.address VALUES ('38a3a041-6e99-4b6b-bbbd-5fdcefb145bc', '2021-12-22 14:02:33.118076', '2021-12-22 14:02:33.118076', NULL, 'Unknown Street', '7', 'Basel', '8720');
INSERT INTO public.address VALUES ('a3c52e98-88ff-419c-adb0-329176017d88', '2021-12-22 14:02:34.320051', '2021-12-22 14:02:34.320051', NULL, 'Irrelevant Street', '6', 'Unimportant City', '8620');
INSERT INTO public.address VALUES ('124c787a-2285-4573-ad38-6edb6ddc346a', '2021-12-22 14:02:34.320051', '2021-12-22 14:02:34.320051', NULL, 'Unknown Street', '7', 'Bern', '8720');
INSERT INTO public.address VALUES ('c5b60276-ef69-4319-ba1f-f352ba5c776d', '2021-12-22 14:02:36.504227', '2021-12-22 14:02:36.504227', NULL, 'Irrelevant Street', '6', 'Unimportant City', '8620');
INSERT INTO public.address VALUES ('da4398c9-a241-4847-baf7-b349f8905fb6', '2021-12-22 14:02:36.504227', '2021-12-22 14:02:36.504227', NULL, 'Unknown Street', '7', 'Sion', '8720');
INSERT INTO public.address VALUES ('85465f92-c644-49cd-a973-0479e7adb454', '2021-12-22 14:02:38.099868', '2021-12-22 14:02:38.099868', NULL, 'Irrelevant Street', '6', 'Unimportant City', '8620');
INSERT INTO public.address VALUES ('0fe2cc55-6b77-4a6b-ab74-61a476590d47', '2021-12-22 14:02:38.099868', '2021-12-22 14:02:38.099868', NULL, 'Unknown Street', '7', 'Bern', '8720');
INSERT INTO public.address VALUES ('17d7eb2a-8dc5-41fe-929f-5b116d5b6212', '2021-12-22 14:02:39.711726', '2021-12-22 14:02:39.711726', NULL, 'Irrelevant Street', '6', 'Unimportant City', '8620');
INSERT INTO public.address VALUES ('e4dcdc65-47e5-45e7-b8a8-032da3f60c90', '2021-12-22 14:02:39.711726', '2021-12-22 14:02:39.711726', NULL, 'Unknown Street', '7', 'Bern', '8720');
INSERT INTO public.address VALUES ('b72e87b0-26a5-4a60-8034-f43eb6e92c88', '2021-12-22 14:02:41.120503', '2021-12-22 14:02:41.120503', NULL, 'Irrelevant Street', '6', 'Unimportant City', '8620');
INSERT INTO public.address VALUES ('fcb52f83-d302-41bf-b84e-68d37090b96c', '2021-12-22 14:02:41.120503', '2021-12-22 14:02:41.120503', NULL, 'Unknown Street', '7', 'Winterthur', '8720');
INSERT INTO public.address VALUES ('724a8bd3-ee8f-41d0-a2cf-5d3405adb544', '2021-12-22 14:02:42.995548', '2021-12-22 14:02:42.995548', NULL, 'Irrelevant Street', '6', 'Unimportant City', '8620');
INSERT INTO public.address VALUES ('584c1e8f-b7ad-4eb1-aadb-66c2e7bc0c7b', '2021-12-22 14:02:42.995548', '2021-12-22 14:02:42.995548', NULL, 'Unknown Street', '7', 'Basel', '8720');
INSERT INTO public.address VALUES ('9ca6dbfd-533d-42b6-add3-a70fa0c79c85', '2021-12-22 14:02:44.749699', '2021-12-22 14:02:44.749699', NULL, 'Irrelevant Street', '6', 'Unimportant City', '8620');
INSERT INTO public.address VALUES ('b01a49a1-fd4f-4828-a5fb-611ebfba7961', '2021-12-22 14:02:44.749699', '2021-12-22 14:02:44.749699', NULL, 'Unknown Street', '7', 'Sion', '8720');
INSERT INTO public.address VALUES ('59d915ec-6a0f-454a-9b8c-e5184162d991', '2021-12-22 14:03:01.270745', '2021-12-22 14:03:01.270745', NULL, 'Irrelevant Street', '6', 'Unimportant City', '8620');
INSERT INTO public.address VALUES ('737ad56f-01e3-44b9-9021-fda8393c42fe', '2021-12-22 14:03:01.270745', '2021-12-22 14:03:01.270745', NULL, 'Unknown Street', '7', 'Basel', '8720');
INSERT INTO public.address VALUES ('89ea5c51-6ec5-42dd-8a8d-f7ade364ac8b', '2021-12-22 14:03:02.524958', '2021-12-22 14:03:02.524958', NULL, 'Irrelevant Street', '6', 'Unimportant City', '8620');
INSERT INTO public.address VALUES ('15f89529-09dd-402b-baaf-913547943ae4', '2021-12-22 14:03:02.524958', '2021-12-22 14:03:02.524958', NULL, 'Unknown Street', '7', 'Bern', '8720');
INSERT INTO public.address VALUES ('1d09e63a-7c68-4a72-9364-36c52c55b2ed', '2021-12-22 14:03:03.722151', '2021-12-22 14:03:03.722151', NULL, 'Irrelevant Street', '6', 'Unimportant City', '8620');
INSERT INTO public.address VALUES ('0a9b84f3-27dc-41da-923c-c8c928af73f1', '2021-12-22 14:03:03.722151', '2021-12-22 14:03:03.722151', NULL, 'Unknown Street', '7', 'Sion', '8720');
INSERT INTO public.address VALUES ('aa42ca0c-0452-4036-89c4-276eec71c4a8', '2021-12-22 14:03:05.299248', '2021-12-22 14:03:05.299248', NULL, 'Irrelevant Street', '6', 'Unimportant City', '8620');
INSERT INTO public.address VALUES ('4d67aff6-ab43-4efd-96ee-796d07092af7', '2021-12-22 14:03:05.299248', '2021-12-22 14:03:05.299248', NULL, 'Unknown Street', '7', 'Sion', '8720');
INSERT INTO public.address VALUES ('e8e0b49f-3a9a-44b2-a9fe-a183e96110aa', '2021-12-22 14:03:06.710417', '2021-12-22 14:03:06.710417', NULL, 'Irrelevant Street', '6', 'Unimportant City', '8620');
INSERT INTO public.address VALUES ('bbf11d79-e0ba-4144-b9ed-8de91b9c054f', '2021-12-22 14:03:06.710417', '2021-12-22 14:03:06.710417', NULL, 'Unknown Street', '7', 'Genf', '8720');
INSERT INTO public.address VALUES ('da372ffe-6c16-42bd-b6ba-fcc9d6275ce2', '2021-12-22 14:03:08.712401', '2021-12-22 14:03:08.712401', NULL, 'Irrelevant Street', '6', 'Unimportant City', '8620');
INSERT INTO public.address VALUES ('d2d348aa-6b1f-485d-8a45-3a0220491865', '2021-12-22 14:03:08.712401', '2021-12-22 14:03:08.712401', NULL, 'Unknown Street', '7', 'Basel', '8720');
INSERT INTO public.address VALUES ('762a209e-d601-4537-9863-b14b913bec82', '2021-12-22 14:03:10.465582', '2021-12-22 14:03:10.465582', NULL, 'Irrelevant Street', '6', 'Unimportant City', '8620');
INSERT INTO public.address VALUES ('8994fba8-de02-471e-a9ee-7c000ba31103', '2021-12-22 14:03:10.465582', '2021-12-22 14:03:10.465582', NULL, 'Unknown Street', '7', 'Zürich', '8720');
INSERT INTO public.address VALUES ('dafc4b41-4999-4d18-bc5e-04861da38d7a', '2021-12-22 14:03:12.340571', '2021-12-22 14:03:12.340571', NULL, 'Irrelevant Street', '6', 'Unimportant City', '8620');
INSERT INTO public.address VALUES ('ad3ac291-fb11-43bd-aca8-0c740049b7f0', '2021-12-22 14:03:12.340571', '2021-12-22 14:03:12.340571', NULL, 'Unknown Street', '7', 'Sion', '8720');
INSERT INTO public.address VALUES ('28614361-41e6-4e16-be22-8e6176868967', '2021-12-22 14:03:14.522791', '2021-12-22 14:03:14.522791', NULL, 'Irrelevant Street', '6', 'Unimportant City', '8620');
INSERT INTO public.address VALUES ('83e5192a-6542-40ac-bf95-1dfd5922105c', '2021-12-22 14:03:14.522791', '2021-12-22 14:03:14.522791', NULL, 'Unknown Street', '7', 'Zug', '8720');
INSERT INTO public.address VALUES ('5b0ffe1e-85aa-4dbe-b53b-5b94d757c7c2', '2021-12-22 14:03:15.989569', '2021-12-22 14:03:15.989569', NULL, 'Irrelevant Street', '6', 'Unimportant City', '8620');
INSERT INTO public.address VALUES ('b57c9b6b-1c8a-42e8-a8a4-ac485f441084', '2021-12-22 14:03:15.989569', '2021-12-22 14:03:15.989569', NULL, 'Unknown Street', '7', 'Zug', '8720');
INSERT INTO public.address VALUES ('54138243-bdc0-4913-8337-c31bca4923d4', '2021-12-22 14:03:29.559815', '2021-12-22 14:03:29.559815', NULL, 'Irrelevant Street', '6', 'Unimportant City', '8620');
INSERT INTO public.address VALUES ('f2b5ac1a-61e4-4946-8ff9-cce2099365d5', '2021-12-22 14:03:29.559815', '2021-12-22 14:03:29.559815', NULL, 'Unknown Street', '7', 'Winterthur', '8720');
INSERT INTO public.address VALUES ('a30b4828-d078-40ec-ad1a-75114a62f43f', '2021-12-22 14:03:30.765981', '2021-12-22 14:03:30.765981', NULL, 'Irrelevant Street', '6', 'Unimportant City', '8620');
INSERT INTO public.address VALUES ('e770c9ba-181f-4556-b5a0-35aec281cc92', '2021-12-22 14:03:30.765981', '2021-12-22 14:03:30.765981', NULL, 'Unknown Street', '7', 'Winterthur', '8720');
INSERT INTO public.address VALUES ('96570dab-1012-4a6d-88f8-9e0affa3cd5b', '2021-12-22 14:03:31.696496', '2021-12-22 14:03:31.696496', NULL, 'Irrelevant Street', '6', 'Unimportant City', '8620');
INSERT INTO public.address VALUES ('e64847b8-f61c-4e5d-adc8-8b2a37b0638f', '2021-12-22 14:03:31.696496', '2021-12-22 14:03:31.696496', NULL, 'Unknown Street', '7', 'Sion', '8720');
INSERT INTO public.address VALUES ('31fe7608-edfd-40d0-a166-2835f1922e4c', '2021-12-22 14:32:29.834479', '2021-12-22 14:32:29.834479', NULL, 'Irrelevant Street', '6', 'Unimportant City', '8620');
INSERT INTO public.address VALUES ('aa09e188-399c-4f19-a9f8-3972b4df0dcd', '2021-12-22 14:32:29.834479', '2021-12-22 14:32:29.834479', NULL, 'Unknown Street', '7', 'Bern', '8720');
INSERT INTO public.address VALUES ('ad2c7959-dce0-4d1d-90ed-b5e5dc9fa7ab', '2021-12-22 14:32:31.2837', '2021-12-22 14:32:31.2837', NULL, 'Irrelevant Street', '6', 'Unimportant City', '8620');
INSERT INTO public.address VALUES ('59756766-e0a4-419d-b136-7c5340a8443e', '2021-12-22 14:32:31.2837', '2021-12-22 14:32:31.2837', NULL, 'Unknown Street', '7', 'Bern', '8720');
INSERT INTO public.address VALUES ('504c9180-5a5f-49a9-bd81-50931f757a69', '2021-12-22 14:32:48.26541', '2021-12-22 14:32:48.26541', NULL, 'Irrelevant Street', '6', 'Unimportant City', '8620');
INSERT INTO public.address VALUES ('66f92d24-935b-44d4-94c6-f6739bdff15c', '2021-12-22 14:32:48.26541', '2021-12-22 14:32:48.26541', NULL, 'Unknown Street', '7', 'Bern', '8720');
INSERT INTO public.address VALUES ('481ea15f-802e-401a-84e4-df627030ebd4', '2021-12-22 14:32:52.117317', '2021-12-22 14:32:52.117317', NULL, 'Irrelevant Street', '6', 'Unimportant City', '8620');
INSERT INTO public.address VALUES ('263d3148-2362-45a9-bfd6-c0e4bbc93ce8', '2021-12-22 14:32:52.117317', '2021-12-22 14:32:52.117317', NULL, 'Unknown Street', '7', 'Genf', '8720');
INSERT INTO public.address VALUES ('eb7b8e93-b6f8-4bf9-90ad-2512a6759acf', '2021-12-22 14:32:53.432543', '2021-12-22 14:32:53.432543', NULL, 'Irrelevant Street', '6', 'Unimportant City', '8620');
INSERT INTO public.address VALUES ('842d01b7-a1ba-4745-9403-117dd0bd1a25', '2021-12-22 14:32:53.432543', '2021-12-22 14:32:53.432543', NULL, 'Unknown Street', '7', 'Bern', '8720');
INSERT INTO public.address VALUES ('5573119e-b223-4036-bea8-b07166deb07b', '2021-12-22 14:32:55.120226', '2021-12-22 14:32:55.120226', NULL, 'Irrelevant Street', '6', 'Unimportant City', '8620');
INSERT INTO public.address VALUES ('0b5ac5eb-fdae-4665-8bf7-7da4996700ba', '2021-12-22 14:32:55.120226', '2021-12-22 14:32:55.120226', NULL, 'Unknown Street', '7', 'Bern', '8720');
INSERT INTO public.address VALUES ('c7d6b202-2b8a-49b9-8b87-af4133f7e905', '2021-12-22 14:32:57.444226', '2021-12-22 14:32:57.444226', NULL, 'Irrelevant Street', '6', 'Unimportant City', '8620');
INSERT INTO public.address VALUES ('edf65a97-3631-4c50-9393-8d288691b89a', '2021-12-22 14:32:57.444226', '2021-12-22 14:32:57.444226', NULL, 'Unknown Street', '7', 'Zug', '8720');
INSERT INTO public.address VALUES ('02fa2b61-def3-4fea-badb-2e71f1ffa0bf', '2021-12-22 14:32:58.870682', '2021-12-22 14:32:58.870682', NULL, 'Irrelevant Street', '6', 'Unimportant City', '8620');
INSERT INTO public.address VALUES ('7c120c9a-dc89-45f7-94d6-4f9d02806aaa', '2021-12-22 14:32:58.870682', '2021-12-22 14:32:58.870682', NULL, 'Unknown Street', '7', 'Genf', '8720');
INSERT INTO public.address VALUES ('af0cac8b-56c0-45e2-9a6c-69d01e3434ac', '2021-12-22 14:33:01.264425', '2021-12-22 14:33:01.264425', NULL, 'Irrelevant Street', '6', 'Unimportant City', '8620');
INSERT INTO public.address VALUES ('3b7bd989-3fd3-464f-8e22-a87ff3f2ac78', '2021-12-22 14:33:01.264425', '2021-12-22 14:33:01.264425', NULL, 'Unknown Street', '7', 'Zug', '8720');
INSERT INTO public.address VALUES ('120f0cc0-25f9-412f-a2df-f8cc2f58ae70', '2021-12-22 14:33:12.556351', '2021-12-22 14:33:12.556351', NULL, 'Irrelevant Street', '6', 'Unimportant City', '8620');
INSERT INTO public.address VALUES ('38973f07-b468-419b-ad61-68ada13bcc1e', '2021-12-22 14:33:12.556351', '2021-12-22 14:33:12.556351', NULL, 'Unknown Street', '7', 'Basel', '8720');
INSERT INTO public.address VALUES ('8146f448-13ef-4dec-ac2b-b2e2d0d5fb2c', '2021-12-22 14:33:16.339822', '2021-12-22 14:33:16.339822', NULL, 'Irrelevant Street', '6', 'Unimportant City', '8620');
INSERT INTO public.address VALUES ('ecdb80c7-1609-4068-9f8c-7f2abaf7d3e7', '2021-12-22 14:33:16.339822', '2021-12-22 14:33:16.339822', NULL, 'Unknown Street', '7', 'Sion', '8720');
INSERT INTO public.address VALUES ('ebaf3b05-8873-4e36-9e98-f58d567f28f5', '2021-12-22 14:33:19.957269', '2021-12-22 14:33:19.957269', NULL, 'Irrelevant Street', '6', 'Unimportant City', '8620');
INSERT INTO public.address VALUES ('8924ea97-98ba-45f5-8e0c-d7b0e6f9846b', '2021-12-22 14:33:19.957269', '2021-12-22 14:33:19.957269', NULL, 'Unknown Street', '7', 'Genf', '8720');
INSERT INTO public.address VALUES ('0d352185-a05c-438e-9d53-83f5f84b6c54', '2021-12-22 14:33:21.044327', '2021-12-22 14:33:21.044327', NULL, 'Irrelevant Street', '6', 'Unimportant City', '8620');
INSERT INTO public.address VALUES ('5c85634e-497d-4afc-abbe-cecbe98d750b', '2021-12-22 14:33:21.044327', '2021-12-22 14:33:21.044327', NULL, 'Unknown Street', '7', 'Zug', '8720');
INSERT INTO public.address VALUES ('e1d235b7-542b-485d-a69f-8bf949873add', '2021-12-22 14:33:22.134285', '2021-12-22 14:33:22.134285', NULL, 'Irrelevant Street', '6', 'Unimportant City', '8620');
INSERT INTO public.address VALUES ('0a0830e0-6e71-4769-b56b-150bb1f8960d', '2021-12-22 14:33:22.134285', '2021-12-22 14:33:22.134285', NULL, 'Unknown Street', '7', 'Sion', '8720');
INSERT INTO public.address VALUES ('86692fe2-6c71-4949-b6df-beaaf571418c', '2021-12-22 14:33:26.544943', '2021-12-22 14:33:26.544943', NULL, 'Irrelevant Street', '6', 'Unimportant City', '8620');
INSERT INTO public.address VALUES ('df9edbbf-4b68-4aa3-a658-461822dc01a1', '2021-12-22 14:33:26.544943', '2021-12-22 14:33:26.544943', NULL, 'Unknown Street', '7', 'Bern', '8720');
INSERT INTO public.address VALUES ('ec7f756d-28f0-43c3-aa78-118552bade30', '2021-12-23 08:06:12.979339', '2021-12-23 08:06:12.979339', NULL, 'Irrelevant Street', '6', 'Unimportant City', '8620');
INSERT INTO public.address VALUES ('01e989a6-2699-430f-8354-a877b855a7bf', '2021-12-23 08:06:12.979339', '2021-12-23 08:06:12.979339', NULL, 'Unknown Street', '7', 'Basel', '8720');
INSERT INTO public.address VALUES ('7f289bf5-b61f-4cdf-ad41-f576f4da3563', '2021-12-23 09:26:08.327565', '2021-12-23 09:26:08.327565', NULL, 'Thurgauerstrasse', '117', 'Opfikon', '8152');
INSERT INTO public.address VALUES ('ce859f05-7a5a-4462-8e09-e12de1d21c70', '2021-12-23 14:23:56.040297', '2021-12-23 14:23:56.040297', NULL, 'Irrelevant Street', '6', 'Unimportant City', '8620');
INSERT INTO public.address VALUES ('fcf7ad71-60e6-41bc-aab2-fb99560800f6', '2021-12-23 14:23:56.040297', '2021-12-23 14:23:56.040297', NULL, 'Unknown Street', '7', 'Bern', '8720');
INSERT INTO public.address VALUES ('26454049-16a7-411a-b269-1be9bf25205e', '2021-12-23 14:24:03.565375', '2021-12-23 14:24:03.565375', NULL, 'Irrelevant Street', '6', 'Unimportant City', '8620');
INSERT INTO public.address VALUES ('612e0412-e8e9-4431-8d0e-6e12270b3543', '2021-12-23 14:24:03.565375', '2021-12-23 14:24:03.565375', NULL, 'Unknown Street', '7', 'Sion', '8720');
INSERT INTO public.address VALUES ('746643f1-cd04-4e6a-a0c0-57e9311e576a', '2021-12-23 14:24:17.728617', '2021-12-23 14:24:17.728617', NULL, 'Irrelevant Street', '6', 'Unimportant City', '8620');
INSERT INTO public.address VALUES ('1a73132a-0ac0-485d-bc12-34dcd4288594', '2021-12-23 14:24:17.728617', '2021-12-23 14:24:17.728617', NULL, 'Unknown Street', '7', 'Basel', '8720');
INSERT INTO public.address VALUES ('62ad6ded-cf82-43e4-89d1-c0f564563325', '2022-01-18 06:44:44.841778', '2022-01-18 06:44:44.841778', NULL, 'Irrelevant Street', '6', 'Unimportant City', '8620');
INSERT INTO public.address VALUES ('6c7b08cb-6e7f-49ee-8db9-aac8d166e12b', '2022-01-18 06:44:44.841778', '2022-01-18 06:44:44.841778', NULL, 'Unknown Street', '7', 'Genf', '8720');
INSERT INTO public.address VALUES ('eee1b800-9ad4-48e1-be7d-35dc3df7d27f', '2022-01-20 12:54:44.516355', '2022-01-20 12:54:44.516355', NULL, 'Sonneggstrasse', '19', 'Zürich', '8006');
INSERT INTO public.address VALUES ('e4f363ba-0786-4426-9acc-d229cd4f083a', '2022-01-20 14:26:07.434961', '2022-01-20 14:26:07.434961', NULL, 'Sonneggstrasse', '19', 'Zürich', '8006');
INSERT INTO public.address VALUES ('1c908e73-9d07-467d-832b-18e2f3e9678f', '2022-01-20 14:28:07.473204', '2022-01-20 14:28:07.473204', NULL, 'Sonneggstrasse', '19', 'Zürich', '8006');
INSERT INTO public.address VALUES ('1e261ce8-d84a-45cb-ae64-bfcca6b4864f', '2022-01-21 07:32:06.381336', '2022-01-21 07:32:06.381336', NULL, 'Sonneggstrasse', '19', 'Zürich', '8006');
INSERT INTO public.address VALUES ('28b4076c-ae25-43f4-b0e5-d92b9564723a', '2022-01-21 08:00:30.851083', '2022-01-21 08:00:30.851083', NULL, 'Sonneggstrasse', '19', 'Zürich', '8006');
INSERT INTO public.address VALUES ('b76d9575-5b2a-4ec0-81f2-e0765041e530', '2022-01-21 12:53:31.84384', '2022-01-21 12:53:31.84384', NULL, 'Teststrasse', '123', 'Zürich', '8001');
INSERT INTO public.address VALUES ('faa78faa-cb2d-425d-9c23-25171a29deda', '2022-01-26 08:23:14.157105', '2022-01-26 08:23:14.157105', NULL, 'Sonneggstrasse', '19', 'Zürich', '8006');
INSERT INTO public.address VALUES ('f491661c-8650-44d8-a989-e8007662667f', '2022-01-27 12:26:00.46486', '2022-01-27 12:26:00.46486', NULL, 'Sonneggstrasse', '19', 'Zürich', '8006');


--
-- Data for Name: bank; Type: TABLE DATA; Schema: public; Owner: db_user
--

INSERT INTO public.bank VALUES ('99295c95-e736-4fe4-a806-082e6db5fe4e', '2021-12-22 07:39:07.900656', '2021-12-22 07:39:07.900656', NULL, '-', '-', '-', '2811509315', NULL, 'UBS Schweiz', 'UBS', NULL);
INSERT INTO public.bank VALUES ('fc39b098-60b6-4390-aa2a-de6b80c6d499', '2021-12-22 07:39:10.238495', '2021-12-22 07:39:10.238495', NULL, '-', '-', '-', '4845060089', NULL, 'Postfinance', 'PST', NULL);
INSERT INTO public.bank VALUES ('4e33c212-32de-40b4-9bc5-948327379b70', '2021-12-22 07:41:56.336968', '2021-12-22 07:41:56.336968', NULL, '-', '-', '-', '4042587695', NULL, 'Züricher Kantonal Bank', 'ZKB', NULL);
INSERT INTO public.bank VALUES ('3de287e3-9b7b-41f1-b2a0-a90b183be66c', '2021-12-23 09:26:08.327565', '2021-12-23 09:26:08.327565', NULL, 'Daniel', 'Gächter', 'davidwyss97@icloud.com', '9594241453', '7f289bf5-b61f-4cdf-ad41-f576f4da3563', 'PolygonBank Daniel', 'POL', '198237987');
INSERT INTO public.bank VALUES ('c3cad835-1223-4cf5-b26b-4dd25dc394e3', '2021-12-22 07:39:42.092664', '2021-12-22 07:39:42.092664', NULL, '-', '-', '-', '0506367251', NULL, 'Bank Linth', 'LNT', NULL);
INSERT INTO public.bank VALUES ('eb28371f-b694-4164-afa5-26f1664c28d0', '2022-01-27 12:26:00.40791', '2022-01-27 12:26:00.40791', NULL, '-', '-', '-', '0343356704', NULL, 'Radikale PepeBank', 'RPB', '-');


--
-- Data for Name: comment; Type: TABLE DATA; Schema: public; Owner: db_user
--



--
-- Data for Name: company; Type: TABLE DATA; Schema: public; Owner: db_user
--

INSERT INTO public.company VALUES ('40640680-ff54-4917-b2d4-9d8e45acaa1c', '2021-12-20 09:34:52.229216', '2021-12-22 07:20:26.312273', NULL, 'David', 'Wyss', 'david.wyss@polygon-software.ch', '6665436045', 'PolygonSoftware GmbH', 'DE', '', '132454676543', false, 'DONE', '5510735a-4077-4360-8ed2-3607ad7f4154', '2344a722-1579-4be1-8e2c-ed022f30ce95');


--
-- Data for Name: dossier; Type: TABLE DATA; Schema: public; Owner: db_user
--

INSERT INTO public.dossier VALUES ('ca2257ea-4e0c-4091-8ae7-0f7a13f3052c', '2022-01-21 08:00:30.851083', '2022-01-21 12:17:29.634979', NULL, 'David', 'Wyss', 'david.wyss@hotmail.ch', '8534134055', false, 'OPEN', 'fc39b098-60b6-4390-aa2a-de6b80c6d499', 'f0bf77c1-c960-4c9f-a7a0-e4b158f5a051', 'ea721a97-4076-4210-bf6a-e6ca5bf525d7', '+41786708847', '1997-04-10 00:00:00', 'APARTMENT', true, '2016-06-05 00:00:00', 780000, 1200000, 450000, true, true, 5000, false, true, NULL, NULL, false, NULL, NULL, '{120000}', 1200, 3000, 50000, 1200, 200, 0, 250, false, false, '28b4076c-ae25-43f4-b0e5-d92b9564723a', 172550, 39500, 1200000, 1368000, 22.89, 37.5, 32.89, '{350000,100000}', '{2026-06-05,2027-06-10}');
INSERT INTO public.dossier VALUES ('2ed9e0d0-7b3c-42e3-90dd-2a456740ca2d', '2022-01-21 12:53:31.84384', '2022-01-21 13:20:44.752302', NULL, 'Christoph', 'Fässler', 'christoph.faessler@polygon-software.ch', '9454485811', true, 'OPEN', '4e33c212-32de-40b4-9bc5-948327379b70', 'f0bf77c1-c960-4c9f-a7a0-e4b158f5a051', '389e7d21-4ad1-45e5-b0f8-17b4b80b7b9d', '07812342311', '1990-03-12 00:00:00', 'APARTMENT', true, '2016-06-05 00:00:00', 800000, 850000, 500000, true, true, 2000, false, true, NULL, NULL, true, 2021, 100000, '{100000,20000}', 1200, 0, 30000, 1200, 3000, 2000, 250, false, false, 'b76d9575-5b2a-4ec0-81f2-e0765041e530', 144750, 35500, 850000, 969000, 24.53, 58.82, 51.6, '{490000,10000}', '{2026-01-22,2028-06-05}');
INSERT INTO public.dossier VALUES ('41068ba4-31ef-4b08-a189-5c0d22852d7a', '2022-01-26 08:23:14.157105', '2022-01-26 08:23:16.355283', NULL, 'David', 'Wyss', 'david.wyss@hotmail.ch', '7656189718', true, 'OPEN', 'fc39b098-60b6-4390-aa2a-de6b80c6d499', 'f0bf77c1-c960-4c9f-a7a0-e4b158f5a051', '39a8270b-55fa-426f-8d0c-3284a24c9e6b', '+41786708847', '2022-01-21 00:00:00', 'APARTMENT_BUILDING', true, '1980-06-05 00:00:00', 500000, 1000000, 400000, false, true, NULL, false, true, NULL, NULL, false, NULL, NULL, '{100000}', 10, 0, 25000, 2500, 0, 0, 0, false, false, 'faa78faa-cb2d-425d-9c23-25171a29deda', 122510, 51347, 1000000, 3134700, 41.91, 40, 12.76, '{400000}', '{2023-06-05}');
INSERT INTO public.dossier VALUES ('b326c7e7-fb0d-4674-96f1-5b4ef5fbcb38', '2022-01-27 12:26:00.46486', '2022-01-27 12:26:02.475368', NULL, 'David', 'Wyss', 'david.wyss@hotmail.ch', '5191177432', true, 'OPEN', 'eb28371f-b694-4164-afa5-26f1664c28d0', 'f0bf77c1-c960-4c9f-a7a0-e4b158f5a051', '3a8451f4-30ff-46c0-b8d9-c1b9857f0a68', '+41786708847', '2022-01-29 00:00:00', 'APARTMENT', true, '2002-06-05 00:00:00', 500000, 800000, 400000, false, true, NULL, false, true, NULL, NULL, false, NULL, NULL, '{100000}', 2500, 0, 25000, 1200, 250, 0, 0, false, false, 'f491661c-8650-44d8-a989-e8007662667f', 126050, 44831, 800000, 2483120, 35.57, 50, 16.11, '{400000}', '{2025-06-05}');


--
-- Data for Name: employee; Type: TABLE DATA; Schema: public; Owner: db_user
--

INSERT INTO public.employee VALUES ('f0bf77c1-c960-4c9f-a7a0-e4b158f5a051', '2021-12-22 07:22:58.73287', '2021-12-22 07:22:58.73287', NULL, 'Davidemp', 'LeYee', 'david.wyss@uzh.ch', '7366094513', 'DE', 'Entwickler*in', '0786708847', 'Herr', '40640680-ff54-4917-b2d4-9d8e45acaa1c');


--
-- Data for Name: offer; Type: TABLE DATA; Schema: public; Owner: db_user
--

INSERT INTO public.offer VALUES ('3a5bf3c7-0916-44c1-9865-c776fd08cf6c', '2021-12-22 14:33:12.60609', '2021-12-22 14:33:12.60609', NULL, NULL, 'c3cad835-1223-4cf5-b26b-4dd25dc394e3', 'RETRACTED');
INSERT INTO public.offer VALUES ('a781fa69-301e-4976-a3ca-c30abfbcc7b0', '2021-12-23 09:38:24.83305', '2021-12-23 09:45:48.628696', NULL, NULL, '3de287e3-9b7b-41f1-b2a0-a90b183be66c', 'INTERESTED');
INSERT INTO public.offer VALUES ('c827ff32-a0ee-4d47-a0a0-400c6928e989', '2021-12-23 13:15:38.740587', '2021-12-23 14:27:26.955875', NULL, NULL, '3de287e3-9b7b-41f1-b2a0-a90b183be66c', 'ACCEPTED');
INSERT INTO public.offer VALUES ('1113683f-a8f2-4eda-a6e1-815fa9e2e7f6', '2021-12-22 14:33:21.09202', '2021-12-22 14:33:21.09202', NULL, NULL, '4e33c212-32de-40b4-9bc5-948327379b70', 'IN_PROCESS');
INSERT INTO public.offer VALUES ('74c109fa-b3f0-46cb-9a26-ca121990bf55', '2021-12-22 14:33:21.314812', '2021-12-22 14:33:21.314812', NULL, NULL, 'fc39b098-60b6-4390-aa2a-de6b80c6d499', 'RETRACTED');
INSERT INTO public.offer VALUES ('ad12be2c-2ce6-4675-b271-f829c66981de', '2021-12-22 14:33:21.46237', '2021-12-22 14:33:21.46237', NULL, NULL, 'c3cad835-1223-4cf5-b26b-4dd25dc394e3', 'RETRACTED');
INSERT INTO public.offer VALUES ('d2e9ad1a-e6c8-425b-949a-3bf9b2df1342', '2021-12-23 08:25:32.631528', '2021-12-23 08:25:32.631528', NULL, NULL, '99295c95-e736-4fe4-a806-082e6db5fe4e', 'INTERESTED');
INSERT INTO public.offer VALUES ('7cd2f583-18aa-4d92-a695-c30be10916fe', '2021-12-22 14:32:52.17716', '2021-12-22 14:32:52.17716', NULL, NULL, 'c3cad835-1223-4cf5-b26b-4dd25dc394e3', 'RETRACTED');
INSERT INTO public.offer VALUES ('62dc158c-0d61-4203-b61d-e7c1ace0ba08', '2021-12-22 14:32:52.457585', '2021-12-22 14:32:52.457585', NULL, NULL, 'fc39b098-60b6-4390-aa2a-de6b80c6d499', 'RETRACTED');
INSERT INTO public.offer VALUES ('2dc1fb23-58cd-4025-b830-476838409ebc', '2021-12-22 14:32:52.61274', '2021-12-22 14:32:52.61274', NULL, NULL, '4e33c212-32de-40b4-9bc5-948327379b70', 'RETRACTED');
INSERT INTO public.offer VALUES ('d66f790b-2cef-4f5b-a590-0f69864cb90d', '2021-12-23 08:20:22.425787', '2021-12-23 08:20:22.425787', NULL, NULL, '99295c95-e736-4fe4-a806-082e6db5fe4e', 'INTERESTED');
INSERT INTO public.offer VALUES ('662f7c26-c0df-4575-98f7-0c2346b1b042', '2021-12-22 14:32:48.33164', '2021-12-22 14:32:48.33164', NULL, NULL, '4e33c212-32de-40b4-9bc5-948327379b70', 'RETRACTED');
INSERT INTO public.offer VALUES ('f3290e6d-b1c6-4194-befc-ff468c1a1983', '2021-12-22 14:32:48.556298', '2021-12-22 14:32:48.556298', NULL, NULL, 'fc39b098-60b6-4390-aa2a-de6b80c6d499', 'RETRACTED');
INSERT INTO public.offer VALUES ('5fd3304f-d1a6-45a9-ba0c-f3c39b83fbfa', '2021-12-22 14:32:48.686332', '2021-12-23 08:38:47.688534', NULL, NULL, '99295c95-e736-4fe4-a806-082e6db5fe4e', 'IN_PROCESS');
INSERT INTO public.offer VALUES ('c62c762a-20ee-436f-a063-0c03f6754431', '2021-12-22 14:33:20.003657', '2021-12-22 14:33:20.003657', NULL, NULL, '99295c95-e736-4fe4-a806-082e6db5fe4e', 'RETRACTED');
INSERT INTO public.offer VALUES ('07d6524b-47ff-4922-9ed2-0cfdec73c5d1', '2021-12-22 14:33:20.228354', '2021-12-22 14:33:20.228354', NULL, NULL, 'fc39b098-60b6-4390-aa2a-de6b80c6d499', 'RETRACTED');
INSERT INTO public.offer VALUES ('d8e9938b-6118-47cc-aff6-50695407b392', '2021-12-22 14:33:20.314931', '2021-12-22 14:33:20.314931', NULL, NULL, '4e33c212-32de-40b4-9bc5-948327379b70', 'ACCEPTED');
INSERT INTO public.offer VALUES ('24c4ec89-a7be-4008-b3ed-1f1b40aa5d2b', '2021-12-22 14:32:31.382259', '2021-12-22 14:32:31.382259', NULL, NULL, '4e33c212-32de-40b4-9bc5-948327379b70', 'RETRACTED');
INSERT INTO public.offer VALUES ('e4b7ab20-7540-4821-ae4f-fef032e2ef8f', '2021-12-22 14:32:31.573217', '2021-12-22 14:32:31.573217', NULL, NULL, 'c3cad835-1223-4cf5-b26b-4dd25dc394e3', 'RETRACTED');
INSERT INTO public.offer VALUES ('eefd3ae8-f9c7-412f-a01e-82e24217a12d', '2021-12-23 09:38:23.251768', '2021-12-23 09:38:23.251768', NULL, NULL, '3de287e3-9b7b-41f1-b2a0-a90b183be66c', 'INTERESTED');
INSERT INTO public.offer VALUES ('3a290373-ef47-4b19-8932-42ee45b15df7', '2021-12-22 14:33:26.607086', '2021-12-22 14:33:26.607086', NULL, NULL, '4e33c212-32de-40b4-9bc5-948327379b70', 'ACCEPTED');
INSERT INTO public.offer VALUES ('8ff25d96-64e2-44dc-bb3e-208f46a5aa3d', '2021-12-23 09:44:14.639424', '2021-12-23 09:45:33.601099', NULL, NULL, '3de287e3-9b7b-41f1-b2a0-a90b183be66c', 'INTERESTED');
INSERT INTO public.offer VALUES ('34607a40-f877-4020-a2ee-092ac0ff0b14', '2021-12-22 14:33:16.409369', '2021-12-22 14:33:16.409369', NULL, NULL, 'fc39b098-60b6-4390-aa2a-de6b80c6d499', 'INTERESTED');
INSERT INTO public.offer VALUES ('211677fc-aee1-4ef9-9faf-0adfc0b4026a', '2021-12-22 14:33:17.003087', '2021-12-22 14:33:17.003087', NULL, NULL, '4e33c212-32de-40b4-9bc5-948327379b70', 'RETRACTED');
INSERT INTO public.offer VALUES ('95a45e49-e199-4040-b34a-5183233f37d8', '2021-12-22 14:33:17.35565', '2021-12-22 14:33:17.35565', NULL, NULL, '99295c95-e736-4fe4-a806-082e6db5fe4e', 'RETRACTED');


--
-- Data for Name: private_file; Type: TABLE DATA; Schema: public; Owner: db_user
--

INSERT INTO public.private_file VALUES ('9d98a120-74c4-4012-abef-628840cb0a73', '2021-12-22 07:17:53.468046', '2021-12-22 07:17:53.468046', NULL, '40640680-ff54-4917-b2d4-9d8e45acaa1c', 'b85702fe-e90d-44b9-b598-fee018c888b6-05_swtesting-testcodequality.pdf', '40640680-ff54-4917-b2d4-9d8e45acaa1c', NULL, NULL, 'NONE');
INSERT INTO public.private_file VALUES ('f6583aff-cfa2-4a9f-872b-5d00eaa2d791', '2021-12-22 07:18:22.25417', '2021-12-22 07:18:22.25417', NULL, '40640680-ff54-4917-b2d4-9d8e45acaa1c', '3fbb3f71-7a4a-4e02-aa06-be048bbf524b-02d.pdf', '40640680-ff54-4917-b2d4-9d8e45acaa1c', NULL, NULL, 'NONE');
INSERT INTO public.private_file VALUES ('2397998e-9d43-422f-8f20-45c332baa388', '2021-12-22 07:18:22.626548', '2021-12-22 07:18:22.626548', NULL, '40640680-ff54-4917-b2d4-9d8e45acaa1c', '3c19cce2-64a1-47e1-adb2-ceadfb1f4809-02_swtesting-principles.pdf', '40640680-ff54-4917-b2d4-9d8e45acaa1c', NULL, NULL, 'NONE');
INSERT INTO public.private_file VALUES ('ea721a97-4076-4210-bf6a-e6ca5bf525d7', '2022-01-21 08:58:16.732816', '2022-01-21 08:58:16.732816', NULL, 'f0bf77c1-c960-4c9f-a7a0-e4b158f5a051', '59b95344-53be-486a-a44f-b84dc39a6e12-Dossier_ca2257ea-4e0c-4091-8ae7-0f7a13f3052c.pdf', NULL, 'ca2257ea-4e0c-4091-8ae7-0f7a13f3052c', NULL, 'NONE');
INSERT INTO public.private_file VALUES ('b485d11b-0ac8-4fd8-a2cb-d0322b15bb2d', '2022-01-21 10:03:52.348082', '2022-01-21 10:03:52.348082', NULL, 'f0bf77c1-c960-4c9f-a7a0-e4b158f5a051', '1f93741f-3f07-49d4-a589-b8b851f1d7fc-05_swtesting-tdd.pdf', NULL, 'ca2257ea-4e0c-4091-8ae7-0f7a13f3052c', NULL, 'ADDITIONAL_DOCUMENTS');
INSERT INTO public.private_file VALUES ('96d24315-bf26-4dcf-813f-7fe52c47eefa', '2022-01-21 10:17:38.419793', '2022-01-21 10:17:38.419793', NULL, 'f0bf77c1-c960-4c9f-a7a0-e4b158f5a051', '2de8fd49-b33f-42ee-bb7a-409c3c73c7de-01_swtesting-introduction-1.pdf', NULL, 'ca2257ea-4e0c-4091-8ae7-0f7a13f3052c', NULL, 'SALARY');
INSERT INTO public.private_file VALUES ('c5782198-e1b3-4179-b0ab-9016ba7164de', '2022-01-21 11:53:38.953168', '2022-01-21 11:53:38.953168', NULL, 'f0bf77c1-c960-4c9f-a7a0-e4b158f5a051', '1b35b64a-7846-460c-9c6f-7409bf1a1651-02d.pdf', NULL, 'ca2257ea-4e0c-4091-8ae7-0f7a13f3052c', NULL, 'ID');
INSERT INTO public.private_file VALUES ('0f323bc4-c6af-4388-9d7a-12641bb71b80', '2022-01-21 12:15:58.480046', '2022-01-21 12:15:58.480046', NULL, 'f0bf77c1-c960-4c9f-a7a0-e4b158f5a051', '075abbba-e91d-4471-bc37-7dd11becbde3-85820d.pdf', NULL, 'ca2257ea-4e0c-4091-8ae7-0f7a13f3052c', NULL, 'PENSION');
INSERT INTO public.private_file VALUES ('e99792f0-3ee1-4a97-9ba7-2e15b5258ff8', '2022-01-21 12:17:29.622338', '2022-01-21 12:17:29.622338', NULL, 'f0bf77c1-c960-4c9f-a7a0-e4b158f5a051', '9fa70ba2-4e8f-49b7-a9b8-8d47464550c1-02d.pdf', NULL, 'ca2257ea-4e0c-4091-8ae7-0f7a13f3052c', NULL, 'PENSION_ID');
INSERT INTO public.private_file VALUES ('57b1abb4-c820-4fa9-a553-41b3fd4ca765', '2022-01-21 12:58:45.434561', '2022-01-21 12:58:45.434561', NULL, 'f0bf77c1-c960-4c9f-a7a0-e4b158f5a051', '65bf19cf-554b-4486-82f0-904c4740b661-01_swtesting-introduction-1.pdf', NULL, '2ed9e0d0-7b3c-42e3-90dd-2a456740ca2d', NULL, 'ID');
INSERT INTO public.private_file VALUES ('fcb1779f-6f1d-4506-9fce-bc691d383de3', '2022-01-21 12:58:45.534153', '2022-01-21 12:58:45.534153', NULL, 'f0bf77c1-c960-4c9f-a7a0-e4b158f5a051', 'd0255ca9-4675-43c4-9460-4fa4a76cdf22-0a481630-e749-4002-8421-ea036a75fd8d-05_swtesting-tdd.pdf', NULL, '2ed9e0d0-7b3c-42e3-90dd-2a456740ca2d', NULL, 'SALARY');
INSERT INTO public.private_file VALUES ('2b53996b-053c-44c4-8199-0ef0bcadddb4', '2022-01-21 12:58:45.587989', '2022-01-21 12:58:45.587989', NULL, 'f0bf77c1-c960-4c9f-a7a0-e4b158f5a051', 'a1c2d63d-1b47-46ae-b050-0f8794b32cee-02d.pdf', NULL, '2ed9e0d0-7b3c-42e3-90dd-2a456740ca2d', NULL, 'PENSION');
INSERT INTO public.private_file VALUES ('74620c6f-3368-476c-9416-4221b7206654', '2022-01-21 12:58:45.662301', '2022-01-21 12:58:45.662301', NULL, 'f0bf77c1-c960-4c9f-a7a0-e4b158f5a051', '6030999f-0cb3-4e13-ac2b-fd9ca3a099b5-4e43861c-3a98-43f2-9c38-569f051b8d08-01_swtesting-introduction-1.pdf', NULL, '2ed9e0d0-7b3c-42e3-90dd-2a456740ca2d', NULL, 'LAST_YEAR_TAX');
INSERT INTO public.private_file VALUES ('91749621-4e34-42da-a850-73e7e7a64ae4', '2022-01-21 12:58:45.739721', '2022-01-21 12:58:45.739721', NULL, 'f0bf77c1-c960-4c9f-a7a0-e4b158f5a051', '09f64ac4-d939-455a-bf29-d31ca044f947-05_swtesting-testcodequality.pdf', NULL, '2ed9e0d0-7b3c-42e3-90dd-2a456740ca2d', NULL, 'PENSION_ID');
INSERT INTO public.private_file VALUES ('39772973-18a8-463e-ac9a-789eba7cdd30', '2022-01-21 12:58:45.788806', '2022-01-21 12:58:45.788806', NULL, 'f0bf77c1-c960-4c9f-a7a0-e4b158f5a051', 'e84d5e44-3182-4531-8ca5-e259675acfa1-02d.pdf', NULL, '2ed9e0d0-7b3c-42e3-90dd-2a456740ca2d', NULL, 'LAST_YEAR_SALARY');
INSERT INTO public.private_file VALUES ('389e7d21-4ad1-45e5-b0f8-17b4b80b7b9d', '2022-01-21 13:20:44.715952', '2022-01-21 13:20:44.715952', NULL, 'f0bf77c1-c960-4c9f-a7a0-e4b158f5a051', '7bd305d0-eb47-4946-b341-7c209d0dc605-Dossier_2ed9e0d0-7b3c-42e3-90dd-2a456740ca2d.pdf', NULL, '2ed9e0d0-7b3c-42e3-90dd-2a456740ca2d', NULL, 'NONE');
INSERT INTO public.private_file VALUES ('39a8270b-55fa-426f-8d0c-3284a24c9e6b', '2022-01-26 08:23:16.327842', '2022-01-26 08:23:16.327842', NULL, 'f0bf77c1-c960-4c9f-a7a0-e4b158f5a051', '11a2125d-2947-4d7b-8a90-ec368fc0cf9d-Dossier_41068ba4-31ef-4b08-a189-5c0d22852d7a.pdf', NULL, '41068ba4-31ef-4b08-a189-5c0d22852d7a', NULL, 'NONE');
INSERT INTO public.private_file VALUES ('3a8451f4-30ff-46c0-b8d9-c1b9857f0a68', '2022-01-27 12:26:02.456926', '2022-01-27 12:26:02.456926', NULL, 'f0bf77c1-c960-4c9f-a7a0-e4b158f5a051', '48102c15-2c22-47ec-a10e-e3f5b9e6713b-Dossier_b326c7e7-fb0d-4674-96f1-5b4ef5fbcb38.pdf', NULL, 'b326c7e7-fb0d-4674-96f1-5b4ef5fbcb38', NULL, 'NONE');


--
-- Data for Name: product; Type: TABLE DATA; Schema: public; Owner: db_user
--



--
-- Data for Name: public_file; Type: TABLE DATA; Schema: public; Owner: db_user
--



--
-- Data for Name: soi_admin; Type: TABLE DATA; Schema: public; Owner: db_user
--

INSERT INTO public.soi_admin VALUES ('53356416-d36d-4c07-b69e-7ff3929913b4', '2021-12-20 13:22:56.383689', '2021-12-20 13:22:56.383689', NULL, 'David', 'WyssAdmin', 'david.wyss@hotmail.ch', '12345678');


--
-- Data for Name: soi_employee; Type: TABLE DATA; Schema: public; Owner: db_user
--

INSERT INTO public.soi_employee VALUES ('2470f281-de67-4e8d-a7d8-ee44216f7cdd', '2021-12-20 17:05:57.244701', '2021-12-20 17:05:57.244701', NULL, 'DavidSoiEmp', 'Wyss', 'davidwyss97@gmail.com', '3142358739', '0786708847', 'Herr');
INSERT INTO public.soi_employee VALUES ('280144e3-c47a-4b0d-9447-46912c1b8e5a', '2021-12-21 07:21:17.874747', '2021-12-21 07:21:17.874747', NULL, 'Testerina', 'Testeroni', 'david.wyss@uzh.ch', '5294726129', '3847283578', 'Frau');


--
-- Data for Name: soiemployee; Type: TABLE DATA; Schema: public; Owner: db_user
--



--
-- Data for Name: typeorm_metadata; Type: TABLE DATA; Schema: public; Owner: db_user
--



--
-- Data for Name: user; Type: TABLE DATA; Schema: public; Owner: db_user
--

INSERT INTO public."user" VALUES ('SOI_ADMIN', '2a2ea527-cfc4-4b9f-aa4b-1a4aa3c034d6', '53356416-d36d-4c07-b69e-7ff3929913b4', '2021-12-20 13:23:01.944886', '2021-12-20 13:23:01.944886', NULL);
INSERT INTO public."user" VALUES ('COMPANY', '75ef8c23-f735-4e23-9652-d0011b7ecb47', '40640680-ff54-4917-b2d4-9d8e45acaa1c', '2021-12-21 07:21:17.905412', '2021-12-21 07:21:17.905412', NULL);
INSERT INTO public."user" VALUES ('COMPANY', '9679bd93-fa81-4f9a-ba03-104bc4b7b74b', '40640680-ff54-4917-b2d4-9d8e45acaa1c', '2021-12-22 07:20:26.275053', '2021-12-22 07:20:26.275053', NULL);
INSERT INTO public."user" VALUES ('EMPLOYEE', '5a3fb5c9-437b-4f7d-a054-20a7058259f0', 'f0bf77c1-c960-4c9f-a7a0-e4b158f5a051', '2021-12-22 07:22:58.740137', '2021-12-22 07:22:58.740137', NULL);
INSERT INTO public."user" VALUES ('BANK', '85b3b832-549b-4e0c-b408-abd07dce0340', '99295c95-e736-4fe4-a806-082e6db5fe4e', '2021-12-20 15:23:59.412375', '2021-12-20 15:23:59.412375', NULL);
INSERT INTO public."user" VALUES ('BANK', 'c029080a-95a0-495b-8126-5c87d7f9be51', '3de287e3-9b7b-41f1-b2a0-a90b183be66c', '2021-12-23 09:26:08.356472', '2021-12-23 09:26:08.356472', NULL);


--
-- Data for Name: value_development; Type: TABLE DATA; Schema: public; Owner: db_user
--

INSERT INTO public.value_development VALUES (100, 100.560247361504, 101.643684047596, 94.9522777670962, 100.517215817819, 101.248558719569, 101.192888086498, 104.284162290924, 104.842747174573, 103.085589685283, 105.249011892177, 107.506411816449, 108.843605902667, 111.878848722961, 112.930128571733, 113.448668034394, 115.494032852623, 117.338934322828, 119.91310675909, 120.203535532655, 122.850850902039, 123.499640676198, 126.541312034924, 130.677720788928, 135.317673208358, 139.863107793296, 142.077012905214, 147.907250932441, 150.30716639208, 158.138380737587, 155.57146047517, 159.188143602194, 162.20090413391, 164.896815463003, 165.786298013842, 168.39233882829, 169.720288821951, 170.993461729101, 174.502874252262, 178.860202586155, 185.193137223413, 186.995074815314, 191.755192507587, 192.589913178963, 203.430031620045, 205.704802602877, 213.266117641679, 215.017789165745, 223.218225040345, 229.25166049374, 234.447323951069, 233.62381418685, 235.432563735843, 234.565962899267, 237.51328048881, 236.187850691629, 238.296542767094, 238.724344486226, 237.488436592991, 239.639483737041, 242.391107697287, 238.98144208917, 240.07168628421, 238.105890873886, 237.393745524525, 234.200103071998, 234.979285333046, 234.612908944062, 236.822017041709, 240.696353095883, 244.150739801338, 255.28035293296, 260.335287810369, 264.547712442936, 266.76857840671, 270.568965288314, 275.924433489342, 279.405864947324, 281.029789080182, 284.487353431051, 288.593435955187, 290.86012250217, 293.232895626977, 298.83443141825, 303.589700731367, 308.068277687258, 313.471381000255, 'Z�rich                        ', '1');
INSERT INTO public.value_development VALUES (100, 99.7436157348133, 99.1998529130574, 96.1785413871725, 100.301644890562, 99.0871845274221, 99.148294799052, 100.170595308989, 101.16276718534, 98.8053638291138, 100.42925816096, 100.463635157356, 99.7553763942402, 103.389539913061, 104.355103124483, 105.342646337718, 107.182786237037, 107.600889179223, 108.628287499125, 109.449684552666, 111.379352402224, 111.794242130192, 113.357006768261, 114.813172838394, 117.65436351942, 119.848628040789, 120.774197225429, 123.571518741712, 124.51982569334, 127.509315207118, 126.086999953381, 129.538161060971, 131.842355693196, 133.711827760079, 133.977630319551, 135.831886094432, 137.505335541971, 136.726313826679, 136.810408982041, 138.68819715826, 142.329474226236, 143.714181381357, 147.710286371855, 148.685894453595, 154.311327985435, 155.746267412754, 159.928678060997, 157.771344610158, 162.845602440694, 163.232003525486, 165.593292898377, 166.578183862913, 169.494101059947, 171.675379954989, 173.857475429068, 177.003833595534, 179.914483953001, 182.649622364277, 184.245789964337, 185.890214575926, 188.707785641454, 187.761543143408, 189.559663892928, 190.838056804503, 194.304707749271, 190.318263030119, 188.786572367656, 189.099590759166, 189.286613261453, 191.889429729319, 195.556246049637, 199.646673871805, 203.327184072666, 206.273308145032, 210.594925300483, 212.030824485459, 213.190226865261, 213.976409081969, 213.982855429924, 213.541507568871, 216.189365356406, 218.662283629979, 222.880476645112, 229.037715256372, 232.99738228059, 237.468756880969, 242.135472975083, 'Glattal-Furttal               ', '2');
INSERT INTO public.value_development VALUES (100, 99.8024157987727, 100.138841113218, 98.0964911859973, 103.089165899033, 103.555917551264, 104.010099849005, 105.604916657717, 106.618395921301, 104.372599361236, 106.204033329451, 106.954800556432, 107.049091714088, 110.493687026864, 110.708940468066, 111.170855214158, 113.359437457156, 113.714408357384, 114.478422679307, 115.597286169168, 117.930132824685, 118.067416522554, 119.364980608883, 120.461325787816, 122.785673995813, 125.27579099767, 126.351162741582, 129.592697706676, 130.77083024149, 133.726826099474, 132.119927663446, 135.272679338088, 137.164742550168, 139.20103702908, 139.464734773786, 141.636529915697, 143.481076411044, 143.090400221605, 142.918903426406, 145.444541792856, 149.57529512438, 151.057789908576, 155.292131845114, 156.457432472817, 162.741312148909, 164.459981314542, 169.097634280797, 166.576214991087, 172.339233577947, 173.372559619303, 176.9294314503, 178.43149526574, 182.135294780574, 184.319776510911, 184.648351628657, 185.548547182964, 186.022598934041, 186.916934168809, 187.475079904315, 188.722342933488, 191.074611238514, 190.032566083097, 192.103302024926, 193.639534952725, 197.755775596428, 194.222426990295, 192.884448969594, 193.252955619682, 193.542811724445, 195.448868681315, 198.249742665099, 200.625805295618, 203.063721364205, 205.034760478572, 208.777651798703, 209.649742636809, 210.065136684663, 211.015446382311, 211.278528533676, 212.241245958753, 216.234510414977, 220.56826763903, 226.570228701018, 234.69895908317, 241.928200446812, 248.943404262326, 255.917689330824, 'Limmattal                     ', '3');
INSERT INTO public.value_development VALUES (100, 100.338340028583, 99.4785626982797, 96.2197296171176, 101.417455581306, 100.220100995539, 99.6879570349969, 100.670570574354, 101.271259668016, 98.7883114460719, 100.10893802522, 100.007988165222, 99.0013933673329, 103.290002907675, 104.606566541556, 105.343147946372, 108.307118077375, 110.258778963369, 111.556964854489, 112.984426100491, 115.124714533947, 116.681508023235, 118.534522823332, 119.873761370254, 122.33115797791, 124.135616659303, 125.309554253625, 129.129135968722, 130.597406635827, 133.485378306314, 131.739274355953, 134.693772122343, 136.648051466358, 138.844035162815, 138.988859314985, 139.958620425037, 141.116843652655, 139.678977433739, 139.709777678577, 142.33856615253, 147.683418782227, 150.3675054762, 154.936812180833, 156.408658560625, 161.430302176281, 162.461638975418, 165.545398976913, 162.648112074546, 167.919937974257, 169.962434966701, 173.683087788169, 175.501023856111, 179.329702456593, 180.558144364512, 182.596796626828, 183.820277942679, 184.913791100722, 185.707094938492, 186.041462442506, 188.295645693981, 192.255778114079, 192.519805104775, 194.144583044455, 195.484983714216, 197.986249682441, 192.621235745264, 191.125637989277, 192.251433642536, 192.122151996216, 193.013992403321, 195.788242984725, 198.00222030803, 200.808124176449, 203.65291552397, 206.012890125218, 207.077746858612, 206.77771898337, 206.729783657797, 207.111636265233, 208.372916823, 212.42855788224, 215.943784245888, 220.600989511256, 227.122305259432, 231.676583376414, 235.925915669854, 240.876388607023, 'Knonaueramt                   ', '4');
INSERT INTO public.value_development VALUES (100, 99.1477665708404, 98.5089146119615, 96.3086017937231, 100.744901696042, 100.977004403847, 101.772290386342, 103.88605610798, 105.213872172456, 104.225292186523, 106.521321427824, 107.176156528677, 107.237107091645, 110.817196395721, 111.342459093701, 113.190595120805, 114.882894989151, 115.614653304846, 117.219119221609, 118.928076765371, 121.066636725978, 122.336241808512, 124.181698243176, 126.050975025631, 129.034136693482, 132.091308558946, 133.487842071736, 137.78819773264, 139.117254075989, 143.21719900762, 142.504246597455, 146.678017929246, 149.865479623633, 153.143582072946, 154.882145249449, 157.984752437663, 160.943236368781, 161.661876121632, 162.410283917921, 165.559894180693, 170.162851485868, 171.169347254307, 175.326864116915, 176.632071526927, 184.077623989416, 186.414788413454, 191.82590312678, 188.519405507642, 194.194554803007, 194.967746240963, 198.21616454138, 198.796565784342, 203.278686650298, 204.506748911596, 204.781270666717, 206.990924426532, 208.298747486729, 210.075419643003, 211.293734831914, 213.350658248577, 216.662218152627, 216.55469569272, 218.042735388933, 219.054264884367, 221.593809181038, 215.901909897326, 215.343123038337, 214.540915373447, 215.634365507125, 219.277515840692, 223.183526194359, 226.300842985352, 228.744126751314, 230.823734985118, 233.846353642539, 235.727639544684, 238.384966162822, 239.694574137294, 239.757755900495, 241.283309414157, 243.527203717659, 248.376771644803, 254.739309031826, 262.188036450204, 267.767315101242, 273.353461897182, 277.813483006589, 'Zimmerberg                    ', '5');
INSERT INTO public.value_development VALUES (100, 99.1749412440411, 98.0390664616892, 95.7514668919171, 100.118719563107, 100.589837469152, 100.883283281496, 102.493232600514, 104.159410678637, 103.569640800884, 106.926250350661, 109.630820140705, 110.005288301457, 113.93921040214, 116.00491711301, 116.892896079835, 118.547358803562, 119.433925035795, 120.89970598792, 122.516463428331, 125.447310226351, 126.776053648226, 128.665649247482, 130.365954391956, 133.596985365712, 136.999096500227, 138.449851317371, 143.448122143698, 144.92849132671, 149.241194057135, 147.958986473965, 152.221503499598, 155.036093493519, 157.855163338658, 159.708040419237, 161.929320923834, 164.205261688842, 163.529931340269, 163.220067697556, 165.469429542956, 169.293736983926, 170.561045706599, 173.957826854037, 176.351682731496, 184.912309325816, 188.331591445117, 194.752139861483, 191.382422426593, 196.8958397772, 197.683871991565, 201.971120595762, 203.636678980493, 209.211353264668, 211.500423773395, 211.970785639832, 213.026813771816, 212.730909792578, 212.406969591446, 211.392640874431, 211.616852566231, 213.574443258737, 212.487212774447, 212.938051592084, 213.609189365325, 216.813795592538, 211.922792399999, 210.275626950742, 210.170691405477, 211.087891997526, 213.755399286085, 217.675840040947, 218.949368863872, 221.271183262922, 223.261495195426, 226.934893692197, 228.676779977336, 230.668752215904, 232.386702468587, 233.106461938244, 235.136157098525, 238.042177103603, 241.999902758515, 247.482927761432, 254.452811532252, 259.643028711649, 265.636322267563, 270.678732571423, 'Pfannenstiel                  ', '6');
INSERT INTO public.value_development VALUES (100, 100.414865552362, 99.7217212831957, 96.6100878468322, 100.713900709894, 100.691166557904, 100.775023693783, 101.945848420008, 101.990420898652, 99.7874458723047, 101.244592239149, 101.169512896154, 100.9541624749, 104.42117972904, 104.97808931344, 105.660889724973, 108.233170846345, 109.37584804404, 110.7902116187, 111.937704562341, 113.833201163093, 114.066249779061, 114.908290287593, 115.270531957737, 117.46523060763, 119.569472273791, 120.66376831905, 123.94340852233, 125.029494291622, 127.259060917153, 124.953631734382, 127.145443635384, 128.397902525612, 130.213140818081, 130.043044322809, 131.616819696399, 132.927213270967, 132.023921476368, 131.02013635039, 132.505873467228, 135.623353301479, 136.615529880473, 140.754721618185, 142.651258336271, 148.381792295301, 150.634291355619, 154.85429233091, 152.214558243977, 157.097856296303, 158.08906047457, 161.57841334972, 163.331138631196, 166.674973296921, 168.128576659872, 169.129866697252, 170.87423209338, 173.082975836365, 175.762566685993, 177.976998132067, 180.974075165881, 185.017015406018, 184.813662466939, 186.038591257083, 186.227013509787, 188.21747379162, 183.797232287939, 183.390150320063, 184.961667279637, 186.689129302512, 189.073866993106, 192.320588242615, 194.442131120092, 196.552920749529, 198.177960346938, 199.554238302914, 200.177141596153, 200.159057101979, 200.415523738756, 201.409133470741, 201.764530293367, 204.308282231265, 206.685120454271, 209.862170413265, 215.267393926168, 219.026277276198, 223.433110025312, 228.296457911082, 'Z�rcher Oberland              ', '7');
INSERT INTO public.value_development VALUES (100, 102.369034226611, 101.094369311006, 97.0971479157346, 101.340342062739, 100.063409728185, 100.122823529294, 101.124889554729, 101.325153696561, 99.1381865287642, 100.932942418542, 101.056997919425, 100.680572196935, 104.338849886935, 105.487780190078, 106.077802740574, 108.092898620995, 108.680235954293, 108.952515169385, 110.439007523698, 112.635780893712, 112.640931881272, 113.771591728011, 113.814021108393, 115.711408147441, 117.521500511937, 118.101887126225, 120.76072326685, 121.98615322711, 124.284174664583, 122.132902788376, 124.735850454223, 125.954748309903, 127.873351799546, 129.044358596142, 130.734303677616, 132.170714564213, 132.614830440296, 131.517860379944, 134.427833274403, 138.594116584243, 141.316172151556, 145.987707498693, 148.470586872309, 154.459319941693, 157.044988575861, 161.318907257798, 157.840666683966, 161.085581898238, 161.357417507828, 164.612551732329, 165.756367085012, 169.303656278568, 171.5068189354, 172.140702106484, 174.941698714484, 176.646476603485, 177.779685231112, 180.351841853138, 182.100381924923, 185.293729787422, 185.60910489145, 187.471294041462, 188.517498558432, 191.803481553889, 187.746116859259, 185.213551732666, 185.134510219371, 185.059794674975, 186.435640221397, 189.640863927553, 190.829763447675, 193.697963102154, 197.029059368953, 200.334388536548, 202.109297315267, 201.860688901026, 202.119109712016, 201.377354525585, 200.940547403523, 204.825596778784, 208.205436523376, 212.434219365145, 217.647603016949, 221.161457907806, 224.372001178625, 227.87152288742, 'Winterthur                    ', '8');
INSERT INTO public.value_development VALUES (100, 101.848645538556, 101.285992295459, 98.8015169952516, 102.767192444991, 103.575444285495, 102.894458570664, 103.226048558708, 103.211092142349, 101.03201763775, 103.044377175396, 102.902024436902, 101.461332708044, 106.156780599208, 106.308124808965, 106.621692662019, 108.335757419765, 106.920898785694, 107.90324479123, 109.322051602784, 111.8547507215, 112.141421859413, 111.946114270809, 111.481668269808, 112.582415211483, 113.466359043509, 113.285126904027, 114.936316614871, 115.315341098069, 117.055999108654, 115.113439673295, 117.428833937893, 118.989402256397, 120.629494567981, 120.690727436985, 121.464866832192, 122.199093540059, 120.497067320744, 119.08123391884, 120.697723408479, 123.809529200255, 124.750609733555, 127.798523879211, 129.396725662273, 134.199429923121, 135.671813250927, 138.674543628808, 135.765965680517, 139.456248975359, 140.406070198487, 143.557110312218, 144.482844198918, 146.209213640675, 147.362169810738, 147.96030128244, 147.973122444716, 148.605550399748, 148.681011203538, 149.455627412541, 152.089094247774, 155.040144188614, 155.322403346524, 155.818238444452, 155.968420943934, 157.698763463638, 153.511156968273, 152.868509937424, 152.850770934667, 153.646714433956, 153.770016652079, 155.364578536874, 155.140535229068, 155.771984342816, 157.701062484772, 159.376627068163, 159.841151922158, 160.452566489853, 161.465714912573, 162.494867212168, 164.505654638985, 168.677972452765, 173.174228417525, 179.598093542289, 185.999659873721, 190.270541048442, 193.40578201461, 197.241028901205, 'Weinland                      ', '9');
INSERT INTO public.value_development VALUES (100, 99.9922495012127, 99.6911437119315, 96.7403210956275, 101.529375599247, 101.44029663846, 101.590557658675, 102.972405806073, 103.273466787931, 100.9813709838, 101.402302901537, 100.826205514282, 99.7896738123281, 103.543114943083, 104.063226698662, 104.588000017436, 106.352043769421, 106.824802267738, 107.668248109322, 108.758274775937, 110.403730253922, 110.768246586985, 111.827557324699, 112.156204770057, 113.849149786092, 115.287632763674, 116.234327521025, 119.275875439779, 120.494675541654, 122.717499491751, 120.717082020254, 122.73613420067, 123.597791242813, 124.904641826047, 124.463018755676, 125.91881289325, 127.161992786558, 126.263064311233, 125.91070494982, 127.57476941836, 131.367690882804, 133.376524668703, 138.027902358249, 139.865026956974, 145.512378581911, 147.479745372814, 151.578214325824, 149.639128625322, 154.642551021109, 155.584528776782, 157.753224608142, 158.633695550798, 161.064913119027, 162.212349265865, 164.20467457119, 165.96808994896, 167.296708888138, 169.262266754768, 170.579262545857, 172.306259275216, 175.643212820101, 174.460937126931, 175.363463426057, 176.350314752441, 178.626608537379, 173.879875153, 171.829951262385, 172.045588348173, 171.978583149103, 173.680356844289, 176.743009591584, 178.567724468287, 180.818668430596, 182.232312380477, 184.802177362317, 186.774788535658, 188.23696459672, 189.947345028113, 191.079117581525, 192.51872953135, 195.749425727498, 199.734442729699, 204.481687464232, 209.87865733129, 213.810643246404, 217.789693778917, 222.327964903797, 'Z�rcher Unterland             ', '10');
INSERT INTO public.value_development VALUES (100, 98.8894502299019, 100.852732782378, 95.818879824637, 99.8719902892631, 100.865807357669, 101.10078587007, 102.587256830645, 103.03199496073, 100.024588138637, 100.977877336907, 99.6580387181668, 99.4921396100981, 102.184617860087, 102.715278859883, 104.35547866666, 106.286753148651, 108.67805259739, 109.267262131176, 108.396682148117, 110.640432960115, 109.487661441583, 111.670663511062, 113.037673187899, 115.703403829808, 118.141441354676, 118.526414651261, 122.74772451579, 124.133309544906, 128.120210724026, 125.781031064872, 126.553636982434, 126.817033650019, 127.60106246766, 127.060662050929, 129.163794540406, 130.133948521949, 130.66808192316, 130.994809019406, 131.479134776806, 133.929539557947, 133.699555726627, 135.85648412106, 135.739784229405, 140.894515638303, 140.862731498674, 145.868767203224, 146.44143385262, 150.377121122787, 152.905298250767, 154.03926247628, 153.431089951172, 156.10320005897, 155.378837430928, 158.001383943639, 157.834125364286, 158.345175774961, 161.121376269313, 163.642385218599, 166.033967969732, 169.02287792073, 166.329747936673, 166.410513862042, 166.830347918858, 167.279119286567, 164.913278828033, 162.344137815414, 161.265274823389, 161.747734260963, 163.28662016054, 166.545710656266, 172.183198004878, 174.536083549747, 175.049721368867, 176.974983298145, 179.708395895829, 181.421901922508, 183.139600988447, 184.069991724186, 183.883772072151, 184.880624535397, 184.730927693376, 186.840035998358, 189.146651200996, 192.291790402671, 195.273409118632, 197.591779320715, 'Bern                          ', '11');
INSERT INTO public.value_development VALUES (100, 100.771025938555, 101.204745535936, 99.2044039313104, 101.919175725429, 103.22255661907, 102.219915612433, 101.952003306188, 101.975959628284, 100.541517718305, 102.53726653744, 100.75981277956, 99.2185683214057, 103.669414804024, 104.340745449402, 105.8772500725, 107.349790183427, 106.340668278764, 108.132237773534, 109.350023012051, 111.867445439911, 111.6996956992, 112.070796557912, 111.028362375486, 111.969771706883, 113.153465950885, 112.372055007973, 115.733911690436, 116.543471856992, 118.604918499824, 116.64290205944, 116.876508688415, 117.43663987646, 118.437177812205, 118.225961438363, 119.179177645129, 119.829786838732, 118.737651670823, 117.008860556134, 117.418387409121, 119.216992482596, 119.172178460117, 120.806095225301, 121.828572014263, 125.749571611871, 125.866147101837, 129.716415546626, 127.047258056985, 128.979964647903, 129.476600279942, 130.746137145508, 130.481125437771, 132.656416066125, 132.774701481922, 133.859102651475, 133.304745646013, 133.747741490835, 135.004190996805, 137.286179268087, 141.067724722221, 144.113693793319, 144.239345953061, 144.401213668606, 145.306850294253, 146.595752114164, 143.97907765788, 142.321001383078, 141.097002983326, 141.861548138117, 142.687127021208, 146.146278199533, 149.136425319857, 150.220366824861, 152.053569597612, 153.900502816782, 155.152214188731, 155.546841206463, 155.911650744862, 156.579739053703, 156.017808928092, 156.83235318897, 156.325719378608, 158.53267865938, 160.607921047173, 163.114263712682, 165.494680280532, 167.27613628355, 'Erlach-Seeland                ', '12');
INSERT INTO public.value_development VALUES (100, 102.11252859213, 102.698748393041, 98.4851562698811, 102.414475846218, 102.516127615585, 101.758159044868, 101.756487721357, 101.40441150678, 98.0325966490704, 98.7422958203196, 98.1676496644126, 97.2001370226041, 99.7611229798798, 99.6427068230455, 100.812981494946, 102.218612944996, 103.4655545924, 104.330391711616, 104.684837947459, 106.724047536666, 105.459967234221, 106.360001968978, 105.723916161779, 107.55746621736, 109.2411410934, 109.334673718043, 112.881904762293, 114.568663862793, 117.576420725279, 116.219437230007, 117.266214482973, 117.333393536723, 117.205567830892, 117.642793643774, 118.701641834831, 119.741833967193, 119.909631785567, 118.604389660778, 119.395650947771, 121.556549984122, 122.752886758595, 124.616288354378, 124.892845715639, 128.575680746698, 128.28956008256, 132.455060548597, 130.075593395363, 131.720303224209, 132.260967128752, 133.294807982632, 133.469325383837, 137.515033671388, 138.794046611265, 140.592542968777, 141.679094328916, 142.062139700896, 143.411020598737, 145.372288412989, 146.71479221911, 149.008239104905, 148.339612042069, 148.824705349837, 150.357254937326, 153.151667700907, 151.933151592487, 150.280824295096, 149.606958670643, 150.304441185998, 151.434868843047, 155.649706519794, 156.060551494609, 157.498696862584, 158.146957417252, 159.914308598401, 161.225504395007, 161.407419243106, 162.619236777218, 163.528491653782, 163.626404643878, 165.123643219263, 165.410349943035, 167.589228446586, 169.302741053635, 171.763892487726, 173.324564822814, 175.493871438017, 'Biel/Bienne                   ', '13');
INSERT INTO public.value_development VALUES (100, 102.492959491708, 103.982597299633, 101.955509419253, 104.105938484189, 105.760135653774, 104.525225314575, 103.914214438692, 104.950644544587, 100.450079953981, 102.725398300592, 101.216694781504, 100.231853790313, 104.700197786228, 104.088404945585, 105.182054045811, 106.152271106319, 106.515461829559, 107.543368454142, 108.618156656577, 110.905790183723, 109.590865736791, 110.039383273817, 108.480516216794, 109.68550267711, 110.598805176245, 110.757883040298, 114.138989817043, 114.825796698685, 117.046746385488, 115.697222849699, 116.92981017431, 117.20233798796, 117.818303080659, 117.418555123004, 118.504594372482, 119.068796327298, 118.541234047508, 116.810523773662, 116.44205649666, 118.776205161145, 118.948721248553, 121.067656063462, 122.349973144412, 125.04664664396, 125.036434593368, 127.852465112838, 125.072119217073, 126.664676339045, 126.288334814514, 127.482519640802, 127.470525016981, 130.409291109601, 131.40686430396, 132.715632302118, 133.334764182847, 133.950677551129, 136.352193668316, 139.22266641797, 142.26418837358, 145.348423399566, 144.057062722991, 144.239951299392, 145.05682540352, 146.467488574923, 143.988609789575, 141.870463132242, 139.977338195811, 141.560182842621, 142.603344924143, 145.734236318345, 145.532476077767, 146.75211039144, 147.608465913768, 149.054796476351, 149.377030323667, 148.985166489623, 148.76203011962, 148.985457957807, 148.774324733279, 150.5154384894, 149.786197738332, 151.806136438599, 154.311372763322, 156.816696366218, 159.942489541178, 162.910324780398, 'Jura bernois                  ', '14');
INSERT INTO public.value_development VALUES (100, 101.781485104418, 102.782576963097, 100.491603466318, 102.757997417745, 103.915620246989, 102.461244815881, 102.071746766313, 102.556345990821, 99.7978557889482, 101.153558243903, 99.7997556228268, 98.3572933194568, 103.031166613585, 103.074553397137, 104.351063194591, 105.308921383155, 105.031326404349, 107.145853153128, 108.390269174299, 110.450446933765, 110.521447635207, 111.194059005167, 110.384896039623, 111.348405610789, 112.201330072992, 111.262036406558, 113.742722814358, 114.121483974697, 115.692886683187, 113.563827490409, 114.158208678661, 114.819431025508, 116.031446147998, 116.190698868573, 117.58179861173, 118.054735622443, 117.415664538362, 116.043472171232, 116.789193673694, 119.178425674501, 119.463718796644, 121.312077558843, 122.536528883786, 126.06404383723, 125.786863708002, 128.703849798284, 125.507883794046, 126.872716451266, 126.866222953087, 128.302198766652, 128.778663578152, 131.843746483413, 133.294292012087, 135.274978774401, 135.603325252524, 136.519283996091, 137.706002889992, 140.010514142743, 143.421244955114, 145.73691615393, 144.962153545766, 144.486533279009, 144.371249108724, 145.534728871439, 143.3495293266, 141.554209141305, 140.773301877362, 141.710989894559, 142.013709970452, 144.882751022629, 146.562738597503, 146.78156888226, 147.007640239188, 147.151185333888, 146.352362669214, 144.849265900528, 144.045573524861, 144.435973047682, 144.94709435129, 147.066156329771, 147.29716773362, 149.490873953164, 152.054938949431, 155.468262111924, 158.798143791089, 161.447245456261, 'Oberaargau                    ', '15');
INSERT INTO public.value_development VALUES (100, 100.876187856966, 101.267329382021, 99.4105278549081, 102.305982635088, 103.623328454079, 103.243675410974, 103.012662419164, 103.65322687596, 101.717575571479, 103.32712540796, 101.700339499992, 99.9281079228204, 104.067375135998, 103.739119146307, 104.848510156694, 104.920720421533, 103.517326988775, 105.069349607402, 105.931025687182, 108.397342768667, 107.934756874917, 108.023541997282, 107.062954993104, 108.436646216201, 110.008666058745, 109.679379364003, 113.175086981717, 114.436905720932, 117.211767672163, 115.561856553353, 115.867708848331, 116.57785240958, 117.144889137124, 117.098030302441, 118.238757232128, 119.078870126634, 118.172295445254, 116.737320727142, 117.206811537346, 118.536830003909, 118.017644137841, 118.664416225571, 118.755976994202, 122.302863806791, 121.805938057825, 125.562904732952, 123.302122483545, 125.372936416731, 126.317057689625, 128.386253151541, 128.90154834819, 131.922853240981, 133.042917469351, 134.340081750428, 134.176200022941, 134.962722188855, 136.174419436424, 138.215416949959, 141.583615922512, 143.503287048712, 143.036598567867, 142.891412993376, 143.346953860946, 144.47413807772, 141.524892497778, 139.636968982453, 138.052605054766, 138.351987304859, 138.002269082509, 139.720980294231, 140.444881653411, 140.208141795813, 141.107981597613, 142.803442130703, 143.864692846181, 144.632430534074, 145.381839634582, 146.877701074054, 147.004268354272, 148.149426185306, 148.359921010146, 150.259011764655, 152.721229553931, 155.646216788816, 158.236152404709, 160.143468710551, 'Burgdorf                      ', '16');
INSERT INTO public.value_development VALUES (100, 100.41862299921, 101.334501597918, 100.993871957799, 103.83517246237, 105.07995434948, 104.150716494094, 103.756314843273, 103.58095195317, 103.327359507608, 104.826874600254, 102.635828609339, 101.126949569191, 105.665610984529, 105.264517966322, 106.513188739805, 105.968820743051, 103.384505222398, 104.553762135135, 104.540481534356, 107.307968148859, 106.272864996158, 105.980010262031, 104.605991072613, 105.478936538732, 106.429754106515, 104.957041688686, 107.468122348037, 108.137676245453, 110.564569753101, 109.00548777199, 109.003253165108, 110.393501511511, 111.521533362122, 111.524902761015, 112.518322607588, 113.368188842193, 111.640326824545, 109.609697235041, 110.347855308605, 110.934584269366, 110.460465670072, 111.195092723999, 111.36997558277, 114.422343461708, 113.37793067383, 116.428629735205, 113.531440507353, 115.424471786197, 115.634948144176, 117.57868027078, 117.694523088156, 119.733692723927, 121.224218281547, 122.301185131687, 122.188638429768, 123.223935149128, 124.547369659957, 127.237283431822, 131.252843878776, 134.424073882374, 134.671890955661, 135.027666971935, 135.449190647627, 135.785466140429, 132.603078753022, 130.882584496699, 129.499825316691, 130.305749662271, 129.825263570389, 131.691421746062, 131.363966396643, 130.611867520444, 131.453292465041, 132.56590590374, 132.453262458981, 133.092890118524, 134.288633074115, 134.807594702193, 136.623110879438, 140.976860801725, 143.182846553369, 145.517510620297, 147.634509023022, 150.798763253167, 154.305772970746, 156.177366334129, 'Oberes Emmental               ', '17');
INSERT INTO public.value_development VALUES (100, 99.8473035013121, 101.225767808532, 98.4944391419859, 102.228296422051, 102.345494410192, 101.405541773924, 101.285087516763, 102.033495606187, 99.6568691229232, 100.789520359135, 99.0164971815223, 97.377118162708, 101.257744593743, 101.518602277219, 102.925990282273, 104.226869357159, 104.17099976895, 104.963556918328, 105.478785978583, 107.707045201333, 107.176715263826, 107.800413299715, 107.174435889084, 108.037001690585, 109.092580673337, 109.055472480305, 112.654665915757, 114.285500706541, 116.952883704859, 115.184248124578, 115.683566809135, 116.005796553639, 116.405030654502, 115.749669219687, 116.829697928518, 117.669603401938, 116.868410284615, 115.891444510211, 116.251837973169, 118.440486152759, 118.709693005555, 120.399420403142, 121.010622748345, 124.932592312067, 125.110089274172, 129.220303262897, 127.632021359409, 130.161295338644, 130.963817412732, 132.030497233021, 132.318298889526, 135.763448618243, 136.475237276365, 138.189241568164, 138.395930153681, 138.600239855992, 140.59061817174, 143.155280412018, 146.085296426718, 148.328244708843, 146.702901147119, 145.974462216863, 146.339759606192, 147.120181952918, 143.984639400412, 141.412428609142, 140.252192146582, 140.629915737968, 142.007945687158, 145.449600068575, 148.113818232188, 149.634359837663, 150.038479785656, 151.787838265965, 152.668869885735, 153.069670246186, 154.021525144323, 154.982206312161, 154.608257323826, 155.966795488243, 155.91442399564, 159.002237082193, 162.735266556929, 166.454860503395, 170.013734786739, 173.042865873071, 'Aaretal                       ', '18');
INSERT INTO public.value_development VALUES (100, 100.829504284217, 101.235546058164, 100.342055581617, 103.093017954244, 104.656448914256, 103.764585195584, 103.396937432826, 102.595468261026, 100.910184784832, 101.7784027705, 99.6604471327142, 97.7314423454898, 102.726606414922, 102.307115268918, 103.683904482452, 104.097123254611, 102.240073596847, 104.986941589957, 106.390601756313, 107.78860994543, 108.047911989549, 108.715592934656, 108.15182744298, 109.899874151588, 111.376434266988, 110.751905726872, 114.221294931234, 114.847947550995, 116.872512079259, 113.967312416819, 111.950339259061, 111.367642261213, 110.433042399274, 108.979908827749, 109.626218874442, 110.639760470267, 109.379387209875, 108.669638187393, 110.950482756464, 113.826831514469, 115.354376904516, 117.906961574891, 119.674349872923, 124.438649534893, 125.096539590815, 128.557509915225, 124.983697710867, 126.146512458096, 125.870849760246, 128.626254670309, 130.066216431105, 133.438612601453, 135.229519687387, 136.630729454225, 136.512711709644, 137.282479538708, 137.979692717963, 139.852219143094, 142.773185037282, 144.335577205004, 143.414920063802, 142.570409464116, 142.143026875363, 142.99479104349, 140.270868193105, 138.713817454118, 137.967127491551, 138.675782299585, 138.443438937227, 140.967785117894, 142.229387192623, 142.014673840655, 143.156231374205, 144.59515474487, 145.054618861924, 144.875635897047, 145.250494394699, 145.073204854384, 146.420269394108, 149.805538604635, 151.507098867022, 154.298786635847, 156.393944656611, 159.552162880061, 162.088056476931, 163.96069042004, 'Schwarzwasser                 ', '19');
INSERT INTO public.value_development VALUES (100, 101.014701054393, 101.886529504371, 98.2363008234766, 101.573543800576, 102.189396671005, 101.18663029966, 100.86099385457, 101.524446967342, 99.1934143646464, 100.326361955757, 99.7336631629681, 97.933560460142, 100.79600109483, 100.934474529792, 102.362203676835, 104.582106444347, 105.166617223108, 105.8006797786, 107.015610126148, 109.678339109151, 109.174183531837, 109.696868125109, 108.552215107917, 110.206522077067, 111.980819353061, 112.460022126564, 116.365435921453, 117.48083484131, 119.76712365992, 117.355370948883, 117.917237741211, 117.959086777164, 117.931008155628, 117.814694861689, 119.01372201611, 120.501790880904, 120.25500853678, 120.18089072356, 121.783144456998, 124.387663191899, 126.073589971921, 128.010365000055, 128.831388066983, 133.691638957684, 134.188519959114, 140.1471689864, 138.462486562825, 140.979358376241, 142.364026558557, 143.687999417456, 144.238671148033, 148.442432557287, 149.202739799014, 150.701415147114, 151.272278905743, 151.658766056388, 152.970446442946, 155.329469109508, 158.540191388744, 160.755789054627, 160.384094466311, 160.16346449585, 161.471202685432, 163.860217281499, 162.118316983702, 160.324295095332, 157.947149945687, 157.88928893089, 157.58270923799, 159.938217445386, 159.592085281385, 159.85372061148, 160.853801886861, 163.034060025905, 164.623898550836, 165.778993250008, 166.19726783028, 165.358399524632, 163.875512928286, 164.232877972516, 164.272759335978, 167.449690922149, 170.350709011295, 173.584344122525, 175.129855129533, 176.38528228388, 'Thun                          ', '20');
INSERT INTO public.value_development VALUES (100, 97.1570135305566, 96.5879885555489, 92.7952251473448, 94.9723567085044, 97.8622267368243, 96.6456492407399, 95.2741258236472, 96.9266591794858, 94.6883216087334, 96.1186415856042, 95.7527842202552, 92.5061646587552, 94.3823277929595, 95.1673966827081, 97.0382717827151, 99.2043576783489, 99.0614995092587, 99.6995639323044, 101.857284393577, 104.079688655734, 104.350440814268, 105.902910300541, 104.889619554738, 108.255687592828, 112.195373967785, 113.610383840697, 119.475896049012, 121.363831511576, 123.548811550674, 119.470097598812, 120.882261731846, 120.073271378589, 122.877637103968, 125.083890050343, 127.050409187343, 130.375820964418, 131.389662395184, 135.722372041475, 140.806370415156, 144.489209891379, 147.821106479165, 149.549008528614, 150.620244000483, 159.211550383141, 161.120187653312, 172.074341346332, 170.473262013937, 174.832905407573, 178.699616720788, 178.934543317916, 180.218304513958, 184.85222591191, 179.370809828197, 177.038036971257, 175.388309819944, 173.70220660039, 174.260441370604, 175.341433988507, 178.006639791093, 179.16704220423, 178.03464780234, 175.097300639539, 174.748364202719, 175.829026940038, 173.288432751363, 172.359072160882, 170.176830542392, 168.448495702005, 167.865311940946, 168.786046539446, 168.156817237616, 169.422396456407, 170.694552054465, 171.769896939752, 173.133436514305, 175.297326310442, 176.28613732926, 174.648863913975, 175.455596558559, 174.820918047443, 173.900920201586, 173.260247223341, 177.580482115632, 182.313610700452, 185.602871061979, 189.851566624152, 'Saanen-Obersimmental          ', '21');
INSERT INTO public.value_development VALUES (100, 98.8801164907931, 97.7825936446261, 94.3167409410871, 95.8379333394772, 98.034023364229, 97.4253826755193, 96.0060663613384, 97.4844112157234, 94.274299079024, 94.9075021408132, 93.8975260175701, 90.6417995599626, 93.5522852135894, 93.6290579908766, 96.5719508457418, 99.2041009048139, 100.043682591628, 100.054110486926, 100.899285238946, 103.222037931275, 102.457394392737, 103.309264222608, 101.840524649142, 104.495489625388, 107.597303276226, 109.004577340921, 114.646556560839, 117.431071105954, 120.391758639616, 117.959113419139, 119.673483322524, 118.72071446221, 119.879835148054, 119.530106746736, 119.133490702367, 121.540788321414, 120.093238226385, 121.215782178898, 123.192179623651, 125.055573652962, 126.595990932248, 127.914227529921, 128.975270473834, 134.474436401694, 133.902407262717, 138.254912856891, 133.918310892567, 135.066123116215, 136.989848485477, 138.887376959574, 141.811489653281, 147.027161549402, 145.434307117313, 145.74735192179, 145.530383063606, 144.593851334194, 144.559825420425, 145.028477021231, 145.831377878682, 146.605009946715, 146.006608572644, 145.677565329196, 147.131193225982, 149.730413551044, 147.990643122368, 146.537508563282, 145.489879873793, 146.371493979213, 147.973507369181, 152.197202849941, 154.308774615933, 156.183263253555, 157.68319378147, 157.125603734839, 157.162017994808, 157.357093120457, 157.437384251291, 158.238908319787, 160.548151795976, 161.644887179515, 162.602293096487, 162.979090467721, 166.388607872761, 169.400727468016, 171.358725866515, 175.12449649103, 'Kandertal                     ', '22');
INSERT INTO public.value_development VALUES (100, 98.9228516424159, 99.3458894839837, 96.2650765311758, 98.1525325361609, 100.512454194345, 99.4992602314019, 98.3909287136445, 100.415918256209, 96.4568257576415, 97.4119122854694, 96.6372187932949, 92.724583007544, 95.6542079203716, 95.9554294502109, 97.5587271905306, 99.7703360762341, 100.302758832155, 101.411192723717, 102.631369658153, 104.997366768122, 104.561363224274, 105.525492287009, 103.981322983085, 106.765369816727, 110.614239755139, 112.83719650321, 118.914384359547, 121.872749429733, 125.147545506513, 123.109779355137, 126.542200359228, 126.702120536252, 129.575702004085, 131.31425547132, 132.614043175579, 135.755313320386, 135.920574066856, 138.170782084598, 140.014567068924, 141.066454669979, 141.627693837437, 141.505596870442, 140.013517677, 144.721677310128, 143.02397583231, 148.141077655327, 144.132901947943, 145.124281738525, 146.480518870077, 146.215524206861, 147.872557768686, 152.785742437861, 150.867386946823, 151.944158768184, 152.734535743292, 152.883110959454, 154.930848374743, 157.159954504275, 160.162914156567, 162.441126836085, 161.80282770476, 160.753067924793, 162.384739788216, 165.188120404665, 163.448961663447, 162.506995904548, 159.878054286952, 159.566347269347, 160.488054300116, 163.308061177252, 163.324957351519, 165.205757251931, 167.249593505303, 168.286275296561, 169.89675285996, 171.037752160837, 170.823842784847, 169.525574023479, 170.200820244135, 169.373252468599, 170.044630002863, 172.427718422549, 177.014141375032, 182.869550712313, 186.496794905976, 191.357526718089, 'Oberland-Ost                  ', '23');
INSERT INTO public.value_development VALUES (100, 103.092850493307, 102.47618937023, 98.2581246676335, 99.9264534605083, 100.353828262391, 99.7337927106525, 101.44231263412, 103.150045752513, 101.220362669813, 103.104569097608, 99.8500288274129, 100.054714630039, 102.882349115474, 102.170274892132, 103.643006827917, 105.092586662481, 105.722053991436, 105.447120029313, 104.137669240986, 106.644624887262, 105.629672329925, 108.2439687923, 108.849589325033, 111.445150372188, 112.91908401903, 111.052264111329, 113.018551630822, 112.102164426906, 114.461425720234, 113.118223361636, 113.960376797006, 115.859377806279, 116.212452595841, 115.726914274442, 116.24442699711, 117.088145707975, 115.51220487754, 114.561390002093, 116.336196446814, 119.228673485382, 120.105491638491, 123.7447181676, 124.498245986817, 126.86830398807, 129.155024237998, 131.708175164255, 129.6613832316, 133.298066044655, 131.470695557681, 133.906593647446, 133.535118070421, 134.900122072562, 136.41867151898, 138.043802046452, 138.403791483814, 142.265169020311, 143.815948104072, 144.710513731652, 145.479086000677, 144.875795715697, 142.531758468392, 141.83864364164, 141.522872352108, 144.222939988628, 141.793941567007, 140.120075328578, 138.752149857596, 140.741232224953, 141.304478819819, 145.359708454428, 147.525760331676, 146.894979110202, 148.137863250118, 147.392447493999, 148.52396191394, 146.852334626557, 148.514063239138, 150.396878675652, 151.728599602566, 153.500984724113, 156.299669112781, 155.927832170137, 158.505657053503, 160.349361908104, 162.09684112759, 165.08334405875, 'Grenchen                      ', '24');
INSERT INTO public.value_development VALUES (99.9999999999999, 100.635212987354, 98.7832218849497, 94.850599606287, 96.2586853722594, 96.6970746890991, 97.3271224122352, 100.31688349873, 103.626037781488, 102.947901799214, 104.612937684374, 101.015583371788, 100.072050421566, 103.213608720343, 102.20539946418, 104.098090744841, 104.706272905038, 103.949461201728, 103.548193442016, 102.731579583675, 105.208855362125, 104.508844397174, 106.421585992577, 107.268034590063, 109.593186653435, 110.94801819892, 109.761407509629, 112.289220668505, 112.033938937547, 114.302384132929, 113.185673508608, 114.521981321915, 116.381295004359, 117.159088412763, 116.638829046892, 117.645392824114, 118.807403898406, 118.417905134968, 118.592707953368, 120.539033586958, 123.090493840831, 123.507312608738, 127.769818258839, 128.160576091742, 130.473701260177, 132.537528960027, 133.684909011754, 131.886000656284, 137.426073555305, 137.10509194197, 140.461723056624, 141.041774288366, 141.650045339874, 141.032674094393, 141.194818907068, 139.577765533061, 140.209938903617, 140.948059502993, 141.601125650291, 143.215371411214, 146.017509102959, 145.594629774465, 145.982690877467, 146.715869529659, 149.458034496167, 146.567859591232, 145.863611222654, 145.158116540675, 146.661828946196, 147.008294270193, 150.01972674405, 151.203580263102, 149.708597864722, 149.829977545643, 149.582682763556, 150.922390067802, 150.278408511206, 152.506052847913, 152.942786560306, 153.830788534382, 154.668721187203, 155.458461391693, 153.754351578762, 156.559856380095, 157.556273207865, 159.47310077275, 162.213257475549, 'Laufental                     ', '25');
INSERT INTO public.value_development VALUES (100, 98.7083715354922, 98.021618807158, 92.0647257636038, 95.6151414054509, 95.4919256791779, 97.3735581691021, 100.439292097698, 102.474446952672, 103.076046086034, 106.172062175257, 106.181350978705, 105.293310447361, 107.209977675661, 106.737293579695, 106.758172748253, 108.422917334065, 108.714759426237, 109.484615845678, 110.308097838001, 112.54802936592, 113.508659838776, 115.857335777681, 118.886568102403, 121.996953267656, 123.880096414406, 124.717906434023, 126.184390074167, 126.123645202799, 128.565158265042, 126.184780536217, 128.560165702561, 130.41930804217, 131.482337543486, 130.546682298445, 130.255864167902, 130.029162058596, 130.100941344678, 131.247440338421, 134.092054405267, 136.833388315071, 139.650697395318, 143.787830572244, 146.029403468823, 152.845263201494, 153.255345147661, 155.810631612596, 154.685928464156, 160.021500381621, 163.084500232465, 167.801953319679, 167.670364362429, 172.805522740076, 174.626832786278, 177.155312279412, 181.071488107817, 181.9469177914, 185.072772591022, 187.19783822407, 187.14109020793, 191.23733502916, 190.282860958548, 193.205402537107, 195.41629970454, 198.380245749786, 195.059615900183, 192.523709670329, 192.332022653379, 193.324706332511, 195.155689790243, 199.127403961411, 203.132861495815, 206.445441570526, 207.350912801992, 206.477462108504, 205.905761758261, 205.581692861536, 202.667566096988, 200.767145706136, 201.429658375573, 202.251821058477, 205.176720954486, 208.379939947121, 213.542872430121, 215.379368799797, 218.160950589593, 220.479108962098, 'Luzern                        ', '26');
INSERT INTO public.value_development VALUES (100, 98.2288525741574, 97.0380392740982, 92.5281436378184, 94.6401684121224, 94.8029975319036, 95.5445535144065, 97.494607305959, 98.9109087898625, 98.1807325382609, 102.117826068925, 101.210717839925, 99.5714451163184, 103.39374218584, 102.369674065406, 102.087005624195, 103.318616681788, 101.621938634578, 102.755752704877, 103.690624248461, 105.794807337525, 106.446073479475, 107.806050286852, 110.487642501203, 112.812048740648, 114.520084917188, 115.200911718362, 116.132733672213, 116.299959115189, 119.09072550383, 117.370154341418, 119.698089970678, 121.164399174851, 122.12839549227, 120.337981414678, 119.562789259301, 118.70113148362, 117.692474637043, 118.235913408416, 120.30523284468, 122.531143148713, 124.310754982968, 127.51048047124, 129.479511234487, 134.639414078347, 134.775128748884, 135.487835904389, 133.945886075343, 138.9986300039, 140.972374212756, 145.028758589203, 145.223119602912, 149.646158868122, 152.179537654512, 154.402984790269, 155.600157394631, 156.158750770086, 157.691874278866, 159.606735134119, 161.309483859469, 164.141467891336, 163.06171765376, 164.792267228342, 165.335198191358, 166.300561011013, 161.607998019639, 158.995503364587, 157.663604925199, 159.245963127551, 160.782053226969, 164.775055792837, 169.325456742243, 172.289846145146, 173.831742604421, 172.913773353445, 171.59198996211, 170.549967059081, 167.212693001491, 166.369299741463, 167.34799401038, 169.130568156826, 172.083034772288, 173.997948789719, 178.718666399145, 180.01232403556, 182.98026035922, 185.933203336338, 'Sursee-Seetal                 ', '27');
INSERT INTO public.value_development VALUES (100, 97.2630388610416, 95.4620648198251, 92.6701858512345, 94.7138600269056, 95.2387534090106, 95.0989863830528, 96.5310869363729, 97.3517854866049, 98.456287123674, 101.852597844385, 100.60563240625, 98.7429493921133, 103.606034743036, 102.754334480707, 103.131102174596, 104.566724615883, 101.188900586958, 103.832932578617, 106.232505994354, 107.67861949834, 108.97653314057, 109.95672276819, 112.253006696708, 114.280769904144, 115.778293181014, 115.9586709845, 116.51467148009, 116.0518880179, 118.575695104165, 116.353488137903, 117.412245414078, 119.243983495917, 119.921058348632, 117.74469824571, 116.531770504197, 115.781811385056, 113.903820368234, 114.324492800024, 117.446498737195, 118.43479945877, 119.839904448127, 121.633750183352, 121.915028027901, 126.25382522103, 125.15742034859, 125.601701110721, 123.223107929665, 126.599792191567, 127.189223092925, 130.697221537382, 130.028799131968, 132.209134282378, 134.265407478163, 135.907507598641, 137.611366983421, 138.465319043636, 139.945454419809, 140.947504291727, 141.698476477558, 144.587448582798, 144.181932761573, 146.495550344413, 147.912217977845, 148.662285970709, 144.446893495641, 142.826049599396, 142.318348845013, 144.64144132223, 146.175936170043, 149.250492811848, 151.671705811794, 152.981974581707, 154.028764427833, 153.175399857377, 150.925259023465, 150.368456057284, 147.899451323649, 147.738700464179, 149.194677546615, 150.481198428506, 153.259830179011, 154.802278517606, 159.027388197921, 160.784843471969, 163.935797990045, 167.073934823231, 'Willisau                      ', '28');
INSERT INTO public.value_development VALUES (100, 97.4179383240967, 95.6598148143898, 92.6913770505357, 94.8088022868588, 94.8091287886062, 96.5935005611957, 97.9069619719282, 97.5437876353871, 99.0164599413852, 101.813558170264, 100.119844511614, 97.884276182006, 103.223174548099, 102.624577583029, 102.54668559424, 103.493396273765, 99.5944279816021, 100.349285780141, 100.329188217861, 102.908351286779, 103.063259891967, 103.513463798273, 106.136756483819, 108.897119310444, 111.020627602394, 111.826479227242, 112.638452760092, 112.769616978044, 116.126970871699, 114.955603526236, 116.545142177244, 119.137719399416, 120.210463210117, 118.216241107152, 117.509749214898, 117.383845275118, 115.601296968836, 115.855935089415, 119.142976238758, 119.08855812945, 119.063842977843, 119.270899880911, 117.494211861047, 119.926517702451, 117.756729723938, 118.378144633675, 117.332980660337, 122.357086930813, 124.653126897885, 128.923799424241, 128.894001342847, 131.134618783179, 133.598492853682, 135.869876004229, 137.917472615957, 139.745188610294, 142.100344240788, 144.184373225625, 145.834256923961, 148.754494722257, 147.946084359964, 149.028842055036, 149.441092615475, 150.262487606562, 145.592361215, 144.221133868079, 143.162749295653, 144.183598243288, 144.038497474195, 146.334850209389, 147.37448049874, 148.219015287337, 149.484850293622, 148.655208430009, 146.123900619872, 144.763946581489, 141.519465227399, 138.131876977652, 139.442240299218, 142.361710048303, 146.833078065509, 148.010734261166, 149.924179268424, 151.712377763323, 153.131590502661, 154.701641116654, 'Entlebuch                     ', '29');
INSERT INTO public.value_development VALUES (100, 100.08516491246, 99.7992600077004, 93.6701252197854, 95.7541802953733, 96.3117309721575, 95.4030589086225, 96.1555421912462, 97.1668126468156, 94.7010841697694, 99.6917256792728, 98.10757130687, 96.4978745799762, 101.584523274527, 101.017608983533, 102.459924291603, 105.902514107795, 103.29712578556, 104.122967304412, 104.634787669311, 107.26451164106, 109.498985425715, 112.606661659819, 114.788720819262, 116.097871371129, 117.797100223221, 118.222847355207, 120.963417578711, 126.300740782201, 130.160500565467, 125.84736108122, 124.354332796215, 124.265175864901, 126.23624259138, 127.188887741677, 130.585051532647, 126.804276905439, 124.958226573656, 122.392025190533, 124.699771696495, 128.562358424322, 129.616437287656, 132.083877010548, 131.644178544504, 134.690842912188, 140.470713163509, 143.985637988726, 144.755590946248, 151.368631228067, 147.042331005458, 149.699611769239, 146.862947119452, 149.951643434445, 149.578408880181, 151.929580454155, 153.470892130869, 156.784420708981, 161.528631175873, 163.790546199483, 169.339217924561, 172.814456787722, 171.325565958456, 174.391617945869, 176.374428486118, 179.579046563537, 177.663210480622, 173.315779649935, 169.314774134194, 168.693984835141, 167.178750521623, 171.08750972845, 176.11941328485, 175.496087119568, 175.303555886765, 178.772678968579, 179.98807408215, 185.338169902797, 186.727474466451, 187.849872223391, 187.331555175962, 185.431103616431, 187.623367815541, 191.034448709951, 197.158548003799, 200.575266303336, 201.842410330048, 205.678073761368, 'Uri                           ', '30');
INSERT INTO public.value_development VALUES (100, 96.0792866723726, 99.0535458947326, 96.16535199125, 99.6481889030596, 102.96552143204, 100.461117296617, 101.642653848231, 102.802227486695, 101.394134691993, 106.006194169693, 105.974341223353, 104.567174808985, 106.021905416634, 105.316416097727, 105.034479899924, 106.788309845291, 108.368176263266, 111.408281698415, 112.115261576439, 114.386492102708, 115.469098925756, 116.209115261978, 117.073578223666, 119.85982785745, 123.100827313914, 124.439367767338, 129.755074105516, 129.623546621726, 131.439094399511, 128.87617923814, 132.042636422878, 134.921926080817, 135.769325706878, 137.21834545689, 138.256932996774, 139.609073820877, 139.48918570378, 139.993609496655, 142.689163931127, 146.630883794033, 147.802769725381, 151.990344561709, 153.759471629221, 160.996992650559, 162.045531281069, 165.93924546399, 161.983583646457, 165.957245306448, 169.204589730128, 172.729680119316, 174.331833712161, 178.303697583767, 180.078997956377, 182.284505710211, 185.37948447329, 188.018880361226, 192.040057960617, 191.803969360226, 192.577338142257, 196.516101031435, 195.254697802589, 199.299954508439, 201.329637606683, 205.300608970009, 197.974853283939, 195.43188239033, 190.228086700995, 191.854696045816, 192.991291481489, 194.70919341432, 195.360265927315, 194.754429103546, 196.572202135444, 196.687427018653, 197.195475661676, 198.568870083478, 196.807989359996, 195.196592248879, 195.937909593999, 200.137110874924, 202.825504130938, 206.091875827667, 209.661055382053, 211.555565154832, 216.796899981034, 220.297660418398, 'Innerschwyz                   ', '31');
INSERT INTO public.value_development VALUES (100, 96.685827239086, 100.600269287654, 98.6455657795028, 100.827242597103, 102.956404985567, 99.3893477215428, 100.690541750077, 100.873522204763, 100.126767609538, 105.568186150046, 105.934172570649, 107.083778975591, 108.903806214068, 109.294620991964, 109.33605078263, 111.483000515764, 112.463484746324, 115.321196045626, 115.648836546067, 116.721215044226, 116.892577911099, 117.552828328181, 118.547123925049, 121.926799555731, 125.380966174403, 125.682726516655, 131.567300908783, 131.603718457087, 133.826664035556, 131.422991823263, 132.883914165869, 135.961496744249, 135.402915722069, 136.280331012622, 137.156270521268, 137.63016503592, 137.136444648452, 137.547785037383, 142.036552668853, 148.329633502579, 148.494445404606, 152.203785039357, 153.300370169946, 156.794728744667, 157.602937333762, 159.519748337745, 155.246697743715, 161.275425659526, 165.17076498259, 171.187398784555, 173.174746701581, 176.91392799508, 181.148202640979, 183.469561106192, 186.116854473709, 189.521601136433, 191.70604295451, 190.348457085928, 190.724030993808, 193.078421703434, 190.666546912781, 193.645670689554, 193.681098109792, 197.246123903902, 188.831032149789, 186.539547494089, 180.791919496784, 183.364724067905, 183.944752451362, 184.863205867542, 183.934570291395, 181.24348471321, 183.927383405829, 185.847521618734, 186.917231677308, 188.813976560095, 186.559862227115, 185.920178220356, 184.880144477849, 187.681688470795, 189.886581210598, 192.84441782278, 196.350870216191, 200.238454838486, 205.565405041598, 208.699760877951, 'Einsiedeln                    ', '32');
INSERT INTO public.value_development VALUES (100, 94.3857333819301, 98.0209362916269, 95.4320909655689, 100.107224860631, 102.098925729005, 100.07043100179, 101.759456815827, 103.258888277938, 102.287304059035, 106.961723514411, 106.367010446034, 106.706770178607, 108.511388654532, 108.315791432023, 109.365929013756, 112.417050770362, 116.003187490855, 118.332187260616, 117.439423521838, 118.274096945697, 118.090929954178, 119.261078556291, 121.691358753157, 125.975246608731, 130.207952149393, 132.282324547792, 139.231779747807, 140.516957828759, 143.813458740246, 142.555802738231, 146.254253768587, 149.604318094497, 151.031216623293, 153.890735676548, 157.619018659846, 158.992214324097, 161.539229906013, 164.692113763252, 168.675626734299, 174.69280196637, 173.865761261401, 177.346686938491, 178.306454318002, 184.872865378842, 187.207814971196, 191.172251459128, 187.523028171816, 193.815465792559, 197.015920142626, 200.324772225468, 201.918838451486, 205.826136888002, 207.712758524188, 209.821021624395, 212.023151487356, 213.164442984924, 217.22416884731, 215.393251188129, 213.218035564854, 216.402876908984, 212.369903314727, 216.029592679773, 218.421324030114, 223.102080536676, 213.513968931043, 209.856952536065, 205.635513553206, 207.90388163426, 211.269049753637, 214.091319028238, 217.711436924972, 216.680426664392, 217.521035611777, 219.751799670172, 223.13770643265, 227.529342242163, 228.706772675619, 228.803726176434, 227.91610647098, 231.542369162264, 233.672250240147, 237.600462499045, 242.225178403664, 245.397491705527, 251.788189697434, 256.514263400085, 'March-H�fe                    ', '33');
INSERT INTO public.value_development VALUES (100, 99.5119891893218, 98.8871051104253, 93.1288349714111, 95.1254341758848, 96.7570142528867, 96.2501788496625, 96.9222128485906, 98.4528471292636, 96.4663867380173, 101.005262390851, 98.9421225083342, 97.0080934403053, 101.143446539065, 100.934860748105, 102.39475939842, 106.031808087441, 104.050883002089, 105.580724289104, 107.015974352107, 109.635622342217, 112.624038387148, 116.320278364447, 118.055643772158, 118.770741413299, 119.971264605861, 119.464350218504, 121.865753060062, 126.062366966632, 129.228937255398, 125.11764863674, 123.990888620987, 124.767537399989, 127.008631332732, 127.441132665313, 129.834076815787, 126.002483116025, 123.272342302531, 119.553241363522, 120.901195618395, 123.554022374457, 123.728021679245, 126.103419839842, 125.892295545913, 129.866473038748, 137.225381009069, 141.813744803974, 143.896846028614, 150.334819630846, 146.398735418861, 151.295978902721, 151.396974895848, 158.579196269896, 161.656324827486, 164.968948928397, 166.773684682686, 168.881719726029, 172.445132213584, 173.8517143307, 177.967925778366, 181.435626669307, 179.435159334583, 183.150864159978, 185.701418370584, 188.425269740449, 184.920888227685, 179.207932439517, 173.562910253864, 173.891625649705, 173.176452437349, 177.187706926121, 181.11669111332, 178.982236244631, 177.279279278653, 179.019045402314, 179.915840691568, 185.163333328485, 185.954713425693, 186.642604949081, 186.727107527868, 184.250283721582, 187.886283939252, 190.503801143448, 194.917216444479, 198.359989177796, 198.674323173139, 200.54658372823, 'Sarneraatal                   ', '34');
INSERT INTO public.value_development VALUES (100, 98.7053142329213, 98.0787417805545, 91.5848452045476, 94.7254867872121, 95.6406001749189, 95.2253513768654, 96.2125548528688, 98.1240345763674, 95.4496987271275, 100.20134517131, 99.6291055020356, 97.0433103976707, 100.362428579798, 100.715192510794, 102.823050416651, 107.665729448146, 106.553183050744, 107.744823687248, 109.126694838109, 111.621971917031, 114.402360439949, 117.526902701638, 118.975351765597, 119.981028342308, 121.566197790388, 122.366345485398, 125.621789838405, 131.033664842385, 135.176427027593, 130.140519241111, 128.749945338877, 128.13998135467, 129.694285929335, 130.704399455143, 133.550685280488, 130.450730321588, 127.738315048027, 125.091061929556, 126.777228918992, 130.727064962003, 132.835813924754, 135.590576347508, 135.858982636439, 140.888468385312, 147.889325898571, 153.58873771611, 155.468069405304, 161.617960065869, 157.132506343951, 160.008050352084, 158.688033640239, 164.972261646986, 165.431127301667, 168.327558250994, 169.329655474589, 170.171177509983, 172.140892243269, 171.580295480527, 174.208525594887, 177.239728535296, 176.541369648362, 181.036880693163, 184.815661186105, 188.419819099272, 186.101127854561, 180.419584613347, 176.328314933114, 177.010829852036, 176.73206900662, 181.871139432144, 186.640023555752, 185.208560769144, 184.404888695246, 188.263791982332, 190.071606436864, 195.764308543437, 196.588065195545, 197.211496515533, 197.852272130591, 197.379168113256, 201.558444186099, 203.804092417163, 210.551760604096, 213.238761086404, 214.906261168159, 218.194309845641, 'Nidwalden                     ', '35');
INSERT INTO public.value_development VALUES (100, 100.952224471247, 100.711509293591, 94.6446281918787, 96.4365429255099, 98.6843054759453, 98.280723141754, 100.749665702997, 101.890839073976, 98.4655284089799, 102.241934581375, 100.146880048996, 99.432565464736, 103.950913818031, 103.099121576793, 104.407945955469, 106.614422359014, 104.527715026883, 104.099314805429, 103.484870532485, 105.431767403057, 106.405112361746, 109.102654233078, 110.409460027547, 111.68266290096, 112.858627251758, 113.092320202201, 115.595975448324, 119.530693672858, 122.142197015476, 118.203935494845, 117.07802407357, 118.656600446353, 121.868787368934, 123.34553352492, 126.476896559465, 121.885417285048, 119.059954004523, 114.015528504354, 114.10562188694, 117.955369171528, 118.986695673465, 122.716558818489, 122.76437765156, 124.38072733389, 129.770455194245, 130.077467835096, 128.935503819195, 131.502502393473, 125.005135816531, 127.748693811315, 126.770961186773, 131.675965005713, 134.712646087823, 138.349781706523, 141.735446163696, 145.122522282906, 150.319937316721, 153.955050851617, 159.493283058786, 164.719934927282, 163.099894552735, 166.9962607599, 167.742163721974, 169.730282621177, 168.251847043258, 162.946706729786, 159.899781328039, 162.100524677039, 161.62685753248, 159.778976372047, 161.233259035158, 160.13241410643, 157.738156061386, 163.203063278363, 159.99619693597, 161.578740613945, 164.073896145966, 164.624911438747, 162.693608605104, 163.911175005193, 163.081066233173, 167.797015198707, 175.817960022171, 171.520380756009, 168.506739766727, 166.013932218273, 'Glarner Unterland             ', '36');
INSERT INTO public.value_development VALUES (100, 101.215400715296, 101.284360418396, 96.0880345553206, 96.4359258989742, 98.9972489899536, 96.9883872022982, 97.7193537287964, 98.1260598765364, 92.577331046563, 96.3725371969951, 94.6399097429506, 94.727942671237, 101.092789971226, 100.887104339817, 103.123164985138, 106.726497877293, 105.397010466962, 105.78138152524, 106.662607313534, 109.228291942995, 110.515279078232, 112.862900966569, 113.448929745977, 114.358413993101, 114.896678614776, 115.382695217333, 117.484181981872, 122.043882691709, 125.104850924335, 121.203806547259, 120.081468502803, 119.908354792322, 122.028616911994, 123.208660013599, 126.358097461289, 121.748755101193, 119.777945120265, 114.610470956218, 114.090998065461, 117.845835635931, 118.68285635542, 121.7004063273, 120.982454847976, 121.392771816355, 125.677317097412, 125.229554250611, 123.593144525857, 125.874347160736, 119.535917709606, 122.731910521983, 121.227711020726, 123.933188627117, 124.29217338934, 124.078547855311, 124.923844818528, 124.80237274116, 126.554274082779, 125.620966715537, 126.395766815351, 130.395677404382, 129.765925111646, 136.104667344393, 140.720241674783, 144.827699462986, 145.90421953939, 143.163360918459, 141.798547092006, 146.200267887172, 149.416405534589, 151.691862795418, 154.730899045743, 157.894018126289, 155.473855137932, 159.969781720411, 156.363480621879, 156.477856347989, 157.823208610858, 153.009889906492, 149.663806017009, 146.698648218566, 145.730648740647, 151.97539196, 164.079887280481, 165.839108772233, 166.970131009546, 171.89890242747, 'Glarner Hinterland            ', '37');
INSERT INTO public.value_development VALUES (100, 99.7774435119863, 99.5632993190555, 96.6685977143491, 101.124202007373, 101.160002819368, 101.606504324232, 103.199108387629, 103.510542799866, 102.106280297335, 103.746514292331, 104.689869994175, 104.799348885766, 107.1916986475, 108.323313766126, 108.770055885135, 110.641526166361, 111.981806520828, 114.257186243578, 115.903224731598, 118.463220965734, 119.996731574553, 121.662450010818, 123.159778358977, 125.961821650219, 128.361201085338, 128.998254559747, 132.554700676188, 133.072404588935, 136.302655124278, 134.522442998009, 137.663044616354, 139.911430512122, 142.404753698449, 143.76814225702, 146.4205982636, 148.526735071964, 149.296024393317, 149.830336262852, 153.545848891051, 157.198177284563, 158.573641619836, 162.151968062709, 162.340107405265, 169.308771774635, 171.385956271888, 177.177680443423, 175.020943241084, 181.618418383607, 184.116663194094, 189.253096902585, 191.739496516285, 198.831931415856, 199.391622468742, 202.588252888196, 205.239704196135, 204.426978074992, 204.977923436642, 206.242548639448, 206.225565772128, 211.035722744922, 214.862898278075, 217.980722141567, 222.124482792995, 226.160587376364, 220.615816423353, 222.139160421765, 224.920246833925, 227.339865680165, 229.096915557065, 232.103487200336, 230.992606232239, 232.616019418358, 231.937997167463, 239.611967324369, 240.614339931468, 244.887440156248, 246.294958821091, 247.991127467331, 247.388512310664, 253.755645915769, 258.370694480424, 258.663008496672, 264.602574721928, 268.848525474835, 271.505926511257, 276.607534086992, 'Zug                           ', '38');
INSERT INTO public.value_development VALUES (100, 99.6547819185445, 97.5581365712163, 93.4055366487249, 97.0068120719389, 96.9625137611436, 98.1550657114464, 97.4954328266304, 98.4555308582746, 96.1136396671117, 98.2149419506772, 98.5955147168412, 97.9810179595257, 100.827088092495, 101.298227073699, 101.403581177492, 101.940063019788, 102.291994622388, 103.186712995441, 103.471578036605, 105.035064810034, 103.814123674141, 105.901701887041, 107.453461673031, 109.892751168107, 112.828327508767, 112.786445260872, 114.900771678207, 116.166550223716, 120.226885749313, 119.760584277891, 121.457609310201, 120.678451045167, 119.176956354681, 119.243338066879, 120.608890314061, 122.241904425791, 123.065462225353, 122.564885933309, 123.710315444427, 126.838775494458, 129.005832086782, 131.124369493451, 133.753971465965, 139.599230743316, 139.691972361276, 144.826108592122, 140.839515505889, 144.533031504358, 145.553925747548, 149.310140824284, 151.561277149125, 156.020721134275, 158.469635240047, 161.163464530136, 165.339973734858, 166.621128886607, 167.321701018423, 170.122328220982, 168.966999665846, 173.833415679879, 171.290519669428, 172.092968104397, 170.885742208635, 173.809931564552, 170.075697149058, 168.391915408789, 167.379248208198, 166.998451887126, 169.257607746673, 171.657167897646, 173.956701816233, 176.825763654713, 177.670871595172, 179.967680558483, 179.650117545048, 179.582872402586, 181.467834034905, 183.114046990735, 184.874955837172, 188.959339946569, 190.757755219026, 193.044293360012, 197.806335991789, 200.368921928966, 203.478404532639, 208.189539357159, 'La Sarine                     ', '39');
INSERT INTO public.value_development VALUES (100, 99.0770661594207, 97.6524818034102, 95.2941327782546, 96.9207695574171, 97.7602484052508, 98.0703302844385, 96.6382699560795, 97.9701400186596, 95.8585103727894, 97.9481967716191, 97.8202526671464, 97.0031125644031, 101.07647836192, 101.092565262938, 101.428406399198, 102.651377141846, 102.627143434349, 103.052584778461, 103.57991417837, 105.502189254787, 105.277356755524, 107.432904005642, 109.131635281231, 111.345247233927, 113.949625968471, 113.91202390603, 116.280136095214, 117.270178722314, 121.092341262919, 120.44763294637, 122.226203730628, 122.742052180969, 123.384145589817, 124.230800997389, 126.315356566347, 127.55424775482, 127.650302203392, 126.868458374882, 128.519091787003, 131.424709873028, 132.456698130463, 134.831952577616, 137.914063869398, 145.028038355978, 146.580075918545, 152.385389802419, 149.256934088927, 154.114385235055, 155.494445679965, 159.929375497979, 161.299948228304, 164.858995330673, 167.638237316037, 170.531260299837, 174.223257080918, 176.612950047827, 177.390523307538, 180.071978192433, 180.442220642871, 185.157314274778, 182.105190130548, 182.733059842158, 180.935282491254, 183.679709617207, 178.943275173387, 177.404445197534, 174.852185995186, 174.487909358565, 175.828896315733, 178.260399807651, 182.494823859876, 184.353844071959, 185.695587905253, 186.779645626723, 185.418535547735, 184.827490435064, 185.182926146886, 186.046385723876, 185.658663245265, 186.879701835184, 186.557562553114, 188.328246996893, 192.286000991191, 193.765760590334, 195.962296514165, 198.660723565701, 'La Gruy�re                    ', '40');
INSERT INTO public.value_development VALUES (100, 98.8543714590165, 97.2293849523637, 94.0985417702604, 97.1401819848777, 98.4067145987216, 99.7328603474509, 98.7903486538474, 100.301496430812, 98.098470741319, 100.417470313956, 99.9179068796378, 99.1538757244686, 102.221277438774, 102.62581676985, 103.480214936934, 105.703631502895, 105.94485687063, 106.625153836128, 105.827696809032, 108.255719606536, 107.405109606508, 109.012550164481, 110.495580800977, 112.310467920048, 114.624244974185, 114.942554929458, 116.958055687544, 117.723202550591, 120.315653107918, 118.780573650633, 120.270499193007, 118.764823139992, 118.317842561947, 117.737837378575, 118.300062421345, 119.194519588823, 118.843221890513, 117.225607691194, 116.770625764726, 119.445606608065, 120.434092515138, 123.363650749887, 126.60976563014, 133.241234670917, 134.297612631612, 138.821187440627, 136.109447929342, 139.212738817997, 139.308757042926, 140.833111529636, 140.7309926052, 142.505238584021, 143.053799495849, 144.829273827166, 147.19809860752, 147.731343381358, 148.112851346533, 150.661440304445, 150.516443810583, 154.802937725098, 152.163345078992, 152.494189843714, 151.23043440999, 154.294491120233, 150.504458814659, 149.096274206568, 148.192900538158, 148.393839611052, 149.770699694501, 151.418116345791, 153.93513652739, 155.392793412687, 154.969572482693, 156.611518401169, 156.467894175531, 156.464147242026, 157.56504790869, 158.271360831328, 159.045169357645, 161.542584748018, 161.965865958392, 163.958802802707, 167.046686293887, 167.497285311265, 169.617208812133, 172.755691191202, 'Sense                         ', '41');
INSERT INTO public.value_development VALUES (100, 99.0579936600219, 98.9846037848182, 96.2958228776158, 98.9326885433425, 100.272458408856, 99.7001965407397, 99.2434898946897, 100.115295328649, 99.2309369273938, 101.444807795908, 99.9964885216728, 98.7112555155325, 102.43420221146, 102.61589054455, 103.693002735467, 105.467713413065, 104.219568060524, 105.369764353429, 105.665417997955, 108.455894360813, 108.103192844006, 109.055242121467, 110.077741069256, 112.162819771729, 114.537936723073, 114.773118952096, 117.988172575205, 119.110324202232, 122.036158736628, 120.196267497964, 120.876458737857, 120.780496251293, 121.388124429334, 121.756495243589, 123.096942715494, 124.311038563806, 123.779699002559, 122.896161078558, 124.004017858213, 126.286004171124, 127.049759782881, 129.201387011892, 131.221884376291, 137.156842108294, 138.135333190801, 142.549873343846, 140.145753334555, 144.163455989225, 145.033675492639, 147.999958140003, 148.162754250982, 150.993611495239, 152.248200299147, 153.598163422725, 155.09462262783, 155.454865759126, 155.796401600703, 157.603409049509, 159.013043758, 162.796723820635, 161.274699808474, 161.919189177687, 161.407718696982, 163.616795095867, 159.250866711234, 157.244313040166, 154.55217161797, 154.545090559494, 155.657850589563, 158.002413339027, 160.174010098882, 161.278523715034, 162.020577548097, 163.417606264282, 164.081404703684, 164.61151113372, 164.882748086828, 165.666392657836, 166.654824922953, 168.94338714869, 169.630895299179, 171.395027423127, 174.220170498375, 176.694601538055, 179.994732369235, 183.537289551374, 'Murten/Morat                  ', '42');
INSERT INTO public.value_development VALUES (99.9999999999998, 98.3151708387765, 96.8120833163702, 95.7581003221006, 98.3978561329264, 99.7014273497915, 100.541560349653, 99.3206732603057, 100.376358103875, 99.0834617300628, 101.199649076719, 100.248440505642, 99.0736166479795, 103.481955010708, 104.655344235722, 105.90687863678, 107.989330760916, 106.48690605228, 107.16047401729, 106.620222250714, 109.120489609588, 108.720606719512, 111.079590775169, 113.822438008009, 116.300463919934, 119.15198813457, 118.374702581935, 119.766402395074, 120.762473586763, 124.711249061722, 124.688723401941, 126.739641879842, 126.19422991661, 126.069695990082, 125.543281119029, 127.20612842442, 128.342942853188, 128.867780533246, 129.100978787132, 131.715602555983, 135.172374179844, 136.164361754791, 138.423192788994, 140.880870842763, 147.898784956973, 149.164428841158, 154.809414132214, 152.575244464156, 159.128277552389, 161.188223200974, 165.802393904847, 167.510893625139, 170.846099542921, 173.483431528578, 176.509328018765, 180.835043209421, 182.905044763669, 184.050742056696, 187.798676169136, 188.141818963518, 192.932842047038, 189.3811601439, 189.256034289186, 187.420371758223, 189.885184964801, 184.964262689189, 183.978926574732, 181.98972433583, 181.468405380911, 183.408339157669, 184.855805482164, 189.246431321078, 191.691122965942, 191.840963595853, 193.624713333879, 191.81703397704, 190.188423787836, 189.746814611359, 189.21912926583, 190.626355243044, 194.10299862251, 193.685857413187, 195.103433445874, 199.681242202626, 202.468957638741, 205.933013621518, 210.034206458242, 'Gl�ne-Veveyse                 ', '43');
INSERT INTO public.value_development VALUES (100, 103.699478922282, 101.491449103733, 96.7657049756071, 97.3659945225672, 97.2340653543205, 97.7607290509441, 100.631226637503, 103.145773075568, 100.688689095792, 102.411816379343, 98.4403326174281, 96.8159109769497, 99.9684322096398, 97.6516921048755, 99.3317561721352, 99.7416261027666, 99.2149205535735, 99.2454674570095, 99.3533304224451, 101.362227698111, 100.857446070519, 103.970219682998, 104.569360963926, 107.67220054218, 109.370642543233, 108.00328991899, 109.761360111256, 107.8247169183, 109.679701132346, 107.869605847347, 108.763275510784, 112.028968156427, 113.168872329245, 113.767105213503, 113.889690505889, 115.688119507258, 113.115330693444, 111.156590135204, 112.62465260751, 114.190501895445, 114.765349991463, 118.592151312705, 117.687133226964, 119.013716503276, 121.886343237829, 123.825002195614, 123.26166491506, 128.960141341163, 128.489843685866, 133.263037351735, 134.928019634183, 136.886194291357, 138.513187321007, 139.89855393982, 139.353576138199, 141.396177417315, 142.193626699108, 142.606040485566, 144.193462649155, 146.31709210485, 145.920488663128, 146.129066926348, 147.06511775779, 149.958804311997, 147.454691893375, 146.038566602023, 142.94953463168, 144.796113601097, 144.302494455827, 148.504805167034, 149.462888501543, 147.357300456829, 148.506866171503, 147.107136099474, 147.818617973706, 145.360521267503, 148.848612001872, 150.298475682555, 153.020447767977, 156.112200139256, 160.465931819155, 157.853851560875, 160.923673353457, 161.611415494624, 162.271632765989, 165.312056171578, 'Olten                         ', '44');
INSERT INTO public.value_development VALUES (100, 103.715036063806, 100.458560329407, 97.4474882486714, 95.5385769326505, 96.7794079966288, 96.845899241583, 99.0974965266907, 102.384489495128, 101.994611521713, 104.735014244334, 99.6588033577047, 99.0156207186897, 103.160389259246, 101.09116249422, 103.196248183424, 102.875027987446, 99.7838775528623, 99.545578757035, 98.8999551963511, 100.7908221365, 99.7816061750436, 102.154459509822, 103.377310043777, 106.746091413898, 108.590527258314, 106.055689365775, 105.83007771801, 102.738461628156, 103.965310081247, 102.830904382174, 103.695990561271, 107.223525159933, 108.745786180493, 108.994168120571, 109.370593369323, 110.435821747969, 107.834776797225, 106.943278170362, 109.937957135769, 112.72430651079, 114.174957172299, 118.942179707417, 119.47633740405, 121.108544824651, 124.084973223506, 124.90211172826, 123.336895999231, 129.041940609724, 128.058899269635, 132.208664281637, 132.355221529701, 131.977641768096, 132.55611268236, 133.175779229445, 131.763979416915, 133.273950745206, 132.151433969376, 132.21580805596, 134.086523609036, 136.635955684906, 137.565235300065, 138.19076732712, 139.154346190443, 141.014245401375, 137.700345944979, 136.72317561516, 134.100987621986, 137.936180249115, 139.081967860109, 143.650877026166, 144.579055254043, 141.842830522796, 141.944955621506, 139.071728762435, 138.647131819171, 134.182182409241, 134.878288255618, 133.769160878563, 134.776439507756, 136.398875602393, 139.33170707122, 135.441551619945, 137.840375550926, 138.252781177147, 140.818339226139, 146.020850351844, 'Thal                          ', '45');
INSERT INTO public.value_development VALUES (99.9999999999998, 103.503367233399, 100.208289845671, 95.422279838934, 95.8237691407716, 95.3990082677316, 95.5133431100538, 98.2969767410316, 100.507669523369, 98.5423275121433, 100.24077223631, 96.2128492270404, 94.515305401658, 97.319037188151, 94.9325996030886, 96.8397853564796, 97.093107692128, 95.455723256584, 96.098426482342, 95.7530938853797, 97.6479594145458, 97.3184176206308, 100.284512891692, 101.186245881457, 104.210551382942, 105.917867894536, 104.475186990051, 106.063936505394, 104.554648890035, 106.850803954279, 105.77311667226, 106.542402249034, 109.457222791959, 110.485479806799, 111.055900929586, 112.02403142862, 113.819634204405, 112.356576277971, 111.376024638763, 113.369186893501, 114.274970610244, 114.234693243613, 117.345043924416, 116.032326840187, 117.215738535147, 118.961525893201, 118.945589088318, 116.484240668896, 120.417813375969, 119.211677112009, 123.153390560508, 124.397699964837, 125.786879962501, 127.411102273826, 129.146653205793, 128.867320645915, 130.860142158163, 131.008103025009, 131.335605070283, 132.719060917392, 134.441210971388, 134.298241530431, 134.606112034741, 135.412700110399, 138.615917354526, 137.186338984784, 136.35252405085, 135.102298598284, 138.081099016559, 138.595935388003, 143.404136484242, 145.442140362424, 143.368615860421, 144.147167887471, 142.209444820791, 142.389195355705, 139.442697023539, 142.173788500436, 143.582130475322, 145.688137995616, 148.212727911263, 151.217888625853, 147.838351923363, 150.253743530744, 150.897691768741, 152.386739832801, 156.753930951478, 'Solothurn                     ', '46');
INSERT INTO public.value_development VALUES (100, 100.820408590313, 101.751880601314, 95.6586138038213, 99.4754234639649, 100.94110071915, 101.189478129047, 103.890837388229, 104.231576687921, 101.773929200869, 102.82031754439, 102.62087189859, 101.216120185663, 104.155237840401, 104.595468055983, 105.40753578207, 108.107448358144, 109.81586937853, 112.363809904264, 112.869920229439, 115.164103189101, 114.876499864202, 116.217888413797, 118.044836495806, 121.014033708648, 124.024912818375, 124.64645802594, 129.643017229508, 131.684197654682, 136.689702333636, 134.658770288133, 137.158819361749, 138.521069700402, 138.331912358318, 136.739376613122, 137.770322329039, 138.063597759852, 139.394576208445, 138.988281816494, 138.497894110889, 141.637881126242, 142.240651617877, 147.114789894121, 149.861891505012, 157.079251048874, 156.950225635382, 160.699904070888, 161.107911798482, 166.143055983548, 169.681871018452, 173.45794308995, 175.327037151544, 176.343613275687, 179.51627246683, 183.916320340813, 187.285303762326, 192.047842393547, 193.381357747091, 195.438523991663, 194.704363188546, 199.289498316222, 200.476435035201, 200.28256224629, 204.065049978146, 209.105454588265, 201.589059146218, 201.603863621743, 201.086126717527, 201.943437985016, 204.650320312551, 205.511045544576, 207.002305848072, 208.832867310971, 210.166298474001, 211.154664998985, 214.014494738979, 218.026407466162, 220.178286554488, 223.79381430002, 225.331219314895, 230.265597692046, 231.525421426784, 231.973212962838, 234.167974822864, 236.69839954445, 239.97268255992, 241.867899473771, 'Basel-Stadt                   ', '47');
INSERT INTO public.value_development VALUES (100, 98.8598302772053, 98.6134464314745, 95.5185572410726, 99.1917378352752, 100.036014540479, 99.9080087774668, 101.862837435956, 103.04983361101, 102.270996410109, 103.749244264888, 103.259568432945, 101.519210684479, 104.787984548949, 105.870660570797, 106.743745578773, 108.842241306068, 109.751654740149, 111.707306489437, 112.97889629596, 115.466752099756, 115.905861388906, 116.255997223079, 116.384334077484, 118.177740343322, 120.058379809499, 120.224372828726, 125.203828120093, 127.464501373871, 130.971677121297, 130.553089187232, 133.568976402512, 135.199666172797, 135.474530654531, 134.65523238299, 136.416901652365, 137.723458344591, 139.457949727699, 138.821178393255, 138.632736493486, 140.952544617074, 141.25405212186, 145.654098192395, 148.348319705018, 153.347946950342, 152.7290551733, 154.843452444231, 150.95481927656, 154.990622982926, 155.570664349827, 158.506142803829, 158.41408599946, 159.882406427709, 159.417325754376, 160.078327058578, 160.710206226152, 163.514302758539, 166.49902941951, 168.06287307335, 170.185518634163, 171.860442931854, 171.719669349393, 173.52221223753, 173.223972953614, 177.435267787322, 173.574937844173, 172.535300956336, 173.645057283953, 174.566842646934, 176.65751459699, 179.657157198933, 183.182701142581, 182.997323878659, 183.554358442785, 186.358721953571, 187.375100595431, 191.251484993776, 192.24632262437, 193.073409330649, 193.792901003494, 192.732141435299, 193.083876139691, 194.133703024643, 195.851851668819, 197.915407005578, 201.355305778426, 204.096005704257, 'Unteres Baselbiet             ', '48');
INSERT INTO public.value_development VALUES (100, 100.355093464925, 100.692862489474, 97.6476213104128, 101.34505168355, 101.926921723887, 101.734678539063, 103.299190071077, 103.755254561337, 102.140594036453, 103.085213727256, 101.842273852937, 99.4605341063598, 103.759094176986, 104.644653992322, 105.72667351452, 109.110283627439, 109.059998982079, 110.406738282588, 111.30891528288, 114.16612890111, 114.391285846687, 114.51262450604, 114.206959654701, 115.529926437928, 117.060581944123, 117.094905945588, 121.687198183493, 123.931414774562, 126.707889366504, 125.807343231348, 128.366469286821, 129.759781993061, 129.408561217401, 127.977324751214, 128.985242463749, 129.732202691732, 130.578208702468, 129.885092926161, 129.729441738772, 132.099899048002, 132.49768187689, 136.382636766133, 138.087289139207, 141.664980698693, 140.089048490377, 141.454784339953, 138.015708268527, 142.139867127512, 142.797597851628, 144.653752339974, 143.505643514606, 143.36065257224, 142.002484218746, 142.152094021464, 141.655888579403, 142.981545106502, 144.584150364311, 145.670859353897, 147.569273571567, 149.113635727723, 148.983707461066, 151.142722150636, 151.687780360936, 155.648005518097, 152.173399528056, 151.56038200111, 151.912702966524, 153.053890636689, 153.829455447809, 155.503239707026, 155.557007578057, 154.629106730894, 155.088295586745, 157.594325482648, 158.383637120506, 161.614523461616, 163.131572356985, 164.967173785118, 166.726886541103, 166.659701206155, 166.001362168092, 165.802943920548, 166.268357906984, 167.950184067989, 171.278619116052, 174.519019873483, 'Oberes Baselbiet              ', '49');
INSERT INTO public.value_development VALUES (100, 102.075772340402, 103.282684194538, 97.0202817416274, 102.36360340361, 101.995806266512, 98.8511427738805, 101.494347492833, 103.658976256467, 103.741998313917, 107.955903376564, 104.913079464561, 104.135015587614, 107.163315242217, 111.634772347102, 116.006394072821, 118.451427543189, 119.462587680613, 118.935755073561, 118.509962509251, 119.166172757455, 116.841703193602, 115.192317003669, 114.429450883641, 115.395603309768, 116.792438985301, 117.293454958822, 117.882439626096, 118.299618841238, 120.888475886306, 119.786683987263, 120.1012829731, 119.617933399703, 124.197376524754, 124.860560915222, 133.509174017744, 134.500695104771, 131.787403698294, 131.571217739616, 132.25435257988, 133.348650250488, 137.390550134916, 140.846236717134, 140.17250532272, 145.172175561358, 142.729758165784, 146.189125423648, 143.031954450097, 142.615903882396, 143.952678314002, 141.73149125289, 141.950932921971, 148.3372733658, 149.794601937288, 150.798980833692, 154.115692340047, 156.834554125133, 157.598241759318, 161.662928074954, 161.53630968625, 162.677531903667, 162.875516521662, 164.741840487105, 168.893154116131, 166.030527413757, 166.382114947894, 161.461951995601, 158.841487631144, 161.918069318691, 162.784224955891, 166.610652732617, 169.677288795805, 166.345346849593, 173.091795975396, 176.056951384835, 180.272160757969, 185.565236124867, 187.623763368363, 187.947037114485, 184.96755591695, 184.72464395571, 186.445922970046, 186.519125784064, 195.213496124084, 193.697180085605, 192.432189085494, 193.301569323724, 'Schaffhausen                  ', '50');
INSERT INTO public.value_development VALUES (100, 101.284517935788, 94.4757071815527, 107.539164992898, 113.29461021178, 110.401990341272, 109.79026708031, 108.441734258251, 97.5356486301354, 104.64710085782, 104.872082558906, 103.48475645349, 107.552575318102, 108.55609223112, 110.042643632045, 113.17561785831, 110.370999585278, 113.045921142335, 113.647610351203, 115.709268118168, 125.418798497713, 125.364095055487, 125.413376846162, 125.226295259254, 123.73882028188, 125.020544212028, 125.494272298836, 128.387954882221, 131.657375213943, 135.676271169684, 135.095464246775, 138.112943235498, 141.499588075537, 143.496025040774, 141.467034547419, 141.994450325921, 138.385362404423, 137.395098660434, 135.670087380542, 135.243696988324, 136.175902900278, 131.793192794395, 137.19474434097, 138.575824395791, 143.984616226616, 146.001747618846, 147.994768420491, 148.470982697646, 155.19176113267, 155.245329496843, 160.607128925158, 162.499320225218, 161.026234042942, 162.654573537638, 168.62551032711, 165.94640491029, 169.255215768, 173.458674198051, 174.154800572768, 177.987472562012, 187.853936195348, 189.571619660514, 191.967256279474, 200.427070232389, 201.265197872172, 194.971227783266, 196.240644157312, 189.983836277081, 189.898071317818, 192.37182004036, 195.358710162657, 200.100940846178, 203.714003150152, 204.646093387379, 203.807494804139, 202.044682178525, 203.281994070743, 204.95877484223, 202.417207072252, 204.227793233447, 202.444809783404, 204.167911203837, 209.959686285442, 213.306716256703, 216.925780652937, 222.19032041351, 224.767037700397, 'Appenzell A.Rh.               ', '51');
INSERT INTO public.value_development VALUES (100, 100.622578161577, 93.3374443543009, 107.197480821482, 112.471961950791, 108.938983801639, 108.320658022525, 106.886912296059, 94.7461879761809, 103.502983362231, 103.562600788468, 101.717225474656, 106.287198271829, 109.377089141934, 111.429314346209, 114.979286870394, 112.192742777709, 112.255916967557, 112.67153686618, 115.412923696324, 125.485704035137, 126.703687686444, 127.012802348514, 127.509250441604, 126.26878540309, 128.201878483429, 128.831727756413, 133.02115683317, 136.389571426157, 141.546869061251, 140.993489498079, 142.646593359174, 147.184060674057, 149.962306948526, 148.638845658739, 150.215144120668, 146.804103568231, 146.505356020885, 146.529213969186, 149.73032581519, 152.672231323581, 150.467509969639, 158.156581454433, 160.89029109341, 168.662503446888, 170.158947297302, 172.873369858339, 172.103597891894, 181.203999960075, 183.396501278792, 191.366056823019, 192.229937931533, 188.449784458848, 187.753272998338, 192.58218154955, 189.048143119172, 193.415967353212, 197.326904457397, 196.274794046452, 199.469825559391, 208.083332055916, 209.825936104623, 211.359855561917, 219.914482638674, 218.631235617223, 210.092483440501, 213.116264925142, 207.637913300479, 209.676526987361, 213.83707484479, 217.142684948914, 223.360612140204, 225.109675392163, 225.957172625015, 223.896213585079, 221.064989247056, 223.06956104643, 226.213851162207, 224.204866436637, 229.739609453706, 227.577471871952, 229.781752161041, 233.090092034018, 238.434348041243, 244.861524433083, 252.109450076205, 256.238022999579, 'Appenzell I.Rh.               ', '52');
INSERT INTO public.value_development VALUES (100, 100.723778577714, 99.4940666371316, 94.4543321509863, 98.0215626235535, 98.9695205514393, 98.6387433643242, 101.454757392777, 102.104011379716, 99.7495285657522, 99.8087812168699, 99.4557365141212, 98.0722183323107, 101.774471809848, 103.257242581498, 103.636938257484, 105.739236964311, 106.742722447426, 107.50698231812, 109.779199982453, 111.163466376844, 111.367145879181, 113.024186588023, 113.16079642739, 115.358980698501, 116.758153858895, 117.419360076712, 121.05096209595, 121.628004361546, 123.372555614106, 120.417156435001, 120.220105170392, 120.387887264209, 122.413529875696, 122.705692464688, 123.193722841863, 124.437119127222, 123.302778565348, 124.169029741032, 127.956038746341, 131.06226500734, 132.660783515106, 134.444651490669, 134.107107103376, 138.491306653312, 139.557985715217, 143.374241448051, 140.395475025891, 145.351439010608, 146.592801864496, 149.660152959354, 149.070357722465, 152.299744195023, 153.14706136999, 156.924057224465, 161.53672647612, 165.433465104611, 170.418334636622, 173.963962577373, 175.71783813698, 180.750926478514, 180.899527148195, 183.339954714382, 186.359932671981, 190.241987804083, 184.982685507473, 181.621779885222, 179.17890421663, 179.103459458625, 180.553461332435, 183.44090140587, 184.948259340325, 184.063969872229, 182.085121645464, 181.99783252322, 182.221808479606, 181.716169846153, 184.195552692922, 184.505238019861, 184.184657028202, 187.507181775097, 189.770046140999, 192.628906147636, 199.708517992714, 203.515194813656, 208.354057260836, 213.149058105012, 'St.Gallen                     ', '53');
INSERT INTO public.value_development VALUES (100, 100.448221907306, 100.004613518477, 94.932567236427, 98.348794296962, 99.8968667432178, 100.3674041833, 103.285993410242, 104.085135871354, 101.27421358818, 102.484087053316, 101.895357007089, 99.5668711370145, 103.676169723014, 105.129507161162, 104.797950532995, 105.80035640016, 105.849572139922, 106.183984216507, 108.714700957189, 110.371847476772, 111.336731768948, 113.675453739422, 114.14635984592, 117.075690404613, 118.612132515054, 119.202797546986, 123.29126468542, 123.439595156506, 125.122704825667, 122.725665774527, 123.435988801961, 124.669887822035, 127.181089195126, 127.476799432343, 128.221151720351, 129.220661389516, 127.466800408501, 128.226098625531, 130.414775083903, 131.500523481802, 131.425838371038, 133.199525782642, 133.271227679363, 137.865528505624, 138.250458118235, 140.973568476347, 138.180062657026, 142.611346226223, 144.317711243539, 147.66442839554, 147.200476901812, 149.992264811273, 149.885409543238, 152.360793033025, 154.028368774482, 157.025809054373, 161.15915559253, 163.379750432428, 165.682557859493, 171.276783097509, 171.70773712784, 175.734557139464, 180.273961715263, 184.402372611756, 179.31957205174, 176.80236331671, 173.972158907186, 173.704347640742, 173.811741463138, 174.910394303544, 175.623047948999, 174.109435622609, 173.17226773319, 173.85914361594, 173.871681620969, 173.953862399655, 175.375191403548, 175.58454224273, 175.331471987864, 177.9254259424, 179.995495456788, 182.973153102968, 189.379004574186, 193.404157043885, 199.624208033751, 205.458794409644, 'Rheintal                      ', '54');
INSERT INTO public.value_development VALUES (100, 99.9188344821471, 100.058625815763, 95.5247684862389, 98.1889459276539, 100.121271277724, 99.5576863607769, 102.065198090491, 102.690775629827, 100.628372656196, 101.456169396, 100.929876371459, 99.4883596246667, 103.148801889815, 105.702606643977, 105.607186294691, 107.692744806711, 107.085916573118, 107.89148430256, 110.656436820236, 111.83506333193, 112.133382808881, 113.932243623172, 113.984611337236, 116.908438046598, 118.366623356867, 118.220659227611, 121.979484791725, 121.389201728104, 123.222544109837, 121.18972129737, 122.012712726208, 124.342773714487, 128.013150013766, 129.812901256595, 131.680054807101, 132.530862391848, 131.592712412165, 133.666192362849, 137.085528074147, 138.564961704706, 137.924811815687, 138.546656024839, 137.090447572912, 140.456944973664, 140.58037580686, 142.60690367398, 139.371617784132, 143.550991554164, 143.928232237019, 146.801334082583, 146.378500874322, 149.581999067353, 150.940971439252, 154.737447477766, 157.978546740553, 161.609054616333, 166.126413100991, 168.139775708092, 169.26432148228, 173.789129914137, 172.832352134171, 175.326144961346, 178.291916281282, 179.946150222988, 173.507785543568, 169.568600353338, 165.68639731326, 166.312290348492, 167.583325426368, 170.471404436475, 174.01507996829, 175.139154482731, 176.635326246018, 179.130786759512, 181.35057628331, 182.961370843153, 187.023766058238, 190.830960941153, 192.345574452577, 196.683330927989, 198.640263780361, 199.663166880306, 205.880492137498, 208.084894958407, 213.29942635388, 216.406694610058, 'Werdenberg                    ', '55');
INSERT INTO public.value_development VALUES (100, 98.59278532535, 97.142814835077, 93.4954887397088, 94.3446494027705, 97.5582346406598, 96.686706024883, 99.0283343210466, 99.890907360406, 97.2035312746336, 98.3365509485209, 97.8383982168939, 95.6358789808205, 99.0926022800471, 100.419204881821, 100.675140309371, 102.477322095561, 102.325931530717, 103.247568352765, 106.449605243206, 108.298492309759, 108.804205970776, 110.200246203031, 109.774287839289, 112.402626007864, 114.013568312501, 114.547774210332, 118.48452242049, 117.507239872968, 118.794096193856, 116.131151156004, 117.05909261707, 118.733069666279, 122.278805639735, 123.380767296881, 123.567222068508, 124.768366149046, 122.420517120962, 123.215440796127, 125.362258935909, 126.633574470501, 127.105115077302, 128.473248095974, 128.29575480594, 132.315701860341, 132.949850166939, 135.489420963024, 132.202651699686, 136.140642401042, 136.81833005766, 140.080715746474, 140.789846616618, 144.976705358207, 146.271126322317, 148.711091568585, 151.632449505632, 154.037341595094, 158.180564808361, 160.391335871521, 161.70596495853, 165.986297992947, 164.890877851215, 166.636439912619, 169.773690604914, 172.314276542179, 167.558960519161, 166.342145613411, 163.002436432075, 164.108745049752, 165.66423584753, 166.570818081284, 166.837523001978, 166.151093740715, 164.844677385172, 164.208280570299, 163.971523904539, 163.288640832473, 164.111899117145, 164.983520895865, 165.903824576046, 168.807554867466, 171.697535644966, 173.315293728074, 178.145545260695, 179.7025710702, 184.046914988046, 187.367642113712, 'Sarganserland                 ', '56');
INSERT INTO public.value_development VALUES (100, 98.8349359958173, 98.0544013337996, 93.7014899620498, 95.5181411355517, 98.9489934222034, 97.3436380566, 99.9909613664476, 101.725767678239, 101.099370982476, 103.307355559402, 102.719633377273, 102.817456008652, 105.589706645629, 108.141287241066, 107.99298552753, 108.968791987607, 108.321307904078, 108.460744999307, 110.032461038067, 112.955760442017, 113.850780864659, 116.273940738256, 117.39125431521, 120.46194622773, 122.029048184296, 121.155137902113, 125.629220701991, 124.274730555067, 126.484436443036, 125.41557998868, 125.805824109352, 128.023975052698, 131.30907064602, 131.363305289058, 131.61967962874, 132.659926848112, 130.899547676562, 133.160439248944, 137.996035585776, 141.438237998957, 142.853133982622, 145.315864139391, 145.987071918955, 151.646302760044, 154.036688660616, 157.551005773002, 154.309773377221, 160.007570790477, 161.39325928597, 165.902772250354, 165.366202080108, 169.36517992394, 169.952918805204, 172.998806108553, 176.685010041044, 181.521075029522, 187.133032065468, 190.004456461188, 192.461971429913, 197.057677181793, 195.357555615068, 196.471147028091, 198.805822682226, 201.221924467712, 195.437281153066, 194.551817895178, 189.889482448297, 189.02187474376, 189.712467332233, 190.225905762432, 192.253673700649, 190.982806520042, 188.856852239208, 186.765112370642, 186.843525397133, 186.749189141149, 187.966713697232, 190.12883007615, 190.09930078207, 193.024185054494, 195.729167968212, 197.285744325001, 203.352016080379, 205.538137059502, 210.495700443652, 214.5841033197, 'Linthgebiet                   ', '57');
INSERT INTO public.value_development VALUES (100, 98.8328185094456, 96.8703131241313, 93.4917589104012, 94.9246075678621, 97.483269789769, 97.0224751023507, 98.2909853919683, 98.4863623315038, 95.2267445515383, 95.382995520214, 94.2543352842074, 91.56311858574, 96.5599150195452, 98.5569443930968, 98.8313137674465, 100.840928482209, 99.6430459788476, 99.6421453440438, 101.862163382668, 103.32482932027, 103.125039069634, 103.967173440276, 103.188369164724, 105.112243371991, 106.128675088032, 105.934458823874, 108.438160553017, 107.707780189982, 108.464253496713, 105.706279191174, 106.159367773549, 107.346690130068, 110.382531814167, 111.235371322182, 111.748926816426, 113.230352024945, 111.09770158762, 112.514886457099, 115.888882000061, 117.316183102946, 117.828327590848, 119.310251220525, 118.987288342564, 123.067484644706, 123.455812684027, 126.220288131234, 123.247136242064, 126.835045896001, 127.57982809146, 129.492599888291, 129.258351526185, 131.157121041574, 130.990893414146, 133.152148671868, 135.657640260886, 138.657302526044, 142.685793725805, 145.540911980285, 147.419599182696, 150.847214619558, 149.481275263258, 150.243309194858, 152.292984402906, 154.820771870707, 149.518333186608, 147.101908433506, 142.797122912936, 141.4819647543, 140.195541325555, 141.118820879539, 140.649864732802, 141.193498570663, 142.814066062884, 144.546165872766, 145.244801685087, 145.980301858345, 147.378049499518, 147.817650062183, 149.272273010518, 152.458519197038, 155.738863362435, 157.883886821008, 162.574720893615, 164.247795553094, 167.6424614079, 170.960106763872, 'Toggenburg                    ', '58');
INSERT INTO public.value_development VALUES (100, 100.219569143497, 99.8891130881157, 95.0283292964549, 98.7430988080817, 98.2130327263903, 98.5221735813221, 101.074292617158, 100.420700679742, 98.3125238975637, 98.9227505985672, 98.2274542254589, 97.5048428400088, 101.839819362073, 104.208436694075, 104.831132803172, 107.45579271203, 107.238703602986, 107.26853626568, 107.855853099209, 109.897864368063, 109.489734091617, 110.558889529676, 110.41602096793, 112.377652354579, 113.3603855467, 112.889744708953, 115.233374907058, 114.687758675069, 116.076407933946, 113.832232335174, 114.496844926455, 114.963760725754, 116.038504348724, 115.913939797019, 116.99279891971, 118.443245175748, 117.615290545666, 118.281155414252, 120.815941072132, 122.353764624996, 122.833049363575, 123.924640247867, 122.895968546612, 126.710037415848, 127.411032677875, 130.887937281654, 129.446090606871, 134.176776319492, 135.711971898875, 138.807393764991, 139.400925019718, 142.477994680004, 143.510964551735, 145.68044643824, 147.694364220796, 150.664630947519, 154.082331415315, 157.211976238345, 159.089750702363, 163.50029261277, 163.760883339346, 166.973920098194, 170.927180550565, 174.340756454737, 169.984431594839, 167.542998068017, 165.62333192563, 164.446096401902, 164.489755549292, 165.519262677951, 166.855803168203, 167.44189436247, 166.823919788732, 168.549995449297, 168.819216482176, 169.324151342798, 172.018689445994, 172.422857211277, 172.222587459479, 175.142767954515, 176.78743900548, 179.492084591817, 185.443527896882, 186.903430355881, 189.990571031367, 192.728988696086, 'Wil                           ', '59');
INSERT INTO public.value_development VALUES (100, 102.362389008491, 104.730139173824, 98.2379956744569, 105.690808886104, 103.018136816757, 102.070270286571, 104.186115124851, 104.282532621316, 102.488763027975, 104.447552296621, 104.423552620216, 105.619011950989, 109.674481744019, 109.442294355076, 107.481301682083, 107.452736667009, 106.656504580476, 108.059986156275, 108.347972270181, 108.837571421698, 107.981344763016, 108.282992496671, 110.446463160114, 113.216873390609, 114.911297811683, 116.531051370603, 119.515777522531, 121.121782342027, 124.98173394203, 123.438690927035, 122.165782468436, 124.265025221773, 125.055337783767, 124.64488487444, 127.723715196497, 126.977261627136, 125.769403090814, 125.444139572246, 126.883410194334, 131.03489093121, 134.038968553957, 137.727730297578, 138.938957422213, 143.801664534325, 142.334915200682, 145.595175846904, 145.637037253782, 149.906181517761, 151.860943577134, 155.713218873559, 154.881324038315, 159.239695359694, 161.260583084777, 163.985089642204, 168.104764321668, 170.557091462678, 174.219019545562, 175.72845464655, 173.59469272965, 177.917111303106, 176.211606161331, 181.058487656572, 185.482331192723, 187.06886406762, 184.067015350288, 180.872731680404, 177.968622513331, 180.342780867141, 180.130293507516, 182.778782670439, 181.98722454021, 179.823380615954, 180.316657576023, 184.357154511828, 183.378495179316, 187.774240516524, 189.089929758106, 187.716213016141, 187.857085071304, 189.052880006984, 187.587219196976, 192.594584283072, 196.847652710621, 197.498660428863, 201.702445224414, 203.94304650355, 'Chur                          ', '60');
INSERT INTO public.value_development VALUES (100, 98.6578778336825, 98.1966918726788, 92.7760446777745, 95.8863985450245, 95.0527660874101, 93.5519838643202, 94.5029214326651, 95.2681711470793, 92.1824550393248, 93.8618850025299, 93.415729338874, 91.1333373797786, 95.111481023472, 95.5296577403017, 95.2669395511349, 97.6818789058244, 98.1793963251554, 100.160761808799, 101.7672570689, 102.099501546525, 102.646140547768, 103.545188988135, 105.118669777522, 107.537398033833, 109.972971196987, 110.745918125202, 112.876487295777, 112.179922991869, 113.4446482942, 111.084943590211, 111.822538881321, 113.796833408667, 116.345838649345, 115.142396889285, 115.624565629432, 116.033375665, 113.920724110903, 116.234999442427, 118.644631978441, 121.78173427448, 123.813838201539, 125.678221830168, 125.223192669678, 130.178809969909, 129.383864493346, 133.237619778848, 132.975490419978, 136.990755223392, 139.49174136441, 142.992232167553, 146.010661354506, 152.527187959136, 153.04745194809, 154.563167387096, 157.067805014993, 157.268087606221, 158.471227568113, 158.287331071652, 155.795129800156, 157.55724116696, 154.860576349112, 156.838442882537, 159.495657919406, 160.468560554339, 155.402436800873, 152.972579332118, 149.649832476367, 152.164649953916, 152.662485423094, 154.740607156051, 151.163893546342, 149.360735630956, 149.948475488116, 150.517302146931, 148.501185959992, 152.377953798223, 153.195729660108, 152.883891923907, 155.521739150374, 154.842465249457, 154.465111215394, 156.219363864789, 160.597874636717, 163.252806968342, 169.393866384834, 175.794316271201, 'Pr�ttigau                     ', '61');
INSERT INTO public.value_development VALUES (100, 97.5265728401905, 96.1095269917873, 89.2676138599358, 91.7014540432931, 91.9000409132474, 89.8094402934577, 89.7036445686104, 92.0922348288969, 88.5860386508509, 89.7346994166893, 89.7191472165233, 87.427853801997, 90.5614771595602, 93.6197036351343, 93.4820841308707, 97.0508316228951, 99.3564636734503, 100.0835257962, 101.611004508575, 103.561206211485, 103.831317378125, 105.069933344983, 105.928079798452, 108.260971892842, 110.909686196489, 111.539672584492, 115.667976936443, 116.604890592982, 118.42187778231, 115.585835725575, 116.339049256127, 117.033736904543, 120.382969757282, 119.66177198938, 119.447860722667, 120.606214104619, 119.604696379503, 124.481906745633, 129.10977867399, 134.332145596763, 136.558721042052, 136.997025214225, 135.680480743691, 141.000498340425, 141.221457726263, 147.346105620118, 147.014021314908, 152.286967933172, 155.670709210528, 159.334961341267, 162.188299655228, 169.362963921036, 167.379075291388, 166.738340865291, 169.527649602245, 171.292262173827, 174.445864835488, 175.060253252102, 172.444752010788, 172.596037988762, 168.192537398255, 169.773574255942, 172.714303882696, 173.432978043809, 169.5706035965, 166.881645737492, 162.823847869277, 165.349931200134, 164.411910684402, 165.902534378466, 161.451727192771, 159.610115753589, 160.58568889111, 161.18436432866, 160.424131433251, 165.356589792407, 165.45410276059, 164.177391689055, 165.035970859208, 162.920302960021, 164.270336710165, 170.081069183518, 172.350933592589, 178.494111231339, 182.094705313079, 186.033843070213, 'Davos                         ', '62');
INSERT INTO public.value_development VALUES (100, 98.4001868794772, 98.7753416232428, 91.9012629007057, 94.9503282337854, 95.9870752592077, 95.1734235032525, 94.9084309195803, 96.2341682863816, 91.2118492194609, 92.0002777189548, 91.9142188450809, 89.3358817113263, 92.9819008993598, 93.0393514801362, 92.5450334767176, 96.3849274009327, 98.881719545035, 98.4634440408152, 98.7181554412861, 101.09034320053, 101.191109228914, 100.898815016931, 100.968117052457, 103.406051536208, 106.270790284904, 108.544093217992, 112.428341430066, 113.363052457746, 115.55708755489, 114.197159770636, 115.580335592091, 116.545991812745, 119.046143806669, 117.295620079501, 117.86277978069, 119.792518410331, 116.978543606214, 119.21741908303, 120.366189730435, 121.154129018824, 121.477407989932, 120.755753842209, 118.865600914611, 123.044832200424, 121.870889255929, 126.575083678729, 125.94247092342, 129.355390165658, 132.500281068475, 136.163447890456, 141.641422478169, 150.169665152186, 151.383968712755, 153.875325474043, 156.827682096431, 158.502355874395, 160.588517251716, 161.085908596011, 159.208991206265, 159.697608425721, 157.149147812239, 160.15578724975, 164.493382977508, 168.182199596058, 165.418499362687, 164.275353465825, 162.641449889226, 165.56408186217, 166.511272005367, 168.22396018565, 163.036020873521, 162.623887993568, 163.100590457477, 163.467059452563, 162.006314090009, 164.856183742733, 162.54113219163, 160.311454193211, 161.599147469653, 159.583768774199, 160.454885554897, 161.770453378279, 165.909557591509, 166.642424207573, 172.542559352262, 180.475692520368, 'Schanfigg                     ', '63');
INSERT INTO public.value_development VALUES (100, 98.4111170365943, 98.229717777212, 91.889277348062, 94.9545567077752, 94.2737245698776, 92.4470670984685, 92.3161100230883, 94.2036902945588, 90.8631693387028, 92.9798873117667, 92.660284866339, 90.9923828658021, 94.7178573929039, 94.7307863862949, 95.0988171148814, 97.1573085628411, 96.9757592341162, 98.1486658584258, 98.4420128340073, 101.35416423728, 101.289911735989, 101.399586365021, 101.701451904895, 102.970225688653, 105.08867108502, 107.143546872165, 111.011754730319, 112.883745161502, 116.711626958705, 116.015072127856, 118.53023938439, 120.89482873384, 124.208776336789, 123.330537791159, 124.104313959145, 125.283667248587, 123.655086695105, 126.799211209653, 129.470785380635, 131.753864317764, 133.264504272974, 134.22949651507, 132.715420134528, 138.945596472944, 138.725619939947, 143.463161364406, 143.393199223202, 147.010878576823, 148.954787699433, 151.357762430067, 153.612990769004, 159.013502515198, 157.054266295016, 158.325426241362, 161.539014177041, 163.114630432091, 165.753497807869, 166.249713311716, 163.765052613403, 166.727130977702, 165.52787491979, 168.300075668108, 172.497737381051, 173.627199986198, 169.02522214516, 166.003265702783, 160.75067974636, 160.711309219928, 159.319691306165, 160.371321073685, 156.115940152207, 154.216490955467, 154.560851156256, 155.754120144138, 154.305923051573, 158.497295026732, 157.031795317031, 151.564386285423, 151.113798926921, 147.284086904823, 144.277504539543, 147.518202946337, 150.760476350726, 153.987777360612, 157.955637003624, 163.448366189484, 'Mittelb�nden                  ', '64');
INSERT INTO public.value_development VALUES (100, 101.068447703724, 101.670102678171, 97.4200978308604, 102.269105580079, 101.722754893625, 99.9914865488349, 100.807613841624, 100.712062986286, 98.6804982670826, 100.537809055738, 98.9521546717995, 98.0043480666328, 103.730720841945, 102.894043503143, 101.549204942883, 100.760040974142, 98.6874604572208, 99.6799711570296, 99.1602206169388, 100.825290307046, 99.2633950315193, 98.4954097804899, 99.6423608498487, 102.165303516375, 104.112252463373, 105.218189335927, 107.50446255703, 107.827280065625, 110.555606878881, 109.563863707459, 109.083504424813, 111.952901517659, 114.055225425098, 113.314550220101, 115.698677113833, 114.94572021821, 113.247336370089, 113.263038306797, 114.695467547091, 117.473830350637, 118.640221595109, 120.937092452098, 121.106838619494, 125.183837570811, 123.896329778533, 125.843903428135, 124.686061562341, 126.52509041324, 125.083384821904, 125.87961129419, 123.863818927659, 124.489645611261, 123.796500217952, 124.674845970801, 126.149747301467, 128.443805075495, 131.675197373618, 134.032955880276, 134.317276519192, 137.938779591688, 135.718787374301, 138.045598058087, 139.874114288658, 139.706014338646, 135.607351038426, 133.139257054063, 131.160295718355, 134.733942429447, 135.314828458975, 138.241927365559, 137.08656792773, 135.192211145686, 136.47581924547, 139.853069917989, 139.053973045742, 143.608396799952, 144.203251549672, 142.448858473755, 142.479992605807, 143.471725647018, 143.243547441787, 147.438649515588, 151.06101322466, 154.356303648511, 158.723411464704, 160.995316738341, 'Viamala                       ', '65');
INSERT INTO public.value_development VALUES (100, 99.247381013199, 98.7680293916271, 92.8910764487679, 96.1082280739351, 95.0005028245432, 93.4921778353151, 93.499684518471, 94.5621401012154, 90.5775527625566, 91.9807830550795, 91.7345900872738, 89.9206347841936, 94.492088045971, 94.7151238402065, 94.7344317004254, 97.1124094185912, 96.9173976827937, 97.941313295299, 98.8681779222862, 100.075887180972, 99.8712579387437, 100.650353762965, 102.072071196423, 105.458682537247, 108.58727053407, 110.446940596834, 113.787613200636, 114.488222238954, 116.921644126638, 114.868677119305, 115.746882320481, 117.755689720078, 120.020933536974, 119.105694052778, 120.236417395402, 121.146187965485, 119.140534723424, 121.546193036555, 124.171597463513, 127.573466813084, 129.726977858244, 131.248739174312, 130.298525658537, 135.335875489158, 134.642622283502, 138.669133106719, 138.165938206555, 141.342618744024, 143.301308023351, 146.281084332876, 149.119312998445, 155.636106004751, 155.691184707314, 158.129948601472, 161.391985068726, 163.22379860388, 166.500476500789, 167.307370574793, 165.302078608686, 167.271757009702, 164.535186991807, 166.136599981399, 169.554845335896, 170.795802565691, 166.579548579794, 164.394502736814, 160.981561121527, 162.676839448393, 162.351616381175, 164.2905646494, 162.242478297555, 160.999969835479, 162.059742414824, 163.719993609036, 162.054910181155, 166.650697458437, 165.845696011016, 162.931614686446, 164.066592731023, 161.993988420269, 160.97001985554, 165.310644991747, 171.220777021178, 176.088464721354, 182.26616517104, 188.884988935321, 'Surselva                      ', '66');
INSERT INTO public.value_development VALUES (100, 99.401535658437, 99.697018721341, 94.7602438879085, 97.7279494085234, 99.1871950838411, 98.3866600197508, 98.7720987302018, 99.9735342213043, 94.4432914136164, 95.0817139482859, 94.4287140664754, 92.5558019097078, 96.9312995928486, 96.6172417356991, 95.9495551037478, 97.0378284123375, 97.4561855888624, 98.3243274917179, 99.2487976702934, 98.8792609494106, 99.7577520141819, 102.288075198509, 103.32892308221, 107.606341413464, 111.168940517478, 113.824359342114, 117.011994541022, 117.025171307684, 118.998128974027, 115.286496090023, 116.129757159538, 118.952564595768, 123.71320966041, 123.958410442322, 126.749950096629, 128.725108026993, 126.507820673667, 132.175180680927, 137.267802766066, 140.747440496605, 143.255663843675, 143.614547871322, 143.54897753466, 152.230460010214, 153.824469946487, 159.935644490765, 157.003729894232, 158.358625584244, 157.555148113593, 158.252667876981, 160.05462558932, 163.644559372843, 159.926939686379, 158.524359304832, 160.331042141246, 160.371270509213, 165.315720890414, 164.485511301981, 161.64536054909, 165.545683603086, 162.447358552806, 164.216771517988, 168.092795816081, 169.675502020465, 164.812044946471, 160.668581937613, 155.820245447307, 157.840163077758, 157.890959381886, 160.30216265058, 156.388239053613, 154.118034267611, 153.913963909514, 154.993353629737, 153.712552737903, 158.100777982332, 156.797419443115, 154.24100693908, 155.734648311663, 154.088505011465, 154.517838967129, 158.1844413564, 161.485736498003, 162.143840543021, 166.497826738486, 171.666063539156, 'Engiadina Bassa               ', '67');
INSERT INTO public.value_development VALUES (100, 97.5615049454054, 96.9896147062904, 90.9205110034886, 94.2222871840826, 95.6696979916461, 94.4989907189327, 95.1530598099406, 97.7090831137466, 95.3358727226719, 98.9291485845513, 100.359888932959, 99.2321493723659, 102.979936226637, 104.474079467172, 105.756215614562, 108.711794586302, 108.843920423049, 109.897432195534, 111.685635019385, 114.933694725779, 116.315089600251, 117.986561181411, 120.279552198073, 124.226131834241, 128.68917651698, 131.912852101711, 139.417711283319, 142.7091006741, 149.113399417495, 148.405143925052, 151.117994702605, 153.992538067697, 158.569370821299, 158.775655405968, 160.119819714754, 162.036730414534, 161.136740968962, 168.483145585677, 175.095171220391, 180.640786006868, 184.635952628121, 185.981409730055, 185.126483255512, 194.990259137767, 195.111622729867, 202.948272267966, 200.533184245506, 205.769903137362, 208.273388310871, 210.530067414361, 212.265048389007, 220.575309042015, 215.853594338606, 215.119394094134, 217.338017020029, 216.737281042531, 218.026744946901, 215.764247912699, 210.7394491527, 210.181221796624, 204.936522152048, 204.787496082326, 207.695181716317, 208.66425189367, 204.100248768183, 202.300226150787, 197.25919379076, 198.082421539547, 197.492337783663, 198.248682162026, 195.872751243523, 194.908823760581, 197.269924191958, 199.813360117329, 199.37167475532, 205.67829191576, 205.065494893946, 201.609556198441, 203.178922408352, 200.438384828224, 198.75021398034, 204.341938856263, 211.709838015262, 218.838260086227, 226.334075050249, 233.662498499007, 'Oberengadin                   ', '68');
INSERT INTO public.value_development VALUES (100, 101.748559165988, 103.367759878273, 99.0553643287174, 102.596160258518, 103.651142277214, 100.51617183064, 102.085894061074, 102.36995192364, 99.072707522742, 101.562085827484, 100.100916213995, 101.877984963625, 106.801891206092, 106.774007495761, 105.352812420186, 103.641094503477, 102.469358248847, 102.513720247067, 101.93429605587, 104.234896857687, 103.064712546622, 103.273047289545, 105.594823883116, 109.040843515632, 110.757124252911, 110.881210610318, 111.952996179281, 110.828561173998, 112.736318553959, 112.422103115344, 113.095195980218, 116.242505898062, 117.290679716402, 114.795631928998, 115.442770536282, 113.529786756443, 111.796157585187, 111.028119966708, 112.053850203189, 117.391399466798, 119.690899630444, 123.749321149154, 125.362529418795, 129.101690188015, 129.595992529537, 132.122093674386, 132.804882853012, 135.797334896124, 134.937693093261, 137.221392421875, 135.117416063814, 137.598485050771, 138.466476484552, 138.859800688281, 140.171906177411, 140.472861833882, 142.443882809943, 143.950122620022, 144.145131602548, 148.779668320934, 146.769144512362, 149.501462329918, 151.665482971043, 151.646545615284, 147.981413098263, 146.383665507143, 143.037261412559, 147.25905217402, 147.97872856188, 149.710906611944, 147.219868139292, 144.741480631666, 144.925682179676, 148.333657256145, 148.116927894904, 153.061586548777, 153.699856029525, 152.658708983963, 152.391153876111, 152.803738492602, 153.125270555382, 158.04429432186, 162.673976537686, 165.666487374211, 165.680308797926, 166.345338697596, 'Mesolcina                     ', '69');
INSERT INTO public.value_development VALUES (100, 100.570509921581, 100.155548681489, 95.2811712907096, 97.5127021373711, 96.3682816064651, 94.9359090305482, 96.6785487838271, 96.4824074905386, 93.0747869001374, 96.9791471412709, 95.5034082490985, 94.7246480243842, 98.426422567475, 97.7419030477266, 98.6198579355921, 99.7981901749958, 99.2989952921465, 100.008725173675, 101.36326865715, 103.87339453204, 104.4825572845, 105.524513407726, 105.502081094341, 107.372762114777, 108.642903871424, 108.310120523242, 111.511383675292, 111.119482152803, 112.64112914472, 110.003663099087, 111.530052224014, 113.163335267536, 113.737627434845, 114.077772004291, 114.163102699469, 115.190533989847, 113.603203210759, 113.964714331962, 116.154334187999, 118.323718379292, 120.346034174371, 122.373520056756, 123.17892281554, 128.7552748003, 129.052788715299, 132.342113658558, 130.408895754521, 132.163914880984, 132.773205193731, 136.253731004651, 134.628100895483, 137.624744993435, 138.184434903125, 138.535571255951, 140.286037132396, 141.690969257481, 143.85178229329, 145.564443011576, 148.652447976845, 151.652072161501, 151.105366358904, 152.963229712581, 153.095784745197, 155.244956244166, 153.112043538348, 152.366896262784, 151.732507385125, 152.19883535197, 151.954896335957, 153.10434922174, 153.892306332043, 153.886594796646, 155.565808498927, 157.297922166576, 156.912883477008, 156.645361877776, 158.137331771079, 158.61226250915, 158.547562635027, 160.89801137395, 162.90467010156, 164.260494368432, 168.698632633099, 170.589171314453, 171.542792328084, 173.725314944646, 'Aarau                         ', '70');
INSERT INTO public.value_development VALUES (100, 100.217731306322, 99.3852076255621, 94.4236810756363, 95.0730489309142, 93.545665803822, 92.4908489859881, 93.8353581695316, 94.4133323080008, 90.9854330836789, 94.937070427215, 93.0151137195787, 92.2002600455716, 96.5598565080464, 96.4906996791096, 97.7665780865017, 99.28608176522, 98.9056515302259, 99.8216721582815, 100.609344340087, 102.297413818997, 102.593532510349, 103.647737963767, 104.189603311156, 106.385118015209, 108.047337005083, 107.710072329371, 110.422048047518, 109.92344558907, 110.987776587807, 108.702697575439, 110.853039247007, 112.796799180613, 114.555258984975, 115.21498770614, 115.415621456349, 116.344278200656, 114.336177219799, 114.320611116354, 115.790891756557, 117.225078571924, 118.330318930996, 120.438483755056, 121.402994642159, 127.25521476426, 128.375250972917, 131.702105889134, 130.091206284471, 132.222500985992, 132.574484410666, 135.485106290849, 134.255115019354, 137.336843537645, 137.318474227617, 137.229904699802, 138.222053650384, 139.024960735208, 140.30561561188, 141.423989094082, 142.912524405835, 144.217647812055, 142.510265615909, 143.356921389413, 143.49234867541, 145.593006473844, 143.228330282303, 142.56228229302, 141.994801633634, 142.735127306536, 143.461507784721, 146.059359201416, 148.297129842296, 149.357560330794, 151.153245740184, 152.66367581357, 153.008984503687, 152.993953743671, 154.612375080315, 155.244411749963, 154.82462604257, 156.486967782466, 157.75041871451, 158.246734792641, 161.831771824591, 163.51794300171, 164.187047489827, 166.529124539516, 'Brugg-Zurzach                 ', '71');
INSERT INTO public.value_development VALUES (100, 98.363148316913, 96.7567260154139, 91.9233218369229, 93.356732633758, 92.2913456484658, 92.854721435353, 95.246890396112, 95.9231360361261, 93.7175846610223, 97.2172696234905, 95.6646560891546, 96.1637628082699, 100.214757677269, 100.769360648313, 102.533609553212, 103.702709817648, 103.978390089124, 103.474365556833, 103.364979804199, 105.887999433734, 105.74902231054, 107.168141648233, 108.16000861163, 110.687351736348, 112.604088062612, 113.480986974118, 117.916902112168, 118.147691157112, 120.2860761608, 117.611644079113, 119.097790803894, 121.281689999605, 122.542929467985, 122.998327227721, 123.784961554877, 125.522458017176, 124.279598912425, 125.395255088542, 128.253882870332, 130.234398739351, 132.589619496451, 135.834786303896, 136.539552922245, 143.369913854079, 144.588121314165, 148.918320257679, 147.373534060502, 150.417699892567, 150.674778693017, 153.938013822999, 152.637133879627, 155.860621615561, 155.790456211772, 155.907922415871, 158.645153180362, 159.914323442808, 162.980639389472, 164.679043066156, 165.359889969527, 167.722361573965, 165.15057054683, 166.367978945417, 167.770374659439, 170.135514775701, 167.335537683829, 165.703662650717, 165.095985535092, 164.769109984477, 166.401349340544, 168.716373049734, 169.545836189469, 170.801940354079, 171.775814920383, 174.480744504382, 175.475415249482, 175.454015919503, 177.279925414666, 177.214851731024, 176.68874863693, 178.960274606601, 180.799985855368, 182.538445514647, 187.555639561611, 190.34261764605, 191.908288874973, 194.9297191637, 'Baden                         ', '72');
INSERT INTO public.value_development VALUES (100, 98.0348188057066, 96.6136669577716, 92.5231644428441, 94.4355430023246, 93.8659963396234, 94.0679442931121, 96.6538322592985, 97.5397325174852, 94.9990453650354, 99.0547612731921, 96.9479884262704, 97.1517420873129, 101.366621729067, 101.635268773912, 103.740812964954, 105.474333140449, 105.543861551105, 105.08322806616, 105.172995310852, 107.501522902468, 107.363309138359, 108.454636831386, 109.078295842381, 111.596203696405, 113.504097379877, 114.36027435677, 119.110881673147, 119.696884516088, 121.932663208591, 119.49835525917, 120.842664213545, 122.242698566621, 123.698436334498, 123.690442361783, 124.111668217573, 125.423774097174, 123.224750630725, 123.51546638893, 125.083538493856, 126.547802848794, 127.884621602833, 130.197823812495, 131.106726182322, 137.616594089044, 139.223268579321, 143.544649502975, 142.631779118756, 145.48753472506, 146.164169174663, 149.531164166753, 148.68472011194, 152.484834338932, 152.690518723258, 153.116129517598, 155.086229456521, 155.343116072232, 157.6145107701, 158.463183899335, 158.80414680767, 160.837754707489, 158.267954427824, 159.921723093931, 161.784733754345, 164.470540010445, 161.711876654764, 159.861240443061, 159.283291661944, 158.722665717124, 159.197585649459, 160.903360693761, 162.344842422169, 163.151426569757, 163.740069884029, 165.84950450657, 166.782541784941, 166.502025914304, 168.499377579285, 169.353932583021, 168.99671492569, 171.264371720672, 173.723691700124, 175.563284053792, 180.620229912207, 183.562222684031, 185.762091738081, 189.479570932706, 'Mutschellen                   ', '73');
INSERT INTO public.value_development VALUES (100, 100.539370447122, 100.363924038238, 96.5085436788742, 97.0410517610689, 96.6651624795029, 95.7515377887565, 97.3813842742272, 97.9148662445037, 94.7558599836082, 99.2956705260367, 97.3613009991639, 97.1362189431913, 101.747328496409, 101.666931098567, 103.278022215695, 105.157186277246, 104.45780669858, 105.545023026187, 106.462723565451, 108.84183466974, 109.288812360591, 110.185036772274, 110.598235438, 112.940844600862, 115.141346880996, 115.111823020899, 119.223079466831, 119.142020760387, 120.899621534945, 118.620473710239, 120.506140482706, 122.763920140835, 124.803395162319, 126.062410089102, 126.548155734063, 127.434942743429, 125.693302619934, 125.717240975277, 127.472759897921, 129.437102980934, 130.295014905188, 132.043387351675, 133.191514087835, 139.706875067615, 141.668549421036, 145.80529540902, 144.024913089931, 146.280215897069, 145.818965001728, 149.145096165002, 147.17597454358, 150.126596493257, 150.65949682758, 150.525511662357, 151.849455168184, 153.06528035492, 154.252383461661, 155.12519318258, 157.465112432461, 158.690950401319, 156.961176234014, 158.044339411744, 157.545835570761, 159.565353594355, 156.761137506808, 156.251384791838, 155.533280774176, 156.057550914437, 156.210857193519, 157.300520148351, 158.465596605605, 158.079141827597, 159.235263790018, 160.975804053859, 161.530049475811, 162.146684970218, 164.825663551236, 166.846078127547, 167.180883803627, 170.410997154927, 171.729078078512, 172.513614473106, 176.87583948193, 178.453120494835, 180.230791583885, 183.809222369437, 'Freiamt                       ', '74');
INSERT INTO public.value_development VALUES (100, 99.377484182495, 98.8892056369051, 94.590344202109, 95.8391772078222, 94.5545510127729, 94.0573511185812, 95.7187545723454, 96.5435529333164, 93.3476263283947, 97.9619063518107, 96.1146009587541, 96.0156224473011, 100.897364650037, 101.300241895473, 103.185750993199, 105.458147430934, 105.677048331852, 105.839242320527, 106.333016460701, 108.815832869713, 108.639919880146, 109.387154776815, 109.907048333636, 111.903774228685, 113.567714354131, 113.80514724674, 117.517504921815, 117.605446004923, 119.831237250028, 117.66252545264, 120.100273380975, 122.282851069342, 123.939596205147, 124.233799093596, 124.383819389361, 125.675910346495, 123.670594401454, 123.955971830524, 125.720024295046, 127.281866450162, 128.22779589061, 129.983862393714, 130.07540671124, 135.594660081646, 136.07263398539, 138.707114995442, 136.060332585611, 137.894484033564, 137.29207920903, 139.780160453397, 138.356573290162, 141.26090659177, 141.426939252059, 141.023746822926, 142.068186438496, 142.480438311794, 143.769679612633, 145.305595216404, 146.788908668723, 148.194685546272, 145.956026765063, 146.361048130793, 146.322829986177, 148.230085807636, 146.087356529999, 146.030033931887, 146.401966013941, 147.955990672996, 150.002549429752, 152.514661026342, 154.740550943979, 155.574773014303, 156.503031777693, 158.546890930208, 159.158026974428, 159.161230933107, 161.114363319286, 161.774205718948, 161.053570963579, 162.901140177979, 163.61253365582, 163.630542444625, 167.303176894902, 168.795091574163, 170.173868249563, 173.019490889578, 'Fricktal                      ', '75');
INSERT INTO public.value_development VALUES (99.9999999999999, 99.3665073696141, 98.980123987393, 94.7129693871124, 96.4794665626075, 93.5187941189409, 93.4254834292766, 95.1896521444705, 94.7439723205683, 94.5880300214273, 96.0008954195024, 94.9625570897401, 97.0191679206735, 101.940360308517, 104.27823478405, 104.90494195998, 106.602364814868, 106.113361945906, 105.806401016821, 104.503453974925, 107.29859140181, 107.178023636406, 107.879377310871, 107.61701583307, 108.093259467676, 108.106950333593, 107.030147994861, 109.149359149625, 109.142004507867, 111.742970029066, 110.502069281823, 112.5973643819, 112.969378677945, 113.676085363975, 112.703433952368, 114.061137454246, 114.596294603882, 114.705751775939, 114.909217340443, 116.792564603116, 119.101139136497, 119.070976778539, 120.387303646301, 118.89674547853, 121.972945153124, 123.282610063374, 127.127474830879, 126.340731202747, 131.857874216118, 132.774401836137, 135.48749218057, 137.139227260823, 140.601348074651, 142.347460313862, 143.831339074822, 145.66443710568, 148.730646777237, 150.817765077118, 154.170916220072, 155.571917388687, 158.417864169678, 158.173091444362, 160.76487638818, 164.280539417732, 165.806133247405, 160.401795142807, 157.883358217336, 155.780242714919, 152.992534464162, 151.48011504614, 150.443928106415, 152.179101285053, 154.229353263536, 154.122397277696, 156.553274080215, 157.285457902208, 157.970552989748, 159.966984411168, 159.40906040705, 158.752639285209, 160.641205069527, 159.653622566209, 160.893750218908, 164.994246479402, 165.381970156051, 169.736035743, 173.546767610176, 'Thurtal                       ', '76');
INSERT INTO public.value_development VALUES (100, 99.5648258603355, 99.4603111189432, 95.0089305925341, 97.6790764203304, 94.7815417152253, 94.0413418788501, 96.1103075587723, 95.9065278381078, 96.0586631964465, 97.2195588677688, 96.4691609533178, 97.6485153962672, 102.626039900511, 104.677899253951, 106.195453351713, 107.888099490281, 107.924290545718, 106.803149408948, 106.312138217062, 109.158453654149, 109.508478828437, 110.951952339894, 111.280208243551, 112.336095340837, 113.032775321156, 112.454590092984, 115.551904172108, 115.625913737115, 118.946657817142, 117.667766782605, 119.433070441873, 120.088676904882, 119.660660618902, 118.03917236019, 119.354713223271, 120.152070054994, 119.957565593274, 119.957129078078, 122.241839136343, 124.608157376667, 125.483836040474, 128.667271728924, 128.08621472125, 132.55609567165, 133.979250448129, 137.900996751146, 137.019233231243, 142.747331618803, 144.005699304451, 147.451900711563, 149.204439660454, 152.774144303351, 154.421824843391, 155.636315936218, 157.545667599247, 160.559284742359, 162.391711253353, 165.099526868048, 166.219115310449, 169.029782908193, 169.037099085983, 172.042700239222, 175.393733890973, 177.142363077762, 171.305555539814, 169.722606373019, 167.626996121548, 165.373743842436, 164.243252733558, 163.012047468999, 164.313194651225, 165.908354761556, 166.28675419575, 169.211169553729, 170.078565960743, 171.681664766884, 173.704567773054, 173.193745493519, 173.221069156467, 175.545494647993, 175.740306926239, 177.715362847818, 183.302211378487, 183.987527355241, 188.800483545638, 192.67634133254, 'Untersee                      ', '77');
INSERT INTO public.value_development VALUES (100, 99.9083742628801, 99.637961587391, 94.8602443149977, 97.825726450986, 94.338239836464, 94.1138769632605, 96.6771721380856, 96.4635516733165, 96.4587814938504, 97.8307258211468, 96.7934441755695, 96.8615007712213, 101.738385769862, 103.438994276984, 104.026140962455, 104.783632866795, 105.165193934224, 104.348549231272, 103.266634025917, 105.242021299524, 104.969739703808, 106.057373369172, 105.942536185947, 107.428522991039, 107.724382160345, 106.632110484404, 108.764168605139, 108.795061505543, 111.811260645977, 110.844221351978, 113.002883759214, 113.93083182039, 114.563551856619, 113.985888694855, 115.714238229186, 116.530164527698, 116.215687485641, 115.974932248146, 117.429400199927, 119.08453490055, 119.335760059141, 121.504888985771, 120.595599120327, 123.952652932404, 123.902489494919, 126.120482349687, 123.305987661995, 126.352940296407, 125.95979738133, 128.123857979482, 129.926011664416, 133.382579015964, 135.552559100852, 137.713527207474, 139.336824640177, 142.808538637002, 145.609172800008, 148.543659666084, 149.825153370775, 152.491843965629, 152.162018509832, 155.52152122958, 160.05000195219, 163.456238360934, 159.400858650181, 158.798296974071, 157.821711116744, 156.31288014789, 155.465801803333, 155.17605496099, 156.062862442676, 158.011617050887, 158.935565088443, 162.093031328426, 163.146745799911, 164.6255200714, 166.531254072768, 165.494652166389, 164.38689120427, 165.606316155566, 165.257165708571, 166.851220365275, 171.435979176817, 171.732972342974, 174.894705150911, 178.288732532259, 'Oberthurgau                   ', '78');


--
-- Data for Name: zip_codes; Type: TABLE DATA; Schema: public; Owner: db_user
--

INSERT INTO public.zip_codes VALUES ('9658', '58');
INSERT INTO public.zip_codes VALUES ('9657', '58');
INSERT INTO public.zip_codes VALUES ('9656', '58');
INSERT INTO public.zip_codes VALUES ('9655', '58');
INSERT INTO public.zip_codes VALUES ('9652', '58');
INSERT INTO public.zip_codes VALUES ('9651', '58');
INSERT INTO public.zip_codes VALUES ('9650', '58');
INSERT INTO public.zip_codes VALUES ('9643', '58');
INSERT INTO public.zip_codes VALUES ('9642', '58');
INSERT INTO public.zip_codes VALUES ('9633', '58');
INSERT INTO public.zip_codes VALUES ('9631', '58');
INSERT INTO public.zip_codes VALUES ('9630', '58');
INSERT INTO public.zip_codes VALUES ('9622', '58');
INSERT INTO public.zip_codes VALUES ('9621', '58');
INSERT INTO public.zip_codes VALUES ('9620', '58');
INSERT INTO public.zip_codes VALUES ('9615', '58');
INSERT INTO public.zip_codes VALUES ('9614', '58');
INSERT INTO public.zip_codes VALUES ('9613', '58');
INSERT INTO public.zip_codes VALUES ('9612', '58');
INSERT INTO public.zip_codes VALUES ('9608', '58');
INSERT INTO public.zip_codes VALUES ('9607', '58');
INSERT INTO public.zip_codes VALUES ('9606', '58');
INSERT INTO public.zip_codes VALUES ('9604', '59');
INSERT INTO public.zip_codes VALUES ('9602', '59');
INSERT INTO public.zip_codes VALUES ('9601', '58');
INSERT INTO public.zip_codes VALUES ('9573', '59');
INSERT INTO public.zip_codes VALUES ('9565', '76');
INSERT INTO public.zip_codes VALUES ('9562', '59');
INSERT INTO public.zip_codes VALUES ('9556', '59');
INSERT INTO public.zip_codes VALUES ('9555', '59');
INSERT INTO public.zip_codes VALUES ('9554', '59');
INSERT INTO public.zip_codes VALUES ('9553', '59');
INSERT INTO public.zip_codes VALUES ('9552', '59');
INSERT INTO public.zip_codes VALUES ('9548', '76');
INSERT INTO public.zip_codes VALUES ('9547', '76');
INSERT INTO public.zip_codes VALUES ('9546', '59');
INSERT INTO public.zip_codes VALUES ('9545', '59');
INSERT INTO public.zip_codes VALUES ('9543', '59');
INSERT INTO public.zip_codes VALUES ('9542', '59');
INSERT INTO public.zip_codes VALUES ('9536', '59');
INSERT INTO public.zip_codes VALUES ('9535', '59');
INSERT INTO public.zip_codes VALUES ('9534', '59');
INSERT INTO public.zip_codes VALUES ('9533', '59');
INSERT INTO public.zip_codes VALUES ('9532', '59');
INSERT INTO public.zip_codes VALUES ('9527', '59');
INSERT INTO public.zip_codes VALUES ('9526', '59');
INSERT INTO public.zip_codes VALUES ('9525', '59');
INSERT INTO public.zip_codes VALUES ('9524', '59');
INSERT INTO public.zip_codes VALUES ('9523', '59');
INSERT INTO public.zip_codes VALUES ('9517', '76');
INSERT INTO public.zip_codes VALUES ('9515', '59');
INSERT INTO public.zip_codes VALUES ('9514', '59');
INSERT INTO public.zip_codes VALUES ('9512', '59');
INSERT INTO public.zip_codes VALUES ('9508', '59');
INSERT INTO public.zip_codes VALUES ('9507', '76');
INSERT INTO public.zip_codes VALUES ('9506', '59');
INSERT INTO public.zip_codes VALUES ('9504', '76');
INSERT INTO public.zip_codes VALUES ('9503', '76');
INSERT INTO public.zip_codes VALUES ('9502', '59');
INSERT INTO public.zip_codes VALUES ('9500', '59');
INSERT INTO public.zip_codes VALUES ('9479', '55');
INSERT INTO public.zip_codes VALUES ('9478', '55');
INSERT INTO public.zip_codes VALUES ('9477', '55');
INSERT INTO public.zip_codes VALUES ('9476', '55');
INSERT INTO public.zip_codes VALUES ('9475', '55');
INSERT INTO public.zip_codes VALUES ('9473', '55');
INSERT INTO public.zip_codes VALUES ('9472', '55');
INSERT INTO public.zip_codes VALUES ('9470', '55');
INSERT INTO public.zip_codes VALUES ('9469', '55');
INSERT INTO public.zip_codes VALUES ('9468', '55');
INSERT INTO public.zip_codes VALUES ('9467', '55');
INSERT INTO public.zip_codes VALUES ('9466', '55');
INSERT INTO public.zip_codes VALUES ('9465', '55');
INSERT INTO public.zip_codes VALUES ('9464', '54');
INSERT INTO public.zip_codes VALUES ('9463', '54');
INSERT INTO public.zip_codes VALUES ('9462', '54');
INSERT INTO public.zip_codes VALUES ('9453', '54');
INSERT INTO public.zip_codes VALUES ('9452', '54');
INSERT INTO public.zip_codes VALUES ('9451', '54');
INSERT INTO public.zip_codes VALUES ('9450', '54');
INSERT INTO public.zip_codes VALUES ('9445', '54');
INSERT INTO public.zip_codes VALUES ('9444', '54');
INSERT INTO public.zip_codes VALUES ('9443', '54');
INSERT INTO public.zip_codes VALUES ('9442', '54');
INSERT INTO public.zip_codes VALUES ('9437', '54');
INSERT INTO public.zip_codes VALUES ('9436', '54');
INSERT INTO public.zip_codes VALUES ('9435', '54');
INSERT INTO public.zip_codes VALUES ('9434', '54');
INSERT INTO public.zip_codes VALUES ('9430', '53');
INSERT INTO public.zip_codes VALUES ('9428', '51');
INSERT INTO public.zip_codes VALUES ('9427', '51');
INSERT INTO public.zip_codes VALUES ('9426', '51');
INSERT INTO public.zip_codes VALUES ('9425', '53');
INSERT INTO public.zip_codes VALUES ('9424', '53');
INSERT INTO public.zip_codes VALUES ('9423', '53');
INSERT INTO public.zip_codes VALUES ('9422', '53');
INSERT INTO public.zip_codes VALUES ('9413', '51');
INSERT INTO public.zip_codes VALUES ('9411', '51');
INSERT INTO public.zip_codes VALUES ('9410', '51');
INSERT INTO public.zip_codes VALUES ('9405', '51');
INSERT INTO public.zip_codes VALUES ('9404', '53');
INSERT INTO public.zip_codes VALUES ('9403', '53');
INSERT INTO public.zip_codes VALUES ('9402', '53');
INSERT INTO public.zip_codes VALUES ('9400', '53');
INSERT INTO public.zip_codes VALUES ('9327', '53');
INSERT INTO public.zip_codes VALUES ('9326', '53');
INSERT INTO public.zip_codes VALUES ('9325', '78');
INSERT INTO public.zip_codes VALUES ('9323', '78');
INSERT INTO public.zip_codes VALUES ('9322', '78');
INSERT INTO public.zip_codes VALUES ('9320', '78');
INSERT INTO public.zip_codes VALUES ('9315', '78');
INSERT INTO public.zip_codes VALUES ('9314', '78');
INSERT INTO public.zip_codes VALUES ('9313', '53');
INSERT INTO public.zip_codes VALUES ('9312', '53');
INSERT INTO public.zip_codes VALUES ('9308', '53');
INSERT INTO public.zip_codes VALUES ('9306', '78');
INSERT INTO public.zip_codes VALUES ('9305', '53');
INSERT INTO public.zip_codes VALUES ('9304', '53');
INSERT INTO public.zip_codes VALUES ('9300', '53');
INSERT INTO public.zip_codes VALUES ('9249', '59');
INSERT INTO public.zip_codes VALUES ('9248', '59');
INSERT INTO public.zip_codes VALUES ('9247', '59');
INSERT INTO public.zip_codes VALUES ('9246', '53');
INSERT INTO public.zip_codes VALUES ('9245', '59');
INSERT INTO public.zip_codes VALUES ('9244', '59');
INSERT INTO public.zip_codes VALUES ('9243', '59');
INSERT INTO public.zip_codes VALUES ('9242', '59');
INSERT INTO public.zip_codes VALUES ('9240', '59');
INSERT INTO public.zip_codes VALUES ('9231', '53');
INSERT INTO public.zip_codes VALUES ('9230', '53');
INSERT INTO public.zip_codes VALUES ('9225', '78');
INSERT INTO public.zip_codes VALUES ('9223', '78');
INSERT INTO public.zip_codes VALUES ('9220', '78');
INSERT INTO public.zip_codes VALUES ('9217', '76');
INSERT INTO public.zip_codes VALUES ('9216', '78');
INSERT INTO public.zip_codes VALUES ('9215', '76');
INSERT INTO public.zip_codes VALUES ('9214', '76');
INSERT INTO public.zip_codes VALUES ('9213', '78');
INSERT INTO public.zip_codes VALUES ('9212', '53');
INSERT INTO public.zip_codes VALUES ('9205', '53');
INSERT INTO public.zip_codes VALUES ('9204', '53');
INSERT INTO public.zip_codes VALUES ('9203', '59');
INSERT INTO public.zip_codes VALUES ('9200', '53');
INSERT INTO public.zip_codes VALUES ('9127', '58');
INSERT INTO public.zip_codes VALUES ('9126', '58');
INSERT INTO public.zip_codes VALUES ('9125', '58');
INSERT INTO public.zip_codes VALUES ('9123', '58');
INSERT INTO public.zip_codes VALUES ('9122', '58');
INSERT INTO public.zip_codes VALUES ('9116', '53');
INSERT INTO public.zip_codes VALUES ('9115', '58');
INSERT INTO public.zip_codes VALUES ('9114', '58');
INSERT INTO public.zip_codes VALUES ('9113', '53');
INSERT INTO public.zip_codes VALUES ('9112', '51');
INSERT INTO public.zip_codes VALUES ('9108', '52');
INSERT INTO public.zip_codes VALUES ('9107', '51');
INSERT INTO public.zip_codes VALUES ('9105', '51');
INSERT INTO public.zip_codes VALUES ('9104', '51');
INSERT INTO public.zip_codes VALUES ('9103', '51');
INSERT INTO public.zip_codes VALUES ('9100', '51');
INSERT INTO public.zip_codes VALUES ('9064', '51');
INSERT INTO public.zip_codes VALUES ('9063', '51');
INSERT INTO public.zip_codes VALUES ('9062', '51');
INSERT INTO public.zip_codes VALUES ('9058', '52');
INSERT INTO public.zip_codes VALUES ('9057', '52');
INSERT INTO public.zip_codes VALUES ('9056', '51');
INSERT INTO public.zip_codes VALUES ('9055', '51');
INSERT INTO public.zip_codes VALUES ('9054', '52');
INSERT INTO public.zip_codes VALUES ('9053', '51');
INSERT INTO public.zip_codes VALUES ('9052', '51');
INSERT INTO public.zip_codes VALUES ('9050', '52');
INSERT INTO public.zip_codes VALUES ('9044', '51');
INSERT INTO public.zip_codes VALUES ('9043', '51');
INSERT INTO public.zip_codes VALUES ('9042', '51');
INSERT INTO public.zip_codes VALUES ('9038', '51');
INSERT INTO public.zip_codes VALUES ('9037', '51');
INSERT INTO public.zip_codes VALUES ('9036', '53');
INSERT INTO public.zip_codes VALUES ('9035', '51');
INSERT INTO public.zip_codes VALUES ('9034', '53');
INSERT INTO public.zip_codes VALUES ('9033', '53');
INSERT INTO public.zip_codes VALUES ('9032', '53');
INSERT INTO public.zip_codes VALUES ('9030', '53');
INSERT INTO public.zip_codes VALUES ('9016', '53');
INSERT INTO public.zip_codes VALUES ('9015', '53');
INSERT INTO public.zip_codes VALUES ('9014', '53');
INSERT INTO public.zip_codes VALUES ('9012', '53');
INSERT INTO public.zip_codes VALUES ('9011', '53');
INSERT INTO public.zip_codes VALUES ('9010', '53');
INSERT INTO public.zip_codes VALUES ('9008', '53');
INSERT INTO public.zip_codes VALUES ('9000', '53');
INSERT INTO public.zip_codes VALUES ('8967', '73');
INSERT INTO public.zip_codes VALUES ('8966', '73');
INSERT INTO public.zip_codes VALUES ('8965', '73');
INSERT INTO public.zip_codes VALUES ('8964', '73');
INSERT INTO public.zip_codes VALUES ('8962', '73');
INSERT INTO public.zip_codes VALUES ('8957', '72');
INSERT INTO public.zip_codes VALUES ('8956', '72');
INSERT INTO public.zip_codes VALUES ('8955', '3');
INSERT INTO public.zip_codes VALUES ('8954', '3');
INSERT INTO public.zip_codes VALUES ('8953', '3');
INSERT INTO public.zip_codes VALUES ('8952', '3');
INSERT INTO public.zip_codes VALUES ('8951', '3');
INSERT INTO public.zip_codes VALUES ('8942', '5');
INSERT INTO public.zip_codes VALUES ('8934', '4');
INSERT INTO public.zip_codes VALUES ('8933', '4');
INSERT INTO public.zip_codes VALUES ('8932', '4');
INSERT INTO public.zip_codes VALUES ('8926', '4');
INSERT INTO public.zip_codes VALUES ('8925', '4');
INSERT INTO public.zip_codes VALUES ('8919', '74');
INSERT INTO public.zip_codes VALUES ('8918', '73');
INSERT INTO public.zip_codes VALUES ('8917', '73');
INSERT INTO public.zip_codes VALUES ('8916', '73');
INSERT INTO public.zip_codes VALUES ('8915', '4');
INSERT INTO public.zip_codes VALUES ('8914', '4');
INSERT INTO public.zip_codes VALUES ('8913', '4');
INSERT INTO public.zip_codes VALUES ('8912', '4');
INSERT INTO public.zip_codes VALUES ('8911', '4');
INSERT INTO public.zip_codes VALUES ('8910', '4');
INSERT INTO public.zip_codes VALUES ('8909', '4');
INSERT INTO public.zip_codes VALUES ('8908', '4');
INSERT INTO public.zip_codes VALUES ('8907', '4');
INSERT INTO public.zip_codes VALUES ('8906', '4');
INSERT INTO public.zip_codes VALUES ('8905', '73');
INSERT INTO public.zip_codes VALUES ('8904', '3');
INSERT INTO public.zip_codes VALUES ('8903', '3');
INSERT INTO public.zip_codes VALUES ('8902', '3');
INSERT INTO public.zip_codes VALUES ('8898', '56');
INSERT INTO public.zip_codes VALUES ('8897', '56');
INSERT INTO public.zip_codes VALUES ('8896', '56');
INSERT INTO public.zip_codes VALUES ('8895', '56');
INSERT INTO public.zip_codes VALUES ('8894', '56');
INSERT INTO public.zip_codes VALUES ('8893', '56');
INSERT INTO public.zip_codes VALUES ('8892', '56');
INSERT INTO public.zip_codes VALUES ('8890', '56');
INSERT INTO public.zip_codes VALUES ('8889', '56');
INSERT INTO public.zip_codes VALUES ('8888', '56');
INSERT INTO public.zip_codes VALUES ('8887', '56');
INSERT INTO public.zip_codes VALUES ('8886', '56');
INSERT INTO public.zip_codes VALUES ('8885', '56');
INSERT INTO public.zip_codes VALUES ('8884', '56');
INSERT INTO public.zip_codes VALUES ('8883', '56');
INSERT INTO public.zip_codes VALUES ('8882', '56');
INSERT INTO public.zip_codes VALUES ('8881', '56');
INSERT INTO public.zip_codes VALUES ('8880', '56');
INSERT INTO public.zip_codes VALUES ('8878', '56');
INSERT INTO public.zip_codes VALUES ('8877', '56');
INSERT INTO public.zip_codes VALUES ('8874', '36');
INSERT INTO public.zip_codes VALUES ('8873', '56');
INSERT INTO public.zip_codes VALUES ('8872', '56');
INSERT INTO public.zip_codes VALUES ('8868', '36');
INSERT INTO public.zip_codes VALUES ('8867', '36');
INSERT INTO public.zip_codes VALUES ('8866', '36');
INSERT INTO public.zip_codes VALUES ('8865', '36');
INSERT INTO public.zip_codes VALUES ('8864', '33');
INSERT INTO public.zip_codes VALUES ('8863', '33');
INSERT INTO public.zip_codes VALUES ('8862', '33');
INSERT INTO public.zip_codes VALUES ('8858', '32');
INSERT INTO public.zip_codes VALUES ('8857', '32');
INSERT INTO public.zip_codes VALUES ('8856', '33');
INSERT INTO public.zip_codes VALUES ('8855', '33');
INSERT INTO public.zip_codes VALUES ('8854', '33');
INSERT INTO public.zip_codes VALUES ('8853', '33');
INSERT INTO public.zip_codes VALUES ('8852', '33');
INSERT INTO public.zip_codes VALUES ('8849', '32');
INSERT INTO public.zip_codes VALUES ('8847', '32');
INSERT INTO public.zip_codes VALUES ('8846', '32');
INSERT INTO public.zip_codes VALUES ('8845', '32');
INSERT INTO public.zip_codes VALUES ('8844', '32');
INSERT INTO public.zip_codes VALUES ('8843', '32');
INSERT INTO public.zip_codes VALUES ('8842', '32');
INSERT INTO public.zip_codes VALUES ('8841', '32');
INSERT INTO public.zip_codes VALUES ('8840', '32');
INSERT INTO public.zip_codes VALUES ('8836', '32');
INSERT INTO public.zip_codes VALUES ('8835', '33');
INSERT INTO public.zip_codes VALUES ('8834', '33');
INSERT INTO public.zip_codes VALUES ('8833', '5');
INSERT INTO public.zip_codes VALUES ('8832', '33');
INSERT INTO public.zip_codes VALUES ('8825', '5');
INSERT INTO public.zip_codes VALUES ('8824', '5');
INSERT INTO public.zip_codes VALUES ('8820', '5');
INSERT INTO public.zip_codes VALUES ('8816', '5');
INSERT INTO public.zip_codes VALUES ('8815', '5');
INSERT INTO public.zip_codes VALUES ('8810', '5');
INSERT INTO public.zip_codes VALUES ('8808', '33');
INSERT INTO public.zip_codes VALUES ('8807', '33');
INSERT INTO public.zip_codes VALUES ('8806', '33');
INSERT INTO public.zip_codes VALUES ('8805', '5');
INSERT INTO public.zip_codes VALUES ('8804', '5');
INSERT INTO public.zip_codes VALUES ('8803', '5');
INSERT INTO public.zip_codes VALUES ('8802', '5');
INSERT INTO public.zip_codes VALUES ('8800', '5');
INSERT INTO public.zip_codes VALUES ('8784', '37');
INSERT INTO public.zip_codes VALUES ('8783', '37');
INSERT INTO public.zip_codes VALUES ('8782', '37');
INSERT INTO public.zip_codes VALUES ('8777', '37');
INSERT INTO public.zip_codes VALUES ('8775', '37');
INSERT INTO public.zip_codes VALUES ('8774', '37');
INSERT INTO public.zip_codes VALUES ('8773', '37');
INSERT INTO public.zip_codes VALUES ('8772', '37');
INSERT INTO public.zip_codes VALUES ('8767', '37');
INSERT INTO public.zip_codes VALUES ('8766', '37');
INSERT INTO public.zip_codes VALUES ('8765', '37');
INSERT INTO public.zip_codes VALUES ('8762', '37');
INSERT INTO public.zip_codes VALUES ('8758', '36');
INSERT INTO public.zip_codes VALUES ('8757', '36');
INSERT INTO public.zip_codes VALUES ('8756', '37');
INSERT INTO public.zip_codes VALUES ('8755', '36');
INSERT INTO public.zip_codes VALUES ('8754', '36');
INSERT INTO public.zip_codes VALUES ('8753', '36');
INSERT INTO public.zip_codes VALUES ('8752', '36');
INSERT INTO public.zip_codes VALUES ('8751', '30');
INSERT INTO public.zip_codes VALUES ('8750', '36');
INSERT INTO public.zip_codes VALUES ('8739', '57');
INSERT INTO public.zip_codes VALUES ('8738', '57');
INSERT INTO public.zip_codes VALUES ('8737', '57');
INSERT INTO public.zip_codes VALUES ('8735', '57');
INSERT INTO public.zip_codes VALUES ('8734', '57');
INSERT INTO public.zip_codes VALUES ('8733', '57');
INSERT INTO public.zip_codes VALUES ('8732', '57');
INSERT INTO public.zip_codes VALUES ('8730', '57');
INSERT INTO public.zip_codes VALUES ('8727', '57');
INSERT INTO public.zip_codes VALUES ('8726', '57');
INSERT INTO public.zip_codes VALUES ('8725', '57');
INSERT INTO public.zip_codes VALUES ('8723', '57');
INSERT INTO public.zip_codes VALUES ('8722', '57');
INSERT INTO public.zip_codes VALUES ('8718', '57');
INSERT INTO public.zip_codes VALUES ('8717', '57');
INSERT INTO public.zip_codes VALUES ('8716', '57');
INSERT INTO public.zip_codes VALUES ('8715', '57');
INSERT INTO public.zip_codes VALUES ('8714', '6');
INSERT INTO public.zip_codes VALUES ('8713', '6');
INSERT INTO public.zip_codes VALUES ('8712', '6');
INSERT INTO public.zip_codes VALUES ('8708', '6');
INSERT INTO public.zip_codes VALUES ('8707', '6');
INSERT INTO public.zip_codes VALUES ('8706', '6');
INSERT INTO public.zip_codes VALUES ('8704', '6');
INSERT INTO public.zip_codes VALUES ('8703', '6');
INSERT INTO public.zip_codes VALUES ('8702', '6');
INSERT INTO public.zip_codes VALUES ('8700', '6');
INSERT INTO public.zip_codes VALUES ('8646', '57');
INSERT INTO public.zip_codes VALUES ('8645', '57');
INSERT INTO public.zip_codes VALUES ('8640', '57');
INSERT INTO public.zip_codes VALUES ('8638', '57');
INSERT INTO public.zip_codes VALUES ('8637', '7');
INSERT INTO public.zip_codes VALUES ('8636', '7');
INSERT INTO public.zip_codes VALUES ('8635', '7');
INSERT INTO public.zip_codes VALUES ('8634', '6');
INSERT INTO public.zip_codes VALUES ('8633', '7');
INSERT INTO public.zip_codes VALUES ('8632', '7');
INSERT INTO public.zip_codes VALUES ('8630', '7');
INSERT INTO public.zip_codes VALUES ('8627', '7');
INSERT INTO public.zip_codes VALUES ('8626', '7');
INSERT INTO public.zip_codes VALUES ('8625', '7');
INSERT INTO public.zip_codes VALUES ('8624', '7');
INSERT INTO public.zip_codes VALUES ('8623', '7');
INSERT INTO public.zip_codes VALUES ('8620', '7');
INSERT INTO public.zip_codes VALUES ('8618', '6');
INSERT INTO public.zip_codes VALUES ('8617', '7');
INSERT INTO public.zip_codes VALUES ('8616', '7');
INSERT INTO public.zip_codes VALUES ('8615', '7');
INSERT INTO public.zip_codes VALUES ('8614', '7');
INSERT INTO public.zip_codes VALUES ('8610', '7');
INSERT INTO public.zip_codes VALUES ('8608', '7');
INSERT INTO public.zip_codes VALUES ('8607', '7');
INSERT INTO public.zip_codes VALUES ('8606', '7');
INSERT INTO public.zip_codes VALUES ('8605', '2');
INSERT INTO public.zip_codes VALUES ('8604', '2');
INSERT INTO public.zip_codes VALUES ('8603', '2');
INSERT INTO public.zip_codes VALUES ('8602', '2');
INSERT INTO public.zip_codes VALUES ('8600', '2');
INSERT INTO public.zip_codes VALUES ('8599', '78');
INSERT INTO public.zip_codes VALUES ('8598', '77');
INSERT INTO public.zip_codes VALUES ('8597', '77');
INSERT INTO public.zip_codes VALUES ('8596', '77');
INSERT INTO public.zip_codes VALUES ('8595', '77');
INSERT INTO public.zip_codes VALUES ('8594', '77');
INSERT INTO public.zip_codes VALUES ('8593', '78');
INSERT INTO public.zip_codes VALUES ('8592', '78');
INSERT INTO public.zip_codes VALUES ('8590', '78');
INSERT INTO public.zip_codes VALUES ('8589', '78');
INSERT INTO public.zip_codes VALUES ('8588', '78');
INSERT INTO public.zip_codes VALUES ('8587', '78');
INSERT INTO public.zip_codes VALUES ('8586', '78');
INSERT INTO public.zip_codes VALUES ('8585', '77');
INSERT INTO public.zip_codes VALUES ('8584', '76');
INSERT INTO public.zip_codes VALUES ('8583', '76');
INSERT INTO public.zip_codes VALUES ('8582', '78');
INSERT INTO public.zip_codes VALUES ('8581', '78');
INSERT INTO public.zip_codes VALUES ('8580', '78');
INSERT INTO public.zip_codes VALUES ('8577', '76');
INSERT INTO public.zip_codes VALUES ('8576', '76');
INSERT INTO public.zip_codes VALUES ('8575', '76');
INSERT INTO public.zip_codes VALUES ('8574', '77');
INSERT INTO public.zip_codes VALUES ('8573', '77');
INSERT INTO public.zip_codes VALUES ('8572', '76');
INSERT INTO public.zip_codes VALUES ('8570', '76');
INSERT INTO public.zip_codes VALUES ('8566', '77');
INSERT INTO public.zip_codes VALUES ('8565', '77');
INSERT INTO public.zip_codes VALUES ('8564', '77');
INSERT INTO public.zip_codes VALUES ('8561', '76');
INSERT INTO public.zip_codes VALUES ('8560', '76');
INSERT INTO public.zip_codes VALUES ('8558', '76');
INSERT INTO public.zip_codes VALUES ('8556', '76');
INSERT INTO public.zip_codes VALUES ('8555', '76');
INSERT INTO public.zip_codes VALUES ('8554', '76');
INSERT INTO public.zip_codes VALUES ('8553', '76');
INSERT INTO public.zip_codes VALUES ('8552', '76');
INSERT INTO public.zip_codes VALUES ('8548', '8');
INSERT INTO public.zip_codes VALUES ('8547', '76');
INSERT INTO public.zip_codes VALUES ('8546', '76');
INSERT INTO public.zip_codes VALUES ('8545', '8');
INSERT INTO public.zip_codes VALUES ('8544', '8');
INSERT INTO public.zip_codes VALUES ('8543', '8');
INSERT INTO public.zip_codes VALUES ('8542', '8');
INSERT INTO public.zip_codes VALUES ('8537', '76');
INSERT INTO public.zip_codes VALUES ('8536', '76');
INSERT INTO public.zip_codes VALUES ('8535', '76');
INSERT INTO public.zip_codes VALUES ('8532', '76');
INSERT INTO public.zip_codes VALUES ('8526', '76');
INSERT INTO public.zip_codes VALUES ('8525', '76');
INSERT INTO public.zip_codes VALUES ('8524', '76');
INSERT INTO public.zip_codes VALUES ('8523', '8');
INSERT INTO public.zip_codes VALUES ('8522', '76');
INSERT INTO public.zip_codes VALUES ('8514', '76');
INSERT INTO public.zip_codes VALUES ('8512', '76');
INSERT INTO public.zip_codes VALUES ('8508', '76');
INSERT INTO public.zip_codes VALUES ('8507', '76');
INSERT INTO public.zip_codes VALUES ('8506', '76');
INSERT INTO public.zip_codes VALUES ('8505', '76');
INSERT INTO public.zip_codes VALUES ('8500', '76');
INSERT INTO public.zip_codes VALUES ('8499', '7');
INSERT INTO public.zip_codes VALUES ('8498', '7');
INSERT INTO public.zip_codes VALUES ('8497', '7');
INSERT INTO public.zip_codes VALUES ('8496', '7');
INSERT INTO public.zip_codes VALUES ('8495', '8');
INSERT INTO public.zip_codes VALUES ('8494', '7');
INSERT INTO public.zip_codes VALUES ('8493', '7');
INSERT INTO public.zip_codes VALUES ('8492', '7');
INSERT INTO public.zip_codes VALUES ('8489', '7');
INSERT INTO public.zip_codes VALUES ('8488', '8');
INSERT INTO public.zip_codes VALUES ('8487', '8');
INSERT INTO public.zip_codes VALUES ('8486', '8');
INSERT INTO public.zip_codes VALUES ('8484', '8');
INSERT INTO public.zip_codes VALUES ('8483', '8');
INSERT INTO public.zip_codes VALUES ('8482', '8');
INSERT INTO public.zip_codes VALUES ('8479', '9');
INSERT INTO public.zip_codes VALUES ('8478', '9');
INSERT INTO public.zip_codes VALUES ('8477', '9');
INSERT INTO public.zip_codes VALUES ('8476', '9');
INSERT INTO public.zip_codes VALUES ('8475', '9');
INSERT INTO public.zip_codes VALUES ('8474', '8');
INSERT INTO public.zip_codes VALUES ('8472', '8');
INSERT INTO public.zip_codes VALUES ('8471', '8');
INSERT INTO public.zip_codes VALUES ('8468', '9');
INSERT INTO public.zip_codes VALUES ('8467', '9');
INSERT INTO public.zip_codes VALUES ('8466', '9');
INSERT INTO public.zip_codes VALUES ('8465', '9');
INSERT INTO public.zip_codes VALUES ('8464', '9');
INSERT INTO public.zip_codes VALUES ('8463', '9');
INSERT INTO public.zip_codes VALUES ('8462', '9');
INSERT INTO public.zip_codes VALUES ('8461', '9');
INSERT INTO public.zip_codes VALUES ('8460', '9');
INSERT INTO public.zip_codes VALUES ('8459', '9');
INSERT INTO public.zip_codes VALUES ('8458', '9');
INSERT INTO public.zip_codes VALUES ('8457', '9');
INSERT INTO public.zip_codes VALUES ('8455', '50');
INSERT INTO public.zip_codes VALUES ('8454', '50');
INSERT INTO public.zip_codes VALUES ('8453', '9');
INSERT INTO public.zip_codes VALUES ('8452', '9');
INSERT INTO public.zip_codes VALUES ('8451', '9');
INSERT INTO public.zip_codes VALUES ('8450', '9');
INSERT INTO public.zip_codes VALUES ('8447', '9');
INSERT INTO public.zip_codes VALUES ('8444', '9');
INSERT INTO public.zip_codes VALUES ('8442', '8');
INSERT INTO public.zip_codes VALUES ('8428', '10');
INSERT INTO public.zip_codes VALUES ('8427', '10');
INSERT INTO public.zip_codes VALUES ('8426', '10');
INSERT INTO public.zip_codes VALUES ('8425', '10');
INSERT INTO public.zip_codes VALUES ('8424', '10');
INSERT INTO public.zip_codes VALUES ('8422', '8');
INSERT INTO public.zip_codes VALUES ('8421', '8');
INSERT INTO public.zip_codes VALUES ('8418', '8');
INSERT INTO public.zip_codes VALUES ('8416', '9');
INSERT INTO public.zip_codes VALUES ('8415', '9');
INSERT INTO public.zip_codes VALUES ('8414', '9');
INSERT INTO public.zip_codes VALUES ('8413', '8');
INSERT INTO public.zip_codes VALUES ('8412', '8');
INSERT INTO public.zip_codes VALUES ('8409', '8');
INSERT INTO public.zip_codes VALUES ('8408', '8');
INSERT INTO public.zip_codes VALUES ('8406', '8');
INSERT INTO public.zip_codes VALUES ('8405', '8');
INSERT INTO public.zip_codes VALUES ('8404', '8');
INSERT INTO public.zip_codes VALUES ('8400', '8');
INSERT INTO public.zip_codes VALUES ('8376', '59');
INSERT INTO public.zip_codes VALUES ('8374', '59');
INSERT INTO public.zip_codes VALUES ('8372', '59');
INSERT INTO public.zip_codes VALUES ('8371', '59');
INSERT INTO public.zip_codes VALUES ('8370', '59');
INSERT INTO public.zip_codes VALUES ('8363', '59');
INSERT INTO public.zip_codes VALUES ('8362', '59');
INSERT INTO public.zip_codes VALUES ('8360', '59');
INSERT INTO public.zip_codes VALUES ('8357', '76');
INSERT INTO public.zip_codes VALUES ('8356', '76');
INSERT INTO public.zip_codes VALUES ('8355', '76');
INSERT INTO public.zip_codes VALUES ('8354', '8');
INSERT INTO public.zip_codes VALUES ('8353', '8');
INSERT INTO public.zip_codes VALUES ('8352', '8');
INSERT INTO public.zip_codes VALUES ('8345', '7');
INSERT INTO public.zip_codes VALUES ('8344', '7');
INSERT INTO public.zip_codes VALUES ('8342', '7');
INSERT INTO public.zip_codes VALUES ('8340', '7');
INSERT INTO public.zip_codes VALUES ('8335', '7');
INSERT INTO public.zip_codes VALUES ('8332', '7');
INSERT INTO public.zip_codes VALUES ('8331', '7');
INSERT INTO public.zip_codes VALUES ('8330', '7');
INSERT INTO public.zip_codes VALUES ('8322', '7');
INSERT INTO public.zip_codes VALUES ('8320', '7');
INSERT INTO public.zip_codes VALUES ('8317', '8');
INSERT INTO public.zip_codes VALUES ('8315', '8');
INSERT INTO public.zip_codes VALUES ('8314', '8');
INSERT INTO public.zip_codes VALUES ('8312', '8');
INSERT INTO public.zip_codes VALUES ('8311', '8');
INSERT INTO public.zip_codes VALUES ('8310', '8');
INSERT INTO public.zip_codes VALUES ('8309', '2');
INSERT INTO public.zip_codes VALUES ('8308', '8');
INSERT INTO public.zip_codes VALUES ('8307', '8');
INSERT INTO public.zip_codes VALUES ('8306', '2');
INSERT INTO public.zip_codes VALUES ('8305', '2');
INSERT INTO public.zip_codes VALUES ('8304', '2');
INSERT INTO public.zip_codes VALUES ('8303', '2');
INSERT INTO public.zip_codes VALUES ('8302', '2');
INSERT INTO public.zip_codes VALUES ('8280', '77');
INSERT INTO public.zip_codes VALUES ('8274', '77');
INSERT INTO public.zip_codes VALUES ('8273', '77');
INSERT INTO public.zip_codes VALUES ('8272', '77');
INSERT INTO public.zip_codes VALUES ('8269', '77');
INSERT INTO public.zip_codes VALUES ('8268', '77');
INSERT INTO public.zip_codes VALUES ('8267', '77');
INSERT INTO public.zip_codes VALUES ('8266', '77');
INSERT INTO public.zip_codes VALUES ('8265', '77');
INSERT INTO public.zip_codes VALUES ('8264', '77');
INSERT INTO public.zip_codes VALUES ('8263', '50');
INSERT INTO public.zip_codes VALUES ('8262', '50');
INSERT INTO public.zip_codes VALUES ('8261', '50');
INSERT INTO public.zip_codes VALUES ('8260', '50');
INSERT INTO public.zip_codes VALUES ('8259', '77');
INSERT INTO public.zip_codes VALUES ('8255', '77');
INSERT INTO public.zip_codes VALUES ('8254', '77');
INSERT INTO public.zip_codes VALUES ('8253', '77');
INSERT INTO public.zip_codes VALUES ('8252', '77');
INSERT INTO public.zip_codes VALUES ('8248', '9');
INSERT INTO public.zip_codes VALUES ('8247', '9');
INSERT INTO public.zip_codes VALUES ('8246', '9');
INSERT INTO public.zip_codes VALUES ('8245', '9');
INSERT INTO public.zip_codes VALUES ('8243', '50');
INSERT INTO public.zip_codes VALUES ('8242', '50');
INSERT INTO public.zip_codes VALUES ('8241', '50');
INSERT INTO public.zip_codes VALUES ('8240', '50');
INSERT INTO public.zip_codes VALUES ('8239', '50');
INSERT INTO public.zip_codes VALUES ('8236', '50');
INSERT INTO public.zip_codes VALUES ('8235', '50');
INSERT INTO public.zip_codes VALUES ('8234', '50');
INSERT INTO public.zip_codes VALUES ('8233', '50');
INSERT INTO public.zip_codes VALUES ('8232', '50');
INSERT INTO public.zip_codes VALUES ('8231', '50');
INSERT INTO public.zip_codes VALUES ('8228', '50');
INSERT INTO public.zip_codes VALUES ('8226', '50');
INSERT INTO public.zip_codes VALUES ('8225', '50');
INSERT INTO public.zip_codes VALUES ('8224', '50');
INSERT INTO public.zip_codes VALUES ('8223', '50');
INSERT INTO public.zip_codes VALUES ('8222', '50');
INSERT INTO public.zip_codes VALUES ('8219', '50');
INSERT INTO public.zip_codes VALUES ('8218', '50');
INSERT INTO public.zip_codes VALUES ('8217', '50');
INSERT INTO public.zip_codes VALUES ('8216', '50');
INSERT INTO public.zip_codes VALUES ('8215', '50');
INSERT INTO public.zip_codes VALUES ('8214', '50');
INSERT INTO public.zip_codes VALUES ('8213', '50');
INSERT INTO public.zip_codes VALUES ('8212', '50');
INSERT INTO public.zip_codes VALUES ('8207', '50');
INSERT INTO public.zip_codes VALUES ('8203', '50');
INSERT INTO public.zip_codes VALUES ('8200', '50');
INSERT INTO public.zip_codes VALUES ('8197', '10');
INSERT INTO public.zip_codes VALUES ('8196', '10');
INSERT INTO public.zip_codes VALUES ('8195', '10');
INSERT INTO public.zip_codes VALUES ('8194', '10');
INSERT INTO public.zip_codes VALUES ('8193', '10');
INSERT INTO public.zip_codes VALUES ('8192', '10');
INSERT INTO public.zip_codes VALUES ('8187', '10');
INSERT INTO public.zip_codes VALUES ('8185', '10');
INSERT INTO public.zip_codes VALUES ('8184', '10');
INSERT INTO public.zip_codes VALUES ('8182', '10');
INSERT INTO public.zip_codes VALUES ('8181', '10');
INSERT INTO public.zip_codes VALUES ('8180', '10');
INSERT INTO public.zip_codes VALUES ('8175', '10');
INSERT INTO public.zip_codes VALUES ('8174', '10');
INSERT INTO public.zip_codes VALUES ('8173', '10');
INSERT INTO public.zip_codes VALUES ('8172', '10');
INSERT INTO public.zip_codes VALUES ('8166', '10');
INSERT INTO public.zip_codes VALUES ('8165', '10');
INSERT INTO public.zip_codes VALUES ('8164', '10');
INSERT INTO public.zip_codes VALUES ('8162', '10');
INSERT INTO public.zip_codes VALUES ('8158', '10');
INSERT INTO public.zip_codes VALUES ('8157', '10');
INSERT INTO public.zip_codes VALUES ('8156', '10');
INSERT INTO public.zip_codes VALUES ('8155', '10');
INSERT INTO public.zip_codes VALUES ('8154', '10');
INSERT INTO public.zip_codes VALUES ('8153', '2');
INSERT INTO public.zip_codes VALUES ('8152', '2');
INSERT INTO public.zip_codes VALUES ('8143', '4');
INSERT INTO public.zip_codes VALUES ('8142', '3');
INSERT INTO public.zip_codes VALUES ('8136', '5');
INSERT INTO public.zip_codes VALUES ('8135', '5');
INSERT INTO public.zip_codes VALUES ('8134', '5');
INSERT INTO public.zip_codes VALUES ('8133', '6');
INSERT INTO public.zip_codes VALUES ('8132', '6');
INSERT INTO public.zip_codes VALUES ('8127', '2');
INSERT INTO public.zip_codes VALUES ('8126', '6');
INSERT INTO public.zip_codes VALUES ('8125', '6');
INSERT INTO public.zip_codes VALUES ('8124', '2');
INSERT INTO public.zip_codes VALUES ('8123', '2');
INSERT INTO public.zip_codes VALUES ('8122', '2');
INSERT INTO public.zip_codes VALUES ('8121', '2');
INSERT INTO public.zip_codes VALUES ('8118', '2');
INSERT INTO public.zip_codes VALUES ('8117', '2');
INSERT INTO public.zip_codes VALUES ('8115', '2');
INSERT INTO public.zip_codes VALUES ('8114', '2');
INSERT INTO public.zip_codes VALUES ('8113', '2');
INSERT INTO public.zip_codes VALUES ('8112', '2');
INSERT INTO public.zip_codes VALUES ('8109', '72');
INSERT INTO public.zip_codes VALUES ('8108', '2');
INSERT INTO public.zip_codes VALUES ('8107', '2');
INSERT INTO public.zip_codes VALUES ('8106', '2');
INSERT INTO public.zip_codes VALUES ('8105', '2');
INSERT INTO public.zip_codes VALUES ('8104', '3');
INSERT INTO public.zip_codes VALUES ('8103', '3');
INSERT INTO public.zip_codes VALUES ('8102', '3');
INSERT INTO public.zip_codes VALUES ('8064', '1');
INSERT INTO public.zip_codes VALUES ('8057', '1');
INSERT INTO public.zip_codes VALUES ('8055', '1');
INSERT INTO public.zip_codes VALUES ('8053', '1');
INSERT INTO public.zip_codes VALUES ('8052', '1');
INSERT INTO public.zip_codes VALUES ('8051', '1');
INSERT INTO public.zip_codes VALUES ('8050', '1');
INSERT INTO public.zip_codes VALUES ('8049', '1');
INSERT INTO public.zip_codes VALUES ('8048', '1');
INSERT INTO public.zip_codes VALUES ('8047', '1');
INSERT INTO public.zip_codes VALUES ('8046', '1');
INSERT INTO public.zip_codes VALUES ('8045', '1');
INSERT INTO public.zip_codes VALUES ('8044', '1');
INSERT INTO public.zip_codes VALUES ('8041', '1');
INSERT INTO public.zip_codes VALUES ('8038', '1');
INSERT INTO public.zip_codes VALUES ('8037', '1');
INSERT INTO public.zip_codes VALUES ('8032', '1');
INSERT INTO public.zip_codes VALUES ('8008', '1');
INSERT INTO public.zip_codes VALUES ('8006', '1');
INSERT INTO public.zip_codes VALUES ('8005', '1');
INSERT INTO public.zip_codes VALUES ('8004', '1');
INSERT INTO public.zip_codes VALUES ('8003', '1');
INSERT INTO public.zip_codes VALUES ('8002', '1');
INSERT INTO public.zip_codes VALUES ('8001', '1');
INSERT INTO public.zip_codes VALUES ('7748', '68');
INSERT INTO public.zip_codes VALUES ('7747', '68');
INSERT INTO public.zip_codes VALUES ('7746', '68');
INSERT INTO public.zip_codes VALUES ('7745', '68');
INSERT INTO public.zip_codes VALUES ('7744', '68');
INSERT INTO public.zip_codes VALUES ('7743', '68');
INSERT INTO public.zip_codes VALUES ('7742', '68');
INSERT INTO public.zip_codes VALUES ('7741', '68');
INSERT INTO public.zip_codes VALUES ('7710', '68');
INSERT INTO public.zip_codes VALUES ('7610', '68');
INSERT INTO public.zip_codes VALUES ('7608', '68');
INSERT INTO public.zip_codes VALUES ('7606', '68');
INSERT INTO public.zip_codes VALUES ('7605', '68');
INSERT INTO public.zip_codes VALUES ('7604', '68');
INSERT INTO public.zip_codes VALUES ('7603', '68');
INSERT INTO public.zip_codes VALUES ('7602', '68');
INSERT INTO public.zip_codes VALUES ('7563', '67');
INSERT INTO public.zip_codes VALUES ('7562', '67');
INSERT INTO public.zip_codes VALUES ('7560', '67');
INSERT INTO public.zip_codes VALUES ('7559', '67');
INSERT INTO public.zip_codes VALUES ('7558', '67');
INSERT INTO public.zip_codes VALUES ('7557', '67');
INSERT INTO public.zip_codes VALUES ('7556', '67');
INSERT INTO public.zip_codes VALUES ('7554', '67');
INSERT INTO public.zip_codes VALUES ('7553', '67');
INSERT INTO public.zip_codes VALUES ('7552', '67');
INSERT INTO public.zip_codes VALUES ('7551', '67');
INSERT INTO public.zip_codes VALUES ('7550', '67');
INSERT INTO public.zip_codes VALUES ('7546', '67');
INSERT INTO public.zip_codes VALUES ('7545', '67');
INSERT INTO public.zip_codes VALUES ('7543', '67');
INSERT INTO public.zip_codes VALUES ('7542', '67');
INSERT INTO public.zip_codes VALUES ('7537', '67');
INSERT INTO public.zip_codes VALUES ('7536', '67');
INSERT INTO public.zip_codes VALUES ('7535', '67');
INSERT INTO public.zip_codes VALUES ('7534', '67');
INSERT INTO public.zip_codes VALUES ('7533', '67');
INSERT INTO public.zip_codes VALUES ('7532', '67');
INSERT INTO public.zip_codes VALUES ('7530', '67');
INSERT INTO public.zip_codes VALUES ('7527', '67');
INSERT INTO public.zip_codes VALUES ('7526', '68');
INSERT INTO public.zip_codes VALUES ('7525', '68');
INSERT INTO public.zip_codes VALUES ('7524', '68');
INSERT INTO public.zip_codes VALUES ('7523', '68');
INSERT INTO public.zip_codes VALUES ('7522', '68');
INSERT INTO public.zip_codes VALUES ('7517', '68');
INSERT INTO public.zip_codes VALUES ('7516', '68');
INSERT INTO public.zip_codes VALUES ('7515', '68');
INSERT INTO public.zip_codes VALUES ('7514', '68');
INSERT INTO public.zip_codes VALUES ('7513', '68');
INSERT INTO public.zip_codes VALUES ('7512', '68');
INSERT INTO public.zip_codes VALUES ('7505', '68');
INSERT INTO public.zip_codes VALUES ('7504', '68');
INSERT INTO public.zip_codes VALUES ('7503', '68');
INSERT INTO public.zip_codes VALUES ('7502', '68');
INSERT INTO public.zip_codes VALUES ('7500', '68');
INSERT INTO public.zip_codes VALUES ('7494', '62');
INSERT INTO public.zip_codes VALUES ('7493', '64');
INSERT INTO public.zip_codes VALUES ('7492', '64');
INSERT INTO public.zip_codes VALUES ('7484', '64');
INSERT INTO public.zip_codes VALUES ('7482', '64');
INSERT INTO public.zip_codes VALUES ('7477', '64');
INSERT INTO public.zip_codes VALUES ('7473', '64');
INSERT INTO public.zip_codes VALUES ('7472', '64');
INSERT INTO public.zip_codes VALUES ('7464', '64');
INSERT INTO public.zip_codes VALUES ('7463', '64');
INSERT INTO public.zip_codes VALUES ('7462', '64');
INSERT INTO public.zip_codes VALUES ('7460', '64');
INSERT INTO public.zip_codes VALUES ('7459', '64');
INSERT INTO public.zip_codes VALUES ('7458', '64');
INSERT INTO public.zip_codes VALUES ('7457', '64');
INSERT INTO public.zip_codes VALUES ('7456', '64');
INSERT INTO public.zip_codes VALUES ('7455', '64');
INSERT INTO public.zip_codes VALUES ('7454', '64');
INSERT INTO public.zip_codes VALUES ('7453', '64');
INSERT INTO public.zip_codes VALUES ('7452', '64');
INSERT INTO public.zip_codes VALUES ('7451', '64');
INSERT INTO public.zip_codes VALUES ('7450', '64');
INSERT INTO public.zip_codes VALUES ('7448', '65');
INSERT INTO public.zip_codes VALUES ('7447', '65');
INSERT INTO public.zip_codes VALUES ('7446', '65');
INSERT INTO public.zip_codes VALUES ('7445', '65');
INSERT INTO public.zip_codes VALUES ('7444', '65');
INSERT INTO public.zip_codes VALUES ('7443', '65');
INSERT INTO public.zip_codes VALUES ('7442', '65');
INSERT INTO public.zip_codes VALUES ('7440', '65');
INSERT INTO public.zip_codes VALUES ('7438', '65');
INSERT INTO public.zip_codes VALUES ('7437', '65');
INSERT INTO public.zip_codes VALUES ('7436', '65');
INSERT INTO public.zip_codes VALUES ('7435', '65');
INSERT INTO public.zip_codes VALUES ('7434', '65');
INSERT INTO public.zip_codes VALUES ('7433', '65');
INSERT INTO public.zip_codes VALUES ('7432', '65');
INSERT INTO public.zip_codes VALUES ('7431', '65');
INSERT INTO public.zip_codes VALUES ('7430', '65');
INSERT INTO public.zip_codes VALUES ('7428', '65');
INSERT INTO public.zip_codes VALUES ('7427', '65');
INSERT INTO public.zip_codes VALUES ('7426', '65');
INSERT INTO public.zip_codes VALUES ('7425', '65');
INSERT INTO public.zip_codes VALUES ('7424', '65');
INSERT INTO public.zip_codes VALUES ('7423', '65');
INSERT INTO public.zip_codes VALUES ('7422', '65');
INSERT INTO public.zip_codes VALUES ('7421', '65');
INSERT INTO public.zip_codes VALUES ('7419', '65');
INSERT INTO public.zip_codes VALUES ('7418', '65');
INSERT INTO public.zip_codes VALUES ('7417', '65');
INSERT INTO public.zip_codes VALUES ('7416', '65');
INSERT INTO public.zip_codes VALUES ('7415', '65');
INSERT INTO public.zip_codes VALUES ('7414', '65');
INSERT INTO public.zip_codes VALUES ('7413', '65');
INSERT INTO public.zip_codes VALUES ('7412', '65');
INSERT INTO public.zip_codes VALUES ('7411', '65');
INSERT INTO public.zip_codes VALUES ('7408', '65');
INSERT INTO public.zip_codes VALUES ('7407', '65');
INSERT INTO public.zip_codes VALUES ('7405', '65');
INSERT INTO public.zip_codes VALUES ('7404', '65');
INSERT INTO public.zip_codes VALUES ('7403', '60');
INSERT INTO public.zip_codes VALUES ('7402', '60');
INSERT INTO public.zip_codes VALUES ('7326', '56');
INSERT INTO public.zip_codes VALUES ('7325', '56');
INSERT INTO public.zip_codes VALUES ('7324', '56');
INSERT INTO public.zip_codes VALUES ('7323', '56');
INSERT INTO public.zip_codes VALUES ('7320', '56');
INSERT INTO public.zip_codes VALUES ('7317', '56');
INSERT INTO public.zip_codes VALUES ('7315', '56');
INSERT INTO public.zip_codes VALUES ('7314', '56');
INSERT INTO public.zip_codes VALUES ('7313', '56');
INSERT INTO public.zip_codes VALUES ('7312', '56');
INSERT INTO public.zip_codes VALUES ('7310', '56');
INSERT INTO public.zip_codes VALUES ('7307', '60');
INSERT INTO public.zip_codes VALUES ('7306', '60');
INSERT INTO public.zip_codes VALUES ('7304', '60');
INSERT INTO public.zip_codes VALUES ('7303', '60');
INSERT INTO public.zip_codes VALUES ('7302', '60');
INSERT INTO public.zip_codes VALUES ('7278', '62');
INSERT INTO public.zip_codes VALUES ('7277', '62');
INSERT INTO public.zip_codes VALUES ('7276', '62');
INSERT INTO public.zip_codes VALUES ('7272', '62');
INSERT INTO public.zip_codes VALUES ('7270', '62');
INSERT INTO public.zip_codes VALUES ('7265', '62');
INSERT INTO public.zip_codes VALUES ('7260', '62');
INSERT INTO public.zip_codes VALUES ('7252', '61');
INSERT INTO public.zip_codes VALUES ('7250', '61');
INSERT INTO public.zip_codes VALUES ('7249', '61');
INSERT INTO public.zip_codes VALUES ('7247', '61');
INSERT INTO public.zip_codes VALUES ('7246', '61');
INSERT INTO public.zip_codes VALUES ('7245', '61');
INSERT INTO public.zip_codes VALUES ('7244', '61');
INSERT INTO public.zip_codes VALUES ('7243', '61');
INSERT INTO public.zip_codes VALUES ('7242', '61');
INSERT INTO public.zip_codes VALUES ('7241', '61');
INSERT INTO public.zip_codes VALUES ('7240', '61');
INSERT INTO public.zip_codes VALUES ('7235', '61');
INSERT INTO public.zip_codes VALUES ('7233', '61');
INSERT INTO public.zip_codes VALUES ('7232', '61');
INSERT INTO public.zip_codes VALUES ('7231', '61');
INSERT INTO public.zip_codes VALUES ('7228', '61');
INSERT INTO public.zip_codes VALUES ('7226', '61');
INSERT INTO public.zip_codes VALUES ('7224', '61');
INSERT INTO public.zip_codes VALUES ('7223', '61');
INSERT INTO public.zip_codes VALUES ('7222', '61');
INSERT INTO public.zip_codes VALUES ('7220', '61');
INSERT INTO public.zip_codes VALUES ('7215', '61');
INSERT INTO public.zip_codes VALUES ('7214', '61');
INSERT INTO public.zip_codes VALUES ('7213', '61');
INSERT INTO public.zip_codes VALUES ('7212', '61');
INSERT INTO public.zip_codes VALUES ('7208', '60');
INSERT INTO public.zip_codes VALUES ('7206', '60');
INSERT INTO public.zip_codes VALUES ('7205', '60');
INSERT INTO public.zip_codes VALUES ('7204', '60');
INSERT INTO public.zip_codes VALUES ('7203', '60');
INSERT INTO public.zip_codes VALUES ('7202', '60');
INSERT INTO public.zip_codes VALUES ('7189', '66');
INSERT INTO public.zip_codes VALUES ('7188', '66');
INSERT INTO public.zip_codes VALUES ('7187', '66');
INSERT INTO public.zip_codes VALUES ('7186', '66');
INSERT INTO public.zip_codes VALUES ('7185', '66');
INSERT INTO public.zip_codes VALUES ('7184', '66');
INSERT INTO public.zip_codes VALUES ('7183', '66');
INSERT INTO public.zip_codes VALUES ('7182', '66');
INSERT INTO public.zip_codes VALUES ('7180', '66');
INSERT INTO public.zip_codes VALUES ('7176', '66');
INSERT INTO public.zip_codes VALUES ('7175', '66');
INSERT INTO public.zip_codes VALUES ('7174', '66');
INSERT INTO public.zip_codes VALUES ('7173', '66');
INSERT INTO public.zip_codes VALUES ('7172', '66');
INSERT INTO public.zip_codes VALUES ('7168', '66');
INSERT INTO public.zip_codes VALUES ('7167', '66');
INSERT INTO public.zip_codes VALUES ('7166', '66');
INSERT INTO public.zip_codes VALUES ('7165', '66');
INSERT INTO public.zip_codes VALUES ('7164', '66');
INSERT INTO public.zip_codes VALUES ('7163', '66');
INSERT INTO public.zip_codes VALUES ('7162', '66');
INSERT INTO public.zip_codes VALUES ('7159', '66');
INSERT INTO public.zip_codes VALUES ('7158', '66');
INSERT INTO public.zip_codes VALUES ('7157', '66');
INSERT INTO public.zip_codes VALUES ('7156', '66');
INSERT INTO public.zip_codes VALUES ('7155', '66');
INSERT INTO public.zip_codes VALUES ('7154', '66');
INSERT INTO public.zip_codes VALUES ('7153', '66');
INSERT INTO public.zip_codes VALUES ('7152', '66');
INSERT INTO public.zip_codes VALUES ('7151', '66');
INSERT INTO public.zip_codes VALUES ('7149', '66');
INSERT INTO public.zip_codes VALUES ('7148', '66');
INSERT INTO public.zip_codes VALUES ('7147', '66');
INSERT INTO public.zip_codes VALUES ('7146', '66');
INSERT INTO public.zip_codes VALUES ('7145', '66');
INSERT INTO public.zip_codes VALUES ('7144', '66');
INSERT INTO public.zip_codes VALUES ('7143', '66');
INSERT INTO public.zip_codes VALUES ('7142', '66');
INSERT INTO public.zip_codes VALUES ('7141', '66');
INSERT INTO public.zip_codes VALUES ('7138', '66');
INSERT INTO public.zip_codes VALUES ('7137', '66');
INSERT INTO public.zip_codes VALUES ('7134', '66');
INSERT INTO public.zip_codes VALUES ('7132', '66');
INSERT INTO public.zip_codes VALUES ('7130', '66');
INSERT INTO public.zip_codes VALUES ('7128', '66');
INSERT INTO public.zip_codes VALUES ('7127', '66');
INSERT INTO public.zip_codes VALUES ('7126', '66');
INSERT INTO public.zip_codes VALUES ('7122', '66');
INSERT INTO public.zip_codes VALUES ('7116', '66');
INSERT INTO public.zip_codes VALUES ('7115', '66');
INSERT INTO public.zip_codes VALUES ('7114', '66');
INSERT INTO public.zip_codes VALUES ('7113', '66');
INSERT INTO public.zip_codes VALUES ('7112', '66');
INSERT INTO public.zip_codes VALUES ('7111', '66');
INSERT INTO public.zip_codes VALUES ('7110', '66');
INSERT INTO public.zip_codes VALUES ('7109', '66');
INSERT INTO public.zip_codes VALUES ('7107', '66');
INSERT INTO public.zip_codes VALUES ('7106', '66');
INSERT INTO public.zip_codes VALUES ('7104', '66');
INSERT INTO public.zip_codes VALUES ('7084', '64');
INSERT INTO public.zip_codes VALUES ('7083', '64');
INSERT INTO public.zip_codes VALUES ('7082', '64');
INSERT INTO public.zip_codes VALUES ('7078', '64');
INSERT INTO public.zip_codes VALUES ('7077', '64');
INSERT INTO public.zip_codes VALUES ('7076', '64');
INSERT INTO public.zip_codes VALUES ('7075', '64');
INSERT INTO public.zip_codes VALUES ('7074', '64');
INSERT INTO public.zip_codes VALUES ('7064', '63');
INSERT INTO public.zip_codes VALUES ('7063', '63');
INSERT INTO public.zip_codes VALUES ('7062', '64');
INSERT INTO public.zip_codes VALUES ('7058', '63');
INSERT INTO public.zip_codes VALUES ('7057', '63');
INSERT INTO public.zip_codes VALUES ('7056', '63');
INSERT INTO public.zip_codes VALUES ('7050', '63');
INSERT INTO public.zip_codes VALUES ('7032', '66');
INSERT INTO public.zip_codes VALUES ('7031', '66');
INSERT INTO public.zip_codes VALUES ('7029', '63');
INSERT INTO public.zip_codes VALUES ('7028', '63');
INSERT INTO public.zip_codes VALUES ('7027', '63');
INSERT INTO public.zip_codes VALUES ('7026', '60');
INSERT INTO public.zip_codes VALUES ('7023', '60');
INSERT INTO public.zip_codes VALUES ('7019', '66');
INSERT INTO public.zip_codes VALUES ('7018', '66');
INSERT INTO public.zip_codes VALUES ('7017', '66');
INSERT INTO public.zip_codes VALUES ('7016', '66');
INSERT INTO public.zip_codes VALUES ('7015', '60');
INSERT INTO public.zip_codes VALUES ('7014', '66');
INSERT INTO public.zip_codes VALUES ('7013', '60');
INSERT INTO public.zip_codes VALUES ('7012', '60');
INSERT INTO public.zip_codes VALUES ('7000', '60');
INSERT INTO public.zip_codes VALUES ('6999', '82');
INSERT INTO public.zip_codes VALUES ('6998', '82');
INSERT INTO public.zip_codes VALUES ('6997', '82');
INSERT INTO public.zip_codes VALUES ('6995', '82');
INSERT INTO public.zip_codes VALUES ('6994', '82');
INSERT INTO public.zip_codes VALUES ('6993', '82');
INSERT INTO public.zip_codes VALUES ('6992', '82');
INSERT INTO public.zip_codes VALUES ('6991', '82');
INSERT INTO public.zip_codes VALUES ('6990', '82');
INSERT INTO public.zip_codes VALUES ('6989', '82');
INSERT INTO public.zip_codes VALUES ('6988', '82');
INSERT INTO public.zip_codes VALUES ('6987', '82');
INSERT INTO public.zip_codes VALUES ('6986', '82');
INSERT INTO public.zip_codes VALUES ('6984', '82');
INSERT INTO public.zip_codes VALUES ('6983', '82');
INSERT INTO public.zip_codes VALUES ('6982', '82');
INSERT INTO public.zip_codes VALUES ('6981', '82');
INSERT INTO public.zip_codes VALUES ('6980', '82');
INSERT INTO public.zip_codes VALUES ('6979', '82');
INSERT INTO public.zip_codes VALUES ('6978', '82');
INSERT INTO public.zip_codes VALUES ('6977', '82');
INSERT INTO public.zip_codes VALUES ('6976', '82');
INSERT INTO public.zip_codes VALUES ('6974', '82');
INSERT INTO public.zip_codes VALUES ('6968', '82');
INSERT INTO public.zip_codes VALUES ('6967', '82');
INSERT INTO public.zip_codes VALUES ('6966', '82');
INSERT INTO public.zip_codes VALUES ('6965', '82');
INSERT INTO public.zip_codes VALUES ('6964', '82');
INSERT INTO public.zip_codes VALUES ('6963', '82');
INSERT INTO public.zip_codes VALUES ('6962', '82');
INSERT INTO public.zip_codes VALUES ('6960', '82');
INSERT INTO public.zip_codes VALUES ('6959', '82');
INSERT INTO public.zip_codes VALUES ('6958', '82');
INSERT INTO public.zip_codes VALUES ('6957', '82');
INSERT INTO public.zip_codes VALUES ('6956', '82');
INSERT INTO public.zip_codes VALUES ('6955', '82');
INSERT INTO public.zip_codes VALUES ('6954', '82');
INSERT INTO public.zip_codes VALUES ('6953', '82');
INSERT INTO public.zip_codes VALUES ('6952', '82');
INSERT INTO public.zip_codes VALUES ('6951', '82');
INSERT INTO public.zip_codes VALUES ('6950', '82');
INSERT INTO public.zip_codes VALUES ('6949', '82');
INSERT INTO public.zip_codes VALUES ('6948', '82');
INSERT INTO public.zip_codes VALUES ('6947', '82');
INSERT INTO public.zip_codes VALUES ('6946', '82');
INSERT INTO public.zip_codes VALUES ('6945', '82');
INSERT INTO public.zip_codes VALUES ('6944', '82');
INSERT INTO public.zip_codes VALUES ('6943', '82');
INSERT INTO public.zip_codes VALUES ('6942', '82');
INSERT INTO public.zip_codes VALUES ('6939', '82');
INSERT INTO public.zip_codes VALUES ('6938', '82');
INSERT INTO public.zip_codes VALUES ('6937', '82');
INSERT INTO public.zip_codes VALUES ('6936', '82');
INSERT INTO public.zip_codes VALUES ('6935', '82');
INSERT INTO public.zip_codes VALUES ('6934', '82');
INSERT INTO public.zip_codes VALUES ('6933', '82');
INSERT INTO public.zip_codes VALUES ('6932', '82');
INSERT INTO public.zip_codes VALUES ('6930', '82');
INSERT INTO public.zip_codes VALUES ('6929', '82');
INSERT INTO public.zip_codes VALUES ('6928', '82');
INSERT INTO public.zip_codes VALUES ('6927', '82');
INSERT INTO public.zip_codes VALUES ('6926', '82');
INSERT INTO public.zip_codes VALUES ('6925', '82');
INSERT INTO public.zip_codes VALUES ('6924', '82');
INSERT INTO public.zip_codes VALUES ('6922', '82');
INSERT INTO public.zip_codes VALUES ('6921', '82');
INSERT INTO public.zip_codes VALUES ('6919', '82');
INSERT INTO public.zip_codes VALUES ('6918', '82');
INSERT INTO public.zip_codes VALUES ('6917', '82');
INSERT INTO public.zip_codes VALUES ('6916', '82');
INSERT INTO public.zip_codes VALUES ('6915', '82');
INSERT INTO public.zip_codes VALUES ('6914', '82');
INSERT INTO public.zip_codes VALUES ('6913', '82');
INSERT INTO public.zip_codes VALUES ('6912', '82');
INSERT INTO public.zip_codes VALUES ('6900', '82');
INSERT INTO public.zip_codes VALUES ('6883', '83');
INSERT INTO public.zip_codes VALUES ('6877', '83');
INSERT INTO public.zip_codes VALUES ('6875', '83');
INSERT INTO public.zip_codes VALUES ('6874', '83');
INSERT INTO public.zip_codes VALUES ('6873', '83');
INSERT INTO public.zip_codes VALUES ('6872', '83');
INSERT INTO public.zip_codes VALUES ('6867', '83');
INSERT INTO public.zip_codes VALUES ('6866', '83');
INSERT INTO public.zip_codes VALUES ('6865', '83');
INSERT INTO public.zip_codes VALUES ('6864', '83');
INSERT INTO public.zip_codes VALUES ('6863', '83');
INSERT INTO public.zip_codes VALUES ('6862', '83');
INSERT INTO public.zip_codes VALUES ('6855', '83');
INSERT INTO public.zip_codes VALUES ('6854', '83');
INSERT INTO public.zip_codes VALUES ('6853', '83');
INSERT INTO public.zip_codes VALUES ('6852', '83');
INSERT INTO public.zip_codes VALUES ('6850', '83');
INSERT INTO public.zip_codes VALUES ('6839', '83');
INSERT INTO public.zip_codes VALUES ('6838', '83');
INSERT INTO public.zip_codes VALUES ('6837', '83');
INSERT INTO public.zip_codes VALUES ('6835', '83');
INSERT INTO public.zip_codes VALUES ('6834', '83');
INSERT INTO public.zip_codes VALUES ('6833', '83');
INSERT INTO public.zip_codes VALUES ('6832', '83');
INSERT INTO public.zip_codes VALUES ('6830', '83');
INSERT INTO public.zip_codes VALUES ('6828', '83');
INSERT INTO public.zip_codes VALUES ('6827', '83');
INSERT INTO public.zip_codes VALUES ('6826', '83');
INSERT INTO public.zip_codes VALUES ('6825', '83');
INSERT INTO public.zip_codes VALUES ('6823', '82');
INSERT INTO public.zip_codes VALUES ('6822', '83');
INSERT INTO public.zip_codes VALUES ('6821', '83');
INSERT INTO public.zip_codes VALUES ('6818', '83');
INSERT INTO public.zip_codes VALUES ('6817', '83');
INSERT INTO public.zip_codes VALUES ('6816', '83');
INSERT INTO public.zip_codes VALUES ('6815', '82');
INSERT INTO public.zip_codes VALUES ('6814', '82');
INSERT INTO public.zip_codes VALUES ('6810', '82');
INSERT INTO public.zip_codes VALUES ('6809', '82');
INSERT INTO public.zip_codes VALUES ('6808', '82');
INSERT INTO public.zip_codes VALUES ('6807', '82');
INSERT INTO public.zip_codes VALUES ('6806', '82');
INSERT INTO public.zip_codes VALUES ('6805', '82');
INSERT INTO public.zip_codes VALUES ('6804', '82');
INSERT INTO public.zip_codes VALUES ('6803', '82');
INSERT INTO public.zip_codes VALUES ('6802', '82');
INSERT INTO public.zip_codes VALUES ('6781', '79');
INSERT INTO public.zip_codes VALUES ('6780', '79');
INSERT INTO public.zip_codes VALUES ('6777', '79');
INSERT INTO public.zip_codes VALUES ('6776', '79');
INSERT INTO public.zip_codes VALUES ('6775', '79');
INSERT INTO public.zip_codes VALUES ('6774', '79');
INSERT INTO public.zip_codes VALUES ('6773', '79');
INSERT INTO public.zip_codes VALUES ('6772', '79');
INSERT INTO public.zip_codes VALUES ('6764', '79');
INSERT INTO public.zip_codes VALUES ('6763', '79');
INSERT INTO public.zip_codes VALUES ('6760', '79');
INSERT INTO public.zip_codes VALUES ('6749', '79');
INSERT INTO public.zip_codes VALUES ('6748', '79');
INSERT INTO public.zip_codes VALUES ('6747', '79');
INSERT INTO public.zip_codes VALUES ('6746', '79');
INSERT INTO public.zip_codes VALUES ('6745', '79');
INSERT INTO public.zip_codes VALUES ('6744', '79');
INSERT INTO public.zip_codes VALUES ('6743', '79');
INSERT INTO public.zip_codes VALUES ('6742', '79');
INSERT INTO public.zip_codes VALUES ('6724', '79');
INSERT INTO public.zip_codes VALUES ('6723', '79');
INSERT INTO public.zip_codes VALUES ('6722', '79');
INSERT INTO public.zip_codes VALUES ('6721', '79');
INSERT INTO public.zip_codes VALUES ('6720', '79');
INSERT INTO public.zip_codes VALUES ('6719', '79');
INSERT INTO public.zip_codes VALUES ('6718', '79');
INSERT INTO public.zip_codes VALUES ('6717', '79');
INSERT INTO public.zip_codes VALUES ('6716', '79');
INSERT INTO public.zip_codes VALUES ('6715', '79');
INSERT INTO public.zip_codes VALUES ('6714', '79');
INSERT INTO public.zip_codes VALUES ('6713', '79');
INSERT INTO public.zip_codes VALUES ('6710', '79');
INSERT INTO public.zip_codes VALUES ('6707', '79');
INSERT INTO public.zip_codes VALUES ('6705', '79');
INSERT INTO public.zip_codes VALUES ('6703', '79');
INSERT INTO public.zip_codes VALUES ('6702', '81');
INSERT INTO public.zip_codes VALUES ('6696', '80');
INSERT INTO public.zip_codes VALUES ('6695', '80');
INSERT INTO public.zip_codes VALUES ('6694', '80');
INSERT INTO public.zip_codes VALUES ('6693', '80');
INSERT INTO public.zip_codes VALUES ('6692', '80');
INSERT INTO public.zip_codes VALUES ('6690', '80');
INSERT INTO public.zip_codes VALUES ('6685', '80');
INSERT INTO public.zip_codes VALUES ('6684', '80');
INSERT INTO public.zip_codes VALUES ('6683', '80');
INSERT INTO public.zip_codes VALUES ('6682', '80');
INSERT INTO public.zip_codes VALUES ('6678', '80');
INSERT INTO public.zip_codes VALUES ('6677', '80');
INSERT INTO public.zip_codes VALUES ('6676', '80');
INSERT INTO public.zip_codes VALUES ('6675', '80');
INSERT INTO public.zip_codes VALUES ('6674', '80');
INSERT INTO public.zip_codes VALUES ('6673', '80');
INSERT INTO public.zip_codes VALUES ('6672', '80');
INSERT INTO public.zip_codes VALUES ('6670', '80');
INSERT INTO public.zip_codes VALUES ('6664', '80');
INSERT INTO public.zip_codes VALUES ('6663', '80');
INSERT INTO public.zip_codes VALUES ('6662', '80');
INSERT INTO public.zip_codes VALUES ('6661', '80');
INSERT INTO public.zip_codes VALUES ('6659', '80');
INSERT INTO public.zip_codes VALUES ('6658', '80');
INSERT INTO public.zip_codes VALUES ('6657', '80');
INSERT INTO public.zip_codes VALUES ('6656', '80');
INSERT INTO public.zip_codes VALUES ('6655', '80');
INSERT INTO public.zip_codes VALUES ('6654', '80');
INSERT INTO public.zip_codes VALUES ('6653', '80');
INSERT INTO public.zip_codes VALUES ('6652', '80');
INSERT INTO public.zip_codes VALUES ('6648', '80');
INSERT INTO public.zip_codes VALUES ('6647', '80');
INSERT INTO public.zip_codes VALUES ('6646', '80');
INSERT INTO public.zip_codes VALUES ('6645', '80');
INSERT INTO public.zip_codes VALUES ('6644', '80');
INSERT INTO public.zip_codes VALUES ('6637', '80');
INSERT INTO public.zip_codes VALUES ('6636', '80');
INSERT INTO public.zip_codes VALUES ('6635', '80');
INSERT INTO public.zip_codes VALUES ('6634', '80');
INSERT INTO public.zip_codes VALUES ('6633', '80');
INSERT INTO public.zip_codes VALUES ('6632', '80');
INSERT INTO public.zip_codes VALUES ('6631', '80');
INSERT INTO public.zip_codes VALUES ('6622', '80');
INSERT INTO public.zip_codes VALUES ('6618', '80');
INSERT INTO public.zip_codes VALUES ('6616', '80');
INSERT INTO public.zip_codes VALUES ('6614', '80');
INSERT INTO public.zip_codes VALUES ('6613', '80');
INSERT INTO public.zip_codes VALUES ('6612', '80');
INSERT INTO public.zip_codes VALUES ('6611', '80');
INSERT INTO public.zip_codes VALUES ('6605', '80');
INSERT INTO public.zip_codes VALUES ('6600', '80');
INSERT INTO public.zip_codes VALUES ('6599', '81');
INSERT INTO public.zip_codes VALUES ('6598', '80');
INSERT INTO public.zip_codes VALUES ('6597', '80');
INSERT INTO public.zip_codes VALUES ('6596', '80');
INSERT INTO public.zip_codes VALUES ('6595', '80');
INSERT INTO public.zip_codes VALUES ('6594', '80');
INSERT INTO public.zip_codes VALUES ('6593', '81');
INSERT INTO public.zip_codes VALUES ('6592', '81');
INSERT INTO public.zip_codes VALUES ('6584', '81');
INSERT INTO public.zip_codes VALUES ('6583', '81');
INSERT INTO public.zip_codes VALUES ('6582', '81');
INSERT INTO public.zip_codes VALUES ('6579', '80');
INSERT INTO public.zip_codes VALUES ('6578', '80');
INSERT INTO public.zip_codes VALUES ('6577', '80');
INSERT INTO public.zip_codes VALUES ('6576', '80');
INSERT INTO public.zip_codes VALUES ('6575', '80');
INSERT INTO public.zip_codes VALUES ('6574', '80');
INSERT INTO public.zip_codes VALUES ('6573', '80');
INSERT INTO public.zip_codes VALUES ('6572', '80');
INSERT INTO public.zip_codes VALUES ('6571', '80');
INSERT INTO public.zip_codes VALUES ('6565', '69');
INSERT INTO public.zip_codes VALUES ('6563', '69');
INSERT INTO public.zip_codes VALUES ('6562', '69');
INSERT INTO public.zip_codes VALUES ('6558', '69');
INSERT INTO public.zip_codes VALUES ('6557', '69');
INSERT INTO public.zip_codes VALUES ('6556', '69');
INSERT INTO public.zip_codes VALUES ('6549', '69');
INSERT INTO public.zip_codes VALUES ('6548', '69');
INSERT INTO public.zip_codes VALUES ('6546', '69');
INSERT INTO public.zip_codes VALUES ('6545', '69');
INSERT INTO public.zip_codes VALUES ('6544', '69');
INSERT INTO public.zip_codes VALUES ('6543', '69');
INSERT INTO public.zip_codes VALUES ('6542', '69');
INSERT INTO public.zip_codes VALUES ('6541', '69');
INSERT INTO public.zip_codes VALUES ('6540', '69');
INSERT INTO public.zip_codes VALUES ('6538', '69');
INSERT INTO public.zip_codes VALUES ('6537', '69');
INSERT INTO public.zip_codes VALUES ('6535', '69');
INSERT INTO public.zip_codes VALUES ('6534', '69');
INSERT INTO public.zip_codes VALUES ('6533', '81');
INSERT INTO public.zip_codes VALUES ('6532', '81');
INSERT INTO public.zip_codes VALUES ('6528', '81');
INSERT INTO public.zip_codes VALUES ('6527', '79');
INSERT INTO public.zip_codes VALUES ('6526', '79');
INSERT INTO public.zip_codes VALUES ('6525', '81');
INSERT INTO public.zip_codes VALUES ('6524', '81');
INSERT INTO public.zip_codes VALUES ('6523', '81');
INSERT INTO public.zip_codes VALUES ('6518', '81');
INSERT INTO public.zip_codes VALUES ('6517', '81');
INSERT INTO public.zip_codes VALUES ('6516', '80');
INSERT INTO public.zip_codes VALUES ('6515', '81');
INSERT INTO public.zip_codes VALUES ('6514', '81');
INSERT INTO public.zip_codes VALUES ('6513', '81');
INSERT INTO public.zip_codes VALUES ('6512', '81');
INSERT INTO public.zip_codes VALUES ('6503', '81');
INSERT INTO public.zip_codes VALUES ('6500', '81');
INSERT INTO public.zip_codes VALUES ('6493', '30');
INSERT INTO public.zip_codes VALUES ('6491', '30');
INSERT INTO public.zip_codes VALUES ('6490', '30');
INSERT INTO public.zip_codes VALUES ('6487', '30');
INSERT INTO public.zip_codes VALUES ('6485', '30');
INSERT INTO public.zip_codes VALUES ('6484', '30');
INSERT INTO public.zip_codes VALUES ('6482', '30');
INSERT INTO public.zip_codes VALUES ('6476', '30');
INSERT INTO public.zip_codes VALUES ('6475', '30');
INSERT INTO public.zip_codes VALUES ('6474', '30');
INSERT INTO public.zip_codes VALUES ('6473', '30');
INSERT INTO public.zip_codes VALUES ('6472', '30');
INSERT INTO public.zip_codes VALUES ('6469', '30');
INSERT INTO public.zip_codes VALUES ('6468', '30');
INSERT INTO public.zip_codes VALUES ('6467', '30');
INSERT INTO public.zip_codes VALUES ('6466', '30');
INSERT INTO public.zip_codes VALUES ('6465', '30');
INSERT INTO public.zip_codes VALUES ('6464', '30');
INSERT INTO public.zip_codes VALUES ('6463', '30');
INSERT INTO public.zip_codes VALUES ('6462', '30');
INSERT INTO public.zip_codes VALUES ('6461', '30');
INSERT INTO public.zip_codes VALUES ('6460', '30');
INSERT INTO public.zip_codes VALUES ('6454', '30');
INSERT INTO public.zip_codes VALUES ('6452', '30');
INSERT INTO public.zip_codes VALUES ('6443', '31');
INSERT INTO public.zip_codes VALUES ('6442', '31');
INSERT INTO public.zip_codes VALUES ('6441', '30');
INSERT INTO public.zip_codes VALUES ('6440', '31');
INSERT INTO public.zip_codes VALUES ('6438', '31');
INSERT INTO public.zip_codes VALUES ('6436', '31');
INSERT INTO public.zip_codes VALUES ('6434', '31');
INSERT INTO public.zip_codes VALUES ('6433', '31');
INSERT INTO public.zip_codes VALUES ('6432', '31');
INSERT INTO public.zip_codes VALUES ('6430', '31');
INSERT INTO public.zip_codes VALUES ('6424', '31');
INSERT INTO public.zip_codes VALUES ('6423', '31');
INSERT INTO public.zip_codes VALUES ('6422', '31');
INSERT INTO public.zip_codes VALUES ('6418', '32');
INSERT INTO public.zip_codes VALUES ('6417', '31');
INSERT INTO public.zip_codes VALUES ('6416', '31');
INSERT INTO public.zip_codes VALUES ('6415', '31');
INSERT INTO public.zip_codes VALUES ('6414', '31');
INSERT INTO public.zip_codes VALUES ('6410', '31');
INSERT INTO public.zip_codes VALUES ('6405', '31');
INSERT INTO public.zip_codes VALUES ('6404', '31');
INSERT INTO public.zip_codes VALUES ('6403', '31');
INSERT INTO public.zip_codes VALUES ('6402', '31');
INSERT INTO public.zip_codes VALUES ('6390', '35');
INSERT INTO public.zip_codes VALUES ('6388', '35');
INSERT INTO public.zip_codes VALUES ('6387', '35');
INSERT INTO public.zip_codes VALUES ('6386', '35');
INSERT INTO public.zip_codes VALUES ('6383', '35');
INSERT INTO public.zip_codes VALUES ('6382', '35');
INSERT INTO public.zip_codes VALUES ('6377', '30');
INSERT INTO public.zip_codes VALUES ('6376', '35');
INSERT INTO public.zip_codes VALUES ('6375', '35');
INSERT INTO public.zip_codes VALUES ('6374', '35');
INSERT INTO public.zip_codes VALUES ('6373', '35');
INSERT INTO public.zip_codes VALUES ('6372', '35');
INSERT INTO public.zip_codes VALUES ('6370', '35');
INSERT INTO public.zip_codes VALUES ('6365', '35');
INSERT INTO public.zip_codes VALUES ('6363', '35');
INSERT INTO public.zip_codes VALUES ('6362', '35');
INSERT INTO public.zip_codes VALUES ('6356', '31');
INSERT INTO public.zip_codes VALUES ('6354', '31');
INSERT INTO public.zip_codes VALUES ('6353', '31');
INSERT INTO public.zip_codes VALUES ('6345', '38');
INSERT INTO public.zip_codes VALUES ('6344', '26');
INSERT INTO public.zip_codes VALUES ('6343', '38');
INSERT INTO public.zip_codes VALUES ('6340', '38');
INSERT INTO public.zip_codes VALUES ('6333', '38');
INSERT INTO public.zip_codes VALUES ('6332', '38');
INSERT INTO public.zip_codes VALUES ('6331', '38');
INSERT INTO public.zip_codes VALUES ('6330', '38');
INSERT INTO public.zip_codes VALUES ('6319', '38');
INSERT INTO public.zip_codes VALUES ('6318', '38');
INSERT INTO public.zip_codes VALUES ('6317', '38');
INSERT INTO public.zip_codes VALUES ('6315', '38');
INSERT INTO public.zip_codes VALUES ('6314', '38');
INSERT INTO public.zip_codes VALUES ('6313', '38');
INSERT INTO public.zip_codes VALUES ('6312', '38');
INSERT INTO public.zip_codes VALUES ('6300', '38');
INSERT INTO public.zip_codes VALUES ('6295', '27');
INSERT INTO public.zip_codes VALUES ('6294', '27');
INSERT INTO public.zip_codes VALUES ('6289', '27');
INSERT INTO public.zip_codes VALUES ('6288', '27');
INSERT INTO public.zip_codes VALUES ('6287', '27');
INSERT INTO public.zip_codes VALUES ('6286', '27');
INSERT INTO public.zip_codes VALUES ('6285', '27');
INSERT INTO public.zip_codes VALUES ('6284', '27');
INSERT INTO public.zip_codes VALUES ('6283', '27');
INSERT INTO public.zip_codes VALUES ('6280', '27');
INSERT INTO public.zip_codes VALUES ('6277', '27');
INSERT INTO public.zip_codes VALUES ('6276', '27');
INSERT INTO public.zip_codes VALUES ('6275', '27');
INSERT INTO public.zip_codes VALUES ('6274', '26');
INSERT INTO public.zip_codes VALUES ('6265', '70');
INSERT INTO public.zip_codes VALUES ('6264', '70');
INSERT INTO public.zip_codes VALUES ('6263', '70');
INSERT INTO public.zip_codes VALUES ('6262', '70');
INSERT INTO public.zip_codes VALUES ('6260', '70');
INSERT INTO public.zip_codes VALUES ('6253', '28');
INSERT INTO public.zip_codes VALUES ('6252', '28');
INSERT INTO public.zip_codes VALUES ('6248', '28');
INSERT INTO public.zip_codes VALUES ('6247', '28');
INSERT INTO public.zip_codes VALUES ('6246', '28');
INSERT INTO public.zip_codes VALUES ('6245', '28');
INSERT INTO public.zip_codes VALUES ('6244', '28');
INSERT INTO public.zip_codes VALUES ('6243', '28');
INSERT INTO public.zip_codes VALUES ('6242', '28');
INSERT INTO public.zip_codes VALUES ('6236', '27');
INSERT INTO public.zip_codes VALUES ('6235', '27');
INSERT INTO public.zip_codes VALUES ('6234', '27');
INSERT INTO public.zip_codes VALUES ('6233', '27');
INSERT INTO public.zip_codes VALUES ('6232', '27');
INSERT INTO public.zip_codes VALUES ('6231', '27');
INSERT INTO public.zip_codes VALUES ('6222', '27');
INSERT INTO public.zip_codes VALUES ('6221', '27');
INSERT INTO public.zip_codes VALUES ('6218', '28');
INSERT INTO public.zip_codes VALUES ('6217', '28');
INSERT INTO public.zip_codes VALUES ('6216', '27');
INSERT INTO public.zip_codes VALUES ('6215', '27');
INSERT INTO public.zip_codes VALUES ('6214', '27');
INSERT INTO public.zip_codes VALUES ('6213', '27');
INSERT INTO public.zip_codes VALUES ('6212', '27');
INSERT INTO public.zip_codes VALUES ('6211', '28');
INSERT INTO public.zip_codes VALUES ('6210', '27');
INSERT INTO public.zip_codes VALUES ('6208', '27');
INSERT INTO public.zip_codes VALUES ('6207', '27');
INSERT INTO public.zip_codes VALUES ('6206', '27');
INSERT INTO public.zip_codes VALUES ('6205', '27');
INSERT INTO public.zip_codes VALUES ('6204', '27');
INSERT INTO public.zip_codes VALUES ('6203', '27');
INSERT INTO public.zip_codes VALUES ('6197', '17');
INSERT INTO public.zip_codes VALUES ('6196', '29');
INSERT INTO public.zip_codes VALUES ('6192', '29');
INSERT INTO public.zip_codes VALUES ('6182', '29');
INSERT INTO public.zip_codes VALUES ('6174', '29');
INSERT INTO public.zip_codes VALUES ('6173', '29');
INSERT INTO public.zip_codes VALUES ('6170', '29');
INSERT INTO public.zip_codes VALUES ('6167', '29');
INSERT INTO public.zip_codes VALUES ('6166', '29');
INSERT INTO public.zip_codes VALUES ('6163', '29');
INSERT INTO public.zip_codes VALUES ('6162', '29');
INSERT INTO public.zip_codes VALUES ('6156', '28');
INSERT INTO public.zip_codes VALUES ('6154', '28');
INSERT INTO public.zip_codes VALUES ('6153', '28');
INSERT INTO public.zip_codes VALUES ('6152', '28');
INSERT INTO public.zip_codes VALUES ('6147', '28');
INSERT INTO public.zip_codes VALUES ('6146', '28');
INSERT INTO public.zip_codes VALUES ('6145', '28');
INSERT INTO public.zip_codes VALUES ('6144', '28');
INSERT INTO public.zip_codes VALUES ('6143', '28');
INSERT INTO public.zip_codes VALUES ('6142', '28');
INSERT INTO public.zip_codes VALUES ('6133', '28');
INSERT INTO public.zip_codes VALUES ('6132', '28');
INSERT INTO public.zip_codes VALUES ('6130', '28');
INSERT INTO public.zip_codes VALUES ('6126', '28');
INSERT INTO public.zip_codes VALUES ('6125', '28');
INSERT INTO public.zip_codes VALUES ('6123', '28');
INSERT INTO public.zip_codes VALUES ('6122', '28');
INSERT INTO public.zip_codes VALUES ('6114', '28');
INSERT INTO public.zip_codes VALUES ('6113', '29');
INSERT INTO public.zip_codes VALUES ('6112', '29');
INSERT INTO public.zip_codes VALUES ('6110', '28');
INSERT INTO public.zip_codes VALUES ('6106', '28');
INSERT INTO public.zip_codes VALUES ('6105', '28');
INSERT INTO public.zip_codes VALUES ('6103', '26');
INSERT INTO public.zip_codes VALUES ('6102', '26');
INSERT INTO public.zip_codes VALUES ('6086', '23');
INSERT INTO public.zip_codes VALUES ('6085', '23');
INSERT INTO public.zip_codes VALUES ('6084', '23');
INSERT INTO public.zip_codes VALUES ('6083', '23');
INSERT INTO public.zip_codes VALUES ('6078', '34');
INSERT INTO public.zip_codes VALUES ('6074', '34');
INSERT INTO public.zip_codes VALUES ('6073', '34');
INSERT INTO public.zip_codes VALUES ('6072', '34');
INSERT INTO public.zip_codes VALUES ('6068', '34');
INSERT INTO public.zip_codes VALUES ('6067', '34');
INSERT INTO public.zip_codes VALUES ('6066', '34');
INSERT INTO public.zip_codes VALUES ('6064', '34');
INSERT INTO public.zip_codes VALUES ('6063', '34');
INSERT INTO public.zip_codes VALUES ('6062', '34');
INSERT INTO public.zip_codes VALUES ('6060', '34');
INSERT INTO public.zip_codes VALUES ('6056', '34');
INSERT INTO public.zip_codes VALUES ('6055', '34');
INSERT INTO public.zip_codes VALUES ('6053', '34');
INSERT INTO public.zip_codes VALUES ('6052', '35');
INSERT INTO public.zip_codes VALUES ('6048', '26');
INSERT INTO public.zip_codes VALUES ('6047', '26');
INSERT INTO public.zip_codes VALUES ('6045', '26');
INSERT INTO public.zip_codes VALUES ('6044', '26');
INSERT INTO public.zip_codes VALUES ('6043', '26');
INSERT INTO public.zip_codes VALUES ('6042', '74');
INSERT INTO public.zip_codes VALUES ('6039', '26');
INSERT INTO public.zip_codes VALUES ('6038', '26');
INSERT INTO public.zip_codes VALUES ('6037', '26');
INSERT INTO public.zip_codes VALUES ('6036', '26');
INSERT INTO public.zip_codes VALUES ('6035', '26');
INSERT INTO public.zip_codes VALUES ('6034', '26');
INSERT INTO public.zip_codes VALUES ('6033', '26');
INSERT INTO public.zip_codes VALUES ('6032', '26');
INSERT INTO public.zip_codes VALUES ('6030', '26');
INSERT INTO public.zip_codes VALUES ('6028', '27');
INSERT INTO public.zip_codes VALUES ('6027', '27');
INSERT INTO public.zip_codes VALUES ('6026', '26');
INSERT INTO public.zip_codes VALUES ('6025', '27');
INSERT INTO public.zip_codes VALUES ('6024', '26');
INSERT INTO public.zip_codes VALUES ('6023', '26');
INSERT INTO public.zip_codes VALUES ('6022', '28');
INSERT INTO public.zip_codes VALUES ('6020', '26');
INSERT INTO public.zip_codes VALUES ('6019', '28');
INSERT INTO public.zip_codes VALUES ('6018', '28');
INSERT INTO public.zip_codes VALUES ('6017', '28');
INSERT INTO public.zip_codes VALUES ('6016', '27');
INSERT INTO public.zip_codes VALUES ('6015', '26');
INSERT INTO public.zip_codes VALUES ('6014', '26');
INSERT INTO public.zip_codes VALUES ('6013', '26');
INSERT INTO public.zip_codes VALUES ('6012', '26');
INSERT INTO public.zip_codes VALUES ('6010', '26');
INSERT INTO public.zip_codes VALUES ('6006', '26');
INSERT INTO public.zip_codes VALUES ('6005', '26');
INSERT INTO public.zip_codes VALUES ('6004', '26');
INSERT INTO public.zip_codes VALUES ('6003', '26');
INSERT INTO public.zip_codes VALUES ('5746', '44');
INSERT INTO public.zip_codes VALUES ('5745', '70');
INSERT INTO public.zip_codes VALUES ('5742', '70');
INSERT INTO public.zip_codes VALUES ('5737', '70');
INSERT INTO public.zip_codes VALUES ('5736', '70');
INSERT INTO public.zip_codes VALUES ('5735', '27');
INSERT INTO public.zip_codes VALUES ('5734', '70');
INSERT INTO public.zip_codes VALUES ('5733', '70');
INSERT INTO public.zip_codes VALUES ('5732', '70');
INSERT INTO public.zip_codes VALUES ('5728', '70');
INSERT INTO public.zip_codes VALUES ('5727', '70');
INSERT INTO public.zip_codes VALUES ('5726', '70');
INSERT INTO public.zip_codes VALUES ('5725', '70');
INSERT INTO public.zip_codes VALUES ('5724', '70');
INSERT INTO public.zip_codes VALUES ('5723', '70');
INSERT INTO public.zip_codes VALUES ('5722', '70');
INSERT INTO public.zip_codes VALUES ('5712', '70');
INSERT INTO public.zip_codes VALUES ('5708', '70');
INSERT INTO public.zip_codes VALUES ('5707', '70');
INSERT INTO public.zip_codes VALUES ('5706', '70');
INSERT INTO public.zip_codes VALUES ('5705', '70');
INSERT INTO public.zip_codes VALUES ('5704', '70');
INSERT INTO public.zip_codes VALUES ('5703', '70');
INSERT INTO public.zip_codes VALUES ('5702', '70');
INSERT INTO public.zip_codes VALUES ('5647', '74');
INSERT INTO public.zip_codes VALUES ('5646', '74');
INSERT INTO public.zip_codes VALUES ('5645', '74');
INSERT INTO public.zip_codes VALUES ('5644', '74');
INSERT INTO public.zip_codes VALUES ('5643', '74');
INSERT INTO public.zip_codes VALUES ('5642', '74');
INSERT INTO public.zip_codes VALUES ('5637', '74');
INSERT INTO public.zip_codes VALUES ('5636', '74');
INSERT INTO public.zip_codes VALUES ('5634', '74');
INSERT INTO public.zip_codes VALUES ('5632', '74');
INSERT INTO public.zip_codes VALUES ('5630', '74');
INSERT INTO public.zip_codes VALUES ('5628', '74');
INSERT INTO public.zip_codes VALUES ('5627', '74');
INSERT INTO public.zip_codes VALUES ('5626', '73');
INSERT INTO public.zip_codes VALUES ('5625', '74');
INSERT INTO public.zip_codes VALUES ('5624', '74');
INSERT INTO public.zip_codes VALUES ('5623', '74');
INSERT INTO public.zip_codes VALUES ('5622', '74');
INSERT INTO public.zip_codes VALUES ('5621', '73');
INSERT INTO public.zip_codes VALUES ('5620', '73');
INSERT INTO public.zip_codes VALUES ('5619', '74');
INSERT INTO public.zip_codes VALUES ('5618', '74');
INSERT INTO public.zip_codes VALUES ('5617', '70');
INSERT INTO public.zip_codes VALUES ('5616', '70');
INSERT INTO public.zip_codes VALUES ('5615', '70');
INSERT INTO public.zip_codes VALUES ('5614', '74');
INSERT INTO public.zip_codes VALUES ('5613', '74');
INSERT INTO public.zip_codes VALUES ('5612', '74');
INSERT INTO public.zip_codes VALUES ('5611', '74');
INSERT INTO public.zip_codes VALUES ('5610', '74');
INSERT INTO public.zip_codes VALUES ('5608', '73');
INSERT INTO public.zip_codes VALUES ('5607', '74');
INSERT INTO public.zip_codes VALUES ('5606', '74');
INSERT INTO public.zip_codes VALUES ('5605', '74');
INSERT INTO public.zip_codes VALUES ('5604', '74');
INSERT INTO public.zip_codes VALUES ('5603', '70');
INSERT INTO public.zip_codes VALUES ('5600', '70');
INSERT INTO public.zip_codes VALUES ('5525', '73');
INSERT INTO public.zip_codes VALUES ('5524', '73');
INSERT INTO public.zip_codes VALUES ('5522', '73');
INSERT INTO public.zip_codes VALUES ('5512', '73');
INSERT INTO public.zip_codes VALUES ('5507', '73');
INSERT INTO public.zip_codes VALUES ('5506', '73');
INSERT INTO public.zip_codes VALUES ('5505', '71');
INSERT INTO public.zip_codes VALUES ('5504', '74');
INSERT INTO public.zip_codes VALUES ('5503', '70');
INSERT INTO public.zip_codes VALUES ('5502', '70');
INSERT INTO public.zip_codes VALUES ('5467', '71');
INSERT INTO public.zip_codes VALUES ('5466', '71');
INSERT INTO public.zip_codes VALUES ('5465', '71');
INSERT INTO public.zip_codes VALUES ('5464', '71');
INSERT INTO public.zip_codes VALUES ('5463', '71');
INSERT INTO public.zip_codes VALUES ('5462', '71');
INSERT INTO public.zip_codes VALUES ('5454', '73');
INSERT INTO public.zip_codes VALUES ('5453', '73');
INSERT INTO public.zip_codes VALUES ('5452', '73');
INSERT INTO public.zip_codes VALUES ('5445', '73');
INSERT INTO public.zip_codes VALUES ('5444', '73');
INSERT INTO public.zip_codes VALUES ('5443', '73');
INSERT INTO public.zip_codes VALUES ('5442', '72');
INSERT INTO public.zip_codes VALUES ('5436', '72');
INSERT INTO public.zip_codes VALUES ('5432', '72');
INSERT INTO public.zip_codes VALUES ('5430', '72');
INSERT INTO public.zip_codes VALUES ('5426', '71');
INSERT INTO public.zip_codes VALUES ('5425', '71');
INSERT INTO public.zip_codes VALUES ('5423', '72');
INSERT INTO public.zip_codes VALUES ('5420', '72');
INSERT INTO public.zip_codes VALUES ('5417', '72');
INSERT INTO public.zip_codes VALUES ('5416', '72');
INSERT INTO public.zip_codes VALUES ('5415', '72');
INSERT INTO public.zip_codes VALUES ('5413', '72');
INSERT INTO public.zip_codes VALUES ('5412', '72');
INSERT INTO public.zip_codes VALUES ('5408', '72');
INSERT INTO public.zip_codes VALUES ('5406', '72');
INSERT INTO public.zip_codes VALUES ('5405', '72');
INSERT INTO public.zip_codes VALUES ('5404', '72');
INSERT INTO public.zip_codes VALUES ('5400', '72');
INSERT INTO public.zip_codes VALUES ('5334', '71');
INSERT INTO public.zip_codes VALUES ('5333', '71');
INSERT INTO public.zip_codes VALUES ('5332', '71');
INSERT INTO public.zip_codes VALUES ('5330', '71');
INSERT INTO public.zip_codes VALUES ('5326', '75');
INSERT INTO public.zip_codes VALUES ('5325', '71');
INSERT INTO public.zip_codes VALUES ('5324', '71');
INSERT INTO public.zip_codes VALUES ('5323', '71');
INSERT INTO public.zip_codes VALUES ('5322', '71');
INSERT INTO public.zip_codes VALUES ('5318', '71');
INSERT INTO public.zip_codes VALUES ('5317', '71');
INSERT INTO public.zip_codes VALUES ('5316', '71');
INSERT INTO public.zip_codes VALUES ('5315', '71');
INSERT INTO public.zip_codes VALUES ('5314', '71');
INSERT INTO public.zip_codes VALUES ('5313', '71');
INSERT INTO public.zip_codes VALUES ('5312', '71');
INSERT INTO public.zip_codes VALUES ('5306', '71');
INSERT INTO public.zip_codes VALUES ('5305', '71');
INSERT INTO public.zip_codes VALUES ('5304', '71');
INSERT INTO public.zip_codes VALUES ('5303', '72');
INSERT INTO public.zip_codes VALUES ('5301', '72');
INSERT INTO public.zip_codes VALUES ('5300', '72');
INSERT INTO public.zip_codes VALUES ('5277', '75');
INSERT INTO public.zip_codes VALUES ('5276', '75');
INSERT INTO public.zip_codes VALUES ('5275', '75');
INSERT INTO public.zip_codes VALUES ('5274', '75');
INSERT INTO public.zip_codes VALUES ('5273', '75');
INSERT INTO public.zip_codes VALUES ('5272', '75');
INSERT INTO public.zip_codes VALUES ('5246', '71');
INSERT INTO public.zip_codes VALUES ('5245', '71');
INSERT INTO public.zip_codes VALUES ('5244', '71');
INSERT INTO public.zip_codes VALUES ('5243', '71');
INSERT INTO public.zip_codes VALUES ('5242', '71');
INSERT INTO public.zip_codes VALUES ('5237', '71');
INSERT INTO public.zip_codes VALUES ('5236', '71');
INSERT INTO public.zip_codes VALUES ('5235', '71');
INSERT INTO public.zip_codes VALUES ('5234', '71');
INSERT INTO public.zip_codes VALUES ('5233', '71');
INSERT INTO public.zip_codes VALUES ('5225', '71');
INSERT INTO public.zip_codes VALUES ('5223', '71');
INSERT INTO public.zip_codes VALUES ('5222', '71');
INSERT INTO public.zip_codes VALUES ('5213', '71');
INSERT INTO public.zip_codes VALUES ('5212', '71');
INSERT INTO public.zip_codes VALUES ('5210', '71');
INSERT INTO public.zip_codes VALUES ('5200', '71');
INSERT INTO public.zip_codes VALUES ('5116', '71');
INSERT INTO public.zip_codes VALUES ('5113', '70');
INSERT INTO public.zip_codes VALUES ('5112', '71');
INSERT INTO public.zip_codes VALUES ('5108', '71');
INSERT INTO public.zip_codes VALUES ('5107', '71');
INSERT INTO public.zip_codes VALUES ('5106', '71');
INSERT INTO public.zip_codes VALUES ('5105', '71');
INSERT INTO public.zip_codes VALUES ('5103', '70');
INSERT INTO public.zip_codes VALUES ('5102', '70');
INSERT INTO public.zip_codes VALUES ('5085', '75');
INSERT INTO public.zip_codes VALUES ('5084', '75');
INSERT INTO public.zip_codes VALUES ('5083', '75');
INSERT INTO public.zip_codes VALUES ('5082', '75');
INSERT INTO public.zip_codes VALUES ('5080', '75');
INSERT INTO public.zip_codes VALUES ('5079', '75');
INSERT INTO public.zip_codes VALUES ('5078', '75');
INSERT INTO public.zip_codes VALUES ('5077', '75');
INSERT INTO public.zip_codes VALUES ('5076', '75');
INSERT INTO public.zip_codes VALUES ('5075', '75');
INSERT INTO public.zip_codes VALUES ('5074', '75');
INSERT INTO public.zip_codes VALUES ('5073', '75');
INSERT INTO public.zip_codes VALUES ('5072', '75');
INSERT INTO public.zip_codes VALUES ('5070', '75');
INSERT INTO public.zip_codes VALUES ('5064', '75');
INSERT INTO public.zip_codes VALUES ('5063', '75');
INSERT INTO public.zip_codes VALUES ('5062', '75');
INSERT INTO public.zip_codes VALUES ('5058', '70');
INSERT INTO public.zip_codes VALUES ('5057', '70');
INSERT INTO public.zip_codes VALUES ('5056', '70');
INSERT INTO public.zip_codes VALUES ('5054', '70');
INSERT INTO public.zip_codes VALUES ('5053', '70');
INSERT INTO public.zip_codes VALUES ('5046', '70');
INSERT INTO public.zip_codes VALUES ('5044', '70');
INSERT INTO public.zip_codes VALUES ('5043', '70');
INSERT INTO public.zip_codes VALUES ('5042', '70');
INSERT INTO public.zip_codes VALUES ('5040', '70');
INSERT INTO public.zip_codes VALUES ('5037', '70');
INSERT INTO public.zip_codes VALUES ('5036', '70');
INSERT INTO public.zip_codes VALUES ('5035', '70');
INSERT INTO public.zip_codes VALUES ('5034', '70');
INSERT INTO public.zip_codes VALUES ('5033', '70');
INSERT INTO public.zip_codes VALUES ('5032', '70');
INSERT INTO public.zip_codes VALUES ('5028', '75');
INSERT INTO public.zip_codes VALUES ('5027', '75');
INSERT INTO public.zip_codes VALUES ('5026', '70');
INSERT INTO public.zip_codes VALUES ('5025', '70');
INSERT INTO public.zip_codes VALUES ('5024', '70');
INSERT INTO public.zip_codes VALUES ('5023', '70');
INSERT INTO public.zip_codes VALUES ('5022', '70');
INSERT INTO public.zip_codes VALUES ('5018', '70');
INSERT INTO public.zip_codes VALUES ('5017', '44');
INSERT INTO public.zip_codes VALUES ('5015', '44');
INSERT INTO public.zip_codes VALUES ('5014', '44');
INSERT INTO public.zip_codes VALUES ('5013', '44');
INSERT INTO public.zip_codes VALUES ('5012', '44');
INSERT INTO public.zip_codes VALUES ('5004', '70');
INSERT INTO public.zip_codes VALUES ('5000', '70');
INSERT INTO public.zip_codes VALUES ('4955', '15');
INSERT INTO public.zip_codes VALUES ('4954', '15');
INSERT INTO public.zip_codes VALUES ('4953', '15');
INSERT INTO public.zip_codes VALUES ('4952', '15');
INSERT INTO public.zip_codes VALUES ('4950', '15');
INSERT INTO public.zip_codes VALUES ('4944', '15');
INSERT INTO public.zip_codes VALUES ('4943', '15');
INSERT INTO public.zip_codes VALUES ('4942', '15');
INSERT INTO public.zip_codes VALUES ('4938', '15');
INSERT INTO public.zip_codes VALUES ('4937', '15');
INSERT INTO public.zip_codes VALUES ('4936', '15');
INSERT INTO public.zip_codes VALUES ('4935', '15');
INSERT INTO public.zip_codes VALUES ('4934', '15');
INSERT INTO public.zip_codes VALUES ('4933', '15');
INSERT INTO public.zip_codes VALUES ('4932', '15');
INSERT INTO public.zip_codes VALUES ('4924', '15');
INSERT INTO public.zip_codes VALUES ('4923', '15');
INSERT INTO public.zip_codes VALUES ('4922', '15');
INSERT INTO public.zip_codes VALUES ('4919', '15');
INSERT INTO public.zip_codes VALUES ('4917', '15');
INSERT INTO public.zip_codes VALUES ('4916', '15');
INSERT INTO public.zip_codes VALUES ('4915', '70');
INSERT INTO public.zip_codes VALUES ('4914', '15');
INSERT INTO public.zip_codes VALUES ('4913', '15');
INSERT INTO public.zip_codes VALUES ('4912', '15');
INSERT INTO public.zip_codes VALUES ('4911', '15');
INSERT INTO public.zip_codes VALUES ('4900', '15');
INSERT INTO public.zip_codes VALUES ('4856', '70');
INSERT INTO public.zip_codes VALUES ('4853', '70');
INSERT INTO public.zip_codes VALUES ('4852', '70');
INSERT INTO public.zip_codes VALUES ('4814', '70');
INSERT INTO public.zip_codes VALUES ('4813', '70');
INSERT INTO public.zip_codes VALUES ('4812', '70');
INSERT INTO public.zip_codes VALUES ('4806', '70');
INSERT INTO public.zip_codes VALUES ('4805', '70');
INSERT INTO public.zip_codes VALUES ('4803', '70');
INSERT INTO public.zip_codes VALUES ('4802', '70');
INSERT INTO public.zip_codes VALUES ('4800', '70');
INSERT INTO public.zip_codes VALUES ('4719', '45');
INSERT INTO public.zip_codes VALUES ('4718', '45');
INSERT INTO public.zip_codes VALUES ('4717', '45');
INSERT INTO public.zip_codes VALUES ('4716', '45');
INSERT INTO public.zip_codes VALUES ('4715', '45');
INSERT INTO public.zip_codes VALUES ('4714', '45');
INSERT INTO public.zip_codes VALUES ('4713', '45');
INSERT INTO public.zip_codes VALUES ('4712', '45');
INSERT INTO public.zip_codes VALUES ('4710', '45');
INSERT INTO public.zip_codes VALUES ('4704', '15');
INSERT INTO public.zip_codes VALUES ('4703', '44');
INSERT INTO public.zip_codes VALUES ('4702', '44');
INSERT INTO public.zip_codes VALUES ('4665', '70');
INSERT INTO public.zip_codes VALUES ('4663', '70');
INSERT INTO public.zip_codes VALUES ('4658', '44');
INSERT INTO public.zip_codes VALUES ('4657', '44');
INSERT INTO public.zip_codes VALUES ('4656', '44');
INSERT INTO public.zip_codes VALUES ('4655', '44');
INSERT INTO public.zip_codes VALUES ('4654', '44');
INSERT INTO public.zip_codes VALUES ('4653', '44');
INSERT INTO public.zip_codes VALUES ('4652', '44');
INSERT INTO public.zip_codes VALUES ('4634', '44');
INSERT INTO public.zip_codes VALUES ('4633', '44');
INSERT INTO public.zip_codes VALUES ('4632', '44');
INSERT INTO public.zip_codes VALUES ('4629', '44');
INSERT INTO public.zip_codes VALUES ('4628', '44');
INSERT INTO public.zip_codes VALUES ('4626', '44');
INSERT INTO public.zip_codes VALUES ('4625', '44');
INSERT INTO public.zip_codes VALUES ('4624', '44');
INSERT INTO public.zip_codes VALUES ('4623', '44');
INSERT INTO public.zip_codes VALUES ('4622', '44');
INSERT INTO public.zip_codes VALUES ('4618', '44');
INSERT INTO public.zip_codes VALUES ('4617', '44');
INSERT INTO public.zip_codes VALUES ('4616', '44');
INSERT INTO public.zip_codes VALUES ('4615', '44');
INSERT INTO public.zip_codes VALUES ('4614', '44');
INSERT INTO public.zip_codes VALUES ('4613', '44');
INSERT INTO public.zip_codes VALUES ('4612', '44');
INSERT INTO public.zip_codes VALUES ('4600', '44');
INSERT INTO public.zip_codes VALUES ('4588', '46');
INSERT INTO public.zip_codes VALUES ('4587', '46');
INSERT INTO public.zip_codes VALUES ('4586', '46');
INSERT INTO public.zip_codes VALUES ('4585', '46');
INSERT INTO public.zip_codes VALUES ('4584', '46');
INSERT INTO public.zip_codes VALUES ('4583', '46');
INSERT INTO public.zip_codes VALUES ('4582', '46');
INSERT INTO public.zip_codes VALUES ('4581', '46');
INSERT INTO public.zip_codes VALUES ('4579', '46');
INSERT INTO public.zip_codes VALUES ('4578', '46');
INSERT INTO public.zip_codes VALUES ('4577', '46');
INSERT INTO public.zip_codes VALUES ('4576', '46');
INSERT INTO public.zip_codes VALUES ('4574', '46');
INSERT INTO public.zip_codes VALUES ('4573', '46');
INSERT INTO public.zip_codes VALUES ('4571', '46');
INSERT INTO public.zip_codes VALUES ('4566', '46');
INSERT INTO public.zip_codes VALUES ('4565', '46');
INSERT INTO public.zip_codes VALUES ('4564', '46');
INSERT INTO public.zip_codes VALUES ('4563', '46');
INSERT INTO public.zip_codes VALUES ('4562', '46');
INSERT INTO public.zip_codes VALUES ('4558', '46');
INSERT INTO public.zip_codes VALUES ('4557', '46');
INSERT INTO public.zip_codes VALUES ('4556', '46');
INSERT INTO public.zip_codes VALUES ('4554', '46');
INSERT INTO public.zip_codes VALUES ('4553', '46');
INSERT INTO public.zip_codes VALUES ('4552', '46');
INSERT INTO public.zip_codes VALUES ('4543', '46');
INSERT INTO public.zip_codes VALUES ('4542', '46');
INSERT INTO public.zip_codes VALUES ('4539', '15');
INSERT INTO public.zip_codes VALUES ('4538', '15');
INSERT INTO public.zip_codes VALUES ('4537', '15');
INSERT INTO public.zip_codes VALUES ('4536', '15');
INSERT INTO public.zip_codes VALUES ('4535', '46');
INSERT INTO public.zip_codes VALUES ('4534', '46');
INSERT INTO public.zip_codes VALUES ('4533', '46');
INSERT INTO public.zip_codes VALUES ('4532', '46');
INSERT INTO public.zip_codes VALUES ('4528', '46');
INSERT INTO public.zip_codes VALUES ('4525', '46');
INSERT INTO public.zip_codes VALUES ('4524', '46');
INSERT INTO public.zip_codes VALUES ('4523', '46');
INSERT INTO public.zip_codes VALUES ('4522', '46');
INSERT INTO public.zip_codes VALUES ('4515', '46');
INSERT INTO public.zip_codes VALUES ('4514', '46');
INSERT INTO public.zip_codes VALUES ('4513', '46');
INSERT INTO public.zip_codes VALUES ('4512', '46');
INSERT INTO public.zip_codes VALUES ('4500', '46');
INSERT INTO public.zip_codes VALUES ('4497', '49');
INSERT INTO public.zip_codes VALUES ('4496', '49');
INSERT INTO public.zip_codes VALUES ('4495', '49');
INSERT INTO public.zip_codes VALUES ('4494', '49');
INSERT INTO public.zip_codes VALUES ('4493', '49');
INSERT INTO public.zip_codes VALUES ('4492', '49');
INSERT INTO public.zip_codes VALUES ('4469', '49');
INSERT INTO public.zip_codes VALUES ('4468', '44');
INSERT INTO public.zip_codes VALUES ('4467', '49');
INSERT INTO public.zip_codes VALUES ('4466', '49');
INSERT INTO public.zip_codes VALUES ('4465', '49');
INSERT INTO public.zip_codes VALUES ('4464', '49');
INSERT INTO public.zip_codes VALUES ('4463', '49');
INSERT INTO public.zip_codes VALUES ('4462', '49');
INSERT INTO public.zip_codes VALUES ('4461', '49');
INSERT INTO public.zip_codes VALUES ('4460', '49');
INSERT INTO public.zip_codes VALUES ('4458', '49');
INSERT INTO public.zip_codes VALUES ('4457', '49');
INSERT INTO public.zip_codes VALUES ('4456', '49');
INSERT INTO public.zip_codes VALUES ('4455', '49');
INSERT INTO public.zip_codes VALUES ('4453', '49');
INSERT INTO public.zip_codes VALUES ('4452', '49');
INSERT INTO public.zip_codes VALUES ('4451', '49');
INSERT INTO public.zip_codes VALUES ('4450', '49');
INSERT INTO public.zip_codes VALUES ('4448', '49');
INSERT INTO public.zip_codes VALUES ('4447', '49');
INSERT INTO public.zip_codes VALUES ('4446', '49');
INSERT INTO public.zip_codes VALUES ('4445', '49');
INSERT INTO public.zip_codes VALUES ('4444', '49');
INSERT INTO public.zip_codes VALUES ('4443', '49');
INSERT INTO public.zip_codes VALUES ('4442', '49');
INSERT INTO public.zip_codes VALUES ('4441', '49');
INSERT INTO public.zip_codes VALUES ('4438', '49');
INSERT INTO public.zip_codes VALUES ('4437', '49');
INSERT INTO public.zip_codes VALUES ('4436', '49');
INSERT INTO public.zip_codes VALUES ('4435', '49');
INSERT INTO public.zip_codes VALUES ('4434', '49');
INSERT INTO public.zip_codes VALUES ('4433', '49');
INSERT INTO public.zip_codes VALUES ('4432', '49');
INSERT INTO public.zip_codes VALUES ('4431', '49');
INSERT INTO public.zip_codes VALUES ('4426', '49');
INSERT INTO public.zip_codes VALUES ('4425', '49');
INSERT INTO public.zip_codes VALUES ('4424', '49');
INSERT INTO public.zip_codes VALUES ('4423', '49');
INSERT INTO public.zip_codes VALUES ('4422', '49');
INSERT INTO public.zip_codes VALUES ('4421', '25');
INSERT INTO public.zip_codes VALUES ('4419', '49');
INSERT INTO public.zip_codes VALUES ('4418', '49');
INSERT INTO public.zip_codes VALUES ('4417', '49');
INSERT INTO public.zip_codes VALUES ('4416', '49');
INSERT INTO public.zip_codes VALUES ('4415', '49');
INSERT INTO public.zip_codes VALUES ('4414', '49');
INSERT INTO public.zip_codes VALUES ('4413', '25');
INSERT INTO public.zip_codes VALUES ('4412', '25');
INSERT INTO public.zip_codes VALUES ('4411', '49');
INSERT INTO public.zip_codes VALUES ('4410', '49');
INSERT INTO public.zip_codes VALUES ('4402', '49');
INSERT INTO public.zip_codes VALUES ('4334', '75');
INSERT INTO public.zip_codes VALUES ('4333', '75');
INSERT INTO public.zip_codes VALUES ('4332', '75');
INSERT INTO public.zip_codes VALUES ('4325', '75');
INSERT INTO public.zip_codes VALUES ('4324', '75');
INSERT INTO public.zip_codes VALUES ('4323', '75');
INSERT INTO public.zip_codes VALUES ('4322', '75');
INSERT INTO public.zip_codes VALUES ('4317', '75');
INSERT INTO public.zip_codes VALUES ('4316', '75');
INSERT INTO public.zip_codes VALUES ('4315', '75');
INSERT INTO public.zip_codes VALUES ('4314', '75');
INSERT INTO public.zip_codes VALUES ('4313', '75');
INSERT INTO public.zip_codes VALUES ('4312', '75');
INSERT INTO public.zip_codes VALUES ('4310', '75');
INSERT INTO public.zip_codes VALUES ('4305', '75');
INSERT INTO public.zip_codes VALUES ('4304', '49');
INSERT INTO public.zip_codes VALUES ('4303', '75');
INSERT INTO public.zip_codes VALUES ('4302', '48');
INSERT INTO public.zip_codes VALUES ('4254', '25');
INSERT INTO public.zip_codes VALUES ('4253', '25');
INSERT INTO public.zip_codes VALUES ('4252', '25');
INSERT INTO public.zip_codes VALUES ('4247', '25');
INSERT INTO public.zip_codes VALUES ('4246', '25');
INSERT INTO public.zip_codes VALUES ('4245', '25');
INSERT INTO public.zip_codes VALUES ('4244', '25');
INSERT INTO public.zip_codes VALUES ('4243', '25');
INSERT INTO public.zip_codes VALUES ('4242', '25');
INSERT INTO public.zip_codes VALUES ('4234', '25');
INSERT INTO public.zip_codes VALUES ('4233', '25');
INSERT INTO public.zip_codes VALUES ('4232', '25');
INSERT INTO public.zip_codes VALUES ('4229', '25');
INSERT INTO public.zip_codes VALUES ('4228', '25');
INSERT INTO public.zip_codes VALUES ('4227', '25');
INSERT INTO public.zip_codes VALUES ('4226', '25');
INSERT INTO public.zip_codes VALUES ('4225', '25');
INSERT INTO public.zip_codes VALUES ('4224', '25');
INSERT INTO public.zip_codes VALUES ('4223', '25');
INSERT INTO public.zip_codes VALUES ('4222', '25');
INSERT INTO public.zip_codes VALUES ('4208', '25');
INSERT INTO public.zip_codes VALUES ('4207', '49');
INSERT INTO public.zip_codes VALUES ('4206', '25');
INSERT INTO public.zip_codes VALUES ('4204', '25');
INSERT INTO public.zip_codes VALUES ('4203', '25');
INSERT INTO public.zip_codes VALUES ('4202', '25');
INSERT INTO public.zip_codes VALUES ('4153', '48');
INSERT INTO public.zip_codes VALUES ('4148', '48');
INSERT INTO public.zip_codes VALUES ('4147', '48');
INSERT INTO public.zip_codes VALUES ('4146', '25');
INSERT INTO public.zip_codes VALUES ('4145', '25');
INSERT INTO public.zip_codes VALUES ('4144', '48');
INSERT INTO public.zip_codes VALUES ('4143', '25');
INSERT INTO public.zip_codes VALUES ('4142', '48');
INSERT INTO public.zip_codes VALUES ('4133', '48');
INSERT INTO public.zip_codes VALUES ('4132', '48');
INSERT INTO public.zip_codes VALUES ('4127', '48');
INSERT INTO public.zip_codes VALUES ('4126', '47');
INSERT INTO public.zip_codes VALUES ('4125', '47');
INSERT INTO public.zip_codes VALUES ('4124', '48');
INSERT INTO public.zip_codes VALUES ('4123', '48');
INSERT INTO public.zip_codes VALUES ('4118', '25');
INSERT INTO public.zip_codes VALUES ('4117', '25');
INSERT INTO public.zip_codes VALUES ('4116', '25');
INSERT INTO public.zip_codes VALUES ('4115', '25');
INSERT INTO public.zip_codes VALUES ('4114', '25');
INSERT INTO public.zip_codes VALUES ('4112', '25');
INSERT INTO public.zip_codes VALUES ('4108', '25');
INSERT INTO public.zip_codes VALUES ('4107', '48');
INSERT INTO public.zip_codes VALUES ('4106', '48');
INSERT INTO public.zip_codes VALUES ('4105', '48');
INSERT INTO public.zip_codes VALUES ('4104', '48');
INSERT INTO public.zip_codes VALUES ('4103', '48');
INSERT INTO public.zip_codes VALUES ('4102', '48');
INSERT INTO public.zip_codes VALUES ('4101', '48');
INSERT INTO public.zip_codes VALUES ('4059', '47');
INSERT INTO public.zip_codes VALUES ('4058', '47');
INSERT INTO public.zip_codes VALUES ('4057', '47');
INSERT INTO public.zip_codes VALUES ('4056', '47');
INSERT INTO public.zip_codes VALUES ('4055', '47');
INSERT INTO public.zip_codes VALUES ('4054', '47');
INSERT INTO public.zip_codes VALUES ('4053', '47');
INSERT INTO public.zip_codes VALUES ('4052', '47');
INSERT INTO public.zip_codes VALUES ('4051', '47');
INSERT INTO public.zip_codes VALUES ('4031', '47');
INSERT INTO public.zip_codes VALUES ('4001', '47');
INSERT INTO public.zip_codes VALUES ('3999', '94');
INSERT INTO public.zip_codes VALUES ('3998', '94');
INSERT INTO public.zip_codes VALUES ('3997', '94');
INSERT INTO public.zip_codes VALUES ('3996', '94');
INSERT INTO public.zip_codes VALUES ('3995', '94');
INSERT INTO public.zip_codes VALUES ('3994', '94');
INSERT INTO public.zip_codes VALUES ('3993', '94');
INSERT INTO public.zip_codes VALUES ('3992', '95');
INSERT INTO public.zip_codes VALUES ('3991', '95');
INSERT INTO public.zip_codes VALUES ('3989', '94');
INSERT INTO public.zip_codes VALUES ('3988', '94');
INSERT INTO public.zip_codes VALUES ('3987', '95');
INSERT INTO public.zip_codes VALUES ('3986', '95');
INSERT INTO public.zip_codes VALUES ('3985', '94');
INSERT INTO public.zip_codes VALUES ('3984', '94');
INSERT INTO public.zip_codes VALUES ('3983', '95');
INSERT INTO public.zip_codes VALUES ('3982', '95');
INSERT INTO public.zip_codes VALUES ('3979', '98');
INSERT INTO public.zip_codes VALUES ('3978', '98');
INSERT INTO public.zip_codes VALUES ('3977', '98');
INSERT INTO public.zip_codes VALUES ('3976', '98');
INSERT INTO public.zip_codes VALUES ('3975', '98');
INSERT INTO public.zip_codes VALUES ('3974', '98');
INSERT INTO public.zip_codes VALUES ('3973', '98');
INSERT INTO public.zip_codes VALUES ('3972', '98');
INSERT INTO public.zip_codes VALUES ('3971', '98');
INSERT INTO public.zip_codes VALUES ('3970', '97');
INSERT INTO public.zip_codes VALUES ('3968', '98');
INSERT INTO public.zip_codes VALUES ('3967', '98');
INSERT INTO public.zip_codes VALUES ('3966', '98');
INSERT INTO public.zip_codes VALUES ('3965', '98');
INSERT INTO public.zip_codes VALUES ('3963', '98');
INSERT INTO public.zip_codes VALUES ('3961', '98');
INSERT INTO public.zip_codes VALUES ('3960', '98');
INSERT INTO public.zip_codes VALUES ('3957', '97');
INSERT INTO public.zip_codes VALUES ('3956', '97');
INSERT INTO public.zip_codes VALUES ('3955', '97');
INSERT INTO public.zip_codes VALUES ('3954', '97');
INSERT INTO public.zip_codes VALUES ('3953', '97');
INSERT INTO public.zip_codes VALUES ('3952', '97');
INSERT INTO public.zip_codes VALUES ('3951', '97');
INSERT INTO public.zip_codes VALUES ('3949', '96');
INSERT INTO public.zip_codes VALUES ('3948', '97');
INSERT INTO public.zip_codes VALUES ('3947', '97');
INSERT INTO public.zip_codes VALUES ('3946', '97');
INSERT INTO public.zip_codes VALUES ('3945', '97');
INSERT INTO public.zip_codes VALUES ('3944', '96');
INSERT INTO public.zip_codes VALUES ('3943', '96');
INSERT INTO public.zip_codes VALUES ('3942', '96');
INSERT INTO public.zip_codes VALUES ('3940', '96');
INSERT INTO public.zip_codes VALUES ('3939', '96');
INSERT INTO public.zip_codes VALUES ('3938', '96');
INSERT INTO public.zip_codes VALUES ('3937', '96');
INSERT INTO public.zip_codes VALUES ('3935', '96');
INSERT INTO public.zip_codes VALUES ('3934', '96');
INSERT INTO public.zip_codes VALUES ('3933', '96');
INSERT INTO public.zip_codes VALUES ('3932', '96');
INSERT INTO public.zip_codes VALUES ('3931', '96');
INSERT INTO public.zip_codes VALUES ('3930', '96');
INSERT INTO public.zip_codes VALUES ('3929', '96');
INSERT INTO public.zip_codes VALUES ('3928', '96');
INSERT INTO public.zip_codes VALUES ('3927', '96');
INSERT INTO public.zip_codes VALUES ('3926', '96');
INSERT INTO public.zip_codes VALUES ('3925', '96');
INSERT INTO public.zip_codes VALUES ('3924', '96');
INSERT INTO public.zip_codes VALUES ('3923', '96');
INSERT INTO public.zip_codes VALUES ('3922', '96');
INSERT INTO public.zip_codes VALUES ('3920', '96');
INSERT INTO public.zip_codes VALUES ('3919', '96');
INSERT INTO public.zip_codes VALUES ('3918', '96');
INSERT INTO public.zip_codes VALUES ('3917', '96');
INSERT INTO public.zip_codes VALUES ('3916', '96');
INSERT INTO public.zip_codes VALUES ('3914', '95');
INSERT INTO public.zip_codes VALUES ('3913', '95');
INSERT INTO public.zip_codes VALUES ('3912', '95');
INSERT INTO public.zip_codes VALUES ('3911', '95');
INSERT INTO public.zip_codes VALUES ('3910', '96');
INSERT INTO public.zip_codes VALUES ('3908', '96');
INSERT INTO public.zip_codes VALUES ('3907', '95');
INSERT INTO public.zip_codes VALUES ('3906', '96');
INSERT INTO public.zip_codes VALUES ('3905', '96');
INSERT INTO public.zip_codes VALUES ('3904', '95');
INSERT INTO public.zip_codes VALUES ('3903', '95');
INSERT INTO public.zip_codes VALUES ('3902', '95');
INSERT INTO public.zip_codes VALUES ('3901', '95');
INSERT INTO public.zip_codes VALUES ('3900', '95');
INSERT INTO public.zip_codes VALUES ('3864', '23');
INSERT INTO public.zip_codes VALUES ('3863', '23');
INSERT INTO public.zip_codes VALUES ('3862', '23');
INSERT INTO public.zip_codes VALUES ('3860', '23');
INSERT INTO public.zip_codes VALUES ('3858', '23');
INSERT INTO public.zip_codes VALUES ('3857', '23');
INSERT INTO public.zip_codes VALUES ('3856', '23');
INSERT INTO public.zip_codes VALUES ('3855', '23');
INSERT INTO public.zip_codes VALUES ('3854', '23');
INSERT INTO public.zip_codes VALUES ('3853', '23');
INSERT INTO public.zip_codes VALUES ('3852', '23');
INSERT INTO public.zip_codes VALUES ('3826', '23');
INSERT INTO public.zip_codes VALUES ('3825', '23');
INSERT INTO public.zip_codes VALUES ('3824', '23');
INSERT INTO public.zip_codes VALUES ('3823', '23');
INSERT INTO public.zip_codes VALUES ('3822', '23');
INSERT INTO public.zip_codes VALUES ('3818', '23');
INSERT INTO public.zip_codes VALUES ('3816', '23');
INSERT INTO public.zip_codes VALUES ('3815', '23');
INSERT INTO public.zip_codes VALUES ('3814', '23');
INSERT INTO public.zip_codes VALUES ('3813', '23');
INSERT INTO public.zip_codes VALUES ('3812', '23');
INSERT INTO public.zip_codes VALUES ('3807', '23');
INSERT INTO public.zip_codes VALUES ('3806', '23');
INSERT INTO public.zip_codes VALUES ('3805', '23');
INSERT INTO public.zip_codes VALUES ('3804', '23');
INSERT INTO public.zip_codes VALUES ('3803', '23');
INSERT INTO public.zip_codes VALUES ('3801', '94');
INSERT INTO public.zip_codes VALUES ('3800', '23');
INSERT INTO public.zip_codes VALUES ('3792', '21');
INSERT INTO public.zip_codes VALUES ('3785', '21');
INSERT INTO public.zip_codes VALUES ('3784', '21');
INSERT INTO public.zip_codes VALUES ('3783', '21');
INSERT INTO public.zip_codes VALUES ('3782', '21');
INSERT INTO public.zip_codes VALUES ('3781', '21');
INSERT INTO public.zip_codes VALUES ('3780', '21');
INSERT INTO public.zip_codes VALUES ('3778', '21');
INSERT INTO public.zip_codes VALUES ('3777', '21');
INSERT INTO public.zip_codes VALUES ('3776', '21');
INSERT INTO public.zip_codes VALUES ('3775', '21');
INSERT INTO public.zip_codes VALUES ('3773', '21');
INSERT INTO public.zip_codes VALUES ('3772', '21');
INSERT INTO public.zip_codes VALUES ('3771', '21');
INSERT INTO public.zip_codes VALUES ('3770', '21');
INSERT INTO public.zip_codes VALUES ('3766', '21');
INSERT INTO public.zip_codes VALUES ('3765', '20');
INSERT INTO public.zip_codes VALUES ('3764', '20');
INSERT INTO public.zip_codes VALUES ('3763', '20');
INSERT INTO public.zip_codes VALUES ('3762', '20');
INSERT INTO public.zip_codes VALUES ('3758', '20');
INSERT INTO public.zip_codes VALUES ('3757', '20');
INSERT INTO public.zip_codes VALUES ('3756', '20');
INSERT INTO public.zip_codes VALUES ('3755', '20');
INSERT INTO public.zip_codes VALUES ('3754', '20');
INSERT INTO public.zip_codes VALUES ('3753', '20');
INSERT INTO public.zip_codes VALUES ('3752', '20');
INSERT INTO public.zip_codes VALUES ('3725', '22');
INSERT INTO public.zip_codes VALUES ('3724', '22');
INSERT INTO public.zip_codes VALUES ('3723', '22');
INSERT INTO public.zip_codes VALUES ('3722', '22');
INSERT INTO public.zip_codes VALUES ('3718', '22');
INSERT INTO public.zip_codes VALUES ('3717', '22');
INSERT INTO public.zip_codes VALUES ('3716', '22');
INSERT INTO public.zip_codes VALUES ('3715', '22');
INSERT INTO public.zip_codes VALUES ('3714', '22');
INSERT INTO public.zip_codes VALUES ('3713', '22');
INSERT INTO public.zip_codes VALUES ('3711', '20');
INSERT INTO public.zip_codes VALUES ('3707', '23');
INSERT INTO public.zip_codes VALUES ('3706', '23');
INSERT INTO public.zip_codes VALUES ('3705', '20');
INSERT INTO public.zip_codes VALUES ('3704', '20');
INSERT INTO public.zip_codes VALUES ('3703', '20');
INSERT INTO public.zip_codes VALUES ('3702', '20');
INSERT INTO public.zip_codes VALUES ('3700', '20');
INSERT INTO public.zip_codes VALUES ('3674', '18');
INSERT INTO public.zip_codes VALUES ('3673', '18');
INSERT INTO public.zip_codes VALUES ('3672', '18');
INSERT INTO public.zip_codes VALUES ('3671', '18');
INSERT INTO public.zip_codes VALUES ('3665', '18');
INSERT INTO public.zip_codes VALUES ('3664', '18');
INSERT INTO public.zip_codes VALUES ('3663', '18');
INSERT INTO public.zip_codes VALUES ('3662', '18');
INSERT INTO public.zip_codes VALUES ('3661', '20');
INSERT INTO public.zip_codes VALUES ('3658', '20');
INSERT INTO public.zip_codes VALUES ('3657', '20');
INSERT INTO public.zip_codes VALUES ('3656', '20');
INSERT INTO public.zip_codes VALUES ('3655', '20');
INSERT INTO public.zip_codes VALUES ('3654', '20');
INSERT INTO public.zip_codes VALUES ('3653', '20');
INSERT INTO public.zip_codes VALUES ('3652', '20');
INSERT INTO public.zip_codes VALUES ('3647', '20');
INSERT INTO public.zip_codes VALUES ('3646', '20');
INSERT INTO public.zip_codes VALUES ('3645', '20');
INSERT INTO public.zip_codes VALUES ('3638', '20');
INSERT INTO public.zip_codes VALUES ('3636', '20');
INSERT INTO public.zip_codes VALUES ('3635', '20');
INSERT INTO public.zip_codes VALUES ('3634', '20');
INSERT INTO public.zip_codes VALUES ('3633', '20');
INSERT INTO public.zip_codes VALUES ('3632', '20');
INSERT INTO public.zip_codes VALUES ('3631', '20');
INSERT INTO public.zip_codes VALUES ('3629', '18');
INSERT INTO public.zip_codes VALUES ('3628', '20');
INSERT INTO public.zip_codes VALUES ('3627', '20');
INSERT INTO public.zip_codes VALUES ('3626', '20');
INSERT INTO public.zip_codes VALUES ('3625', '20');
INSERT INTO public.zip_codes VALUES ('3624', '20');
INSERT INTO public.zip_codes VALUES ('3623', '20');
INSERT INTO public.zip_codes VALUES ('3622', '20');
INSERT INTO public.zip_codes VALUES ('3619', '20');
INSERT INTO public.zip_codes VALUES ('3618', '20');
INSERT INTO public.zip_codes VALUES ('3617', '20');
INSERT INTO public.zip_codes VALUES ('3616', '20');
INSERT INTO public.zip_codes VALUES ('3615', '20');
INSERT INTO public.zip_codes VALUES ('3614', '20');
INSERT INTO public.zip_codes VALUES ('3613', '20');
INSERT INTO public.zip_codes VALUES ('3612', '20');
INSERT INTO public.zip_codes VALUES ('3608', '20');
INSERT INTO public.zip_codes VALUES ('3604', '20');
INSERT INTO public.zip_codes VALUES ('3603', '20');
INSERT INTO public.zip_codes VALUES ('3600', '20');
INSERT INTO public.zip_codes VALUES ('3557', '17');
INSERT INTO public.zip_codes VALUES ('3556', '17');
INSERT INTO public.zip_codes VALUES ('3555', '17');
INSERT INTO public.zip_codes VALUES ('3553', '17');
INSERT INTO public.zip_codes VALUES ('3552', '17');
INSERT INTO public.zip_codes VALUES ('3551', '17');
INSERT INTO public.zip_codes VALUES ('3550', '17');
INSERT INTO public.zip_codes VALUES ('3543', '17');
INSERT INTO public.zip_codes VALUES ('3538', '17');
INSERT INTO public.zip_codes VALUES ('3537', '17');
INSERT INTO public.zip_codes VALUES ('3536', '17');
INSERT INTO public.zip_codes VALUES ('3535', '17');
INSERT INTO public.zip_codes VALUES ('3534', '17');
INSERT INTO public.zip_codes VALUES ('3533', '18');
INSERT INTO public.zip_codes VALUES ('3532', '18');
INSERT INTO public.zip_codes VALUES ('3531', '18');
INSERT INTO public.zip_codes VALUES ('3513', '18');
INSERT INTO public.zip_codes VALUES ('3512', '18');
INSERT INTO public.zip_codes VALUES ('3510', '18');
INSERT INTO public.zip_codes VALUES ('3508', '18');
INSERT INTO public.zip_codes VALUES ('3507', '18');
INSERT INTO public.zip_codes VALUES ('3506', '18');
INSERT INTO public.zip_codes VALUES ('3504', '18');
INSERT INTO public.zip_codes VALUES ('3503', '18');
INSERT INTO public.zip_codes VALUES ('3476', '15');
INSERT INTO public.zip_codes VALUES ('3475', '15');
INSERT INTO public.zip_codes VALUES ('3474', '16');
INSERT INTO public.zip_codes VALUES ('3473', '16');
INSERT INTO public.zip_codes VALUES ('3472', '16');
INSERT INTO public.zip_codes VALUES ('3465', '15');
INSERT INTO public.zip_codes VALUES ('3464', '15');
INSERT INTO public.zip_codes VALUES ('3463', '16');
INSERT INTO public.zip_codes VALUES ('3462', '16');
INSERT INTO public.zip_codes VALUES ('3457', '16');
INSERT INTO public.zip_codes VALUES ('3456', '16');
INSERT INTO public.zip_codes VALUES ('3455', '16');
INSERT INTO public.zip_codes VALUES ('3454', '16');
INSERT INTO public.zip_codes VALUES ('3453', '16');
INSERT INTO public.zip_codes VALUES ('3452', '16');
INSERT INTO public.zip_codes VALUES ('3439', '17');
INSERT INTO public.zip_codes VALUES ('3438', '17');
INSERT INTO public.zip_codes VALUES ('3437', '17');
INSERT INTO public.zip_codes VALUES ('3436', '17');
INSERT INTO public.zip_codes VALUES ('3435', '16');
INSERT INTO public.zip_codes VALUES ('3434', '17');
INSERT INTO public.zip_codes VALUES ('3433', '17');
INSERT INTO public.zip_codes VALUES ('3432', '16');
INSERT INTO public.zip_codes VALUES ('3429', '16');
INSERT INTO public.zip_codes VALUES ('3428', '16');
INSERT INTO public.zip_codes VALUES ('3427', '16');
INSERT INTO public.zip_codes VALUES ('3426', '16');
INSERT INTO public.zip_codes VALUES ('3425', '16');
INSERT INTO public.zip_codes VALUES ('3424', '16');
INSERT INTO public.zip_codes VALUES ('3423', '16');
INSERT INTO public.zip_codes VALUES ('3422', '16');
INSERT INTO public.zip_codes VALUES ('3421', '16');
INSERT INTO public.zip_codes VALUES ('3419', '16');
INSERT INTO public.zip_codes VALUES ('3418', '16');
INSERT INTO public.zip_codes VALUES ('3417', '16');
INSERT INTO public.zip_codes VALUES ('3416', '16');
INSERT INTO public.zip_codes VALUES ('3415', '16');
INSERT INTO public.zip_codes VALUES ('3414', '16');
INSERT INTO public.zip_codes VALUES ('3413', '16');
INSERT INTO public.zip_codes VALUES ('3412', '16');
INSERT INTO public.zip_codes VALUES ('3400', '16');
INSERT INTO public.zip_codes VALUES ('3380', '15');
INSERT INTO public.zip_codes VALUES ('3377', '15');
INSERT INTO public.zip_codes VALUES ('3376', '15');
INSERT INTO public.zip_codes VALUES ('3375', '15');
INSERT INTO public.zip_codes VALUES ('3374', '15');
INSERT INTO public.zip_codes VALUES ('3373', '15');
INSERT INTO public.zip_codes VALUES ('3372', '15');
INSERT INTO public.zip_codes VALUES ('3368', '15');
INSERT INTO public.zip_codes VALUES ('3367', '15');
INSERT INTO public.zip_codes VALUES ('3366', '15');
INSERT INTO public.zip_codes VALUES ('3365', '15');
INSERT INTO public.zip_codes VALUES ('3363', '15');
INSERT INTO public.zip_codes VALUES ('3362', '15');
INSERT INTO public.zip_codes VALUES ('3360', '15');
INSERT INTO public.zip_codes VALUES ('3326', '16');
INSERT INTO public.zip_codes VALUES ('3325', '16');
INSERT INTO public.zip_codes VALUES ('3324', '16');
INSERT INTO public.zip_codes VALUES ('3323', '11');
INSERT INTO public.zip_codes VALUES ('3322', '11');
INSERT INTO public.zip_codes VALUES ('3317', '16');
INSERT INTO public.zip_codes VALUES ('3315', '16');
INSERT INTO public.zip_codes VALUES ('3314', '16');
INSERT INTO public.zip_codes VALUES ('3313', '16');
INSERT INTO public.zip_codes VALUES ('3312', '16');
INSERT INTO public.zip_codes VALUES ('3309', '16');
INSERT INTO public.zip_codes VALUES ('3308', '16');
INSERT INTO public.zip_codes VALUES ('3307', '46');
INSERT INTO public.zip_codes VALUES ('3306', '16');
INSERT INTO public.zip_codes VALUES ('3305', '11');
INSERT INTO public.zip_codes VALUES ('3303', '11');
INSERT INTO public.zip_codes VALUES ('3302', '11');
INSERT INTO public.zip_codes VALUES ('3298', '24');
INSERT INTO public.zip_codes VALUES ('3297', '24');
INSERT INTO public.zip_codes VALUES ('3296', '24');
INSERT INTO public.zip_codes VALUES ('3295', '24');
INSERT INTO public.zip_codes VALUES ('3294', '24');
INSERT INTO public.zip_codes VALUES ('3293', '12');
INSERT INTO public.zip_codes VALUES ('3292', '12');
INSERT INTO public.zip_codes VALUES ('3286', '42');
INSERT INTO public.zip_codes VALUES ('3285', '42');
INSERT INTO public.zip_codes VALUES ('3284', '42');
INSERT INTO public.zip_codes VALUES ('3283', '12');
INSERT INTO public.zip_codes VALUES ('3282', '12');
INSERT INTO public.zip_codes VALUES ('3280', '42');
INSERT INTO public.zip_codes VALUES ('3274', '13');
INSERT INTO public.zip_codes VALUES ('3273', '12');
INSERT INTO public.zip_codes VALUES ('3272', '12');
INSERT INTO public.zip_codes VALUES ('3271', '12');
INSERT INTO public.zip_codes VALUES ('3270', '12');
INSERT INTO public.zip_codes VALUES ('3268', '12');
INSERT INTO public.zip_codes VALUES ('3267', '12');
INSERT INTO public.zip_codes VALUES ('3266', '12');
INSERT INTO public.zip_codes VALUES ('3264', '12');
INSERT INTO public.zip_codes VALUES ('3263', '12');
INSERT INTO public.zip_codes VALUES ('3262', '12');
INSERT INTO public.zip_codes VALUES ('3257', '12');
INSERT INTO public.zip_codes VALUES ('3256', '12');
INSERT INTO public.zip_codes VALUES ('3255', '12');
INSERT INTO public.zip_codes VALUES ('3254', '46');
INSERT INTO public.zip_codes VALUES ('3253', '46');
INSERT INTO public.zip_codes VALUES ('3252', '12');
INSERT INTO public.zip_codes VALUES ('3251', '12');
INSERT INTO public.zip_codes VALUES ('3250', '12');
INSERT INTO public.zip_codes VALUES ('3238', '12');
INSERT INTO public.zip_codes VALUES ('3237', '12');
INSERT INTO public.zip_codes VALUES ('3236', '12');
INSERT INTO public.zip_codes VALUES ('3235', '12');
INSERT INTO public.zip_codes VALUES ('3234', '12');
INSERT INTO public.zip_codes VALUES ('3233', '12');
INSERT INTO public.zip_codes VALUES ('3232', '12');
INSERT INTO public.zip_codes VALUES ('3226', '12');
INSERT INTO public.zip_codes VALUES ('3225', '12');
INSERT INTO public.zip_codes VALUES ('3216', '42');
INSERT INTO public.zip_codes VALUES ('3215', '42');
INSERT INTO public.zip_codes VALUES ('3214', '42');
INSERT INTO public.zip_codes VALUES ('3213', '42');
INSERT INTO public.zip_codes VALUES ('3212', '42');
INSERT INTO public.zip_codes VALUES ('3210', '42');
INSERT INTO public.zip_codes VALUES ('3208', '42');
INSERT INTO public.zip_codes VALUES ('3207', '42');
INSERT INTO public.zip_codes VALUES ('3206', '42');
INSERT INTO public.zip_codes VALUES ('3205', '42');
INSERT INTO public.zip_codes VALUES ('3204', '42');
INSERT INTO public.zip_codes VALUES ('3203', '42');
INSERT INTO public.zip_codes VALUES ('3202', '11');
INSERT INTO public.zip_codes VALUES ('3186', '41');
INSERT INTO public.zip_codes VALUES ('3185', '41');
INSERT INTO public.zip_codes VALUES ('3184', '41');
INSERT INTO public.zip_codes VALUES ('3183', '19');
INSERT INTO public.zip_codes VALUES ('3182', '41');
INSERT INTO public.zip_codes VALUES ('3179', '42');
INSERT INTO public.zip_codes VALUES ('3178', '41');
INSERT INTO public.zip_codes VALUES ('3177', '42');
INSERT INTO public.zip_codes VALUES ('3176', '42');
INSERT INTO public.zip_codes VALUES ('3175', '41');
INSERT INTO public.zip_codes VALUES ('3174', '11');
INSERT INTO public.zip_codes VALUES ('3173', '11');
INSERT INTO public.zip_codes VALUES ('3172', '11');
INSERT INTO public.zip_codes VALUES ('3159', '19');
INSERT INTO public.zip_codes VALUES ('3158', '19');
INSERT INTO public.zip_codes VALUES ('3157', '19');
INSERT INTO public.zip_codes VALUES ('3156', '19');
INSERT INTO public.zip_codes VALUES ('3155', '19');
INSERT INTO public.zip_codes VALUES ('3154', '19');
INSERT INTO public.zip_codes VALUES ('3153', '19');
INSERT INTO public.zip_codes VALUES ('3152', '19');
INSERT INTO public.zip_codes VALUES ('3150', '19');
INSERT INTO public.zip_codes VALUES ('3148', '19');
INSERT INTO public.zip_codes VALUES ('3147', '11');
INSERT INTO public.zip_codes VALUES ('3145', '11');
INSERT INTO public.zip_codes VALUES ('3144', '11');
INSERT INTO public.zip_codes VALUES ('3132', '19');
INSERT INTO public.zip_codes VALUES ('3128', '19');
INSERT INTO public.zip_codes VALUES ('3127', '18');
INSERT INTO public.zip_codes VALUES ('3126', '18');
INSERT INTO public.zip_codes VALUES ('3125', '18');
INSERT INTO public.zip_codes VALUES ('3124', '11');
INSERT INTO public.zip_codes VALUES ('3123', '11');
INSERT INTO public.zip_codes VALUES ('3122', '11');
INSERT INTO public.zip_codes VALUES ('3116', '18');
INSERT INTO public.zip_codes VALUES ('3115', '18');
INSERT INTO public.zip_codes VALUES ('3114', '18');
INSERT INTO public.zip_codes VALUES ('3113', '18');
INSERT INTO public.zip_codes VALUES ('3112', '11');
INSERT INTO public.zip_codes VALUES ('3111', '18');
INSERT INTO public.zip_codes VALUES ('3110', '18');
INSERT INTO public.zip_codes VALUES ('3099', '19');
INSERT INTO public.zip_codes VALUES ('3098', '11');
INSERT INTO public.zip_codes VALUES ('3097', '11');
INSERT INTO public.zip_codes VALUES ('3096', '19');
INSERT INTO public.zip_codes VALUES ('3095', '11');
INSERT INTO public.zip_codes VALUES ('3089', '19');
INSERT INTO public.zip_codes VALUES ('3088', '19');
INSERT INTO public.zip_codes VALUES ('3087', '19');
INSERT INTO public.zip_codes VALUES ('3086', '19');
INSERT INTO public.zip_codes VALUES ('3084', '11');
INSERT INTO public.zip_codes VALUES ('3083', '18');
INSERT INTO public.zip_codes VALUES ('3082', '18');
INSERT INTO public.zip_codes VALUES ('3078', '11');
INSERT INTO public.zip_codes VALUES ('3077', '11');
INSERT INTO public.zip_codes VALUES ('3076', '11');
INSERT INTO public.zip_codes VALUES ('3075', '11');
INSERT INTO public.zip_codes VALUES ('3074', '11');
INSERT INTO public.zip_codes VALUES ('3073', '11');
INSERT INTO public.zip_codes VALUES ('3072', '11');
INSERT INTO public.zip_codes VALUES ('3068', '11');
INSERT INTO public.zip_codes VALUES ('3067', '11');
INSERT INTO public.zip_codes VALUES ('3066', '11');
INSERT INTO public.zip_codes VALUES ('3065', '11');
INSERT INTO public.zip_codes VALUES ('3063', '11');
INSERT INTO public.zip_codes VALUES ('3054', '12');
INSERT INTO public.zip_codes VALUES ('3053', '11');
INSERT INTO public.zip_codes VALUES ('3052', '11');
INSERT INTO public.zip_codes VALUES ('3049', '11');
INSERT INTO public.zip_codes VALUES ('3048', '11');
INSERT INTO public.zip_codes VALUES ('3047', '11');
INSERT INTO public.zip_codes VALUES ('3046', '11');
INSERT INTO public.zip_codes VALUES ('3045', '11');
INSERT INTO public.zip_codes VALUES ('3044', '11');
INSERT INTO public.zip_codes VALUES ('3043', '11');
INSERT INTO public.zip_codes VALUES ('3042', '11');
INSERT INTO public.zip_codes VALUES ('3038', '11');
INSERT INTO public.zip_codes VALUES ('3037', '11');
INSERT INTO public.zip_codes VALUES ('3036', '12');
INSERT INTO public.zip_codes VALUES ('3035', '12');
INSERT INTO public.zip_codes VALUES ('3034', '11');
INSERT INTO public.zip_codes VALUES ('3033', '11');
INSERT INTO public.zip_codes VALUES ('3032', '11');
INSERT INTO public.zip_codes VALUES ('3027', '11');
INSERT INTO public.zip_codes VALUES ('3020', '11');
INSERT INTO public.zip_codes VALUES ('3019', '11');
INSERT INTO public.zip_codes VALUES ('3018', '11');
INSERT INTO public.zip_codes VALUES ('3015', '11');
INSERT INTO public.zip_codes VALUES ('3014', '11');
INSERT INTO public.zip_codes VALUES ('3013', '11');
INSERT INTO public.zip_codes VALUES ('3012', '11');
INSERT INTO public.zip_codes VALUES ('3011', '11');
INSERT INTO public.zip_codes VALUES ('3010', '11');
INSERT INTO public.zip_codes VALUES ('3008', '11');
INSERT INTO public.zip_codes VALUES ('3007', '11');
INSERT INTO public.zip_codes VALUES ('3006', '11');
INSERT INTO public.zip_codes VALUES ('3005', '11');
INSERT INTO public.zip_codes VALUES ('3004', '11');
INSERT INTO public.zip_codes VALUES ('2954', '106');
INSERT INTO public.zip_codes VALUES ('2953', '106');
INSERT INTO public.zip_codes VALUES ('2952', '106');
INSERT INTO public.zip_codes VALUES ('2950', '106');
INSERT INTO public.zip_codes VALUES ('2947', '106');
INSERT INTO public.zip_codes VALUES ('2946', '106');
INSERT INTO public.zip_codes VALUES ('2944', '106');
INSERT INTO public.zip_codes VALUES ('2943', '106');
INSERT INTO public.zip_codes VALUES ('2942', '106');
INSERT INTO public.zip_codes VALUES ('2935', '106');
INSERT INTO public.zip_codes VALUES ('2933', '106');
INSERT INTO public.zip_codes VALUES ('2932', '106');
INSERT INTO public.zip_codes VALUES ('2926', '106');
INSERT INTO public.zip_codes VALUES ('2925', '106');
INSERT INTO public.zip_codes VALUES ('2924', '106');
INSERT INTO public.zip_codes VALUES ('2923', '106');
INSERT INTO public.zip_codes VALUES ('2922', '106');
INSERT INTO public.zip_codes VALUES ('2916', '106');
INSERT INTO public.zip_codes VALUES ('2915', '106');
INSERT INTO public.zip_codes VALUES ('2914', '106');
INSERT INTO public.zip_codes VALUES ('2912', '106');
INSERT INTO public.zip_codes VALUES ('2908', '106');
INSERT INTO public.zip_codes VALUES ('2907', '106');
INSERT INTO public.zip_codes VALUES ('2906', '106');
INSERT INTO public.zip_codes VALUES ('2905', '106');
INSERT INTO public.zip_codes VALUES ('2904', '106');
INSERT INTO public.zip_codes VALUES ('2903', '106');
INSERT INTO public.zip_codes VALUES ('2902', '106');
INSERT INTO public.zip_codes VALUES ('2900', '106');
INSERT INTO public.zip_codes VALUES ('2889', '106');
INSERT INTO public.zip_codes VALUES ('2888', '106');
INSERT INTO public.zip_codes VALUES ('2887', '106');
INSERT INTO public.zip_codes VALUES ('2886', '106');
INSERT INTO public.zip_codes VALUES ('2885', '106');
INSERT INTO public.zip_codes VALUES ('2884', '106');
INSERT INTO public.zip_codes VALUES ('2883', '106');
INSERT INTO public.zip_codes VALUES ('2882', '106');
INSERT INTO public.zip_codes VALUES ('2873', '106');
INSERT INTO public.zip_codes VALUES ('2864', '106');
INSERT INTO public.zip_codes VALUES ('2863', '106');
INSERT INTO public.zip_codes VALUES ('2857', '106');
INSERT INTO public.zip_codes VALUES ('2856', '106');
INSERT INTO public.zip_codes VALUES ('2855', '106');
INSERT INTO public.zip_codes VALUES ('2854', '106');
INSERT INTO public.zip_codes VALUES ('2853', '106');
INSERT INTO public.zip_codes VALUES ('2852', '106');
INSERT INTO public.zip_codes VALUES ('2843', '106');
INSERT INTO public.zip_codes VALUES ('2842', '106');
INSERT INTO public.zip_codes VALUES ('2832', '106');
INSERT INTO public.zip_codes VALUES ('2830', '106');
INSERT INTO public.zip_codes VALUES ('2829', '106');
INSERT INTO public.zip_codes VALUES ('2828', '106');
INSERT INTO public.zip_codes VALUES ('2827', '106');
INSERT INTO public.zip_codes VALUES ('2826', '106');
INSERT INTO public.zip_codes VALUES ('2825', '106');
INSERT INTO public.zip_codes VALUES ('2824', '106');
INSERT INTO public.zip_codes VALUES ('2823', '106');
INSERT INTO public.zip_codes VALUES ('2822', '106');
INSERT INTO public.zip_codes VALUES ('2814', '25');
INSERT INTO public.zip_codes VALUES ('2813', '106');
INSERT INTO public.zip_codes VALUES ('2812', '106');
INSERT INTO public.zip_codes VALUES ('2807', '106');
INSERT INTO public.zip_codes VALUES ('2806', '106');
INSERT INTO public.zip_codes VALUES ('2805', '106');
INSERT INTO public.zip_codes VALUES ('2803', '106');
INSERT INTO public.zip_codes VALUES ('2802', '106');
INSERT INTO public.zip_codes VALUES ('2800', '106');
INSERT INTO public.zip_codes VALUES ('2762', '14');
INSERT INTO public.zip_codes VALUES ('2748', '14');
INSERT INTO public.zip_codes VALUES ('2747', '14');
INSERT INTO public.zip_codes VALUES ('2746', '14');
INSERT INTO public.zip_codes VALUES ('2745', '14');
INSERT INTO public.zip_codes VALUES ('2744', '14');
INSERT INTO public.zip_codes VALUES ('2743', '14');
INSERT INTO public.zip_codes VALUES ('2742', '14');
INSERT INTO public.zip_codes VALUES ('2740', '14');
INSERT INTO public.zip_codes VALUES ('2738', '14');
INSERT INTO public.zip_codes VALUES ('2736', '14');
INSERT INTO public.zip_codes VALUES ('2735', '14');
INSERT INTO public.zip_codes VALUES ('2733', '14');
INSERT INTO public.zip_codes VALUES ('2732', '14');
INSERT INTO public.zip_codes VALUES ('2723', '103');
INSERT INTO public.zip_codes VALUES ('2722', '103');
INSERT INTO public.zip_codes VALUES ('2720', '103');
INSERT INTO public.zip_codes VALUES ('2718', '106');
INSERT INTO public.zip_codes VALUES ('2717', '14');
INSERT INTO public.zip_codes VALUES ('2716', '14');
INSERT INTO public.zip_codes VALUES ('2715', '14');
INSERT INTO public.zip_codes VALUES ('2714', '106');
INSERT INTO public.zip_codes VALUES ('2713', '14');
INSERT INTO public.zip_codes VALUES ('2712', '14');
INSERT INTO public.zip_codes VALUES ('2710', '14');
INSERT INTO public.zip_codes VALUES ('2616', '103');
INSERT INTO public.zip_codes VALUES ('2615', '103');
INSERT INTO public.zip_codes VALUES ('2613', '103');
INSERT INTO public.zip_codes VALUES ('2612', '103');
INSERT INTO public.zip_codes VALUES ('2610', '103');
INSERT INTO public.zip_codes VALUES ('2608', '103');
INSERT INTO public.zip_codes VALUES ('2607', '14');
INSERT INTO public.zip_codes VALUES ('2606', '14');
INSERT INTO public.zip_codes VALUES ('2605', '14');
INSERT INTO public.zip_codes VALUES ('2604', '14');
INSERT INTO public.zip_codes VALUES ('2603', '14');
INSERT INTO public.zip_codes VALUES ('2577', '12');
INSERT INTO public.zip_codes VALUES ('2576', '12');
INSERT INTO public.zip_codes VALUES ('2575', '13');
INSERT INTO public.zip_codes VALUES ('2572', '13');
INSERT INTO public.zip_codes VALUES ('2565', '13');
INSERT INTO public.zip_codes VALUES ('2564', '13');
INSERT INTO public.zip_codes VALUES ('2563', '13');
INSERT INTO public.zip_codes VALUES ('2562', '13');
INSERT INTO public.zip_codes VALUES ('2560', '13');
INSERT INTO public.zip_codes VALUES ('2558', '13');
INSERT INTO public.zip_codes VALUES ('2557', '13');
INSERT INTO public.zip_codes VALUES ('2556', '13');
INSERT INTO public.zip_codes VALUES ('2555', '13');
INSERT INTO public.zip_codes VALUES ('2554', '24');
INSERT INTO public.zip_codes VALUES ('2553', '13');
INSERT INTO public.zip_codes VALUES ('2552', '13');
INSERT INTO public.zip_codes VALUES ('2545', '46');
INSERT INTO public.zip_codes VALUES ('2544', '24');
INSERT INTO public.zip_codes VALUES ('2543', '24');
INSERT INTO public.zip_codes VALUES ('2542', '13');
INSERT INTO public.zip_codes VALUES ('2540', '24');
INSERT INTO public.zip_codes VALUES ('2538', '14');
INSERT INTO public.zip_codes VALUES ('2537', '14');
INSERT INTO public.zip_codes VALUES ('2536', '14');
INSERT INTO public.zip_codes VALUES ('2535', '14');
INSERT INTO public.zip_codes VALUES ('2534', '14');
INSERT INTO public.zip_codes VALUES ('2533', '13');
INSERT INTO public.zip_codes VALUES ('2532', '13');
INSERT INTO public.zip_codes VALUES ('2525', '102');
INSERT INTO public.zip_codes VALUES ('2523', '102');
INSERT INTO public.zip_codes VALUES ('2520', '14');
INSERT INTO public.zip_codes VALUES ('2518', '14');
INSERT INTO public.zip_codes VALUES ('2517', '14');
INSERT INTO public.zip_codes VALUES ('2516', '14');
INSERT INTO public.zip_codes VALUES ('2515', '14');
INSERT INTO public.zip_codes VALUES ('2514', '13');
INSERT INTO public.zip_codes VALUES ('2513', '13');
INSERT INTO public.zip_codes VALUES ('2512', '13');
INSERT INTO public.zip_codes VALUES ('2505', '13');
INSERT INTO public.zip_codes VALUES ('2504', '13');
INSERT INTO public.zip_codes VALUES ('2503', '13');
INSERT INTO public.zip_codes VALUES ('2502', '13');
INSERT INTO public.zip_codes VALUES ('2416', '103');
INSERT INTO public.zip_codes VALUES ('2414', '103');
INSERT INTO public.zip_codes VALUES ('2406', '103');
INSERT INTO public.zip_codes VALUES ('2405', '103');
INSERT INTO public.zip_codes VALUES ('2400', '103');
INSERT INTO public.zip_codes VALUES ('2364', '106');
INSERT INTO public.zip_codes VALUES ('2363', '106');
INSERT INTO public.zip_codes VALUES ('2362', '106');
INSERT INTO public.zip_codes VALUES ('2360', '106');
INSERT INTO public.zip_codes VALUES ('2354', '106');
INSERT INTO public.zip_codes VALUES ('2353', '106');
INSERT INTO public.zip_codes VALUES ('2350', '106');
INSERT INTO public.zip_codes VALUES ('2345', '106');
INSERT INTO public.zip_codes VALUES ('2340', '106');
INSERT INTO public.zip_codes VALUES ('2338', '106');
INSERT INTO public.zip_codes VALUES ('2336', '106');
INSERT INTO public.zip_codes VALUES ('2333', '103');
INSERT INTO public.zip_codes VALUES ('2325', '103');
INSERT INTO public.zip_codes VALUES ('2322', '103');
INSERT INTO public.zip_codes VALUES ('2318', '103');
INSERT INTO public.zip_codes VALUES ('2316', '103');
INSERT INTO public.zip_codes VALUES ('2314', '103');
INSERT INTO public.zip_codes VALUES ('2300', '103');
INSERT INTO public.zip_codes VALUES ('2208', '102');
INSERT INTO public.zip_codes VALUES ('2207', '102');
INSERT INTO public.zip_codes VALUES ('2206', '102');
INSERT INTO public.zip_codes VALUES ('2149', '102');
INSERT INTO public.zip_codes VALUES ('2127', '104');
INSERT INTO public.zip_codes VALUES ('2126', '104');
INSERT INTO public.zip_codes VALUES ('2124', '104');
INSERT INTO public.zip_codes VALUES ('2123', '104');
INSERT INTO public.zip_codes VALUES ('2117', '104');
INSERT INTO public.zip_codes VALUES ('2116', '104');
INSERT INTO public.zip_codes VALUES ('2115', '104');
INSERT INTO public.zip_codes VALUES ('2114', '104');
INSERT INTO public.zip_codes VALUES ('2113', '104');
INSERT INTO public.zip_codes VALUES ('2112', '104');
INSERT INTO public.zip_codes VALUES ('2108', '104');
INSERT INTO public.zip_codes VALUES ('2105', '104');
INSERT INTO public.zip_codes VALUES ('2103', '104');
INSERT INTO public.zip_codes VALUES ('2088', '102');
INSERT INTO public.zip_codes VALUES ('2087', '102');
INSERT INTO public.zip_codes VALUES ('2075', '102');
INSERT INTO public.zip_codes VALUES ('2074', '102');
INSERT INTO public.zip_codes VALUES ('2073', '102');
INSERT INTO public.zip_codes VALUES ('2072', '102');
INSERT INTO public.zip_codes VALUES ('2068', '102');
INSERT INTO public.zip_codes VALUES ('2067', '102');
INSERT INTO public.zip_codes VALUES ('2065', '102');
INSERT INTO public.zip_codes VALUES ('2063', '102');
INSERT INTO public.zip_codes VALUES ('2058', '102');
INSERT INTO public.zip_codes VALUES ('2057', '102');
INSERT INTO public.zip_codes VALUES ('2056', '102');
INSERT INTO public.zip_codes VALUES ('2054', '102');
INSERT INTO public.zip_codes VALUES ('2053', '102');
INSERT INTO public.zip_codes VALUES ('2052', '102');
INSERT INTO public.zip_codes VALUES ('2046', '102');
INSERT INTO public.zip_codes VALUES ('2043', '102');
INSERT INTO public.zip_codes VALUES ('2042', '102');
INSERT INTO public.zip_codes VALUES ('2037', '102');
INSERT INTO public.zip_codes VALUES ('2036', '102');
INSERT INTO public.zip_codes VALUES ('2035', '102');
INSERT INTO public.zip_codes VALUES ('2034', '102');
INSERT INTO public.zip_codes VALUES ('2028', '102');
INSERT INTO public.zip_codes VALUES ('2027', '102');
INSERT INTO public.zip_codes VALUES ('2025', '102');
INSERT INTO public.zip_codes VALUES ('2024', '102');
INSERT INTO public.zip_codes VALUES ('2023', '102');
INSERT INTO public.zip_codes VALUES ('2022', '102');
INSERT INTO public.zip_codes VALUES ('2019', '102');
INSERT INTO public.zip_codes VALUES ('2017', '102');
INSERT INTO public.zip_codes VALUES ('2016', '102');
INSERT INTO public.zip_codes VALUES ('2015', '102');
INSERT INTO public.zip_codes VALUES ('2014', '102');
INSERT INTO public.zip_codes VALUES ('2013', '102');
INSERT INTO public.zip_codes VALUES ('2012', '102');
INSERT INTO public.zip_codes VALUES ('2000', '102');
INSERT INTO public.zip_codes VALUES ('1997', '99');
INSERT INTO public.zip_codes VALUES ('1996', '99');
INSERT INTO public.zip_codes VALUES ('1994', '99');
INSERT INTO public.zip_codes VALUES ('1993', '99');
INSERT INTO public.zip_codes VALUES ('1992', '99');
INSERT INTO public.zip_codes VALUES ('1991', '99');
INSERT INTO public.zip_codes VALUES ('1988', '99');
INSERT INTO public.zip_codes VALUES ('1987', '99');
INSERT INTO public.zip_codes VALUES ('1986', '99');
INSERT INTO public.zip_codes VALUES ('1985', '99');
INSERT INTO public.zip_codes VALUES ('1984', '99');
INSERT INTO public.zip_codes VALUES ('1983', '99');
INSERT INTO public.zip_codes VALUES ('1982', '99');
INSERT INTO public.zip_codes VALUES ('1981', '99');
INSERT INTO public.zip_codes VALUES ('1978', '98');
INSERT INTO public.zip_codes VALUES ('1977', '98');
INSERT INTO public.zip_codes VALUES ('1976', '99');
INSERT INTO public.zip_codes VALUES ('1975', '99');
INSERT INTO public.zip_codes VALUES ('1974', '99');
INSERT INTO public.zip_codes VALUES ('1973', '99');
INSERT INTO public.zip_codes VALUES ('1972', '99');
INSERT INTO public.zip_codes VALUES ('1971', '99');
INSERT INTO public.zip_codes VALUES ('1969', '99');
INSERT INTO public.zip_codes VALUES ('1968', '99');
INSERT INTO public.zip_codes VALUES ('1967', '99');
INSERT INTO public.zip_codes VALUES ('1966', '99');
INSERT INTO public.zip_codes VALUES ('1965', '99');
INSERT INTO public.zip_codes VALUES ('1964', '99');
INSERT INTO public.zip_codes VALUES ('1963', '99');
INSERT INTO public.zip_codes VALUES ('1962', '99');
INSERT INTO public.zip_codes VALUES ('1961', '99');
INSERT INTO public.zip_codes VALUES ('1958', '99');
INSERT INTO public.zip_codes VALUES ('1957', '99');
INSERT INTO public.zip_codes VALUES ('1955', '99');
INSERT INTO public.zip_codes VALUES ('1950', '99');
INSERT INTO public.zip_codes VALUES ('1948', '100');
INSERT INTO public.zip_codes VALUES ('1947', '100');
INSERT INTO public.zip_codes VALUES ('1946', '100');
INSERT INTO public.zip_codes VALUES ('1945', '100');
INSERT INTO public.zip_codes VALUES ('1944', '100');
INSERT INTO public.zip_codes VALUES ('1943', '100');
INSERT INTO public.zip_codes VALUES ('1942', '100');
INSERT INTO public.zip_codes VALUES ('1941', '100');
INSERT INTO public.zip_codes VALUES ('1938', '100');
INSERT INTO public.zip_codes VALUES ('1937', '100');
INSERT INTO public.zip_codes VALUES ('1936', '100');
INSERT INTO public.zip_codes VALUES ('1934', '100');
INSERT INTO public.zip_codes VALUES ('1933', '100');
INSERT INTO public.zip_codes VALUES ('1932', '100');
INSERT INTO public.zip_codes VALUES ('1929', '100');
INSERT INTO public.zip_codes VALUES ('1928', '100');
INSERT INTO public.zip_codes VALUES ('1927', '100');
INSERT INTO public.zip_codes VALUES ('1926', '100');
INSERT INTO public.zip_codes VALUES ('1925', '100');
INSERT INTO public.zip_codes VALUES ('1923', '100');
INSERT INTO public.zip_codes VALUES ('1922', '100');
INSERT INTO public.zip_codes VALUES ('1921', '100');
INSERT INTO public.zip_codes VALUES ('1920', '100');
INSERT INTO public.zip_codes VALUES ('1918', '100');
INSERT INTO public.zip_codes VALUES ('1914', '100');
INSERT INTO public.zip_codes VALUES ('1913', '100');
INSERT INTO public.zip_codes VALUES ('1912', '100');
INSERT INTO public.zip_codes VALUES ('1911', '100');
INSERT INTO public.zip_codes VALUES ('1908', '100');
INSERT INTO public.zip_codes VALUES ('1907', '100');
INSERT INTO public.zip_codes VALUES ('1906', '100');
INSERT INTO public.zip_codes VALUES ('1905', '100');
INSERT INTO public.zip_codes VALUES ('1904', '100');
INSERT INTO public.zip_codes VALUES ('1903', '100');
INSERT INTO public.zip_codes VALUES ('1902', '101');
INSERT INTO public.zip_codes VALUES ('1899', '101');
INSERT INTO public.zip_codes VALUES ('1898', '101');
INSERT INTO public.zip_codes VALUES ('1897', '101');
INSERT INTO public.zip_codes VALUES ('1896', '101');
INSERT INTO public.zip_codes VALUES ('1895', '101');
INSERT INTO public.zip_codes VALUES ('1893', '101');
INSERT INTO public.zip_codes VALUES ('1892', '88');
INSERT INTO public.zip_codes VALUES ('1891', '101');
INSERT INTO public.zip_codes VALUES ('1890', '101');
INSERT INTO public.zip_codes VALUES ('1885', '88');
INSERT INTO public.zip_codes VALUES ('1884', '88');
INSERT INTO public.zip_codes VALUES ('1882', '88');
INSERT INTO public.zip_codes VALUES ('1880', '88');
INSERT INTO public.zip_codes VALUES ('1875', '101');
INSERT INTO public.zip_codes VALUES ('1874', '101');
INSERT INTO public.zip_codes VALUES ('1873', '101');
INSERT INTO public.zip_codes VALUES ('1872', '101');
INSERT INTO public.zip_codes VALUES ('1871', '101');
INSERT INTO public.zip_codes VALUES ('1870', '101');
INSERT INTO public.zip_codes VALUES ('1869', '101');
INSERT INTO public.zip_codes VALUES ('1868', '101');
INSERT INTO public.zip_codes VALUES ('1867', '88');
INSERT INTO public.zip_codes VALUES ('1866', '88');
INSERT INTO public.zip_codes VALUES ('1865', '88');
INSERT INTO public.zip_codes VALUES ('1864', '88');
INSERT INTO public.zip_codes VALUES ('1863', '88');
INSERT INTO public.zip_codes VALUES ('1862', '88');
INSERT INTO public.zip_codes VALUES ('1860', '88');
INSERT INTO public.zip_codes VALUES ('1856', '88');
INSERT INTO public.zip_codes VALUES ('1854', '88');
INSERT INTO public.zip_codes VALUES ('1853', '88');
INSERT INTO public.zip_codes VALUES ('1852', '88');
INSERT INTO public.zip_codes VALUES ('1847', '88');
INSERT INTO public.zip_codes VALUES ('1846', '88');
INSERT INTO public.zip_codes VALUES ('1845', '88');
INSERT INTO public.zip_codes VALUES ('1844', '88');
INSERT INTO public.zip_codes VALUES ('1833', '87');
INSERT INTO public.zip_codes VALUES ('1832', '87');
INSERT INTO public.zip_codes VALUES ('1824', '87');
INSERT INTO public.zip_codes VALUES ('1823', '87');
INSERT INTO public.zip_codes VALUES ('1822', '87');
INSERT INTO public.zip_codes VALUES ('1820', '87');
INSERT INTO public.zip_codes VALUES ('1817', '87');
INSERT INTO public.zip_codes VALUES ('1816', '87');
INSERT INTO public.zip_codes VALUES ('1815', '87');
INSERT INTO public.zip_codes VALUES ('1814', '87');
INSERT INTO public.zip_codes VALUES ('1809', '87');
INSERT INTO public.zip_codes VALUES ('1808', '87');
INSERT INTO public.zip_codes VALUES ('1807', '87');
INSERT INTO public.zip_codes VALUES ('1806', '87');
INSERT INTO public.zip_codes VALUES ('1805', '87');
INSERT INTO public.zip_codes VALUES ('1804', '87');
INSERT INTO public.zip_codes VALUES ('1803', '87');
INSERT INTO public.zip_codes VALUES ('1802', '87');
INSERT INTO public.zip_codes VALUES ('1801', '87');
INSERT INTO public.zip_codes VALUES ('1800', '87');
INSERT INTO public.zip_codes VALUES ('1797', '42');
INSERT INTO public.zip_codes VALUES ('1796', '42');
INSERT INTO public.zip_codes VALUES ('1795', '42');
INSERT INTO public.zip_codes VALUES ('1794', '42');
INSERT INTO public.zip_codes VALUES ('1793', '42');
INSERT INTO public.zip_codes VALUES ('1792', '42');
INSERT INTO public.zip_codes VALUES ('1791', '42');
INSERT INTO public.zip_codes VALUES ('1789', '42');
INSERT INTO public.zip_codes VALUES ('1788', '42');
INSERT INTO public.zip_codes VALUES ('1787', '42');
INSERT INTO public.zip_codes VALUES ('1786', '42');
INSERT INTO public.zip_codes VALUES ('1785', '42');
INSERT INTO public.zip_codes VALUES ('1784', '42');
INSERT INTO public.zip_codes VALUES ('1783', '42');
INSERT INTO public.zip_codes VALUES ('1782', '39');
INSERT INTO public.zip_codes VALUES ('1776', '93');
INSERT INTO public.zip_codes VALUES ('1775', '93');
INSERT INTO public.zip_codes VALUES ('1774', '93');
INSERT INTO public.zip_codes VALUES ('1773', '93');
INSERT INTO public.zip_codes VALUES ('1772', '39');
INSERT INTO public.zip_codes VALUES ('1763', '39');
INSERT INTO public.zip_codes VALUES ('1762', '39');
INSERT INTO public.zip_codes VALUES ('1757', '39');
INSERT INTO public.zip_codes VALUES ('1756', '39');
INSERT INTO public.zip_codes VALUES ('1754', '39');
INSERT INTO public.zip_codes VALUES ('1753', '39');
INSERT INTO public.zip_codes VALUES ('1752', '39');
INSERT INTO public.zip_codes VALUES ('1749', '43');
INSERT INTO public.zip_codes VALUES ('1748', '43');
INSERT INTO public.zip_codes VALUES ('1747', '39');
INSERT INTO public.zip_codes VALUES ('1746', '39');
INSERT INTO public.zip_codes VALUES ('1745', '39');
INSERT INTO public.zip_codes VALUES ('1744', '39');
INSERT INTO public.zip_codes VALUES ('1742', '39');
INSERT INTO public.zip_codes VALUES ('1741', '39');
INSERT INTO public.zip_codes VALUES ('1740', '39');
INSERT INTO public.zip_codes VALUES ('1738', '19');
INSERT INTO public.zip_codes VALUES ('1737', '41');
INSERT INTO public.zip_codes VALUES ('1736', '41');
INSERT INTO public.zip_codes VALUES ('1735', '41');
INSERT INTO public.zip_codes VALUES ('1734', '41');
INSERT INTO public.zip_codes VALUES ('1733', '39');
INSERT INTO public.zip_codes VALUES ('1732', '39');
INSERT INTO public.zip_codes VALUES ('1731', '39');
INSERT INTO public.zip_codes VALUES ('1730', '39');
INSERT INTO public.zip_codes VALUES ('1728', '39');
INSERT INTO public.zip_codes VALUES ('1727', '39');
INSERT INTO public.zip_codes VALUES ('1726', '39');
INSERT INTO public.zip_codes VALUES ('1725', '39');
INSERT INTO public.zip_codes VALUES ('1724', '39');
INSERT INTO public.zip_codes VALUES ('1723', '39');
INSERT INTO public.zip_codes VALUES ('1722', '39');
INSERT INTO public.zip_codes VALUES ('1721', '42');
INSERT INTO public.zip_codes VALUES ('1720', '39');
INSERT INTO public.zip_codes VALUES ('1719', '41');
INSERT INTO public.zip_codes VALUES ('1718', '41');
INSERT INTO public.zip_codes VALUES ('1717', '41');
INSERT INTO public.zip_codes VALUES ('1716', '41');
INSERT INTO public.zip_codes VALUES ('1715', '41');
INSERT INTO public.zip_codes VALUES ('1714', '41');
INSERT INTO public.zip_codes VALUES ('1713', '41');
INSERT INTO public.zip_codes VALUES ('1712', '41');
INSERT INTO public.zip_codes VALUES ('1700', '39');
INSERT INTO public.zip_codes VALUES ('1699', '43');
INSERT INTO public.zip_codes VALUES ('1697', '43');
INSERT INTO public.zip_codes VALUES ('1696', '39');
INSERT INTO public.zip_codes VALUES ('1695', '39');
INSERT INTO public.zip_codes VALUES ('1694', '43');
INSERT INTO public.zip_codes VALUES ('1692', '43');
INSERT INTO public.zip_codes VALUES ('1691', '43');
INSERT INTO public.zip_codes VALUES ('1690', '43');
INSERT INTO public.zip_codes VALUES ('1689', '43');
INSERT INTO public.zip_codes VALUES ('1688', '43');
INSERT INTO public.zip_codes VALUES ('1687', '43');
INSERT INTO public.zip_codes VALUES ('1686', '43');
INSERT INTO public.zip_codes VALUES ('1685', '43');
INSERT INTO public.zip_codes VALUES ('1684', '43');
INSERT INTO public.zip_codes VALUES ('1683', '93');
INSERT INTO public.zip_codes VALUES ('1682', '93');
INSERT INTO public.zip_codes VALUES ('1681', '43');
INSERT INTO public.zip_codes VALUES ('1680', '43');
INSERT INTO public.zip_codes VALUES ('1679', '43');
INSERT INTO public.zip_codes VALUES ('1678', '43');
INSERT INTO public.zip_codes VALUES ('1677', '43');
INSERT INTO public.zip_codes VALUES ('1676', '43');
INSERT INTO public.zip_codes VALUES ('1675', '43');
INSERT INTO public.zip_codes VALUES ('1674', '43');
INSERT INTO public.zip_codes VALUES ('1673', '43');
INSERT INTO public.zip_codes VALUES ('1670', '43');
INSERT INTO public.zip_codes VALUES ('1669', '40');
INSERT INTO public.zip_codes VALUES ('1667', '40');
INSERT INTO public.zip_codes VALUES ('1666', '40');
INSERT INTO public.zip_codes VALUES ('1665', '40');
INSERT INTO public.zip_codes VALUES ('1663', '40');
INSERT INTO public.zip_codes VALUES ('1661', '40');
INSERT INTO public.zip_codes VALUES ('1660', '89');
INSERT INTO public.zip_codes VALUES ('1659', '89');
INSERT INTO public.zip_codes VALUES ('1658', '89');
INSERT INTO public.zip_codes VALUES ('1657', '21');
INSERT INTO public.zip_codes VALUES ('1656', '40');
INSERT INTO public.zip_codes VALUES ('1654', '40');
INSERT INTO public.zip_codes VALUES ('1653', '40');
INSERT INTO public.zip_codes VALUES ('1652', '40');
INSERT INTO public.zip_codes VALUES ('1651', '40');
INSERT INTO public.zip_codes VALUES ('1649', '40');
INSERT INTO public.zip_codes VALUES ('1648', '40');
INSERT INTO public.zip_codes VALUES ('1647', '40');
INSERT INTO public.zip_codes VALUES ('1646', '40');
INSERT INTO public.zip_codes VALUES ('1645', '40');
INSERT INTO public.zip_codes VALUES ('1644', '40');
INSERT INTO public.zip_codes VALUES ('1643', '40');
INSERT INTO public.zip_codes VALUES ('1642', '40');
INSERT INTO public.zip_codes VALUES ('1638', '40');
INSERT INTO public.zip_codes VALUES ('1637', '40');
INSERT INTO public.zip_codes VALUES ('1636', '40');
INSERT INTO public.zip_codes VALUES ('1635', '40');
INSERT INTO public.zip_codes VALUES ('1634', '40');
INSERT INTO public.zip_codes VALUES ('1633', '40');
INSERT INTO public.zip_codes VALUES ('1632', '40');
INSERT INTO public.zip_codes VALUES ('1630', '40');
INSERT INTO public.zip_codes VALUES ('1628', '40');
INSERT INTO public.zip_codes VALUES ('1627', '40');
INSERT INTO public.zip_codes VALUES ('1626', '40');
INSERT INTO public.zip_codes VALUES ('1625', '40');
INSERT INTO public.zip_codes VALUES ('1624', '43');
INSERT INTO public.zip_codes VALUES ('1623', '43');
INSERT INTO public.zip_codes VALUES ('1619', '43');
INSERT INTO public.zip_codes VALUES ('1618', '43');
INSERT INTO public.zip_codes VALUES ('1617', '43');
INSERT INTO public.zip_codes VALUES ('1616', '43');
INSERT INTO public.zip_codes VALUES ('1615', '43');
INSERT INTO public.zip_codes VALUES ('1614', '43');
INSERT INTO public.zip_codes VALUES ('1613', '93');
INSERT INTO public.zip_codes VALUES ('1612', '93');
INSERT INTO public.zip_codes VALUES ('1611', '43');
INSERT INTO public.zip_codes VALUES ('1610', '93');
INSERT INTO public.zip_codes VALUES ('1609', '43');
INSERT INTO public.zip_codes VALUES ('1608', '93');
INSERT INTO public.zip_codes VALUES ('1607', '93');
INSERT INTO public.zip_codes VALUES ('1595', '42');
INSERT INTO public.zip_codes VALUES ('1589', '42');
INSERT INTO public.zip_codes VALUES ('1588', '42');
INSERT INTO public.zip_codes VALUES ('1587', '42');
INSERT INTO public.zip_codes VALUES ('1586', '42');
INSERT INTO public.zip_codes VALUES ('1585', '42');
INSERT INTO public.zip_codes VALUES ('1584', '42');
INSERT INTO public.zip_codes VALUES ('1583', '42');
INSERT INTO public.zip_codes VALUES ('1580', '42');
INSERT INTO public.zip_codes VALUES ('1568', '93');
INSERT INTO public.zip_codes VALUES ('1567', '93');
INSERT INTO public.zip_codes VALUES ('1566', '93');
INSERT INTO public.zip_codes VALUES ('1565', '93');
INSERT INTO public.zip_codes VALUES ('1564', '93');
INSERT INTO public.zip_codes VALUES ('1563', '93');
INSERT INTO public.zip_codes VALUES ('1562', '93');
INSERT INTO public.zip_codes VALUES ('1555', '93');
INSERT INTO public.zip_codes VALUES ('1554', '93');
INSERT INTO public.zip_codes VALUES ('1553', '43');
INSERT INTO public.zip_codes VALUES ('1552', '93');
INSERT INTO public.zip_codes VALUES ('1551', '93');
INSERT INTO public.zip_codes VALUES ('1545', '93');
INSERT INTO public.zip_codes VALUES ('1544', '93');
INSERT INTO public.zip_codes VALUES ('1543', '93');
INSERT INTO public.zip_codes VALUES ('1542', '93');
INSERT INTO public.zip_codes VALUES ('1541', '93');
INSERT INTO public.zip_codes VALUES ('1538', '93');
INSERT INTO public.zip_codes VALUES ('1537', '93');
INSERT INTO public.zip_codes VALUES ('1536', '93');
INSERT INTO public.zip_codes VALUES ('1535', '93');
INSERT INTO public.zip_codes VALUES ('1534', '93');
INSERT INTO public.zip_codes VALUES ('1533', '93');
INSERT INTO public.zip_codes VALUES ('1532', '93');
INSERT INTO public.zip_codes VALUES ('1530', '93');
INSERT INTO public.zip_codes VALUES ('1529', '93');
INSERT INTO public.zip_codes VALUES ('1528', '93');
INSERT INTO public.zip_codes VALUES ('1527', '93');
INSERT INTO public.zip_codes VALUES ('1526', '93');
INSERT INTO public.zip_codes VALUES ('1525', '93');
INSERT INTO public.zip_codes VALUES ('1524', '93');
INSERT INTO public.zip_codes VALUES ('1523', '93');
INSERT INTO public.zip_codes VALUES ('1522', '93');
INSERT INTO public.zip_codes VALUES ('1521', '93');
INSERT INTO public.zip_codes VALUES ('1515', '93');
INSERT INTO public.zip_codes VALUES ('1514', '93');
INSERT INTO public.zip_codes VALUES ('1513', '93');
INSERT INTO public.zip_codes VALUES ('1512', '93');
INSERT INTO public.zip_codes VALUES ('1510', '93');
INSERT INTO public.zip_codes VALUES ('1509', '93');
INSERT INTO public.zip_codes VALUES ('1489', '93');
INSERT INTO public.zip_codes VALUES ('1486', '93');
INSERT INTO public.zip_codes VALUES ('1485', '93');
INSERT INTO public.zip_codes VALUES ('1484', '93');
INSERT INTO public.zip_codes VALUES ('1483', '93');
INSERT INTO public.zip_codes VALUES ('1482', '93');
INSERT INTO public.zip_codes VALUES ('1475', '93');
INSERT INTO public.zip_codes VALUES ('1474', '93');
INSERT INTO public.zip_codes VALUES ('1473', '93');
INSERT INTO public.zip_codes VALUES ('1470', '93');
INSERT INTO public.zip_codes VALUES ('1468', '93');
INSERT INTO public.zip_codes VALUES ('1464', '91');
INSERT INTO public.zip_codes VALUES ('1463', '91');
INSERT INTO public.zip_codes VALUES ('1462', '91');
INSERT INTO public.zip_codes VALUES ('1454', '91');
INSERT INTO public.zip_codes VALUES ('1453', '91');
INSERT INTO public.zip_codes VALUES ('1452', '91');
INSERT INTO public.zip_codes VALUES ('1450', '91');
INSERT INTO public.zip_codes VALUES ('1446', '91');
INSERT INTO public.zip_codes VALUES ('1445', '91');
INSERT INTO public.zip_codes VALUES ('1443', '91');
INSERT INTO public.zip_codes VALUES ('1442', '91');
INSERT INTO public.zip_codes VALUES ('1441', '91');
INSERT INTO public.zip_codes VALUES ('1439', '90');
INSERT INTO public.zip_codes VALUES ('1438', '91');
INSERT INTO public.zip_codes VALUES ('1437', '91');
INSERT INTO public.zip_codes VALUES ('1436', '91');
INSERT INTO public.zip_codes VALUES ('1435', '90');
INSERT INTO public.zip_codes VALUES ('1434', '91');
INSERT INTO public.zip_codes VALUES ('1433', '91');
INSERT INTO public.zip_codes VALUES ('1432', '91');
INSERT INTO public.zip_codes VALUES ('1431', '91');
INSERT INTO public.zip_codes VALUES ('1430', '91');
INSERT INTO public.zip_codes VALUES ('1429', '91');
INSERT INTO public.zip_codes VALUES ('1428', '91');
INSERT INTO public.zip_codes VALUES ('1427', '91');
INSERT INTO public.zip_codes VALUES ('1426', '91');
INSERT INTO public.zip_codes VALUES ('1425', '91');
INSERT INTO public.zip_codes VALUES ('1424', '91');
INSERT INTO public.zip_codes VALUES ('1423', '91');
INSERT INTO public.zip_codes VALUES ('1422', '91');
INSERT INTO public.zip_codes VALUES ('1421', '91');
INSERT INTO public.zip_codes VALUES ('1420', '91');
INSERT INTO public.zip_codes VALUES ('1418', '90');
INSERT INTO public.zip_codes VALUES ('1417', '90');
INSERT INTO public.zip_codes VALUES ('1416', '90');
INSERT INTO public.zip_codes VALUES ('1415', '91');
INSERT INTO public.zip_codes VALUES ('1413', '91');
INSERT INTO public.zip_codes VALUES ('1412', '91');
INSERT INTO public.zip_codes VALUES ('1410', '93');
INSERT INTO public.zip_codes VALUES ('1409', '93');
INSERT INTO public.zip_codes VALUES ('1408', '91');
INSERT INTO public.zip_codes VALUES ('1407', '91');
INSERT INTO public.zip_codes VALUES ('1406', '91');
INSERT INTO public.zip_codes VALUES ('1405', '91');
INSERT INTO public.zip_codes VALUES ('1404', '91');
INSERT INTO public.zip_codes VALUES ('1400', '91');
INSERT INTO public.zip_codes VALUES ('1377', '90');
INSERT INTO public.zip_codes VALUES ('1376', '90');
INSERT INTO public.zip_codes VALUES ('1375', '90');
INSERT INTO public.zip_codes VALUES ('1374', '90');
INSERT INTO public.zip_codes VALUES ('1373', '90');
INSERT INTO public.zip_codes VALUES ('1372', '90');
INSERT INTO public.zip_codes VALUES ('1358', '90');
INSERT INTO public.zip_codes VALUES ('1357', '90');
INSERT INTO public.zip_codes VALUES ('1356', '90');
INSERT INTO public.zip_codes VALUES ('1355', '90');
INSERT INTO public.zip_codes VALUES ('1354', '90');
INSERT INTO public.zip_codes VALUES ('1353', '90');
INSERT INTO public.zip_codes VALUES ('1352', '90');
INSERT INTO public.zip_codes VALUES ('1350', '90');
INSERT INTO public.zip_codes VALUES ('1348', '92');
INSERT INTO public.zip_codes VALUES ('1347', '92');
INSERT INTO public.zip_codes VALUES ('1346', '92');
INSERT INTO public.zip_codes VALUES ('1345', '92');
INSERT INTO public.zip_codes VALUES ('1344', '92');
INSERT INTO public.zip_codes VALUES ('1343', '92');
INSERT INTO public.zip_codes VALUES ('1342', '92');
INSERT INTO public.zip_codes VALUES ('1341', '92');
INSERT INTO public.zip_codes VALUES ('1338', '92');
INSERT INTO public.zip_codes VALUES ('1337', '92');
INSERT INTO public.zip_codes VALUES ('1329', '90');
INSERT INTO public.zip_codes VALUES ('1326', '90');
INSERT INTO public.zip_codes VALUES ('1325', '90');
INSERT INTO public.zip_codes VALUES ('1324', '90');
INSERT INTO public.zip_codes VALUES ('1323', '90');
INSERT INTO public.zip_codes VALUES ('1322', '90');
INSERT INTO public.zip_codes VALUES ('1321', '90');
INSERT INTO public.zip_codes VALUES ('1318', '90');
INSERT INTO public.zip_codes VALUES ('1317', '90');
INSERT INTO public.zip_codes VALUES ('1316', '90');
INSERT INTO public.zip_codes VALUES ('1315', '90');
INSERT INTO public.zip_codes VALUES ('1313', '90');
INSERT INTO public.zip_codes VALUES ('1312', '90');
INSERT INTO public.zip_codes VALUES ('1308', '90');
INSERT INTO public.zip_codes VALUES ('1307', '90');
INSERT INTO public.zip_codes VALUES ('1306', '90');
INSERT INTO public.zip_codes VALUES ('1305', '90');
INSERT INTO public.zip_codes VALUES ('1304', '90');
INSERT INTO public.zip_codes VALUES ('1303', '90');
INSERT INTO public.zip_codes VALUES ('1302', '90');
INSERT INTO public.zip_codes VALUES ('1299', '86');
INSERT INTO public.zip_codes VALUES ('1298', '105');
INSERT INTO public.zip_codes VALUES ('1297', '86');
INSERT INTO public.zip_codes VALUES ('1296', '86');
INSERT INTO public.zip_codes VALUES ('1295', '86');
INSERT INTO public.zip_codes VALUES ('1294', '105');
INSERT INTO public.zip_codes VALUES ('1293', '105');
INSERT INTO public.zip_codes VALUES ('1292', '105');
INSERT INTO public.zip_codes VALUES ('1291', '86');
INSERT INTO public.zip_codes VALUES ('1290', '105');
INSERT INTO public.zip_codes VALUES ('1288', '105');
INSERT INTO public.zip_codes VALUES ('1287', '105');
INSERT INTO public.zip_codes VALUES ('1286', '105');
INSERT INTO public.zip_codes VALUES ('1285', '105');
INSERT INTO public.zip_codes VALUES ('1284', '105');
INSERT INTO public.zip_codes VALUES ('1283', '105');
INSERT INTO public.zip_codes VALUES ('1281', '105');
INSERT INTO public.zip_codes VALUES ('1279', '86');
INSERT INTO public.zip_codes VALUES ('1278', '86');
INSERT INTO public.zip_codes VALUES ('1277', '86');
INSERT INTO public.zip_codes VALUES ('1276', '86');
INSERT INTO public.zip_codes VALUES ('1275', '86');
INSERT INTO public.zip_codes VALUES ('1274', '86');
INSERT INTO public.zip_codes VALUES ('1273', '86');
INSERT INTO public.zip_codes VALUES ('1272', '86');
INSERT INTO public.zip_codes VALUES ('1271', '86');
INSERT INTO public.zip_codes VALUES ('1270', '86');
INSERT INTO public.zip_codes VALUES ('1269', '86');
INSERT INTO public.zip_codes VALUES ('1268', '86');
INSERT INTO public.zip_codes VALUES ('1267', '86');
INSERT INTO public.zip_codes VALUES ('1266', '86');
INSERT INTO public.zip_codes VALUES ('1265', '86');
INSERT INTO public.zip_codes VALUES ('1264', '86');
INSERT INTO public.zip_codes VALUES ('1263', '86');
INSERT INTO public.zip_codes VALUES ('1262', '86');
INSERT INTO public.zip_codes VALUES ('1261', '86');
INSERT INTO public.zip_codes VALUES ('1260', '86');
INSERT INTO public.zip_codes VALUES ('1258', '105');
INSERT INTO public.zip_codes VALUES ('1257', '105');
INSERT INTO public.zip_codes VALUES ('1256', '105');
INSERT INTO public.zip_codes VALUES ('1255', '105');
INSERT INTO public.zip_codes VALUES ('1254', '105');
INSERT INTO public.zip_codes VALUES ('1253', '105');
INSERT INTO public.zip_codes VALUES ('1252', '105');
INSERT INTO public.zip_codes VALUES ('1251', '105');
INSERT INTO public.zip_codes VALUES ('1248', '105');
INSERT INTO public.zip_codes VALUES ('1247', '105');
INSERT INTO public.zip_codes VALUES ('1246', '105');
INSERT INTO public.zip_codes VALUES ('1245', '105');
INSERT INTO public.zip_codes VALUES ('1244', '105');
INSERT INTO public.zip_codes VALUES ('1243', '105');
INSERT INTO public.zip_codes VALUES ('1242', '105');
INSERT INTO public.zip_codes VALUES ('1241', '105');
INSERT INTO public.zip_codes VALUES ('1239', '105');
INSERT INTO public.zip_codes VALUES ('1237', '105');
INSERT INTO public.zip_codes VALUES ('1236', '105');
INSERT INTO public.zip_codes VALUES ('1234', '105');
INSERT INTO public.zip_codes VALUES ('1233', '105');
INSERT INTO public.zip_codes VALUES ('1232', '105');
INSERT INTO public.zip_codes VALUES ('1231', '105');
INSERT INTO public.zip_codes VALUES ('1228', '105');
INSERT INTO public.zip_codes VALUES ('1227', '105');
INSERT INTO public.zip_codes VALUES ('1226', '105');
INSERT INTO public.zip_codes VALUES ('1225', '105');
INSERT INTO public.zip_codes VALUES ('1224', '105');
INSERT INTO public.zip_codes VALUES ('1223', '105');
INSERT INTO public.zip_codes VALUES ('1222', '105');
INSERT INTO public.zip_codes VALUES ('1220', '105');
INSERT INTO public.zip_codes VALUES ('1219', '105');
INSERT INTO public.zip_codes VALUES ('1218', '105');
INSERT INTO public.zip_codes VALUES ('1217', '105');
INSERT INTO public.zip_codes VALUES ('1216', '105');
INSERT INTO public.zip_codes VALUES ('1215', '105');
INSERT INTO public.zip_codes VALUES ('1214', '105');
INSERT INTO public.zip_codes VALUES ('1213', '105');
INSERT INTO public.zip_codes VALUES ('1212', '105');
INSERT INTO public.zip_codes VALUES ('1209', '105');
INSERT INTO public.zip_codes VALUES ('1208', '105');
INSERT INTO public.zip_codes VALUES ('1207', '105');
INSERT INTO public.zip_codes VALUES ('1206', '105');
INSERT INTO public.zip_codes VALUES ('1205', '105');
INSERT INTO public.zip_codes VALUES ('1204', '105');
INSERT INTO public.zip_codes VALUES ('1203', '105');
INSERT INTO public.zip_codes VALUES ('1202', '105');
INSERT INTO public.zip_codes VALUES ('1201', '105');
INSERT INTO public.zip_codes VALUES ('1197', '86');
INSERT INTO public.zip_codes VALUES ('1196', '86');
INSERT INTO public.zip_codes VALUES ('1195', '85');
INSERT INTO public.zip_codes VALUES ('1189', '85');
INSERT INTO public.zip_codes VALUES ('1188', '85');
INSERT INTO public.zip_codes VALUES ('1187', '85');
INSERT INTO public.zip_codes VALUES ('1186', '85');
INSERT INTO public.zip_codes VALUES ('1185', '85');
INSERT INTO public.zip_codes VALUES ('1184', '85');
INSERT INTO public.zip_codes VALUES ('1183', '85');
INSERT INTO public.zip_codes VALUES ('1182', '85');
INSERT INTO public.zip_codes VALUES ('1180', '85');
INSERT INTO public.zip_codes VALUES ('1176', '85');
INSERT INTO public.zip_codes VALUES ('1175', '85');
INSERT INTO public.zip_codes VALUES ('1174', '85');
INSERT INTO public.zip_codes VALUES ('1173', '85');
INSERT INTO public.zip_codes VALUES ('1172', '85');
INSERT INTO public.zip_codes VALUES ('1170', '85');
INSERT INTO public.zip_codes VALUES ('1169', '85');
INSERT INTO public.zip_codes VALUES ('1168', '85');
INSERT INTO public.zip_codes VALUES ('1167', '85');
INSERT INTO public.zip_codes VALUES ('1166', '85');
INSERT INTO public.zip_codes VALUES ('1165', '85');
INSERT INTO public.zip_codes VALUES ('1164', '85');
INSERT INTO public.zip_codes VALUES ('1163', '85');
INSERT INTO public.zip_codes VALUES ('1162', '85');
INSERT INTO public.zip_codes VALUES ('1149', '85');
INSERT INTO public.zip_codes VALUES ('1148', '90');
INSERT INTO public.zip_codes VALUES ('1147', '90');
INSERT INTO public.zip_codes VALUES ('1146', '85');
INSERT INTO public.zip_codes VALUES ('1145', '85');
INSERT INTO public.zip_codes VALUES ('1144', '85');
INSERT INTO public.zip_codes VALUES ('1143', '85');
INSERT INTO public.zip_codes VALUES ('1142', '90');
INSERT INTO public.zip_codes VALUES ('1141', '90');
INSERT INTO public.zip_codes VALUES ('1136', '85');
INSERT INTO public.zip_codes VALUES ('1135', '85');
INSERT INTO public.zip_codes VALUES ('1134', '85');
INSERT INTO public.zip_codes VALUES ('1132', '85');
INSERT INTO public.zip_codes VALUES ('1131', '85');
INSERT INTO public.zip_codes VALUES ('1128', '85');
INSERT INTO public.zip_codes VALUES ('1127', '85');
INSERT INTO public.zip_codes VALUES ('1126', '85');
INSERT INTO public.zip_codes VALUES ('1125', '85');
INSERT INTO public.zip_codes VALUES ('1124', '90');
INSERT INTO public.zip_codes VALUES ('1123', '85');
INSERT INTO public.zip_codes VALUES ('1122', '85');
INSERT INTO public.zip_codes VALUES ('1121', '85');
INSERT INTO public.zip_codes VALUES ('1117', '90');
INSERT INTO public.zip_codes VALUES ('1116', '90');
INSERT INTO public.zip_codes VALUES ('1115', '85');
INSERT INTO public.zip_codes VALUES ('1114', '85');
INSERT INTO public.zip_codes VALUES ('1113', '85');
INSERT INTO public.zip_codes VALUES ('1112', '85');
INSERT INTO public.zip_codes VALUES ('1110', '85');
INSERT INTO public.zip_codes VALUES ('1098', '87');
INSERT INTO public.zip_codes VALUES ('1097', '87');
INSERT INTO public.zip_codes VALUES ('1096', '87');
INSERT INTO public.zip_codes VALUES ('1095', '84');
INSERT INTO public.zip_codes VALUES ('1094', '84');
INSERT INTO public.zip_codes VALUES ('1093', '84');
INSERT INTO public.zip_codes VALUES ('1092', '84');
INSERT INTO public.zip_codes VALUES ('1091', '87');
INSERT INTO public.zip_codes VALUES ('1090', '84');
INSERT INTO public.zip_codes VALUES ('1088', '93');
INSERT INTO public.zip_codes VALUES ('1085', '93');
INSERT INTO public.zip_codes VALUES ('1084', '93');
INSERT INTO public.zip_codes VALUES ('1083', '93');
INSERT INTO public.zip_codes VALUES ('1082', '93');
INSERT INTO public.zip_codes VALUES ('1081', '93');
INSERT INTO public.zip_codes VALUES ('1080', '93');
INSERT INTO public.zip_codes VALUES ('1078', '93');
INSERT INTO public.zip_codes VALUES ('1077', '93');
INSERT INTO public.zip_codes VALUES ('1076', '93');
INSERT INTO public.zip_codes VALUES ('1073', '84');
INSERT INTO public.zip_codes VALUES ('1072', '87');
INSERT INTO public.zip_codes VALUES ('1071', '87');
INSERT INTO public.zip_codes VALUES ('1070', '87');
INSERT INTO public.zip_codes VALUES ('1068', '84');
INSERT INTO public.zip_codes VALUES ('1066', '84');
INSERT INTO public.zip_codes VALUES ('1063', '93');
INSERT INTO public.zip_codes VALUES ('1062', '93');
INSERT INTO public.zip_codes VALUES ('1061', '93');
INSERT INTO public.zip_codes VALUES ('1059', '93');
INSERT INTO public.zip_codes VALUES ('1058', '93');
INSERT INTO public.zip_codes VALUES ('1055', '84');
INSERT INTO public.zip_codes VALUES ('1054', '84');
INSERT INTO public.zip_codes VALUES ('1053', '84');
INSERT INTO public.zip_codes VALUES ('1052', '84');
INSERT INTO public.zip_codes VALUES ('1047', '91');
INSERT INTO public.zip_codes VALUES ('1046', '90');
INSERT INTO public.zip_codes VALUES ('1045', '93');
INSERT INTO public.zip_codes VALUES ('1044', '90');
INSERT INTO public.zip_codes VALUES ('1043', '90');
INSERT INTO public.zip_codes VALUES ('1042', '90');
INSERT INTO public.zip_codes VALUES ('1041', '90');
INSERT INTO public.zip_codes VALUES ('1040', '90');
INSERT INTO public.zip_codes VALUES ('1038', '90');
INSERT INTO public.zip_codes VALUES ('1037', '90');
INSERT INTO public.zip_codes VALUES ('1036', '90');
INSERT INTO public.zip_codes VALUES ('1035', '90');
INSERT INTO public.zip_codes VALUES ('1034', '90');
INSERT INTO public.zip_codes VALUES ('1033', '84');
INSERT INTO public.zip_codes VALUES ('1032', '84');
INSERT INTO public.zip_codes VALUES ('1031', '90');
INSERT INTO public.zip_codes VALUES ('1030', '84');
INSERT INTO public.zip_codes VALUES ('1029', '84');
INSERT INTO public.zip_codes VALUES ('1028', '85');
INSERT INTO public.zip_codes VALUES ('1027', '85');
INSERT INTO public.zip_codes VALUES ('1026', '85');
INSERT INTO public.zip_codes VALUES ('1025', '84');
INSERT INTO public.zip_codes VALUES ('1024', '84');
INSERT INTO public.zip_codes VALUES ('1023', '84');
INSERT INTO public.zip_codes VALUES ('1022', '84');
INSERT INTO public.zip_codes VALUES ('1020', '84');
INSERT INTO public.zip_codes VALUES ('1018', '84');
INSERT INTO public.zip_codes VALUES ('1015', '84');
INSERT INTO public.zip_codes VALUES ('1012', '84');
INSERT INTO public.zip_codes VALUES ('1011', '84');
INSERT INTO public.zip_codes VALUES ('1010', '84');
INSERT INTO public.zip_codes VALUES ('1009', '84');
INSERT INTO public.zip_codes VALUES ('1008', '84');
INSERT INTO public.zip_codes VALUES ('1007', '84');
INSERT INTO public.zip_codes VALUES ('1006', '84');
INSERT INTO public.zip_codes VALUES ('1005', '84');
INSERT INTO public.zip_codes VALUES ('1004', '84');
INSERT INTO public.zip_codes VALUES ('1003', '84');
INSERT INTO public.zip_codes VALUES ('1000', '84');


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
-- Name: soi_admin PK_217c42248c5d20c501c5c30c53e; Type: CONSTRAINT; Schema: public; Owner: db_user
--

ALTER TABLE ONLY public.soi_admin
    ADD CONSTRAINT "PK_217c42248c5d20c501c5c30c53e" PRIMARY KEY (uuid);


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
-- Name: soi_employee PK_eb0ff739846aad9d81bf90ea43f; Type: CONSTRAINT; Schema: public; Owner: db_user
--

ALTER TABLE ONLY public.soi_employee
    ADD CONSTRAINT "PK_eb0ff739846aad9d81bf90ea43f" PRIMARY KEY (uuid);


--
-- Name: dossier PK_f9f49ba689e2abb87eaeded1d27; Type: CONSTRAINT; Schema: public; Owner: db_user
--

ALTER TABLE ONLY public.dossier
    ADD CONSTRAINT "PK_f9f49ba689e2abb87eaeded1d27" PRIMARY KEY (uuid);


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
-- Name: company REL_e2ec6ea5ec961bdd0fc7c98626; Type: CONSTRAINT; Schema: public; Owner: db_user
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "REL_e2ec6ea5ec961bdd0fc7c98626" UNIQUE ("domicileAddressUuid");


--
-- Name: dossier UQ_012c5092b7dd1f0a3adf05223de; Type: CONSTRAINT; Schema: public; Owner: db_user
--

ALTER TABLE ONLY public.dossier
    ADD CONSTRAINT "UQ_012c5092b7dd1f0a3adf05223de" UNIQUE ("finalDocumentUuid");


--
-- Name: bank UQ_11f196da2e68cef1c7e84b4fe94; Type: CONSTRAINT; Schema: public; Owner: db_user
--

ALTER TABLE ONLY public.bank
    ADD CONSTRAINT "UQ_11f196da2e68cef1c7e84b4fe94" UNIQUE (name);


--
-- Name: bank UQ_bba3c6c58751099874df530192c; Type: CONSTRAINT; Schema: public; Owner: db_user
--

ALTER TABLE ONLY public.bank
    ADD CONSTRAINT "UQ_bba3c6c58751099874df530192c" UNIQUE (abbreviation);


--
-- Name: dossier UQ_fed05b9ba6da9391363e26528ea; Type: CONSTRAINT; Schema: public; Owner: db_user
--

ALTER TABLE ONLY public.dossier
    ADD CONSTRAINT "UQ_fed05b9ba6da9391363e26528ea" UNIQUE ("addressUuid");


--
-- Name: dossier FK_012c5092b7dd1f0a3adf05223de; Type: FK CONSTRAINT; Schema: public; Owner: db_user
--

ALTER TABLE ONLY public.dossier
    ADD CONSTRAINT "FK_012c5092b7dd1f0a3adf05223de" FOREIGN KEY ("finalDocumentUuid") REFERENCES public.private_file(uuid) ON DELETE CASCADE;


--
-- Name: dossier FK_2a26706528112ef56e5f7601c8d; Type: FK CONSTRAINT; Schema: public; Owner: db_user
--

ALTER TABLE ONLY public.dossier
    ADD CONSTRAINT "FK_2a26706528112ef56e5f7601c8d" FOREIGN KEY ("employeeUuid") REFERENCES public.employee(uuid);


--
-- Name: private_file FK_494136f6e6f996fe77ed1a3249a; Type: FK CONSTRAINT; Schema: public; Owner: db_user
--

ALTER TABLE ONLY public.private_file
    ADD CONSTRAINT "FK_494136f6e6f996fe77ed1a3249a" FOREIGN KEY ("offerUuid") REFERENCES public.offer(uuid) ON DELETE CASCADE;


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
-- Name: private_file FK_b902bc0f8d39a9d0beaa25070b8; Type: FK CONSTRAINT; Schema: public; Owner: db_user
--

ALTER TABLE ONLY public.private_file
    ADD CONSTRAINT "FK_b902bc0f8d39a9d0beaa25070b8" FOREIGN KEY ("dossierUuid") REFERENCES public.dossier(uuid) ON DELETE CASCADE;


--
-- Name: private_file FK_bcebcab2d56ae0199407ecc4f62; Type: FK CONSTRAINT; Schema: public; Owner: db_user
--

ALTER TABLE ONLY public.private_file
    ADD CONSTRAINT "FK_bcebcab2d56ae0199407ecc4f62" FOREIGN KEY ("companyUuid") REFERENCES public.company(uuid) ON DELETE CASCADE;


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
-- Name: company FK_e2ec6ea5ec961bdd0fc7c986267; Type: FK CONSTRAINT; Schema: public; Owner: db_user
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "FK_e2ec6ea5ec961bdd0fc7c986267" FOREIGN KEY ("domicileAddressUuid") REFERENCES public.address(uuid);


--
-- Name: offer FK_e8635e2c8e3f27813847955f170; Type: FK CONSTRAINT; Schema: public; Owner: db_user
--

ALTER TABLE ONLY public.offer
    ADD CONSTRAINT "FK_e8635e2c8e3f27813847955f170" FOREIGN KEY ("dossierUuid") REFERENCES public.dossier(uuid) ON DELETE SET NULL;


--
-- Name: dossier FK_fed05b9ba6da9391363e26528ea; Type: FK CONSTRAINT; Schema: public; Owner: db_user
--

ALTER TABLE ONLY public.dossier
    ADD CONSTRAINT "FK_fed05b9ba6da9391363e26528ea" FOREIGN KEY ("addressUuid") REFERENCES public.address(uuid);


--
-- PostgreSQL database dump complete
--


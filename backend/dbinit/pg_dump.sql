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

--
-- Name: uuid-ossp; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA public;


--
-- Name: EXTENSION "uuid-ossp"; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION "uuid-ossp" IS 'generate universally unique identifiers (UUIDs)';


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
    partition_amounts integer[] NOT NULL,
    partition_dates date[] NOT NULL,
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
    affordability double precision NOT NULL,
    eligible_income integer NOT NULL,
    total_costs integer NOT NULL,
    value_estimate_low integer NOT NULL,
    value_estimate_high integer NOT NULL,
    enfeoffment_estimate_low double precision NOT NULL,
    enfeoffment_estimate_high double precision NOT NULL,
    "employeeUuid" uuid,
    "finalDocumentUuid" uuid,
    "addressUuid" uuid
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
    status public.offer_status_enum DEFAULT 'INTERESTED'::public.offer_status_enum NOT NULL,
    reject_reason character varying
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
    file_type public.private_file_file_type_enum DEFAULT 'NONE'::public.private_file_file_type_enum NOT NULL,
    "dossierUuid" uuid,
    "offerUuid" uuid
);


ALTER TABLE public.private_file OWNER TO db_user;

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
    fk character varying NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    last_modified_at timestamp without time zone DEFAULT now() NOT NULL,
    deleted_at timestamp without time zone
);


ALTER TABLE public."user" OWNER TO db_user;

--
-- Data for Name: address; Type: TABLE DATA; Schema: public; Owner: db_user
--

COPY public.address (uuid, created_at, last_modified_at, deleted_at, street, number, city, zip_code) FROM stdin;
b9efbe71-5cd2-4121-af44-7d22552141a4	2021-12-13 14:03:50.803857	2021-12-13 14:03:50.803857	\N	bahnhof	1	zürich	8000
bf96b35e-33be-4864-b2c7-6332ae2495a6	2021-12-13 14:03:50.803857	2021-12-13 14:03:50.803857	\N	bahnhof	1	zürich	8000
1715efa5-67bf-4dfb-b026-349664ae4278	2022-02-07 15:08:30.30477	2022-02-07 15:08:30.30477	\N	mühlebachstrasse	88	zürich	8008
9a72673e-0131-4e31-8596-d9f253bd176d	2022-02-07 15:12:08.533703	2022-02-07 15:12:08.533703	\N	Mühlebachstrasse	88	Zürich	8008
d318abbc-e01e-4ba5-91c7-28f529abb426	2022-02-07 15:12:08.533703	2022-02-07 15:12:08.533703	\N	Mühlebachstrasse	88	Zürich	8008
cc03e2bd-04ec-44fc-8e38-d80b32587566	2022-02-07 15:12:54.151735	2022-02-07 15:12:54.151735	\N	Mühlebachstrasse	88	Zürich	8008
1078aa71-e8bf-4593-86ae-e8380a3aa552	2022-02-07 15:12:54.151735	2022-02-07 15:12:54.151735	\N	Mühlebachstrasse	88	Zürich	8008
29434d44-b5db-410b-8098-30add1cb89f9	2022-02-07 15:19:59.217377	2022-02-07 15:19:59.217377	\N	Bahnhofstrasse	4c	Flums	8890
b6a760e4-c9a1-498b-94cb-f01edaabf8f7	2022-02-07 15:19:59.217377	2022-02-07 15:19:59.217377	\N	Bahnhofstrasse	4c	Flums	8890
\.


--
-- Data for Name: bank; Type: TABLE DATA; Schema: public; Owner: db_user
--

COPY public.bank (uuid, created_at, last_modified_at, deleted_at, first_name, last_name, email, readable_id, "addressUuid", name, abbreviation, phone) FROM stdin;
8064c5ea-cd23-4599-964e-b15eca4064ad	2022-02-07 15:08:30.30477	2022-02-07 15:08:30.30477	\N	rami	abdi	ra.mize.abdili@gmail.com	FI73330204	1715efa5-67bf-4dfb-b026-349664ae4278	polygon	poly	0799545522
\.


--
-- Data for Name: company; Type: TABLE DATA; Schema: public; Owner: db_user
--

COPY public.company (uuid, created_at, last_modified_at, deleted_at, first_name, last_name, email, readable_id, company_name, language, uid, phone, branch_structure, creation_state, "domicileAddressUuid", "correspondenceAddressUuid") FROM stdin;
0107c004-6c51-4570-b1bb-300a4065e4cb	2021-12-13 14:03:50.803857	2021-12-13 14:03:50.803857	\N	ra	ab	ramize_abdili@hotmail.com	0410012124	uzh	DE	12	0799545522	t	APPLIED	b9efbe71-5cd2-4121-af44-7d22552141a4	bf96b35e-33be-4864-b2c7-6332ae2495a6
a1da7ce6-e9c1-4c73-a4d2-8568c4e1852b	2022-02-07 15:12:54.151735	2022-02-07 15:12:54.151735	\N	ramizee	abdilii	ramize.abdili@gmail.com	BR11329073	polygon	DE		0799545522	t	APPLIED	cc03e2bd-04ec-44fc-8e38-d80b32587566	1078aa71-e8bf-4593-86ae-e8380a3aa552
20001a9c-f895-4a38-a27b-de6caf3f9829	2022-02-07 15:19:59.217377	2022-02-07 15:19:59.217377	\N	Ramize	Abdili	ramize.abdili@gmail.com	BR34247407	polygon	DE		0799545522	t	APPLIED	29434d44-b5db-410b-8098-30add1cb89f9	b6a760e4-c9a1-498b-94cb-f01edaabf8f7
aa2c53db-16a9-4b40-a250-4db68d35178d	2022-02-07 15:12:08.533703	2022-02-08 14:17:27.231938	\N	ramizee	abdilii	ram.ize.abdili@gmail.com	BR79675407	polygon	DE		0799545522	t	DONE	9a72673e-0131-4e31-8596-d9f253bd176d	d318abbc-e01e-4ba5-91c7-28f529abb426
\.


--
-- Data for Name: dossier; Type: TABLE DATA; Schema: public; Owner: db_user
--

COPY public.dossier (uuid, created_at, last_modified_at, deleted_at, first_name, last_name, email, readable_id, non_arrangeable, status, "originalBankUuid", phone, birthdate, property_type, owner_occupied, purchase_date, purchase_price, market_value_estimation, mortgage_amount, has_amortisation, direct_amortisation, amortisation_amount, has_building_lease, public_landlord, building_lease_expiration_date, building_lease_interest, has_renovation, renovation_year, renovation_price, partition_amounts, partition_dates, incomes, child_allowances, bonus, assets, leasing, credit, alimony, various, prosecutions, loss_certificates, affordability, eligible_income, total_costs, value_estimate_low, value_estimate_high, enfeoffment_estimate_low, enfeoffment_estimate_high, "employeeUuid", "finalDocumentUuid", "addressUuid") FROM stdin;
\.


--
-- Data for Name: employee; Type: TABLE DATA; Schema: public; Owner: db_user
--

COPY public.employee (uuid, created_at, last_modified_at, deleted_at, first_name, last_name, email, readable_id, language, function, phone, gender, "companyUuid") FROM stdin;
7003c625-aca0-4343-be9e-493445790acc	2022-02-08 14:19:58.088355	2022-02-08 14:19:58.088355	\N	ram	ab	rami.ze.abdili@gmail.com	MA43164675	DE	Entwickler*in	0799545522	Frau	aa2c53db-16a9-4b40-a250-4db68d35178d
\.


--
-- Data for Name: offer; Type: TABLE DATA; Schema: public; Owner: db_user
--

COPY public.offer (uuid, created_at, last_modified_at, deleted_at, "dossierUuid", "bankUuid", status, reject_reason) FROM stdin;
\.


--
-- Data for Name: private_file; Type: TABLE DATA; Schema: public; Owner: db_user
--

COPY public.private_file (uuid, created_at, last_modified_at, deleted_at, owner, key, "companyUuid", file_type, "dossierUuid", "offerUuid") FROM stdin;
fce479a1-671a-4547-a2c7-f5db6a20ee61	2022-02-08 14:01:06.043113	2022-02-08 14:01:06.043113	\N	aa2c53db-16a9-4b40-a250-4db68d35178d	d169359d-0bfa-4de2-9289-66c4881f6fe7-Course+plan+(HCI+HS2021).pdf	aa2c53db-16a9-4b40-a250-4db68d35178d	NONE	\N	\N
7314a96d-d5c2-4dad-b4f0-f9f1e3e44aed	2022-02-08 14:03:58.11674	2022-02-08 14:03:58.11674	\N	aa2c53db-16a9-4b40-a250-4db68d35178d	aa307841-bf98-4cb1-b55c-61768d1317aa-lösung1.pdf	aa2c53db-16a9-4b40-a250-4db68d35178d	NONE	\N	\N
cc9ab951-5f46-4daf-9771-4da0cdcf6f4a	2022-02-08 14:07:50.030532	2022-02-08 14:07:50.030532	\N	aa2c53db-16a9-4b40-a250-4db68d35178d	be4a26f6-c490-4389-a5a1-817748d009b1-lösung1.pdf	aa2c53db-16a9-4b40-a250-4db68d35178d	NONE	\N	\N
2c731378-58a4-4743-ac14-00649f88aa0f	2022-02-08 14:13:57.131018	2022-02-08 14:13:57.131018	\N	aa2c53db-16a9-4b40-a250-4db68d35178d	04b61714-b146-487d-ba01-23f9bbe63925-lösung1.pdf	aa2c53db-16a9-4b40-a250-4db68d35178d	NONE	\N	\N
9d4c9179-e683-4906-b39c-1cb0c5187e64	2022-02-08 14:14:57.93142	2022-02-08 14:14:57.93142	\N	aa2c53db-16a9-4b40-a250-4db68d35178d	ab082aab-611a-4f3f-986f-b95f643264f2-lösung1.pdf	aa2c53db-16a9-4b40-a250-4db68d35178d	NONE	\N	\N
\.


--
-- Data for Name: public_file; Type: TABLE DATA; Schema: public; Owner: db_user
--

COPY public.public_file (uuid, created_at, last_modified_at, deleted_at, url, key) FROM stdin;
\.


--
-- Data for Name: soi_admin; Type: TABLE DATA; Schema: public; Owner: db_user
--

COPY public.soi_admin (uuid, created_at, last_modified_at, deleted_at, first_name, last_name, email, readable_id) FROM stdin;
\.


--
-- Data for Name: soi_employee; Type: TABLE DATA; Schema: public; Owner: db_user
--

COPY public.soi_employee (uuid, created_at, last_modified_at, deleted_at, first_name, last_name, email, readable_id, phone, gender) FROM stdin;
a8771298-fefb-43c3-8707-0f53b6168cb8	2022-02-07 14:59:33.49924	2022-02-07 14:59:33.49924	\N	Ramiz	Abdil	r.amize.abdili@gmail.com	9907760580	0799545522	Frau
\.


--
-- Data for Name: soiadmin; Type: TABLE DATA; Schema: public; Owner: db_user
--

COPY public.soiadmin (uuid, created_at, last_modified_at, deleted_at, first_name, last_name, email, readable_id) FROM stdin;
00e1d155-3749-427a-b962-3fc4f3a18cd1	2021-12-30 18:11:25.045641	2021-12-30 18:11:25.045641	\N	Ramize	Abdili	ramize.abdili@hotmail.com	273z829783
\.


--
-- Data for Name: soiemployee; Type: TABLE DATA; Schema: public; Owner: db_user
--

COPY public.soiemployee (uuid, created_at, last_modified_at, deleted_at, first_name, last_name, email, readable_id) FROM stdin;
\.


--
-- Data for Name: typeorm_metadata; Type: TABLE DATA; Schema: public; Owner: db_user
--

COPY public.typeorm_metadata (type, database, schema, "table", name, value) FROM stdin;
\.


--
-- Data for Name: user; Type: TABLE DATA; Schema: public; Owner: db_user
--

COPY public."user" (role, uuid, fk, created_at, last_modified_at, deleted_at) FROM stdin;
SOI_ADMIN	333f7e55-4161-4656-9fce-3f20fe31bcca	00e1d155-3749-427a-b962-3fc4f3a18cd1	2021-12-30 18:11:25.045641	2021-12-30 18:11:25.045641	\N
SOI_EMPLOYEE	2ea7de41-7466-4b46-b3fa-8ed90823738f	a8771298-fefb-43c3-8707-0f53b6168cb8	2022-02-07 14:59:33.665703	2022-02-07 14:59:33.665703	\N
BANK	14b7122b-6a7c-43d4-9fa2-3d99639c9259	8064c5ea-cd23-4599-964e-b15eca4064ad	2022-02-07 15:08:30.36311	2022-02-07 15:08:30.36311	\N
COMPANY	a260c216-bfa9-4135-affb-7f0f15086775	aa2c53db-16a9-4b40-a250-4db68d35178d	2022-02-08 14:17:27.211741	2022-02-08 14:17:27.211741	\N
EMPLOYEE	37af1b6a-93af-4147-933f-a019147b9299	7003c625-aca0-4343-be9e-493445790acc	2022-02-08 14:19:58.106497	2022-02-08 14:19:58.106497	\N
\.


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
-- Name: bank FK_899821e269947d54e371c2a741e; Type: FK CONSTRAINT; Schema: public; Owner: db_user
--

ALTER TABLE ONLY public.bank
    ADD CONSTRAINT "FK_899821e269947d54e371c2a741e" FOREIGN KEY ("addressUuid") REFERENCES public.address(uuid);


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


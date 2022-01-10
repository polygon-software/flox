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

ALTER TABLE ONLY public.offer DROP CONSTRAINT "FK_fd700fcde39dff0c60b7ace00d1";
ALTER TABLE ONLY public.offer DROP CONSTRAINT "FK_e8635e2c8e3f27813847955f170";
ALTER TABLE ONLY public.company DROP CONSTRAINT "FK_e2ec6ea5ec961bdd0fc7c986267";
ALTER TABLE ONLY public.dossier DROP CONSTRAINT "FK_d5fc778ba89eeef772d68ac09f0";
ALTER TABLE ONLY public.employee DROP CONSTRAINT "FK_d51fc1f836fee82c6c77d913806";
ALTER TABLE ONLY public.dossier DROP CONSTRAINT "FK_ca26615c2fb1cb3be481b381f2c";
ALTER TABLE ONLY public.private_file DROP CONSTRAINT "FK_bcebcab2d56ae0199407ecc4f62";
ALTER TABLE ONLY public.private_file DROP CONSTRAINT "FK_b902bc0f8d39a9d0beaa25070b8";
ALTER TABLE ONLY public.company DROP CONSTRAINT "FK_a9f680ed13cbcbb4bb1387b04bd";
ALTER TABLE ONLY public.bank DROP CONSTRAINT "FK_899821e269947d54e371c2a741e";
ALTER TABLE ONLY public.offer DROP CONSTRAINT "FK_68cd3351a7128468f3de8fb487a";
ALTER TABLE ONLY public.dossier DROP CONSTRAINT "FK_2a26706528112ef56e5f7601c8d";
ALTER TABLE ONLY public.dossier DROP CONSTRAINT "FK_27152041ea6d74671df043499ee";
ALTER TABLE ONLY public.bank DROP CONSTRAINT "UQ_bba3c6c58751099874df530192c";
ALTER TABLE ONLY public.bank DROP CONSTRAINT "UQ_11f196da2e68cef1c7e84b4fe94";
ALTER TABLE ONLY public.offer DROP CONSTRAINT "REL_fd700fcde39dff0c60b7ace00d";
ALTER TABLE ONLY public.company DROP CONSTRAINT "REL_e2ec6ea5ec961bdd0fc7c98626";
ALTER TABLE ONLY public.dossier DROP CONSTRAINT "REL_d5fc778ba89eeef772d68ac09f";
ALTER TABLE ONLY public.company DROP CONSTRAINT "REL_a9f680ed13cbcbb4bb1387b04b";
ALTER TABLE ONLY public.bank DROP CONSTRAINT "REL_899821e269947d54e371c2a741";
ALTER TABLE ONLY public.dossier DROP CONSTRAINT "REL_27152041ea6d74671df043499e";
ALTER TABLE ONLY public.dossier DROP CONSTRAINT "PK_f9f49ba689e2abb87eaeded1d27";
ALTER TABLE ONLY public.soi_employee DROP CONSTRAINT "PK_eb0ff739846aad9d81bf90ea43f";
ALTER TABLE ONLY public.public_file DROP CONSTRAINT "PK_ba13d24107ee3497d7d71f81be3";
ALTER TABLE ONLY public."user" DROP CONSTRAINT "PK_a95e949168be7b7ece1a2382fed";
ALTER TABLE ONLY public.bank DROP CONSTRAINT "PK_83a8522f1861bee5e13f4cba127";
ALTER TABLE ONLY public.employee DROP CONSTRAINT "PK_54452b02a5a8c125422e3697495";
ALTER TABLE ONLY public.address DROP CONSTRAINT "PK_496d4a29b0dfa82ede19a4bcad0";
ALTER TABLE ONLY public.offer DROP CONSTRAINT "PK_41c06b86e503ef9018af0d5e0dc";
ALTER TABLE ONLY public.company DROP CONSTRAINT "PK_3fa0b2af99d910864a56bb10c9e";
ALTER TABLE ONLY public.soi_admin DROP CONSTRAINT "PK_217c42248c5d20c501c5c30c53e";
ALTER TABLE ONLY public.private_file DROP CONSTRAINT "PK_19ac201a356fa3aacef66563869";
DROP TABLE public."user";
DROP TABLE public.typeorm_metadata;
DROP TABLE public.soi_employee;
DROP TABLE public.soi_admin;
DROP TABLE public.public_file;
DROP TABLE public.private_file;
DROP TABLE public.offer;
DROP TABLE public.employee;
DROP TABLE public.dossier;
DROP TABLE public.company;
DROP TABLE public.bank;
DROP TABLE public.address;
DROP TYPE public.user_role_enum;
DROP TYPE public.offer_status_enum;
DROP TYPE public.dossier_status_enum;
DROP TYPE public.company_creation_state_enum;
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
    name character varying NOT NULL,
    abbreviation character varying NOT NULL,
    phone character varying,
    "addressUuid" uuid
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
    born timestamp without time zone NOT NULL,
    loan_sum real NOT NULL,
    non_arrangeable boolean NOT NULL,
    status public.dossier_status_enum DEFAULT 'IN_PROGRESS'::public.dossier_status_enum NOT NULL,
    "correspondenceAddressUuid" uuid,
    "originalBankUuid" uuid,
    "propertyAddressUuid" uuid,
    "employeeUuid" uuid
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
    status public.offer_status_enum DEFAULT 'INTERESTED'::public.offer_status_enum NOT NULL,
    "dossierUuid" uuid,
    "bankUuid" uuid,
    "pdfUuid" uuid
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
    "dossierUuid" uuid
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

INSERT INTO public.address VALUES ('b102f551-d8de-4d85-a75e-8a8314a1edff', '2021-12-30 17:46:01.012619', '2021-12-30 17:46:01.012619', NULL, 'Burning Alley', '3333', 'Hell', '9999');
INSERT INTO public.address VALUES ('6f7037e7-3785-40f7-945b-0967d8fc7a87', '2021-12-30 17:54:44.854367', '2021-12-30 17:54:44.854367', NULL, 'Kondensstreifen', '3', 'Himmel', '0000');
INSERT INTO public.address VALUES ('a392a47b-903b-4a5e-955d-099b8c7232a6', '2021-12-30 17:54:44.854367', '2021-12-30 17:54:44.854367', NULL, 'Kondensstreifen', '3', 'Himmel', '0000');
INSERT INTO public.address VALUES ('42143f55-a45b-4643-b44a-f8c841107ff7', '2021-12-30 18:28:34.856702', '2021-12-30 18:28:34.856702', NULL, 'Irrelevant Street', '6', 'Unimportant City', '8620');
INSERT INTO public.address VALUES ('a3a6a12c-e457-4dff-a51e-8462afae0495', '2021-12-30 18:28:34.856702', '2021-12-30 18:28:34.856702', NULL, 'Unknown Street', '7', 'Genf', '8720');
INSERT INTO public.address VALUES ('884d3314-2430-4766-bd0e-5bac226a6c3b', '2021-12-30 18:31:10.130139', '2021-12-30 18:31:10.130139', NULL, 'Rennstrasse', '8', 'Hinwil', '8630');
INSERT INTO public.address VALUES ('e2dc0550-b914-449c-8894-ee5a98331167', '2021-12-30 18:33:27.562503', '2021-12-30 18:33:27.562503', NULL, 'Irrelevant Street', '6', 'Unimportant City', '8620');
INSERT INTO public.address VALUES ('b3754af1-ade4-4a5e-b61a-0900d5cb7377', '2021-12-30 18:33:27.562503', '2021-12-30 18:33:27.562503', NULL, 'Unknown Street', '7', 'Sion', '8720');
INSERT INTO public.address VALUES ('5ca23679-0370-4737-af57-455dcaa53a63', '2021-12-30 18:35:38.614355', '2021-12-30 18:35:38.614355', NULL, 'Bahnhofstrasse', '13', 'Zürich', '8600');
INSERT INTO public.address VALUES ('b3c51e0e-c130-434a-9eb8-d25b699254fd', '2021-12-30 18:36:10.35861', '2021-12-30 18:36:10.35861', NULL, 'Irrelevant Street', '6', 'Unimportant City', '8620');
INSERT INTO public.address VALUES ('2540e128-0e55-47d7-b3a8-2759f38b4256', '2021-12-30 18:36:10.35861', '2021-12-30 18:36:10.35861', NULL, 'Unknown Street', '7', 'Winterthur', '8720');
INSERT INTO public.address VALUES ('92acf986-5ec2-4452-9a34-0a76656fecc6', '2021-12-30 18:37:40.594112', '2021-12-30 18:37:40.594112', NULL, 'Ketral Island', '7', 'Neu Fundland', '8340');
INSERT INTO public.address VALUES ('e4d9bce3-11bf-48fb-b68d-77ed5196e0b7', '2021-12-30 18:37:57.268148', '2021-12-30 18:37:57.268148', NULL, 'Irrelevant Street', '6', 'Unimportant City', '8620');
INSERT INTO public.address VALUES ('a71dd2fa-a662-4cd3-9894-7c7610701e0e', '2021-12-30 18:37:57.268148', '2021-12-30 18:37:57.268148', NULL, 'Unknown Street', '7', 'Zürich', '8720');
INSERT INTO public.address VALUES ('08e7bba5-23b8-43a0-b43d-a794d5831eed', '2021-12-30 18:40:22.219365', '2021-12-30 18:40:22.219365', NULL, 'Irrelevant Street', '6', 'Unimportant City', '8620');
INSERT INTO public.address VALUES ('ab903795-71b5-4a10-b27a-9997e33482bc', '2021-12-30 18:40:22.219365', '2021-12-30 18:40:22.219365', NULL, 'Unknown Street', '7', 'Sion', '8720');


--
-- Data for Name: bank; Type: TABLE DATA; Schema: public; Owner: db_user
--

INSERT INTO public.bank VALUES ('0cd9ad22-f414-45a9-8594-152c04f6a560', '2021-12-30 17:46:01.012619', '2021-12-30 17:46:01.012619', NULL, 'Johann', 'Schwabe', 'a.sandal.feodrin@gmail.com', '5058162116', 'UBS', 'UBS', '0458317925', 'b102f551-d8de-4d85-a75e-8a8314a1edff');
INSERT INTO public.bank VALUES ('89fe6300-b0c4-4c85-aa31-310a33e24ff9', '2021-12-30 18:28:34.85313', '2021-12-30 18:28:34.85313', NULL, 'Andreas', 'Bauer', 'andreas.bauer@no-mail.com', '9917705357', 'Bank Lindt', 'LNT', '0784671257', '884d3314-2430-4766-bd0e-5bac226a6c3b');
INSERT INTO public.bank VALUES ('5652fe9f-845d-48de-bb93-53fecb6c2076', '2021-12-30 18:33:27.55918', '2021-12-30 18:33:27.55918', NULL, 'Timothy', 'Chauvin', 'timothy.chauvin@no-mail.com', '1760036014', 'Postfinance', 'PST', '0752468713', '5ca23679-0370-4737-af57-455dcaa53a63');
INSERT INTO public.bank VALUES ('6d67b018-6e4f-44ec-8d65-425e7b62412c', '2021-12-30 18:36:10.355794', '2021-12-30 18:36:10.355794', NULL, 'Annick', 'Knecht', 'Annick.knecht@no-mail.com', '7858877180', 'Züricher Kantonal Bank', 'ZKB', '0178754789', '92acf986-5ec2-4452-9a34-0a76656fecc6');


--
-- Data for Name: company; Type: TABLE DATA; Schema: public; Owner: db_user
--

INSERT INTO public.company VALUES ('e0c2fbb7-ffd3-4361-8e02-4cd43c4db400', '2021-12-30 17:54:44.854367', '2021-12-30 18:03:20.077', NULL, 'Johann', 'Schwabe', 'asa.ndal.feodrin@gmail.com', '3898794863', 'Wolkenputzer', 'DE', '07756498724', '07621883473', false, 'DONE', '6f7037e7-3785-40f7-945b-0967d8fc7a87', 'a392a47b-903b-4a5e-955d-099b8c7232a6');


--
-- Data for Name: dossier; Type: TABLE DATA; Schema: public; Owner: db_user
--

INSERT INTO public.dossier VALUES ('feddd0de-8c2b-47ca-9df7-2e4e43c0c99f', '2021-12-30 18:28:34.856702', '2021-12-30 18:28:34.856702', NULL, 'Samuel', 'Mühler', 'email@email.email', '4762578708', '1947-12-05 23:00:00', 86538.82, false, 'IN_PROGRESS', '42143f55-a45b-4643-b44a-f8c841107ff7', '89fe6300-b0c4-4c85-aa31-310a33e24ff9', 'a3a6a12c-e457-4dff-a51e-8462afae0495', 'ac3b6cd3-97d7-4cd2-a410-f90b8262d385');
INSERT INTO public.dossier VALUES ('e0ae6f48-fdf0-43cc-872f-fbe7ccdce5ff', '2021-12-30 18:33:27.562503', '2021-12-30 18:35:53.360347', NULL, 'Tim', 'Züricher', 'email@email.email', '1717848551', '2016-01-02 23:00:00', 78449.04, false, 'SUBMITTED', 'e2dc0550-b914-449c-8894-ee5a98331167', '5652fe9f-845d-48de-bb93-53fecb6c2076', 'b3754af1-ade4-4a5e-b61a-0900d5cb7377', 'ac3b6cd3-97d7-4cd2-a410-f90b8262d385');
INSERT INTO public.dossier VALUES ('2e3e016d-5c93-4913-9606-872954bce550', '2021-12-30 18:36:10.35861', '2021-12-30 18:36:10.35861', NULL, 'Bob', 'Bauer', 'email@email.email', '3352759549', '2021-08-23 22:00:00', 38206.45, false, 'IN_PROGRESS', 'b3c51e0e-c130-434a-9eb8-d25b699254fd', '6d67b018-6e4f-44ec-8d65-425e7b62412c', '2540e128-0e55-47d7-b3a8-2759f38b4256', 'ac3b6cd3-97d7-4cd2-a410-f90b8262d385');
INSERT INTO public.dossier VALUES ('8a39a12a-43f5-4dd2-bbce-2a1d278f8e5f', '2021-12-30 18:37:57.268148', '2021-12-30 18:37:57.268148', NULL, 'Tobias', 'Kündig', 'email@email.email', '0720561823', '1939-06-30 23:00:00', 96973.72, false, 'IN_PROGRESS', 'e4d9bce3-11bf-48fb-b68d-77ed5196e0b7', '89fe6300-b0c4-4c85-aa31-310a33e24ff9', 'a71dd2fa-a662-4cd3-9894-7c7610701e0e', 'ac3b6cd3-97d7-4cd2-a410-f90b8262d385');
INSERT INTO public.dossier VALUES ('311cf75d-6461-42f8-896f-25d2ff8fc28f', '2021-12-30 18:40:22.219365', '2021-12-30 18:40:22.219365', NULL, 'Samuel', 'Goldstein', 'email@email.email', '6811481736', '1988-06-24 22:00:00', 87137.89, false, 'IN_PROGRESS', '08e7bba5-23b8-43a0-b43d-a794d5831eed', '0cd9ad22-f414-45a9-8594-152c04f6a560', 'ab903795-71b5-4a10-b27a-9997e33482bc', 'ac3b6cd3-97d7-4cd2-a410-f90b8262d385');


--
-- Data for Name: employee; Type: TABLE DATA; Schema: public; Owner: db_user
--

INSERT INTO public.employee VALUES ('ac3b6cd3-97d7-4cd2-a410-f90b8262d385', '2021-12-30 18:11:25.041024', '2021-12-30 18:11:25.041024', NULL, 'Underling', 'Muggle', 'asan.dal.feodrin@gmail.com', '3416350818', 'DE', 'HR', '0373729727', 'Herr', 'e0c2fbb7-ffd3-4361-8e02-4cd43c4db400');


--
-- Data for Name: offer; Type: TABLE DATA; Schema: public; Owner: db_user
--

INSERT INTO public.offer VALUES ('47545ced-2002-42db-a2da-5dc255e6bfc3', '2021-12-30 18:44:09.152038', '2021-12-30 18:44:09.152038', NULL, 'INTERESTED', 'feddd0de-8c2b-47ca-9df7-2e4e43c0c99f', '0cd9ad22-f414-45a9-8594-152c04f6a560', NULL);
INSERT INTO public.offer VALUES ('8892b64a-70fa-42ab-acba-067a971033c7', '2021-12-30 18:44:11.537038', '2021-12-30 18:44:22.501884', NULL, 'RETRACTED', 'e0ae6f48-fdf0-43cc-872f-fbe7ccdce5ff', '0cd9ad22-f414-45a9-8594-152c04f6a560', NULL);
INSERT INTO public.offer VALUES ('fa85976d-f182-4e92-baa8-5ef3a157743d', '2021-12-30 18:44:28.085383', '2021-12-30 18:44:35.0063', NULL, 'ACCEPTED', '2e3e016d-5c93-4913-9606-872954bce550', '0cd9ad22-f414-45a9-8594-152c04f6a560', '55f99cad-b951-4411-bade-c99fac9383c6');


--
-- Data for Name: private_file; Type: TABLE DATA; Schema: public; Owner: db_user
--

INSERT INTO public.private_file VALUES ('83d2e93c-9111-4547-9b2f-af3b3acae421', '2021-12-30 17:59:10.169213', '2021-12-30 17:59:10.169213', NULL, 'e0c2fbb7-ffd3-4361-8e02-4cd43c4db400', 'd58271cd-6e3d-41a1-9389-e70b43c6971f-external-content.duckduckgo.com.jpg', 'e0c2fbb7-ffd3-4361-8e02-4cd43c4db400', NULL);
INSERT INTO public.private_file VALUES ('1a260ae2-0f68-448e-a0ae-5c880fcfca02', '2021-12-30 17:59:40.727991', '2021-12-30 17:59:40.727991', NULL, 'e0c2fbb7-ffd3-4361-8e02-4cd43c4db400', '5e6ab073-caf0-4c4c-96ea-ed2e36475dde-63-regionalnetz-vzo.pdf', 'e0c2fbb7-ffd3-4361-8e02-4cd43c4db400', NULL);
INSERT INTO public.private_file VALUES ('42a757a5-8e7a-4910-8ead-95b9be56fd2c', '2021-12-30 18:02:00.912781', '2021-12-30 18:02:00.912781', NULL, 'e0c2fbb7-ffd3-4361-8e02-4cd43c4db400', '16ef22e3-a087-4b80-bbf1-78d1141c83d0-60-regionalnetz-vzo-pag-vbg.pdf', 'e0c2fbb7-ffd3-4361-8e02-4cd43c4db400', NULL);
INSERT INTO public.private_file VALUES ('573b9057-f215-4a78-b9b6-ecf3cc94f18f', '2021-12-30 18:03:00.712796', '2021-12-30 18:03:00.712796', NULL, 'e0c2fbb7-ffd3-4361-8e02-4cd43c4db400', '1209e200-1176-4e04-b6bd-8a376a8f1852-61_Regionalnetz_VZO.pdf', 'e0c2fbb7-ffd3-4361-8e02-4cd43c4db400', NULL);
INSERT INTO public.private_file VALUES ('43ba40f7-0a2d-4815-832f-971b23b06bdb', '2021-12-30 18:03:01.10325', '2021-12-30 18:03:01.10325', NULL, 'e0c2fbb7-ffd3-4361-8e02-4cd43c4db400', '0c97e7b1-32d6-46bc-a5c9-1f07fc8759d7-63-regionalnetz-vzo.pdf', 'e0c2fbb7-ffd3-4361-8e02-4cd43c4db400', NULL);
INSERT INTO public.private_file VALUES ('55f99cad-b951-4411-bade-c99fac9383c6', '2021-12-30 18:44:34.986331', '2021-12-30 18:44:34.986331', NULL, '0cd9ad22-f414-45a9-8594-152c04f6a560', '5b7a05b3-6e91-4882-b27c-f1af63a002ef-61_Regionalnetz_VZO.pdf', NULL, NULL);


--
-- Data for Name: public_file; Type: TABLE DATA; Schema: public; Owner: db_user
--



--
-- Data for Name: soi_admin; Type: TABLE DATA; Schema: public; Owner: db_user
--

INSERT INTO public.soi_admin VALUES ('36dbe685-01d2-4cff-b00a-74788f119341', '2021-12-30 17:26:21.520176', '2021-12-30 17:26:21.520176', NULL, 'Admin', 'Johann Schwabe', 'asandal.feodrin@gmail.com', '7985345687');


--
-- Data for Name: soi_employee; Type: TABLE DATA; Schema: public; Owner: db_user
--

INSERT INTO public.soi_employee VALUES ('ba4241ce-f92e-49a8-aaa8-37f0c90115af', '2021-12-30 17:51:33.541278', '2021-12-30 17:51:33.541278', NULL, 'Johann', 'Schwabe', 'as.andal.feodrin@gmail.com', '7074041425', '0738449732', 'Herr');


--
-- Data for Name: typeorm_metadata; Type: TABLE DATA; Schema: public; Owner: db_user
--



--
-- Data for Name: user; Type: TABLE DATA; Schema: public; Owner: db_user
--

INSERT INTO public."user" VALUES ('BANK', 'f3b98645-c22e-4b87-bf24-64b2e1f85409', '0cd9ad22-f414-45a9-8594-152c04f6a560', '2021-12-30 17:46:01.032971', '2021-12-30 17:46:01.032971', NULL);
INSERT INTO public."user" VALUES ('SOI_EMPLOYEE', '35d59c51-2d48-41b2-b464-bf1b1558d59e', 'ba4241ce-f92e-49a8-aaa8-37f0c90115af', '2021-12-30 17:51:33.548943', '2021-12-30 17:51:33.548943', NULL);
INSERT INTO public."user" VALUES ('SOI_ADMIN', '17b2e201-3cb9-497c-9a9b-b0920b33eabd', '36dbe685-01d2-4cff-b00a-74788f119341', '2021-12-30 17:34:31.255537', '2021-12-30 17:34:31.255537', NULL);
INSERT INTO public."user" VALUES ('COMPANY', '9a7a3aa6-d545-4a45-b655-013cd3004ba6', 'e0c2fbb7-ffd3-4361-8e02-4cd43c4db400', '2021-12-30 18:03:20.070509', '2021-12-30 18:03:20.070509', NULL);
INSERT INTO public."user" VALUES ('EMPLOYEE', 'f5499931-5cfa-4846-9551-f8ba055afc90', 'ac3b6cd3-97d7-4cd2-a410-f90b8262d385', '2021-12-30 18:11:25.045641', '2021-12-30 18:11:25.045641', NULL);


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
-- Name: offer REL_fd700fcde39dff0c60b7ace00d; Type: CONSTRAINT; Schema: public; Owner: db_user
--

ALTER TABLE ONLY public.offer
    ADD CONSTRAINT "REL_fd700fcde39dff0c60b7ace00d" UNIQUE ("pdfUuid");


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
-- Name: dossier FK_27152041ea6d74671df043499ee; Type: FK CONSTRAINT; Schema: public; Owner: db_user
--

ALTER TABLE ONLY public.dossier
    ADD CONSTRAINT "FK_27152041ea6d74671df043499ee" FOREIGN KEY ("correspondenceAddressUuid") REFERENCES public.address(uuid);


--
-- Name: dossier FK_2a26706528112ef56e5f7601c8d; Type: FK CONSTRAINT; Schema: public; Owner: db_user
--

ALTER TABLE ONLY public.dossier
    ADD CONSTRAINT "FK_2a26706528112ef56e5f7601c8d" FOREIGN KEY ("employeeUuid") REFERENCES public.employee(uuid);


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
-- Name: offer FK_e8635e2c8e3f27813847955f170; Type: FK CONSTRAINT; Schema: public; Owner: db_user
--

ALTER TABLE ONLY public.offer
    ADD CONSTRAINT "FK_e8635e2c8e3f27813847955f170" FOREIGN KEY ("dossierUuid") REFERENCES public.dossier(uuid);


--
-- Name: offer FK_fd700fcde39dff0c60b7ace00d1; Type: FK CONSTRAINT; Schema: public; Owner: db_user
--

ALTER TABLE ONLY public.offer
    ADD CONSTRAINT "FK_fd700fcde39dff0c60b7ace00d1" FOREIGN KEY ("pdfUuid") REFERENCES public.private_file(uuid) ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--


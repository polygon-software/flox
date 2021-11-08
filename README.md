![logo](https://polygon-software.ch/_nuxt/optimized/static/images/logo-text-transparent8707ded.svg)

# Full Stack Bootstrap Repository


## 0. Introduction

The full stack bootstrap repository is intended to provide a solid baseline for starting new projects; it is meant to provide a full, basic setup of all relevant services.
It includes a Terraform file for setting up the related AWS infrastructure *(in progress)*, as well as a basic Backend, Frontend, Database, and preconfigured connections between them. Some basic examples for operations and components are included as well.

It makes sense to read through the entirety of this document before working with this repository, as it should cover the tech stack pretty well. :tada:

**IMPORTANT: At the moment, customer projects will be created as branches within this repository, more info below. This will however change to Forks in the future. At the current stage, it is therefore vital to maintain a clean branch structure, following the conventions outlined below.**

## 1. Running the application

To locally run a project built with the full stack bootstrap, the following commands are available (all needed commands are also located in the related `package.json`):

- Running frontend locally (any of these) within `/frontend`:
````bash
quasar dev          // running with clientside rendering
quasar dev -m pwa   // running as progressive web application
quasar dev -m ssr   // running with serverside rendering
````

- Runnning backend + database locally within `/backend`:
````bash
docker-compose up -b -v
````
This will create one container each for backend, database and nocoDB. *Note:* you must have [Docker Desktop](https://www.docker.com/products/docker-desktop) installed and running for this command to work. If you are running on a Windows machine, you may need to enable CPU virtualization in BIOS/UEFI.

## 2. Contributing

### 2.1. Branch Structure

The repository follows a predetermined branch structure, shown in the table below.
For basic information about how branches work, see the [official GitHub Documentation](https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/proposing-changes-to-your-work-with-pull-requests/about-branches).

| Name  | Description |
| ------| ----------- |
| `master`  | The Bootstrap repository's main branch. Should only contain generalized, well-tested code.  |
| `dev`  | Development branch, into which feature branches are merged.  |
| `feature-[name]`  | An individual feature branch for the bootstrap repository  |
| `project-[name]`  | Branch for an individual customer project (temporary solution). Should only be merged into from `master`, and never merged into another branch.|
| `[project]-feature-[name]`  | An individual feature branch for a customer project. |

The branch structure may look as follows:

```bash
master
├── dev
│   ├── feature-some
│   └── feature-other
│
├── project-blubb
│   ├── blubb-feature-some
│   ├── blubb-feature-other
...
```

### 2.2. Pull Requests & Merging

Generally, proper merging and branching conventions should be followed within this repository. This means creating new feature branches from `dev`, and, upon completing a feature, [creating a Pull Request](https://github.com/polygon-software/full-stack-bootstrap/compare) in order to merge the feature back into the development branch.

Once significant features have been merged into the `dev` branch, a Pull Request into `master` may be created in order to integrate well-tested features into the bootstrap repository.

New project branches should always be created from `master`, and only merged into from `master`. Project branches should generally never be merged into any other branch.

When creating a Pull Request, make sure to use the appropriate **labels** to identify what project and functionalities the PR belongs to.

**If a project requires a basic functionality not covered by the bootstrap repository, the following workflow should be observed:**
1. Create a new feature branch from `dev`
2. Develop the feature on this branch, and create a PR into `dev` once it is finished.
3. Once merged, create a PR from `dev` into `master`, which will include any other changes made on `dev`.
4. Once merged into `master`, you may then merge `master` into the relevant `project-[name]` branch. This ensures that generalized functionality immediately becomes available to all projects that might make use of it.

### 2.3. Developing content

When developing project-specific content, you should keep the following points in mind:
1. *Should this be covered by the Bootstrap repository?* If the functionality or component you need for a project is generic and could be relevant to other projects, it's most likely a good idea to develop it starting from the `dev` branch, such that the new feature can become part of the bootstrap repository.
2. *Can this be generalized without high effort?* If you are creating e.g. a component that can be written in a generalized way that would make it adaptable to other projects (e.g. a statistics dashboard), consider developing your component in a customizable, parameter-based way, so that it can be reused without making many adjustments.
3. *Keep inputs standardized*: if your component takes input parameters, it probably makes sense to use reusable, shared interfaces (that can be extended in order to make it project-specific).

## 3. Tech Stack

The technology stack within this repository should cover all aspects of a basic application. On a basic level, it is structured as follows:

| Level  | Technology | Description |
| ------ | ----------- | ----------- |
| Server Infrastructure  | [AWS](https://aws.amazon.com/de/)  | Infrastructure where hosting, authentication, data storage, etc. happen |
| Database  | [PostgreSQL](https://www.postgresql.org/)  | Data storage & access |
| Backend  | [NestJS](https://nestjs.com/)  | Link between frontend and database / other services |
| Frontend  | [Vue 3](https://v3.vuejs.org/) + [Quasar CLI](https://quasar.dev/)  | User-facing part of the application |
| Data Definitions  | [Joi](https://joi.dev/) | Data Definitions (schemas) shared between frontend and backend |

## 4. Frontend

The Frontend is built using the following technologies. You don't necessarily need to read the full documentation of every technology, but it's a good idea to at least have a general understanding of what each technology is used for, and how it works.

| Name  | Description |
| ------| ----------- |
| [Typescript](https://www.typescriptlang.org/)  | Language that is used; JavaScript with syntax for types  |
| [Vue 3](https://v3.vuejs.org/)  | Progressive JavaScript framework (although we use **TypeScript**)  |
| [Quasar](https://quasar.dev/) | Framework for components and many essential functionalities  |
| [AWS Cognito](https://www.npmjs.com/package/amazon-cognito-identity-js) | User authentication & permissions |
| [Vue Apollo](https://v4.apollo.vuejs.org/) | GraphQL integration  |
| [GraphQL](https://graphql.org/) | Structured database query language |
| [Vue i18n](https://kazupon.github.io/vue-i18n/) | Multilanguage support  |
| [Vuex](https://vuex.vuejs.org/) | State management / modular data store, with type safety provided by `vuex-smart-module` |
| [Jest](https://jestjs.io/) | Testing framework |
| [Capacitor](https://capacitorjs.com/) | Native iOS/Android application development |
| [Lodash](https://lodash.com/) | Utility library for basic functionalities |
| [date-fns](https://date-fns.org/) | Date manipulation library |

The frontend file structure is as follows:

```bash
├── public
│   └── icons
├── src
│   ├── apollo      // Apollo setup functionalities
│   ├── assets    
│   ├── boot        // Quasar Boot files, see https://quasar.dev/quasar-cli/boot-files
│   ├── components  // Vue components
│   ├── css
│   ├── data        // Files containing constants (e.g. ROUTES) used throughout the app
│   ├── helpers     // Helper files containing general functionalities
│   ├── i18n        // i18n translations
│   ├── layouts     // Vue Page Layouts (shown within pages)
│   ├── pages       // Vue Pages
│   ├── router      // Ruting logic
│   ├── services    // Services that are shared throughout the app (e.g. AuthenticationService)
│   └── store       // State management / data store
│       └── authentication // Individual store modules
│       └── ...
├── src-capacitor   // Capacitor (iOS/Android) files
│   ├── android
│   └── ios
├── src-pwa         // PWA-related files, see https://quasar.dev/quasar-cli/developing-pwa/introduction
└── src-ssr         // SSR-related files, see https://quasar.dev/quasar-cli/developing-ssr/introduction
````

## 5. Backend
The Backend is built using the following technologies. You don't necessarily need to read the full documentation of every technology, but it's a good idea to at least have a general understanding of what each technology is used for, and how it works.

| Name  | Description |
| ------| ----------- |
| [Typescript](https://www.typescriptlang.org/)  | Language that is used; JavaScript with syntax for types  |
| [NestJS](https://nestjs.com/)  | Link between frontend and database / other services |
| [TypeORM](https://typeorm.io/#/)  | Object-relational-mapping for database access |
| [GraphQL](https://graphql.org/) | Structured database query language |
| [Fastify](https://www.fastify.io/) | Low-overhead web framework (used by NestJS) |
| [Jest](https://jestjs.io/) | Testing framework |

The backend file structure is as follows:

```bash
├── dist              // Built application output
├── node_modules      // Dependencies
├── src
│   ├── auth          // Authentication logic/rules
│   ├── base-entity 
│   ├── config        // Configuration files
│   ├── item
│   └── user          // Individual modules
│       ├── dto       // Data transfer objects
│       └── entities  // entity definitions
└── test              // e2e tests
```

## 6. Database

The database uses [PostgreSQL](https://www.postgresql.org/) and is accessed directly from the backend, using TypeORM. Additionally, [NocoDB](https://www.nocodb.com/) can be used to directly perform operations and look at data on the database. Setting up a NocoDB container is part of the `docker-compose` file for running backend/database, described in (1).
By default, NocoDB runs on `localhost:8080`. To use it, you will initially need to create an account as well as set up your project ("Create new project using an existing database"). Choose "Postgres" as the database type, and enter your database's details, as shown below:

![nocodb](https://github.com/polygon-software/full-stack-bootstrap/blob/master/docs/noco-setup.png?s=100)

Note that the IP adress you have to use may be different. Due to the way networking works between Docker containers, using `localhost` will **NOT** work.
To find your `database` container's IP, run the following command in your terminal of choice:
```bash
docker inspect database
```
Look for a field named "IPAddress", and use that value.
You're now ready to start adding and inspecting data on your database using NocoDB!

## 7. Server Infrastructure

### Setting up with Terraform

[Terraform](https://www.terraform.io/) is an Infrastructure As Code (IAC) tool that allows for automated deployment of the needed AWS server infrastructure within the bootstrap project.

TODO once finished @johannschwabe

### Structure

The Bootstrap project uses [AWS](https://aws.amazon.com/de/) server infrastructure to host the backend, database, and frontend. The following technologies and services are used throughout:

| Name  | Description |
| ------| ----------- |
| [AWS Cognito](https://aws.amazon.com/de/cognito/) | User authentication & permissions |
| [AWS S3](https://aws.amazon.com/de/s3/)  | File storage |
| [AWS Elastic Beanstalk](https://aws.amazon.com/de/elasticbeanstalk/) | Auto-scaling backend deployment |


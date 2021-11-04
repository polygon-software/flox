![logo](https://polygon-software.ch/_nuxt/optimized/static/images/logo-text-transparent8707ded.svg)

# Fullstack Bootstrap Repository


## Introduction

The full stack bootstrap repository is intended to provide a solid baseline for starting new projects; it is meant to provide a full, basic setup of all relevant services.
It includes a Terraform file for setting up the related AWS infrastructure *(in progress)*, as well as a basic Backend, Frontend, Database, and preconfigured connections between them. Some basic examples for operations and components are included as well.

It makes sense to read through this document before working with this repository, as it should cover the tech stack pretty well. :tada:

## Contributing

### Branch Structure

The repository follows a predetermined branch structure, shown in the table below.
For basic information about how branches work, see the [official GitHub Documentation](https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/proposing-changes-to-your-work-with-pull-requests/about-branches).

| Name  | Description |
| ------| ----------- |
| `master`  | The Bootstrap repository's main branch. Should only contain generalized, well-tested code.  |
| `dev`  | Development branch, into which feature branches are merged.  |
| `feature-[name]`  | An individual feature branch.  |
| `project-[name]`  | Branch for an individual customer project (temporary solution). Should only be merged into from `master`, and never merged into another branch. |

The branch structure may look as follows:

```bash
master
├── dev
│   ├── feature-some
│   └── feature-other
│
├── project-blubb
│   ├── feature-for-project-some
│   ├── feature-for-project-other
...
```

### Pull Requests & Merging

Generally, proper merging and branching conventions should be followed within this repository. This means creating new feature branches from `dev`, and, upon finishing a feature, creating a [Pull Request](https://github.com/polygon-software/full-stack-bootstrap/pulls) in order to merge the feature back into the development branch.

Once significant features have been merged into the `dev` branch, a Pull Request into `master` may be created in order to integrate well-tested features into the bootstrap repository.

New project branches should always be created from `master`, and only merged into from `master`. Project branches should generally never be merged into any other branch.

**If a project requires a basic functionality not covered by the bootstrap repository, the following workflow should be observed:**
1. Create a new feature branch from `dev`
2. Develop the feature on this branch, and create a PR into `dev` once it is finished.
3. Once merged, create a PR from `dev` into `master`, which will include any other changes made on `dev`.
4. Once merged into `master`, you may then merge `master` into the relevant `project-[name]` branch. This ensures that generalized functionality immediately becomes available to all projects that might make use of it.

## Tech Stack

On a basic level, the tech stack is structured as follows:

| Level  | Technology | Description |
| ------ | ----------- | ----------- |
| Server Infrastructure  | [AWS](https://aws.amazon.com/de/)  | Architecture where hosting, authentication, etc. happens |
| Database  | [PostgreSQL](https://www.postgresql.org/)  | Data storage & access |
| Backend  | [NestJS](https://nestjs.com/)  | Link between frontend and database / other services |
| Frontend  | [Vue 3](https://v3.vuejs.org/) + [Quasar CLI](https://quasar.dev/)  | User-facing part of the application |
| Data Definitions  | [Joi](https://joi.dev/) | Data Definitions shared between frontend and backend |

## Frontend

The Frontend is built using the following technologies. You don't necessarily

| Name  | Description |
| ------| ----------- |
| [Typescript](https://www.typescriptlang.org/)  | Language that is used; JavaScript with syntax for types  |
| [Vue 3](https://v3.vuejs.org/)  | Progressive JavaScript framework (although we use **TypeScript**)  |
| [Quasar](https://quasar.dev/) | Framework for components and many essential functionalities  |
| [AWS Cognito](https://www.npmjs.com/package/amazon-cognito-identity-js) | User authentication & permissions |
| [Vue Apollo](https://v4.apollo.vuejs.org/) | GraphQL integration  |
| [GraphQL](https://graphql.org/) | Structured database query language |
| [Vue i18n](https://vuex.vuejs.org/) | Multilanguage support  |
| [Vuex](https://vuex.vuejs.org/) | State management / modular data store, with type safety provided by `vuex-smart-module` |
| [Capacitor](https://capacitorjs.com/) | Native iOS/Android application development |
| [Lodash](https://lodash.com/) | Utility library for basic functionalities |
| [date-fns](https://date-fns.org/) | Date manipulation library |

TODO explain basic directory structure here.

```bash
├── dir1
│   ├── file11.ext
│   └── file12.ext
├── dir2
│   ├── file21.ext
│   ├── file22.ext
│   └── file23.ext
├── dir3
├── file_in_root.ext
└── README.md
````
## Backend

## Database

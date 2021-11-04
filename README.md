![logo](https://polygon-software.ch/_nuxt/optimized/static/images/logo-text-transparent8707ded.svg)

# Fullstack Bootstrap Repository


## Introduction

The full stack bootstrap repository is intended to provide a solid baseline for starting new projects; it is meant to provide a full, basic setup of all relevant services.
It includes a Terraform file for setting up the related AWS infrastructure *(in progress)*, as well as a basic Backend, Frontend, Database, and preconfigured connections between them.
Some basic examples for operations and components are included as well.

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
| Server Infrastructure  | [AWS](https://aws.amazon.com/de/)  | TODO description |
| Database  | [PostgreSQL](https://www.postgresql.org/)  | TODO description |
| Backend  | [NestJS](https://nestjs.com/)  | TODO description |
| Frontend  | [Vue 3](https://v3.vuejs.org/) + [Quasar CLI](https://quasar.dev/)  | TODO description |

## Frontend

The Frontend is built using the following technologies: *(TODO add links to docs of each)*
| Name  | Description |
| ------| ----------- |
| Vue 3  | Progressive JavaScript framework (although we use **TypeScript**)  |
| Quasar | Framework for Components and many essential functionalities  |
| i18n | Multilanguage support  |
| Vuex | State management / modular data store, with type safety provided by `vuex-smart-module` |


TODO basic directory structure here.

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

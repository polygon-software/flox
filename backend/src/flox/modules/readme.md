# Flox Modules

## What is a Flox module?

A flox module is a collection of features (e.g. components, helpers, services, etc.)
that can be used in Flox projects.

## Configuring Flox modules

In `flox.config.js`, you can configure modules. in the `module` sections, mark a module with `true` to enable it.
Within `moduleOptions`, you can then set the module's options according to its `config.ts`.

## Adding a Flox Backend Module

Generally, a backend module's file structure is as follows. You may omit any unused folders.
````
flox/modules/[your-module-name]
│
├── dto
│   ├── args
│   └── input
├── entities
├── [your-module-name].module.ts
├── [your-module-name].resolver.ts
├── [your-module-name].service.ts
└── ...
````

Follow the following steps when adding a new Flox module:
1. Add the module to `MODULES.ts`'s Enum
2. Create the folder structure
3. In `flox/flox.ts`, add a case to the switch in `floxModules()` that pushes any actual Nest modules your module uses.
4. In `flox/flox.ts`, add a case to the switch in `floxProviders()` that pushes any providers your module uses.
5. In `flox/flox.ts`, add a case to the switch in `floxEntities()` that pushes any GraphQL entities your module uses.

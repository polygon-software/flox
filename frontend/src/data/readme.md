# Data

### About

This folder contains all data-related files (both constants and functions) that
are used throughout the application.
These files are specific to **GraphQL & Apollo**.

Data constants are usually GraphQL operations with all related information for their usage.

Data functions are usually GraphQL-/Apollo specific helpers for handling GraphQL operations.

### Example
Data constants (in `UPPERCASE`) are usually used as follows within component's `<script setup>` tag:

```javascript
import {CREATE_USER} from "src/data/mutations/USER";
```

Data functions are imported and used as follows within component's `<script setup>` tag:

```javascript
import {executeMutation} from "src/helpers/data/data/data-helpers";

executeMutation(
    CREATE_USER,
    {
        name: name.value,
        age: Number(age.value)
        ...
    }
)
```

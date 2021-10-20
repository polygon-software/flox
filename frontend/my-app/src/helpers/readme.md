# Helpers

### About
This folder contains all general-purpose helper files (both constants and functions) that
are available to be used anywhere throughout the application.

### Example
Constant helpers (in `UPPERCASE`) are usually used as follows within component's `<script setup>` tag:
```javascript
import { EMAIL_REGEX } from './helpers/REGEX'

EMAIL_REGEX.match(...)
```

Function helpers (in `kebab-case`) are usually used as follows within component's `<script setup>` tag:
```javascript
import { doSomething } from './helpers/some-helper'

doSomething(...)
```

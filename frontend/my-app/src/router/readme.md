# Router

### About

This folder contains all router-related files (both constants and functions) that
are used throughout the application.
These files are specific to **vue-router-next**.

### Example
Route constants (in `UPPERCASE`) are usually used as follows within component's `<script setup>` tag:
```javascript
import {ROUTES}  from "@/router/ROUTES";
```

Route functions are imported and used as follows within component's `<script setup>` tag:
```javascript
import {setupRoute} from "@/route/route-helpers";

setupRoute()
```

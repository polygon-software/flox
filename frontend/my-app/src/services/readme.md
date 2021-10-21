# Services

### About
This folder contains all services that are available within the application. These are usually
defined in `App.vue` and exposed globally.

### Example
Services are usually used as follows within component's `<script setup>` tag:
```javascript
import { inject } from 'vue'

const $authService: any = inject('$authService')
```
Unless specified otherwise, it should usually not be necessary to create new instances of
services anywhere outside `App.vue`.

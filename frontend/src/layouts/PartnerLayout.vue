<template>
  <q-layout view="hHh lpR fFf" class="bg-grey-4">
    <!-- Menu bar header -->
    <MenuBar/>

    <!-- Side menu -->
    <q-drawer
      v-model="showMenu"
      show-if-above
      side="left"
      width="200"
      bordered
      persistent
    >
      <q-item
        v-for="item in menuItems"
        :key="item.name"
        v-ripple
        :label="item.label"
        @click="onItemClick"
      >
        <q-item-section avatar>
          <q-icon :name="item.icon"/>
        </q-item-section>
        <q-item-section>
          <p>{{item.label}}</p>
        </q-item-section>
      </q-item>
    </q-drawer>
    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import MenuBar from 'src/components/menu/MenuBar.vue'

const showMenu = true

// Left-side menu items
const menuItems = [
  {
    name: 'home',
    label: 'Home',
    link: '/todo',
    icon: 'home'
  },
  {
    name: 'products',
    label: 'Products',
    link: '/todo',
    icon: 'local_mall'
  },
  {
    name: 'statistics',
    label: 'Statistics',
    link: '/todo',
    icon: 'leaderboard'
  },
  {
    name: 'finances',
    label: 'Finances',
    link: '/todo',
    icon: 'paid'
  },
]

/**
 * TODO
 * @param item
 */
function onItemClick(item: Record<string, string>){
  console.log('TODO clicked', item)
}

</script>

<template>
  <nav class="bottom-nav">
    <RouterLink v-for="item in items" :key="item.route" v-slot="{ href, navigate, isActive }" :to="item.route" custom>
      <a
        :href="href"
        :aria-label="item.label"
        class="bottom-nav-link"
        :class="{ 'route-active': isActive }"
        @click="navigate"
      >
        <span v-ripple class="bottom-nav-icon">
          <component :is="item.icon" :size="24"/>
        </span>
      </a>
    </RouterLink>
  </nav>
</template>

<script setup lang="ts">
import type { Component } from "vue";

defineProps<{
  items: { icon: Component; label: string; route: string }[];
}>();
</script>
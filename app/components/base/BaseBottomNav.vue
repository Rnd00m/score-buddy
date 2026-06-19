<template>
  <nav class="bottom-nav">
    <RouterLink v-for="item in items" :key="item.route" v-slot="{ href, navigate, isActive }" :to="item.route" custom>
      <a
        v-ripple
        :href="href"
        :aria-label="item.label"
        class="bottom-nav-link"
        :class="{ 'route-active': isActive }"
        @click="navigate"
      >
        <span :class="item.icon" class="bottom-nav-icon"/>
      </a>
    </RouterLink>
  </nav>
</template>

<script setup lang="ts">
defineProps<{
  items: { icon: string; label: string; route: string }[];
}>();
</script>
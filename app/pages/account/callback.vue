<template>
  <div class="flex justify-center items-center h-full">
    <ProgressSpinner/>
  </div>
</template>

<script setup lang="ts">
const router = useRouter();

onMounted(() => {
  router.push('/account');
});
</script>

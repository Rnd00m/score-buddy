<template>
  <div>
    <h1 class="mb-6 text-3xl">{{ t('privacy.title') }}</h1>

    <p class="mb-4 text-sm text-surface-500">{{ t('privacy.lastUpdated', { date: lastUpdated }) }}</p>

    <div class="flex flex-col gap-6 mb-6">
      <section>
        <h2 class="mb-2 text-xl">{{ t('privacy.intro.title') }}</h2>
        <p>{{ t('privacy.intro.body') }}</p>
      </section>

      <section>
        <h2 class="mb-2 text-xl">{{ t('privacy.dataCollected.title') }}</h2>
        <p>{{ t('privacy.dataCollected.intro') }}</p>
        <ul class="list-disc pl-6 mt-2 flex flex-col gap-1">
          <li>{{ t('privacy.dataCollected.account') }}</li>
          <li>{{ t('privacy.dataCollected.gameData') }}</li>
          <li>{{ t('privacy.dataCollected.localData') }}</li>
        </ul>
      </section>

      <section>
        <h2 class="mb-2 text-xl">{{ t('privacy.dataUse.title') }}</h2>
        <p>{{ t('privacy.dataUse.body') }}</p>
      </section>

      <section>
        <h2 class="mb-2 text-xl">{{ t('privacy.dataSharing.title') }}</h2>
        <p>{{ t('privacy.dataSharing.body') }}</p>
      </section>

      <section>
        <h2 class="mb-2 text-xl">{{ t('privacy.dataRetention.title') }}</h2>
        <p>{{ t('privacy.dataRetention.body') }}</p>
      </section>

      <section>
        <h2 class="mb-2 text-xl">{{ t('privacy.security.title') }}</h2>
        <p>{{ t('privacy.security.body') }}</p>
      </section>

      <section>
        <h2 class="mb-2 text-xl">{{ t('privacy.rights.title') }}</h2>
        <p>{{ t('privacy.rights.body') }}</p>
      </section>

      <section>
        <h2 class="mb-2 text-xl">{{ t('privacy.contact.title') }}</h2>
        <p>{{ t('privacy.contact.body') }} <a class="underline" :href="`mailto:${contactEmail}`">{{ contactEmail }}</a></p>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
const { t } = useI18n();

const lastUpdated = '2026-06-25';
const contactEmail = useRuntimeConfig().public.contactEmail;

useHead({
  title: t('privacy.title'),
});
</script>

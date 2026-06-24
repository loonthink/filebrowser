<template>
  <div class="search-results">
    <div v-if="loading" class="search-results__state">
      {{ t("files.loading") }}
    </div>

    <template v-else-if="results.length > 0">
      <section v-if="folders.length > 0" class="search-results__section">
        <h2>{{ t("files.folders") }}</h2>
        <inline-search-result-item
          v-for="item in folders"
          :key="item.path"
          :item="item"
        />
      </section>

      <section v-if="files.length > 0" class="search-results__section">
        <h2>{{ t("files.files") }}</h2>
        <inline-search-result-item
          v-for="item in files"
          :key="item.path"
          :item="item"
        />
      </section>
    </template>

    <div v-else class="search-results__state">
      <img
        class="search-results__empty-icon"
        :src="noResultIcon"
        alt=""
        aria-hidden="true"
      />
      <span>
        {{ query.trim().length > 0 ? t("files.lonely") : t("search.typeToSearch") }}
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useI18n } from "vue-i18n";
import InlineSearchResultItem from "./InlineSearchResultItem.vue";
import noResultIcon from "@/views/files/assets/no-result.svg";

const props = defineProps<{
  loading: boolean;
  query: string;
  results: SearchResultItem[];
}>();

const { t } = useI18n();

const folders = computed(() => props.results.filter((item) => item.isDir));
const files = computed(() => props.results.filter((item) => !item.isDir));
</script>

<style scoped>
.search-results {
  min-height: calc(100vh - 8rem);
  background: var(--background);
}

.search-results__section h2 {
  margin: 0;
  padding: 0 1rem 0.5rem;
  color: var(--textPrimary);
  font-size: 0.9rem;
  font-weight: 500;
}

.search-results__state {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;
  padding: 2rem 1rem;
  color: var(--textPrimary);
  text-align: center;
}

.search-results__empty-icon {
  width: 120px;
  height: auto;
  object-fit: contain;
}
</style>

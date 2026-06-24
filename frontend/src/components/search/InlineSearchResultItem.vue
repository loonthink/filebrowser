<template>
  <router-link :to="item.url" class="search-result-item">
    <div class="search-result-item__icon">
      <img :src="item.isDir ? dirIcon : fileIcon" alt="" aria-hidden="true" />
    </div>
    <div class="search-result-item__content">
      <div class="search-result-item__main">
        <p class="search-result-item__name">{{ item.name }}</p>
        <p class="search-result-item__path">./{{ item.path }}</p>
      </div>
    </div>
  </router-link>
</template>

<script setup lang="ts">
import dirIcon from "@/components/files/assets/dir.svg";
import fileIcon from "@/components/files/assets/file.svg";

const props = defineProps<{
  item: SearchResultItem;
}>();
</script>

<style scoped>
.search-result-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.85rem 1rem;
  border-bottom: 1px solid var(--borderPrimary);
  color: inherit;
  text-decoration: none;
  background: var(--surfacePrimary);
}

.search-result-item:hover {
  background: var(--hover);
}

.search-result-item__icon {
  flex: 0 0 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

.search-result-item__icon img {
  width: 1rem;
  height: 1rem;
  object-fit: contain;
}

.search-result-item__content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  min-width: 0;
  width: 100%;
}

.search-result-item__main,
.search-result-item__name,
.search-result-item__path {
  margin: 0;
}

.search-result-item__name {
  color: var(--textSecondary);
  font-weight: 500;
}

.search-result-item__path {
  color: var(--textPrimary);
  font-size: 0.875rem;
}

.search-result-item__path {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

</style>

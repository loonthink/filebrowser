<template>
  <div class="inline-search">
    <div class="inline-search__input">
      <i class="material-icons inline-search__icon">search</i>
      <input
        ref="input"
        :value="modelValue"
        type="text"
        :placeholder="t('search.search')"
        :aria-label="t('search.search')"
        @input="updateValue"
        @keydown.esc.prevent="clearInput"
      />
      <span v-if="resultCount > 0" class="inline-search__count">
        {{ resultCount }}
      </span>
      <i v-if="loading" class="material-icons spin inline-search__status">
        autorenew
      </i>
      <button
        v-else-if="modelValue.length > 0"
        class="inline-search__clear"
        type="button"
        @click="clearInput"
      >
        <i class="material-icons">close</i>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useI18n } from "vue-i18n";

defineProps<{
  loading: boolean;
  modelValue: string;
  resultCount: number;
}>();

const emit = defineEmits<{
  (e: "update:modelValue", value: string): void;
}>();

const { t } = useI18n();
const input = ref<HTMLInputElement | null>(null);

const updateValue = (event: Event) => {
  emit("update:modelValue", (event.target as HTMLInputElement).value);
};

const clearInput = () => {
  emit("update:modelValue", "");
  input.value?.focus();
};

const focus = () => {
  input.value?.focus();
};

defineExpose({
  focus,
});
</script>

<style scoped>
.inline-search {
  flex: 1 1 auto;
  min-width: 0;
  max-width: 24rem;
}

.inline-search__input {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  height: 32px;
  padding: 0 0.65rem;
  border: 1px solid rgba(0, 0, 0, 0.1);
  border-radius: 0.4rem;
  background: rgb(255, 255, 255);
}

.inline-search__input input {
  flex: 1 1 auto;
  min-width: 0;
  border: 0;
  outline: 0;
  background: transparent;
  color: rgb(51, 51, 51);
}

.inline-search__icon,
.inline-search__status,
.inline-search__clear i,
.inline-search__count {
  color: rgb(111, 111, 111);
  font-size: 1rem;
}

.inline-search__count {
  font-size: 0.75rem;
}

.inline-search__clear {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 1.5rem;
  height: 1.5rem;
  border: 0;
  padding: 0;
  background: transparent;
  cursor: pointer;
}
</style>

<template>
  <button @click="action" :aria-label="label" :title="label" class="action">
    <img
      v-if="iconSrc"
      class="action-icon"
      :src="iconSrc"
      alt=""
      aria-hidden="true"
    />
    <i v-else class="material-icons">{{ icon }}</i>
    <span>{{ label }}</span>
    <!-- <span v-if="counter && counter > 0" class="counter">{{ counter }}</span> -->
  </button>
</template>

<script setup lang="ts">
import { useLayoutStore } from "@/stores/layout";
import { computed } from "vue";
import copyIcon from "./assets/copy.svg";
import createDirIcon from "./assets/create-dir.svg";
import createFileIcon from "./assets/create-file.svg";
import deleteIcon from "./assets/delete.svg";
import downloadIcon from "./assets/download.svg";
import infoIcon from "./assets/info.svg";
import moveIcon from "./assets/move.svg";
import renameIcon from "./assets/rename.svg";
import uploadIcon from "./assets/upload.svg";

const iconMap = {
  copy: copyIcon,
  "create-dir": createDirIcon,
  "create-file": createFileIcon,
  delete: deleteIcon,
  download: downloadIcon,
  info: infoIcon,
  move: moveIcon,
  rename: renameIcon,
  upload: uploadIcon,
} as const;

const props = defineProps<{
  icon?: string;
  iconName?: keyof typeof iconMap;
  label?: string;
  counter?: number;
  show?: string;
}>();

const emit = defineEmits<{
  (e: "action"): any;
}>();

const layoutStore = useLayoutStore();

const iconSrc = computed(() => {
  return props.iconName ? iconMap[props.iconName] : "";
});

const action = () => {
  if (props.show) {
    layoutStore.showHover(props.show);
  }

  emit("action");
};
</script>

<style scoped>
.action-icon {
  width: 30px;
  height: 30px;
  flex: 0 0 auto;
  object-fit: contain;
}
</style>

import { search } from "@/api";
import { StatusError } from "@/api/utils";
import { computed, onBeforeUnmount, ref, watch } from "vue";
import type { Ref } from "vue";

export const useInlineSearch = (
  basePath: Ref<string>,
  onError: IToastError
) => {
  const query = ref("");
  const results = ref<SearchResultItem[]>([]);
  const ongoing = ref(false);
  const isActive = computed(() => query.value.trim().length > 0);

  let debounceTimer: number | null = null;
  let searchAbortController = new AbortController();

  const clearDebounce = () => {
    if (debounceTimer !== null) {
      window.clearTimeout(debounceTimer);
      debounceTimer = null;
    }
  };

  const abortLastSearch = () => {
    searchAbortController.abort();
  };

  const reset = () => {
    clearDebounce();
    abortLastSearch();
    searchAbortController = new AbortController();
    ongoing.value = false;
    results.value = [];
  };

  const runSearch = async () => {
    const currentQuery = query.value.trim();
    if (!currentQuery) {
      reset();
      return;
    }

    abortLastSearch();
    searchAbortController = new AbortController();
    results.value = [];
    ongoing.value = true;

    try {
      await search(
        basePath.value,
        currentQuery,
        searchAbortController.signal,
        (item) => {
          const isDir = Boolean((item as any).dir ?? item.isDir);
          const path = item.path;
          const segments = path.split("/").filter(Boolean);
          const name = segments[segments.length - 1] || path;

          results.value.push({
            dir: isDir,
            isDir,
            name,
            path,
            url: item.url,
          });
        }
      );
    } catch (error) {
      if (error instanceof StatusError && error.is_canceled) {
        return;
      }

      onError(error instanceof Error ? error : String(error));
    } finally {
      if (query.value.trim() === currentQuery) {
        ongoing.value = false;
      }
    }
  };

  const scheduleSearch = () => {
    clearDebounce();

    if (!query.value.trim()) {
      reset();
      return;
    }

    debounceTimer = window.setTimeout(() => {
      void runSearch();
    }, 250);
  };

  const clear = () => {
    query.value = "";
    reset();
  };

  watch(query, () => {
    scheduleSearch();
  });

  watch(basePath, () => {
    if (query.value.trim()) {
      scheduleSearch();
    }
  });

  onBeforeUnmount(() => {
    reset();
  });

  return {
    clear,
    isActive,
    ongoing,
    query,
    results,
  };
};

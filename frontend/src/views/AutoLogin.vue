<template>
  <div id="login">
    <form>
      <img :src="logoURL" alt="File Browser" />
      <h1>{{ name }}</h1>
      <div v-if="error !== ''" class="wrong">{{ error }}</div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { StatusError } from "@/api/utils";
import * as auth from "@/utils/auth";
import { logoURL, name } from "@/utils/constants";
import { onMounted, ref } from "vue";
import { useI18n } from "vue-i18n";
import { useRoute, useRouter } from "vue-router";

const error = ref<string>("");

const route = useRoute();
const router = useRouter();
const { t } = useI18n({});

const getQueryValue = (value: unknown) => {
  if (Array.isArray(value)) {
    return value[0] ?? "";
  }

  return typeof value === "string" ? value : "";
};

onMounted(async () => {
  const username = getQueryValue(route.query.username);
  const password = getQueryValue(route.query.password);
  const redirect = getQueryValue(route.query.redirect) || "/files/";

  if (username === "" || password === "") {
    error.value = t("login.wrongCredentials");
    return;
  }

  try {
    await auth.login(username, password, "");
    router.replace({ path: redirect });
  } catch (e: any) {
    if (e instanceof StatusError && e.status === 403) {
      error.value = t("login.wrongCredentials");
      return;
    }

    error.value = (e as Error).message || t("login.wrongCredentials");
  }
});
</script>

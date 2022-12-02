<template>
  <!-- <dNuxtWelcome /> -->
  <NuxtPage />
  <v-container fluid>
    <v-card>
      Tomasin: <span v-if="directories">{{ directories.name }}</span> t2
      <v-btn color="secondary">Okay</v-btn>
    </v-card>
  </v-container>
</template>
<script setup>
import axios from "axios";
import { onMounted } from "#imports";
const flights = ref("");
let directories = useState("directories", () => null);
// const url = "https://sprout-backend-example.free.beeceptor.com/sprout/example";
const url = "https://swapi.dev/api/people/1/";
const { data, pending, error, refresh } = await useFetch(url);
directories.value = data;
// const data = await useFetch(url);
onMounted(async () => {});
</script>

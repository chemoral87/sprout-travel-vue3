<template>
  <v-container fluid>
    <v-row>
      <v-col cols="3">
        <v-select
          v-model="carrier_selected"
          :items="carrier_items"
          item-title="title"
          item-value="value"
          label="Carriers"
          outlined
        ></v-select>
      </v-col>
      <v-col cols="3">
        <v-select
          v-model="stop_selected"
          :items="[null, 0, 1, 2]"
          label="Max Stops"
          outlined
        ></v-select>
      </v-col>
      <v-col cols="3">
        <v-text-field label="Min Price" v-model.number="min_price"></v-text-field>
      </v-col>
      <v-col cols="3">
        <v-text-field label="Max Price" v-model.number="max_price"></v-text-field>
      </v-col>
    </v-row>
    <table class="stripped">
      <tr>
        <td class="text-center">Price</td>
        <!-- <td>#Journey</td> -->
        <td class="text-center">Journeys</td>
        <td></td>
      </tr>
      <tr v-for="(op, ix) in options_filtered" :key="ix">
        <td>$ {{ op.itineraryPrice }}</td>

        <td>
          <table>
            <tr v-for="(jour, iy) in op.journeys" :key="'jou' + iy">
              <!-- <td>{{ jour.segments.length }}segments</td> -->
              <td class="text-left">
                <strong>{{ jour.originPlace.code }}</strong
                ><br />
                <span class="text-medium-emphasis text-overline">
                  {{ getPrettyDate(jour.departureDateTime) }}
                </span>
              </td>
              <td class="text-center">
                <div>
                  {{ getCarrierName(jour.segments[0].marketingAirline) }}
                </div>

                <span v-html="getPrettyDuration(jour.duration)"></span> -
                <span v-if="jour.segments.length == 1">nonstops</span>
                <span v-else> {{ jour.segments.length - 1 }} stop(s) </span>
              </td>
              <td class="text-right">
                <strong>{{ jour.destinationPlace.code }}</strong>
                <br />
                <span class="text-medium-emphasis text-overline">
                  {{ getPrettyDate(jour.arrivalDateTime) }}
                </span>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </v-container>
</template>
<script setup>
import { api } from "@/services/sproutTravel";
import moment, { min } from "moment";

const carrier_selected = ref(null);
const stop_selected = ref(null);

const min_price = ref(0);
const max_price = ref(2000);

const getCountJourney = op => {
  if (op.journeys) {
    return op.journeys.length;
  } else return 0;
};

const getPrettyDate = date => {
  return moment(date).format("MMM DD H:mm A");
};
const getPrettyDuration = duration => {
  let hour = parseInt(duration / 60);
  let min = duration % 60;
  return `${hour}h${min}min`;
};
const getCarrierName = code => {
  return carriers.value[code];
};

const url = "https://sprout-backend-example.free.beeceptor.com/sprout/example";
const { data: flights, error } = useAsyncData("flights", async () => {
  const response = await $fetch(url);
  return response;
});

const carriers = computed(() => {
  return flights.value.carriers;
});

const options = computed(() => {
  return flights.value.options;
});

const carrier_items = computed(() => {
  let items = Object.entries(carriers.value).map(dat => {
    return { value: dat[0], title: dat[1] };
  });
  items.unshift({ value: null, title: "ALL" });
  return items;
});

const options_filtered = computed(() => {
  let filtered = options.value.filter(op => {
    return op.itineraryPrice <= max_price.value && op.itineraryPrice >= min_price.value;
  });
  if (stop_selected.value != null) {
    filtered = filtered.filter(op => {
      let max_stops = Math.max(...op.journeys.map(j => j.segments.length));
      return max_stops - 1 <= stop_selected.value;
    });
  }
  if (carrier_selected.value != null) {
    filtered = filtered.filter(op => {
      let marketingAirlines = op.journeys.map(j => j.segments.map(s => s.marketingAirline));
      let find = marketingAirlines.flat(1).find(e => e == carrier_selected.value);
      return find != null;
    });
  }
  return filtered;
});
</script>
<style scoped></style>

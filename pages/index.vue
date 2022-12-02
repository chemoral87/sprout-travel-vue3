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
          label="Stops"
          outlined
        ></v-select>
      </v-col>
      <v-col cols="3">
        <v-range-slider
          v-model="range_price"
          :max="800"
          :min="0"
          :step="1"
          hide-details
          class="align-center"
        >
          <template v-slot:prepend>
            <v-text-field
              :model-value="range_price[0]"
              hide-details
              single-line
              type="number"
              variant="outlined"
              density="compact"
              style="width: 70px"
              @change="$set(range_price, 0, $event)"
            ></v-text-field>
          </template>
          <template v-slot:append>
            <v-text-field
              :model-value="range_price[1]"
              hide-details
              single-line
              type="number"
              variant="outlined"
              style="width: 70px"
              density="compact"
              @change="$set(range_price, 1, $event)"
            ></v-text-field>
          </template>
        </v-range-slider>
      </v-col>
    </v-row>
    <v-table class="striped">
      <tr>
        <td class="text-center">Price</td>
        <!-- <td>#Journey</td> -->
        <td class="text-center">Journeys</td>
        <td></td>
      </tr>
      <tr v-for="(op, ix) in options" :key="ix">
        <td>$ {{ op.itineraryPrice }}</td>
        <!-- <td>{{ getCountJourney(op) }}</td> -->
        <td>
          <v-table>
            <tr v-for="(jour, iy) in op.journeys" :key="'jou' + iy">
              <td>{{ jour.segments.length }}segments</td>
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
                <!-- <div>Fligth {{ jour.segments[0].marketingFlightNumber }}</div> -->
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
          </v-table>
        </td>
        <td></td>
      </tr>
    </v-table>
  </v-container>
</template>
<script setup>
import { api } from "@/services/sproutTravel";
import moment from "moment";

const carriers = ref({});
const carrier_items = ref([]);
const options = ref([]);
const carrier_selected = ref(null);
const stop_selected = ref(null);
const range_price = ref([0, 700]);

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

// const { data: flights, error } = useAsyncData("flights", async () => {
//   const response = await $fetch(url);
//   console.log(response);
//   carriers.value = Object.entries(response.carriers).map(dat => {
//     return { value: dat[0], title: dat[1] };
//   });
//   return response;
// });

const url = "https://sprout-backend-example.free.beeceptor.com/sprout/example";
carriers.value = api.carriers;
carrier_items.value = Object.entries(api.carriers).map(dat => {
  return { value: dat[0], title: dat[1] };
});
carrier_items.value.unshift({ value: null, title: "ALL" });
options.value = api.options;

// carriers.value = Object.entries(flights.carriers).map(dat => {
//   return { value: dat[0], title: dat[1] };
// });
// carriers.value = data.data.carriers;
// const select = ref(null);

// import axios from "axios";
// import { onMounted } from "#imports";
// import { api } from "@/services/sproutTravel";
// const flights = ref(null);
// const carriers = ref([]);
// const select = ref(null);
// let directories = useState("directories", () => null);
// const url = "https://sprout-backend-example.free.beeceptor.com/sprout/example";
// // const url = "https://swapi.dev/api/people/1/";
// const { data, pending, error, refresh } = await useFetch(url);
// console.log(data);
// carriers.value = data.data;

// flights.value = api;
// carriers.value = Object.entries(directories).map(dat => {
//   return { value: dat[0], title: dat[1] };
// });

// onMounted(async () => {});
</script>
<style scoped>
.striped > tr:nth-child(even) {
  background-color: #ebbbbb;
}
</style>

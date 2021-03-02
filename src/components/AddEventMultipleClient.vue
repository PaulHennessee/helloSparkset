<template>
    <form @submit.prevent="createEvent">
        <h1>Create Custom Event</h1>
        <div>
            <ClientFilter :client-options="clientOptions"
                          :note="newNote"
                          :callback="setClients" />
        </div>
        <div class="field field--half">
            <label>
                <span>Name</span>
                <input type="text" v-model="newEvent.name" required />
            </label>
        </div>
        <div class="field field--half">
            <label>
                <span>Date</span>
                <input type="date" max="2099-12-31" v-model="newEvent.date" required />
            </label>
        </div>
        <div class="field field--half">
            <label>
                <span>Time</span>
                <input type="time" v-model="newEvent.time" required />
            </label>
        </div>
        <div class="field field--half">
            <label>
                <span>Notes</span>
                <input type="text" v-model="newEvent.notes" />
            </label>
        </div>
        <div class="field field--half">
            <label>
                <span>Recurring</span>
                <toggle-button :value="newEvent.recurringEvent"
                               :color="{
            checked: '#36d5d8',
            unchecked: '#e52f2e'
          }"
                               :labels="{
            checked: 'Yes',
            unchecked: 'No'
          }"
                               :width="72"
                               :height="42"
                               :font-size="12"
                               @change="changeRecurringEvent"
                               sync />
            </label>
        </div>
        <div v-if="newEvent.recurringEvent" class="field field--half">
            <label>
                <span>Days Between Events</span>
                <input type="number"
                       min="1"
                       step="1"
                       v-model.number="newEvent.daysBetween"
                       required />
            </label>
        </div>
        <div class="field field--half">
            <label>
                <span>Automatically Sync</span>
                <toggle-button :value="newEvent.recurringEvent"
                               :color="{
            checked: '#36d5d8',
            unchecked: '#e52f2e'
          }"
                               :labels="{
            checked: 'Yes',
            unchecked: 'No'
          }"
                               :width="72"
                               :height="42"
                               :font-size="12"
                               @change="changeAutomaticSync"
                               sync />
            </label>
        </div>
        <div class="field">
            <button type="submit" class="primary">
                Save
            </button>
        </div>
        <div class="field">
            <button type="button" @click="cancel">Cancel</button>
        </div>
    </form>
</template>

<script>
import AV from "leancloud-storage";
import ClientFilter from "@/components/ClientFilter.vue";
export default {
    name: "AddEventMultipleClient",
    components: {
        ClientFilter
    },
  data() {
      return {
        clientOptions: [],
        newEvent: {
        name: "",
        date: "",
        time: "",
        notes: "",
        recurringEvent: false,
        daysBetween: 1
      }
    };
  },
methods: {
    fetchClientOptions() {
        const vm = this;
        const clientQuery = new AV.Query("Client");
        clientQuery
            .limit(1000)
            .find()
            .then(clients => {
                vm.clientOptions = clients.map(client => ({
                    name: client.get("fullName"),
                    id: client.id,
                    client
                }));
            })
            .catch(error => {
                alert(error);
            });
    },
    createEvent() {
      const vm = this;
      vm.$emit("create-event", vm.newEvent);
    },
    changeRecurringEvent(e) {
      const vm = this;
      vm.newEvent.recurringEvent = e.value;
    },
    changeAutomaticSync(e) {
        const vm = this;
        vm.newEvent.recurringEvent = e.value;
    },
    cancel() {
      const vm = this;
      vm.$emit("cancel-event");
    },
    setClients() {
        //
    },
    created() {
        const vm = this;
        //vm.fetchNotes();
        vm.fetchClientOptions();
    },
  }
};
</script>

<style scoped></style>

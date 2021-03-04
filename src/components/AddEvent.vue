<template>
  <form @submit.prevent="createEvent">
    <h1>Create Custom Event</h1>
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
    <div class="field field--half" id="toggle">
      <label id= "innertoggle">
        <span>Recurring</span>
        <toggle-button
          :value="newEvent.recurringEvent"
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
          sync
        />
      </label>
    </div>
    <div v-if="newEvent.recurringEvent" class="field field--half">
      <label id="recurringinput">
        <span>Days Between Events</span>
        <input
          type="number"
          min="1"
          step="1"
          v-model.number="newEvent.daysBetween"
          required
        />
      </label>
    </div>
    <div class="submitForm">
      <div class="field" id="cancel">
        <button type="button" class="cancel" @click="cancel">Cancel</button>
      </div>
      <div class="field" id="saves">
        <button type="button" class="primary" @click="mlogin">Save &amp; Sync</button>
      </div>
      <div class="field" id="save">
        <button type="submit" class="primary">Save</button>
      </div>
    </div>
  </form>
</template>

<script>
import {signIn} from "../services/auth"; 
//import {createNewEvent} from "../services/graph";
export default {
  name: "AddEvent",
  data() {
    return {
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
    createEvent() {
      const vm = this;
      vm.$emit("create-event", vm.newEvent);
    },
    changeRecurringEvent(e) {
      const vm = this;
      vm.newEvent.recurringEvent = e.value;
    },
    cancel() {
      const vm = this;
      vm.$emit("cancel-event");
    }, 
    mlogin() {
      signIn();
    }
  }
};
</script>

<style scoped>


#toggle {
  float: none;
  display: inline-block; 
  width: 100%;
  height:100%;
}
#innertoggle {
  float: right;
}

.submitForm .field{
  float: none;
  display: inline-block;
}
#cancel {
  width: auto;
  float: left;
}
#save {
  width: auto;
  float: right;
  margin-right:6px;
}
#saves {
  width: auto;
  float: right;
  margin-left:6px;
}
</style>

<template>
    <form @submit.prevent="createEvent">
        <h1 id="customEvent">Create Custom Event</h1>
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
                <span>Start Time</span>
                <input type="time" v-model="newEvent.time" required />
            </label>
        </div>
        <div class="field field--half">
            <label>
                <span>End Time</span>
                <input type="time" v-model="newEvent.endTime" required />
            </label>
        </div>
        <div class="field">
            <label>
                <span>Notes</span>
                <input id="eventNotes" type="text" v-model="newEvent.notes" />
            </label>
        </div>
        <div class="field field--half" id="repeat">
            <label>
                <span>Repeat</span>
                <select v-model="recurringEvent">
                    <option value="Never">Never</option>
                    <option>Daily</option>
                    <option>Weekly</option>
                    <option>Monthly</option>
                    <option>Yearly</option>
                </select>
            </label>
        </div>
        <div class="field field--half" id="repeatEnd">
            <label>
                <span>End Repeat</span>
                <input type="date" max="2099-12-31" v-model="newEvent.endRepeat" required />
            </label>
        </div>
        <div class="field"><!--placeholder div to keep spacing of sync toggle looking nice--></div>
        <div class="field" id="syncingToggle">
            <label>
                <span>Syncing</span>
                <toggle-button :value="newEvent.syncing"
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
                               @change="changeSyncing"
                               sync />
            </label>
        </div>
        <div class="field"><!--placeholder div to keep spacing of sync toggle looking nice--></div>
        <div class="submitForm">
            <!--<div class="field" id="saves">
              <button type="submit" class="primary" @click="sync">Save &amp; Sync</button>
            </div>-->
            <!--<div v-if="newEvent.syncing" class="field" id="save">
                <button type="submit" class="primary">Save</button>
            </div>
            <div v-if="!newEvent.syncing" class="field" id="save">
                <button type="submit" class="primary">Save</button>
            </div>
                OLD BUTTONS ABOVE. removed the text change (Sync) <- -> (Save & Sync), so no need to have the v-if/v-else condition-->
            <div class="field" id="save">
                <button type="submit" class="primary">Save</button>
            </div>
            <div class="field" id="cancel">
                <button type="button" class="cancel" @click="cancel">Cancel</button>
            </div>
        </div>
    </form>
</template>

<script>
    import { createNewEvent } from "../services/graph";
    import { signIn, getEmail } from "../services/auth";
    export default {
        name: "AddEvent",
        data() {
            return {
                newEvent: {
                    name: "",
                    date: "",
                    time: "",
                    endTime: "",  //we added this
                    notes: "",
                    recurringEvent: "",
                    syncing: true,
                    endRepeat: "",
                },
                calendarEmail: false
            };
        },
        created() {
            const vm = this;
            vm.calendarEmail = getEmail();
            vm.recurringEvent = "Never";
        },
        methods: {
            createEvent() {
                const vm = this;
                console.log("in createEvent");//debugging press "shift + ctrl + J" to see console
                if (this.newEvent.syncing) {
                    console.log("calling sync from createEvent");//debugging
                    this.sync();
                }
                vm.$emit("create-event", vm.newEvent);
            },
            changeRecurringEvent(e) {
                const vm = this;
                vm.newEvent.recurringEvent = e.value;
            },
            changeSyncing(e) {
                const vm = this;
                vm.newEvent.syncing = e.value;
            },
            cancel() {
                const vm = this;
                vm.$emit("cancel-event");
            },
            async sync() {
                const vm = this;
                //check here if logged in
                if (vm.calendarEmail == false) {
                    //log in first
                    const response = await signIn();
                    vm.calendarEmail = response;
                }

                console.log(vm.calendarEmail);
                createNewEvent(vm.newEvent.name, vm.newEvent.date, vm.newEvent.time, vm.newEvent.endTime, vm.newEvent.notes);
            },
            recurringSync() {
                //  using end date, calculates the number of times an event must be created


            }
        }
    };
</script>

<style scoped>
        #customEvent {
            margin-top: 0;
        }

        .submitForm .field {
            float: none;
            display: inline-block;
            margin-bottom: 0;
        }
        /* #repeat {
      margin-bottom: 0;
    } */

        #repeatEnd {
            margin-bottom: 0;
            padding: 0 0 0 16px;
        }

        #syncingToggle {
            width: auto;
            float: left;
        }

        #save {
            width: auto;
            float: right;
        }

            #save .primary {
                width: 70px;
            }

        #cancel .primary {
            width: 70px;
        }

        #cancel {
            width: auto;
            float: right;
            margin-right: 21px;
        }
</style>

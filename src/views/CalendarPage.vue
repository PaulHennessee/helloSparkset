<template>
    <div>
        <h1>Calendar</h1>
        <div>
            <ClientFilter :client-options="clientOptions"
                          :note="newNote"
                          :callback="fetchCalendars"
                          :key="lastAddedNote.id" />
        </div>
        <div v-if="creatingCustomEvent" class="field">
            <AddEventMultipleClient @cancel-event="cancel" @create-event="calendarCreateEvent" />
        </div>
        <table>
            <tr>
                <td colspan="1">
                    <button class="primary" @click="creatingCustomEvent = true">
                        Create Custom Event
                    </button>
                </td>
                <!--<td colspan="5">
                <MonthDisplay />
            </td>-->
                <td colspan="1">
                    <button>
                        &lt;
                    </button>
                </td>
                <td colspan="2">
                    <label>
                        February
                    </label>
                </td>
                <td colspan="1">
                    <button>
                        &gt;
                    </button>
                </td>
                <td colspan="1">
                    <EventSync :events="suggestedEvents" />
                </td>
            </tr>
        </table>
    </div>
</template>

<script>
import AV from "leancloud-storage";
import ClientFilter from "@/components/ClientFilter.vue";
import EventSync from "@/components/EventSync.vue";
//import MonthDisplay from "@/components/MonthDisplay.vue";
import AddEventMultipleClient from "@/components/AddEventMultipleClient.vue";
    import createEvent from "@/components/ClientEvents.vue";
    //import fetchClientOptions from "@/components/ClientEvents.vue";
export default {
  name: "CalendarPage",
  components: {
      ClientFilter,
      EventSync,
      //MonthDisplay,
      AddEventMultipleClient
  },
  data() {
    return {
      clientOptions: [],
      suggestedEvents: [],
      creatingCustomEvent: false,
      lastAddedNote: new AV.Object("Note").set("clients", []),
      newNote: new AV.Object("Note").set("clients", []),
      notes: []
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
    fetchCalendars() {
        //update the calendar to display these people. AND ONLY THESE PEOPLE. -> empty calendar, showCalendar
        /*const vm = this;
        const noteQuery = new AV.Query("Note");
        noteQuery
            .equalTo("owner", AV.User.current())
            .include("clients")
            .descending("createdAt")
            .limit(1000)
            .find()
            .then(notes => {
                vm.notes = notes.map(note => ({
                    note,
                    editing: false
                }));
                vm.tagOptions = Array.from(
                    new Set(
                        notes.reduce(
                            (accumulator, note) => [...accumulator, ...note.get("tags")],
                            []
                        )
                    )
                ).map(tag => ({ name: tag }));
            })
            .catch(error => {
                alert(error);
            });
        console.log(vm.lastAddedNote);*/
    },
    fetchEvents() {
        const vm = this;
        const innerClientQuery = new AV.Query("Event");
        innerClientQuery.equalTo(
            "client",
            AV.Object.createWithoutData("Client", vm.$route.params.id)
        );
        const innerCompanyQuery = new AV.Query("Event");
        innerCompanyQuery.equalTo("company", vm.company);
        AV.Query.or(innerClientQuery, innerCompanyQuery)
            .notEqualTo("time", null)
            .equalTo("done", false)
            .include("client")
            .limit(1000)
            .find()
            .then(upcomingEvents => {
                vm.upcomingEvents = upcomingEvents.map(event => ({
                    event,
                    editing: false,
                    pendingChanges: {
                        date: `${event.get("time").getFullYear()}-${`0${event
                            .get("time")
                            .getMonth() + 1}`.slice(-2)}-${`0${event
                                .get("time")
                                .getDate()}`.slice(-2)}`,
                        time: `${`0${event.get("time").getHours()}`.slice(
                            -2
                        )}:${`0${event.get("time").getMinutes()}`.slice(-2)}`
                    }
                }));
            })
            .catch(error => {
                alert(error);
            });
        AV.Query.or(innerClientQuery, innerCompanyQuery)
            .notEqualTo("time", null)
            .equalTo("done", true)
            .exists("recursIn")
            .include("client")
            .limit(1000)
            .find()
            .then(lastEvents => {
                vm.suggestedEvents = lastEvents.map(lastEvent => {
                    const rawTime = new Date(
                        new Date(lastEvent.get("time")).setDate(
                            lastEvent.get("time").getDate() + lastEvent.get("recursIn")
                        )
                    );
                    return {
                        event: new AV.Object("Event")
                            .set("name", lastEvent.get("name"))
                            .set("client", lastEvent.get("client"))
                            .set("recursIn", lastEvent.get("recursIn")),
                        editing: true,
                        pendingChanges: {
                            date: `${rawTime.getFullYear()}-${`0${rawTime.getMonth() +
                                1}`.slice(-2)}-${`0${rawTime.getDate()}`.slice(-2)}`,
                            time: `${`0${rawTime.getHours()}`.slice(
                                -2
                            )}:${`0${rawTime.getMinutes()}`.slice(-2)}`
                        },
                        lastEvent
                    };
                });
            })
            .catch(error => {
                alert(error);
            });
        AV.Query.or(innerClientQuery, innerCompanyQuery)
            .notEqualTo("time", null)
            .equalTo("done", true)
            .include("client")
            .limit(1000)
            .find()
            .then(pastEvents => {
                vm.pastEvents = pastEvents.map(event => ({
                    event,
                    editing: false,
                    pendingChanges: {
                        date: `${event.get("time").getFullYear()}-${`0${event
                            .get("time")
                            .getMonth() + 1}`.slice(-2)}-${`0${event
                                .get("time")
                                .getDate()}`.slice(-2)}`,
                        time: `${`0${event.get("time").getHours()}`.slice(
                            -2
                        )}:${`0${event.get("time").getMinutes()}`.slice(-2)}`
                    }
                }));
            })
            .catch(error => {
                alert(error);
            });
    },
    calendarCreateEvent(newEvent) {
        createEvent(newEvent);
    },
    /*createEvent(newEvent) {
        const vm = this;
        const client = AV.Object.createWithoutData("Client", vm.$route.params.id);
        const event = new AV.Object("Event");
        event
            .set("client", client)
            .set("name", newEvent.name)
            .set(
                "time",
                new Date(
                    newEvent.date.slice(0, 4),
                    newEvent.date.slice(5, 7) - 1,
                    newEvent.date.slice(8, 10),
                    newEvent.time.slice(0, 2),
                    newEvent.time.slice(3, 5),
                    0
                )
            )
            .set("notes", newEvent.notes);
        if (newEvent.recurringEvent) {
            event.set("recursIn", newEvent.daysBetween);
        }
        event
            .save()
            .then(() => {
                alert("Event created.");
                vm.fetchEvents();
                vm.creatingCustomEvent = false;
            })
            .catch(error => {
                alert(error);
            });
    },*/
    cancel() {
        const vm = this;
        vm.creatingCustomEvent = false;
    }
},
  created() {
    const vm = this;
    //vm.fetchNotes();
    vm.fetchClientOptions();
  },
  computed: {
    
  }
};
</script>

<style scoped></style>

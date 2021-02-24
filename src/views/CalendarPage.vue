<template>
    <div>
        <h1>Calendar</h1>
        <table>
            <tr>
                <td>
                    <ClientFilter :client-options="clientOptions"
                                    :note="newNote"
                                    :callback="fetchCalendars"
                                    :key="lastAddedNote.id" />
                </td>
                <td>
                    <MonthDisplay />
                </td>
                <td>
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
    import MonthDisplay from "@/components/MonthDisplay.vue";
export default {
  name: "CalendarPage",
  components: {
      ClientFilter,
      EventSync,
      MonthDisplay
  },
  data() {
    return {
        clientOptions: [],
        suggestedEvents: [],
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

<template>
    <div>
        <h1>Client Filter</h1>
        <table>
            <tr>
                <td>
                    <ClientFilter :client-options="clientOptions"
                                    :note="newNote"
                                    :callback="addNote"
                                    :key="lastAddedNote.id" />
                </td>
                <td>
                    <MonthDisplay />
                </td>
                <td>
                    <div class="field field--superwide">
                        <EventSync :events="suggestedEvents" />
                    </div>
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
      tagOptions: [],
      lastAddedNote: new AV.Object("Note").set("clients", []).set("tags", []),
      newNote: new AV.Object("Note").set("clients", []).set("tags", []),
      notes: []
    };
  },
methods: {
     
},
  created() {
    //const vm = this;
    //vm.fetchNotes();
    //vm.fetchClientOptions();
  },
  computed: {
    
  }
};
</script>

<style scoped></style>

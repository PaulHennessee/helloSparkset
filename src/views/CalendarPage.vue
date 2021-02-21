<template>
    <div>
        <div class="column">
            <div class="card">
                <section class="fields">
                    <h1>Client Filter</h1>
                    <ClientFilter :client-options="clientOptions"
                              :tag-options="tagOptions"
                              :note="newNote"
                              :callback="addNote"
                              :key="lastAddedNote.id" />
                </section>
            </div>
        </div>
    </div>
</template>

<script>
import AV from "leancloud-storage";
import ClientFilter from "@/components/ClientFilter.vue";
export default {
  name: "CalendarPage",
  components: {
    ClientFilter
  },
  data() {
    return {
      clientOptions: [],
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

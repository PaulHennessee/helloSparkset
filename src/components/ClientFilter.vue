<template>
    <form @submit.prevent="go">
        <!--<link href="multiselect.css" rel="stylesheet">
        <div class="field">
            <label for="clients"> Select Client(s):</label>
            <select name="clients" id="clients" multiple>
                <option value="all">All</option>
                <option value="second">Second</option>
                <option value="third">Third</option>
            </select>
        </div>-->
        <div class="field"> 
            <label>
                <multiselect v-model="clients"
                             placeholder="Search"
                             label="name"
                             track-by="id"
                             :options="clientOptions"
                             :multiple="true"
                             :hide-selected="true"></multiselect>
            </label>
        </div>
    </form>
</template>

<!--<script src="multiselect.min.js"></script>-->
<!--<embed src="document.multiselect('#clients')">-->

<script>
    import AV from "leancloud-storage";
    import Multiselect from "vue-multiselect";
    export default {
        name: "ClientFilter",
        components: {
            Multiselect
        },
        props: {
            clientOptions: Array,
            note: AV.Object,
            callback: Function
        },
        data() {
            return {
                title: "",
                content: "",
                clients: []
            };
        },
        methods: {
            go() {
                const vm = this;
                vm.note
                    .set("title", vm.title)
                    .set("content", vm.content)
                    .set(
                        "clients",
                        vm.clients.map(client => client.client)
                    )
                    .save()
                    .then(vm.callback)
                    .catch(error => {
                        alert(error);
                    });
            }
        },
        created() {
            const vm = this;
            //document.multiselect('#testSelect1'); // put this in somehow?
            vm.title = vm.note.get("title");
            vm.content = vm.note.get("content");
            vm.clients = vm.note.get("clients").map(client => ({
                name: client.get("fullName"),
                id: client.id,
                client
            }));
        }
    };
</script>

<!--<style src="vue-multiselect/dist/vue-multiselect.min.css"></style>-->

<style>

    .multiselect__tags,
    .multiselect__tag,
    .multiselect__tag-icon {
        border-radius: 2px;
    }

    .multiselect__tag {
        padding: 4px 24px 4px 8px;
        background-color: #36d5d822;
        color: #36d5d8;
        line-height: unset;
        font-size: 9pt;
    }

    .multiselect__tag-icon {
        border-radius: 0;
        line-height: 24px;
    }

        .multiselect__tag-icon:hover {
            background-color: #36d5d8;
        }

        .multiselect__tag-icon::after {
            color: #36d5d8;
        }

    .multiselect__content * {
        transition: unset;
    }

    .multiselect__content-wrapper {
        position: relative;
        border-radius: 0 0 2px 2px;
    }

    .multiselect__option--highlight,
    .multiselect__option--highlight::after {
        background-color: #36d5d8;
    }
</style>

<style scoped></style>

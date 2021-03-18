<template>
    <table>
        <tr>
            <td colspan="1">
                <button>
                    prev
                </button>
            </td>
            <td colspan="2">
                <label>
                    February
                </label>
            </td>
            <td colspan="1">
                <button>
                    next
                </button>
            </td>
        </tr>
    </table>
</template>

<script>
    //import AV from "leancloud-storage";
    //import Multiselect from "vue-multiselect";
    export default {
        name: "MonthDisplay",
        components: {
            //Multiselect
        },
        props: {
            
        },
        data() {
            
        },
        methods: {
            
        },
        created() {
            
        }
    };
</script>

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

<template>
  <v-card flat>
    <StaffCreateEdit @edited="fetch" @created="fetch" v-model="staffDialog" :id="selectedId"/>
    <v-card-title class="tw-justify-between">
      <div class="tw-flex tw-space-x-2 tw-items-end">
        <v-text-field
          hide-details
          label="Search.."
          single-line
          clearable
          dense
          outlined
          prepend-inner-icon="mdi-magnify"
          v-model:trim="search"></v-text-field>
        <v-btn outlined color="primary" @click="showDialog(null)">Add Staff</v-btn>
      </div>
      <v-btn color="primary" icon @click="fetch">
        <v-icon>mdi-refresh</v-icon>
      </v-btn>
    </v-card-title>
    <v-card-text>
      <v-data-table
        dense
        :hide-default-footer="true"
        :headers="headers"
        :items="items"
        :items-per-page="5"
        :loading="loading"
        :server-items-length="total"
        :options.sync="options"
        :sort-desc="true">

        <template v-slot:top="{pagination, options, updateOptions}">
          <v-data-footer
            :pagination="pagination"
            :options="options"
            @update:options="updateOptions"
            items-per-page-text="$vuetify.dataTable.itemsPerPageText"/>
        </template>

        <template v-slot:item.name="{item}">
          <div class="tw-py-2 tw-flex tw-space-x-2 tw-items-center">
            <v-badge bottom bordered dot color="success" :value="true" offset-y="12" offset-x="12">
              <v-avatar>
                <v-icon size="50" class="tw-bg-gray-200">mdi-account</v-icon>
              </v-avatar>
            </v-badge>
            <div class="tw-font-bold tw-text-gray-700"> {{ item.name }}</div>
          </div>
        </template>


        <template v-slot:item.role="{item}">
          {{ rolesByKey[item.role] }}
        </template>

        <template v-slot:item.active="{item}">
          <v-icon :color="item.active?'success':'grey'">
            {{ item.active ? 'mdi-check-circle' : 'mdi-close-circle' }}
          </v-icon>
        </template>

        <template v-slot:item.actions={item}>
          <v-btn icon color="primary"
                 @click="showDialog(item.id)">
            <v-icon small>mdi-pencil</v-icon>
          </v-btn>
        </template>

        <template v-slot:item.created_at={item}>
          <div class="tw-text-end">
            <div class="tw-text-xs tw-text-gray-700">{{ $moment(item.created_at).format('MMM DD, YYYY') }}</div>
            <div class="tw-text-xs tw-text-gray-700">{{ $moment(item.created_at).fromNow() }}</div>
          </div>
        </template>
      </v-data-table>
    </v-card-text>
  </v-card>
</template>

<script>
import {debounce} from 'lodash'
import {currentTimezone} from "../../../utils/helpers";
import StaffCreateEdit from "../../../components/staff/StaffCreateEdit.vue";
import {rolesByKey} from "../../../utils/constants";

export default {
  name: "IndexPage",
  components: {StaffCreateEdit},
  middleware: ['auth'],

  data() {
    return {
      items: [],
      headers: [
        {text: 'Name', align: 'start', sortable: false, value: 'name'},
        {text: 'Role', align: 'start', sortable: false, value: 'role'},
        {text: 'Active', align: 'start', sortable: false, value: 'active'},
        {text: 'Actions', align: 'start', sortable: false, value: 'actions'},
        {text: 'Created At', align: 'end', sortable: false, value: 'created_at'},
      ],
      search: '',

      loading: false,
      total: 0,
      filters: {},
      options: {itemsPerPage: 15},
      range: [],
      staffDialog: false,
      selectedId: null
    }
  },

  computed: {
    rolesByKey() {
      return rolesByKey
    }
  },

  watch: {
    options: {
      handler() {
        this.fetch()
      },
      deep: true,
    },
    staffDialog: function (newVal) {
      if (!newVal) {
        this.selectedId = null
      }
    },
    filters: {
      handler() {
        this.fetch()
      },
      deep: true
    },
    search: debounce(function () {
      this.fetch()
    }, 500)
  },

  methods: {
    showDialog(id) {
      this.selectedId = id
      this.staffDialog = true
    },
    fetch() {
      const params = {
        ...this.$optionsToParams(this.options),
        search: this.search,
        filters: this.filters,
      }
      this.loading = true
      this.$axios.get('/backend/api/users', {params})
        .then(resp => {
          this.items = resp.data.data
          this.total = resp.data.meta.total
          this.loading = false
        }).catch(error => this.loading = false)
    },
  }
}
</script>

<style scoped>
</style>

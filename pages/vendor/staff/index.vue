<template>
  <v-card elevation="4">
    <v-data-table
      dense
      :hide-default-footer="true"
      :headers="headers"
      :items="items"
      :items-per-page="5"
      :loading="loading"
      :server-items-length="total"
      :options.sync="options"
      selectable-key="id"
      show-select
      :sort-desc="true">

      <template v-slot:top="{pagination, options, updateOptions}">
        <v-toolbar dense>
          <v-toolbar-items class="tw-w-full tw-gap-1">
            <v-text-field
              hide-details
              label="Search"
              single-line
              class="mt-2"
              clearable
              prepend-inner-icon="mdi-magnify"
              v-model:trim="search"></v-text-field>

            <v-spacer/>
            <v-btn color="primary" icon @click="fetch">
              <v-icon>mdi-refresh</v-icon>
            </v-btn>
          </v-toolbar-items>
        </v-toolbar>
        <v-data-footer
          :pagination="pagination"
          :options="options"
          @update:options="updateOptions"
          items-per-page-text="$vuetify.dataTable.itemsPerPageText"/>
      </template>

      <template v-slot:item.actions={item}>
        <v-btn text small link color="primary" @click="resend(item.id)">Resend Email</v-btn>
        <v-btn icon color="error"
               @click="destroy(item.id)">
          <v-icon small>mdi-delete</v-icon>
        </v-btn>
      </template>

      <template v-slot:item.created_at={item}>
        {{ $moment(item.created_at).format('YYYY-MM-DD hh:mm A') }}
        <span class="tw-ml-4 tw-text-xs">{{ $moment(item.created_at).fromNow() }}</span>
      </template>
    </v-data-table>
  </v-card>
</template>

<script>
import {debounce} from 'lodash'
import {currentTimezone} from "../../../utils/helpers";

export default {
  name: "IndexPage",
  middleware: ['auth'],

  data() {
    return {
      items: [],
      headers: [
        {text: 'Name', align: 'start', sortable: false, value: 'name'},
        {text: 'Role', align: 'start', sortable: false, value: 'role'},
        {text: 'Created At', align: 'start', sortable: false, value: 'created_at'},
      ],
      search: '',

      loading: false,
      total: 0,
      filters: {},
      options: {itemsPerPage: 15},
      range: []

    }
  },

  watch: {
    options: {
      handler() {
        this.fetch()
      },
      deep: true,
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
    fetch() {
      const params = {
        ...this.$optionsToParams(this.options),
        search: this.search,
        filters: this.filters,
      }
      this.loading = true
      this.$axios.get('/backend/api/staff', {params})
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

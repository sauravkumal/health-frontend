<script>
import {defineComponent} from 'vue'
import {debounce} from "lodash";
import {handleError} from "../../utils/helpers";

export default defineComponent({
  name: "index",
  middleware: 'auth',
  head() {
    return {
      title: 'Users'
    }
  },
  data() {
    return {
      items: [],
      headers: [
        {text: 'Telegram ID', align: 'start', sortable: false, value: 'telegram_id'},
        {text: 'Display Name', align: 'start', sortable: false, value: 'display_name'},
        {text: 'First Name', align: 'start', sortable: false, value: 'first_name'},
        {text: 'Last Name', align: 'start', sortable: false, value: 'last_name'},
        {text: 'Username', align: 'start', sortable: false, value: 'username'},
        {text: 'Age', align: 'start', sortable: false, value: 'age'},
        {text: 'Gender', align: 'start', sortable: false, value: 'gender'},
        {text: 'Actions', align: 'start', sortable: false, value: 'actions'},
      ],
      search: '',
      loading: false,
      total: 0,
      filters: {},
      options: {itemsPerPage: 15},
    }
  },
  watch: {
    options: {
      handler() {
        this.fetchData()
      },
      deep: true,
    },
    filters: {
      handler() {
        this.fetchData()
      },
      deep: true
    },
    search: debounce(function () {
      this.fetchData()
    }, 500)
  },
  methods: {
    fetchData() {
      const params = {
        ...this.$optionsToParams(this.options),
        search: this.search,
        filters: this.filters,
      }
      this.loading = true
      this.$axios.get('/backend/api/telegramUsers', {params})
        .then(resp => {
          this.items = resp.data.data
          this.total = resp.data.meta.total
          this.loading = false
        }).catch(error => this.loading = false)
    },
    destroy(id) {
      if (window.confirm('Are you sure you want to remove this user?')) {
        this.$axios.delete('/backend/api/telegramUsers/' + id)
          .then(resp => {
            this.$root.$emit('toast', {text: 'User removed', type: 'success'})
            this.fetchData()
          }).catch(error => {
          handleError(error, this, this.$refs.validator)
        })
      }
    }
  }
})
</script>

<template>
  <v-card outlined>
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
        <div class="tw-flex tw-gap-4 tw-m-2">
          <v-text-field
            hide-details
            label="Search"
            single-line
            clearable
            outlined
            dense
            prepend-inner-icon="mdi-magnify"
            v-model:trim="search"></v-text-field>
          <v-spacer/>
          <v-btn small color="primary" icon @click="fetchData">
            <v-icon>mdi-refresh</v-icon>
          </v-btn>
        </div>
        <v-data-footer
          :pagination="pagination"
          :options="options"
          @update:options="updateOptions"
          items-per-page-text="$vuetify.dataTable.itemsPerPageText"/>
      </template>

      <template v-slot:item.actions={item}>
        <v-btn icon small color="error"
               @click="destroy(item.id)">
          <v-icon small>mdi-delete</v-icon>
        </v-btn>
      </template>
    </v-data-table>
  </v-card>
</template>

<style scoped>

</style>

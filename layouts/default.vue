<template>
  <v-app dark>
    <v-navigation-drawer
      v-model="drawer"
      :mini-variant="false"
      :clipped="true"
      fixed
      width="230"
      app
    >
      <v-list shaped dense>
        <template v-for="(item,index) in items">
          <template v-if="item.divider">
            <v-divider/>
          </template>
          <template v-else-if="item.children">
            <v-list-group>
              <template v-slot:activator>
                <v-list-item-action>
                  <v-icon>{{ item.icon }}</v-icon>
                </v-list-item-action>
                <v-list-item-content>
                  <v-list-item-title v-text="item.title"/>
                </v-list-item-content>
              </template>
              <template v-for="(subItem, index2) in item.children">
                <v-list-item v-if="subItem.to" dense :to="subItem.to"
                             :key="'sub'+index2.toString()">
                  <v-list-item-icon class="ml-4">
                    <v-icon>{{ subItem.icon }}</v-icon>
                  </v-list-item-icon>
                  <v-list-item-title v-text="subItem.title"/>
                </v-list-item>
                <v-list-item v-else-if="subItem.href" dense :href="subItem.href" target="_blank"
                             :key="'sub'+index2.toString()">
                  <v-list-item-icon class="ml-4">
                    <v-icon>{{ subItem.icon }}</v-icon>
                  </v-list-item-icon>
                  <v-list-item-title v-text="subItem.title"/>
                </v-list-item>
              </template>
            </v-list-group>
          </template>
          <template v-else>
            <v-list-item
              v-if="item.to"
              dense
              :key="index"
              :to="item.to"
              router
              exact
            >
              <v-list-item-action>
                <v-icon>{{ item.icon }}</v-icon>
              </v-list-item-action>
              <v-list-item-content>
                <v-list-item-title v-text="item.title"/>
              </v-list-item-content>
            </v-list-item>
            <v-list-item
              v-else-if="item.href"
              dense
              :key="index"
              :href="item.href"
              target="_blank"
              router
              exact
            >
              <v-list-item-action>
                <v-icon>{{ item.icon }}</v-icon>
              </v-list-item-action>
              <v-list-item-content>
                <v-list-item-title v-text="item.title"/>
              </v-list-item-content>
            </v-list-item>
          </template>
        </template>
      </v-list>
    </v-navigation-drawer>
    <v-navigation-drawer
      v-model="notificationDrawer"
      app
      temporary
      fixed
      right
      width="350"
    >
    </v-navigation-drawer>

    <v-app-bar
      :clipped-left="true"
      color="primary"
      fixed
      app
      dark
      flat
      dense
    >
      <v-app-bar-nav-icon @click.stop="drawer = !drawer"/>
      <v-toolbar-title>{{ $auth.user.name }}
      </v-toolbar-title>
      <v-spacer/>

      <v-menu offset-y>
        <template v-slot:activator="{ on, attrs }">
          <v-btn icon v-bind="attrs" v-on="on">
            <v-icon>mdi-dots-vertical</v-icon>
          </v-btn>
        </template>
        <v-card width="300" flat>
          <v-card-title>
            <div class="tw-flex tw-items-center tw-gap-x-2">
              <div>
                <v-avatar size="50">
                  <v-icon size="62">mdi-account</v-icon>
                </v-avatar>
              </div>
              <div>
                <div class="text-h6">{{ $auth.user.name }}</div>
                <div class="text-body-1">{{ $auth.user.display_role }}</div>
                <div class="text-body-2">{{ $auth.user.email }}</div>
              </div>
            </div>
          </v-card-title>
        </v-card>
        <v-divider/>
        <v-list>
          <v-list-item link dense>
            <v-list-item-icon>
              <v-icon>mdi-account</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title>Profile
              </v-list-item-title>
            </v-list-item-content>
          </v-list-item>
          <v-list-item dense link @click="logout">
            <v-list-item-icon>
              <v-icon>mdi-logout</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title>Logout</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </v-menu>

    </v-app-bar>
    <v-main>
      <Nuxt/>
    </v-main>
    <v-snackbar v-model="snackbar" :color="snackbarColor" app>
      {{ snackbarText }}
      <template v-slot:action="{ attrs }">
        <v-btn
          v-bind="attrs"
          @click="snackbar = false"
          icon
        >
          <v-icon>mdi-window-close</v-icon>
        </v-btn>
      </template>
    </v-snackbar>
  </v-app>
</template>

<script>

export default {
  name: 'DefaultLayout',
  layout: 'default',
  data() {
    return {
      notificationDrawer: false,
      drawer: !this.$vuetify.breakpoint.smAndDown,
      adminItems: [
        {
          icon: 'mdi-home',
          title: 'Dashboard',
          to: '/'
        },
      ],

      vendorItems: [
        {
          icon: 'mdi-home',
          title: 'Dashboard',
          to: '/'
        },
        {
          icon: 'mdi-home',
          title: 'Menu',
          to: '/vendor/menu'
        },
        {
          icon: 'mdi-account-group-outline',
          title: 'Staff',
          to: '/vendor/staff'
        },
        {
          icon: 'mdi-account-cog',
          title: 'Settings',
          to: '/vendor/settings'
        },
      ],

      snackbar: false,
      snackbarColor: undefined,
      snackbarText: '',
    }
  },
  computed: {
    items() {
      const role = this.$auth.user.role
      const type = this.$auth.user.type
      if (role === 'vendor') {
        return this.vendorItems
      }
      return this.adminItems
    },
  },

  watch: {
    searchItem: function (newVal) {
      if (newVal && newVal.to) {
        this.$router.push(newVal.to)
      }
    },
  },
  created() {
    this.$root.$on('toast', (event) => {
      this.handleToast(event)
    })
  },

  methods: {
    async logout() {
      await this.$auth.logout()
    },
    handleToast(params) {
      this.snackbarText = params.text
      switch (params.type) {
        case 'success':
          this.snackbarColor = 'success'
          break
        case 'error':
          this.snackbarColor = 'error'
          break
        case 'warning':
          this.snackbarColor = 'warming'
          break
        default:
          this.snackbarColor = undefined
      }
      this.snackbar = true
    },
  }
}
</script>

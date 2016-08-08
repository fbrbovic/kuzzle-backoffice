import Vue from 'vue'
import Vuex from 'vuex'
import auth from './modules/auth/store'
import data from './modules/data/store'
import list from './modules/list/store'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    auth,
    list,
    data
  },
  strict: process.env.NODE_ENV !== 'production'
})

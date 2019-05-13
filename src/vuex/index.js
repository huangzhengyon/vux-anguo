import Vue from 'vue'
import 'es6-promise'
import Vuex from 'vuex'

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    oaFooter: {
      state: {
        choose: 0,
        show: true
      },
      mutations: {
        increment (state, params) {
          state.choose = params.choose;
          state.show = params.show;
        }
      },
      actions: {
        increment (context, params) {
          context.commit('increment',params)
        }
      }
    },
    vux: {
      state: {
        isLoading: false
      },
      mutations: {
        updateLoadingStatus (state, payload) {
          state.isLoading = payload.isLoading
        }
      }
    }
  }
});

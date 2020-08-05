<template>
  <div>
    <div v-if="state.loggedIn">
      <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
        <div class="container-fluid">
          <a class="navbar-brand" href="#">Cozy PoS</a>
          <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
            <span class="navbar-toggler-icon"></span>
          </button>
          <div class="collapse navbar-collapse" id="navbarSupportedContent">
            <ul class="navbar-nav mr-auto mb-2 mb-lg-0">
              <li class="nav-item">
                <router-link class="nav-link" to="/">Transaction</router-link>
              </li>
              <li class="nav-item">
                <router-link class="nav-link" to="/projects">Project</router-link>
              </li>
              <li class="nav-item">
                <router-link class="nav-link" to="/items">Item</router-link>
              </li>
              <!-- <li class="nav-item">
                <a class="nav-link active" aria-current="page" href="#">Home</a>
              </li>
              <li class="nav-item">
                <a class="nav-link" href="#">Link</a>
              </li>
              <li class="nav-item dropdown">
                <a class="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-toggle="dropdown" aria-expanded="false">
                  Dropdown
                </a>
                <ul class="dropdown-menu" aria-labelledby="navbarDropdown">
                  <li><a class="dropdown-item" href="#">Action</a></li>
                  <li><a class="dropdown-item" href="#">Another action</a></li>
                  <li><hr class="dropdown-divider"></li>
                  <li><a class="dropdown-item" href="#">Something else here</a></li>
                </ul>
              </li>
              <li class="nav-item">
                <a class="nav-link disabled" href="#" tabindex="-1" aria-disabled="true">Disabled</a>
              </li> -->
            </ul>
            <form class="d-flex">
              <!-- <input class="form-control mr-2" type="search" placeholder="Search" aria-label="Search"> -->
              <button 
                class="btn btn-danger"
                @click="handleLogout"
              >
                Logout
              </button>
            </form>
          </div>
        </div>
      </nav>
      <router-view v-if="state.loggedIn" />
    </div>
    <login @pressLogin="handlePressLogin" :onLogin="handleLogin" myComponent="Test Prop" v-else />
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, watch } from 'vue';
import Login from './components/Login.vue'

export default defineComponent({
  name: 'App',
  components: {
    Login
  },
  setup() {
    const state = reactive({
      loggedIn: false,
      testProp: `a`
    })

    // const handleIncrementTestProp = () => {
    //   state.testProp = `${state.testProp}a`
    // }

    const handleLogin = (username: string, password: string) => {
      state.testProp = `${state.testProp}a`
      state.loggedIn = true
      console.log('onLogin', username, password)
    }

    const handleLogout = () => {
      state.loggedIn = false
    }

    const handlePressLogin = () => {
      console.log('Emit press login!')
    }

    return {
      state,
      // Funcs
      handleLogin,
      handleLogout,
      handlePressLogin
    }
  }
});
</script>

<template>
  <div class="d-flex flex-column justify-content-center align-items-center bg-dark" style="height: 100vh; width: 100vw">
    <div class="text-light">
      <h1>Login ({{ props.myComponent }}) </h1>
    </div>
    <div class="text-light">Login</div>
    <div>
      <button 
        class="btn btn-primary"
        @click="handleLogin"
      >
        Login
      </button>
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent } from 'vue'
export default defineComponent({
  name: 'login',
  props: {
    onLogin: Function as (username: string, password: string) => void,
    myComponent: String
  },
  setup(props, ctx) {
    const handleLogin = () => {
      ctx.emit('pressLogin', 'test')
      props.onLogin('testusername', 'testpassword') 
    }

    return {
      props,
      // Funcs
      handleLogin
    }
  }
})
</script>
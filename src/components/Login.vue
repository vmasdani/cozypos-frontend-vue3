<template>
  <div class="bg-gray-700 h-screen flex items-center justify-center">
    <div class="shadow-2xl flex flex-col items-center bg-white rounded-lg p-5">
      <div class="text-xl font-bold">Cozy PoS</div>
      <div>
        <input 
          class="shadow bg-gray-200 appearance-none border text-center text-gray-700 rounded w-full p-2 leading-tight my-3 focus:outline-none focus:shadow-outline font-bold" 
          type="text"
          placeholder="Username..."
          @input="changeUsername"
          :value="state.username"
        />
      </div>
      <div>
        <input 
          class="shadow bg-gray-200 appearance-none border text-center text-gray-700 rounded w-full p-2 leading-tight my-3 focus:outline-none focus:shadow-outline font-bold" 
          type="password" 
          placeholder="Password..." 
          @input="changePassword"
          :value="state.password"
        />
      </div>
      <div>
        <button 
          class="shadow bg-gray-500 text-white hover:bg-gray-600 font-bold p-2 rounded-lg"
          @click="handleLogin"
        >
          Login
        </button>
      </div>
    </div> 
  </div>
</template>
<script lang="ts">
import { defineComponent, reactive } from 'vue'
export default defineComponent({
  name: 'login',
  props: {
    onLogin: Function as (username: string, password: string) => void,
    myComponent: String
  },
  setup(props, ctx) {
    const state = reactive({
      username: "",
      password: "",
      apiKey: ""
    })

    const changeUsername = (e: any) => {
      state.username = e.target.value.trim()
    }

    const changePassword = (e: any) => {
      state.password = e.target.value.trim()
    }

    const handleLogin = () => {
      ctx.emit('pressLogin', 'test')
      props.onLogin('testusername', 'testpassword') 
    }

    return {
      props,
      state,
      // Funcs
      changeUsername,
      handleLogin
    }
  }
})
</script>
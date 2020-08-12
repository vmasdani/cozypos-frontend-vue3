<template>
  <div>
    <div class="flex m-2 items-center">
      <span class="text-2xl font-semibold">Items</span>
      <loading-icon v-if="state.requestStatus === 'Loading'" class="text-2xl ml-2" /> 
    </div>
    <div class="m-2">
      {{ state }}
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent, reactive } from 'vue'
import LoadingIcon from '@/components/icons/LoadingIcon.vue'
import { RequestStatus } from '@/helpers'
export default defineComponent({
  components: {
    LoadingIcon
  },
  setup() {
    const state = reactive({
      items: [],
      requestStatus: 'Loading' as RequestStatus
    })

    const fetchItems = async () => {
      try {
        state.requestStatus = 'Loading'

        const response = await fetch(`${process.env.VUE_APP_BASE_URL}/itemstocks`)
        const items = await response.json()

        state.items = items
        state.requestStatus = 'Success'
      } catch(e) {
        console.log(e)
        state.requestStatus = 'Error'
      }
    }

    fetchItems()

    return {
      state
    }
  }
})
</script>
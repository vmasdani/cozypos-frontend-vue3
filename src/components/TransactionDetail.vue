<template>
  <div class="m-2">
    <div class="text-xl font-semibold ">Transaction Detail</div>
    <div v-if="state.project !== null" class="text-lg">For project: {{ state.project.name }}</div>
  </div>
  <!-- <div>
    {{ router }}
  </div> -->
</template>
<script lang="ts">
import Vue, { defineComponent, reactive } from 'vue'
import { RequestStatus } from '@/helpers'
import { useRouter } from 'vue-router'
import { Project } from '@/model'
import ProjectDetailVue from './ProjectDetail.vue'
import { initialTransactionView } from '@/modelinitials'
import { TransactionView } from '@/view'
import { appState } from '@/App.vue'
export default defineComponent({
  setup() {
    const router = useRouter()
    const transactionId = router.currentRoute.value.params?.id as string
    const projectId = router.currentRoute.value.query?.projectId as string
    const isNew = isNaN(parseInt(transactionId))

    const store = appState

    const state = reactive({
      requestStatus: 'NotAsked' as RequestStatus,
      transactionView: { ...initialTransactionView } as TransactionView,
      project: null as Project | null
    })

    const fetchTransaction = async () => {
      try {
        const response =  await fetch(`${store.baseUrl}/transactions/view/${transactionId}`)
        state.transactionView = await response.json()
      } catch(e) {
        console.log(e)
      }
    }

    const fetchProject = async () => {
      try {
        const response = await fetch(`${store.baseUrl}/projects/${projectId}`)
        state.project = await response.json()
      } catch(e) {
        console.log(e)
      } 
    }

    if(!isNew) {
      fetchTransaction()
    }

    fetchProject()

    return  {
      state,
      router
    }
  }
})
</script>
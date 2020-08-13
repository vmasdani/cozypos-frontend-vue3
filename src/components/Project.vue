<template>
  <div class="text-2xl font-semibold m-2">
    Project page
  </div>
  <div>
    <div v-if="state.requestStatus === 'Loading'" class="spinner-border text-primary mx-1">
      <span class="sr-only">Loading...</span>
    </div>
  </div>
  <div>
    <ul class="list-group" v-if="state.projectsView">
      <li v-for="project in state.projectsView.projects" :key="project.id" class="list-group-item">
        <h3>{{ project.project.name }}</h3>
        <h3>{{ formatIdr(project.income) }}</h3>
      </li>
    </ul>
  </div>
</template>
<script lang="ts">
import { defineComponent, reactive } from 'vue'
import { ProjectsView } from '@/view'
import { formatIdr, RequestStatus } from '@/helpers'

export default defineComponent({
  setup() {
    const state = reactive({
      requestStatus: 'NotAsked' as RequestStatus,
      projectsView: null as ProjectsView | null
    })

    const fetchProjectsView = async () => {
      try {
        state.requestStatus = 'Loading'

        const response = await fetch(`${process.env.VUE_APP_BASE_URL}/projectsview`)
        const projectsViewData = await response.json()

        state.projectsView = projectsViewData
        state.requestStatus = 'Success'
      } catch(e) {
        console.log(e)
        state.requestStatus = 'Error'
      }
    }

    fetchProjectsView()

    return {
      state,
      // Funcs
      formatIdr
    }
  }
})
</script>
<template>
  <!-- {{ state }} -->
  <div class="flex items-center">
    <div class="font-semibold text-xl my-2 mx-1">Transactions</div>
    <loading-icon v-if="state.requestStatus === 'Loading'" class="ml-2" /> 
  </div>
  <div class="flex items-center">
    <div class="block uppercase tracking-wide text-gray-700 text-xs font-bold mx-1">Select project:{{ " " }}</div>
    <div class="relative mx-1">
      <select class="block appearance-none w-full bg-gray-200 border border-blue-200 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500">
        <!-- <option>test</option> -->
        <option 
          v-for="project in state.projects" 
          :key="project.id"
          @click="selectProject(project.id)"
        >
          {{ project.name }}
        </option>
      </select>
    </div>
  </div>
  <div class="flex">
    <input
      type="text"
      class="flex-grow m-2 shadow bg-gray-200 border p-2 rounded-lg focus:shadow-outline" 
      v-model="state.searchInput"
      placeholder="Search containing items..." 
    />
  </div> 
  
  <div class="m-2" v-if="state.projectTransactionsView">
    Showing <span class="font-bold">{{ filteredProjectTransactionsView.length }}/{{ state.projectTransactionsView.transactions.length }}</span> transactions
  </div>
  <div class="mt-3">
    <div class="mx-2">
      <div v-for="transactionView in filteredProjectTransactionsView" :key="transactionView.transaction.id" class="list-group-item">
        <router-link :to="`/transactions/${transactionView.transaction.id}`">
          <div class="shadow-lg border-2 border-solid border-blue-200 rounded-lg px-4 py-2">
            <div class="flex justify-between items-center">
              <h3
                :class="`text-2xl font-bold ${comparePriceIsCustomColor(transactionView)}`"
              >
                {{
                  formatIdr(transactionView.transaction.priceIsCustom
                    ? transactionView.transaction.customPrice
                    : transactionView.totalPrice
                  )  
                }}
              </h3>
              <div class="rounded-full shadow-lg text-white bg-gray-600 font-semibold px-2">{{ transactionView.transaction.cashier }}</div>
            </div>
            <div class="text-sm font-bold text-gray-800 uppercase">Orig: {{ formatIdr(transactionView.totalPrice)  }}</div>
            <div class="text-sm font-thin italic">
              {{ 
                transactionView.itemTransactions
                  .map(itemTransaction => `${itemTransaction.item.name} x${itemTransaction.itemTransaction.qty}`)
                  .join(', ')
              }}
            </div>
          </div>
        </router-link>
      </div>
    </div>
  </div>
  <!-- <div>
    <pre>
{{ filteredProjectTransactionsView }}
    </pre>
  </div> -->
</template>
<script lang="ts">
import { defineComponent, reactive, computed } from 'vue'
import { Project } from  '../model'
import { RequestStatus, formatIdr } from '../helpers'
import { ProjectTransactionsView, TransactionView } from '@/view'
import LoadingIcon from '@/components/icons/LoadingIcon.vue'

export default defineComponent({
  components: {
    LoadingIcon
  },
  setup() {
    const state = reactive({
      selectedProject: null as Project | null,
      projects: [] as Project[],
      projectDetails: null,
      projectTransactionsView: null as ProjectTransactionsView | null,
      isLoading: false,
      searchInput: "",
      requestStatus: 'NotAsked' as RequestStatus
    })

    const fetchInitialProject = async () => {
      try {
        state.requestStatus = 'Loading'

        const response = await fetch(`${process.env.VUE_APP_BASE_URL}/projects`)
        const projectsData = (await response.json()) as Project[]

        if(projectsData) {
          state.projects = projectsData
          state.requestStatus = 'Success'
        }
      } catch(e) {
        state.requestStatus = 'Error'
      }
    }

    // Fetch
    fetchInitialProject()

    const selectProject = (id: number) => {
      console.log('Project id:', id)
      fetchProjectTransactionsView(id)
    }

    const comparePriceIsCustomColor = (transactionView: TransactionView) => {
      if(!transactionView.transaction.priceIsCustom) {
        return ''
      } else {
        if(transactionView.totalPrice < transactionView.transaction.customPrice) {
          return 'text-green-500'
        } else {
          return 'text-red-500'
        }
      }
    }

    const fetchProjectTransactionsView = async (id: number) => {
      try {
        state.requestStatus = "Loading"

        const response = await fetch(`${process.env.VUE_APP_BASE_URL}/projects/${id}/transactions`)
        const projectTransactionsView = await response.json()

        state.projectTransactionsView = projectTransactionsView
        state.requestStatus = "Success"
      } catch(e) {
        console.log(e);
        state.requestStatus = "Error"
      }
    }

    const filteredProjectTransactionsView = computed(() => state.projectTransactionsView 
      ? state.projectTransactionsView.transactions
          .filter(transaction => {
            return transaction.itemTransactions
              .map(itemTransaction => itemTransaction.item.name)
              .flat()
              .join('')
              .toLowerCase()
              .includes(state.searchInput)
          })
      : []
    )

    return {
      state,
      filteredProjectTransactionsView,
      // Funcs
      selectProject,
      formatIdr,
      comparePriceIsCustomColor
    }
  },
  // data() {
  //   return {
  //     selectedProject: null,
  //     projects: [],
  //     projectDetails: null,
  //     isLoading: false
  //   }
  // },
  // created() {
  //   console.log('transaction created.')
  //   this.fetchInitialProject()
  // },
  // watch: {
  //   $route(to, from) {
  //     console.log(to, from)
  //   }
  // },
  methods: {
    async fetchInitialProject() {
      try {
        // Fetch currently available projects
        this.isLoading = true
        const projectsResponse = await fetch(`${process.env.VUE_APP_BASE_URL}/projects`, {
          headers: {
            'Authorization' : localStorage.getItem('apiKey')
          }
        })

        if(projectsResponse.status !== 200) {
          this.isLoading = false
          throw "Fetching projects failed"
        }
        const projects = await projectsResponse.json()
        console.log('projects:', projects)

        this.projects = projects.filter(data => data.name !== '')

        let selectedProject = null
        
        if(projects.length > 0) {
          selectedProject = projects[0]
        }

        this.selectedProject = selectedProject
        
        // Fetch projects data with transactions
        if(selectedProject !== null) {
          this.fetchProject(selectedProject.id)
        }

        this.isLoading = false

        // Check route
        const projectId = this.$route.query.projectid
        const parsedProjectId = parseInt(projectId)

        if(!isNaN(parsedProjectId)) {
          const foundProject = projects.find(project => project.id === parsedProjectId)

          if(foundProject !== null)
            this.selectedProject = foundProject
        } 
      }
      catch(e) {
        console.log(e)
      }
    },
    setProject(project) {
      this.selectedProject = project
      this.$router.push(`/transactions?projectid=${project.id}`)
      this.fetchProject(project.id)
    },
    async fetchProject(id) {
      try {
        this.isLoading = true
        const projectDetailResponse = await fetch(`${process.env.VUE_APP_BASE_URL}/projects/${id}`, {
          headers: {
            'Authorization' : localStorage.getItem('apiKey')
          }
        })
        
        if(projectDetailResponse.status !== 200) {
          this.isLoading = false
          throw "Fetching project details failed"
        }

        const projectDetails = await projectDetailResponse.json()
        console.log('project details:', projectDetails)
        
        if(projectDetails != null) {
          this.projectDetails = projectDetails
        } 
        this.isLoading = false
      }
      catch(e) {
        console.log(e)
      }
    },
    formatCurrency(number) {
      return new Intl.NumberFormat('de-DE', { style: 'currency',  currency: 'IDR' }).format(number)
    },
    checkVariant(type) {
      switch(type) {
        case 'sell':
          return '#4caf50'
        case 'stock_in':
          return '#00acc1'
        case 'auction':
          return '#ab47bc'
        case 'movement':
          return '#f9a825'
        default:
          return 'white'
      }
    },
    async downloadReport() {
      try {
        const response = await fetch(`${process.env.VUE_APP_BASE_URL}/report?projectid=${this.projectDetails.id}`, {
          headers: {
            'Authorization' : localStorage.getItem('apiKey')
          }  
        })

        if(response.status !== 200) {
          throw 'Failed downloading report.'
        }

        const reportContents = await response.text()

        const blob = new Blob([reportContents], { type: 'text/csv;charset=utf-8' })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `report_${new Date().toISOString()}.csv`
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
      }
      catch(e) {
        console.log(e)
      }

      
    }
  }
})
</script>c
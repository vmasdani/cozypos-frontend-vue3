<template>
  <div class="d-flex align-items-center">
    <div>
      <h3>Transactions</h3>
    </div>
    <div v-if="state.requestStatus === 'Loading'" class="spinner-border text-primary mx-1">
      <span class="sr-only">Loading...</span>
    </div>
  </div>
  <div class="d-flex">
    <div>Select project: </div>
    <div>
      <select>
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
  <div>
    <input 
      type="text"
      class="form-control" 
      v-model="state.searchInput"
      placeholder="Search containing items..." 
    />
  </div>
  <div v-if="state.projectTransactionsView">
    Showing <strong>{{ filteredProjectTransactionsView.length }}/{{ state.projectTransactionsView.transactions.length }}</strong> Transactions
  </div>
  <div>
    <ul class="list-group">
      <li v-for="transactionView in filteredProjectTransactionsView" :key="transactionView.transaction.id" class="list-group-item">
        <div>
          <div class="d-flex justify-content-between">
            <h3
              :class="comparePriceIsCustomColor(transactionView)"
            >
              {{
                formatIdr(transactionView.transaction.priceIsCustom
                  ? transactionView.transaction.customPrice
                  : transactionView.totalPrice
                ) 
              }}
            </h3>
            <div>{{ transactionView.transaction.cashier }}</div>
          </div>
          <div>Orig: {{ formatIdr(transactionView.totalPrice)  }}</div>
          <div>
            {{ 
              transactionView.itemTransactions
                .map(itemTransaction => `${itemTransaction.item.name} x${itemTransaction.itemTransaction.qty}`)
                .join(', ')
            }}
          </div>
        </div>
      </li>
    </ul>
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

export default defineComponent({
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
        return 'text-dark'
      } else {
        if(transactionView.totalPrice < transactionView.transaction.customPrice) {
          return 'text-success'
        } else {
          return 'text-danger'
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
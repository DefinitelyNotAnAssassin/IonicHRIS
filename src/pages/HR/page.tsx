"use client"

import { useState, useEffect, useRef } from "react"
import {
  IonContent,
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonMenuButton,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonButton,
  IonItem,
  IonLabel,
  IonList,
  IonBadge,
  IonSegment,
  IonSegmentButton,
  useIonToast,
  IonSearchbar,
  IonSelect,
  IonSelectOption,
  IonModal,
  IonAvatar,
  IonFab,
  IonFabButton,
  IonLoading,
  IonDatetime,
  IonRadioGroup,
  IonRadio,
  IonProgressBar,
} from "@ionic/react"
import { useHistory } from "react-router-dom"
import { useAuth } from "@/hooks/use-auth"
import SideMenu from "@/components/side-menu"
import {
  Users,
  Calendar,
  Clock,
  FileText,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Filter,
  Eye,
  Edit,
  Download,
  Mail,
  Phone,
  Building,
  Briefcase,
  UserPlus,
  BarChart2,
  RefreshCw,
  FileType,
  FileText as FileTextIcon,
  Calendar as CalendarIcon,
  ChevronDown,
  ChevronRight,
  User,
  ListChecks,
} from "lucide-react"
import axios from "axios"
import Chart from "chart.js/auto"

// Define base URL for API
const API_BASE_URL = "http://localhost/codeigniter_v1/index.php"

export default function HR() {
  const { user, isAuthenticated } = useAuth()
  const history = useHistory()
  const [present] = useIonToast()
  const [activeTab, setActiveTab] = useState<string>("employees")
  const [activeSubTab, setActiveSubTab] = useState<string>("all")
  const [searchText, setSearchText] = useState("")
  const [filterDepartment, setFilterDepartment] = useState("")
  const [filterStatus, setFilterStatus] = useState("")
  const [showEmployeeModal, setShowEmployeeModal] = useState(false)
  const [selectedEmployee, setSelectedEmployee] = useState<any>(null)
  const [employees, setEmployees] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [departments, setDepartments] = useState<string[]>([])
  const [leaveRequests, setLeaveRequests] = useState<any[]>([])
  const [scheduleChanges, setScheduleChanges] = useState<any[]>([])
  const [officialBusinessRequests, setOfficialBusinessRequests] = useState<any[]>([])
  const [metrics, setMetrics] = useState<any>(null)
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total_records: 0,
    total_pages: 0,
  })

  const pendingRequestsChartRef = useRef<HTMLCanvasElement>(null)
  const departmentDistributionChartRef = useRef<HTMLCanvasElement>(null)
  const pendingRequestsChart = useRef<Chart | null>(null)
  const departmentDistributionChart = useRef<Chart | null>(null)

  const [reportType, setReportType] = useState<string>("employee")
  const [reportFormat, setReportFormat] = useState<string>("pdf")
  const [reportDateRange, setReportDateRange] = useState({
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0],
  })
  const [reportDepartment, setReportDepartment] = useState<string>("")
  const [reportStatus, setReportStatus] = useState<string>("")
  const [isGeneratingReport, setIsGeneratingReport] = useState<boolean>(false)
  const [expandedReportSection, setExpandedReportSection] = useState<string>("employee")

  useEffect(() => {
    if (!isAuthenticated) {
      history.push("/login")
    } else {
      loadDashboardData()
    }
  }, [isAuthenticated, history])

  const loadDashboardData = async () => {
    setIsLoading(true)
    try {
      await fetchMetrics()
      await fetchEmployees()
      if (activeTab === "requests" || activeTab === "dashboard") {
        await Promise.all([
          fetchLeaveRequests("pending"),
          fetchScheduleChanges("pending"),
          fetchOfficialBusinessRequests("pending"),
        ])
      }
      setIsLoading(false)
    } catch (error) {
      console.error("Error loading dashboard data:", error)
      presentToast("Error loading dashboard data", "danger")
      setIsLoading(false)
    }
  }

  const fetchMetrics = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/EmployeeController/metrics`)
      if (response.data && response.data.status === "success") {
        setMetrics(response.data.metrics)
        if (response.data.metrics.department_distribution) {
          const depts = response.data.metrics.department_distribution.map((d: any) => d.department)
          setDepartments(depts)
        }
      }
    } catch (error) {
      console.error("Error fetching metrics:", error)
      throw error
    }
  }

  const fetchEmployees = async (page = 1) => {
    try {
      setIsLoading(true)
      const params = new URLSearchParams({
        page: page.toString(),
        limit: pagination.limit.toString(),
        department: filterDepartment,
        status: filterStatus,
        search: searchText,
      })

      const response = await axios.get(`${API_BASE_URL}/EmployeeController/employees?${params}`)
      if (response.data) {
        setEmployees(response.data.records)
        setPagination(response.data.pagination)
      }
      setIsLoading(false)
    } catch (error) {
      console.error("Error fetching employees:", error)
      setIsLoading(false)
      presentToast("Error fetching employees", "danger")
    }
  }

  const fetchLeaveRequests = async (status = "pending") => {
    try {
      const params = new URLSearchParams({
        status: status,
        limit: "100",
      })

      const response = await axios.get(`${API_BASE_URL}/EmployeeController/leaveRequests?${params}`)
      if (response.data) {
        setLeaveRequests(response.data.records)
      }
      return response.data.records
    } catch (error) {
      console.error("Error fetching leave requests:", error)
      throw error
    }
  }

  const fetchScheduleChanges = async (status = "pending") => {
    try {
      const params = new URLSearchParams({
        status: status,
        limit: "100",
      })

      const response = await axios.get(`${API_BASE_URL}/EmployeeController/scheduleChanges?${params}`)
      if (response.data) {
        setScheduleChanges(response.data.records)
      }
      return response.data.records
    } catch (error) {
      console.error("Error fetching schedule changes:", error)
      throw error
    }
  }

  const fetchOfficialBusinessRequests = async (status = "pending") => {
    try {
      const params = new URLSearchParams({
        status: status,
        limit: "100",
      })

      const response = await axios.get(`${API_BASE_URL}/EmployeeController/officialBusiness?${params}`)
      if (response.data) {
        setOfficialBusinessRequests(response.data.records)
      }
      return response.data.records
    } catch (error) {
      console.error("Error fetching official business requests:", error)
      throw error
    }
  }

  useEffect(() => {
    if (metrics && activeTab === "dashboard") {
      renderPendingRequestsChart()
      renderDepartmentDistributionChart()
    }
  }, [metrics, activeTab])

  useEffect(() => {
    if (activeTab === "employees") {
      const timer = setTimeout(() => {
        fetchEmployees(1)
      }, 300)
      return () => clearTimeout(timer)
    }
  }, [searchText, filterDepartment, filterStatus])

  useEffect(() => {
    if (activeTab === "requests") {
      fetchLeaveRequests("pending")
      fetchScheduleChanges("pending")
      fetchOfficialBusinessRequests("pending")
    } else if (activeTab === "employees") {
      fetchEmployees(1)
    } else if (activeTab === "dashboard") {
      loadDashboardData()
    }
  }, [activeTab])

  const renderPendingRequestsChart = () => {
    if (pendingRequestsChartRef.current && metrics) {
      const ctx = pendingRequestsChartRef.current.getContext("2d")
      if (ctx) {
        if (pendingRequestsChart.current) {
          pendingRequestsChart.current.destroy()
        }

        pendingRequestsChart.current = new Chart(ctx, {
          type: "bar",
          data: {
            labels: ["Leaves", "Schedule Changes", "Official Business"],
            datasets: [
              {
                label: "Pending Requests",
                data: [
                  metrics.pending_requests.leaves,
                  metrics.pending_requests.schedule_changes,
                  metrics.pending_requests.official_business,
                ],
                backgroundColor: [
                  "rgba(239, 68, 68, 0.7)",
                  "rgba(59, 130, 246, 0.7)",
                  "rgba(16, 185, 129, 0.7)",
                ],
                borderColor: ["rgb(239, 68, 68)", "rgb(59, 130, 246)", "rgb(16, 185, 129)"],
                borderWidth: 1,
              },
            ],
          },
          options: {
            responsive: true,
            scales: {
              y: {
                beginAtZero: true,
              },
            },
          },
        })
      }
    }
  }

  const renderDepartmentDistributionChart = () => {
    if (departmentDistributionChartRef.current && metrics && metrics.department_distribution) {
      const ctx = departmentDistributionChartRef.current.getContext("2d")
      if (ctx) {
        if (departmentDistributionChart.current) {
          departmentDistributionChart.current.destroy()
        }

        departmentDistributionChart.current = new Chart(ctx, {
          type: "pie",
          data: {
            labels: metrics.department_distribution.map((dep: any) => dep.department),
            datasets: [
              {
                data: metrics.department_distribution.map((dep: any) => dep.count),
                backgroundColor: [
                  "rgba(239, 68, 68, 0.7)",
                  "rgba(59, 130, 246, 0.7)",
                  "rgba(16, 185, 129, 0.7)",
                  "rgba(245, 158, 11, 0.7)",
                  "rgba(139, 92, 246, 0.7)",
                ],
                borderColor: "#ffffff",
                borderWidth: 1,
              },
            ],
          },
          options: {
            responsive: true,
          },
        })
      }
    }
  }

  const presentToast = (message: string, color: "success" | "danger" | "warning" = "success") => {
    present({
      message: message,
      duration: 3000,
      position: "bottom",
      color: color,
    })
  }

  const viewEmployee = async (employeeId: number) => {
    try {
      setIsLoading(true)
      const response = await axios.get(`${API_BASE_URL}/EmployeeController/getEmployee/${employeeId}`)
      if (response.data && response.data.status === "success") {
        setSelectedEmployee(response.data.employee)
        setShowEmployeeModal(true)
      } else {
        presentToast("Could not find employee details", "danger")
      }
      setIsLoading(false)
    } catch (error) {
      console.error("Error fetching employee details:", error)
      presentToast("Error loading employee details", "danger")
      setIsLoading(false)
    }
  }

  const closeEmployeeModal = () => {
    setSelectedEmployee(null)
    setShowEmployeeModal(false)
  }

  const approveRequest = async (type: string, id: number) => {
    try {
      setIsLoading(true)
      let endpoint = ""
      let refreshFunction = null

      switch (type.toLowerCase()) {
        case "leave":
          endpoint = `${API_BASE_URL}/EmployeeController/approveLeave/${id}`
          refreshFunction = fetchLeaveRequests
          break
        case "schedule change":
          endpoint = `${API_BASE_URL}/EmployeeController/approveScheduleChange/${id}`
          refreshFunction = fetchScheduleChanges
          break
        case "official business":
          endpoint = `${API_BASE_URL}/EmployeeController/approveOfficialBusiness/${id}`
          refreshFunction = fetchOfficialBusinessRequests
          break
      }

      if (endpoint && refreshFunction) {
        await axios.post(endpoint, { status: "approved", user_id: user?.id })
        presentToast(`${type} request approved successfully`)
        await refreshFunction("pending")
        await fetchMetrics()
      }

      setIsLoading(false)
    } catch (error) {
      console.error(`Error approving ${type} request:`, error)
      presentToast(`Error approving ${type} request`, "danger")
      setIsLoading(false)
    }
  }

  const rejectRequest = async (type: string, id: number) => {
    try {
      setIsLoading(true)
      let endpoint = ""
      let refreshFunction = null

      switch (type.toLowerCase()) {
        case "leave":
          endpoint = `${API_BASE_URL}/EmployeeController/approveLeave/${id}`
          refreshFunction = fetchLeaveRequests
          break
        case "schedule change":
          endpoint = `${API_BASE_URL}/EmployeeController/approveScheduleChange/${id}`
          refreshFunction = fetchScheduleChanges
          break
        case "official business":
          endpoint = `${API_BASE_URL}/EmployeeController/approveOfficialBusiness/${id}`
          refreshFunction = fetchOfficialBusinessRequests
          break
      }

      if (endpoint && refreshFunction) {
        await axios.post(endpoint, { status: "rejected", user_id: user?.id })
        presentToast(`${type} request rejected`)
        await refreshFunction("pending")
        await fetchMetrics()
      }

      setIsLoading(false)
    } catch (error) {
      console.error(`Error rejecting ${type} request:`, error)
      presentToast(`Error rejecting ${type} request`, "danger")
      setIsLoading(false)
    }
  }

  const downloadReport = async (type: string) => {
    presentToast(`${type} report downloaded successfully`)
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return (
          <IonBadge color="success" className="rounded-full">
            Active
          </IonBadge>
        )
      case "inactive":
        return (
          <IonBadge color="medium" className="rounded-full">
            Inactive
          </IonBadge>
        )
      case "pending":
        return (
          <IonBadge color="warning" className="rounded-full">
            Pending
          </IonBadge>
        )
      case "approved":
        return (
          <IonBadge color="success" className="rounded-full">
            Approved
          </IonBadge>
        )
      case "rejected":
        return (
          <IonBadge color="danger" className="rounded-full">
            Rejected
          </IonBadge>
        )
      default:
        return (
          <IonBadge color="medium" className="rounded-full">
            {status}
          </IonBadge>
        )
    }
  }

  // Function to handle report generation
  const generateReport = async (type: string) => {
    try {
      setIsGeneratingReport(true)
      
      // Prepare parameters for the report
      const params = new URLSearchParams({
        type: type,
        format: reportFormat,
        startDate: reportDateRange.startDate,
        endDate: reportDateRange.endDate,
        department: reportDepartment,
        status: reportStatus,
      })
      
      // Call the API to generate the report
      const response = await axios.get(`${API_BASE_URL}/EmployeeController/generateReport?${params}`, {
        responseType: 'blob', // Important for handling file downloads
      })
      
      // Create a download link for the file
      const url = window.URL.createObjectURL(new Blob([response.data]))
      const link = document.createElement('a')
      link.href = url
      
      // Set the filename based on report type and format
      const fileExtension = reportFormat === 'pdf' ? 'pdf' : 'xlsx'
      link.setAttribute('download', `${type}-report-${new Date().toISOString().split('T')[0]}.${fileExtension}`)
      
      // Trigger the download
      document.body.appendChild(link)
      link.click()
      link.remove()
      
      presentToast(`${type.charAt(0).toUpperCase() + type.slice(1)} report downloaded successfully`)
      setIsGeneratingReport(false)
    } catch (error) {
      console.error(`Error generating ${type} report:`, error)
      presentToast(`Error generating ${type} report`, "danger")
      setIsGeneratingReport(false)
    }
  }

  const toggleReportSection = (section: string) => {
    if (expandedReportSection === section) {
      setExpandedReportSection("")
    } else {
      setExpandedReportSection(section)
    }
  }

  return (
    <>
      <SideMenu />
      <IonPage id="main-content">
        <IonHeader>
          <IonToolbar>
            <IonButtons slot="start">
              <IonMenuButton></IonMenuButton>
            </IonButtons>
            <IonTitle>HR Management</IonTitle>
            <IonButtons slot="end">
              <IonButton onClick={loadDashboardData}>
                <RefreshCw className="h-5 w-5" />
              </IonButton>
            </IonButtons>
          </IonToolbar>
        </IonHeader>
        <IonContent className="ion-padding bg-gray-50">
          <IonLoading isOpen={isLoading} message={"Please wait..."} />
          <div className="max-w-7xl mx-auto py-6">
            {/* Header Section */}
            <div className="bg-red-500 rounded-xl shadow-lg p-6 mb-8 text-white">
              <div className="flex items-center">
                <Users className="h-8 w-8 mr-4" />
                <div>
                  <h1 className="text-2xl font-bold">HR Management</h1>
                  <p className="text-red-100">Manage employee information and requests</p>
                </div>
              </div>
            </div>

            {/* Main Tabs */}
            <IonSegment value={activeTab} onIonChange={(e) => setActiveTab(e.detail.value as string)} className="mb-6">
              <IonSegmentButton value="dashboard">
                <IonLabel>Dashboard</IonLabel>
              </IonSegmentButton>
              <IonSegmentButton value="employees">
                <IonLabel>Employees</IonLabel>
              </IonSegmentButton>
              <IonSegmentButton value="requests">
                <IonLabel>Requests</IonLabel>
              </IonSegmentButton>
              <IonSegmentButton value="reports">
                <IonLabel>Reports</IonLabel>
              </IonSegmentButton>
            </IonSegment>

            {/* Dashboard Stats */}
            {activeTab === "dashboard" && metrics && (
              <div>
                <h2 className="text-xl font-semibold text-gray-800 mb-4">HR Dashboard</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                  <IonCard className="rounded-xl overflow-hidden shadow-md m-0">
                    <div className="flex items-start p-4">
                      <div className="bg-red-100 rounded-full p-3 mr-3">
                        <Users className="h-6 w-6 text-red-600" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 font-medium">Total Employees</p>
                        <h3 className="text-2xl font-bold text-gray-800">{metrics.total_employees}</h3>
                        <p className="text-xs text-gray-500">{metrics.active_employees} active</p>
                      </div>
                    </div>
                  </IonCard>

                  <IonCard className="rounded-xl overflow-hidden shadow-md m-0">
                    <div className="flex items-start p-4">
                      <div className="bg-blue-100 rounded-full p-3 mr-3">
                        <Calendar className="h-6 w-6 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 font-medium">Pending Leaves</p>
                        <h3 className="text-2xl font-bold text-gray-800">{metrics.pending_requests.leaves}</h3>
                        <p className="text-xs text-gray-500">Awaiting approval</p>
                      </div>
                    </div>
                  </IonCard>

                  <IonCard className="rounded-xl overflow-hidden shadow-md m-0">
                    <div className="flex items-start p-4">
                      <div className="bg-green-100 rounded-full p-3 mr-3">
                        <Clock className="h-6 w-6 text-green-600" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 font-medium">Schedule Changes</p>
                        <h3 className="text-2xl font-bold text-gray-800">{metrics.pending_requests.schedule_changes}</h3>
                        <p className="text-xs text-gray-500">Pending requests</p>
                      </div>
                    </div>
                  </IonCard>

                  <IonCard className="rounded-xl overflow-hidden shadow-md m-0">
                    <div className="flex items-start p-4">
                      <div className="bg-amber-100 rounded-full p-3 mr-3">
                        <FileText className="h-6 w-6 text-amber-600" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 font-medium">Official Business</p>
                        <h3 className="text-2xl font-bold text-gray-800">{metrics.pending_requests.official_business}</h3>
                        <p className="text-xs text-gray-500">Pending approval</p>
                      </div>
                    </div>
                  </IonCard>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                  <IonCard className="rounded-xl overflow-hidden">
                    <IonCardHeader className="bg-white border-b">
                      <IonCardTitle className="text-lg font-semibold text-gray-800">Pending Requests</IonCardTitle>
                    </IonCardHeader>
                    <IonCardContent className="p-4">
                      <canvas ref={pendingRequestsChartRef} height="200"></canvas>
                    </IonCardContent>
                  </IonCard>

                  <IonCard className="rounded-xl overflow-hidden">
                    <IonCardHeader className="bg-white border-b">
                      <IonCardTitle className="text-lg font-semibold text-gray-800">
                        Department Distribution
                      </IonCardTitle>
                    </IonCardHeader>
                    <IonCardContent className="p-4">
                      <canvas ref={departmentDistributionChartRef} height="200"></canvas>
                    </IonCardContent>
                  </IonCard>
                </div>

                <IonCard className="rounded-xl overflow-hidden mb-6">
                  <IonCardHeader className="bg-white border-b">
                    <IonCardTitle className="text-lg font-semibold text-gray-800">Today's Attendance</IonCardTitle>
                  </IonCardHeader>
                  <IonCardContent className="p-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                        <div className="flex items-center">
                          <div className="bg-red-100 rounded-full p-2 mr-3">
                            <XCircle className="h-5 w-5 text-red-600" />
                          </div>
                          <div>
                            <p className="text-sm text-gray-500 font-medium">Absent</p>
                            <h3 className="text-xl font-bold text-gray-800">{metrics.today_attendance.absent}</h3>
                          </div>
                        </div>
                      </div>

                      <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                        <div className="flex items-center">
                          <div className="bg-amber-100 rounded-full p-2 mr-3">
                            <AlertTriangle className="h-5 w-5 text-amber-600" />
                          </div>
                          <div>
                            <p className="text-sm text-gray-500 font-medium">Late</p>
                            <h3 className="text-xl font-bold text-gray-800">{metrics.today_attendance.late}</h3>
                          </div>
                        </div>
                      </div>

                      <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                        <div className="flex items-center">
                          <div className="bg-blue-100 rounded-full p-2 mr-3">
                            <Calendar className="h-5 w-5 text-blue-600" />
                          </div>
                          <div>
                            <p className="text-sm text-gray-500 font-medium">On Leave</p>
                            <h3 className="text-xl font-bold text-gray-800">
                              {leaveRequests.filter(
                                (l) =>
                                  l.status === "approved" &&
                                  new Date(l.start_date) <= new Date() &&
                                  new Date(l.end_date) >= new Date(),
                              ).length}
                            </h3>
                          </div>
                        </div>
                      </div>
                    </div>
                  </IonCardContent>
                </IonCard>

                <div className="flex justify-end">
                  <IonButton color="danger" onClick={() => downloadReport("HR Dashboard")}>
                    <Download className="h-4 w-4 mr-2" />
                    Download Report
                  </IonButton>
                </div>
              </div>
            )}

            {/* Employees Tab */}
            {activeTab === "employees" && (
              <div>
                <IonCard className="rounded-xl shadow-md overflow-hidden">
                  <IonCardHeader className="bg-white border-b p-6">
                    <IonCardTitle className="text-xl font-bold text-gray-800">Employee Directory</IonCardTitle>
                  </IonCardHeader>
                  <IonCardContent className="p-0">
                    <div className="p-4 border-b bg-gray-50">
                      <div className="flex flex-col md:flex-row gap-4 items-center">
                        <div className="flex-1">
                          <IonSearchbar
                            value={searchText}
                            onIonChange={(e) => setSearchText(e.detail.value!)}
                            placeholder="Search employees by name, email, position..."
                            className="rounded-lg"
                          ></IonSearchbar>
                        </div>
                        <div className="flex gap-2 items-center">
                          <Filter className="h-5 w-5 text-gray-500" />
                          <IonSelect
                            interface="popover"
                            value={filterDepartment}
                            placeholder="Department"
                            onIonChange={(e) => setFilterDepartment(e.detail.value)}
                          >
                            <IonSelectOption value="">All Departments</IonSelectOption>
                            {departments.map((dept, idx) => (
                              <IonSelectOption key={idx} value={dept}>
                                {dept}
                              </IonSelectOption>
                            ))}
                          </IonSelect>
                          <IonSelect
                            interface="popover"
                            value={filterStatus}
                            placeholder="Status"
                            onIonChange={(e) => setFilterStatus(e.detail.value)}
                          >
                            <IonSelectOption value="">All Status</IonSelectOption>
                            <IonSelectOption value="active">Active</IonSelectOption>
                            <IonSelectOption value="inactive">Inactive</IonSelectOption>
                          </IonSelect>
                        </div>
                      </div>
                    </div>
                    <IonList className="px-0">
                      {employees.length === 0 ? (
                        <div className="p-8 text-center text-gray-500">
                          <AlertTriangle className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                          <p>No employees found matching your filters.</p>
                        </div>
                      ) : (
                        employees.map((employee) => (
                          <IonItem
                            key={employee.id}
                            lines="full"
                            detail={false}
                            button
                            onClick={() => viewEmployee(employee.id)}
                          >
                            <div className="flex items-center w-full py-2">
                              <IonAvatar className="mr-4">
                                <img
                                  src={employee.avatar || `/placeholder.svg?height=40&width=40`}
                                  alt={employee.name}
                                />
                              </IonAvatar>
                              <div className="flex-1">
                                <div className="flex justify-between items-center">
                                  <div>
                                    <h3 className="font-medium text-gray-800">{employee.name}</h3>
                                    <p className="text-sm text-gray-500">
                                      {employee.position} • {employee.department}
                                    </p>
                                  </div>
                                  <div className="flex items-center">
                                    {getStatusBadge(employee.status)}
                                    <Eye className="h-5 w-5 ml-3 text-gray-500" />
                                  </div>
                                </div>
                              </div>
                            </div>
                          </IonItem>
                        ))
                      )}
                    </IonList>
                    {employees.length > 0 && (
                      <div className="flex justify-between items-center p-4 border-t">
                        <div className="text-sm text-gray-500">
                          Showing {(pagination.page - 1) * pagination.limit + 1} to{" "}
                          {Math.min(pagination.page * pagination.limit, pagination.total_records)} of{" "}
                          {pagination.total_records} employees
                        </div>
                        <div className="flex gap-2">
                          <IonButton
                            size="small"
                            fill="outline"
                            disabled={pagination.page === 1}
                            onClick={() => fetchEmployees(pagination.page - 1)}
                          >
                            Previous
                          </IonButton>
                          <IonButton
                            size="small"
                            fill="outline"
                            disabled={pagination.page === pagination.total_pages}
                            onClick={() => fetchEmployees(pagination.page + 1)}
                          >
                            Next
                          </IonButton>
                        </div>
                      </div>
                    )}
                  </IonCardContent>
                </IonCard>
              </div>
            )}

            {/* Requests Tab */}
            {activeTab === "requests" && (
              <div>
                <IonSegment
                  value={activeSubTab}
                  onIonChange={(e) => setActiveSubTab(e.detail.value as string)}
                  className="mb-6"
                >
                  <IonSegmentButton value="all">
                    <IonLabel>All Requests</IonLabel>
                  </IonSegmentButton>
                  <IonSegmentButton value="leaves">
                    <IonLabel>Leaves</IonLabel>
                  </IonSegmentButton>
                  <IonSegmentButton value="schedules">
                    <IonLabel>Schedule Changes</IonLabel>
                  </IonSegmentButton>
                  <IonSegmentButton value="official">
                    <IonLabel>Official Business</IonLabel>
                  </IonSegmentButton>
                </IonSegment>

                {(activeSubTab === "all" || activeSubTab === "leaves") && (
                  <IonCard className="rounded-xl shadow-md overflow-hidden mb-6">
                    <IonCardHeader className="bg-white border-b p-6">
                      <IonCardTitle className="text-xl font-bold text-gray-800">Pending Leave Requests</IonCardTitle>
                    </IonCardHeader>
                    <IonCardContent className="p-0">
                      <IonList className="px-0">
                        {leaveRequests.length === 0 ? (
                          <div className="p-8 text-center text-gray-500">
                            <CheckCircle className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                            <p>No pending leave requests.</p>
                          </div>
                        ) : (
                          leaveRequests.map((request) => (
                            <IonItem key={request.id} lines="full">
                              <div className="flex items-start w-full py-3">
                                <div className="mr-3">
                                  <Calendar className="h-6 w-6 text-red-500" />
                                </div>
                                <div className="flex-1">
                                  <div className="flex flex-col md:flex-row md:justify-between md:items-center">
                                    <div>
                                      <h3 className="font-medium text-gray-800">
                                        {request.employee_name} - {request.type} Leave
                                      </h3>
                                      <p className="text-sm text-gray-500">
                                        {new Date(request.start_date).toLocaleDateString()} -{" "}
                                        {new Date(request.end_date).toLocaleDateString()} ({request.days} days)
                                      </p>
                                      <p className="text-sm text-gray-600 mt-1">Reason: {request.reason}</p>
                                    </div>
                                    <div className="flex mt-3 md:mt-0">
                                      <IonButton
                                        size="small"
                                        color="success"
                                        onClick={() => approveRequest("Leave", request.id)}
                                      >
                                        <CheckCircle className="h-4 w-4 mr-1" />
                                        Approve
                                      </IonButton>
                                      <IonButton
                                        size="small"
                                        color="danger"
                                        fill="outline"
                                        className="ml-2"
                                        onClick={() => rejectRequest("Leave", request.id)}
                                      >
                                        <XCircle className="h-4 w-4 mr-1" />
                                        Reject
                                      </IonButton>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </IonItem>
                          ))
                        )}
                      </IonList>
                    </IonCardContent>
                  </IonCard>
                )}

                {/* Add the missing Schedule Changes section */}
                {(activeSubTab === "all" || activeSubTab === "schedules") && (
                  <IonCard className="rounded-xl shadow-md overflow-hidden mb-6">
                    <IonCardHeader className="bg-white border-b p-6">
                      <IonCardTitle className="text-xl font-bold text-gray-800">Pending Schedule Changes</IonCardTitle>
                    </IonCardHeader>
                    <IonCardContent className="p-0">
                      <IonList className="px-0">
                        {scheduleChanges.length === 0 ? (
                          <div className="p-8 text-center text-gray-500">
                            <CheckCircle className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                            <p>No pending schedule change requests.</p>
                          </div>
                        ) : (
                          scheduleChanges.map((request) => (
                            <IonItem key={request.id} lines="full">
                              <div className="flex items-start w-full py-3">
                                <div className="mr-3">
                                  <Clock className="h-6 w-6 text-blue-500" />
                                </div>
                                <div className="flex-1">
                                  <div className="flex flex-col md:flex-row md:justify-between md:items-center">
                                    <div>
                                      <h3 className="font-medium text-gray-800">
                                        {request.employee_name} - Schedule Change
                                      </h3>
                                    
                                      <p className="text-sm text-gray-500">
                                        Date of Absence: {new Date(request.date_of_absence).toLocaleDateString()}
                                      </p>
                                      <p className="text-sm text-gray-500">
                                        Requested Schedule Date: {new Date(request.date).toLocaleDateString()}
                                      </p>
                                      <p className="text-sm text-gray-600 mt-1">
                                        From: {request.current_schedule} → To: {request.requested_schedule}
                                      </p>
                                      <p className="text-sm text-gray-600 mt-1">Reason: {request.reason}</p>
                                    </div>
                                    <div className="flex mt-3 md:mt-0">
                                      <IonButton
                                        size="small"
                                        color="success"
                                        onClick={() => approveRequest("Schedule change", request.id)}
                                      >
                                        <CheckCircle className="h-4 w-4 mr-1" />
                                        Approve
                                      </IonButton>
                                      <IonButton
                                        size="small"
                                        color="danger"
                                        fill="outline"
                                        className="ml-2"
                                        onClick={() => rejectRequest("Schedule change", request.id)}
                                      >
                                        <XCircle className="h-4 w-4 mr-1" />
                                        Reject
                                      </IonButton>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </IonItem>
                          ))
                        )}
                      </IonList>
                    </IonCardContent>
                  </IonCard>
                )}

                {/* Add the missing Official Business section */}
                {(activeSubTab === "all" || activeSubTab === "official") && (
                  <IonCard className="rounded-xl shadow-md overflow-hidden mb-6">
                    <IonCardHeader className="bg-white border-b p-6">
                      <IonCardTitle className="text-xl font-bold text-gray-800">Pending Official Business</IonCardTitle>
                    </IonCardHeader>
                    <IonCardContent className="p-0">
                      <IonList className="px-0">
                        {officialBusinessRequests.length === 0 ? (
                          <div className="p-8 text-center text-gray-500">
                            <CheckCircle className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                            <p>No pending official business requests.</p>
                          </div>
                        ) : (
                          officialBusinessRequests.map((request) => (
                            <IonItem key={request.id} lines="full">
                              <div className="flex items-start w-full py-3">
                                <div className="mr-3">
                                  <FileText className="h-6 w-6 text-green-500" />
                                </div>
                                <div className="flex-1">
                                  <div className="flex flex-col md:flex-row md:justify-between md:items-center">
                                    <div>
                                      <h3 className="font-medium text-gray-800">
                                        {request.employee_name} - Official Business
                                      </h3>
                                      <p className="text-sm text-gray-500">
                                        Date: {new Date(request.date).toLocaleDateString()}
                                      </p>
                                      <p className="text-sm text-gray-600 mt-1">
                                        Time: {request.time_departure.substring(0, 5)} - {request.time_arrival.substring(0, 5)}
                                      </p>
                                      <p className="text-sm text-gray-600 mt-1">Purpose: {request.purpose}</p>
                                    </div>
                                    <div className="flex mt-3 md:mt-0">
                                      <IonButton
                                        size="small"
                                        color="success"
                                        onClick={() => approveRequest("Official business", request.id)}
                                      >
                                        <CheckCircle className="h-4 w-4 mr-1" />
                                        Approve
                                      </IonButton>
                                      <IonButton
                                        size="small"
                                        color="danger"
                                        fill="outline"
                                        className="ml-2"
                                        onClick={() => rejectRequest("Official business", request.id)}
                                      >
                                        <XCircle className="h-4 w-4 mr-1" />
                                        Reject
                                      </IonButton>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </IonItem>
                          ))
                        )}
                      </IonList>
                    </IonCardContent>
                  </IonCard>
                )}
              </div>
            )}

            {/* Reports Tab */}
            {activeTab === "reports" && (
              <div>
                <h2 className="text-xl font-semibold text-gray-800 mb-4">HR Reports</h2>
                
                <div className="grid grid-cols-1 gap-6 mb-8">
                  {/* Employee Report Section */}
                  <IonCard className="rounded-xl shadow-md overflow-hidden">
                    <div 
                      className="flex justify-between items-center p-6 bg-white cursor-pointer"
                      onClick={() => toggleReportSection("employee")}
                    >
                      <div className="flex items-center">
                        <div className="bg-blue-100 rounded-full p-3 mr-4">
                          <User className="h-6 w-6 text-blue-600" />
                        </div>
                        <div>
                          <h3 className="text-lg font-medium text-gray-800">Employee Reports</h3>
                          <p className="text-sm text-gray-500">Generate employee listings, profiles and statistics</p>
                        </div>
                      </div>
                      {expandedReportSection === "employee" ? (
                        <ChevronDown className="h-5 w-5 text-gray-500" />
                      ) : (
                        <ChevronRight className="h-5 w-5 text-gray-500" />
                      )}
                    </div>
                    
                    {expandedReportSection === "employee" && (
                      <IonCardContent className="p-6 border-t">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                          <div>
                            <IonLabel className="text-sm font-medium text-gray-700 mb-2 block">Report Type</IonLabel>
                            <IonRadioGroup 
                              value={reportType} 
                              onIonChange={(e) => setReportType(e.detail.value)}
                              className="flex flex-col space-y-2"
                            >
                              <IonItem lines="none" className="--ion-item-background: transparent">
                                <IonRadio value="employee_directory">Employee Directory</IonRadio>
                              </IonItem>
                              <IonItem lines="none">
                                <IonRadio value="employee_by_department">Employees by Department</IonRadio>
                              </IonItem>
                              <IonItem lines="none">
                                <IonRadio value="new_employees">New Employees</IonRadio>
                              </IonItem>
                            </IonRadioGroup>
                          </div>
                          
                          <div>
                            <div className="mb-4">
                              <IonLabel className="text-sm font-medium text-gray-700 mb-2 block">Department</IonLabel>
                              <IonSelect
                                interface="popover"
                                value={reportDepartment}
                                placeholder="All Departments"
                                onIonChange={(e) => setReportDepartment(e.detail.value)}
                              >
                                <IonSelectOption value="">All Departments</IonSelectOption>
                                {departments.map((dept, idx) => (
                                  <IonSelectOption key={idx} value={dept}>
                                    {dept}
                                  </IonSelectOption>
                                ))}
                              </IonSelect>
                            </div>
                            
                            <div>
                              <IonLabel className="text-sm font-medium text-gray-700 mb-2 block">Status</IonLabel>
                              <IonSelect
                                interface="popover"
                                value={reportStatus}
                                placeholder="All Status"
                                onIonChange={(e) => setReportStatus(e.detail.value)}
                              >
                                <IonSelectOption value="">All Status</IonSelectOption>
                                <IonSelectOption value="active">Active</IonSelectOption>
                                <IonSelectOption value="inactive">Inactive</IonSelectOption>
                              </IonSelect>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex flex-col-reverse sm:flex-row sm:justify-between sm:items-center">
                          <div className="flex items-center space-x-4 mt-4 sm:mt-0">
                            <IonButton
                              fill="outline"
                              onClick={() => setReportFormat('pdf')}
                              color={reportFormat === 'pdf' ? 'danger' : 'medium'}
                              className="flex-1 sm:flex-none"
                            >
                              <FileTextIcon className="h-4 w-4 mr-2" /> 
                              PDF
                            </IonButton>
                            <IonButton
                              fill="outline"
                              onClick={() => setReportFormat('excel')}
                              color={reportFormat === 'excel' ? 'danger' : 'medium'}
                              className="flex-1 sm:flex-none"
                            >
                              <FileType className="h-4 w-4 mr-2" /> 
                              Excel
                            </IonButton>
                          </div>
                          
                          <IonButton 
                            color="danger" 
                            disabled={isGeneratingReport}
                            onClick={() => generateReport('employee')}
                            className="flex-1 sm:flex-none"
                          >
                            {isGeneratingReport ? (
                              <>Generating... <IonProgressBar type="indeterminate" /></>
                            ) : (
                              <>
                                <Download className="h-4 w-4 mr-2" />
                                Generate Report
                              </>
                            )}
                          </IonButton>
                        </div>
                      </IonCardContent>
                    )}
                  </IonCard>

                  {/* Attendance Report Section */}
                  <IonCard className="rounded-xl shadow-md overflow-hidden">
                    <div 
                      className="flex justify-between items-center p-6 bg-white cursor-pointer"
                      onClick={() => toggleReportSection("attendance")}
                    >
                      <div className="flex items-center">
                        <div className="bg-green-100 rounded-full p-3 mr-4">
                          <CalendarIcon className="h-6 w-6 text-green-600" />
                        </div>
                        <div>
                          <h3 className="text-lg font-medium text-gray-800">Attendance Reports</h3>
                          <p className="text-sm text-gray-500">Generate timesheet, attendance and absence reports</p>
                        </div>
                      </div>
                      {expandedReportSection === "attendance" ? (
                        <ChevronDown className="h-5 w-5 text-gray-500" />
                      ) : (
                        <ChevronRight className="h-5 w-5 text-gray-500" />
                      )}
                    </div>
                    
                    {expandedReportSection === "attendance" && (
                      <IonCardContent className="p-6 border-t">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                          <div>
                            <IonLabel className="text-sm font-medium text-gray-700 mb-2 block">Report Type</IonLabel>
                            <IonRadioGroup 
                              value={reportType} 
                              onIonChange={(e) => setReportType(e.detail.value)}
                              className="flex flex-col space-y-2"
                            >
                              <IonItem lines="none">
                                <IonRadio value="daily_attendance">Daily Attendance</IonRadio>
                              </IonItem>
                              <IonItem lines="none">
                                <IonRadio value="monthly_timesheet">Monthly Timesheet</IonRadio>
                              </IonItem>
                              <IonItem lines="none">
                                <IonRadio value="absences_lates">Absences & Lates</IonRadio>
                              </IonItem>
                            </IonRadioGroup>
                          </div>
                          
                          <div>
                            <div className="mb-4">
                              <IonLabel className="text-sm font-medium text-gray-700 mb-2 block">Date Range</IonLabel>
                              <div className="grid grid-cols-2 gap-2">
                                <div>
                                  <IonLabel className="text-xs">From</IonLabel>
                                  <IonInput
                                    type="date"
                                    value={reportDateRange.startDate}
                                    onIonChange={(e) => setReportDateRange({...reportDateRange, startDate: e.detail.value!})}
                                  />
                                </div>
                                <div>
                                  <IonLabel className="text-xs">To</IonLabel>
                                  <IonInput
                                    type="date"
                                    value={reportDateRange.endDate}
                                    onIonChange={(e) => setReportDateRange({...reportDateRange, endDate: e.detail.value!})}
                                  />
                                </div>
                              </div>
                            </div>
                            
                            <div>
                              <IonLabel className="text-sm font-medium text-gray-700 mb-2 block">Department</IonLabel>
                              <IonSelect
                                interface="popover"
                                value={reportDepartment}
                                placeholder="All Departments"
                                onIonChange={(e) => setReportDepartment(e.detail.value)}
                              >
                                <IonSelectOption value="">All Departments</IonSelectOption>
                                {departments.map((dept, idx) => (
                                  <IonSelectOption key={idx} value={dept}>
                                    {dept}
                                  </IonSelectOption>
                                ))}
                              </IonSelect>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex flex-col-reverse sm:flex-row sm:justify-between sm:items-center">
                          <div className="flex items-center space-x-4 mt-4 sm:mt-0">
                            <IonButton
                              fill="outline"
                              onClick={() => setReportFormat('pdf')}
                              color={reportFormat === 'pdf' ? 'danger' : 'medium'}
                              className="flex-1 sm:flex-none"
                            >
                              <FileTextIcon className="h-4 w-4 mr-2" /> 
                              PDF
                            </IonButton>
                            <IonButton
                              fill="outline"
                              onClick={() => setReportFormat('excel')}
                              color={reportFormat === 'excel' ? 'danger' : 'medium'}
                              className="flex-1 sm:flex-none"
                            >
                              <FileType className="h-4 w-4 mr-2" /> 
                              Excel
                            </IonButton>
                          </div>
                          
                          <IonButton 
                            color="danger" 
                            disabled={isGeneratingReport}
                            onClick={() => generateReport('attendance')}
                            className="flex-1 sm:flex-none"
                          >
                            {isGeneratingReport ? (
                              <>Generating... <IonProgressBar type="indeterminate" /></>
                            ) : (
                              <>
                                <Download className="h-4 w-4 mr-2" />
                                Generate Report
                              </>
                            )}
                          </IonButton>
                        </div>
                      </IonCardContent>
                    )}
                  </IonCard>

                  {/* Leave Report Section */}
                  <IonCard className="rounded-xl shadow-md overflow-hidden">
                    <div 
                      className="flex justify-between items-center p-6 bg-white cursor-pointer"
                      onClick={() => toggleReportSection("leave")}
                    >
                      <div className="flex items-center">
                        <div className="bg-red-100 rounded-full p-3 mr-4">
                          <FileTextIcon className="h-6 w-6 text-red-600" />
                        </div>
                        <div>
                          <h3 className="text-lg font-medium text-gray-800">Leave Reports</h3>
                          <p className="text-sm text-gray-500">Generate leave balances and leave history reports</p>
                        </div>
                      </div>
                      {expandedReportSection === "leave" ? (
                        <ChevronDown className="h-5 w-5 text-gray-500" />
                      ) : (
                        <ChevronRight className="h-5 w-5 text-gray-500" />
                      )}
                    </div>
                    
                    {expandedReportSection === "leave" && (
                      <IonCardContent className="p-6 border-t">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                          <div>
                            <IonLabel className="text-sm font-medium text-gray-700 mb-2 block">Report Type</IonLabel>
                            <IonRadioGroup 
                              value={reportType} 
                              onIonChange={(e) => setReportType(e.detail.value)}
                              className="flex flex-col space-y-2"
                            >
                              <IonItem lines="none">
                                <IonRadio value="leave_balances">Leave Balances</IonRadio>
                              </IonItem>
                              <IonItem lines="none">
                                <IonRadio value="leave_history">Leave History</IonRadio>
                              </IonItem>
                              <IonItem lines="none">
                                <IonRadio value="pending_leaves">Pending Leave Requests</IonRadio>
                              </IonItem>
                            </IonRadioGroup>
                          </div>
                          
                          <div>
                            <div className="mb-4">
                              <IonLabel className="text-sm font-medium text-gray-700 mb-2 block">Date Range</IonLabel>
                              <div className="grid grid-cols-2 gap-2">
                                <div>
                                  <IonLabel className="text-xs">From</IonLabel>
                                  <IonInput
                                    type="date"
                                    value={reportDateRange.startDate}
                                    onIonChange={(e) => setReportDateRange({...reportDateRange, startDate: e.detail.value!})}
                                  />
                                </div>
                                <div>
                                  <IonLabel className="text-xs">To</IonLabel>
                                  <IonInput
                                    type="date"
                                    value={reportDateRange.endDate}
                                    onIonChange={(e) => setReportDateRange({...reportDateRange, endDate: e.detail.value!})}
                                  />
                                </div>
                              </div>
                            </div>
                            
                            <div>
                              <IonLabel className="text-sm font-medium text-gray-700 mb-2 block">Department</IonLabel>
                              <IonSelect
                                interface="popover"
                                value={reportDepartment}
                                placeholder="All Departments"
                                onIonChange={(e) => setReportDepartment(e.detail.value)}
                              >
                                <IonSelectOption value="">All Departments</IonSelectOption>
                                {departments.map((dept, idx) => (
                                  <IonSelectOption key={idx} value={dept}>
                                    {dept}
                                  </IonSelectOption>
                                ))}
                              </IonSelect>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex flex-col-reverse sm:flex-row sm:justify-between sm:items-center">
                          <div className="flex items-center space-x-4 mt-4 sm:mt-0">
                            <IonButton
                              fill="outline"
                              onClick={() => setReportFormat('pdf')}
                              color={reportFormat === 'pdf' ? 'danger' : 'medium'}
                              className="flex-1 sm:flex-none"
                            >
                              <FileTextIcon className="h-4 w-4 mr-2" /> 
                              PDF
                            </IonButton>
                            <IonButton
                              fill="outline"
                              onClick={() => setReportFormat('excel')}
                              color={reportFormat === 'excel' ? 'danger' : 'medium'}
                              className="flex-1 sm:flex-none"
                            >
                              <FileType className="h-4 w-4 mr-2" /> 
                              Excel
                            </IonButton>
                          </div>
                          
                          <IonButton 
                            color="danger" 
                            disabled={isGeneratingReport}
                            onClick={() => generateReport('leave')}
                            className="flex-1 sm:flex-none"
                          >
                            {isGeneratingReport ? (
                              <>Generating... <IonProgressBar type="indeterminate" /></>
                            ) : (
                              <>
                                <Download className="h-4 w-4 mr-2" />
                                Generate Report
                              </>
                            )}
                          </IonButton>
                        </div>
                      </IonCardContent>
                    )}
                  </IonCard>

                  {/* Custom Report Section */}
                  <IonCard className="rounded-xl shadow-md overflow-hidden">
                    <div 
                      className="flex justify-between items-center p-6 bg-white cursor-pointer"
                      onClick={() => toggleReportSection("custom")}
                    >
                      <div className="flex items-center">
                        <div className="bg-purple-100 rounded-full p-3 mr-4">
                          <ListChecks className="h-6 w-6 text-purple-600" />
                        </div>
                        <div>
                          <h3 className="text-lg font-medium text-gray-800">Custom Reports</h3>
                          <p className="text-sm text-gray-500">Create custom reports with advanced filters</p>
                        </div>
                      </div>
                      {expandedReportSection === "custom" ? (
                        <ChevronDown className="h-5 w-5 text-gray-500" />
                      ) : (
                        <ChevronRight className="h-5 w-5 text-gray-500" />
                      )}
                    </div>
                    
                    {expandedReportSection === "custom" && (
                      <IonCardContent className="p-6 border-t">
                        <div className="flex items-center justify-center p-8">
                          <div className="text-center">
                            <BarChart2 className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                            <h3 className="text-lg font-medium text-gray-600">Custom Report Builder</h3>
                            <p className="text-sm text-gray-500 mb-4">
                              Create advanced custom reports with multiple filters and data sources
                            </p>
                            <IonButton color="danger">
                              <BarChart2 className="h-4 w-4 mr-2" /> 
                              Open Report Builder
                            </IonButton>
                          </div>
                        </div>
                      </IonCardContent>
                    )}
                  </IonCard>
                </div>
              </div>
            )}
          </div>

          {activeTab === "employees" && (
            <IonFab vertical="bottom" horizontal="end" slot="fixed">
              <IonFabButton color="danger" onClick={() => history.push("/register")}>
                <UserPlus />
              </IonFabButton>
            </IonFab>
          )}

          <IonModal isOpen={showEmployeeModal} onDidDismiss={closeEmployeeModal}>
            <IonHeader>
              <IonToolbar>
                <IonTitle>Employee Details</IonTitle>
                <IonButtons slot="end">
                  <IonButton onClick={closeEmployeeModal}>Close</IonButton>
                </IonButtons>
              </IonToolbar>
            </IonHeader>
            <IonContent className="ion-padding">
              {selectedEmployee && (
                <div className="max-w-3xl mx-auto">
                  <div className="flex flex-col items-center mb-6">
                    <IonAvatar className="w-24 h-24 mb-4">
                      <img
                        src={selectedEmployee.avatar || `/placeholder.svg?height=96&width=96`}
                        alt={selectedEmployee.name}
                      />
                    </IonAvatar>
                    <h2 className="text-2xl font-bold text-gray-800">{selectedEmployee.name}</h2>
                    <p className="text-gray-600">{selectedEmployee.position}</p>
                    <div className="mt-2">{getStatusBadge(selectedEmployee.status)}</div>
                  </div>

                  <IonSegment value="personal" className="mb-4">
                    <IonSegmentButton value="personal">
                      <IonLabel>Personal Info</IonLabel>
                    </IonSegmentButton>
                    <IonSegmentButton value="employment">
                      <IonLabel>Employment</IonLabel>
                    </IonSegmentButton>
                    <IonSegmentButton value="leaves">
                      <IonLabel>Leaves</IonLabel>
                    </IonSegmentButton>
                  </IonSegment>

                  {/* Personal Information Section */}
                  {selectedEmployee.personalInfo && (
                    <IonCard className="rounded-xl shadow-md overflow-hidden mb-6">
                      <IonCardHeader className="bg-white border-b">
                        <IonCardTitle className="text-lg font-semibold text-gray-800">Personal Information</IonCardTitle>
                      </IonCardHeader>
                      <IonCardContent className="p-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <p className="text-sm text-gray-500">Full Name</p>
                            <p className="text-gray-800">
                              {selectedEmployee.personalInfo.firstName} {selectedEmployee.personalInfo.middleName} {selectedEmployee.personalInfo.surname} {selectedEmployee.personalInfo.suffix}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Nickname</p>
                            <p className="text-gray-800">{selectedEmployee.personalInfo.nickname || 'N/A'}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Present Address</p>
                            <p className="text-gray-800">{selectedEmployee.personalInfo.presentAddress}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Provincial Address</p>
                            <p className="text-gray-800">{selectedEmployee.personalInfo.provincialAddress || 'N/A'}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Date of Birth</p>
                            <p className="text-gray-800">{new Date(selectedEmployee.personalInfo.dateOfBirth).toLocaleDateString()}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Place of Birth</p>
                            <p className="text-gray-800">{selectedEmployee.personalInfo.placeOfBirth || 'N/A'}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Age</p>
                            <p className="text-gray-800">{selectedEmployee.personalInfo.age}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Gender</p>
                            <p className="text-gray-800">{selectedEmployee.personalInfo.gender}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Citizenship</p>
                            <p className="text-gray-800">{selectedEmployee.personalInfo.citizenship || 'N/A'}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Civil Status</p>
                            <p className="text-gray-800">{selectedEmployee.personalInfo.civilStatus}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Height (cm)</p>
                            <p className="text-gray-800">{selectedEmployee.personalInfo.height || 'N/A'}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Weight (kg)</p>
                            <p className="text-gray-800">{selectedEmployee.personalInfo.weight || 'N/A'}</p>
                          </div>
                        </div>

                        <div className="mt-6 pt-4 border-t border-gray-200">
                          <h4 className="text-md font-semibold text-gray-700 mb-2">Contact Information</h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <p className="text-sm text-gray-500">Mobile Number</p>
                              <p className="text-gray-800">{selectedEmployee.personalInfo.mobileNo}</p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-500">Telephone Number</p>
                              <p className="text-gray-800">{selectedEmployee.personalInfo.telephoneNo || 'N/A'}</p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-500">Email Address</p>
                              <p className="text-gray-800">{selectedEmployee.personalInfo.emailAddress}</p>
                            </div>
                          </div>
                        </div>

                        <div className="mt-6 pt-4 border-t border-gray-200">
                          <h4 className="text-md font-semibold text-gray-700 mb-2">Government IDs</h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <p className="text-sm text-gray-500">SSS Number</p>
                              <p className="text-gray-800">{selectedEmployee.personalInfo.ssNo || 'N/A'}</p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-500">TIN</p>
                              <p className="text-gray-800">{selectedEmployee.personalInfo.tinNo || 'N/A'}</p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-500">PhilHealth</p>
                              <p className="text-gray-800">{selectedEmployee.personalInfo.philHealthNo || 'N/A'}</p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-500">Pag-IBIG</p>
                              <p className="text-gray-800">{selectedEmployee.personalInfo.pagIbigNo || 'N/A'}</p>
                            </div>
                          </div>
                        </div>
                      </IonCardContent>
                    </IonCard>
                  )}

                  <IonCard className="rounded-xl shadow-md overflow-hidden mb-6">
                    <IonCardHeader className="bg-white border-b">
                      <IonCardTitle className="text-lg font-semibold text-gray-800">Employment Details</IonCardTitle>
                    </IonCardHeader>
                    <IonCardContent className="p-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-gray-500">Employee ID</p>
                          <p className="text-gray-800">{selectedEmployee.employeeId}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Hire Date</p>
                          <p className="text-gray-800">{new Date(selectedEmployee.hireDate).toLocaleDateString()}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Employment Type</p>
                          <p className="text-gray-800">{selectedEmployee.employmentType}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Manager</p>
                          <p className="text-gray-800">{selectedEmployee.manager || "N/A"}</p>
                        </div>
                      </div>
                    </IonCardContent>
                  </IonCard>

                  {/* Rest of the existing modal content */}
                  {/* ... */}
                </div>
              )}
            </IonContent>
          </IonModal>
        </IonContent>
      </IonPage>
    </>
  )
}



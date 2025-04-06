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
} from "lucide-react"
import { employeeData } from "@/data/employee-data"
import Chart from "chart.js/auto"

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
  const [employees, setEmployees] = useState(employeeData)
  const pendingRequestsChartRef = useRef<HTMLCanvasElement>(null)
  const departmentDistributionChartRef = useRef<HTMLCanvasElement>(null)

  // Stats
  const stats = {
    totalEmployees: employees.length,
    activeEmployees: employees.filter((emp) => emp.status === "active").length,
    pendingLeaves: 12,
    pendingScheduleChanges: 5,
    pendingOfficialBusiness: 3,
    absentToday: 2,
    lateToday: 3,
    onLeaveToday: 1,
  }

  useEffect(() => {
    if (!isAuthenticated) {
      history.push("/login")
    }
  }, [isAuthenticated, history])

  // Initialize charts
  useEffect(() => {
    if (pendingRequestsChartRef.current) {
      const ctx = pendingRequestsChartRef.current.getContext("2d")
      if (ctx) {
        const chart = new Chart(ctx, {
          type: "bar",
          data: {
            labels: ["Leaves", "Schedule Changes", "Official Business"],
            datasets: [
              {
                label: "Pending Requests",
                data: [stats.pendingLeaves, stats.pendingScheduleChanges, stats.pendingOfficialBusiness],
                backgroundColor: [
                  "rgba(239, 68, 68, 0.7)", // Red
                  "rgba(59, 130, 246, 0.7)", // Blue
                  "rgba(16, 185, 129, 0.7)", // Green
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

        return () => {
          chart.destroy()
        }
      }
    }
  }, [pendingRequestsChartRef])

  useEffect(() => {
    if (departmentDistributionChartRef.current) {
      const ctx = departmentDistributionChartRef.current.getContext("2d")
      if (ctx) {
        // Count employees by department
        const departments: { [key: string]: number } = {}
        employees.forEach((emp) => {
          if (departments[emp.department]) {
            departments[emp.department]++
          } else {
            departments[emp.department] = 1
          }
        })

        const chart = new Chart(ctx, {
          type: "pie",
          data: {
            labels: Object.keys(departments),
            datasets: [
              {
                data: Object.values(departments),
                backgroundColor: [
                  "rgba(239, 68, 68, 0.7)", // Red
                  "rgba(59, 130, 246, 0.7)", // Blue
                  "rgba(16, 185, 129, 0.7)", // Green
                  "rgba(245, 158, 11, 0.7)", // Amber
                  "rgba(139, 92, 246, 0.7)", // Purple
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

        return () => {
          chart.destroy()
        }
      }
    }
  }, [departmentDistributionChartRef, employees])

  const presentToast = (message: string, color: "success" | "danger" | "warning" = "success") => {
    present({
      message: message,
      duration: 3000,
      position: "bottom",
      color: color,
    })
  }

  const viewEmployee = (employee: any) => {
    setSelectedEmployee(employee)
    setShowEmployeeModal(true)
  }

  const closeEmployeeModal = () => {
    setSelectedEmployee(null)
    setShowEmployeeModal(false)
  }

  const approveRequest = (type: string, id: string) => {
    presentToast(`${type} request approved successfully`)
  }

  const rejectRequest = (type: string, id: string) => {
    presentToast(`${type} request rejected`, "danger")
  }

  const downloadReport = (type: string) => {
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

  const filteredEmployees = employees.filter((employee) => {
    // Filter by department
    if (filterDepartment && employee.department !== filterDepartment) return false

    // Filter by status
    if (filterStatus && employee.status !== filterStatus) return false

    // Filter by search text
    if (searchText) {
      const searchLower = searchText.toLowerCase()
      return (
        employee.name.toLowerCase().includes(searchLower) ||
        employee.email.toLowerCase().includes(searchLower) ||
        employee.position.toLowerCase().includes(searchLower) ||
        employee.department.toLowerCase().includes(searchLower)
      )
    }

    return true
  })

  // Get pending requests
  const pendingLeaveRequests = employees.flatMap((emp) => emp.leaveRequests.filter((req) => req.status === "pending"))

  const pendingScheduleChanges = employees.flatMap((emp) =>
    emp.scheduleChanges.filter((req) => req.status === "pending"),
  )

  const pendingOfficialBusiness = employees.flatMap((emp) =>
    emp.officialBusinessRequests.filter((req) => req.status === "pending"),
  )

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
          </IonToolbar>
        </IonHeader>
        <IonContent className="ion-padding bg-gray-50">
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

            {/* Dashboard Stats */}
            {activeTab === "dashboard" && (
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
                        <h3 className="text-2xl font-bold text-gray-800">{stats.totalEmployees}</h3>
                        <p className="text-xs text-gray-500">{stats.activeEmployees} active</p>
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
                        <h3 className="text-2xl font-bold text-gray-800">{stats.pendingLeaves}</h3>
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
                        <h3 className="text-2xl font-bold text-gray-800">{stats.pendingScheduleChanges}</h3>
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
                        <h3 className="text-2xl font-bold text-gray-800">{stats.pendingOfficialBusiness}</h3>
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
                            <h3 className="text-xl font-bold text-gray-800">{stats.absentToday}</h3>
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
                            <h3 className="text-xl font-bold text-gray-800">{stats.lateToday}</h3>
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
                            <h3 className="text-xl font-bold text-gray-800">{stats.onLeaveToday}</h3>
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
                            <IonSelectOption value="IT">IT</IonSelectOption>
                            <IonSelectOption value="HR">HR</IonSelectOption>
                            <IonSelectOption value="Finance">Finance</IonSelectOption>
                            <IonSelectOption value="Marketing">Marketing</IonSelectOption>
                            <IonSelectOption value="Operations">Operations</IonSelectOption>
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
                      {filteredEmployees.length === 0 ? (
                        <div className="p-8 text-center text-gray-500">
                          <AlertTriangle className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                          <p>No employees found matching your filters.</p>
                        </div>
                      ) : (
                        filteredEmployees.map((employee, index) => (
                          <IonItem
                            key={index}
                            lines="full"
                            detail={false}
                            button
                            onClick={() => viewEmployee(employee)}
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

                {/* Pending Leave Requests */}
                {(activeSubTab === "all" || activeSubTab === "leaves") && (
                  <IonCard className="rounded-xl shadow-md overflow-hidden mb-6">
                    <IonCardHeader className="bg-white border-b p-6">
                      <IonCardTitle className="text-xl font-bold text-gray-800">Pending Leave Requests</IonCardTitle>
                    </IonCardHeader>
                    <IonCardContent className="p-0">
                      <IonList className="px-0">
                        {pendingLeaveRequests.length === 0 ? (
                          <div className="p-8 text-center text-gray-500">
                            <CheckCircle className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                            <p>No pending leave requests.</p>
                          </div>
                        ) : (
                          pendingLeaveRequests.map((request, index) => (
                            <IonItem key={index} lines="full">
                              <div className="flex items-start w-full py-3">
                                <div className="mr-3">
                                  <Calendar className="h-6 w-6 text-red-500" />
                                </div>
                                <div className="flex-1">
                                  <div className="flex flex-col md:flex-row md:justify-between md:items-center">
                                    <div>
                                      <h3 className="font-medium text-gray-800">
                                        {request.employeeName} - {request.type} Leave
                                      </h3>
                                      <p className="text-sm text-gray-500">
                                        {new Date(request.startDate).toLocaleDateString()} -{" "}
                                        {new Date(request.endDate).toLocaleDateString()} ({request.days} days)
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

                {/* Pending Schedule Changes */}
                {(activeSubTab === "all" || activeSubTab === "schedules") && (
                  <IonCard className="rounded-xl shadow-md overflow-hidden mb-6">
                    <IonCardHeader className="bg-white border-b p-6">
                      <IonCardTitle className="text-xl font-bold text-gray-800">Pending Schedule Changes</IonCardTitle>
                    </IonCardHeader>
                    <IonCardContent className="p-0">
                      <IonList className="px-0">
                        {pendingScheduleChanges.length === 0 ? (
                          <div className="p-8 text-center text-gray-500">
                            <CheckCircle className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                            <p>No pending schedule change requests.</p>
                          </div>
                        ) : (
                          pendingScheduleChanges.map((request, index) => (
                            <IonItem key={index} lines="full">
                              <div className="flex items-start w-full py-3">
                                <div className="mr-3">
                                  <Clock className="h-6 w-6 text-blue-500" />
                                </div>
                                <div className="flex-1">
                                  <div className="flex flex-col md:flex-row md:justify-between md:items-center">
                                    <div>
                                      <h3 className="font-medium text-gray-800">
                                        {request.employeeName} - Schedule Change
                                      </h3>
                                      <p className="text-sm text-gray-500">
                                        Date: {new Date(request.date).toLocaleDateString()}
                                      </p>
                                      <p className="text-sm text-gray-600 mt-1">
                                        From: {request.currentSchedule} → To: {request.requestedSchedule}
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

                {/* Pending Official Business */}
                {(activeSubTab === "all" || activeSubTab === "official") && (
                  <IonCard className="rounded-xl shadow-md overflow-hidden mb-6">
                    <IonCardHeader className="bg-white border-b p-6">
                      <IonCardTitle className="text-xl font-bold text-gray-800">Pending Official Business</IonCardTitle>
                    </IonCardHeader>
                    <IonCardContent className="p-0">
                      <IonList className="px-0">
                        {pendingOfficialBusiness.length === 0 ? (
                          <div className="p-8 text-center text-gray-500">
                            <CheckCircle className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                            <p>No pending official business requests.</p>
                          </div>
                        ) : (
                          pendingOfficialBusiness.map((request, index) => (
                            <IonItem key={index} lines="full">
                              <div className="flex items-start w-full py-3">
                                <div className="mr-3">
                                  <FileText className="h-6 w-6 text-green-500" />
                                </div>
                                <div className="flex-1">
                                  <div className="flex flex-col md:flex-row md:justify-between md:items-center">
                                    <div>
                                      <h3 className="font-medium text-gray-800">
                                        {request.employeeName} - Official Business
                                      </h3>
                                      <p className="text-sm text-gray-500">
                                        Date: {new Date(request.date).toLocaleDateString()}
                                      </p>
                                      <p className="text-sm text-gray-600 mt-1">
                                        Time: {request.startTime} - {request.endTime}
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
                <IonCard className="rounded-xl shadow-md overflow-hidden mb-6">
                  <IonCardHeader className="bg-white border-b p-6">
                    <IonCardTitle className="text-xl font-bold text-gray-800">HR Reports</IonCardTitle>
                  </IonCardHeader>
                  <IonCardContent className="p-0">
                    <IonList className="px-0">
                      <IonItem lines="full" detail={true} button onClick={() => downloadReport("Employee Directory")}>
                        <div className="flex items-center py-3">
                          <div className="bg-red-100 rounded-full p-2 mr-3">
                            <Users className="h-5 w-5 text-red-500" />
                          </div>
                          <IonLabel>
                            <h3 className="font-medium">Employee Directory</h3>
                            <p className="text-sm text-gray-500">Complete list of all employees with contact details</p>
                          </IonLabel>
                        </div>
                      </IonItem>
                      <IonItem lines="full" detail={true} button onClick={() => downloadReport("Attendance Summary")}>
                        <div className="flex items-center py-3">
                          <div className="bg-blue-100 rounded-full p-2 mr-3">
                            <Clock className="h-5 w-5 text-blue-500" />
                          </div>
                          <IonLabel>
                            <h3 className="font-medium">Attendance Summary</h3>
                            <p className="text-sm text-gray-500">
                              Monthly attendance report with absences and late arrivals
                            </p>
                          </IonLabel>
                        </div>
                      </IonItem>
                      <IonItem lines="full" detail={true} button onClick={() => downloadReport("Leave Balance")}>
                        <div className="flex items-center py-3">
                          <div className="bg-green-100 rounded-full p-2 mr-3">
                            <Calendar className="h-5 w-5 text-green-500" />
                          </div>
                          <IonLabel>
                            <h3 className="font-medium">Leave Balance Report</h3>
                            <p className="text-sm text-gray-500">Remaining leave balances for all employees</p>
                          </IonLabel>
                        </div>
                      </IonItem>
                      <IonItem lines="full" detail={true} button onClick={() => downloadReport("Department Summary")}>
                        <div className="flex items-center py-3">
                          <div className="bg-purple-100 rounded-full p-2 mr-3">
                            <Building className="h-5 w-5 text-purple-500" />
                          </div>
                          <IonLabel>
                            <h3 className="font-medium">Department Summary</h3>
                            <p className="text-sm text-gray-500">Employee distribution by department</p>
                          </IonLabel>
                        </div>
                      </IonItem>
                      <IonItem lines="none" detail={true} button onClick={() => downloadReport("Request Analytics")}>
                        <div className="flex items-center py-3">
                          <div className="bg-amber-100 rounded-full p-2 mr-3">
                            <BarChart2 className="h-5 w-5 text-amber-500" />
                          </div>
                          <IonLabel>
                            <h3 className="font-medium">Request Analytics</h3>
                            <p className="text-sm text-gray-500">
                              Analysis of leave, schedule change, and official business requests
                            </p>
                          </IonLabel>
                        </div>
                      </IonItem>
                    </IonList>
                  </IonCardContent>
                </IonCard>
              </div>
            )}
          </div>

          {/* FAB for adding new employee */}
          {activeTab === "employees" && (
            <IonFab vertical="bottom" horizontal="end" slot="fixed">
              <IonFabButton color="danger" onClick={() => history.push("/register")}>
                <UserPlus />
              </IonFabButton>
            </IonFab>
          )}

          {/* Employee Detail Modal */}
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

                  <IonCard className="rounded-xl shadow-md overflow-hidden mb-6">
                    <IonCardHeader className="bg-white border-b">
                      <IonCardTitle className="text-lg font-semibold text-gray-800">Contact Information</IonCardTitle>
                    </IonCardHeader>
                    <IonCardContent className="p-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex items-center">
                          <Mail className="h-5 w-5 text-gray-500 mr-3" />
                          <div>
                            <p className="text-sm text-gray-500">Email</p>
                            <p className="text-gray-800">{selectedEmployee.email}</p>
                          </div>
                        </div>
                        <div className="flex items-center">
                          <Phone className="h-5 w-5 text-gray-500 mr-3" />
                          <div>
                            <p className="text-sm text-gray-500">Phone</p>
                            <p className="text-gray-800">{selectedEmployee.phone}</p>
                          </div>
                        </div>
                        <div className="flex items-center">
                          <Building className="h-5 w-5 text-gray-500 mr-3" />
                          <div>
                            <p className="text-sm text-gray-500">Department</p>
                            <p className="text-gray-800">{selectedEmployee.department}</p>
                          </div>
                        </div>
                        <div className="flex items-center">
                          <Briefcase className="h-5 w-5 text-gray-500 mr-3" />
                          <div>
                            <p className="text-sm text-gray-500">Position</p>
                            <p className="text-gray-800">{selectedEmployee.position}</p>
                          </div>
                        </div>
                      </div>
                    </IonCardContent>
                  </IonCard>

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

                  <IonSegment value="leaves" className="mb-4">
                    <IonSegmentButton value="leaves">
                      <IonLabel>Leaves</IonLabel>
                    </IonSegmentButton>
                    <IonSegmentButton value="timesheets">
                      <IonLabel>Timesheets</IonLabel>
                    </IonSegmentButton>
                    <IonSegmentButton value="requests">
                      <IonLabel>Requests</IonLabel>
                    </IonSegmentButton>
                  </IonSegment>

                  <IonCard className="rounded-xl shadow-md overflow-hidden mb-6">
                    <IonCardHeader className="bg-white border-b">
                      <IonCardTitle className="text-lg font-semibold text-gray-800">Leave Balance</IonCardTitle>
                    </IonCardHeader>
                    <IonCardContent className="p-4">
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div>
                          <p className="text-sm text-gray-500">Annual Leave</p>
                          <p className="text-xl font-semibold text-gray-800">
                            {selectedEmployee.leaveBalance?.annual || 0}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Sick Leave</p>
                          <p className="text-xl font-semibold text-gray-800">
                            {selectedEmployee.leaveBalance?.sick || 0}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Emergency</p>
                          <p className="text-xl font-semibold text-gray-800">
                            {selectedEmployee.leaveBalance?.emergency || 0}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Unpaid</p>
                          <p className="text-xl font-semibold text-gray-800">Unlimited</p>
                        </div>
                      </div>
                    </IonCardContent>
                  </IonCard>

                  <div className="flex justify-end gap-3">
                    <IonButton color="medium" fill="outline" onClick={closeEmployeeModal}>
                      Close
                    </IonButton>
                    <IonButton color="primary">
                      <Edit className="h-4 w-4 mr-2" />
                      Edit
                    </IonButton>
                  </div>
                </div>
              )}
            </IonContent>
          </IonModal>
        </IonContent>
      </IonPage>
    </>
  )
}


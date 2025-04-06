"use client"

import { useEffect, useRef } from "react"
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
  IonGrid,
  IonRow,
  IonCol,
  IonBadge,
  IonItem,
  IonLabel,
  IonList,
} from "@ionic/react"
import { useHistory } from "react-router-dom"
import { useAuth } from "@/hooks/use-auth"
import {
  FileText,
  Calendar,
  User,
  Clock,
  FileSpreadsheet,
  Bell,
  CheckCircle,
  AlertTriangle,
  BarChart2,
  PieChart,
  UserCheck,
  UserX,
  CalendarCheck,
  Timer,
} from "lucide-react"
import SideMenu from "@/components/side-menu"
import Chart from "chart.js/auto"

export default function Dashboard() {
  const { user, isAuthenticated } = useAuth()
  const history = useHistory()
  const attendanceChartRef = useRef<HTMLCanvasElement>(null)
  const leaveBalanceChartRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (!isAuthenticated) {
      history.push("/login")
    }
  }, [isAuthenticated, history])

  // Update the attendance chart colors
  useEffect(() => {
    // Initialize charts when component mounts
    if (attendanceChartRef.current) {
      const attendanceCtx = attendanceChartRef.current.getContext("2d")
      if (attendanceCtx) {
        const attendanceChart = new Chart(attendanceCtx, {
          type: "line",
          data: {
            labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
            datasets: [
              {
                label: "Attendance Rate (%)",
                data: [98, 95, 100, 97, 99, 100],
                borderColor: "#3b82f6", // Changed to blue
                backgroundColor: "rgba(59, 130, 246, 0.1)", // Changed to blue
                tension: 0.3,
                fill: true,
              },
            ],
          },
          options: {
            responsive: true,
            scales: {
              y: {
                min: 90,
                max: 100,
              },
            },
          },
        })

        return () => {
          attendanceChart.destroy()
        }
      }
    }
  }, [attendanceChartRef])

  // Update the leave balance chart colors
  useEffect(() => {
    if (leaveBalanceChartRef.current) {
      const leaveBalanceCtx = leaveBalanceChartRef.current.getContext("2d")
      if (leaveBalanceCtx) {
        const leaveBalanceChart = new Chart(leaveBalanceCtx, {
          type: "pie",
          data: {
            labels: ["Vacation", "Sick", "Emergency", "Remaining"],
            datasets: [
              {
                data: [5, 3, 1, 11],
                backgroundColor: [
                  "rgba(239, 68, 68, 0.8)", // Red
                  "rgba(16, 185, 129, 0.8)", // Green
                  "rgba(245, 158, 11, 0.8)", // Amber
                  "rgba(59, 130, 246, 0.8)", // Blue
                ],
                borderColor: "#ffffff",
              },
            ],
          },
          options: {
            responsive: true,
          },
        })

        return () => {
          leaveBalanceChart.destroy()
        }
      }
    }
  }, [leaveBalanceChartRef])

  const navigateTo = (path: string) => {
    history.push(path)
  }

  // Mock data for notifications and recent activities
  const notifications = [
    {
      id: 1,
      title: "Leave Request Approved",
      message: "Your leave request for June 15-16 has been approved",
      date: "2 hours ago",
      read: false,
      type: "success",
    },
    {
      id: 2,
      title: "New Announcement",
      message: "All staff meeting scheduled for Friday, 3:00 PM",
      date: "Yesterday",
      read: true,
      type: "info",
    },
    {
      id: 3,
      title: "Timesheet Reminder",
      message: "Please submit your timesheet for this week",
      date: "2 days ago",
      read: false,
      type: "warning",
    },
  ]

  const recentActivities = [
    { id: 1, title: "Submitted Change of Schedule", date: "Today, 9:30 AM" },
    { id: 2, title: "Updated Personal Information", date: "Yesterday, 2:15 PM" },
    { id: 3, title: "Submitted Official Business Form", date: "May 2, 2023" },
  ]

  // Mock data for attendance stats
  const attendanceStats = {
    daysPresent: 21,
    daysAbsent: 2,
    lateCount: 3,
    totalLeaves: 10,
    approvedLeaves: 8,
    pendingLeaves: 2,
    totalWorkHours: 168,
    overtimeHours: 5,
  }

  return (
    <>
      <SideMenu />
      <IonPage id="main-content">
        <IonHeader className="shadow-sm">
          <IonToolbar className="bg-white">
            <IonButtons slot="start">
              <IonMenuButton></IonMenuButton>
            </IonButtons>
            <IonTitle className="font-semibold text-gray-800">Dashboard</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent className="ion-padding bg-gray-50">
          <div className="p-4 md:p-6">
            {/* Welcome Banner */}
            <div className="bg-red-500 rounded-xl shadow-lg p-6 mb-8">
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between">
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">Welcome, {user?.name || "User"}</h1>
                  <p className="text-red-100">Access your employee dashboard tools below</p>
                </div>
                <div className="mt-4 md:mt-0">
                  <div className="bg-white/20 backdrop-blur-sm rounded-lg px-4 py-2 text-white">
                    <p className="text-sm font-medium">
                      Today is{" "}
                      {new Date().toLocaleDateString("en-US", {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Attendance Stats Cards */}
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Attendance Overview</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              {/* Present Days Card */}
              <IonCard className="rounded-xl overflow-hidden shadow-md m-0">
                <div className="flex items-start p-4">
                  <div className="bg-green-100 rounded-full p-3 mr-3">
                    <UserCheck className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 font-medium">Present Days</p>
                    <h3 className="text-2xl font-bold text-gray-800">{attendanceStats.daysPresent}</h3>
                    <p className="text-xs text-gray-500">This month</p>
                  </div>
                </div>
              </IonCard>

              {/* Absent Days Card */}
              <IonCard className="rounded-xl overflow-hidden shadow-md m-0">
                <div className="flex items-start p-4">
                  <div className="bg-red-100 rounded-full p-3 mr-3">
                    <UserX className="h-6 w-6 text-red-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 font-medium">Absent Days</p>
                    <h3 className="text-2xl font-bold text-gray-800">{attendanceStats.daysAbsent}</h3>
                    <p className="text-xs text-gray-500">This month</p>
                  </div>
                </div>
              </IonCard>

              {/* Approved Leaves Card */}
              <IonCard className="rounded-xl overflow-hidden shadow-md m-0">
                <div className="flex items-start p-4">
                  <div className="bg-blue-100 rounded-full p-3 mr-3">
                    <CalendarCheck className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 font-medium">Approved Leaves</p>
                    <h3 className="text-2xl font-bold text-gray-800">{attendanceStats.approvedLeaves}</h3>
                    <p className="text-xs text-gray-500">Out of {attendanceStats.totalLeaves}</p>
                  </div>
                </div>
              </IonCard>

              {/* Work Hours Card */}
              <IonCard className="rounded-xl overflow-hidden shadow-md m-0">
                <div className="flex items-start p-4">
                  <div className="bg-amber-100 rounded-full p-3 mr-3">
                    <Timer className="h-6 w-6 text-amber-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 font-medium">Work Hours</p>
                    <h3 className="text-2xl font-bold text-gray-800">{attendanceStats.totalWorkHours}</h3>
                    <p className="text-xs text-gray-500">+{attendanceStats.overtimeHours} overtime</p>
                  </div>
                </div>
              </IonCard>
            </div>

            {/* Analytics Section */}
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Analytics</h2>
            <IonGrid>
              <IonRow>
                <IonCol size="12" sizeMd="6">
                  <IonCard className="rounded-xl overflow-hidden">
                    <IonCardHeader className="bg-white border-b">
                      <IonCardTitle className="flex items-center text-lg font-semibold text-gray-800">
                        <BarChart2 className="mr-3 h-5 w-5 text-red-500" />
                        Attendance Rate
                      </IonCardTitle>
                    </IonCardHeader>
                    <IonCardContent className="p-4">
                      <canvas ref={attendanceChartRef}></canvas>
                    </IonCardContent>
                  </IonCard>
                </IonCol>
                <IonCol size="12" sizeMd="6">
                  <IonCard className="rounded-xl overflow-hidden">
                    <IonCardHeader className="bg-white border-b">
                      <IonCardTitle className="flex items-center text-lg font-semibold text-gray-800">
                        <PieChart className="mr-3 h-5 w-5 text-red-500" />
                        Leave Balance
                      </IonCardTitle>
                    </IonCardHeader>
                    <IonCardContent className="p-4">
                      <canvas ref={leaveBalanceChartRef}></canvas>
                    </IonCardContent>
                  </IonCard>
                </IonCol>
              </IonRow>
            </IonGrid>

            <IonGrid className="mt-6">
              <IonRow>
                {/* Main Dashboard Cards */}
                <IonCol size="12" sizeMd="8">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                    <IonCard
                      onClick={() => navigateTo("/time-keeping")}
                      className="cursor-pointer rounded-xl overflow-hidden transform transition-all duration-300 hover:shadow-xl hover:scale-105 border-t-4 border-red-500 m-0"
                    >
                      <IonCardHeader className="bg-white">
                        <IonCardTitle className="flex items-center text-lg font-semibold text-gray-800">
                          <Clock className="mr-3 h-6 w-6 text-red-500" />
                          Time Keeping
                        </IonCardTitle>
                      </IonCardHeader>
                      <IonCardContent className="py-4 text-gray-600">
                        <p>Track your attendance and work hours</p>
                        <div className="mt-4 text-sm text-red-600 flex items-center">
                          <span>Access now</span>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4 ml-1"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fillRule="evenodd"
                              d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </div>
                      </IonCardContent>
                    </IonCard>

                    <IonCard
                      onClick={() => navigateTo("/leaves")}
                      className="cursor-pointer rounded-xl overflow-hidden transform transition-all duration-300 hover:shadow-xl hover:scale-105 border-t-4 border-red-500 m-0"
                    >
                      <IonCardHeader className="bg-white">
                        <IonCardTitle className="flex items-center text-lg font-semibold text-gray-800">
                          <Calendar className="mr-3 h-6 w-6 text-red-500" />
                          Leave Management
                        </IonCardTitle>
                      </IonCardHeader>
                      <IonCardContent className="py-4 text-gray-600">
                        <p>Request and track your leaves</p>
                        <div className="mt-4 text-sm text-red-600 flex items-center">
                          <span>Access now</span>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4 ml-1"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fillRule="evenodd"
                              d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </div>
                      </IonCardContent>
                    </IonCard>

                    <IonCard
                      onClick={() => navigateTo("/personal-info")}
                      className="cursor-pointer rounded-xl overflow-hidden transform transition-all duration-300 hover:shadow-xl hover:scale-105 border-t-4 border-red-500 m-0"
                    >
                      <IonCardHeader className="bg-white">
                        <IonCardTitle className="flex items-center text-lg font-semibold text-gray-800">
                          <User className="mr-3 h-6 w-6 text-red-500" />
                          Personal Info
                        </IonCardTitle>
                      </IonCardHeader>
                      <IonCardContent className="py-4 text-gray-600">
                        <p>View and update your personal information</p>
                        <div className="mt-4 text-sm text-red-600 flex items-center">
                          <span>Access now</span>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4 ml-1"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fillRule="evenodd"
                              d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </div>
                      </IonCardContent>
                    </IonCard>
                  </div>

                  {/* Recent Activities */}
                  <IonCard className="rounded-xl overflow-hidden mb-6">
                    <IonCardHeader className="bg-white border-b">
                      <IonCardTitle className="text-lg font-semibold text-gray-800">Recent Activities</IonCardTitle>
                    </IonCardHeader>
                    <IonCardContent className="p-0">
                      <IonList className="px-0">
                        {recentActivities.map((activity) => (
                          <IonItem key={activity.id} lines="full" detail={true}>
                            <div className="flex items-center py-2">
                              <div className="bg-gray-100 rounded-full p-2 mr-3">
                                <CheckCircle className="h-5 w-5 text-red-500" />
                              </div>
                              <IonLabel>
                                <h3 className="font-medium">{activity.title}</h3>
                                <p className="text-sm text-gray-500">{activity.date}</p>
                              </IonLabel>
                            </div>
                          </IonItem>
                        ))}
                      </IonList>
                      <div className="p-4 text-center">
                        <a href="#" className="text-red-500 text-sm font-medium">
                          View All Activities
                        </a>
                      </div>
                    </IonCardContent>
                  </IonCard>
                </IonCol>

                {/* Sidebar */}
                <IonCol size="12" sizeMd="4">
                  {/* Notifications */}
                  <IonCard className="rounded-xl overflow-hidden mb-6">
                    <IonCardHeader className="bg-white border-b flex justify-between items-center">
                      <IonCardTitle className="text-lg font-semibold text-gray-800">Notifications</IonCardTitle>
                      <IonBadge color="danger" className="rounded-full">
                        {notifications.filter((n) => !n.read).length}
                      </IonBadge>
                    </IonCardHeader>
                    <IonCardContent className="p-0">
                      <IonList className="px-0">
                        {notifications.map((notification) => (
                          <IonItem key={notification.id} lines="full" className={notification.read ? "opacity-70" : ""}>
                            <div className="flex items-start py-2 w-full">
                              <div className="bg-red-100 rounded-full p-2 mr-3">
                                {notification.type === "success" ? (
                                  <CheckCircle className="h-5 w-5 text-red-500" />
                                ) : notification.type === "warning" ? (
                                  <AlertTriangle className="h-5 w-5 text-red-500" />
                                ) : (
                                  <Bell className="h-5 w-5 text-red-500" />
                                )}
                              </div>
                              <div className="flex-1">
                                <h3 className="font-medium">{notification.title}</h3>
                                <p className="text-sm text-gray-600 mb-1">{notification.message}</p>
                                <p className="text-xs text-gray-500">{notification.date}</p>
                              </div>
                              {!notification.read && <div className="h-2 w-2 bg-red-500 rounded-full"></div>}
                            </div>
                          </IonItem>
                        ))}
                      </IonList>
                      <div className="p-4 text-center">
                        <a href="#" className="text-red-500 text-sm font-medium">
                          View All Notifications
                        </a>
                      </div>
                    </IonCardContent>
                  </IonCard>

                  {/* Quick Access */}
                  <IonCard className="rounded-xl overflow-hidden">
                    <IonCardHeader className="bg-white border-b">
                      <IonCardTitle className="text-lg font-semibold text-gray-800">Quick Access</IonCardTitle>
                    </IonCardHeader>
                    <IonCardContent className="p-0">
                      <IonList className="px-0">
                        <IonItem lines="full" detail={true} onClick={() => navigateTo("/official-business")}>
                          <div className="flex items-center py-2">
                            <div className="bg-red-100 rounded-full p-2 mr-3">
                              <FileText className="h-5 w-5 text-red-500" />
                            </div>
                            <IonLabel>
                              <h3 className="font-medium">Official Business</h3>
                            </IonLabel>
                          </div>
                        </IonItem>
                        <IonItem lines="full" detail={true} onClick={() => navigateTo("/change-schedule")}>
                          <div className="flex items-center py-2">
                            <div className="bg-red-100 rounded-full p-2 mr-3">
                              <Calendar className="h-5 w-5 text-red-500" />
                            </div>
                            <IonLabel>
                              <h3 className="font-medium">Change Schedule</h3>
                            </IonLabel>
                          </div>
                        </IonItem>
                        <IonItem lines="none" detail={true} onClick={() => navigateTo("/reports")}>
                          <div className="flex items-center py-2">
                            <div className="bg-red-100 rounded-full p-2 mr-3">
                              <FileSpreadsheet className="h-5 w-5 text-red-500" />
                            </div>
                            <IonLabel>
                              <h3 className="font-medium">Reports</h3>
                            </IonLabel>
                          </div>
                        </IonItem>
                      </IonList>
                    </IonCardContent>
                  </IonCard>
                </IonCol>
              </IonRow>
            </IonGrid>
          </div>
        </IonContent>
      </IonPage>
    </>
  )
}


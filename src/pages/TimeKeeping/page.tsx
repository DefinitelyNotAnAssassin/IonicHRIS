"use client"

import { useState, useEffect } from "react"
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
} from "@ionic/react"
import { useHistory } from "react-router-dom"
import { useAuth } from "@/hooks/use-auth"
import SideMenu from "@/components/side-menu"
import { Calendar, AlertTriangle, ChevronDown, ChevronUp, Filter, Clock, Download, FileText } from "lucide-react"
import { employeeData } from "@/data/employee-data"

export default function TimeKeeping() {
  const { user, isAuthenticated } = useAuth()
  const history = useHistory()
  const [present] = useIonToast()
  const [activeTab, setActiveTab] = useState<string>("current")
  const [searchText, setSearchText] = useState("")
  const [filterMonth, setFilterMonth] = useState(new Date().getMonth().toString())
  const [filterYear, setFilterYear] = useState(new Date().getFullYear().toString())
  const [expandedDay, setExpandedDay] = useState<number | null>(null)

  // Get current user's timesheet data
  const currentUserEmail = user?.email || ""
  const currentEmployee = employeeData.find((emp) => emp.email === currentUserEmail) || employeeData[0]
  const [timeRecords, setTimeRecords] = useState(currentEmployee.timeRecords)

  useEffect(() => {
    if (!isAuthenticated) {
      history.push("/login")
    }
  }, [isAuthenticated, history])

  const presentToast = (message: string, color: "success" | "danger" | "warning" = "success") => {
    present({
      message: message,
      duration: 3000,
      position: "bottom",
      color: color,
    })
  }

  const toggleExpandDay = (index: number) => {
    if (expandedDay === index) {
      setExpandedDay(null)
    } else {
      setExpandedDay(index)
    }
  }

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { weekday: "long", year: "numeric", month: "long", day: "numeric" }
    return new Date(dateString).toLocaleDateString("en-US", options)
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "present":
        return (
          <IonBadge color="success" className="rounded-full">
            Present
          </IonBadge>
        )
      case "late":
        return (
          <IonBadge color="warning" className="rounded-full">
            Late
          </IonBadge>
        )
      case "absent":
        return (
          <IonBadge color="danger" className="rounded-full">
            Absent
          </IonBadge>
        )
      default:
        return (
          <IonBadge color="medium" className="rounded-full">
            Pending
          </IonBadge>
        )
    }
  }

  const filteredRecords = timeRecords.filter((record) => {
    // Filter by month and year
    const recordDate = new Date(record.date)
    const recordMonth = recordDate.getMonth().toString()
    const recordYear = recordDate.getFullYear().toString()

    if (filterMonth !== "" && recordMonth !== filterMonth) return false
    if (filterYear !== "" && recordYear !== filterYear) return false

    // Filter by search text
    if (searchText) {
      return (
        record.date.includes(searchText) ||
        record.status.includes(searchText) ||
        record.remarks.toLowerCase().includes(searchText.toLowerCase())
      )
    }
    return true
  })

  const downloadTimesheet = () => {
    presentToast("Timesheet downloaded successfully")
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
            <IonTitle>Timesheet</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent className="ion-padding bg-gray-50">
          <div className="max-w-6xl mx-auto py-6">
            {/* Header Section */}
            <div className="bg-red-500 rounded-xl shadow-lg p-6 mb-8 text-white">
              <div className="flex items-center">
                <Clock className="h-8 w-8 mr-4" />
                <div>
                  <h1 className="text-2xl font-bold">Timesheet</h1>
                  <p className="text-red-100">View your attendance and work hours</p>
                </div>
              </div>
            </div>

            <IonSegment value={activeTab} onIonChange={(e) => setActiveTab(e.detail.value as string)} className="mb-6">
              <IonSegmentButton value="current">
                <IonLabel>Current Period</IonLabel>
              </IonSegmentButton>
              <IonSegmentButton value="previous">
                <IonLabel>Previous Periods</IonLabel>
              </IonSegmentButton>
              <IonSegmentButton value="summary">
                <IonLabel>Summary</IonLabel>
              </IonSegmentButton>
            </IonSegment>

            {activeTab === "current" && (
              <div>
                <IonCard className="rounded-xl shadow-md overflow-hidden mb-6">
                  <IonCardHeader className="bg-white border-b p-6 flex justify-between items-center">
                    <IonCardTitle className="text-xl font-bold text-gray-800">Current Period Timesheet</IonCardTitle>
                    <IonButton color="danger" fill="outline" onClick={downloadTimesheet}>
                      <Download className="h-4 w-4 mr-2" />
                      Download
                    </IonButton>
                  </IonCardHeader>
                  <IonCardContent className="p-0">
                    <div className="p-4 border-b bg-gray-50">
                      <div className="flex flex-col md:flex-row gap-4 items-center">
                        <div className="flex-1">
                          <IonSearchbar
                            value={searchText}
                            onIonChange={(e) => setSearchText(e.detail.value!)}
                            placeholder="Search by date or status"
                            className="rounded-lg"
                          ></IonSearchbar>
                        </div>
                        <div className="flex gap-2 items-center">
                          <Filter className="h-5 w-5 text-gray-500" />
                          <IonSelect
                            interface="popover"
                            value={filterMonth}
                            placeholder="Month"
                            onIonChange={(e) => setFilterMonth(e.detail.value)}
                          >
                            <IonSelectOption value="">All Months</IonSelectOption>
                            <IonSelectOption value="0">January</IonSelectOption>
                            <IonSelectOption value="1">February</IonSelectOption>
                            <IonSelectOption value="2">March</IonSelectOption>
                            <IonSelectOption value="3">April</IonSelectOption>
                            <IonSelectOption value="4">May</IonSelectOption>
                            <IonSelectOption value="5">June</IonSelectOption>
                            <IonSelectOption value="6">July</IonSelectOption>
                            <IonSelectOption value="7">August</IonSelectOption>
                            <IonSelectOption value="8">September</IonSelectOption>
                            <IonSelectOption value="9">October</IonSelectOption>
                            <IonSelectOption value="10">November</IonSelectOption>
                            <IonSelectOption value="11">December</IonSelectOption>
                          </IonSelect>
                          <IonSelect
                            interface="popover"
                            value={filterYear}
                            placeholder="Year"
                            onIonChange={(e) => setFilterYear(e.detail.value)}
                          >
                            <IonSelectOption value="">All Years</IonSelectOption>
                            <IonSelectOption value="2023">2023</IonSelectOption>
                            <IonSelectOption value="2022">2022</IonSelectOption>
                            <IonSelectOption value="2021">2021</IonSelectOption>
                          </IonSelect>
                        </div>
                      </div>
                    </div>
                    <IonList className="px-0">
                      {filteredRecords.length === 0 ? (
                        <div className="p-8 text-center text-gray-500">
                          <AlertTriangle className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                          <p>No timesheet records found for the selected filters.</p>
                        </div>
                      ) : (
                        filteredRecords.map((record, index) => (
                          <div key={index} className="border-b last:border-b-0">
                            <IonItem
                              lines="none"
                              detail={false}
                              button
                              onClick={() => toggleExpandDay(index)}
                              className="py-2"
                            >
                              <div className="flex items-center w-full">
                                <div className="mr-3">
                                  <Calendar className="h-6 w-6 text-red-500" />
                                </div>
                                <div className="flex-1">
                                  <div className="flex justify-between items-center">
                                    <div>
                                      <h3 className="font-medium text-gray-800">{formatDate(record.date)}</h3>
                                      <p className="text-sm text-gray-500">
                                        {record.status !== "absent"
                                          ? `${record.clockIn} - ${record.clockOut}`
                                          : "Not clocked in"}
                                      </p>
                                    </div>
                                    <div className="flex items-center">
                                      {getStatusBadge(record.status)}
                                      {expandedDay === index ? (
                                        <ChevronUp className="h-5 w-5 ml-3 text-gray-500" />
                                      ) : (
                                        <ChevronDown className="h-5 w-5 ml-3 text-gray-500" />
                                      )}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </IonItem>

                            {expandedDay === index && (
                              <div className="px-4 py-3 bg-gray-50">
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                  <div className="bg-white p-3 rounded-lg shadow-sm">
                                    <p className="text-sm text-gray-500">Clock In</p>
                                    <p className="text-lg font-semibold text-gray-800">{record.clockIn || "N/A"}</p>
                                  </div>
                                  <div className="bg-white p-3 rounded-lg shadow-sm">
                                    <p className="text-sm text-gray-500">Clock Out</p>
                                    <p className="text-lg font-semibold text-gray-800">{record.clockOut || "N/A"}</p>
                                  </div>
                                  <div className="bg-white p-3 rounded-lg shadow-sm">
                                    <p className="text-sm text-gray-500">Total Hours</p>
                                    <p className="text-lg font-semibold text-gray-800">{record.totalHours}</p>
                                  </div>
                                </div>
                                {record.remarks && (
                                  <div className="mt-3 p-3 bg-white rounded-lg shadow-sm">
                                    <p className="text-sm text-gray-500">Remarks</p>
                                    <p className="text-gray-800">{record.remarks}</p>
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        ))
                      )}
                    </IonList>
                  </IonCardContent>
                </IonCard>
              </div>
            )}

            {activeTab === "previous" && (
              <div>
                <IonCard className="rounded-xl shadow-md overflow-hidden">
                  <IonCardHeader className="bg-white border-b p-6">
                    <IonCardTitle className="text-xl font-bold text-gray-800">Previous Periods</IonCardTitle>
                  </IonCardHeader>
                  <IonCardContent className="p-0">
                    <IonList className="px-0">
                      <IonItem lines="full" detail={true} button onClick={downloadTimesheet}>
                        <div className="flex items-center py-2">
                          <div className="bg-red-100 rounded-full p-2 mr-3">
                            <FileText className="h-5 w-5 text-red-500" />
                          </div>
                          <IonLabel>
                            <h3 className="font-medium">May 2023 Timesheet</h3>
                            <p className="text-sm text-gray-500">May 1 - May 31, 2023</p>
                          </IonLabel>
                        </div>
                      </IonItem>
                      <IonItem lines="full" detail={true} button onClick={downloadTimesheet}>
                        <div className="flex items-center py-2">
                          <div className="bg-red-100 rounded-full p-2 mr-3">
                            <FileText className="h-5 w-5 text-red-500" />
                          </div>
                          <IonLabel>
                            <h3 className="font-medium">April 2023 Timesheet</h3>
                            <p className="text-sm text-gray-500">April 1 - April 30, 2023</p>
                          </IonLabel>
                        </div>
                      </IonItem>
                      <IonItem lines="full" detail={true} button onClick={downloadTimesheet}>
                        <div className="flex items-center py-2">
                          <div className="bg-red-100 rounded-full p-2 mr-3">
                            <FileText className="h-5 w-5 text-red-500" />
                          </div>
                          <IonLabel>
                            <h3 className="font-medium">March 2023 Timesheet</h3>
                            <p className="text-sm text-gray-500">March 1 - March 31, 2023</p>
                          </IonLabel>
                        </div>
                      </IonItem>
                      <IonItem lines="full" detail={true} button onClick={downloadTimesheet}>
                        <div className="flex items-center py-2">
                          <div className="bg-red-100 rounded-full p-2 mr-3">
                            <FileText className="h-5 w-5 text-red-500" />
                          </div>
                          <IonLabel>
                            <h3 className="font-medium">February 2023 Timesheet</h3>
                            <p className="text-sm text-gray-500">February 1 - February 28, 2023</p>
                          </IonLabel>
                        </div>
                      </IonItem>
                      <IonItem lines="none" detail={true} button onClick={downloadTimesheet}>
                        <div className="flex items-center py-2">
                          <div className="bg-red-100 rounded-full p-2 mr-3">
                            <FileText className="h-5 w-5 text-red-500" />
                          </div>
                          <IonLabel>
                            <h3 className="font-medium">January 2023 Timesheet</h3>
                            <p className="text-sm text-gray-500">January 1 - January 31, 2023</p>
                          </IonLabel>
                        </div>
                      </IonItem>
                    </IonList>
                  </IonCardContent>
                </IonCard>
              </div>
            )}

            {activeTab === "summary" && (
              <div>
                <IonCard className="rounded-xl shadow-md overflow-hidden">
                  <IonCardHeader className="bg-white border-b p-6">
                    <IonCardTitle className="text-xl font-bold text-gray-800">Monthly Summary</IonCardTitle>
                  </IonCardHeader>
                  <IonCardContent className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                      <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                        <p className="text-sm text-gray-500 mb-1">Present Days</p>
                        <p className="text-2xl font-bold text-gray-800">18</p>
                        <div className="flex items-center mt-2">
                          <div className="h-2 flex-1 bg-gray-200 rounded-full overflow-hidden">
                            <div className="h-full bg-green-500 rounded-full" style={{ width: "90%" }}></div>
                          </div>
                          <span className="text-sm text-gray-500 ml-2">90%</span>
                        </div>
                      </div>

                      <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                        <p className="text-sm text-gray-500 mb-1">Late Days</p>
                        <p className="text-2xl font-bold text-gray-800">2</p>
                        <div className="flex items-center mt-2">
                          <div className="h-2 flex-1 bg-gray-200 rounded-full overflow-hidden">
                            <div className="h-full bg-yellow-500 rounded-full" style={{ width: "10%" }}></div>
                          </div>
                          <span className="text-sm text-gray-500 ml-2">10%</span>
                        </div>
                      </div>

                      <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                        <p className="text-sm text-gray-500 mb-1">Absent Days</p>
                        <p className="text-2xl font-bold text-gray-800">0</p>
                        <div className="flex items-center mt-2">
                          <div className="h-2 flex-1 bg-gray-200 rounded-full overflow-hidden">
                            <div className="h-full bg-red-500 rounded-full" style={{ width: "0%" }}></div>
                          </div>
                          <span className="text-sm text-gray-500 ml-2">0%</span>
                        </div>
                      </div>

                      <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                        <p className="text-sm text-gray-500 mb-1">Total Work Hours</p>
                        <p className="text-2xl font-bold text-gray-800">162.5</p>
                        <p className="text-xs text-gray-500 mt-2">Average: 8.1 hours/day</p>
                      </div>
                    </div>

                    <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 mb-6">
                      <h3 className="text-lg font-semibold text-gray-800 mb-3">Overtime Summary</h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="bg-white p-3 rounded-lg shadow-sm">
                          <p className="text-sm text-gray-500">Total Overtime</p>
                          <p className="text-xl font-semibold text-gray-800">5.5 hours</p>
                        </div>
                        <div className="bg-white p-3 rounded-lg shadow-sm">
                          <p className="text-sm text-gray-500">Approved Overtime</p>
                          <p className="text-xl font-semibold text-gray-800">4.0 hours</p>
                        </div>
                        <div className="bg-white p-3 rounded-lg shadow-sm">
                          <p className="text-sm text-gray-500">Pending Approval</p>
                          <p className="text-xl font-semibold text-gray-800">1.5 hours</p>
                        </div>
                      </div>
                    </div>

                    <div className="text-center">
                      <IonButton color="danger" fill="outline" onClick={downloadTimesheet}>
                        <Download className="h-4 w-4 mr-2" />
                        Download Monthly Report
                      </IonButton>
                    </div>
                  </IonCardContent>
                </IonCard>
              </div>
            )}
          </div>
        </IonContent>
      </IonPage>
    </>
  )
}


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
  IonGrid,
  IonRow,
  IonCol,
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
  IonInput,
  IonTextarea,
  IonModal,
  IonDatetime,
  IonFab,
  IonFabButton,
} from "@ionic/react"
import { useHistory } from "react-router-dom"
import { useAuth } from "@/hooks/use-auth"
import SideMenu from "@/components/side-menu"
import { Calendar, AlertTriangle, ChevronDown, ChevronUp, Filter, Plus, Send, Trash2 } from "lucide-react"

export default function Leaves() {
  const { user, isAuthenticated } = useAuth()
  const history = useHistory()
  const [present] = useIonToast()
  const [activeTab, setActiveTab] = useState<string>("pending")
  const [searchText, setSearchText] = useState("")
  const [filterYear, setFilterYear] = useState(new Date().getFullYear().toString())
  const [expandedLeave, setExpandedLeave] = useState<number | null>(null)
  const [showNewLeaveModal, setShowNewLeaveModal] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // New leave form data
  const [newLeaveForm, setNewLeaveForm] = useState({
    leaveType: "annual",
    startDate: new Date().toISOString(),
    endDate: new Date().toISOString(),
    reason: "",
    contactNumber: "",
    attachments: [] as File[],
  })

  // Mock data for leave balance
  const leaveBalance = {
    annual: 15,
    sick: 10,
    emergency: 5,
    maternity: 60,
    paternity: 7,
    bereavement: 3,
    unpaid: "Unlimited",
  }

  // Mock data for leave requests
  const [leaveRequests, setLeaveRequests] = useState([
    {
      id: "L001",
      type: "annual",
      startDate: "2023-06-15",
      endDate: "2023-06-16",
      days: 2,
      reason: "Family vacation",
      status: "approved",
      appliedOn: "2023-06-01",
      approvedBy: "John Manager",
      approvedOn: "2023-06-02",
      remarks: "Approved as requested",
    },
    {
      id: "L002",
      type: "sick",
      startDate: "2023-06-20",
      endDate: "2023-06-20",
      days: 1,
      reason: "Doctor's appointment",
      status: "pending",
      appliedOn: "2023-06-10",
      approvedBy: "",
      approvedOn: "",
      remarks: "",
    },
    {
      id: "L003",
      type: "emergency",
      startDate: "2023-05-05",
      endDate: "2023-05-05",
      days: 1,
      reason: "Family emergency",
      status: "approved",
      appliedOn: "2023-05-04",
      approvedBy: "John Manager",
      approvedOn: "2023-05-04",
      remarks: "Approved due to emergency",
    },
    {
      id: "L004",
      type: "annual",
      startDate: "2023-04-10",
      endDate: "2023-04-14",
      days: 5,
      reason: "Personal vacation",
      status: "rejected",
      appliedOn: "2023-03-20",
      approvedBy: "John Manager",
      approvedOn: "2023-03-25",
      remarks: "Rejected due to high workload during that period",
    },
  ])

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

  const toggleExpandLeave = (index: number) => {
    if (expandedLeave === index) {
      setExpandedLeave(null)
    } else {
      setExpandedLeave(index)
    }
  }

  const handleNewLeaveChange = (field: string, value: any) => {
    setNewLeaveForm({
      ...newLeaveForm,
      [field]: value,
    })
  }

  const handleSubmitLeave = () => {
    setIsSubmitting(true)

    // Simulate API call
    setTimeout(() => {
      // Create a new leave request
      const startDate = new Date(newLeaveForm.startDate)
      const endDate = new Date(newLeaveForm.endDate)
      const diffTime = Math.abs(endDate.getTime() - startDate.getTime())
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1

      const newLeave = {
        id: `L00${leaveRequests.length + 1}`,
        type: newLeaveForm.leaveType,
        startDate: startDate.toISOString().split("T")[0],
        endDate: endDate.toISOString().split("T")[0],
        days: diffDays,
        reason: newLeaveForm.reason,
        status: "pending",
        appliedOn: new Date().toISOString().split("T")[0],
        approvedBy: "",
        approvedOn: "",
        remarks: "",
      }

      setLeaveRequests([newLeave, ...leaveRequests])
      setIsSubmitting(false)
      setShowNewLeaveModal(false)

      // Reset form
      setNewLeaveForm({
        leaveType: "annual",
        startDate: new Date().toISOString(),
        endDate: new Date().toISOString(),
        reason: "",
        contactNumber: "",
        attachments: [],
      })

      presentToast("Your leave request has been submitted successfully")
    }, 1500)
  }

  const cancelLeaveRequest = (id: string) => {
    // Simulate API call
    setTimeout(() => {
      const updatedRequests = leaveRequests.filter((leave) => leave.id !== id)
      setLeaveRequests(updatedRequests)
      presentToast("Leave request has been cancelled", "success")
    }, 500)
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "approved":
        return (
          <IonBadge color="success" className="rounded-full p-2 px-4">
            Approved
          </IonBadge>
        )
      case "pending":
        return (
          <IonBadge color="warning" className="rounded-full p-2 px-4">
            Pending
          </IonBadge>
        )
      case "rejected":
        return (
          <IonBadge color="danger" className="rounded-full p-2 px-4">
            Rejected
          </IonBadge>
        )
      default:
        return (
          <IonBadge color="medium" className="rounded-full p-2 px-4">
            Unknown
          </IonBadge>
        )
    }
  }

  const getLeaveTypeLabel = (type: string) => {
    switch (type) {
      case "annual":
        return "Annual Leave"
      case "sick":
        return "Sick Leave"
      case "emergency":
        return "Emergency Leave"
      case "maternity":
        return "Maternity Leave"
      case "paternity":
        return "Paternity Leave"
      case "bereavement":
        return "Bereavement Leave"
      case "unpaid":
        return "Unpaid Leave"
      default:
        return "Other Leave"
    }
  }

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: "numeric", month: "long", day: "numeric" }
    return new Date(dateString).toLocaleDateString("en-US", options)
  }

  const filteredLeaves = leaveRequests.filter((leave) => {
    // Filter by tab
    if (activeTab === "pending" && leave.status !== "pending") return false
    if (activeTab === "approved" && leave.status !== "approved") return false
    if (activeTab === "rejected" && leave.status !== "rejected") return false

    // Filter by search
    if (searchText) {
      return (
        leave.id.toLowerCase().includes(searchText.toLowerCase()) ||
        leave.type.toLowerCase().includes(searchText.toLowerCase()) ||
        leave.reason.toLowerCase().includes(searchText.toLowerCase())
      )
    }

    return true
  })

  return (
    <>
      <SideMenu />
      <IonPage id="main-content">
        <IonHeader>
          <IonToolbar>
            <IonButtons slot="start">
              <IonMenuButton></IonMenuButton>
            </IonButtons>
            <IonTitle>Leave Management</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent className="ion-padding bg-gray-50">
          <div className="max-w-6xl mx-auto py-6">
            {/* Header Section */}
            <div className="bg-red-500 rounded-xl shadow-lg p-6 mb-8 text-white">
              <div className="flex items-center">
                <Calendar className="h-8 w-8 mr-4" />
                <div>
                  <h1 className="text-2xl font-bold">Leave Management</h1>
                  <p className="text-red-100">Request and track your leaves</p>
                </div>
              </div>
            </div>

            {/* Leave Balance Card */}
            <IonCard className="rounded-xl shadow-md overflow-hidden mb-6">
              <IonCardHeader className="bg-white border-b p-6">
                <IonCardTitle className="text-xl font-bold text-gray-800">Leave Balance</IonCardTitle>
              </IonCardHeader>
              <IonCardContent className="p-6">
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <p className="text-sm text-gray-500 mb-1">Annual Leave</p>
                    <p className="text-2xl font-bold text-gray-800">{leaveBalance.annual}</p>
                    <div className="flex items-center mt-2">
                      <div className="h-2 flex-1 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-blue-500 rounded-full"
                          style={{ width: `${(leaveBalance.annual / 20) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <p className="text-sm text-gray-500 mb-1">Sick Leave</p>
                    <p className="text-2xl font-bold text-gray-800">{leaveBalance.sick}</p>
                    <div className="flex items-center mt-2">
                      <div className="h-2 flex-1 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-green-500 rounded-full"
                          style={{ width: `${(leaveBalance.sick / 15) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <p className="text-sm text-gray-500 mb-1">Emergency Leave</p>
                    <p className="text-2xl font-bold text-gray-800">{leaveBalance.emergency}</p>
                    <div className="flex items-center mt-2">
                      <div className="h-2 flex-1 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-amber-500 rounded-full"
                          style={{ width: `${(leaveBalance.emergency / 5) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <p className="text-sm text-gray-500 mb-1">Bereavement Leave</p>
                    <p className="text-2xl font-bold text-gray-800">{leaveBalance.bereavement}</p>
                    <div className="flex items-center mt-2">
                      <div className="h-2 flex-1 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-purple-500 rounded-full"
                          style={{ width: `${(leaveBalance.bereavement / 3) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
              </IonCardContent>
            </IonCard>

            {/* Leave Requests */}
            <IonSegment value={activeTab} onIonChange={(e) => setActiveTab(e.detail.value as string)} className="mb-6">
              <IonSegmentButton value="pending">
                <IonLabel>Pending</IonLabel>
              </IonSegmentButton>
              <IonSegmentButton value="approved">
                <IonLabel>Approved</IonLabel>
              </IonSegmentButton>
              <IonSegmentButton value="rejected">
                <IonLabel>Rejected</IonLabel>
              </IonSegmentButton>
              <IonSegmentButton value="all">
                <IonLabel>All</IonLabel>
              </IonSegmentButton>
            </IonSegment>

            <IonCard className="rounded-xl shadow-md overflow-hidden">
              <IonCardHeader className="bg-white border-b p-6">
                <IonCardTitle className="text-xl font-bold text-gray-800">Leave Requests</IonCardTitle>
              </IonCardHeader>
              <IonCardContent className="p-0">
                <div className="p-4 border-b bg-gray-50">
                  <div className="flex flex-col md:flex-row gap-4 items-center">
                    <div className="flex-1">
                      <IonSearchbar
                        value={searchText}
                        onIonChange={(e) => setSearchText(e.detail.value!)}
                        placeholder="Search by ID, type or reason"
                        className="rounded-lg"
                      ></IonSearchbar>
                    </div>
                    <div className="flex gap-2 items-center">
                      <Filter className="h-5 w-5 text-gray-500" />
                      <IonSelect
                        interface="popover"
                        value={filterYear}
                        placeholder="Year"
                        onIonChange={(e) => setFilterYear(e.detail.value)}
                      >
                        <IonSelectOption value="2023">2023</IonSelectOption>
                        <IonSelectOption value="2022">2022</IonSelectOption>
                        <IonSelectOption value="2021">2021</IonSelectOption>
                      </IonSelect>
                    </div>
                  </div>
                </div>
                <IonList className="px-0">
                  {filteredLeaves.length === 0 ? (
                    <div className="p-8 text-center text-gray-500">
                      <AlertTriangle className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                      <p>No leave requests found for the selected filters.</p>
                    </div>
                  ) : (
                    filteredLeaves.map((leave, index) => (
                      <div key={index} className="border-b last:border-b-0">
                        <IonItem
                          lines="none"
                          detail={false}
                          button
                          onClick={() => toggleExpandLeave(index)}
                          className="py-2"
                        >
                          <div className="flex items-center w-full">
                            <div className="mr-3">
                              <Calendar className="h-6 w-6 text-red-500" />
                            </div>
                            <div className="flex-1">
                              <div className="flex justify-between items-center">
                                <div>
                                  <h3 className="font-medium text-gray-800">{getLeaveTypeLabel(leave.type)}</h3>
                                  <p className="text-sm text-gray-500">
                                    {formatDate(leave.startDate)} - {formatDate(leave.endDate)} ({leave.days}{" "}
                                    {leave.days > 1 ? "days" : "day"})
                                  </p>
                                </div>
                                <div className="flex items-center">
                                  {getStatusBadge(leave.status)}
                                  {expandedLeave === index ? (
                                    <ChevronUp className="h-5 w-5 ml-3 text-gray-500" />
                                  ) : (
                                    <ChevronDown className="h-5 w-5 ml-3 text-gray-500" />
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        </IonItem>

                        {expandedLeave === index && (
                          <div className="px-4 py-3 bg-gray-50">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                              <div className="bg-white p-3 rounded-lg shadow-sm">
                                <p className="text-sm text-gray-500">Leave ID</p>
                                <p className="text-lg font-semibold text-gray-800">{leave.id}</p>
                              </div>
                              <div className="bg-white p-3 rounded-lg shadow-sm">
                                <p className="text-sm text-gray-500">Applied On</p>
                                <p className="text-lg font-semibold text-gray-800">{formatDate(leave.appliedOn)}</p>
                              </div>
                            </div>

                            <div className="bg-white p-3 rounded-lg shadow-sm mb-4">
                              <p className="text-sm text-gray-500">Reason</p>
                              <p className="text-gray-800">{leave.reason}</p>
                            </div>

                            {leave.status !== "pending" && (
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                <div className="bg-white p-3 rounded-lg shadow-sm">
                                  <p className="text-sm text-gray-500">Approved/Rejected By</p>
                                  <p className="text-lg font-semibold text-gray-800">{leave.approvedBy || "N/A"}</p>
                                </div>
                                <div className="bg-white p-3 rounded-lg shadow-sm">
                                  <p className="text-sm text-gray-500">Approved/Rejected On</p>
                                  <p className="text-lg font-semibold text-gray-800">
                                    {leave.approvedOn ? formatDate(leave.approvedOn) : "N/A"}
                                  </p>
                                </div>
                              </div>
                            )}

                            {leave.remarks && (
                              <div className="bg-white p-3 rounded-lg shadow-sm mb-4">
                                <p className="text-sm text-gray-500">Remarks</p>
                                <p className="text-gray-800">{leave.remarks}</p>
                              </div>
                            )}

                            {leave.status === "pending" && (
                              <div className="flex justify-end">
                                <IonButton color="danger" fill="outline" onClick={() => cancelLeaveRequest(leave.id)}>
                                  <Trash2 className="h-4 w-4 mr-2" />
                                  Cancel Request
                                </IonButton>
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

          {/* FAB for new leave request */}
          <IonFab vertical="bottom" horizontal="end" slot="fixed">
            <IonFabButton color="danger" onClick={() => setShowNewLeaveModal(true)}>
              <Plus />
            </IonFabButton>
          </IonFab>

          {/* New Leave Request Modal */}
          <IonModal isOpen={showNewLeaveModal} onDidDismiss={() => setShowNewLeaveModal(false)}>
            <IonHeader>
              <IonToolbar>
                <IonTitle>New Leave Request</IonTitle>
                <IonButtons slot="end">
                  <IonButton onClick={() => setShowNewLeaveModal(false)}>Close</IonButton>
                </IonButtons>
              </IonToolbar>
            </IonHeader>
            <IonContent className="ion-padding">
              <div className="max-w-2xl mx-auto">
                <IonCard className="rounded-xl shadow-md overflow-hidden">
                  <IonCardHeader className="bg-white border-b p-4">
                    <IonCardTitle className="text-lg font-bold text-gray-800">Leave Request Details</IonCardTitle>
                  </IonCardHeader>
                  <IonCardContent className="p-4">
                    <IonGrid>
                      <IonRow>
                        <IonCol size="12">
                          <IonItem className="rounded-lg overflow-hidden shadow-sm mb-4" lines="full">
                            <IonLabel position="stacked" className="text-gray-700 font-medium">
                              Leave Type <span className="text-red-500">*</span>
                            </IonLabel>
                            <IonSelect
                              value={newLeaveForm.leaveType}
                              onIonChange={(e) => handleNewLeaveChange("leaveType", e.detail.value)}
                              interface="popover"
                            >
                              <IonSelectOption value="annual">Annual Leave</IonSelectOption>
                              <IonSelectOption value="sick">Sick Leave</IonSelectOption>
                              <IonSelectOption value="emergency">Emergency Leave</IonSelectOption>
                              <IonSelectOption value="maternity">Maternity Leave</IonSelectOption>
                              <IonSelectOption value="paternity">Paternity Leave</IonSelectOption>
                              <IonSelectOption value="bereavement">Bereavement Leave</IonSelectOption>
                              <IonSelectOption value="unpaid">Unpaid Leave</IonSelectOption>
                            </IonSelect>
                          </IonItem>
                        </IonCol>
                      </IonRow>

                      <IonRow>
                        <IonCol size="12" sizeMd="6">
                          <IonItem className="rounded-lg overflow-hidden shadow-sm mb-4" lines="full">
                            <IonLabel position="stacked" className="text-gray-700 font-medium">
                              Start Date <span className="text-red-500">*</span>
                            </IonLabel>
                            <IonDatetime
                              presentation="date"
                              value={newLeaveForm.startDate}
                              onIonChange={(e) => handleNewLeaveChange("startDate", e.detail.value!)}
                            ></IonDatetime>
                          </IonItem>
                        </IonCol>
                        <IonCol size="12" sizeMd="6">
                          <IonItem className="rounded-lg overflow-hidden shadow-sm mb-4" lines="full">
                            <IonLabel position="stacked" className="text-gray-700 font-medium">
                              End Date <span className="text-red-500">*</span>
                            </IonLabel>
                            <IonDatetime
                              presentation="date"
                              value={newLeaveForm.endDate}
                              onIonChange={(e) => handleNewLeaveChange("endDate", e.detail.value!)}
                            ></IonDatetime>
                          </IonItem>
                        </IonCol>
                      </IonRow>

                      <IonRow>
                        <IonCol size="12">
                          <IonItem className="rounded-lg overflow-hidden shadow-sm mb-4" lines="full">
                            <IonLabel position="stacked" className="text-gray-700 font-medium">
                              Reason <span className="text-red-500">*</span>
                            </IonLabel>
                            <IonTextarea
                              value={newLeaveForm.reason}
                              onIonChange={(e) => handleNewLeaveChange("reason", e.detail.value!)}
                              rows={4}
                              placeholder="Please provide a detailed reason for your leave request"
                            ></IonTextarea>
                          </IonItem>
                        </IonCol>
                      </IonRow>

                      <IonRow>
                        <IonCol size="12">
                          <IonItem className="rounded-lg overflow-hidden shadow-sm mb-4" lines="full">
                            <IonLabel position="stacked" className="text-gray-700 font-medium">
                              Contact Number During Leave
                            </IonLabel>
                            <IonInput
                              value={newLeaveForm.contactNumber}
                              onIonChange={(e) => handleNewLeaveChange("contactNumber", e.detail.value!)}
                              placeholder="Enter contact number"
                            ></IonInput>
                          </IonItem>
                        </IonCol>
                      </IonRow>

                      <IonRow>
                        <IonCol size="12" className="ion-text-center">
                          <IonButton
                            expand="block"
                            color="danger"
                            onClick={handleSubmitLeave}
                            disabled={isSubmitting || !newLeaveForm.reason}
                          >
                            <Send className="h-4 w-4 mr-2" />
                            {isSubmitting ? "Submitting..." : "Submit Leave Request"}
                          </IonButton>
                        </IonCol>
                      </IonRow>
                    </IonGrid>
                  </IonCardContent>
                </IonCard>
              </div>
            </IonContent>
          </IonModal>
        </IonContent>
      </IonPage>
    </>
  )
}


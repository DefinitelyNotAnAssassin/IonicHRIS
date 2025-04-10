"use client"

import type React from "react"

import { useState, useEffect } from "react"
import {
  IonContent,
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonMenuButton,
  IonButton,
  IonInput,
  IonLabel,
  IonTextarea,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardSubtitle,
  IonCardContent,
  IonItem,
  IonGrid,
  IonRow,
  IonCol,
  IonRadioGroup,
  IonRadio,
  IonText,
  IonLoading,
  IonRefresher,
  IonRefresherContent,
  IonBadge,
  IonIcon,
  IonList,
  IonListHeader,
  IonSkeletonText,
  IonToggle,
  IonItemDivider,
  IonDatetime,
  IonPopover,
  IonModal,
} from "@ionic/react"
import { useHistory } from "react-router-dom"
import { useAuth } from "@/hooks/use-auth"
import SideMenu from "@/components/side-menu"
import { Calendar, Clock, User, Briefcase, Building, Send, AlertTriangle, ChevronDown, ChevronUp, X } from "lucide-react"
import { refreshOutline, calendarOutline, timeOutline } from 'ionicons/icons'
import apiService from "@/services/api-service"
import { format } from 'date-fns'

export default function ChangeSchedule() {
  const { user, isAuthenticated } = useAuth()
  const history = useHistory()
  const [isLoading, setIsLoading] = useState(false)
  const [isHistoryLoading, setIsHistoryLoading] = useState(true)
  const [historyExpanded, setHistoryExpanded] = useState(true)
  const [scheduleHistory, setScheduleHistory] = useState<any[]>([])
  const [error, setError] = useState("")
  
  // Time picker state
  const [showCurrentTimePicker, setShowCurrentTimePicker] = useState(false)
  const [showRequestedTimePicker, setShowRequestedTimePicker] = useState(false)
  const [currentTimeStart, setCurrentTimeStart] = useState("08:00")
  const [currentTimeEnd, setCurrentTimeEnd] = useState("17:00")
  const [requestedTimeStart, setRequestedTimeStart] = useState("09:00")
  const [requestedTimeEnd, setRequestedTimeEnd] = useState("18:00")

  const [formData, setFormData] = useState({
    employee_id: "",
    employee_name: "",
    department: "",
    position: "",
    date: new Date().toISOString().split("T")[0],
    date_of_absence: new Date().toISOString().split("T")[0],
    current_schedule: "",
    requested_schedule: "",
    reason: "",
  })

  // Update formData when time pickers change
  useEffect(() => {
    setFormData(prev => ({
      ...prev,
      current_schedule: `${formatTime(currentTimeStart)} - ${formatTime(currentTimeEnd)}`
    }))
  }, [currentTimeStart, currentTimeEnd])

  useEffect(() => {
    setFormData(prev => ({
      ...prev,
      requested_schedule: `${formatTime(requestedTimeStart)} - ${formatTime(requestedTimeEnd)}`
    }))
  }, [requestedTimeStart, requestedTimeEnd])

  useEffect(() => {
    if (!isAuthenticated) {
      history.push("/login")
      return
    }

    if (user) {
      setFormData(prev => ({
        ...prev,
        employee_id: user.id || "",
        employee_name: user.name || "",
        department: user.department || "",
        position: user.position || ""
      }))
      
      fetchScheduleHistory()
    }
  }, [isAuthenticated, history, user])

  const fetchScheduleHistory = async () => {
    if (!user?.id) return
    
    setIsHistoryLoading(true)
    try {
      const response = await apiService.getScheduleChangeRequests(user.id)
      setScheduleHistory(response.records || [])
    } catch (err: any) {
      console.error("Failed to fetch schedule history:", err)
      setError("Failed to load your schedule change history")
    } finally {
      setIsHistoryLoading(false)
    }
  }

  const handleRefresh = async (event: CustomEvent) => {
    await fetchScheduleHistory()
    event.detail.complete()
  }

  const handleChange = (e: any) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      // Validate the form data
      if (!formData.current_schedule || !formData.requested_schedule || !formData.reason) {
        throw new Error("Please fill in all required fields")
      }

      // Submit the schedule change request
      const response = await apiService.submitScheduleChangeRequest(formData)
      
      // Show success message
      presentToast("Your change of schedule request has been submitted successfully")
      
      // Clear form fields that should be reset
      setFormData(prev => ({
        ...prev,
        date: new Date().toISOString().split("T")[0],
        date_of_absence: new Date().toISOString().split("T")[0],
        reason: ""
      }))
      
      // Reset time pickers to default
      setCurrentTimeStart("08:00")
      setCurrentTimeEnd("17:00")
      setRequestedTimeStart("09:00")
      setRequestedTimeEnd("18:00")
      
      // Refresh the history
      fetchScheduleHistory()
    } catch (err: any) {
      console.error("Submit error:", err)
      setError(err.message || "Failed to submit schedule change request. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const cancelRequest = async (requestId: number) => {
    try {
      await apiService.cancelScheduleChange(requestId.toString())
      presentToast("Schedule change request cancelled successfully")
      fetchScheduleHistory()
    } catch (err: any) {
      console.error("Cancel error:", err)
      presentToast("Failed to cancel request: " + (err.message || "Unknown error"))
    }
  }

  const presentToast = (message: string) => {
    const toast = document.createElement("ion-toast")
    toast.message = message
    toast.duration = 2000
    toast.position = "bottom"
    document.body.appendChild(toast)
    return toast.present()
  }

  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(":")
    const hourNum = parseInt(hours)
    const ampm = hourNum >= 12 ? 'PM' : 'AM'
    const hour12 = hourNum % 12 === 0 ? 12 : hourNum % 12
    return `${hour12}:${minutes} ${ampm}`
  }

  const getBadgeColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'approved': return 'success'
      case 'rejected': return 'danger'
      case 'cancelled': return 'medium'
      default: return 'warning'
    }
  }

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'MMM dd, yyyy')
    } catch {
      return dateString
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
            <IonTitle>Change of Schedule</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent className="ion-padding bg-gray-50">
          <IonRefresher slot="fixed" onIonRefresh={handleRefresh}>
            <IonRefresherContent
              pullingIcon={refreshOutline}
              pullingText="Pull to refresh"
              refreshingSpinner="circles"
              refreshingText="Loading history..."
            ></IonRefresherContent>
          </IonRefresher>

          <IonLoading isOpen={isLoading} message="Submitting request..." />

          {/* Current Time Picker Modal */}
          <IonModal isOpen={showCurrentTimePicker} onDidDismiss={() => setShowCurrentTimePicker(false)} className="time-picker-modal">
            <IonHeader>
              <IonToolbar>
                <IonTitle>Current Schedule</IonTitle>
                <IonButtons slot="end">
                  <IonButton onClick={() => setShowCurrentTimePicker(false)}>
                    <X className="h-5 w-5" />
                  </IonButton>
                </IonButtons>
              </IonToolbar>
            </IonHeader>
            <IonContent className="ion-padding">
              <div className="p-4">
                <h2 className="text-lg font-semibold mb-4">Start Time</h2>
                <IonDatetime
                  presentation="time"
                  value={`2023-01-01T${currentTimeStart}`}
                  onIonChange={(e) => {
                    const newTimeValue = new Date(e.detail.value as string).toTimeString().substring(0, 5)
                    setCurrentTimeStart(newTimeValue)
                  }}
                ></IonDatetime>
                
                <h2 className="text-lg font-semibold mt-6 mb-4">End Time</h2>
                <IonDatetime
                  presentation="time"
                  value={`2023-01-01T${currentTimeEnd}`}
                  onIonChange={(e) => {
                    const newTimeValue = new Date(e.detail.value as string).toTimeString().substring(0, 5)
                    setCurrentTimeEnd(newTimeValue)
                  }}
                ></IonDatetime>
                
                <div className="mt-6 text-center">
                  <IonButton expand="block" onClick={() => setShowCurrentTimePicker(false)}>
                    Confirm
                  </IonButton>
                </div>
              </div>
            </IonContent>
          </IonModal>

          {/* Requested Time Picker Modal */}
          <IonModal isOpen={showRequestedTimePicker} onDidDismiss={() => setShowRequestedTimePicker(false)} className="time-picker-modal">
            <IonHeader>
              <IonToolbar>
                <IonTitle>Requested Schedule</IonTitle>
                <IonButtons slot="end">
                  <IonButton onClick={() => setShowRequestedTimePicker(false)}>
                    <X className="h-5 w-5" />
                  </IonButton>
                </IonButtons>
              </IonToolbar>
            </IonHeader>
            <IonContent className="ion-padding">
              <div className="p-4">
                <h2 className="text-lg font-semibold mb-4">Start Time</h2>
                <IonDatetime
                  presentation="time"
                  value={`2023-01-01T${requestedTimeStart}`}
                  onIonChange={(e) => {
                    const newTimeValue = new Date(e.detail.value as string).toTimeString().substring(0, 5)
                    setRequestedTimeStart(newTimeValue)
                  }}
                ></IonDatetime>
                
                <h2 className="text-lg font-semibold mt-6 mb-4">End Time</h2>
                <IonDatetime
                  presentation="time"
                  value={`2023-01-01T${requestedTimeEnd}`}
                  onIonChange={(e) => {
                    const newTimeValue = new Date(e.detail.value as string).toTimeString().substring(0, 5)
                    setRequestedTimeEnd(newTimeValue)
                  }}
                ></IonDatetime>
                
                <div className="mt-6 text-center">
                  <IonButton expand="block" onClick={() => setShowRequestedTimePicker(false)}>
                    Confirm
                  </IonButton>
                </div>
              </div>
            </IonContent>
          </IonModal>

          <div className="max-w-4xl mx-auto py-6">
            {/* Header Section */}
            <div className="bg-red-500 rounded-xl shadow-lg p-6 mb-8 text-white">
              <div className="flex items-center">
                <Calendar className="h-8 w-8 mr-4" />
                <div>
                  <h1 className="text-2xl font-bold">Change of Schedule Request</h1>
                  <p className="text-red-100">Complete this form to request a change in your work schedule</p>
                </div>
              </div>
            </div>

            {/* History Section */}
        

            <IonCard className="rounded-xl shadow-md overflow-hidden">
              <IonCardHeader className="bg-white border-b p-6">
                <IonCardTitle className="text-xl font-bold text-gray-800">New Schedule Change Request</IonCardTitle>
                <IonCardSubtitle className="text-gray-600 mt-1">
                  Please provide all required information for your schedule change
                </IonCardSubtitle>
              </IonCardHeader>
              <IonCardContent className="p-0">
                <form onSubmit={handleSubmit} className="p-6">
                  <div className="bg-gray-50 p-4 rounded-lg mb-6 border border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                      <User className="h-5 w-5 mr-2 text-red-500" />
                      Employee Information
                    </h3>
                    <IonGrid>
                      <IonRow>
                        <IonCol size="12" sizeMd="6">
                          <div className="mb-4">
                            <IonItem className="rounded-lg overflow-hidden shadow-sm" lines="full">
                              <IonLabel position="stacked" className="text-gray-700 font-medium">
                                Employee's Name <span className="text-red-500">*</span>
                              </IonLabel>
                              <IonInput
                                name="employee_name"
                                value={formData.employee_name}
                                onIonChange={handleChange}
                                readonly
                                className="py-2"
                              ></IonInput>
                            </IonItem>
                          </div>
                        </IonCol>
                        <IonCol size="12" sizeMd="6">
                          <div className="mb-4">
                            <IonItem className="rounded-lg overflow-hidden shadow-sm" lines="full">
                              <IonLabel position="stacked" className="text-gray-700 font-medium">
                                Position <span className="text-red-500">*</span>
                              </IonLabel>
                              <IonInput
                                name="position"
                                value={formData.position}
                                onIonChange={handleChange}
                                readonly
                                className="py-2"
                              ></IonInput>
                            </IonItem>
                          </div>
                        </IonCol>
                      </IonRow>

                      <IonRow>
                        <IonCol size="12">
                          <div className="mb-4">
                            <IonItem className="rounded-lg overflow-hidden shadow-sm" lines="full">
                              <IonLabel position="stacked" className="text-gray-700 font-medium">
                                Department <span className="text-red-500">*</span>
                              </IonLabel>
                              <IonInput
                                name="department"
                                value={formData.department}
                                onIonChange={handleChange}
                                readonly
                                className="py-2"
                              ></IonInput>
                            </IonItem>
                          </div>
                        </IonCol>
                      </IonRow>
                    </IonGrid>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg mb-6 border border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                      <Clock className="h-5 w-5 mr-2 text-red-500" />
                      Schedule Details
                    </h3>
                    <IonGrid>
                      <IonRow>
                         <IonCol size="12" sizeMd="6">
                          <div className="mb-4">
                            <IonItem className="rounded-lg overflow-hidden shadow-sm" lines="full">
                              <IonLabel position="stacked" className="text-gray-700 font-medium">
                                Date of Absence <span className="text-red-500">*</span>
                              </IonLabel>
                              <IonDatetime
                                presentation="date"
                                placeholder="Select Date"
                                value={formData.date_of_absence}
                                onIonChange={(e) => {
                                  const newDate = new Date(e.detail.value as string).toISOString().split('T')[0]
                                  setFormData(prev => ({ ...prev, date_of_absence: newDate }))
                                }}
                              ></IonDatetime>
                            </IonItem>
                          </div>
                        </IonCol>
                        <IonCol size="12" sizeMd="6">
                          <div className="mb-4">
                            <IonItem className="rounded-lg overflow-hidden shadow-sm" lines="full">
                              <IonLabel position="stacked" className="text-gray-700 font-medium">
                                Date for Schedule Change <span className="text-red-500">*</span>
                              </IonLabel>
                              <IonDatetime
                                presentation="date"
                                placeholder="Select Date"
                                value={formData.date}
                                onIonChange={(e) => {
                                  const newDate = new Date(e.detail.value as string).toISOString().split('T')[0]
                                  setFormData(prev => ({ ...prev, date: newDate }))
                                }}
                              ></IonDatetime>
                            </IonItem>
                          </div>
                        </IonCol>
                       
                      </IonRow>

                      <IonRow>
                        <IonCol size="12" sizeMd="6">
                          <div className="mb-4">
                            <IonItem 
                              button 
                              className="rounded-lg overflow-hidden shadow-sm" 
                              lines="full"
                              onClick={() => setShowCurrentTimePicker(true)}
                            >
                              <IonLabel position="stacked" className="text-gray-700 font-medium">
                                Current Schedule <span className="text-red-500">*</span>
                              </IonLabel>
                              <div className="flex w-full justify-between items-center py-2">
                                <span>
                                  {formData.current_schedule || "Select time range"}
                                </span>
                                <IonIcon icon={timeOutline} />
                              </div>
                            </IonItem>
                          </div>
                        </IonCol>
                        <IonCol size="12" sizeMd="6">
                          <div className="mb-4">
                            <IonItem 
                              button 
                              className="rounded-lg overflow-hidden shadow-sm" 
                              lines="full"
                              onClick={() => setShowRequestedTimePicker(true)}
                            >
                              <IonLabel position="stacked" className="text-gray-700 font-medium">
                                Requested Schedule <span className="text-red-500">*</span>
                              </IonLabel>
                              <div className="flex w-full justify-between items-center py-2">
                                <span>
                                  {formData.requested_schedule || "Select time range"}
                                </span>
                                <IonIcon icon={timeOutline} />
                              </div>
                            </IonItem>
                          </div>
                        </IonCol>
                      </IonRow>

                      <IonRow>
                        <IonCol size="12">
                          <div className="mb-4">
                            <IonItem className="rounded-lg overflow-hidden shadow-sm" lines="full">
                              <IonLabel position="stacked" className="text-gray-700 font-medium">
                                Reason for Change of Schedule <span className="text-red-500">*</span>
                              </IonLabel>
                              <IonTextarea
                                name="reason"
                                value={formData.reason}
                                onIonChange={handleChange}
                                required
                                rows={4}
                                className="py-2"
                                placeholder="Please provide a detailed reason for your schedule change request..."
                              ></IonTextarea>
                            </IonItem>
                          </div>
                        </IonCol>
                      </IonRow>
                    </IonGrid>
                  </div>

                  <div className="bg-red-50 p-4 rounded-lg mb-6 border border-red-100">
                    <IonText color="medium" className="text-sm flex items-start">
                      <AlertTriangle className="h-5 w-5 mr-2 text-red-500 flex-shrink-0 mt-0.5" />
                      <p className="text-gray-700">
                        Note: Change of Schedule requests must be submitted at least 24 hours in advance. Emergency
                        requests may require additional approval from department heads.
                      </p>
                    </IonText>
                  </div>

                  {error && (
                    <div className="bg-red-50 p-4 rounded-lg mb-6 border border-red-200">
                      <p className="text-red-600 text-sm">{error}</p>
                    </div>
                  )}

                  <div className="flex flex-col sm:flex-row gap-4 justify-end mt-8">
                    <IonButton
                      fill="outline"
                      color="medium"
                      onClick={() => history.push("/dashboard")}
                      className="w-full sm:w-auto order-2 sm:order-1"
                      type="button"
                    >
                      Cancel
                    </IonButton>
                    <IonButton
                      type="submit"
                      disabled={isLoading}
                      className="w-full sm:w-auto order-1 sm:order-2"
                      color="danger"
                    >
                      <Send className="h-4 w-4 mr-2" />
                      {isLoading ? "Submitting..." : "Submit Request"}
                    </IonButton>
                  </div>
                </form>
              </IonCardContent>
            </IonCard>


            <IonCard className="rounded-xl shadow-md overflow-hidden mb-8">
              <IonCardHeader className="bg-white border-b p-4">
                <div className="flex justify-between items-center">
                  <div>
                    <IonCardTitle className="text-xl font-bold text-gray-800">Schedule Change History</IonCardTitle>
                    <IonCardSubtitle className="text-gray-600 mt-1">
                      Your previous schedule change requests
                    </IonCardSubtitle>
                  </div>
                  <IonButton 
                    fill="clear" 
                    onClick={() => setHistoryExpanded(!historyExpanded)}
                  >
                    {historyExpanded ? 
                      <ChevronUp className="h-5 w-5 text-gray-600" /> : 
                      <ChevronDown className="h-5 w-5 text-gray-600" />
                    }
                  </IonButton>
                </div>
              </IonCardHeader>
              
              {historyExpanded && (
                <IonCardContent className="p-0">
                  {isHistoryLoading ? (
                    <div className="p-4">
                      <IonSkeletonText animated style={{ width: '100%', height: '40px' }} />
                      <IonSkeletonText animated style={{ width: '100%', height: '40px' }} />
                      <IonSkeletonText animated style={{ width: '100%', height: '40px' }} />
                    </div>
                  ) : scheduleHistory.length > 0 ? (
                    <IonList>
                      {scheduleHistory.map((request) => (
                        <IonItem key={request.id} lines="full" className="p-2">
                          <div className="w-full">
                            <div className="flex justify-between items-start mb-2">
                              <div>
                                <h3 className="font-semibold text-gray-800">
                                  Schedule for: {formatDate(request.date)}
                                </h3>
                                <p className="text-sm text-gray-600">
                                  {request.date_of_absence && 
                                    <span className="block">Date of absence: {formatDate(request.date_of_absence)}</span>
                                  }
                                  <span>Applied on: {formatDate(request.applied_on)}</span>
                                </p>
                              </div>
                              <IonBadge color={getBadgeColor(request.status)} className="capitalize">
                                {request.status}
                              </IonBadge>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 my-2">
                              <div className="bg-gray-50 p-2 rounded">
                                <p className="text-xs text-gray-500">Current Schedule</p>
                                <p className="text-sm font-medium">{request.current_schedule}</p>
                              </div>
                              <div className="bg-gray-50 p-2 rounded">
                                <p className="text-xs text-gray-500">Requested Schedule</p>
                                <p className="text-sm font-medium">{request.requested_schedule}</p>
                              </div>
                            </div>
                            
                            <div className="mt-2">
                              <p className="text-xs text-gray-500">Reason</p>
                              <p className="text-sm">{request.reason}</p>
                            </div>
                            
                            {request.remarks && (
                              <div className="mt-2 bg-gray-50 p-2 rounded">
                                <p className="text-xs text-gray-500">Remarks</p>
                                <p className="text-sm">{request.remarks}</p>
                              </div>
                            )}
                            
                            {request.status === 'pending' && (
                              <div className="mt-3 flex justify-end">
                                <IonButton 
                                  size="small" 
                                  color="danger"
                                  fill="outline"
                                  onClick={() => cancelRequest(request.id)}
                                >
                                  Cancel Request
                                </IonButton>
                              </div>
                            )}
                          </div>
                        </IonItem>
                      ))}
                    </IonList>
                  ) : (
                    <div className="p-6 text-center">
                      <p className="text-gray-500">No schedule change requests found</p>
                    </div>
                  )}
                  
                  {error && (
                    <div className="p-4 bg-red-50 text-red-600">
                      <p>{error}</p>
                    </div>
                  )}
                </IonCardContent>
              )}
            </IonCard>
          </div>
          
          {/* Add some CSS for modal sizing */}
          <style>{`
            .time-picker-modal {
              --height: auto;
              --width: 350px;
              --border-radius: 10px;
            }
          `}</style>
        </IonContent>
      </IonPage>
    </>
  )
}


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
  IonText,
  useIonToast,
  IonLoading,
  IonBadge,
  IonIcon,
  IonSkeletonText,
  IonList,
  IonListHeader,
} from "@ionic/react"
import { useHistory } from "react-router-dom"
import { useAuth } from "@/hooks/use-auth"
import SideMenu from "@/components/side-menu"
import { FileText, Calendar, User, Building, Send, AlertTriangle, Check, X, Clock, CalendarDays } from "lucide-react"
import apiService from "@/services/api-service"

interface OfficialBusinessRequest {
  id: number;
  employee_id: number;
  employee_name: string;
  department: string;
  purpose: string;
  date: string;
  time_departure: string;
  time_arrival: string;
  status: 'pending' | 'approved' | 'rejected';
  applied_on: string;
  approved_by?: number;
  approved_on?: string;
  remarks?: string;
}

export default function OfficialBusiness() {
  const { user, isAuthenticated } = useAuth()
  const history = useHistory()
  const [present] = useIonToast()
  const [isLoading, setIsLoading] = useState(false)
  const [isHistoryLoading, setIsHistoryLoading] = useState(false)
  const [officialBusinessHistory, setOfficialBusinessHistory] = useState<OfficialBusinessRequest[]>([])

  const [formData, setFormData] = useState({
    department: "",
    employeeName: "",
    purpose: "",
    timeOfDeparture: "",
    timeOfArrival: "",
    date: new Date().toISOString().split("T")[0],
  })

  useEffect(() => {
    if (!isAuthenticated) {
      history.push("/login")
    }

    // Pre-fill employee name and department if available
    if (user) {
      setFormData((prev) => ({ 
        ...prev, 
        employeeName: user.name || "",
        department: user.department || ""
      }))
      
      // Fetch official business history when user is available
      fetchOfficialBusinessHistory(user.id)
    }
  }, [isAuthenticated, history, user])

  const fetchOfficialBusinessHistory = async (userId: string) => {
    if (!userId) return
    
    setIsHistoryLoading(true)
    try {
      const response = await apiService.getOfficialBusinessRequests(userId)
      setOfficialBusinessHistory(response.records || [])
    } catch (error) {
      presentToast("Failed to load official business history", "danger")
      console.error("Error fetching official business history:", error)
    } finally {
      setIsHistoryLoading(false)
    }
  }

  const handleChange = (e: any) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleCustomChange = (name: string, value: any) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const presentToast = (message: string, color: "success" | "danger" = "success") => {
    present({
      message: message,
      duration: 3000,
      position: "bottom",
      color: color,
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // Prepare data for submission
      const requestData = {
        employee_id: parseInt(user?.id as string) || 0,  // Convert to integer
        employee_name: formData.employeeName,
        department: formData.department,
        purpose: formData.purpose,
        // Use the backend expected field names directly
        time_departure: formData.timeOfDeparture,
        time_arrival: formData.timeOfArrival,
        date: formData.date,
        status: 'pending',
        applied_on: new Date().toISOString().split('T')[0]
      }

      console.log('Submitting data:', requestData);  // Debug log

      // Submit to API
      const response = await apiService.submitOfficialBusinessRequest(requestData)
      
      setIsLoading(false)
      presentToast("Your official business form has been submitted successfully")
      
      // Refresh the history list after successful submission
      if (user?.id) {
        fetchOfficialBusinessHistory(user.id)
      }
      
      // Reset form fields except for name and department
      setFormData(prev => ({
        ...prev,
        purpose: "",
        timeOfDeparture: "",
        timeOfArrival: "",
        date: new Date().toISOString().split("T")[0],
      }))
    } catch (error) {
      setIsLoading(false)
      console.error('Error submitting form:', error)
      presentToast(error instanceof Error ? error.message : "Failed to submit form. Please try again.", "danger")
    }
  }

  // Helper function to render status badge
  const renderStatusBadge = (status: string) => {
    switch(status) {
      case 'approved':
        return <IonBadge color="success" className="flex items-center gap-1 px-2 py-1">
          <Check className="w-3.5 h-3.5" /> Approved
        </IonBadge>
      case 'rejected':
        return <IonBadge color="danger" className="flex items-center gap-1 px-2 py-1">
          <X className="w-3.5 h-3.5" /> Rejected
        </IonBadge>
      default:
        return <IonBadge color="warning" className="flex items-center gap-1 px-2 py-1">
          <Clock className="w-3.5 h-3.5" /> Pending
        </IonBadge>
    }
  }

  // Format time from API format (HH:MM:SS) to readable format
  const formatTime = (time: string) => {
    if (!time) return "";
    
    // Handle different time formats
    const timeRegex = /^([0-9]{1,2}):([0-9]{1,2})(?::([0-9]{1,2}))?$/;
    const match = time.match(timeRegex);
    
    if (!match) return time; // Return original if format doesn't match
    
    let hours = parseInt(match[1]);
    const minutes = match[2];
    const ampm = hours >= 12 ? 'PM' : 'AM';
    
    hours = hours % 12;
    hours = hours || 12; // Convert 0 to 12
    
    return `${hours}:${minutes} ${ampm}`;
  }

  // Format date to more readable format
  const formatDate = (dateString: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric'
    });
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
            <IonTitle>Official Business Form</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent className="ion-padding bg-gray-50">
          <IonLoading isOpen={isLoading} message={"Submitting request..."} />
          <div className="max-w-4xl mx-auto py-8">
            {/* Header Section */}
            <div className="bg-red-500 rounded-xl shadow-lg p-6 mb-8 text-white">
              <div className="flex items-center">
                <FileText className="h-8 w-8 mr-4" />
                <div>
                  <h1 className="text-2xl font-bold">Official Business Form</h1>
                  <p className="text-red-100">Complete this form to request official business activities</p>
                </div>
              </div>
            </div>

            {/* Request Form */}
            <IonCard className="rounded-xl shadow-md overflow-hidden mb-8">
              <IonCardHeader className="bg-white border-b p-6">
                <IonCardTitle className="text-xl font-bold text-gray-800">Request Details</IonCardTitle>
                <IonCardSubtitle className="text-gray-600 mt-1">
                  Please provide all required information for your official business request
                </IonCardSubtitle>
              </IonCardHeader>
              <IonCardContent className="p-0">
                <form onSubmit={handleSubmit} className="p-8">
                  <div className="bg-gray-50 p-6 rounded-lg mb-8 border border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-800 mb-5 flex items-center">
                      <User className="h-5 w-5 mr-2 text-red-500" />
                      Employee Information
                    </h3>
                    <IonGrid className="p-0">
                      <IonRow className="ion-align-items-center">
                        <IonCol size="12" sizeMd="6" className="px-2">
                          <div className="mb-4 md:mb-0">
                            <IonItem className="rounded-lg overflow-hidden shadow-sm h-[72px]" lines="full">
                              <IonLabel position="stacked" className="text-gray-700 font-medium pl-1 pt-1">
                                Employee's Name <span className="text-red-500">*</span>
                              </IonLabel>
                              <IonInput
                                name="employeeName"
                                value={formData.employeeName}
                                onIonChange={(e) => handleCustomChange("employeeName", e.detail.value)}
                                required
                                className="py-2 px-1"
                              ></IonInput>
                            </IonItem>
                          </div>
                        </IonCol>
                        <IonCol size="12" sizeMd="6" className="px-2">
                          <div className="mb-4 md:mb-0">
                            <IonItem className="rounded-lg overflow-hidden shadow-sm h-[72px]" lines="full">
                              <IonLabel position="stacked" className="text-gray-700 font-medium pl-1 pt-1">
                                Department <span className="text-red-500">*</span>
                              </IonLabel>
                              <IonInput
                                name="department"
                                value={formData.department}
                                onIonChange={(e) => handleCustomChange("department", e.detail.value)}
                                readonly={!!user?.department}
                                required
                                className="py-2 px-1"
                              ></IonInput>
                            </IonItem>
                          </div>
                        </IonCol>
                      </IonRow>
                    </IonGrid>
                  </div>

                  <div className="bg-gray-50 p-6 rounded-lg mb-8 border border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-800 mb-5 flex items-center">
                      <Calendar className="h-5 w-5 mr-2 text-red-500" />
                      Schedule Details
                    </h3>
                    <IonGrid className="p-0">
                      <IonRow className="ion-align-items-center">
                        <IonCol size="12" sizeMd="4" className="px-2">
                          <div className="mb-4 md:mb-0">
                            <IonItem className="rounded-lg overflow-hidden shadow-sm h-[72px]" lines="full">
                              <IonLabel position="stacked" className="text-gray-700 font-medium pl-1 pt-1">
                                Date <span className="text-red-500">*</span>
                              </IonLabel>
                              <IonInput
                                name="date"
                                type="date"
                                value={formData.date}
                                onIonChange={(e) => handleCustomChange("date", e.detail.value)}
                                required
                                className="py-2 px-1"
                              ></IonInput>
                            </IonItem>
                          </div>
                        </IonCol>
                        <IonCol size="12" sizeMd="4" className="px-2">
                          <div className="mb-4 md:mb-0">
                            <IonItem className="rounded-lg overflow-hidden shadow-sm h-[72px]" lines="full">
                              <IonLabel position="stacked" className="text-gray-700 font-medium pl-1 pt-1">
                                Departure Time <span className="text-red-500">*</span>
                              </IonLabel>
                              <IonInput
                                name="timeOfDeparture"
                                type="time"
                                value={formData.timeOfDeparture}
                                onIonChange={(e) => handleCustomChange("timeOfDeparture", e.detail.value)}
                                required
                                className="py-2 px-1"
                              ></IonInput>
                            </IonItem>
                          </div>
                        </IonCol>
                        <IonCol size="12" sizeMd="4" className="px-2">
                          <div className="mb-4 md:mb-0">
                            <IonItem className="rounded-lg overflow-hidden shadow-sm h-[72px]" lines="full">
                              <IonLabel position="stacked" className="text-gray-700 font-medium pl-1 pt-1">
                                Arrival Time <span className="text-red-500">*</span>
                              </IonLabel>
                              <IonInput
                                name="timeOfArrival"
                                type="time"
                                value={formData.timeOfArrival}
                                onIonChange={(e) => handleCustomChange("timeOfArrival", e.detail.value)}
                                required
                                className="py-2 px-1"
                              ></IonInput>
                            </IonItem>
                          </div>
                        </IonCol>
                      </IonRow>
                    </IonGrid>
                  </div>

                  <div className="bg-gray-50 p-6 rounded-lg mb-8 border border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-800 mb-5 flex items-center">
                      <Building className="h-5 w-5 mr-2 text-red-500" />
                      Purpose of Official Business
                    </h3>
                    <IonGrid className="p-0">
                      <IonRow>
                        <IonCol size="12" className="px-2">
                          <IonItem className="rounded-lg overflow-hidden shadow-sm" lines="full">
                            <IonLabel position="stacked" className="text-gray-700 font-medium pl-1 pt-1">
                              Purpose <span className="text-red-500">*</span>
                            </IonLabel>
                            <IonTextarea
                              name="purpose"
                              value={formData.purpose}
                              onIonChange={(e) => handleCustomChange("purpose", e.detail.value)}
                              required
                              rows={4}
                              className="py-2 px-1"
                              placeholder="Describe the purpose of your official business in detail..."
                            ></IonTextarea>
                          </IonItem>
                        </IonCol>
                      </IonRow>
                    </IonGrid>
                  </div>

                  <div className="bg-red-50 p-6 rounded-lg mb-8 border border-red-100">
                    <IonText color="medium" className="text-sm flex items-start">
                      <AlertTriangle className="h-5 w-5 mr-2 text-red-500 flex-shrink-0 mt-0.5" />
                      <p className="text-gray-700">
                        Note: Official Business Form of all Teachers and Faculty Members must be signed by the Academic
                        Coordinator or Program Chair.
                      </p>
                    </IonText>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-4 justify-end mt-10">
                    <IonButton
                      fill="outline"
                      color="medium"
                      onClick={() => history.push("/dashboard")}
                      className="w-full sm:w-32 order-2 sm:order-1 h-12"
                      style={{ margin: 0 }}
                    >
                      Cancel
                    </IonButton>
                    <IonButton
                      type="submit"
                      disabled={isLoading}
                      className="w-full sm:w-40 order-1 sm:order-2 h-12"
                      color="danger"
                      style={{ margin: 0 }}
                    >
                      <Send className="h-4 w-4 mr-2" />
                      {isLoading ? "Submitting..." : "Submit Form"}
                    </IonButton>
                  </div>
                </form>
              </IonCardContent>
            </IonCard>

            {/* History Section */}
            <IonCard className="rounded-xl shadow-md overflow-hidden">
              <IonCardHeader className="bg-white border-b p-6">
                <IonCardTitle className="text-xl font-bold text-gray-800 flex items-center">
                  <CalendarDays className="h-5 w-5 mr-2 text-red-500" />
                  Request History
                </IonCardTitle>
                <IonCardSubtitle className="text-gray-600 mt-1">
                  View your official business request history and status
                </IonCardSubtitle>
              </IonCardHeader>
              <IonCardContent className="p-0">
                {isHistoryLoading ? (
                  <div className="p-8 space-y-4">
                    {[1, 2, 3].map(skeleton => (
                      <div key={skeleton} className="bg-gray-50 p-4 rounded-lg">
                        <div className="flex justify-between mb-2">
                          <IonSkeletonText animated style={{ width: '30%', height: '20px' }} />
                          <IonSkeletonText animated style={{ width: '20%', height: '20px' }} />
                        </div>
                        <IonSkeletonText animated style={{ width: '70%', height: '16px' }} />
                      </div>
                    ))}
                  </div>
                ) : officialBusinessHistory.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Date
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Time
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Purpose
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Applied On
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Status
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {officialBusinessHistory.map((request) => (
                          <tr key={request.id}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                              {formatDate(request.date)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                              {formatTime(request.time_departure)} - {formatTime(request.time_arrival)}
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-700">
                              <div className="max-w-xs truncate" title={request.purpose}>
                                {request.purpose}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                              {formatDate(request.applied_on)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              {renderStatusBadge(request.status)}
                              {request.remarks && (
                                <div className="mt-1 text-xs text-gray-500 max-w-[200px] truncate" title={request.remarks}>
                                  {request.remarks}
                                </div>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="p-8 text-center">
                    <div className="flex justify-center mb-4">
                      <CalendarDays className="h-12 w-12 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-700 mb-2">No request history</h3>
                    <p className="text-gray-500 max-w-md mx-auto">
                      You haven't submitted any official business requests yet. Fill out the form above to create your first request.
                    </p>
                  </div>
                )}
              </IonCardContent>
            </IonCard>
          </div>
        </IonContent>
      </IonPage>
    </>
  )
}


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
} from "@ionic/react"
import { useHistory } from "react-router-dom"
import { useAuth } from "@/hooks/use-auth"
import SideMenu from "@/components/side-menu"
import { FileText, Clock, Calendar, User, Building, Send, AlertTriangle } from "lucide-react"

export default function OfficialBusiness() {
  const { user, isAuthenticated } = useAuth()
  const history = useHistory()
  const [present] = useIonToast()
  const [isLoading, setIsLoading] = useState(false)

  const [formData, setFormData] = useState({
    department: "",
    employeeName: "",
    purpose: "",
    timeOfDeparture: "",
    timeOfArrival: "",
    date: new Date().toISOString().split("T")[0],
    receivedBy: "",
    dateReceived: "",
    approvedBy: "",
  })

  useEffect(() => {
    if (!isAuthenticated) {
      history.push("/login")
    }

    // Pre-fill employee name if available
    if (user?.name) {
      setFormData((prev) => ({ ...prev, employeeName: user.name }))
    }
  }, [isAuthenticated, history, user])

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

    // In a real app, this would be an API call to save the data
    setTimeout(() => {
      setIsLoading(false)
      presentToast("Your official business form has been submitted successfully")
      history.push("/dashboard")
    }, 1500)
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
          <div className="max-w-4xl mx-auto py-6">
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

            <IonCard className="rounded-xl shadow-md overflow-hidden">
              <IonCardHeader className="bg-white border-b p-6">
                <IonCardTitle className="text-xl font-bold text-gray-800">Request Details</IonCardTitle>
                <IonCardSubtitle className="text-gray-600 mt-1">
                  Please provide all required information for your official business request
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
                                name="employeeName"
                                value={formData.employeeName}
                                onIonChange={(e) => handleCustomChange("employeeName", e.detail.value)}
                                required
                                className="py-2"
                              ></IonInput>
                            </IonItem>
                          </div>
                        </IonCol>
                        <IonCol size="12" sizeMd="6">
                          <div className="mb-4">
                            <IonItem className="rounded-lg overflow-hidden shadow-sm" lines="full">
                              <IonLabel position="stacked" className="text-gray-700 font-medium">
                                Department <span className="text-red-500">*</span>
                              </IonLabel>
                              <IonInput
                                name="department"
                                value={formData.department}
                                onIonChange={(e) => handleCustomChange("department", e.detail.value)}
                                required
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
                      <Calendar className="h-5 w-5 mr-2 text-red-500" />
                      Schedule Details
                    </h3>
                    <IonGrid>
                      <IonRow>
                        <IonCol size="12" sizeMd="4">
                          <div className="mb-4">
                            <IonItem className="rounded-lg overflow-hidden shadow-sm" lines="full">
                              <IonLabel position="stacked" className="text-gray-700 font-medium">
                                Date of Official Business <span className="text-red-500">*</span>
                              </IonLabel>
                              <IonInput
                                name="date"
                                type="date"
                                value={formData.date}
                                onIonChange={(e) => handleCustomChange("date", e.detail.value)}
                                required
                                className="py-2"
                              ></IonInput>
                            </IonItem>
                          </div>
                        </IonCol>
                        <IonCol size="12" sizeMd="4">
                          <div className="mb-4">
                            <IonItem className="rounded-lg overflow-hidden shadow-sm" lines="full">
                              <IonLabel position="stacked" className="text-gray-700 font-medium">
                                Time of Departure <span className="text-red-500">*</span>
                              </IonLabel>
                              <IonInput
                                name="timeOfDeparture"
                                type="time"
                                value={formData.timeOfDeparture}
                                onIonChange={(e) => handleCustomChange("timeOfDeparture", e.detail.value)}
                                required
                                className="py-2"
                              ></IonInput>
                            </IonItem>
                          </div>
                        </IonCol>
                        <IonCol size="12" sizeMd="4">
                          <div className="mb-4">
                            <IonItem className="rounded-lg overflow-hidden shadow-sm" lines="full">
                              <IonLabel position="stacked" className="text-gray-700 font-medium">
                                Time of Arrival <span className="text-red-500">*</span>
                              </IonLabel>
                              <IonInput
                                name="timeOfArrival"
                                type="time"
                                value={formData.timeOfArrival}
                                onIonChange={(e) => handleCustomChange("timeOfArrival", e.detail.value)}
                                required
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
                      <Building className="h-5 w-5 mr-2 text-red-500" />
                      Purpose of Official Business
                    </h3>
                    <IonGrid>
                      <IonRow>
                        <IonCol size="12">
                          <div className="mb-4">
                            <IonItem className="rounded-lg overflow-hidden shadow-sm" lines="full">
                              <IonLabel position="stacked" className="text-gray-700 font-medium">
                                Purpose <span className="text-red-500">*</span>
                              </IonLabel>
                              <IonTextarea
                                name="purpose"
                                value={formData.purpose}
                                onIonChange={(e) => handleCustomChange("purpose", e.detail.value)}
                                required
                                rows={4}
                                className="py-2"
                                placeholder="Describe the purpose of your official business in detail..."
                              ></IonTextarea>
                            </IonItem>
                          </div>
                        </IonCol>
                      </IonRow>
                    </IonGrid>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg mb-6 border border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                      <Clock className="h-5 w-5 mr-2 text-red-500" />
                      Approval Information
                    </h3>
                    <IonGrid>
                      <IonRow>
                        <IonCol size="12" sizeMd="4">
                          <div className="mb-4">
                            <IonItem className="rounded-lg overflow-hidden shadow-sm" lines="full">
                              <IonLabel position="stacked" className="text-gray-700 font-medium">
                                Approved by (Immediate Superior)
                              </IonLabel>
                              <IonInput
                                name="approvedBy"
                                value={formData.approvedBy}
                                onIonChange={(e) => handleCustomChange("approvedBy", e.detail.value)}
                                className="py-2"
                              ></IonInput>
                            </IonItem>
                          </div>
                        </IonCol>
                        <IonCol size="12" sizeMd="4">
                          <div className="mb-4">
                            <IonItem className="rounded-lg overflow-hidden shadow-sm" lines="full">
                              <IonLabel position="stacked" className="text-gray-700 font-medium">
                                Received by (HRO)
                              </IonLabel>
                              <IonInput
                                name="receivedBy"
                                value={formData.receivedBy}
                                onIonChange={(e) => handleCustomChange("receivedBy", e.detail.value)}
                                disabled
                                className="py-2 opacity-70"
                              ></IonInput>
                            </IonItem>
                          </div>
                        </IonCol>
                        <IonCol size="12" sizeMd="4">
                          <div className="mb-4">
                            <IonItem className="rounded-lg overflow-hidden shadow-sm" lines="full">
                              <IonLabel position="stacked" className="text-gray-700 font-medium">
                                Date Received
                              </IonLabel>
                              <IonInput
                                name="dateReceived"
                                type="date"
                                value={formData.dateReceived}
                                onIonChange={(e) => handleCustomChange("dateReceived", e.detail.value)}
                                disabled
                                className="py-2 opacity-70"
                              ></IonInput>
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
                        Note: Official Business Form of all Teachers and Faculty Members must be signed by the Academic
                        Coordinator or Program Chair.
                      </p>
                    </IonText>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-4 justify-end mt-8">
                    <IonButton
                      fill="outline"
                      color="medium"
                      onClick={() => history.push("/dashboard")}
                      className="w-full sm:w-auto order-2 sm:order-1"
                    >
                      Cancel
                    </IonButton>
                    <IonButton
                      type="submit"
                      disabled={isLoading}
                      onClick={handleSubmit}
                      className="w-full sm:w-auto order-1 sm:order-2"
                      color="danger"
                    >
                      <Send className="h-4 w-4 mr-2" />
                      {isLoading ? "Submitting..." : "Submit Form"}
                    </IonButton>
                  </div>
                </form>
              </IonCardContent>
            </IonCard>
          </div>
        </IonContent>
      </IonPage>
    </>
  )
}


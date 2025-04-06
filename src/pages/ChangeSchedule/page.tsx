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
} from "@ionic/react"
import { useHistory } from "react-router-dom"
import { useAuth } from "@/hooks/use-auth"
import SideMenu from "@/components/side-menu"
import { Calendar, Clock, User, Briefcase, Building, Send, AlertTriangle } from "lucide-react"

export default function ChangeSchedule() {
  const { user, isAuthenticated } = useAuth()
  const history = useHistory()
  const [isLoading, setIsLoading] = useState(false)

  const [formData, setFormData] = useState({
    employeeName: "",
    position: "",
    department: "",
    employmentStatus: {
      category: "administrative", // administrative or academics
      type: "regular", // regular, probationary, contractual
      time: "full-time", // full-time, part-time
    },
    dateOfAbsence: new Date().toISOString().split("T")[0],
    officialTime: "",
    requestedDate: new Date().toISOString().split("T")[0],
    requestedTime: "",
    reason: "",
    approvedBy: "",
    receivedBy: "",
    dateReceived: "",
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

  const handleEmploymentStatusChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      employmentStatus: {
        ...prev.employmentStatus,
        [field]: value,
      },
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // In a real app, this would be an API call to save the data
    setTimeout(() => {
      setIsLoading(false)
      presentToast("Your change of schedule request has been submitted successfully")
      history.push("/dashboard")
    }, 1500)
  }

  const presentToast = (message: string) => {
    const toast = document.createElement("ion-toast")
    toast.message = message
    toast.duration = 2000
    toast.position = "bottom"
    document.body.appendChild(toast)
    return toast.present()
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

            <IonCard className="rounded-xl shadow-md overflow-hidden">
              <IonCardHeader className="bg-white border-b p-6">
                <IonCardTitle className="text-xl font-bold text-gray-800">Schedule Change Request</IonCardTitle>
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
                                name="employeeName"
                                value={formData.employeeName}
                                onIonChange={handleChange}
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
                                Position <span className="text-red-500">*</span>
                              </IonLabel>
                              <IonInput
                                name="position"
                                value={formData.position}
                                onIonChange={handleChange}
                                required
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
                      <Briefcase className="h-5 w-5 mr-2 text-red-500" />
                      Employment Status
                    </h3>
                    <IonGrid>
                      <IonRow>
                        <IonCol size="12" sizeMd="4">
                          <div className="bg-white rounded-lg shadow-sm p-3 h-full">
                            <h4 className="font-medium text-gray-800 mb-2 border-b pb-2">Category</h4>
                            <IonRadioGroup
                              value={formData.employmentStatus.category}
                              onIonChange={(e) => handleEmploymentStatusChange("category", e.detail.value)}
                              className="space-y-2"
                            >
                              <IonItem lines="none" className="--ion-item-background: transparent">
                                <IonLabel className="text-gray-700">Administrative</IonLabel>
                                <IonRadio slot="start" value="administrative" />
                              </IonItem>
                              <IonItem lines="none" className="--ion-item-background: transparent">
                                <IonLabel className="text-gray-700">Academics</IonLabel>
                                <IonRadio slot="start" value="academics" />
                              </IonItem>
                            </IonRadioGroup>
                          </div>
                        </IonCol>

                        <IonCol size="12" sizeMd="4">
                          <div className="bg-white rounded-lg shadow-sm p-3 h-full">
                            <h4 className="font-medium text-gray-800 mb-2 border-b pb-2">Type</h4>
                            <IonRadioGroup
                              value={formData.employmentStatus.type}
                              onIonChange={(e) => handleEmploymentStatusChange("type", e.detail.value)}
                              className="space-y-2"
                            >
                              <IonItem lines="none" className="--ion-item-background: transparent">
                                <IonLabel className="text-gray-700">Regular</IonLabel>
                                <IonRadio slot="start" value="regular" />
                              </IonItem>
                              <IonItem lines="none" className="--ion-item-background: transparent">
                                <IonLabel className="text-gray-700">Probationary</IonLabel>
                                <IonRadio slot="start" value="probationary" />
                              </IonItem>
                              <IonItem lines="none" className="--ion-item-background: transparent">
                                <IonLabel className="text-gray-700">Contractual</IonLabel>
                                <IonRadio slot="start" value="contractual" />
                              </IonItem>
                            </IonRadioGroup>
                          </div>
                        </IonCol>

                        <IonCol size="12" sizeMd="4">
                          <div className="bg-white rounded-lg shadow-sm p-3 h-full">
                            <h4 className="font-medium text-gray-800 mb-2 border-b pb-2">Time</h4>
                            <IonRadioGroup
                              value={formData.employmentStatus.time}
                              onIonChange={(e) => handleEmploymentStatusChange("time", e.detail.value)}
                              className="space-y-2"
                            >
                              <IonItem lines="none" className="--ion-item-background: transparent">
                                <IonLabel className="text-gray-700">Full-time</IonLabel>
                                <IonRadio slot="start" value="full-time" />
                              </IonItem>
                              <IonItem lines="none" className="--ion-item-background: transparent">
                                <IonLabel className="text-gray-700">Part-time</IonLabel>
                                <IonRadio slot="start" value="part-time" />
                              </IonItem>
                            </IonRadioGroup>
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
                              <IonInput
                                name="dateOfAbsence"
                                type="date"
                                value={formData.dateOfAbsence}
                                onIonChange={handleChange}
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
                                Official Time <span className="text-red-500">*</span>
                              </IonLabel>
                              <IonInput
                                name="officialTime"
                                placeholder="e.g., 8:00 - 5:00"
                                value={formData.officialTime}
                                onIonChange={handleChange}
                                required
                                className="py-2"
                              ></IonInput>
                            </IonItem>
                          </div>
                        </IonCol>
                      </IonRow>

                      <IonRow>
                        <IonCol size="12" sizeMd="6">
                          <div className="mb-4">
                            <IonItem className="rounded-lg overflow-hidden shadow-sm" lines="full">
                              <IonLabel position="stacked" className="text-gray-700 font-medium">
                                Requested Date <span className="text-red-500">*</span>
                              </IonLabel>
                              <IonInput
                                name="requestedDate"
                                type="date"
                                value={formData.requestedDate}
                                onIonChange={handleChange}
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
                                Requested Time <span className="text-red-500">*</span>
                              </IonLabel>
                              <IonInput
                                name="requestedTime"
                                placeholder="e.g., 9:00 - 6:00"
                                value={formData.requestedTime}
                                onIonChange={handleChange}
                                required
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

                  <div className="bg-gray-50 p-4 rounded-lg mb-6 border border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                      <Building className="h-5 w-5 mr-2 text-red-500" />
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
                                onIonChange={handleChange}
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
                                onIonChange={handleChange}
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
                                onIonChange={handleChange}
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
                        Note: Change of Schedule requests must be submitted at least 24 hours in advance. Emergency
                        requests may require additional approval from department heads.
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
                      {isLoading ? "Submitting..." : "Submit Request"}
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


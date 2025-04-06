"use client"

import type React from "react"

import { useState } from "react"
import {
  IonContent,
  IonPage,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardSubtitle,
  IonCardContent,
  IonItem,
  IonLabel,
  IonInput,
  IonButton,
  useIonToast,
} from "@ionic/react"
import { useHistory } from "react-router-dom"
import { useAuth } from "@/hooks/use-auth"
import PersonalInfo from "@/pages/PersonalInformation/page"

export default function Registration() {
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [emailError, setEmailError] = useState("")
  const [showPersonalInfo, setShowPersonalInfo] = useState(false)
  const { register } = useAuth()
  const history = useHistory()
  const [present] = useIonToast()

  const presentToast = (message: string, color: "success" | "danger" = "success") => {
    present({
      message: message,
      duration: 3000,
      position: "bottom",
      color: color,
    })
  }

  const validateEmail = (email: string) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!email) {
      setEmailError("Email is required")
      return false
    }
    if (!regex.test(email)) {
      setEmailError("Please enter a valid email address")
      return false
    }
    setEmailError("")
    return true
  }

  // Update the handleSubmit function to include department and position fields
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateEmail(email)) {
      return
    }

    setIsLoading(true)

    try {
      // Register with just the email for now
      const success = await register({
        email,
        // We'll set these properly in the personal info form
        department: "",
        position: "",
      })

      if (success) {
        presentToast("Email verified! Please complete your profile.")
        // Show personal info form instead of redirecting
        setShowPersonalInfo(true)
      } else {
        presentToast("Registration failed. Please try again.", "danger")
      }
    } catch (error) {
      presentToast("An unexpected error occurred", "danger")
    } finally {
      setIsLoading(false)
    }
  }

  // If personal info form should be shown, render it with registration mode
  if (showPersonalInfo) {
    return <PersonalInfo registrationMode={true} registrationEmail={email} />
  }

  return (
    <IonPage>
      <IonContent className="ion-padding">
        <div
          className="ion-text-center ion-justify-content-center"
          style={{ height: "100%", display: "flex", flexDirection: "column", alignItems: "center" }}
        >
          <div className="py-8" style={{ width: "100%", maxWidth: "400px" }}>
            <IonCard>
              <IonCardHeader className="ion-text-center">
                <div className="ion-padding-bottom">
                  <img
                    src="/sdcalogo.png?height=80&width=240"
                    alt="St. Dominic College of Asia Logo"
                    style={{ height: "80px", margin: "0 auto" }}
                  />
                </div>
                <IonCardTitle>Employee Registration</IonCardTitle>
                <IonCardSubtitle>Enter your email to begin registration</IonCardSubtitle>
              </IonCardHeader>
              <IonCardContent>
                <form onSubmit={handleSubmit}>
                  <IonItem className={emailError ? "ion-invalid" : ""}>
                    <IonLabel position="floating">Email</IonLabel>
                    <IonInput
                      type="email"
                      placeholder="juan.delacruz@sdca.edu.ph"
                      value={email}
                      onIonChange={(e) => {
                        setEmail(e.detail.value!)
                        if (e.detail.value) validateEmail(e.detail.value)
                      }}
                      required
                    />
                    {emailError && <div className="text-red-500 text-sm mt-1 ml-2">{emailError}</div>}
                  </IonItem>

                  <div className="ion-padding-top my-8">
                    <IonButton expand="block" type="submit" disabled={isLoading}>
                      {isLoading ? "Processing..." : "Continue to Profile Setup"}
                    </IonButton>
                  </div>

                  <div className="text-center mt-4">
                    <p className="text-sm text-gray-600">
                      Already have an account?{" "}
                      <a
                        href="/login"
                        className="text-primary font-medium"
                        onClick={(e) => {
                          e.preventDefault()
                          history.push("/login")
                        }}
                      >
                        Sign in
                      </a>
                    </p>
                  </div>
                </form>
              </IonCardContent>
            </IonCard>
          </div>
        </div>
      </IonContent>
    </IonPage>
  )
}


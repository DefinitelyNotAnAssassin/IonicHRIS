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
  IonLoading,
} from "@ionic/react"
import { useHistory } from "react-router-dom"
import { useAuth } from "@/hooks/use-auth"

export default function Login() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const { login } = useAuth()
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const success = await login(email, password)
      if (success) {
        presentToast("Welcome to St. Dominic College of Asia HRIS")

        // Get updated user info
        const currentUser = JSON.parse(localStorage.getItem("user") || "{}")

        // Check if profile is completed
        if (!currentUser.profileCompleted) {
          history.push("/personal-info")
          return
        }

        // Redirect based on role
        if (currentUser.role === "hr") {
          history.push("/hr")
        } else {
          history.push("/dashboard")
        }
      } else {
        presentToast("Invalid email or password", "danger")
      }
    } catch (error) {
      console.error("Login error:", error)
      presentToast("An unexpected error occurred", "danger")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <IonPage>
      <IonContent className="ion-padding ">
        <IonLoading isOpen={isLoading} message="Logging in..." />
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
                <IonCardTitle>Login</IonCardTitle>
                <IonCardSubtitle>Enter your credentials to access your account</IonCardSubtitle>
              </IonCardHeader>
              <IonCardContent>
                <form onSubmit={handleSubmit}>
                  <IonItem>
                    <IonLabel position="floating">Email</IonLabel>
                    <IonInput
                      type="email"
                      placeholder="juan.delacruz@sdca.edu.ph"
                      value={email}
                      onIonChange={(e) => setEmail(e.detail.value!)}
                      required
                    />
                  </IonItem>
                  <IonItem className="ion-margin-bottom">
                    <IonLabel position="floating">Password</IonLabel>
                    <IonInput
                      type="password"
                      value={password}
                      onIonChange={(e) => setPassword(e.detail.value!)}
                      required
                    />
                  </IonItem>
                  <div className="ion-padding-top my-8">
                    <IonButton expand="block" type="submit" disabled={isLoading}>
                      {isLoading ? "Logging in..." : "Login"}
                    </IonButton>
                  </div>

                  <div className="text-center mt-4">
                    <p className="text-sm text-gray-600">
                      Don't have an account?{" "}
                      <a
                        href="/register"
                        className="text-primary font-medium"
                        onClick={(e) => {
                          e.preventDefault()
                          history.push("/register")
                        }}
                      >
                        Register
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


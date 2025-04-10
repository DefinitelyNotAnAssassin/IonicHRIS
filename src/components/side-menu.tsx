"use client"

import { IonContent, IonItem, IonLabel, IonList, IonMenu, IonMenuToggle } from "@ionic/react"
import { useHistory } from "react-router-dom"
import { useAuth } from "@/hooks/use-auth"
import { Users, Clock, Calendar, FileText, User, FileSpreadsheet } from "lucide-react"

export default function SideMenu() {
  const { logout, user } = useAuth()
  const history = useHistory()

  const handleLogout = () => {
    logout()
    history.push("/login")
  }

  // Check if user is HR
  const isHR = user?.role === "hr" || user?.email?.includes("hr") || user?.department === "HR"

  return (
    <IonMenu contentId="main-content">
      <IonContent>
        <div className="p-4 border-b">
          <img src="/sdcalogo.png" alt="St. Dominic College of Asia Logo" className="h-16 mx-auto" />
        </div>
        <IonList>


        {!isHR && (
        <>
          <IonMenuToggle autoHide={false}>
            <IonItem button routerLink="/dashboard" routerDirection="root">
              <FileSpreadsheet className="h-5 w-5 mr-3 text-red-500" />
              <IonLabel>Dashboard</IonLabel>
            </IonItem>
          </IonMenuToggle>

       
          <IonMenuToggle autoHide={false}>
            <IonItem button routerLink="/time-keeping" routerDirection="root">
              <Clock className="h-5 w-5 mr-3 text-red-500" />
              <IonLabel>Timesheet</IonLabel>
            </IonItem>
          </IonMenuToggle>

          <IonMenuToggle autoHide={false}>
            <IonItem button routerLink="/leaves" routerDirection="root">
              <Calendar className="h-5 w-5 mr-3 text-red-500" />
              <IonLabel>Leave Management</IonLabel>
            </IonItem>
          </IonMenuToggle>

          <IonMenuToggle autoHide={false}>
            <IonItem button routerLink="/official-business" routerDirection="root">
              <FileText className="h-5 w-5 mr-3 text-red-500" />
              <IonLabel>Official Business Form</IonLabel>
            </IonItem>
          </IonMenuToggle>

          <IonMenuToggle autoHide={false}>
            <IonItem button routerLink="/change-schedule" routerDirection="root">
              <Calendar className="h-5 w-5 mr-3 text-red-500" />
              <IonLabel>Change of Schedule</IonLabel>
            </IonItem>
          </IonMenuToggle>
        </>
      
        )}

          

          {isHR && (
            <IonMenuToggle autoHide={false}>
              <IonItem button routerLink="/hr" routerDirection="root">
                <Users className="h-5 w-5 mr-3 text-red-500" />
                <IonLabel>HR Management</IonLabel>
              </IonItem>
            </IonMenuToggle>
          )}

          <IonMenuToggle autoHide={false}>
            <IonItem button onClick={handleLogout}>
              <IonLabel>Logout</IonLabel>
            </IonItem>
          </IonMenuToggle>
        </IonList>
      </IonContent>
    </IonMenu>
  )
}


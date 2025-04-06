"use client"

import type React from "react"
import { Redirect, Route } from "react-router-dom"
import { IonApp, IonRouterOutlet, setupIonicReact } from "@ionic/react"
import { IonReactRouter } from "@ionic/react-router"

/* Core CSS required for Ionic components to work properly */
import "@ionic/react/css/core.css"

/* Basic CSS for apps built with Ionic */
import "@ionic/react/css/normalize.css"
import "@ionic/react/css/structure.css"
import "@ionic/react/css/typography.css"

/* Optional CSS utils that can be commented out */
import "@ionic/react/css/padding.css"
import "@ionic/react/css/float-elements.css"
import "@ionic/react/css/text-alignment.css"
import "@ionic/react/css/text-transformation.css"
import "@ionic/react/css/flex-utils.css"
import "@ionic/react/css/display.css"

/**
 * Ionic Dark Mode
 * -----------------------------------------------------
 * For more info, please see:
 * https://ionicframework.com/docs/theming/dark-mode
 */

/* import '@ionic/react/css/palettes/dark.always.css'; */
/* import '@ionic/react/css/palettes/dark.class.css'; */
import "@ionic/react/css/palettes/dark.system.css"

/* Theme variables */
import "./theme/variables.css"
import Login from "./pages/Authentication/page"
import Dashboard from "./pages/Employees/Dashboard/page"
import PersonalInfo from "./pages/PersonalInformation/page"
import { AuthProvider } from "./hooks/use-auth"
import ChangeSchedule from "./pages/ChangeSchedule/page"
import Registration from "./pages/Registration/page"
import OfficialBusiness from "./pages/OfficialBusinessForm/page"
import TimeKeeping from "./pages/TimeKeeping/page"
import Leaves from "./pages/Leaves/page"
import HR from "./pages/HR/page"

// Import Chart.js for dashboard graphs
import "chart.js/auto"

// Add a protected route component to handle role-based access
import { useAuth } from "./hooks/use-auth"
import { useHistory } from "react-router-dom"
import { useEffect } from "react"

// Protected route component for HR access
const HRProtectedRoute: React.FC<{
  children: React.ReactNode
}> = ({ children }) => {
  const { user, isAuthenticated } = useAuth()
  const history = useHistory()

  useEffect(() => {
    if (!isAuthenticated) {
      history.push("/login")
      return
    }

    // Check if user is HR
    if (user?.role !== "hr") {
      history.push("/dashboard")
    }
  }, [isAuthenticated, user, history])

  return <>{children}</>
}

setupIonicReact()

const App: React.FC = () => (
  <AuthProvider>
    <IonApp>
      <IonReactRouter>
        <IonRouterOutlet>
          <Route path="/personal-info">
            <PersonalInfo />
          </Route>

          <Route path="/dashboard">
            <Dashboard />
          </Route>

          <Route path="/change-schedule">
            <ChangeSchedule />
          </Route>

          <Route path="/official-business">
            <OfficialBusiness />
          </Route>

          <Route path="/time-keeping">
            <TimeKeeping />
          </Route>

          <Route path="/leaves">
            <Leaves />
          </Route>

          <Route path="/hr">
            <HRProtectedRoute>
              <HR />
            </HRProtectedRoute>
          </Route>

          <Route path="/login">
            <Login />
          </Route>

          <Route path="/register">
            <Registration />
          </Route>

          <Route exact path="/">
            <Redirect to="/login" />
          </Route>
        </IonRouterOutlet>
      </IonReactRouter>
    </IonApp>
  </AuthProvider>
)

export default App


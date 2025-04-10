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
import LoginPage from "./pages/Login/page"
import Dashboard from "./pages/Employees/Dashboard/page"
import PersonalInfo from "./pages/PersonalInformation/page"
import { AuthProvider, useAuth } from "./hooks/use-auth"
import ChangeSchedule from "./pages/ChangeSchedule/page"
import Registration from "./pages/Registration/page"
import OfficialBusiness from "./pages/OfficialBusinessForm/page"
import TimeKeeping from "./pages/TimeKeeping/page"
import Leaves from "./pages/Leaves/page"
import HR from "./pages/HR/page"

// Import Chart.js for dashboard graphs
import "chart.js/auto"

// Add a protected route component to handle role-based access
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

// Protected route component that redirects to login if not authenticated
const ProtectedRoute: React.FC<{
  component: React.ComponentType<any>
  path: string
  exact?: boolean
}> = ({ component: Component, ...rest }) => {
  const { isAuthenticated, isLoading } = useAuth()

  return (
    <Route
      {...rest}
      render={(props) => {
        // Show loading or redirect based on auth state
        if (isLoading) {
          return <div>Loading...</div>
        }

        return isAuthenticated ? (
          <Component {...props} />
        ) : (
          <Redirect
            to={{
              pathname: "/login",
              state: { from: props.location },
            }}
          />
        )
      }}
    />
  )
}

// Create a separate component for the home route
const HomeRedirect: React.FC = () => {
  const { isAuthenticated } = useAuth()
  return isAuthenticated ? <Redirect to="/dashboard" /> : <Redirect to="/login" />
}

setupIonicReact()

const App: React.FC = () => (
  <AuthProvider>
    <IonApp>
      <IonReactRouter>
        <IonRouterOutlet>
          <Route path="/login" component={LoginPage} exact />
          <Route path="/dashboard" component={Dashboard} exact />
          <Route path="/personal-info" component={PersonalInfo}  />
          <Route path="/change-schedule" component={ChangeSchedule}  />
          <Route path="/registration" component={Registration}  />
          <Route path="/official-business" component={OfficialBusiness}  />
          <Route path="/time-keeping" component={TimeKeeping} />
          <Route path="/leaves" component={Leaves} />
          <Route path="/hr" component={HR} />

          {/* Default redirect using a component instead of render prop */}
          <Route exact path="/" component={HomeRedirect} />
        </IonRouterOutlet>
      </IonReactRouter>
    </IonApp>
  </AuthProvider>
)

export default App


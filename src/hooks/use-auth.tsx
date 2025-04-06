"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

interface User {
  id: string
  email: string
  name: string
  role: string
  department?: string
  position?: string
  profileCompleted?: boolean
}

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<boolean>
  register: (userData: any) => Promise<boolean>
  logout: () => void
  updateUserProfile: (profileData: any) => Promise<boolean>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false)

  useEffect(() => {
    // Check if user is stored in localStorage
    const storedUser = localStorage.getItem("user")
    if (storedUser) {
      setUser(JSON.parse(storedUser))
      setIsAuthenticated(true)
    }
  }, [])

  const login = async (email: string, password: string) => {
    try {
      // Import employee data
      const { employeeData } = await import("@/data/employee-data")

      // Find employee by email
      const employee = employeeData.find((emp) => emp.email.toLowerCase() === email.toLowerCase())

      if (!employee) {
        return false
      }

      // In a real app, we would verify the password here
      // For demo purposes, we'll accept any password

      // Determine role based on department or position
      const isHR = employee.department === "HR" || (employee.position && employee.position.toLowerCase().includes("hr"))

      const mockUser = {
        id: employee.id,
        email: employee.email,
        name: employee.name,
        role: isHR ? "hr" : "employee",
        department: employee.department,
        position: employee.position,
        profileCompleted: true,
      }

      setUser(mockUser)
      setIsAuthenticated(true)
      localStorage.setItem("user", JSON.stringify(mockUser))
      return true
    } catch (error) {
      console.error("Login failed:", error)
      return false
    }
  }

  const register = async (userData: any) => {
    try {
      // In a real app, this would be an API call
      // For demo purposes, we'll simulate a successful registration
      const mockUser = {
        id: Math.random().toString(36).substr(2, 9),
        email: userData.email,
        name: userData.firstName ? `${userData.firstName} ${userData.lastName || ""}` : "New User",
        role: userData.department?.toLowerCase() === "hr" ? "hr" : "employee",
        department: userData.department || "",
        position: userData.position || "",
        profileCompleted: false,
      }

      setUser(mockUser)
      setIsAuthenticated(true)
      localStorage.setItem("user", JSON.stringify(mockUser))
      return true
    } catch (error) {
      console.error("Registration failed:", error)
      return false
    }
  }

  const updateUserProfile = async (profileData: any) => {
    try {
      if (!user) return false

      // Determine role based on department
      const isHR =
        profileData.department === "HR" || (profileData.position && profileData.position.toLowerCase().includes("hr"))

      // In a real app, this would be an API call
      const updatedUser = {
        ...user,
        name: `${profileData.firstName || ""} ${profileData.lastName || ""}`,
        role: isHR ? "hr" : "employee",
        department: profileData.department || user.department,
        position: profileData.position || user.position,
        profileCompleted: true,
        // Add other profile fields as needed
      }

      setUser(updatedUser)
      localStorage.setItem("user", JSON.stringify(updatedUser))
      return true
    } catch (error) {
      console.error("Profile update failed:", error)
      return false
    }
  }

  const logout = () => {
    setUser(null)
    setIsAuthenticated(false)
    localStorage.removeItem("user")
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        login,
        register,
        logout,
        updateUserProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}


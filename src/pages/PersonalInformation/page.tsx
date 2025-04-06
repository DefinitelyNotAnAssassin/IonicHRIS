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
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonCardSubtitle,
  IonInput,
  IonLabel,
  IonItem,
  IonButton,
  IonSegment,
  IonSegmentButton,
  IonSelect,
  IonSelectOption,
  IonGrid,
  IonRow,
  IonCol,
  IonIcon,
  IonText,
  useIonToast,
} from "@ionic/react"
import { useHistory } from "react-router-dom"
import { useAuth } from "../../hooks/use-auth"
import { add, close, checkmarkCircle } from "ionicons/icons"
import SideMenu from "@/components/side-menu"

export default function PersonalInfo({
  registrationMode = false,
  registrationEmail = "",
}: {
  registrationMode?: boolean
  registrationEmail?: string
}) {
  const { user, isAuthenticated, updateUserProfile } = useAuth()
  const history = useHistory()
  const [activeTab, setActiveTab] = useState("personal")
  const [isLoading, setIsLoading] = useState(false)
  const [isNewRegistration, setIsNewRegistration] = useState(registrationMode)
  const [present] = useIonToast()

  // Form data state
  const [personalData, setPersonalData] = useState({
    surname: "",
    firstName: "",
    middleName: "",
    suffix: "",
    nickname: "",
    presentAddress: "",
    provincialAddress: "",
    telephoneNo: "",
    mobileNo: "",
    emailAddress: registrationEmail || user?.email || "",
    dateOfBirth: "",
    placeOfBirth: "",
    age: "",
    gender: "",
    citizenship: "",
    civilStatus: "",
    height: "",
    weight: "",
    ssNo: "",
    tinNo: "",
    philHealthNo: "",
    pagIbigNo: "",
    department: "",
    position: "",
  })

  const [familyData, setFamilyData] = useState({
    spouseName: "",
    spouseOccupation: "",
    spouseCompany: "",
    fatherName: "",
    fatherOccupation: "",
    fatherCompany: "",
    motherName: "",
    motherOccupation: "",
    motherCompany: "",
    siblings: [{ name: "", occupation: "", company: "" }],
    dependents: [{ name: "", occupation: "", company: "" }],
  })

  const [educationData, setEducationData] = useState({
    bachelor: { level: "BACHELOR'S DEGREE", school: "", course: "", period: "" },
    postGrad: { level: "POST-GRADUATE", school: "", course: "", period: "" },
    masteral: { level: "MASTERAL", school: "", course: "", period: "" },
    doctoral: { level: "DOCTORATE", school: "", course: "", period: "" },
    vocational: { level: "VOCATIONAL/OTHERS", school: "", course: "", period: "" },
    honors: [{ nature: "", awardingBody: "", date: "" }],
    licensure: [{ exam: "", rating: "", dateTaken: "", licenseNo: "", issued: "", expiration: "" }],
  })

  useEffect(() => {
    if (!isAuthenticated && !registrationMode) {
      history.push("/login")
      return
    }

    // Check if this is a new registration (profile not completed)
    if ((user && user.profileCompleted === false) || registrationMode) {
      setIsNewRegistration(true)

      // Pre-fill email if available
      if (registrationEmail) {
        setPersonalData((prev) => ({
          ...prev,
          emailAddress: registrationEmail,
        }))
      } else if (user?.email) {
        setPersonalData((prev) => ({
          ...prev,
          emailAddress: user.email,
        }))
      }
    }
  }, [isAuthenticated, history, user, registrationMode, registrationEmail])

  const handlePersonalChange = (e: any) => {
    const { name, value } = e.target
    setPersonalData((prev) => ({ ...prev, [name]: value }))
  }

  const handleCustomInputChange = (name: string, value: any) => {
    setPersonalData((prev) => ({ ...prev, [name]: value }))
  }

  const handleFamilyChange = (e: any) => {
    const { name, value } = e.target
    setFamilyData((prev) => ({ ...prev, [name]: value }))
  }

  const handleFamilyCustomChange = (name: string, value: any) => {
    setFamilyData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSiblingChange = (index: number, field: string, value: string) => {
    const updatedSiblings = [...familyData.siblings]
    updatedSiblings[index] = { ...updatedSiblings[index], [field]: value }
    setFamilyData((prev) => ({ ...prev, siblings: updatedSiblings }))
  }

  const handleDependentChange = (index: number, field: string, value: string) => {
    const updatedDependents = [...familyData.dependents]
    updatedDependents[index] = { ...updatedDependents[index], [field]: value }
    setFamilyData((prev) => ({ ...prev, dependents: updatedDependents }))
  }

  const addSibling = () => {
    setFamilyData((prev) => ({
      ...prev,
      siblings: [...prev.siblings, { name: "", occupation: "", company: "" }],
    }))
  }

  const addDependent = () => {
    setFamilyData((prev) => ({
      ...prev,
      dependents: [...prev.dependents, { name: "", occupation: "", company: "" }],
    }))
  }

  const removeSibling = (index: number) => {
    if (familyData.siblings.length > 1) {
      const updatedSiblings = [...familyData.siblings]
      updatedSiblings.splice(index, 1)
      setFamilyData((prev) => ({ ...prev, siblings: updatedSiblings }))
    }
  }

  const removeDependent = (index: number) => {
    if (familyData.dependents.length > 1) {
      const updatedDependents = [...familyData.dependents]
      updatedDependents.splice(index, 1)
      setFamilyData((prev) => ({ ...prev, dependents: updatedDependents }))
    }
  }

  const handleEducationChange = (level: string, field: string, value: string) => {
    setEducationData((prev) => ({
      ...prev,
      [level]: { ...prev[level as keyof typeof prev], [field]: value },
    }))
  }

  const handleHonorChange = (index: number, field: string, value: string) => {
    const updatedHonors = [...educationData.honors]
    updatedHonors[index] = { ...updatedHonors[index], [field]: value }
    setEducationData((prev) => ({ ...prev, honors: updatedHonors }))
  }

  const handleLicensureChange = (index: number, field: string, value: string) => {
    const updatedLicensure = [...educationData.licensure]
    updatedLicensure[index] = { ...updatedLicensure[index], [field]: value }
    setEducationData((prev) => ({ ...prev, licensure: updatedLicensure }))
  }

  const addHonor = () => {
    setEducationData((prev) => ({
      ...prev,
      honors: [...prev.honors, { nature: "", awardingBody: "", date: "" }],
    }))
  }

  const addLicensure = () => {
    setEducationData((prev) => ({
      ...prev,
      licensure: [
        ...prev.licensure,
        { exam: "", rating: "", dateTaken: "", licenseNo: "", issued: "", expiration: "" },
      ],
    }))
  }

  const removeHonor = (index: number) => {
    if (educationData.honors.length > 1) {
      const updatedHonors = [...educationData.honors]
      updatedHonors.splice(index, 1)
      setEducationData((prev) => ({ ...prev, honors: updatedHonors }))
    }
  }

  const removeLicensure = (index: number) => {
    if (educationData.licensure.length > 1) {
      const updatedLicensure = [...educationData.licensure]
      updatedLicensure.splice(index, 1)
      setEducationData((prev) => ({ ...prev, licensure: updatedLicensure }))
    }
  }

  const presentToast = (message: string, color: "success" | "danger" = "success") => {
    present({
      message: message,
      duration: 3000,
      position: "bottom",
      color: color,
    })
  }

  // Update the handleSubmit function to include department and position
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // Combine all data for profile update
      const profileData = {
        ...personalData,
        familyData,
        educationData,
        firstName: personalData.firstName,
        lastName: personalData.surname,
        department: personalData.department || "", // Add department
        position: personalData.position || "", // Add position
      }

      const success = await updateUserProfile(profileData)

      if (success) {
        presentToast("Your personal information has been updated successfully")

        // If this was a new registration, redirect based on role
        if (isNewRegistration) {
          setTimeout(() => {
            // Get updated user info
            const currentUser = JSON.parse(localStorage.getItem("user") || "{}")

            // Redirect based on role
            if (currentUser.role === "hr") {
              history.push("/hr")
            } else {
              history.push("/dashboard")
            }
          }, 1500)
        }
      } else {
        presentToast("Failed to update profile information", "danger")
      }
    } catch (error) {
      presentToast("An error occurred while updating your profile", "danger")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      {/* Only show sidebar if not in registration mode */}
      {!isNewRegistration && <SideMenu />}

      <IonPage id="main-content" className="p-8">
        <IonHeader>
          <IonToolbar>
            {!isNewRegistration && (
              <IonButtons slot="start">
                <IonMenuButton></IonMenuButton>
              </IonButtons>
            )}
            <IonTitle>{isNewRegistration ? "Complete Your Profile" : "Personal Information"}</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent className="">
          {isNewRegistration && (
            <div className="bg-red-50 p-4 rounded-lg mb-4 mt-4 mx-4 flex items-center">
              <IonIcon icon={checkmarkCircle} className="text-red-500 mr-2 text-xl" />
              <div>
                <h3 className="font-medium text-red-800">Welcome to SDCA HRIS</h3>
                <p className="text-red-600 text-sm">Please complete your profile information to continue.</p>
              </div>
            </div>
          )}

          <IonCard className="mt-4 py-8 px-4 rounded-lg ">
            <IonCardHeader>
              <IonCardTitle>
                {isNewRegistration ? "Employee Registration Form" : "Employment Application Form"}
              </IonCardTitle>
              <IonCardSubtitle>Please fill out all the required information</IonCardSubtitle>
            </IonCardHeader>
            <IonCardContent>
              <IonSegment value={activeTab} onIonChange={(e) => setActiveTab(e.detail.value as string)}>
                <IonSegmentButton value="personal">
                  <IonLabel>Personal Data</IonLabel>
                </IonSegmentButton>
                <IonSegmentButton value="family">
                  <IonLabel>Family Information</IonLabel>
                </IonSegmentButton>
                <IonSegmentButton value="education">
                  <IonLabel>Academic Data</IonLabel>
                </IonSegmentButton>
              </IonSegment>

              {/* Personal Tab Content */}
              {activeTab === "personal" && (
                <div className="ion-padding-top">
                  <IonGrid>
                    <IonRow>
                      <IonCol size="12" sizeMd="6">
                        <IonItem>
                          <IonLabel position="floating">
                            Surname <span className="text-red-500">*</span>
                          </IonLabel>
                          <IonInput
                            name="surname"
                            value={personalData.surname}
                            onIonChange={(e) => handleCustomInputChange("surname", e.detail.value)}
                            required
                          />
                        </IonItem>
                      </IonCol>
                      <IonCol size="12" sizeMd="6">
                        <IonItem>
                          <IonLabel position="floating">
                            First Name <span className="text-red-500">*</span>
                          </IonLabel>
                          <IonInput
                            name="firstName"
                            value={personalData.firstName}
                            onIonChange={(e) => handleCustomInputChange("firstName", e.detail.value)}
                            required
                          />
                        </IonItem>
                      </IonCol>
                    </IonRow>

                    <IonRow>
                      <IonCol size="12" sizeMd="6">
                        <IonItem>
                          <IonLabel position="floating">Middle Name</IonLabel>
                          <IonInput
                            name="middleName"
                            value={personalData.middleName}
                            onIonChange={(e) => handleCustomInputChange("middleName", e.detail.value)}
                          />
                        </IonItem>
                      </IonCol>
                      <IonCol size="6" sizeMd="3">
                        <IonItem>
                          <IonLabel position="floating">Suffix</IonLabel>
                          <IonInput
                            name="suffix"
                            value={personalData.suffix}
                            onIonChange={(e) => handleCustomInputChange("suffix", e.detail.value)}
                          />
                        </IonItem>
                      </IonCol>
                      <IonCol size="6" sizeMd="3">
                        <IonItem>
                          <IonLabel position="floating">Nickname</IonLabel>
                          <IonInput
                            name="nickname"
                            value={personalData.nickname}
                            onIonChange={(e) => handleCustomInputChange("nickname", e.detail.value)}
                          />
                        </IonItem>
                      </IonCol>
                    </IonRow>

                    <IonRow>
                      <IonCol size="12">
                        <IonItem>
                          <IonLabel position="floating">
                            Present Address <span className="text-red-500">*</span>
                          </IonLabel>
                          <IonInput
                            name="presentAddress"
                            value={personalData.presentAddress}
                            onIonChange={(e) => handleCustomInputChange("presentAddress", e.detail.value)}
                            required
                          />
                        </IonItem>
                      </IonCol>
                    </IonRow>

                    <IonRow>
                      <IonCol size="12">
                        <IonItem>
                          <IonLabel position="floating">Provincial Address</IonLabel>
                          <IonInput
                            name="provincialAddress"
                            value={personalData.provincialAddress}
                            onIonChange={(e) => handleCustomInputChange("provincialAddress", e.detail.value)}
                          />
                        </IonItem>
                      </IonCol>
                    </IonRow>

                    <IonRow>
                      <IonCol size="12" sizeMd="6">
                        <IonItem>
                          <IonLabel position="floating">Telephone No.</IonLabel>
                          <IonInput
                            name="telephoneNo"
                            value={personalData.telephoneNo}
                            onIonChange={(e) => handleCustomInputChange("telephoneNo", e.detail.value)}
                          />
                        </IonItem>
                      </IonCol>
                      <IonCol size="12" sizeMd="6">
                        <IonItem>
                          <IonLabel position="floating">
                            Mobile No. <span className="text-red-500">*</span>
                          </IonLabel>
                          <IonInput
                            name="mobileNo"
                            value={personalData.mobileNo}
                            onIonChange={(e) => handleCustomInputChange("mobileNo", e.detail.value)}
                            required
                          />
                        </IonItem>
                      </IonCol>
                    </IonRow>

                    <IonRow>
                      <IonCol size="12">
                        <IonItem>
                          <IonLabel position="floating">
                            Email Address <span className="text-red-500">*</span>
                          </IonLabel>
                          <IonInput
                            name="emailAddress"
                            type="email"
                            value={personalData.emailAddress}
                            onIonChange={(e) => handleCustomInputChange("emailAddress", e.detail.value)}
                            required
                            readonly={isNewRegistration}
                          />
                        </IonItem>
                      </IonCol>
                    </IonRow>

                    <IonRow>
                      <IonCol size="12" sizeMd="4">
                        <IonItem>
                          <IonLabel position="floating">
                            Date of Birth <span className="text-red-500">*</span>
                          </IonLabel>
                          <IonInput
                            name="dateOfBirth"
                            type="date"
                            value={personalData.dateOfBirth}
                            onIonChange={(e) => handleCustomInputChange("dateOfBirth", e.detail.value)}
                            required
                          />
                        </IonItem>
                      </IonCol>
                      <IonCol size="12" sizeMd="4">
                        <IonItem>
                          <IonLabel position="floating">Place of Birth</IonLabel>
                          <IonInput
                            name="placeOfBirth"
                            value={personalData.placeOfBirth}
                            onIonChange={(e) => handleCustomInputChange("placeOfBirth", e.detail.value)}
                          />
                        </IonItem>
                      </IonCol>
                      <IonCol size="12" sizeMd="4">
                        <IonItem>
                          <IonLabel position="floating">Age</IonLabel>
                          <IonInput
                            name="age"
                            type="number"
                            value={personalData.age}
                            onIonChange={(e) => handleCustomInputChange("age", e.detail.value)}
                          />
                        </IonItem>
                      </IonCol>
                    </IonRow>

                    <IonRow>
                      <IonCol size="12" sizeMd="4">
                        <IonItem>
                          <IonLabel position="floating">
                            Gender <span className="text-red-500">*</span>
                          </IonLabel>
                          <IonSelect
                            name="gender"
                            value={personalData.gender}
                            onIonChange={(e) => handleCustomInputChange("gender", e.detail.value)}
                            required
                          >
                            <IonSelectOption value="">Select Gender</IonSelectOption>
                            <IonSelectOption value="Male">Male</IonSelectOption>
                            <IonSelectOption value="Female">Female</IonSelectOption>
                          </IonSelect>
                        </IonItem>
                      </IonCol>
                      <IonCol size="12" sizeMd="4">
                        <IonItem>
                          <IonLabel position="floating">Citizenship</IonLabel>
                          <IonInput
                            name="citizenship"
                            value={personalData.citizenship}
                            onIonChange={(e) => handleCustomInputChange("citizenship", e.detail.value)}
                          />
                        </IonItem>
                      </IonCol>
                      <IonCol size="12" sizeMd="4">
                        <IonItem>
                          <IonLabel position="floating">
                            Civil Status <span className="text-red-500">*</span>
                          </IonLabel>
                          <IonSelect
                            name="civilStatus"
                            value={personalData.civilStatus}
                            onIonChange={(e) => handleCustomInputChange("civilStatus", e.detail.value)}
                            required
                          >
                            <IonSelectOption value="">Select Status</IonSelectOption>
                            <IonSelectOption value="Single">Single</IonSelectOption>
                            <IonSelectOption value="Married">Married</IonSelectOption>
                            <IonSelectOption value="Widowed">Widowed</IonSelectOption>
                            <IonSelectOption value="Separated">Separated</IonSelectOption>
                          </IonSelect>
                        </IonItem>
                      </IonCol>
                    </IonRow>

                    <IonRow>
                      <IonCol size="12" sizeMd="6">
                        <IonItem>
                          <IonLabel position="floating">Height (cm)</IonLabel>
                          <IonInput
                            name="height"
                            type="number"
                            value={personalData.height}
                            onIonChange={(e) => handleCustomInputChange("height", e.detail.value)}
                          />
                        </IonItem>
                      </IonCol>
                      <IonCol size="12" sizeMd="6">
                        <IonItem>
                          <IonLabel position="floating">Weight (kg)</IonLabel>
                          <IonInput
                            name="weight"
                            type="number"
                            value={personalData.weight}
                            onIonChange={(e) => handleCustomInputChange("weight", e.detail.value)}
                          />
                        </IonItem>
                      </IonCol>
                    </IonRow>

                    <IonRow>
                      <IonCol size="12" sizeMd="6">
                        <IonItem>
                          <IonLabel position="floating">SS No.</IonLabel>
                          <IonInput
                            name="ssNo"
                            value={personalData.ssNo}
                            onIonChange={(e) => handleCustomInputChange("ssNo", e.detail.value)}
                          />
                        </IonItem>
                      </IonCol>
                      <IonCol size="12" sizeMd="6">
                        <IonItem>
                          <IonLabel position="floating">Tax Identification No. (TIN)</IonLabel>
                          <IonInput
                            name="tinNo"
                            value={personalData.tinNo}
                            onIonChange={(e) => handleCustomInputChange("tinNo", e.detail.value)}
                          />
                        </IonItem>
                      </IonCol>
                    </IonRow>

                    <IonRow>
                      <IonCol size="12" sizeMd="6">
                        <IonItem>
                          <IonLabel position="floating">PhilHealth Identification No. (PIN)</IonLabel>
                          <IonInput
                            name="philHealthNo"
                            value={personalData.philHealthNo}
                            onIonChange={(e) => handleCustomInputChange("philHealthNo", e.detail.value)}
                          />
                        </IonItem>
                      </IonCol>
                      <IonCol size="12" sizeMd="6">
                        <IonItem>
                          <IonLabel position="floating">Pag-IBIG MID No.</IonLabel>
                          <IonInput
                            name="pagIbigNo"
                            value={personalData.pagIbigNo}
                            onIonChange={(e) => handleCustomInputChange("pagIbigNo", e.detail.value)}
                          />
                        </IonItem>
                      </IonCol>
                    </IonRow>
                    
                    <IonRow>
                      <IonCol size="12" sizeMd="6">
                        <IonItem>
                          <IonLabel position="floating">
                            Department <span className="text-red-500">*</span>
                          </IonLabel>
                          <IonSelect
                            name="department"
                            value={personalData.department}
                            onIonChange={(e) => handleCustomInputChange("department", e.detail.value)}
                            required
                          >
                            <IonSelectOption value="IT">IT</IonSelectOption>
                            <IonSelectOption value="HR">HR</IonSelectOption>
                            <IonSelectOption value="Finance">Finance</IonSelectOption>
                            <IonSelectOption value="Marketing">Marketing</IonSelectOption>
                            <IonSelectOption value="Operations">Operations</IonSelectOption>
                          </IonSelect>
                        </IonItem>
                      </IonCol>
                      <IonCol size="12" sizeMd="6">
                        <IonItem>
                          <IonLabel position="floating">
                            Position <span className="text-red-500">*</span>
                          </IonLabel>
                          <IonInput
                            name="position"
                            value={personalData.position}
                            onIonChange={(e) => handleCustomInputChange("position", e.detail.value)}
                            required
                          />
                        </IonItem>
                      </IonCol>
                    </IonRow>
                  </IonGrid>
                </div>
              )}

              {/* Family Tab Content */}
              {activeTab === "family" && (
                <div className="ion-padding-top">
                  <IonGrid>
                    <IonRow>
                      <IonCol size="12" sizeMd="4">
                        <IonItem>
                          <IonLabel position="floating">Name of Spouse</IonLabel>
                          <IonInput
                            name="spouseName"
                            value={familyData.spouseName}
                            onIonChange={(e) => handleFamilyCustomChange("spouseName", e.detail.value)}
                          />
                        </IonItem>
                      </IonCol>
                      <IonCol size="12" sizeMd="4">
                        <IonItem>
                          <IonLabel position="floating">Occupation</IonLabel>
                          <IonInput
                            name="spouseOccupation"
                            value={familyData.spouseOccupation}
                            onIonChange={(e) => handleFamilyCustomChange("spouseOccupation", e.detail.value)}
                          />
                        </IonItem>
                      </IonCol>
                      <IonCol size="12" sizeMd="4">
                        <IonItem>
                          <IonLabel position="floating">Company</IonLabel>
                          <IonInput
                            name="spouseCompany"
                            value={familyData.spouseCompany}
                            onIonChange={(e) => handleFamilyCustomChange("spouseCompany", e.detail.value)}
                          />
                        </IonItem>
                      </IonCol>
                    </IonRow>

                    <IonRow>
                      <IonCol size="12" sizeMd="4">
                        <IonItem>
                          <IonLabel position="floating">Father's Name</IonLabel>
                          <IonInput
                            name="fatherName"
                            value={familyData.fatherName}
                            onIonChange={(e) => handleFamilyCustomChange("fatherName", e.detail.value)}
                          />
                        </IonItem>
                      </IonCol>
                      <IonCol size="12" sizeMd="4">
                        <IonItem>
                          <IonLabel position="floating">Occupation</IonLabel>
                          <IonInput
                            name="fatherOccupation"
                            value={familyData.fatherOccupation}
                            onIonChange={(e) => handleFamilyCustomChange("fatherOccupation", e.detail.value)}
                          />
                        </IonItem>
                      </IonCol>
                      <IonCol size="12" sizeMd="4">
                        <IonItem>
                          <IonLabel position="floating">Company</IonLabel>
                          <IonInput
                            name="fatherCompany"
                            value={familyData.fatherCompany}
                            onIonChange={(e) => handleFamilyCustomChange("fatherCompany", e.detail.value)}
                          />
                        </IonItem>
                      </IonCol>
                    </IonRow>

                    <IonRow>
                      <IonCol size="12" sizeMd="4">
                        <IonItem>
                          <IonLabel position="floating">Mother's Name</IonLabel>
                          <IonInput
                            name="motherName"
                            value={familyData.motherName}
                            onIonChange={(e) => handleFamilyCustomChange("motherName", e.detail.value)}
                          />
                        </IonItem>
                      </IonCol>
                      <IonCol size="12" sizeMd="4">
                        <IonItem>
                          <IonLabel position="floating">Occupation</IonLabel>
                          <IonInput
                            name="motherOccupation"
                            value={familyData.motherOccupation}
                            onIonChange={(e) => handleFamilyCustomChange("motherOccupation", e.detail.value)}
                          />
                        </IonItem>
                      </IonCol>
                      <IonCol size="12" sizeMd="4">
                        <IonItem>
                          <IonLabel position="floating">Company</IonLabel>
                          <IonInput
                            name="motherCompany"
                            value={familyData.motherCompany}
                            onIonChange={(e) => handleFamilyCustomChange("motherCompany", e.detail.value)}
                          />
                        </IonItem>
                      </IonCol>
                    </IonRow>

                    <IonRow className="ion-padding-top">
                      <IonCol size="12">
                        <IonItem lines="none">
                          <IonLabel>List of Siblings</IonLabel>
                          <IonButton slot="end" size="small" onClick={addSibling} color="danger">
                            <IonIcon slot="icon-only" icon={add} />
                          </IonButton>
                        </IonItem>
                      </IonCol>
                    </IonRow>

                    {familyData.siblings.map((sibling, index) => (
                      <IonCard key={index} className="ion-margin-vertical">
                        <IonCardContent>
                          <IonRow>
                            <IonCol size="12" sizeMd="4">
                              <IonItem>
                                <IonLabel position="floating">Name</IonLabel>
                                <IonInput
                                  value={sibling.name}
                                  onIonChange={(e) => handleSiblingChange(index, "name", e.detail.value || "")}
                                />
                              </IonItem>
                            </IonCol>
                            <IonCol size="12" sizeMd="4">
                              <IonItem>
                                <IonLabel position="floating">Occupation</IonLabel>
                                <IonInput
                                  value={sibling.occupation}
                                  onIonChange={(e) => handleSiblingChange(index, "occupation", e.detail.value || "")}
                                />
                              </IonItem>
                            </IonCol>
                            <IonCol size="12" sizeMd="3">
                              <IonItem>
                                <IonLabel position="floating">Company</IonLabel>
                                <IonInput
                                  value={sibling.company}
                                  onIonChange={(e) => handleSiblingChange(index, "company", e.detail.value || "")}
                                />
                              </IonItem>
                            </IonCol>
                            {familyData.siblings.length > 1 && (
                              <IonCol size="12" sizeMd="1" className="ion-align-self-end">
                                <IonButton color="danger" fill="clear" onClick={() => removeSibling(index)}>
                                  <IonIcon icon={close} />
                                </IonButton>
                              </IonCol>
                            )}
                          </IonRow>
                        </IonCardContent>
                      </IonCard>
                    ))}

                    <IonRow className="ion-padding-top">
                      <IonCol size="12">
                        <IonItem lines="none">
                          <IonLabel>List of Dependents</IonLabel>
                          <IonButton slot="end" size="small" onClick={addDependent} color="danger">
                            <IonIcon slot="icon-only" icon={add} />
                          </IonButton>
                        </IonItem>
                      </IonCol>
                    </IonRow>

                    {familyData.dependents.map((dependent, index) => (
                      <IonCard key={index} className="ion-margin-vertical">
                        <IonCardContent>
                          <IonRow>
                            <IonCol size="12" sizeMd="4">
                              <IonItem>
                                <IonLabel position="floating">Name</IonLabel>
                                <IonInput
                                  value={dependent.name}
                                  onIonChange={(e) => handleDependentChange(index, "name", e.detail.value || "")}
                                />
                              </IonItem>
                            </IonCol>
                            <IonCol size="12" sizeMd="4">
                              <IonItem>
                                <IonLabel position="floating">Occupation</IonLabel>
                                <IonInput
                                  value={dependent.occupation}
                                  onIonChange={(e) => handleDependentChange(index, "occupation", e.detail.value || "")}
                                />
                              </IonItem>
                            </IonCol>
                            <IonCol size="12" sizeMd="3">
                              <IonItem>
                                <IonLabel position="floating">Company</IonLabel>
                                <IonInput
                                  value={dependent.company}
                                  onIonChange={(e) => handleDependentChange(index, "company", e.detail.value || "")}
                                />
                              </IonItem>
                            </IonCol>
                            {familyData.dependents.length > 1 && (
                              <IonCol size="12" sizeMd="1" className="ion-align-self-end">
                                <IonButton color="danger" fill="clear" onClick={() => removeDependent(index)}>
                                  <IonIcon icon={close} />
                                </IonButton>
                              </IonCol>
                            )}
                          </IonRow>
                        </IonCardContent>
                      </IonCard>
                    ))}
                  </IonGrid>
                </div>
              )}

              {/* Education Tab Content */}
              {activeTab === "education" && (
                <div className="ion-padding-top">
                  <IonGrid>
                    <IonRow>
                      <IonCol size="12">
                        <IonText>
                          <h3>Academic Data</h3>
                        </IonText>
                      </IonCol>
                    </IonRow>

                    {Object.entries(educationData)
                      .slice(0, 5)
                      .map(([key, value]) => {
                        if (typeof value === "object" && "level" in value) {
                          const education = value as { level: string; school: string; course: string; period: string }
                          return (
                            <IonCard key={key} className="ion-margin-vertical">
                              <IonCardContent>
                                <IonRow>
                                  <IonCol size="12">
                                    <IonItem lines="none">
                                      <IonLabel color="danger">{education.level}</IonLabel>
                                    </IonItem>
                                  </IonCol>
                                </IonRow>
                                <IonRow>
                                  <IonCol size="12" sizeMd="4">
                                    <IonItem>
                                      <IonLabel position="floating">School/Location</IonLabel>
                                      <IonInput
                                        value={education.school}
                                        onIonChange={(e) => handleEducationChange(key, "school", e.detail.value || "")}
                                      />
                                    </IonItem>
                                  </IonCol>
                                  <IonCol size="12" sizeMd="4">
                                    <IonItem>
                                      <IonLabel position="floating">Course/Program</IonLabel>
                                      <IonInput
                                        value={education.course}
                                        onIonChange={(e) => handleEducationChange(key, "course", e.detail.value || "")}
                                      />
                                    </IonItem>
                                  </IonCol>
                                  <IonCol size="12" sizeMd="4">
                                    <IonItem>
                                      <IonLabel position="floating">Period Covered</IonLabel>
                                      <IonInput
                                        value={education.period}
                                        placeholder="e.g., 2015-2019"
                                        onIonChange={(e) => handleEducationChange(key, "period", e.detail.value || "")}
                                      />
                                    </IonItem>
                                  </IonCol>
                                </IonRow>
                              </IonCardContent>
                            </IonCard>
                          )
                        }
                        return null
                      })}

                    <IonRow className="ion-padding-top">
                      <IonCol size="12">
                        <IonItem lines="none">
                          <IonLabel>Honors and Awards</IonLabel>
                          <IonButton slot="end" size="small" onClick={addHonor} color="danger">
                            <IonIcon slot="icon-only" icon={add} />
                          </IonButton>
                        </IonItem>
                      </IonCol>
                    </IonRow>

                    {educationData.honors.map((honor, index) => (
                      <IonCard key={index} className="ion-margin-vertical">
                        <IonCardContent>
                          <IonRow>
                            <IonCol size="12" sizeMd="4">
                              <IonItem>
                                <IonLabel position="floating">Nature of Award</IonLabel>
                                <IonInput
                                  value={honor.nature}
                                  onIonChange={(e) => handleHonorChange(index, "nature", e.detail.value || "")}
                                />
                              </IonItem>
                            </IonCol>
                            <IonCol size="12" sizeMd="4">
                              <IonItem>
                                <IonLabel position="floating">Award Giving Body</IonLabel>
                                <IonInput
                                  value={honor.awardingBody}
                                  onIonChange={(e) => handleHonorChange(index, "awardingBody", e.detail.value || "")}
                                />
                              </IonItem>
                            </IonCol>
                            <IonCol size="12" sizeMd="3">
                              <IonItem>
                                <IonLabel position="floating">Date</IonLabel>
                                <IonInput
                                  type="date"
                                  value={honor.date}
                                  onIonChange={(e) => handleHonorChange(index, "date", e.detail.value || "")}
                                />
                              </IonItem>
                            </IonCol>
                            {educationData.honors.length > 1 && (
                              <IonCol size="12" sizeMd="1" className="ion-align-self-end">
                                <IonButton color="danger" fill="clear" onClick={() => removeHonor(index)}>
                                  <IonIcon icon={close} />
                                </IonButton>
                              </IonCol>
                            )}
                          </IonRow>
                        </IonCardContent>
                      </IonCard>
                    ))}

                    <IonRow className="ion-padding-top">
                      <IonCol size="12">
                        <IonItem lines="none">
                          <IonLabel>Licensure Examination</IonLabel>
                          <IonButton slot="end" size="small" onClick={addLicensure} color="danger">
                            <IonIcon slot="icon-only" icon={add} />
                          </IonButton>
                        </IonItem>
                      </IonCol>
                    </IonRow>

                    {educationData.licensure.map((license, index) => (
                      <IonCard key={index} className="ion-margin-vertical">
                        <IonCardContent>
                          <IonRow>
                            <IonCol size="12" sizeMd="4">
                              <IonItem>
                                <IonLabel position="floating">Board Examination</IonLabel>
                                <IonInput
                                  value={license.exam}
                                  onIonChange={(e) => handleLicensureChange(index, "exam", e.detail.value || "")}
                                />
                              </IonItem>
                            </IonCol>
                            <IonCol size="12" sizeMd="4">
                              <IonItem>
                                <IonLabel position="floating">Rating</IonLabel>
                                <IonInput
                                  value={license.rating}
                                  onIonChange={(e) => handleLicensureChange(index, "rating", e.detail.value || "")}
                                />
                              </IonItem>
                            </IonCol>
                            <IonCol size="12" sizeMd="4">
                              <IonItem>
                                <IonLabel position="floating">Date Taken</IonLabel>
                                <IonInput
                                  type="date"
                                  value={license.dateTaken}
                                  onIonChange={(e) => handleLicensureChange(index, "dateTaken", e.detail.value || "")}
                                />
                              </IonItem>
                              </IonCol>
                            </IonRow>
                          <IonRow>
                            <IonCol size="12" sizeMd="4">
                              <IonItem>
                                <IonLabel position="floating">License No.</IonLabel>
                                <IonInput
                                  value={license.licenseNo}
                                  onIonChange={(e) => handleLicensureChange(index, "licenseNo", e.detail.value || "")}
                                />
                              </IonItem>
                            </IonCol>
                            <IonCol size="12" sizeMd="4">
                              <IonItem>
                                <IonLabel position="floating">Issued</IonLabel>
                                <IonInput
                                  type="date"
                                  value={license.issued}
                                  onIonChange={(e) => handleLicensureChange(index, "issued", e.detail.value || "")}
                                />
                              </IonItem>
                            </IonCol>
                            <IonCol size="12" sizeMd="3">
                              <IonItem>
                                <IonLabel position="floating">Expiration</IonLabel>
                                <IonInput
                                  type="date"
                                  value={license.expiration}
                                  onIonChange={(e) => handleLicensureChange(index, "expiration", e.detail.value || "")}
                                />
                              </IonItem>
                            </IonCol>
                            {educationData.licensure.length > 1 && (
                              <IonCol size="12" sizeMd="1" className="ion-align-self-end">
                                <IonButton color="danger" fill="clear" onClick={() => removeLicensure(index)}>
                                  <IonIcon icon={close} />
                                </IonButton>
                              </IonCol>
                        )}
                      </IonRow>
                    </IonCardContent>
                  </IonCard>
                ))}
              </IonGrid>
            </div>
          )}
        </IonCardContent>

        <div className="ion-padding">
          <IonRow>
            <IonCol className="ion-text-start">
                  {!isNewRegistration && (
                    <IonButton fill="outline" onClick={() => history.push("/dashboard")} color="danger">
                      Cancel
                    </IonButton>
                  )}
                </IonCol>
                <IonCol className="ion-text-end">
                  <IonButton onClick={handleSubmit} disabled={isLoading} color="danger">
                    {isLoading ? "Saving..." : isNewRegistration ? "Complete Registration" : "Save Information"}
                  </IonButton>
                </IonCol>
              </IonRow>
            </div>
          </IonCard>
        </IonContent>
      </IonPage>
    </>
  )
}



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
  IonLoading,
} from "@ionic/react"
import { useHistory } from "react-router-dom"
import { useAuth } from "../../hooks/use-auth"
import { add, close, checkmarkCircle } from "ionicons/icons"
import SideMenu from "@/components/side-menu"
import apiService from "@/services/api-service"

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
  const [isFetching, setIsFetching] = useState(false)

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

    // Debug current user
    console.log("Current user:", user);

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
    } else if (user && user.id) {
      console.log("Attempting to fetch profile for user ID:", user.id);
      // Fetch user profile data from API
      fetchUserProfile(user.id);
    } else {
      console.warn("Cannot fetch profile: No user ID available");
    }
  }, [isAuthenticated, history, user, registrationMode, registrationEmail])

  // Fetch user profile data from API
  const fetchUserProfile = async (userId: string) => {
    try {
      setIsFetching(true);
      console.log(`Fetching user profile for ID: ${userId}`);
      
      // Make the API call
      const response = await apiService.getUserProfile(userId);
      
      console.log("API Response:", response);
      
      if (response.status === 'success' && response.employee) {
        const profileData = response.employee;
        console.log('Fetched profile data:', profileData);
        
        // Update personalData if personalInfo is available
        if (profileData.personalInfo) {
          console.log('Setting personal info:', profileData.personalInfo);
          setPersonalData({
            surname: profileData.personalInfo?.surname || "",
            firstName: profileData.personalInfo?.firstName || "",
            middleName: profileData.personalInfo?.middleName || "",
            suffix: profileData.personalInfo?.suffix || "",
            nickname: profileData.personalInfo?.nickname || "",
            presentAddress: profileData.personalInfo?.presentAddress || "",
            provincialAddress: profileData.personalInfo?.provincialAddress || "",
            telephoneNo: profileData.personalInfo?.telephoneNo || "",
            mobileNo: profileData.personalInfo?.mobileNo || profileData.phone || "",
            emailAddress: profileData.personalInfo?.emailAddress || profileData.email || "",
            dateOfBirth: profileData.personalInfo?.dateOfBirth || "",
            placeOfBirth: profileData.personalInfo?.placeOfBirth || "",
            age: profileData.personalInfo?.age?.toString() || "",
            gender: profileData.personalInfo?.gender || "",
            citizenship: profileData.personalInfo?.citizenship || "",
            civilStatus: profileData.personalInfo?.civilStatus || "",
            height: profileData.personalInfo?.height?.toString() || "",
            weight: profileData.personalInfo?.weight?.toString() || "",
            ssNo: profileData.personalInfo?.ssNo || "",
            tinNo: profileData.personalInfo?.tinNo || "",
            philHealthNo: profileData.personalInfo?.philHealthNo || "",
            pagIbigNo: profileData.personalInfo?.pagIbigNo || "",
            department: profileData.department || "",
            position: profileData.position || "",
          });
        } else {
          console.warn("No personal info found in the API response");
          // Use basic employee info if personal info is not available
          setPersonalData(prev => ({
            ...prev,
            emailAddress: profileData.email || "",
            mobileNo: profileData.phone || "",
            department: profileData.department || "",
            position: profileData.position || "",
          }));
        }
        
        // Also fetch and set family data if available
        if (profileData.familyInfo) {
          console.log('Setting family info:', profileData.familyInfo);
          setFamilyData({
            spouseName: profileData.familyInfo.spouseName || "",
            spouseOccupation: profileData.familyInfo.spouseOccupation || "",
            spouseCompany: profileData.familyInfo.spouseCompany || "",
            fatherName: profileData.familyInfo.fatherName || "",
            fatherOccupation: profileData.familyInfo.fatherOccupation || "",
            fatherCompany: profileData.familyInfo.fatherCompany || "",
            motherName: profileData.familyInfo.motherName || "",
            motherOccupation: profileData.familyInfo.motherOccupation || "",
            motherCompany: profileData.familyInfo.motherCompany || "",
            siblings: Array.isArray(profileData.familyInfo.siblings) && profileData.familyInfo.siblings.length > 0 
              ? profileData.familyInfo.siblings 
              : [{ name: "", occupation: "", company: "" }],
            dependents: Array.isArray(profileData.familyInfo.dependents) && profileData.familyInfo.dependents.length > 0 
              ? profileData.familyInfo.dependents 
              : [{ name: "", occupation: "", company: "" }],
          });
        }

        // Fetch and set education data if available
        if (profileData.educationInfo) {
          console.log('Setting education info:', profileData.educationInfo);
          setEducationData({
            bachelor: profileData.educationInfo.bachelor || { level: "BACHELOR'S DEGREE", school: "", course: "", period: "" },
            postGrad: profileData.educationInfo.postGrad || { level: "POST-GRADUATE", school: "", course: "", period: "" },
            masteral: profileData.educationInfo.masteral || { level: "MASTERAL", school: "", course: "", period: "" },
            doctoral: profileData.educationInfo.doctoral || { level: "DOCTORATE", school: "", course: "", period: "" },
            vocational: profileData.educationInfo.vocational || { level: "VOCATIONAL/OTHERS", school: "", course: "", period: "" },
            honors: Array.isArray(profileData.educationInfo.honors) && profileData.educationInfo.honors.length > 0
              ? profileData.educationInfo.honors 
              : [{ nature: "", awardingBody: "", date: "" }],
            licensure: Array.isArray(profileData.educationInfo.licensure) && profileData.educationInfo.licensure.length > 0
              ? profileData.educationInfo.licensure 
              : [{ exam: "", rating: "", dateTaken: "", licenseNo: "", issued: "", expiration: "" }],
          });
        }
        
        presentToast('Profile information loaded successfully', 'success');
      } else {
        console.warn('No profile data found or invalid response format', response);
        presentToast('Could not load complete profile information', 'danger');
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
      presentToast('Failed to load your profile information', 'danger');
    } finally {
      setIsFetching(false);
    }
  };

  const handlePersonalChange = (e: any) => {
    const { name, value } = e.target
    setPersonalData((prev) => ({ ...prev, [name]: value }))
  }

  // ...existing handlers remain unchanged...

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

  // Update the handleSubmit function to use the API service
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
        department: personalData.department || "",
        position: personalData.position || "",
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
      console.error("Error updating profile:", error)
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
          <IonLoading isOpen={isFetching} message="Loading your profile..." />
          
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
            {/* ...existing component JSX... */}
            <IonCardHeader>
              <IonCardTitle>
                {isNewRegistration ? "Employee Registration Form" : "Employment Application Form"}
              </IonCardTitle>
              <IonCardSubtitle>Please fill out all the required information</IonCardSubtitle>
            </IonCardHeader>
            <IonCardContent>
              {/* ...existing component JSX... */}
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
                    {/* ...personal form fields... */}
                    {/* All existing form fields remain the same */}
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
                      <IonCol size="12" sizeMd="6">
                        <IonItem>
                          <IonLabel position="floating">Suffix (Jr, Sr, III, etc.)</IonLabel>
                          <IonInput
                            name="suffix"
                            value={personalData.suffix}
                            onIonChange={(e) => handleCustomInputChange("suffix", e.detail.value)}
                          />
                        </IonItem>
                      </IonCol>
                    </IonRow>

                    <IonRow>
                      <IonCol size="12" sizeMd="6">
                        <IonItem>
                          <IonLabel position="floating">Nickname</IonLabel>
                          <IonInput
                            name="nickname"
                            value={personalData.nickname}
                            onIonChange={(e) => handleCustomInputChange("nickname", e.detail.value)}
                          />
                        </IonItem>
                      </IonCol>
                      <IonCol size="12" sizeMd="6">
                        <IonItem>
                          <IonLabel position="floating">
                            Gender <span className="text-red-500">*</span>
                          </IonLabel>
                          <IonSelect
                            value={personalData.gender}
                            onIonChange={(e) => handleCustomInputChange("gender", e.detail.value)}
                          >
                            <IonSelectOption value="Male">Male</IonSelectOption>
                            <IonSelectOption value="Female">Female</IonSelectOption>
                            <IonSelectOption value="Other">Other</IonSelectOption>
                          </IonSelect>
                        </IonItem>
                      </IonCol>
                    </IonRow>

                    {/* ...remaining personal fields... */}
                  </IonGrid>
                </div>
              )}

              {/* Family Tab Content */}
              {activeTab === "family" && (
                <div className="ion-padding-top">
                  <h4 className="text-lg font-medium mb-4">Spouse Information</h4>
                  <IonGrid>
                    <IonRow>
                      <IonCol size="12" sizeMd="4">
                        <IonItem>
                          <IonLabel position="floating">Spouse Name</IonLabel>
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
                  </IonGrid>

                  {/* ...remaining family fields... */}
                </div>
              )}

              {/* Education Tab Content */}
              {activeTab === "education" && (
                <div className="ion-padding-top">
                  <h4 className="text-lg font-medium mb-4">Educational Background</h4>
                  
                  {/* Bachelor's Degree */}
                  <div className="mb-6">
                    <h5 className="text-md font-medium mb-2">Bachelor's Degree</h5>
                    <IonGrid>
                      <IonRow>
                        <IonCol size="12" sizeMd="4">
                          <IonItem>
                            <IonLabel position="floating">School</IonLabel>
                            <IonInput
                              value={educationData.bachelor.school}
                              onIonChange={(e) => handleEducationChange("bachelor", "school", e.detail.value || "")}
                            />
                          </IonItem>
                        </IonCol>
                        <IonCol size="12" sizeMd="4">
                          <IonItem>
                            <IonLabel position="floating">Course</IonLabel>
                            <IonInput
                              value={educationData.bachelor.course}
                              onIonChange={(e) => handleEducationChange("bachelor", "course", e.detail.value || "")}
                            />
                          </IonItem>
                        </IonCol>
                        <IonCol size="12" sizeMd="4">
                          <IonItem>
                            <IonLabel position="floating">Period</IonLabel>
                            <IonInput
                              value={educationData.bachelor.period}
                              onIonChange={(e) => handleEducationChange("bachelor", "period", e.detail.value || "")}
                              placeholder="e.g., 2015-2019"
                            />
                          </IonItem>
                        </IonCol>
                      </IonRow>
                    </IonGrid>
                  </div>

                  {/* ...remaining education fields... */}
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



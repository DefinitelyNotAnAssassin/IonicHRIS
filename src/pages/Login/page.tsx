"use client";

import React, { useState, useEffect } from "react";
import { 
  IonContent, 
  IonPage, 
  IonCard, 
  IonCardContent, 
  IonButton, 
  IonItem, 
  IonInput, 
  IonLabel, 
  IonLoading,
  useIonToast,
  IonGrid,
  IonRow,
  IonCol,
  IonImg
} from "@ionic/react";
import { useHistory, Redirect } from "react-router-dom";
import { useAuth } from "@/hooks/use-auth";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { login, isAuthenticated } = useAuth();
  const history = useHistory();
  const [present] = useIonToast();

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      history.push("/dashboard");
    }
  }, [isAuthenticated, history]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const success = await login(email, password);

      if (success) {
        // Show success message
        present({
          message: "Login successful",
          duration: 1500,
          position: "bottom",
          color: "success"
        });

        // Redirect to dashboard
        history.push("/dashboard");
      } else {
        present({
          message: "Login failed. Check your credentials and try again.",
          duration: 3000,
          position: "bottom",
          color: "danger"
        });
      }
    } catch (error) {
      present({
        message: "An error occurred during login",
        duration: 3000,
        position: "bottom",
        color: "danger"
      });
      console.error('Login error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <IonPage>
      <IonContent className="ion-padding bg-gray-100">
        <div className="min-h-screen flex items-center justify-center">
          <IonCard className="max-w-md w-full shadow-xl rounded-lg overflow-hidden">
            <div className="bg-white p-6 flex flex-col items-center">
              <img 
                src="/sdcalogo.png" 
                alt="SDCA Logo" 
                className="h-24 mb-4"
                onError={(e) => {
                  // Fallback if image fails to load
                  const target = e.target as HTMLImageElement;
                  target.onerror = null;
                  target.src = 'https://www.sdca.edu.ph/assets/images/sdca-logo.png';
                }} 
              />
              <h2 className="text-2xl font-bold text-red-600 text-center mt-2">
                St. Dominic College of Asia
              </h2>
              <p className="text-gray-500 text-center mb-4">Human Resource Information System</p>
            </div>
            
            <div className="bg-red-600 p-4 text-white text-center">
              <h3 className="text-xl font-medium">Employee Login</h3>
            </div>
            
            <IonCardContent className="p-6">
              <form onSubmit={handleLogin} className="space-y-6">
                <div>
                  <IonItem className="rounded-md">
                    <IonLabel position="floating">Email</IonLabel>
                    <IonInput 
                      type="email" 
                      value={email} 
                      onIonChange={(e) => setEmail(e.detail.value!)} 
                      required
                      className="py-2"
                    />
                  </IonItem>
                </div>
                
                <div>
                  <IonItem className="rounded-md">
                    <IonLabel position="floating">Password</IonLabel>
                    <IonInput 
                      type="password" 
                      value={password} 
                      onIonChange={(e) => setPassword(e.detail.value!)} 
                      required
                      className="py-2"
                    />
                  </IonItem>
                </div>
                
                <IonButton 
                  expand="block" 
                  type="submit" 
                  color="danger"
                  className="font-semibold py-3"
                >
                  Login
                </IonButton>
                
                <div className="text-center mt-4">
                  <a href="/forgot-password" className="text-red-600 text-sm hover:underline">
                    Forgot Password?
                  </a>
                </div>
              </form>
            </IonCardContent>
            
            <div className="bg-gray-50 p-4 text-center text-xs text-gray-500 border-t">
              &copy; {new Date().getFullYear()} St. Dominic College of Asia. All rights reserved.
            </div>
          </IonCard>
        </div>
        
        <IonLoading isOpen={loading} message="Logging in..." />
      </IonContent>
    </IonPage>
  );
}

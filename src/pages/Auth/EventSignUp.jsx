import React, { useState, useEffect } from "react";
import ErrorBoundary from "./ComponentSignup/ErrorBoundary";
import EmailStep from "./ComponentSignup/EmailStep";
import VerificationStep from "./ComponentSignup/VerificationStep";
import NameStep from "./ComponentSignup/NameStep";
import RoleStep from "./ComponentSignup/RoleStep";
import AttendeeForm from "./ComponentSignup/AttendeeForm";
import OrganizerForm from "./ComponentSignup/OrganizerForm";
import { useNavigate } from 'react-router-dom';

const EventSignUp = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [nextStepToShow, setNextStepToShow] = useState(null);
  const [isExiting, setIsExiting] = useState(false);
  const [transitionKey, setTransitionKey] = useState(0);
  const [direction, setDirection] = useState("forward");
  const [email, setEmail] = useState("");
  const [userData, setUserData] = useState({});
  const [role, setRole] = useState("");
  const [verificationCode, setVerificationCode] = useState('');
  const navigate = useNavigate();

  // Chuyển hướng đến /login khi currentStep đạt 6
  useEffect(() => {
    if (currentStep === 6) {
      navigate('/login');
    }
  }, [currentStep, navigate]);

  useEffect(() => {
    if (isExiting && nextStepToShow !== null) {
      const timer = setTimeout(() => {
        setIsExiting(false);
        setCurrentStep(nextStepToShow);
        setTransitionKey((prev) => prev + 1);
        setNextStepToShow(null);
      }, 400);
      return () => clearTimeout(timer);
    }
  }, [isExiting, nextStepToShow]);

  const nextStep = (code) => {
    setDirection("forward");
    setIsExiting(true);
    setNextStepToShow(currentStep + 1);
    if (code) setVerificationCode(code);
  };

  const prevStep = () => {
    setDirection("backward");
    setIsExiting(true);
    setNextStepToShow(currentStep - 1);
  };

  const renderStep = () => {
    const animationClass = isExiting
      ? direction === "forward"
        ? "animate-slide-out-left"
        : "animate-slide-out-right"
      : direction === "forward"
      ? "animate-slide-in-right"
      : "animate-slide-in-left";
    return (
      <div
        key={transitionKey}
        className={`will-change-transform-opacity ${animationClass}`}
        aria-live="polite"
      >
        {(() => {
          const stepToRender = nextStepToShow || currentStep;
          switch (stepToRender) {
            case 1:
              return <EmailStep onNext={nextStep} setEmail={setEmail} />;
            case 2:
              return (
                <VerificationStep
                  email={email}
                  verificationCode={verificationCode}
                  onNext={nextStep}
                  onPrev={prevStep}
                />
              );
            case 3:
              return (
                <NameStep
                  onNext={nextStep}
                  onPrev={prevStep}
                  setUserData={setUserData}
                  email={email}
                />
              );
            case 4:
              return (
                <RoleStep
                  onNext={nextStep}
                  onPrev={prevStep}
                  setRole={setRole}
                />
              );
            case 5:
              return role === "attendee" ? (
                <AttendeeForm
                  email={email}
                  userData={userData}
                  onComplete={nextStep}
                  onPrev={prevStep}
                />
              ) : (
                <OrganizerForm
                  email={email}
                  userData={userData}
                  onComplete={nextStep}
                  onPrev={prevStep}
                />
              );
            default:
              return null; 
          }
        })()}
      </div>
    );
  };

  return <ErrorBoundary>{renderStep()}</ErrorBoundary>;
};

export default EventSignUp;
import React, { useEffect, useState, useRef } from 'react';
import { Container, Center } from '@mantine/core';
import { SignIn } from './SignIn';
import { ForgotPassword } from './ForgotPassword';
import { ConfirmPasswordReset } from './ConfirmPasswordReset';

type AuthView = 'signin' | 'forgot-password' | 'confirm-reset';

interface AuthContainerProps {
  onAuthSuccess?: (user: any, accessToken: string) => void;
  initialView?: AuthView;
  authState?: any;
}

const persistentState = {
  currentView: 'signin' as AuthView,
  forgotPasswordSuccess: false,
  confirmResetSuccess: false,
  resetUsername: '',
  isInPasswordFlow: false
};

export const AuthContainer: React.FC<AuthContainerProps> = ({
  onAuthSuccess,
  initialView = 'signin',
  authState
}) => {
  const isFirstMount = useRef(true);
  
 const [currentView, setCurrentView] = useState<AuthView>(() => {
    if (isFirstMount.current && initialView !== 'signin') {
      persistentState.currentView = initialView;
    }
    return persistentState.currentView;
  });
  
  const [forgotPasswordSuccess, setForgotPasswordSuccess] = useState(() => persistentState.forgotPasswordSuccess);
  const [confirmResetSuccess, setConfirmResetSuccess] = useState(() => persistentState.confirmResetSuccess);
  const [resetUsername, setResetUsername] = useState(() => persistentState.resetUsername);
  
  const { 
    signIn, 
    forgotPassword, 
    confirmForgotPassword,
    loading, 
    error, 
    clearError,
    isAuthenticated,
    user
  } = authState;

  useEffect(() => {
    persistentState.currentView = currentView;
    persistentState.forgotPasswordSuccess = forgotPasswordSuccess;
    persistentState.confirmResetSuccess = confirmResetSuccess;
    persistentState.resetUsername = resetUsername;
  }, [currentView, forgotPasswordSuccess, confirmResetSuccess, resetUsername]);

  useEffect(() => {
    if (isAuthenticated && user && onAuthSuccess) {
      persistentState.currentView = 'signin';
      persistentState.forgotPasswordSuccess = false;
      persistentState.confirmResetSuccess = false;
      persistentState.resetUsername = '';
      persistentState.isInPasswordFlow = false;
      onAuthSuccess(user, '');
    }
  }, [isAuthenticated, user, onAuthSuccess, loading]);

 useEffect(() => {
    if (forgotPasswordSuccess && currentView === 'forgot-password') {
      const timer = setTimeout(() => {
        setCurrentView('confirm-reset');
        setForgotPasswordSuccess(false);
        persistentState.isInPasswordFlow = true;
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [forgotPasswordSuccess, currentView]);

   useEffect(() => {
    if (isFirstMount.current) {
      isFirstMount.current = false;
      
    } else {
      
      if (persistentState.isInPasswordFlow) {
        setCurrentView(persistentState.currentView);
        setForgotPasswordSuccess(persistentState.forgotPasswordSuccess);
        setConfirmResetSuccess(persistentState.confirmResetSuccess);
        setResetUsername(persistentState.resetUsername);
      }
    }
  }, []);

  const handleSignIn = async (credentials: { username: string; password: string }) => {
    try {
      await signIn(credentials);
     
    } catch (error) {
      console.error('❌ AuthContainer - SignIn failed:', error);
    }
  };

  const handleForgotPassword = async (username: string) => {
  try {
    persistentState.isInPasswordFlow = true;
    await forgotPassword(username);
    setResetUsername(username);
    setForgotPasswordSuccess(true);  
    persistentState.resetUsername = username; 
    persistentState.forgotPasswordSuccess = true;
    
  } catch (error) {
    
    persistentState.isInPasswordFlow = false;
  }
};

  const handleConfirmReset = async (data: { username: string; code: string; newPassword: string }) => {
    try {
      await confirmForgotPassword({
        username: data.username,
        confirmationCode: data.code,
        password: data.newPassword,
      });
      
      setConfirmResetSuccess(true);
      persistentState.confirmResetSuccess = true;
      
    } catch (error) {
      console.error('ConfirmReset failed:', error);
    }
  };

  const handleResetSuccess = () => {
    setConfirmResetSuccess(false);
    persistentState.confirmResetSuccess = false;
    persistentState.isInPasswordFlow = false;
    persistentState.currentView = 'signin';
    setCurrentView('signin');
    clearError();
  };

  const handleViewChange = (view: AuthView) => {
    setCurrentView(view);
    setForgotPasswordSuccess(false);
    setConfirmResetSuccess(false);
    if (view === 'signin') {
      persistentState.isInPasswordFlow = false;
    }
    clearError();
  }; 

  const handleContinueToConfirm = () => {
    setCurrentView('confirm-reset');
    setForgotPasswordSuccess(false);
    clearError();
  };
 
  if (isAuthenticated) {
     return null;
  }

  const renderCurrentView = () => {
    switch (currentView) {
      case 'confirm-reset':
        return (
          <ConfirmPasswordReset
            username={resetUsername}
            onSubmit={handleConfirmReset}
            onBackToForgotPassword={() => handleViewChange('forgot-password')}
            onSuccess={handleResetSuccess} // ✅ FIX: Pasar la función onSuccess
            loading={loading}
            error={error}
            success={confirmResetSuccess}
          />
        );
      case 'forgot-password':
        return (
          <ForgotPassword
            onSubmit={handleForgotPassword}
            onBackToSignIn={() => handleViewChange('signin')}
            onContinue={forgotPasswordSuccess ? handleContinueToConfirm : undefined}
            loading={loading}
            error={error}
            success={forgotPasswordSuccess}
          />
        );
      case 'signin':
      default:
        return (
          <SignIn
            onSignIn={handleSignIn}
            onForgotPassword={() => handleViewChange('forgot-password')}
            loading={loading}
            error={error}
          />
        );
    }
  };

  return (
    <Container size="sm" py="xl">
      <Center style={{ minHeight: 'calc(100vh - 80px)' }}>
        {renderCurrentView()}
      </Center>
    </Container>
  ); 
};

export default AuthContainer;
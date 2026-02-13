import { useState } from 'react';
import { Box } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { SignUpForm } from './SignUpForm';
import { ConfirmSignUpForm } from './ConfirmSignUpForm';

interface SignUpFlowProps {
  onNavigate?: (tabKey: string) => void;
}

export const SignUpFlow: React.FC<SignUpFlowProps> = ({ onNavigate }) => {
  
  const [currentStep, setCurrentStep] = useState<'signup' | 'confirm'>('signup');
  const [username, setUsername] = useState('');

  const handleSignUpSuccess = (user: string) => {
    setUsername(user);
    setCurrentStep('confirm');
  };

  const handleConfirmSuccess = () => {
    notifications.show({
      title: '¡Bienvenido!',
      message: 'Tu cuenta ha sido creada exitosamente',
      color: 'green',
    });
    
    setTimeout(() => {
      setCurrentStep('signup');
      setUsername('');
    }, 2000);
  };

  const handleBackToSignUp = () => {
    setCurrentStep('signup');
    setUsername('');
  };

  const handleNavigateToUsers = () => {
    if (onNavigate) {
      onNavigate('users');
    }
  };

  return (
    <Box>
      {currentStep === 'signup' && (
        <SignUpForm 
          onSuccess={handleSignUpSuccess} 
          onNavigateToUsers={handleNavigateToUsers}
        />
      )}

      {currentStep === 'confirm' && (
        <ConfirmSignUpForm
          username={username}
          onSuccess={handleConfirmSuccess}
          onBack={handleBackToSignUp}
        />
      )}
    </Box>
  );
};
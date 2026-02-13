import { useState } from 'react';
import { Box, Button, Group } from '@mantine/core';
import { ArrowLeft } from 'lucide-react';
import { SignUpFlow } from './SignUpFlow';
import { UsersPage } from '../GET/UsersPage';

interface UserManagementProps {
  onNavigate?: (tabKey: string) => void;
}

export const UserManagement: React.FC<UserManagementProps> = ({ onNavigate }) => {
  const [currentView, setCurrentView] = useState<'signup' | 'users'>('signup');

  if (currentView === 'users') {
    return (
      <Box>
        <Group mb="md">
          <Button 
            variant="light" 
            leftSection={<ArrowLeft size={16} />}
            onClick={() => setCurrentView('signup')}
          >
            Volver al Registro
          </Button>
        </Group>
        <UsersPage />
      </Box>
    );
  }

  return (
    <SignUpFlow 
      onNavigate={() => setCurrentView('users')} 
    />
  );
};
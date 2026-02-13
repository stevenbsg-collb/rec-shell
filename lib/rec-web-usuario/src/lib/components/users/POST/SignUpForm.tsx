import React from 'react';
import {
  Paper,
  Title,
  TextInput,
  PasswordInput,
  Group,
  Stack,
  Box,
  LoadingOverlay,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { IconCheck, IconMail, IconUser, IconPhone } from '@tabler/icons-react';
import { ActionButtons, NOTIFICATION_MESSAGES, SignUpFormValues, signUpValidations, useNotifications } from '@rec-shell/rec-web-shared';
import { useSignUp } from '../../../hooks/useSignUp';
import { SignUpFormProps } from '../../../types/auth.types';
import { FormErrorAlert } from '../../common/FormErrorAlert';


interface ExtendedSignUpFormProps extends SignUpFormProps {
  onNavigateToUsers?: () => void;
}

export const SignUpForm: React.FC<ExtendedSignUpFormProps> = ({ 
  onSuccess, onNavigateToUsers 
 }) => {
  const { signUp, loading, error, setError } = useSignUp();
  const notifications = useNotifications();

  const form = useForm({
    initialValues: {
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
      firstName: '',
      lastName: '',
      phoneNumber: '',
    },
    validate: signUpValidations,
  });

  const handleSubmit = async (values: SignUpFormValues) => {
    try {
      const { confirmPassword, ...submitData } = values;
      await signUp(submitData);
      
      notifications.success(
        NOTIFICATION_MESSAGES.AUTH.CONFIRMATION_USER_EMAIL.title,
        NOTIFICATION_MESSAGES.AUTH.CONFIRMATION_USER_EMAIL.message,
        <IconCheck />
      );

      onSuccess?.(values.username);
    } catch (err) {
      console.error('Error en registro:', err);
    }
  };

    const handleNavigateClick = () => {
    if (onNavigateToUsers) {
      onNavigateToUsers();
    } 
  };

  return (
    <div className="w-full mx-auto">
      <Paper withBorder p={40} mt={30} radius="md" pos="relative">
        <LoadingOverlay visible={loading} overlayProps={{ blur: 2 }} />

        <Group justify="space-between" align="center" mb="md">
          <Title>Crear Cuenta</Title>
          
          <ActionButtons.Save 
            onClick={() => form.onSubmit(handleSubmit)()} 
            loading={loading} 
          />
        </Group>

        <FormErrorAlert error={error} onClose={() => setError('')} />

        <Box component="form" onSubmit={form.onSubmit(handleSubmit)}>
          <Stack gap="sm">
            <Group grow>
              <TextInput
                label="Nombre"
                placeholder="Tu nombre"
                required
                {...form.getInputProps('firstName')}
              />
              <TextInput
                label="Apellido"
                placeholder="Tu apellido"
                required
                {...form.getInputProps('lastName')}
              />
            </Group>

            <Group grow>
              <TextInput
                label="Email"
                placeholder="@hotmail.com"
                required
                leftSection={<IconMail size="1rem" />}
                {...form.getInputProps('email')}
              />
              <TextInput
                label="Teléfono"
                placeholder="+1234567890"
                required
                leftSection={<IconPhone size="1rem" />}
                {...form.getInputProps('phoneNumber')}
              />
            </Group>

            <Group grow>
              <TextInput
                label="Nombre de usuario"
                placeholder="Tu usuario"
                required
                leftSection={<IconUser size="1rem" />}
                {...form.getInputProps('username')}
              />
            </Group>

            <Group grow>
              <PasswordInput
                label="Contraseña"
                placeholder="Tu contraseña"
                required
                {...form.getInputProps('password')}
              />
              <PasswordInput
                label="Confirmar contraseña"
                placeholder="Confirma tu contraseña"
                required
                {...form.getInputProps('confirmPassword')}
              />
            </Group>
          </Stack>
        </Box>
      </Paper>
    </div>
  );
};

/*
{onNavigateToUsers && (
          <Group justify="center" mt="lg">
            <Button 
              variant="light" 
              onClick={handleNavigateClick}
              leftSection={<Search size={16} />}
            >
              Consultar Usuarios Registrados
            </Button>
          </Group>
        )}
*/
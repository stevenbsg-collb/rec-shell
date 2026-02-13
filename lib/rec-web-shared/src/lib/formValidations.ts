import { SignUpFormValues } from './types/auth.types';

export const signUpValidations = {
  username: (value: string) =>
    value.length < 3
      ? 'El nombre de usuario debe tener al menos 3 caracteres'
      : null,
  
  email: (value: string) =>
    !/^\S+@\S+\.\S+$/.test(value) ? 'Email inválido' : null,
  
  password: (value: string) =>
    value.length < 8
      ? 'La contraseña debe tener al menos 8 caracteres'
      : null,
  
  confirmPassword: (value: string, values: SignUpFormValues) =>
    value !== values.password ? 'Las contraseñas no coinciden' : null,
  
  firstName: (value: string) =>
    value.length < 2 ? 'El nombre debe tener al menos 2 caracteres' : null,
  
  lastName: (value: string) =>
    value.length < 2
      ? 'El apellido debe tener al menos 2 caracteres'
      : null,
  
  phoneNumber: (value: string) =>
    !/^\+?[0-9]\d{1,14}$/.test(value)
      ? 'Número de teléfono inválido'
      : null,
};
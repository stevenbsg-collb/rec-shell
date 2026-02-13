export interface FormErrorAlertProps {
  error: string | null | undefined;
  onClose: () => void;
}

export interface SignUpFormProps {
  onSuccess?: (username: string) => void;
}

export interface ConfirmSignUpFormProps {
  username: string;
  onSuccess: () => void;
  onBack: () => void;
}
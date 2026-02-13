export const NOTIFICATION_MESSAGES = {
  AUTH: {
    CONFIRMATION_SUCCESS: {
      title: 'Confirmación exitosa',
      message: 'Tu cuenta ha sido verificada correctamente',
    },
    CONFIRMATION_USER_EMAIL: {
      title: 'Registro exitoso',
      message: 'Se ha enviado un código de confirmación a tu email',
    },
    CODE_RESENT: {
      title: 'Código reenviado',
      message: 'Se ha enviado un nuevo código a tu email',
    },
    RESEND_ERROR: {
      title: 'Error',
      message: 'No se pudo reenviar el código',
    },
    INVALID_CODE: {
      title: 'Código inválido',
      message: 'El código debe tener 6 dígitos',
    },
    ROL_CODE: {
      message: 'Rol asignado correctamente',
    },
    REMOVE_CODE: {
      message: 'Rol removido correctamente',
    },
    UPDATE_SUCCESS: {
      title: 'Registro Actualizado',
      message: 'Los datos del usuario se han actualizado correctamente',
    }
  },
  GENERAL: {
    SUCCESS: {
      title: 'Éxito',
      message: 'Operación completada correctamente',
    },
    ERROR: {
      title: 'Error',
      message: 'Ha ocurrido un error inesperado',
    },
    LOADING: {
      title: 'Cargando',
      message: 'Procesando solicitud...',
    },
    DELETE: {
      message: 'Registro eliminado correctamente',
    },
    STATE: {
      message: 'Estado actualizado correctamente',
    }
  },
} as const;
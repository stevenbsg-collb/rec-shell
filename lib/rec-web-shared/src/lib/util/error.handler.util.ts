
export class ErrorHandler {

  static handle(error: any, operation: string, defaultMessage = 'Error en la petición'): never {
    console.log(`Error ${operation}:`, error);
    
    let errorMessage: string;
    
    // Verificar si es un error de API con estructura ApiResponse
    if (error && typeof error === 'object' && 'message' in error) {
      errorMessage = error.message;
    }
    // Verificar si es una instancia de Error nativo
    else if (error instanceof Error) {
      errorMessage = error.message;
    }
    // Si no se puede determinar el mensaje, usar el por defecto
    else {
      errorMessage = defaultMessage;
    }
    
    throw new Error(errorMessage);
  }
}

// Función utilitaria alternativa (más simple)
export const handleError = (error: any, operation: string, defaultMessage = 'Error en la petición'): never => {
  console.log(`Error ${operation}:`, error);
  
  let errorMessage: string;
  
  // Verificar si es un error de API con estructura ApiResponse
  if (error && typeof error === 'object' && 'message' in error) {
    errorMessage = error.message;
  }
  // Verificar si es una instancia de Error nativo
  else if (error instanceof Error) {
    errorMessage = error.message;
  }
  // Si no se puede determinar el mensaje, usar el por defecto
  else {
    errorMessage = defaultMessage;
  }
  
  throw new Error(errorMessage);
};
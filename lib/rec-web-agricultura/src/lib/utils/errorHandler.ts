import { NOTIFICATION_MESSAGES, useNotifications } from '@rec-shell/rec-web-shared';
import { useCallback } from 'react';

type SetState<T> = React.Dispatch<React.SetStateAction<T>>;

export function useHandleError<T extends { error?: string | null; loading?: boolean }>() {
  const notifications = useNotifications();
 
  return useCallback(
    (
      error: unknown,
      setState: SetState<T>,
      defaultMessage = "Error al cargar los registros"
    ) => {
      const errorMessage =
        error instanceof Error ? error.message : defaultMessage;
      console.log(error);
      setState((prev) => ({
        ...prev,
        error: errorMessage,
        loading: false,
      }));

      notifications.error(
        NOTIFICATION_MESSAGES.GENERAL.ERROR.title,
        errorMessage
      );
    },
    [notifications]
  );
}

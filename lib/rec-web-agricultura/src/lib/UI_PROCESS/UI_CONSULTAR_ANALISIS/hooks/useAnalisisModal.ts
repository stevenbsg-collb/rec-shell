import { useState } from 'react';
import { AnalisisImagenYOLO_DTO } from '../../../types/yolo';

export function useAnalisisModal() {
  const [selectedAnalisis, setSelectedAnalisis] =
    useState<AnalisisImagenYOLO_DTO | null>(null);
  const [modalOpened, setModalOpened] = useState<boolean>(false);

  const openModal = (analisis: AnalisisImagenYOLO_DTO): void => {
    setSelectedAnalisis(analisis);
    setModalOpened(true);
  };

  const closeModal = (): void => {
    setModalOpened(false);
  };

  return {
    selectedAnalisis,
    modalOpened,
    openModal,
    closeModal,
  };
}
import { useState, useMemo } from 'react';

interface UsePaginationProps<T extends Record<string, any>> {
  data: T[];
  itemsPerPage?: number;
  searchFields?: (keyof T)[];
}

interface UsePaginationReturn<T> {
  currentPage: number;
  totalPages: number;
  paginatedData: T[];
  setPage: (page: number) => void;
  nextPage: () => void;
  previousPage: () => void;
  setItemsPerPage: (items: number) => void;
  itemsPerPage: number;
  startIndex: number;
  endIndex: number;
  totalItems: number;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  filteredData: T[];
}

export function usePagination<T extends Record<string, any>>({ 
  data, 
  itemsPerPage: initialItemsPerPage = 10,
  searchFields = []
}: UsePaginationProps<T>): UsePaginationReturn<T> {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(initialItemsPerPage);
  const [searchTerm, setSearchTerm] = useState('');

  // Filtrar datos según el término de búsqueda
  // En usePagination, modifica la parte de filtrado:
const filteredData = useMemo(() => {
  if (!searchTerm.trim()) return data;

  const searchLower = searchTerm.toLowerCase().trim();

  return data.filter(item => {
    if (searchFields.length > 0) {
      return searchFields.some(field => {
        // Soportar rutas anidadas con notación de punto
        const value = field.toString().split('.').reduce((obj, key) => obj?.[key], item);
        if (value === null || value === undefined) return false;
        return String(value).toLowerCase().includes(searchLower);
      });
    }

    return Object.values(item).some(value => {
      if (value === null || value === undefined) return false;
      return String(value).toLowerCase().includes(searchLower);
    });
  });
}, [data, searchTerm, searchFields]);

  const totalPages = useMemo(() => 
    Math.ceil(filteredData.length / itemsPerPage) || 1,
    [filteredData.length, itemsPerPage]
  );

  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredData.slice(startIndex, endIndex);
  }, [filteredData, currentPage, itemsPerPage]);

  const setPage = (page: number) => {
    const pageNumber = Math.max(1, Math.min(page, totalPages));
    setCurrentPage(pageNumber);
  };

  const nextPage = () => {
    setPage(currentPage + 1);
  };

  const previousPage = () => {
    setPage(currentPage - 1);
  };

  const handleSetItemsPerPage = (items: number) => {
    setItemsPerPage(items);
    setCurrentPage(1); // Reset a la primera página
  };

  const handleSetSearchTerm = (term: string) => {
    setSearchTerm(term);
    setCurrentPage(1); // Reset a la primera página cuando se busca
  };

  const startIndex = (currentPage - 1) * itemsPerPage + 1;
  const endIndex = Math.min(currentPage * itemsPerPage, filteredData.length);

  return {
    currentPage,
    totalPages,
    paginatedData,
    setPage,
    nextPage,
    previousPage,
    setItemsPerPage: handleSetItemsPerPage,
    itemsPerPage,
    startIndex,
    endIndex,
    totalItems: filteredData.length,
    searchTerm,
    setSearchTerm: handleSetSearchTerm,
    filteredData
  };
}
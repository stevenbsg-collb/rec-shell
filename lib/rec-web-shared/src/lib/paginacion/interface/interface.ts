
interface Column<T> {
  key: string;
  label: string;
  render?: (item: T) => React.ReactNode;
  width?: string;
}

interface Action<T> {
  icon: React.ReactNode;
  label: string;
  color?: string;
  onClick: (item: T) => void;
}

export interface PaginatedTableProps<T> {
  data: T[];
  columns: Column<T>[];
  actions?: Action<T>[];
  loading?: boolean;
  searchFields?: string[];
  itemsPerPage?: number;
  emptyMessage?: string;
  searchPlaceholder?: string;
  getRowKey: (item: T) => string | number;
}
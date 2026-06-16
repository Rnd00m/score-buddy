export const useExpandableRow = (dataKey: string = 'uuid') => {
  const expandedRows = ref<Record<string, boolean>>({});

  const onRowClick = (event: { originalEvent: Event; data: Record<string, any> }) => {
    if ((event.originalEvent.target as HTMLElement).closest('button')) return;

    const key = event.data[dataKey];
    const updated = { ...expandedRows.value };

    if (updated[key]) {
      delete updated[key];
    } else {
      updated[key] = true;
    }

    expandedRows.value = updated;
  };

  return { expandedRows, onRowClick };
};
export const formatDateToInput = (dateInput?: Date | string | null): string => {
    if (!dateInput) return new Date().toISOString().split('T')[0];

    const date = new Date(dateInput);
    if (isNaN(date.getTime())) return new Date().toISOString().split('T')[0];
    
    return date.toISOString().split('T')[0];
};
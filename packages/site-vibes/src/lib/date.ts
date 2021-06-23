export const addDaysFromNow = (days: number): Date => new Date(new Date().setDate(new Date().getDate() + days));

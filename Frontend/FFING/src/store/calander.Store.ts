import {create} from 'zustand';

interface CalendarState {
  value: Date;
  setValue: (date: Date) => void;
}

export const useCalendarStore = create<CalendarState>((set) => ({
  value: new Date(),
  setValue: (date: Date) => set({ value: date }),
}));

import { create } from 'zustand';
import { createJournal } from './journalAPI';

const useJournalStore = create((set) => ({
  journals: [],
  loading: false,
  error: null,

  createEntry: async (entryData, token) => {
    set({ loading: true, error: null });
    try {
      const newEntry = await createJournal(entryData, token);
      set((state) => ({
        journals: [...state.journals, newEntry],
        loading: false,
        error: null,
      }));
    } catch (error) {
      const errorMessage = error?.response?.data?.message || "Failed to create journal entry. Please try again later.";
      set({
        loading: false,
        error: errorMessage,
      });
    }
  },

}));

export default useJournalStore;

import { create } from 'zustand';
import { createJournal } from './journalAPI';

const useJournalStore = create((set) => ({
  journals: [],
  loading: false,
  error: null,

  // Create a new journal entry
  createEntry: async (entryData, token) => {
    set({ loading: true, error: null });  // Reset error state before trying again
    try {
      const newEntry = await createJournal(entryData, token);
      set((state) => ({
        journals: [...state.journals, newEntry],
        loading: false,
        error: null,
      }));
    } catch (error) {
      // Set a user-friendly error message without logging to console
      const errorMessage = error?.response?.data?.message || "Failed to create journal entry. Please try again later.";
      set({
        loading: false,
        error: errorMessage,
      });
    }
  },

  // Optionally add other actions for fetching, updating, or deleting journal entries
}));

export default useJournalStore;

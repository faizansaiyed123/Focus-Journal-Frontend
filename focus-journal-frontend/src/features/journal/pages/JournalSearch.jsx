import { useState } from 'react';
import DashboardLayout from '../../../layouts/DashboardLayout';
import useAuthStore from '../../auth/authStore';
import { searchJournals } from '../journalInsightsApi';
import { ClipLoader } from 'react-spinners';

export default function JournalSearch() {
    const token = useAuthStore((state) => state.token);
    const [keyword, setKeyword] = useState('');
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleSearch = async () => {
        if (!keyword.trim()) return;  // Avoid searching if no keyword is provided

        setLoading(true);
        setError(null);  // Clear any previous errors

        try {
            const res = await searchJournals(token, keyword);
            if (res?.length === 0) {
                setError('No entries found matching your search.');
            } else {
                setResults(res);
            }
        } catch (err) {
            setError('Failed to search journals. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <DashboardLayout>
            <div className="max-w-4xl mx-auto px-4 py-8">
                <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-200 mb-6">🔍 Search Journal Entries</h1>

                <div className="flex gap-2 mb-6">
                    <input
                        type="text"
                        value={keyword}
                        onChange={(e) => setKeyword(e.target.value)}
                        placeholder="Enter keyword..."
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-blue-500 dark:bg-gray-800 dark:text-white dark:border-gray-600"
                    />
                    <button
                        onClick={handleSearch}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition disabled:opacity-50"
                        disabled={loading || !keyword.trim()}
                    >
                        Search
                    </button>
                </div>

                {loading ? (
                    <div className="flex justify-center items-center h-40">
                        <ClipLoader color="#3b82f6" size={40} />
                    </div>
                ) : error ? (
                    <p className="text-red-600">{error}</p>
                ) : results.length === 0 ? (
                    <p className="text-gray-500">No entries found.</p>
                ) : (
                    <div className="space-y-4">
                        {results.map((entry, index) => (
                            <div
                                key={index}
                                className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md border border-gray-200 dark:border-gray-700"
                            >
                                <p className="text-gray-800 dark:text-gray-200 whitespace-pre-wrap">{entry.content}</p>
                                <p className="text-sm text-gray-500 mt-2">
                                    🗓️ {new Date(entry.created_at).toLocaleString()}
                                </p>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
}

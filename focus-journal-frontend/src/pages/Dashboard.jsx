// import { useState, useEffect } from 'react';
// import { useNavigate, Link } from 'react-router-dom';
// import DashboardLayout from '../layouts/DashboardLayout';
// import useAuthStore from '../features/auth/authStore';
// import { fetchAllJournals, fetchJournalStats } from '../features/journal/journalAPI';
// import JournalTags from '../features/journal/pages/JournalTags';
// import JournalCalendar from '../features/journal/pages/JournalCalendar';
// import { searchJournals } from '../features/journal/journalInsightsApi';
// import SummaryDashboard from '../features/summary/pages/SummaryDashboard';

// export default function Dashboard() {
//   const [journals, setJournals] = useState([]);
//   const [stats, setStats] = useState(null);
//   const [searchKeyword, setSearchKeyword] = useState('');
//   const [searchResults, setSearchResults] = useState([]);
//   const [isSearching, setIsSearching] = useState(false);

//   const token = useAuthStore((state) => state.token);
//   const logout = useAuthStore((state) => state.logout);
//   const navigate = useNavigate();

//   useEffect(() => {
//     if (!token) {
//       navigate('/login');
//       return;
//     }

//     const loadJournals = async () => {
//       try {
//         const data = await fetchAllJournals(token);
//         setJournals(data);
//       } catch (error) {
//         if (error.response?.status === 401) {
//           logout();
//           navigate('/login');
//         }
//       }
//     };

//     const loadStats = async () => {
//       try {
//         const data = await fetchJournalStats(token);
//         setStats(data);
//       } catch (err) {
//       }
//     };

//     loadJournals();
//     loadStats();
//   }, [token, logout, navigate]);

//   const handleSearch = async () => {
//     if (!searchKeyword.trim()) return;
//     setIsSearching(true);
//     try {
//       const results = await searchJournals(token, searchKeyword);
//       setSearchResults(results);
//     } catch (error) {
//     } finally {
//       setIsSearching(false);
//     }
//   };

//   const handleClearSearch = () => {
//     setSearchKeyword('');
//     setSearchResults([]);
//   };

//   return (
//     <DashboardLayout>
//       <h2 className="text-xl font-semibold text-gray-800 mb-4">🔎 Search Journal Entries</h2>
//         {/* Container for Search Bar and Logout Button */}
//         <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center sm:gap-6 mb-6">
//           {/* Search Bar */}
//           <div className="w-full sm:w-3/4 md:w-1/2 lg:w-1/3 flex gap-3 mb-4 sm:mb-0">
//             <input
//               type="text"
//               value={searchKeyword}
//               onChange={(e) => setSearchKeyword(e.target.value)}
//               placeholder="Search by keyword..."
//               className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//             />
//             <button
//               onClick={handleSearch}
//               className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
//             >
//               Search
//             </button>
//             {searchResults.length > 0 && (
//               <button
//                 onClick={handleClearSearch}
//                 className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition"
//               >
//                 Clear
//               </button>
//             )}
//           </div>

//           {/* Logout Button */}
//       <button
//         onClick={logout}
//         className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 w-full sm:w-auto mt-4 sm:mt-0"
//       >
//         <span className="text-lg sm:text-xl">⚡</span>
//         <span className="hidden sm:inline">Logout</span>
//       </button>

//         </div>
//       <SummaryDashboard />
//       <div className="px-4 sm:px-6 lg:px-8 py-6 flex flex-col">
        

//         {/* Rest of the Content */}
//         <section className="mb-12">
          
//           {isSearching ? (
//             <p className="text-gray-500">Searching...</p>
//           ) : searchResults.length > 0 ? (
//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//               {searchResults.map((entry) => (
//                 <div
//                   key={entry.id}
//                   className="bg-white p-5 rounded-lg shadow hover:shadow-lg transition duration-200"
//                 >
//                   <div className="flex justify-between items-center mb-2">
//                     <h3 className="text-lg font-semibold text-gray-900">{entry.title}</h3>
//                     <span className="text-2xl">{entry.mood || '📝'}</span>
//                   </div>
//                   <p className="text-sm text-gray-600 mb-2">Focus: {entry.focus_percent || 0}%</p>
//                   <p className="text-gray-700 text-sm line-clamp-3">{entry.content}</p>
//                   {entry.tags?.length > 0 && (
//                     <div className="mt-3 flex flex-wrap gap-2">
//                       {entry.tags.map((tag, i) => (
//                         <span
//                           key={i}
//                           className="bg-blue-100 text-blue-700 text-xs font-medium px-2 py-0.5 rounded-full"
//                         >
//                           #{tag}
//                         </span>
//                       ))}
//                     </div>
//                   )}
//                 </div>
//               ))}
//             </div>
//           ) : searchKeyword && (
//             <p className="text-gray-500">No journal entries found for "{searchKeyword}".</p>
//           )}
//         </section>

//         {/* Header */}
//         <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
//           <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
//             📘 Dashboard
//           </h1>
//           <div className="flex gap-3">
//             <Link
//               to="/journal/create"
//               className="inline-flex items-center gap-2 bg-blue-50 hover:bg-blue-100 text-blue-700 font-semibold px-5 py-3 rounded-lg border border-blue-200 transition duration-200 shadow-sm"
//             >
//               <span className="text-lg">➕</span>
//               New Journal Entry
//             </Link>

//             <Link
//               to="/checkins/new"
//               className="inline-flex items-center gap-2 bg-green-50 hover:bg-green-100 text-green-700 font-semibold px-5 py-3 rounded-lg border border-green-200 transition duration-200 shadow-sm"
//             >
//               <span className="text-lg">✅</span>
//               New Check-In
//             </Link>
//           </div>
//         </div>

//         {/* Stats Section */}
//         {stats && (
//           <section className="mb-10">
//             <h2 className="text-xl font-semibold text-gray-800 mb-4">📊 Journal Statistics</h2>
//             <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
//               <div className="bg-white p-6 rounded-lg shadow">
//                 <h3 className="text-blue-600 font-medium mb-2">📝 Total Entries</h3>
//                 <p className="text-3xl font-bold text-gray-900">{stats.total_entries}</p>
//               </div>
//               <div className="bg-white p-6 rounded-lg shadow">
//                 <h3 className="text-green-600 font-medium mb-2">🎯 Avg Focus</h3>
//                 <p className="text-3xl font-bold text-gray-900">{stats.average_focus}%</p>
//               </div>
//               <div className="bg-white p-6 rounded-lg shadow">
//                 <h3 className="text-pink-600 font-medium mb-2">😊 Common Moods</h3>
//                 <div className="flex flex-wrap gap-2">
//                   {stats.most_common_moods?.length ? (
//                     stats.most_common_moods.map((mood, i) => (
//                       <span key={i} className="bg-pink-100 text-pink-700 px-3 py-1 rounded-full text-sm">
//                         {mood}
//                       </span>
//                     ))
//                   ) : (
//                     <p className="text-sm text-gray-500">No data</p>
//                   )}
//                 </div>
//               </div>
//               <div className="bg-white p-6 rounded-lg shadow">
//                 <h3 className="text-purple-600 font-medium mb-2">🏷️ Common Tags</h3>
//                 <div className="flex flex-wrap gap-2">
//                   {stats.most_used_tags?.length ? (
//                     stats.most_used_tags.map((tag, i) => (
//                       <span key={i} className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm">
//                         #{tag}
//                       </span>
//                     ))
//                   ) : (
//                     <p className="text-sm text-gray-500">No tags</p>
//                   )}
//                 </div>
//               </div>
//             </div>
//           </section>
//         )}

//         {/* Journal Tags and Calendar */}
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
//           <JournalTags />
//           <JournalCalendar />
//         </div>

//         {/* Recent Journal Entries */}
//         <section>
//           <h2 className="text-xl font-semibold text-gray-800 mb-4">🗂️ Recent Entries</h2>
//           {journals.length === 0 ? (
//             <p className="text-gray-500">No journal entries yet.</p>
//           ) : (
//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//               {journals.slice(0, 6).map((entry) => (
//                 <div
//                   key={entry.id}
//                   className="bg-white p-5 rounded-lg shadow hover:shadow-lg transition duration-200"
//                 >
//                   <div className="flex justify-between items-center mb-2">
//                     <h3 className="text-lg font-semibold text-gray-900">{entry.title}</h3>
//                     <span className="text-2xl">{entry.mood || '📝'}</span>
//                   </div>
//                   <p className="text-sm text-gray-600 mb-2">Focus: {entry.focus_percent || 0}%</p>
//                   <p className="text-gray-700 text-sm line-clamp-3">{entry.content}</p>
//                   {entry.tags?.length > 0 && (
//                     <div className="mt-3 flex flex-wrap gap-2">
//                       {entry.tags.map((tag, i) => (
//                         <span
//                           key={i}
//                           className="bg-blue-100 text-blue-700 text-xs font-medium px-2 py-0.5 rounded-full"
//                         >
//                           #{tag}
//                         </span>
//                       ))}
//                     </div>
//                   )}
//                 </div>
//               ))}
//             </div>
//           )}
//         </section>
//       </div>
//     </DashboardLayout>
//   );
// }
import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import DashboardLayout from '../layouts/DashboardLayout';
import useAuthStore from '../features/auth/authStore';
import {
  fetchAllJournals,
  fetchJournalStats
} from '../features/journal/journalAPI';
import JournalTags from '../features/journal/pages/JournalTags';
import JournalCalendar from '../features/journal/pages/JournalCalendar';
import { searchJournals } from '../features/journal/journalInsightsApi';
import SummaryDashboard from '../features/summary/pages/SummaryDashboard';

export default function Dashboard() {
  const [journals, setJournals] = useState([]);
  const [stats, setStats] = useState(null);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  const token = useAuthStore((state) => state.token);
  const logout = useAuthStore((state) => state.logout);
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }

    (async () => {
      try {
        const data = await fetchAllJournals(token);
        setJournals(data);
        const statsRes = await fetchJournalStats(token);
        setStats(statsRes);
      } catch (err) {
        if (err.response?.status === 401) logout();
        navigate('/login');
      }
    })();
  }, [token, logout, navigate]);

  const handleSearch = async () => {
    if (!searchKeyword.trim()) return;
    setIsSearching(true);
    try {
      const results = await searchJournals(token, searchKeyword);
      setSearchResults(results);
    } finally {
      setIsSearching(false);
    }
  };

  const handleClearSearch = () => {
    setSearchKeyword('');
    setSearchResults([]);
  };

  return (
    <DashboardLayout>
      {/* Search & Logout */}
      <div className="mb-6 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div className="flex flex-1 gap-2 sm:gap-3">
          <input
            className="flex-1 border rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            type="text"
            placeholder="Search entries..."
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
          />
          <button
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
            onClick={handleSearch}
          >
            Search
          </button>
          {searchResults.length > 0 && (
            <button
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition"
              onClick={handleClearSearch}
            >
              Clear
            </button>
          )}
        </div>
        <button
          onClick={logout}
          className="mt-2 sm:mt-0 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition focus:ring-2 focus:ring-red-500"
        >
          Logout
        </button>
      </div>
            <section className="mb-10">
        {isSearching ? (
          <p className="text-gray-500">Searching...</p>
        ) : searchResults.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {searchResults.map((entry) => (
              <div
                key={entry.id}
                className="bg-white p-5 rounded-lg shadow hover:shadow-lg transition"
              >
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-lg font-semibold text-gray-900 break-words">
                    {entry.title}
                  </h3>
                  <span className="text-2xl">{entry.mood || '📝'}</span>
                </div>
                <p className="text-sm text-gray-600 mb-2">
                  Focus: {entry.focus_percent || 0}%
                </p>
                <p className="text-gray-700 text-sm line-clamp-3 break-words">
                  {entry.content}
                </p>
                {entry.tags?.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {entry.tags.map((tag, i) => (
                      <span
                        key={i}
                        className="bg-blue-100 text-blue-700 text-xs font-medium px-2 py-0.5 rounded-full"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : searchKeyword ? (
          <p className="text-gray-500">
            No entries found for "{searchKeyword}".
          </p>
        ) : null}
      </section>

      {/* Summary */}
      <SummaryDashboard token={token} />

      {/* Search Results */}


      {/* Header Actions */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-8">
        <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
          Dashboard
        </h1>
        <div className="flex gap-3">
          <Link
            to="/journal/create"
            className="inline-flex items-center gap-2 bg-blue-50 hover:bg-blue-100 text-blue-700 font-semibold px-5 py-3 rounded-lg border border-blue-200 transition"
          >
            <span className="text-lg">➕</span> New Journal
          </Link>
          <Link
            to="/checkins/new"
            className="inline-flex items-center gap-2 bg-green-50 hover:bg-green-100 text-green-700 font-semibold px-5 py-3 rounded-lg border border-green-200 transition"
          >
            <span className="text-lg">✅</span> New Check-In
          </Link>
        </div>
      </div>

      {/* Stats */}
      {stats && (
        <section className="mb-12">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Journal Statistics
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-blue-600 mb-2 font-medium">Total Entries</h3>
              <p className="text-3xl font-bold">{stats.total_entries}</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-green-600 mb-2 font-medium">Avg Focus</h3>
              <p className="text-3xl font-bold">{stats.average_focus}%</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-pink-600 mb-2 font-medium">Common Moods</h3>
              <div className="flex flex-wrap gap-2">
                {stats.most_common_moods?.length ? (
                  stats.most_common_moods.map((mood, i) => (
                    <span
                      key={i}
                      className="bg-pink-100 text-pink-700 px-3 py-1 rounded-full text-sm"
                    >
                      {mood}
                    </span>
                  ))
                ) : (
                  <p className="text-sm text-gray-500">No data</p>
                )}
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-purple-600 mb-2 font-medium">Common Tags</h3>
              <div className="flex flex-wrap gap-2">
                {stats.most_used_tags?.length ? (
                  stats.most_used_tags.map((tag, i) => (
                    <span
                      key={i}
                      className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm"
                    >
                      #{tag}
                    </span>
                  ))
                ) : (
                  <p className="text-sm text-gray-500">No tags</p>
                )}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Tags & Calendar */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
        <JournalTags />
        <JournalCalendar />
      </div>

      {/* Recent Entries */}
      <section>
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          Recent Entries
        </h2>
        {journals.length === 0 ? (
          <p className="text-gray-500">No journal entries yet.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {journals.slice(0, 6).map((entry) => (
              <div
                key={entry.id}
                className="bg-white p-5 rounded-lg shadow hover:shadow-lg transition"
              >
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-lg font-semibold text-gray-900 break-words">
                    {entry.title}
                  </h3>
                  <span className="text-2xl">{entry.mood || '📝'}</span>
                </div>
                <p className="text-sm text-gray-600 mb-2">
                  Focus: {entry.focus_percent || 0}%
                </p>
                <p className="text-gray-700 text-sm line-clamp-3 break-words">
                  {entry.content}
                </p>
                {entry.tags?.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {entry.tags.map((tag, i) => (
                      <span
                        key={i}
                        className="bg-blue-100 text-blue-700 text-xs font-medium px-2 py-0.5 rounded-full"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </section>
    </DashboardLayout>
  );
}

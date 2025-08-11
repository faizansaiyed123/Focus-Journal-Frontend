// import { useEffect, useState } from "react";
// import { fetchCheckinsBetweenDates } from "../checkinAPI";
// import useAuthStore from "../../auth/authStore";

// function CheckinBetweenDates() {
//   const [startDate, setStartDate] = useState("");
//   const [endDate, setEndDate] = useState("");
//   const [checkins, setCheckins] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);
//   const token = useAuthStore((state) => state.token);

//   useEffect(() => {
//     if (!token || !startDate || !endDate) return;

//     const loadData = async () => {
//       setLoading(true);
//       setError(null);
//       try {
//         const data = await fetchCheckinsBetweenDates(token, startDate, endDate);
//         setCheckins(data || []);
//       } catch (err) {
//         setError("Failed to fetch check-ins. Please try again.");
//       } finally {
//         setLoading(false);
//       }
//     };

//     loadData();
//   }, [token, startDate, endDate]);

//   return (
//     <div className="bg-white rounded-xl shadow-md p-4 max-w-4xl mx-auto mt-6">
//       <h1 className="text-xl font-semibold text-gray-900 mb-5">📅 Check-Ins Between Dates</h1>

//       <form className="flex flex-col sm:flex-row gap-4 mb-6" onSubmit={(e) => e.preventDefault()}>
//         <div className="flex flex-col w-full sm:w-auto">
//           <label htmlFor="startDate" className="text-xs font-medium text-gray-600 mb-1">
//             Start Date
//           </label>
//           <input
//             id="startDate"
//             type="date"
//             value={startDate}
//             onChange={(e) => setStartDate(e.target.value)}
//             className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
//             max={endDate || undefined}
//           />
//         </div>

//         <div className="flex flex-col w-full sm:w-auto">
//           <label htmlFor="endDate" className="text-xs font-medium text-gray-600 mb-1">
//             End Date
//           </label>
//           <input
//             id="endDate"
//             type="date"
//             value={endDate}
//             onChange={(e) => setEndDate(e.target.value)}
//             className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
//             min={startDate || undefined}
//           />
//         </div>
//       </form>

//       {loading ? (
//         <p className="text-center text-indigo-600 font-medium text-sm">Loading check-ins...</p>
//       ) : error ? (
//         <p className="text-center text-red-600 font-medium text-sm">{error}</p>
//       ) : checkins.length > 0 ? (
//         <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
//           {checkins.map(({ id, date, mood, focus_percent, tags, note }) => (
//             <li
//               key={id}
//               className="bg-gray-50 border border-gray-200 rounded-lg p-3 shadow-sm hover:shadow-md transition duration-200 cursor-default"
//             >
//               <div className="flex justify-between items-center mb-1">
//                 <span className="text-sm font-semibold text-gray-900">
//                   {new Date(date).toLocaleDateString()}
//                 </span>
//                 <span className="text-xs italic text-gray-500">{mood || "No mood"}</span>
//               </div>
//               <p className="text-xs text-gray-700 mb-0.5">
//                 <strong>Focus:</strong> {focus_percent ?? 0}%
//               </p>
//               <p className="text-xs text-gray-700 mb-0.5 truncate">
//                 <strong>Tags:</strong> {tags && tags.length > 0 ? tags.join(", ") : "No tags"}
//               </p>
//               <p className="text-xs text-gray-600 line-clamp-2">
//                 <strong>Note:</strong> {note || "No notes available."}
//               </p>
//             </li>
//           ))}
//         </ul>
//       ) : (
//         <p className="text-center text-gray-500 italic text-sm">No check-ins found for the selected dates.</p>
//       )}
//     </div>
//   );
// }

// export default CheckinBetweenDates;
import { useEffect, useState } from "react";
import { fetchCheckinsBetweenDates } from "../checkinAPI";
import useAuthStore from "../../auth/authStore";

function CheckinBetweenDates() {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [checkins, setCheckins] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const token = useAuthStore((state) => state.token);

  useEffect(() => {
    if (!token || !startDate || !endDate) return;

    const loadData = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await fetchCheckinsBetweenDates(token, startDate, endDate);
        setCheckins(data || []);
      } catch (err) {
        setError("Failed to fetch check-ins. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [token, startDate, endDate]);

  return (
    <div className="max-w-4xl mx-auto mt-6 space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 mb-4">
        <div className="flex flex-col w-full sm:w-auto">
          <label htmlFor="startDate" className="text-xs font-medium text-gray-600 mb-1 select-none">
            Start Date
          </label>
          <input
            id="startDate"
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            max={endDate || undefined}
          />
        </div>

        <div className="flex flex-col w-full sm:w-auto">
          <label htmlFor="endDate" className="text-xs font-medium text-gray-600 mb-1 select-none">
            End Date
          </label>
          <input
            id="endDate"
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            min={startDate || undefined}
          />
        </div>
      </div>

      {loading ? (
        <p className="text-center text-indigo-600 font-semibold text-sm">Loading check-ins...</p>
      ) : error ? (
        <p className="text-center text-red-600 font-semibold text-sm">{error}</p>
      ) : checkins.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {checkins.map(({ id, date, mood, focus_percent, tags, note }) => (
            <div
              key={id}
              className="bg-white rounded-xl shadow-lg p-4 hover:shadow-xl hover:scale-[1.03] transform transition duration-300 cursor-default"
            >
              <h3 className="text-gray-400 uppercase text-[10px] mb-3 tracking-wide flex items-center gap-2 select-none">
                📅 Date
              </h3>
              <p className="text-gray-800 text-base font-semibold mb-2">
                {date ? new Date(date).toLocaleDateString() : "N/A"}
              </p>

              <div className="space-y-2 text-gray-800 text-base font-semibold">
                <p>
                  <strong>Mood:</strong> {mood || "N/A"}
                </p>
                <p>
                  <strong>Focus:</strong> {focus_percent ?? 0}%
                </p>
                <p>
                  <strong>Tags:</strong> {tags && tags.length > 0 ? tags.join(", ") : "No tags"}
                </p>
                <p className="text-gray-600 line-clamp-3 font-normal">
                  <strong>Note:</strong> {note || "No notes available."}
                </p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-500 italic text-sm select-none">
          No check-ins found for the selected dates.
        </p>
      )}
    </div>
  );
}

export default CheckinBetweenDates;

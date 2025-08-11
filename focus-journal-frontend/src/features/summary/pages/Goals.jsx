// import { useState, useEffect } from "react";
// import apiClient from "../../../api/apiClient";
// import useAuthStore from "../../auth/authStore";

// const BASE_URL = import.meta.env.VITE_API_URL;

// export default function GoalsPage() {
//   const token = useAuthStore((state) => state.token);
//   const [goals, setGoals] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);
//   const [successMsg, setSuccessMsg] = useState(null);

//   const [goal, setGoal] = useState("");
//   const [targetDays, setTargetDays] = useState("");

//   // Fetch Goals with API shape handling
//   const fetchGoals = async () => {
//   if (!token) return;
//   setLoading(true);
//   setError(null);
//   try {
//     const res = await apiClient.get(`${BASE_URL}/checkin/goal`, {
//       headers: { Authorization: `Bearer ${token}` },
//     });

//     console.log("📦 GET /checkin/goal response:", res.data);

//     const goalData = res.data?.data;
//     if (Array.isArray(goalData)) {
//       setGoals(goalData);
//     } else if (goalData && typeof goalData === "object") {
//       setGoals([goalData]); // wrap single object into array so .map works
//     } else {
//       setGoals([]);
//     }
//   } catch (err) {
//     console.error("❌ Failed to load goals:", err.response?.data || err);
//     setError("Failed to load goals.");
//     setGoals([]);
//   } finally {
//     setLoading(false);
//   }
// };


//   // Load goals on mount
//   useEffect(() => {
//     fetchGoals();
//   }, [token]);

//   // Save new goal
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError(null);
//     setSuccessMsg(null);

//     if (!goal.trim()) return setError("Goal cannot be empty.");
//     if (!targetDays || isNaN(targetDays) || Number(targetDays) <= 0) {
//       return setError("Enter a valid number of target days.");
//     }

//     setLoading(true);
//     try {
//           await apiClient.post(
//             `${BASE_URL}/checkin/goal`,
//             { goal: goal.trim(), target_days: parseInt(targetDays, 10) },
//             {
//               headers: {
//                 Authorization: `Bearer ${token}`,
//                 "Content-Type": "application/json",
//               },
//             }
//           );

//       setSuccessMsg("Goal saved successfully!");
//       setGoal("");
//       setTargetDays("");

//       // Refresh list after save
//       fetchGoals();
//     } catch (err) {
//       console.error("❌ Failed to save goal:", err.response?.data || err);
//       setError("Failed to save goal.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="max-w-6xl mx-auto p-6">
//       <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">
//         🎯 My Goals
//       </h1>

//       {error && (
//         <p className="text-red-600 bg-red-50 px-4 py-2 rounded text-center mb-4">
//           {error}
//         </p>
//       )}
//       {successMsg && (
//         <p className="text-green-600 bg-green-50 px-4 py-2 rounded text-center mb-4">
//           {successMsg}
//         </p>
//       )}

//       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//         {/* Create Goal Form */}
//         <div className="bg-white p-6 rounded-lg shadow border">
//           <h2 className="text-xl font-semibold mb-4">Create a Goal</h2>
//           <form onSubmit={handleSubmit} className="space-y-4">
//             <div>
//               <label htmlFor="goal" className="block font-medium text-gray-700 mb-1">
//                 Goal Description
//               </label>
//               <textarea
//                 id="goal"
//                 rows={4}
//                 className="w-full border border-gray-300 rounded-md px-3 py-2 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
//                 placeholder="Describe your goal..."
//                 value={goal}
//                 onChange={(e) => setGoal(e.target.value)}
//               />
//             </div>

//             <div>
//               <label htmlFor="targetDays" className="block font-medium text-gray-700 mb-1">
//                 Target Days
//               </label>
//              <input
//                   type="number"
//                   min="1"
//                   max="7"
//                   id="targetDays"
//                   className="w-full border border-gray-300 rounded-md px-3 py-2 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
//                   placeholder="e.g. 7"
//                   value={targetDays}
//                   onChange={(e) => setTargetDays(e.target.value)}
//                 />

//             </div>

//             <button
//               type="submit"
//               className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-md font-medium transition w-full"
//               disabled={loading}
//             >
//               {loading ? "Saving..." : "Save Goal"}
//             </button>
//           </form>
//         </div>

//         {/* Goals List */}
//         <div className="bg-white p-6 rounded-lg shadow border">
//           <h2 className="text-xl font-semibold mb-4">Existing Goals</h2>
//           {loading ? (
//             <p className="text-gray-500">Loading goals...</p>
//           ) : goals.length === 0 ? (
//             <p className="text-gray-500">No goals yet. Create one on the left!</p>
//           ) : (
//             <ul className="space-y-4">
//               {goals.map((g) => (
//                 <li
//                   key={g.id || g.goal}
//                   className="p-4 border rounded-lg bg-gray-50 hover:bg-gray-100 transition"
//                 >
//                   <p className="font-medium text-gray-800">{g.goal}</p>
//                   <p className="text-sm text-gray-500">
//                     🎯 Target Days: {g.target_days}
//                   </p>
//                   {g.created_at && (
//                     <p className="text-xs text-gray-400 mt-1">
//                       Created: {new Date(g.created_at).toLocaleDateString()}
//                     </p>
//                   )}
//                 </li>
//               ))}
//             </ul>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import apiClient from "../../../api/apiClient";
import useAuthStore from "../../auth/authStore";

const BASE_URL = import.meta.env.VITE_API_URL;

export default function GoalsPage() {
  const token = useAuthStore((state) => state.token);
  const navigate = useNavigate();

  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);
  const [goal, setGoal] = useState("");
  const [targetDays, setTargetDays] = useState("");

  // Fetch Goals
  const fetchGoals = async () => {
    if (!token) return;
    setLoading(true);
    setError(null);
    try {
      const res = await apiClient.get(`${BASE_URL}/checkin/goal`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const goalData = res.data?.data;
      if (Array.isArray(goalData)) {
        setGoals(goalData);
      } else if (goalData && typeof goalData === "object") {
        setGoals([goalData]);
      } else {
        setGoals([]);
      }
    } catch (err) {
      setError("Failed to load goals.");
      setGoals([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGoals();
  }, [token]);

  // Save Goal
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);

    if (!goal.trim()) return setError("Goal cannot be empty.");
    if (!targetDays || isNaN(targetDays) || Number(targetDays) <= 0 || Number(targetDays) > 7) {
      return setError("Target days must be between 1 and 7.");
    }

    setLoading(true);
    try {
      await apiClient.post(
        `${BASE_URL}/checkin/goal`,
        { goal: goal.trim(), target_days: Number(targetDays) },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      setSuccessMsg("Goal saved successfully!");
      setGoal("");
      setTargetDays("");
      fetchGoals();
    } catch {
      setError("Failed to save goal.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Top Bar */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-gray-800">🎯 My Goals</h1>
        <button
          onClick={() => navigate("/dashboard")}
          className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-md font-medium transition"
        >
          ← Back to Dashboard
        </button>
      </div>

      {error && (
        <p className="text-red-600 bg-red-50 px-4 py-2 rounded text-center mb-4">
          {error}
        </p>
      )}
      {successMsg && (
        <p className="text-green-600 bg-green-50 px-4 py-2 rounded text-center mb-4">
          {successMsg}
        </p>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Create Goal Form */}
        <div className="bg-white p-6 rounded-lg shadow border">
          <h2 className="text-xl font-semibold mb-4">Create a Goal</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="goal" className="block font-medium text-gray-700 mb-1">
                Goal Description
              </label>
              <textarea
                id="goal"
                rows={4}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Describe your goal..."
                value={goal}
                onChange={(e) => setGoal(e.target.value)}
              />
            </div>

            <div>
              <label htmlFor="targetDays" className="block font-medium text-gray-700 mb-1">
                Target Days (1–7)
              </label>
              <input
                type="number"
                min="1"
                max="7"
                id="targetDays"
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g. 7"
                value={targetDays}
                onChange={(e) => setTargetDays(e.target.value)}
              />
            </div>

            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-md font-medium transition w-full"
              disabled={loading}
            >
              {loading ? "Saving..." : "Save Goal"}
            </button>
          </form>
        </div>

        {/* Goals List */}
        <div className="bg-white p-6 rounded-lg shadow border">
          <h2 className="text-xl font-semibold mb-4">Existing Goals</h2>
          {loading ? (
            <p className="text-gray-500">Loading goals...</p>
          ) : goals.length === 0 ? (
            <p className="text-gray-500">No goals yet. Create one on the left!</p>
          ) : (
            <ul className="space-y-4">
              {goals.map((g, i) => (
                <li
                  key={g.id || `${g.goal}-${i}`}
                  className="p-4 border rounded-lg bg-gray-50 hover:bg-gray-100 transition"
                >
                  <p className="font-medium text-gray-800">{g.goal}</p>
                  <p className="text-sm text-gray-500">🎯 Target Days: {g.target_days}</p>
                  {g.created_at && (
                    <p className="text-xs text-gray-400 mt-1">
                      Created: {new Date(g.created_at).toLocaleDateString()}
                    </p>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

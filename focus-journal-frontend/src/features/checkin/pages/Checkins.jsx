import { useEffect, useState } from 'react';
import {
  fetchCheckins,
  fetchToday,
  fetchCheckinStats,
  fetchStreak,
} from '../checkinAPI';
import useAuthStore from '../../auth/authStore';
import { Link, useNavigate } from 'react-router-dom';
import DashboardLayout from '../../../layouts/DashboardLayout';
import OptionsMenu from './OptionsMenu';
import CheckinBetweenDates from './CheckinBetweenDates';

export default function Checkins() {
  const token = useAuthStore((state) => state.token);
  const [todayChecked, setTodayChecked] = useState(false);
  const [stats, setStats] = useState(null);
  const [streak, setStreak] = useState(null);
  const [checkins, setCheckins] = useState([]);
  const [openMenuId, setOpenMenuId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const load = async () => {
      try {
        const [t, s, st, all] = await Promise.all([
          fetchToday(token),
          fetchCheckinStats(token),
          fetchStreak(token),
          fetchCheckins(token),
        ]);
        setTodayChecked(!!t?.checked);
        setStats(s || {});
        setStreak(st || {});
        setCheckins(all || []);
      } catch (err) {
        console.error("Error loading checkins:", err);
      }
    };
    if (token) load();
  }, [token]);

  return (
    <DashboardLayout>
      <div className="p-4 sm:p-6 max-w-5xl mx-auto space-y-8">
        {<CheckinBetweenDates/>}
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h1 className="text-3xl font-extrabold tracking-tight text-gray-900">
            📝 Daily Check-Ins
          </h1>
          {!todayChecked ? (
            <button
              onClick={() => navigate('/checkins/new')}
              className="bg-blue-600 text-white px-5 py-2 rounded-lg shadow-md hover:bg-blue-700 transition focus:outline-none focus:ring-2 focus:ring-blue-500"
              type="button"
            >
              ➕ Create Today’s Check-In
            </button>
          ) : (
            <span className="text-green-700 font-semibold text-sm sm:text-base flex items-center gap-2 select-none">
              ✅ <span>You’ve already checked in today!</span>
            </span>
          )}
        </div>

        {/* Stats Section */}
        {stats && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            <StatCard
              title="Total Check-Ins"
              value={stats.total_checkins ?? 0}
              icon="📅"
              color="from-indigo-500 to-indigo-700"
            />
            <StatCard
              title="Entries Created"
              value={stats.entry_count ?? 0}
              icon="📝"
              color="from-green-500 to-green-700"
            />
            <StreakCard streak={streak} />
          </div>
        )}

        {/* Check-In History */}
        <div>
          <h2 className="text-2xl font-semibold mb-6 text-gray-800 select-none">
            📜 Check-In History
          </h2>
          <div className="grid gap-6">
            {checkins.length > 0 ? (
              checkins.map((ci) => (
                <div
                  key={ci.id}
                  className="relative bg-white border border-gray-300 p-5 rounded-xl shadow hover:shadow-lg transition duration-300 ease-in-out cursor-pointer"
                >
                  {/* Menu dots button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setOpenMenuId(openMenuId === ci.id ? null : ci.id);
                    }}
                    className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 p-2 rounded-full hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    aria-label="Open options menu"
                    type="button"
                  >
                    <b className="text-xl select-none">⋯</b>
                  </button>

                  {/* Options menu */}
                  {openMenuId === ci.id && (
                    <OptionsMenu
                      onEdit={() => {
                        navigate(`/checkins/${ci.id}/edit`);
                        setOpenMenuId(null);
                      }}
                      onDelete={() => {
                        setOpenMenuId(null);
                      }}
                    />
                  )}

                  {/* Link to details */}
                  <Link to={`/checkins/${ci.id}`} className="block mt-4">
                    <div className="flex justify-between items-center">
                      <span className="font-semibold text-gray-900 text-base sm:text-lg">
                        {ci.date ? new Date(ci.date).toLocaleDateString() : "N/A"}
                      </span>
                      <span className="text-sm text-gray-500 italic select-none">
                        {ci.mood || 'No mood'}
                      </span>
                    </div>
                    <p className="text-gray-700 mt-2 text-sm sm:text-base">
                      <strong>Focus:</strong> {ci.focus_percent ?? 0}%
                    </p>
                    <p className="text-gray-700 mt-1 text-sm sm:text-base">
                      <strong>Tags:</strong>{" "}
                      {ci.tags?.length > 0 ? ci.tags.join(', ') : 'No tags'}
                    </p>
                    <p className="text-gray-600 mt-2 line-clamp-3 text-sm sm:text-base">
                      <strong>Note:</strong> {ci.note || 'No notes available.'}
                    </p>
                  </Link>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center py-10 italic select-none">
                No check-ins available.
              </p>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

/* Stat card with gradient icon background, scale on hover */
function StatCard({ title, value, icon, color }) {
  return (
    <div className="bg-white rounded-xl shadow-lg p-4 flex items-center gap-4 hover:shadow-xl hover:scale-[1.03] transform transition duration-300 cursor-default">
      <div
        className={`w-12 h-12 flex items-center justify-center rounded-full text-white text-2xl font-bold bg-gradient-to-br ${color}`}
      >
        {icon}
      </div>
      <div>
        <h3 className="text-gray-400 uppercase text-[10px] tracking-wide select-none">{title}</h3>
        <p className="text-2xl font-extrabold text-gray-900">{value}</p>
      </div>
    </div>
  );
}

function StreakCard({ streak }) {
  if (!streak || Object.keys(streak).length === 0) return null;

  return (
    <div className="bg-white rounded-xl shadow-lg p-4 hover:shadow-xl hover:scale-[1.03] transform transition duration-300 cursor-default">
      <h3 className="text-gray-400 uppercase text-[10px] mb-3 tracking-wide flex items-center gap-2 select-none">
        <span className="text-xl">🔥</span> Streak Info
      </h3>
      <div className="space-y-3 text-gray-800 text-base font-semibold">
        <p>
          Current Streak: <span className="text-red-600">{streak.current_streak ?? 0} days</span>
        </p>
        <p>
          Longest Streak: <span className="text-red-600">{streak.longest_streak ?? 0} days</span>
        </p>
        <p>
          Last Check-In:{" "}
          <span className="text-red-600">
            {streak.last_checkin_date
              ? new Date(streak.last_checkin_date).toLocaleDateString()
              : "N/A"}
          </span>
        </p>
      </div>
    </div>
  );
}

import useAuthStore from '../../features/auth/authStore';

export default function Navbar() {
  const { user, logout } = useAuthStore();

  return (
    <header className="h-16 bg-white shadow px-6 flex justify-between items-center">
      <div className="text-lg font-semibold">Welcome, {user?.name || 'User'}</div>
      <button
        onClick={() => {
          logout();
          localStorage.removeItem('token');
          window.location.href = '/login';
        }}
        className="bg-red-500 text-white px-4 py-1 rounded"
      >
        Logout
      </button>
    </header>
  );
}


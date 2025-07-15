import { Link, Outlet } from 'react-router-dom';

function DashboardLayout({ onLogout }) {
  return (
    <div className="flex h-screen w-full overflow-hidden">
      <aside className="w-64 bg-slate-800 text-white p-6 flex flex-col shadow-lg">
        <h1 className="text-2xl font-bold mb-8">亲情疗愈辅助系统</h1>
        <nav className="flex flex-col gap-4 flex-1">
          <Link 
            to="/" 
            className="px-4 py-2 rounded hover:bg-slate-700 transition-colors duration-200 flex items-center"
          >
            <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            系统概览
          </Link>
          <Link 
            to="/patients" 
            className="px-4 py-2 rounded hover:bg-slate-700 transition-colors duration-200 flex items-center"
          >
            <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            病人管理
          </Link>
          <Link 
            to="/avatars" 
            className="px-4 py-2 rounded hover:bg-slate-700 transition-colors duration-200 flex items-center"
          >
            <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            虚拟人管理
          </Link>
        </nav>
        <button
          onClick={onLogout}
          className="mt-8 w-full bg-red-600 hover:bg-red-700 text-white py-2 rounded flex items-center justify-center transition"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a2 2 0 01-2 2H7a2 2 0 01-2-2V7a2 2 0 012-2h4a2 2 0 012 2v1" />
          </svg>
          退出登录
        </button>
      </aside>
      <main className="flex-1 overflow-y-auto bg-gray-50">
        <div className="container mx-auto px-6 py-8 max-w-7xl">
          <Outlet />
        </div>
      </main>
    </div>
  );
}

export default DashboardLayout; 
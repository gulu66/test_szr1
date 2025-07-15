import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

function Login({ onLogin }) {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    // TODO: 接入后端鉴权
    setTimeout(() => {
      if (form.email && form.password) {
        onLogin && onLogin();
        navigate('/');
      } else {
        setError('邮箱和密码不能为空');
      }
      setLoading(false);
    }, 600);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-lg shadow w-full max-w-sm"
      >
        <h2 className="text-2xl font-bold mb-6 text-center">登录</h2>
        <div className="mb-4">
          <label className="block text-gray-700 mb-1">邮箱</label>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            required
            className="w-full border rounded px-3 py-2 focus:outline-none focus:ring focus:ring-blue-300"
          />
        </div>
        <div className="mb-6">
          <label className="block text-gray-700 mb-1">密码</label>
          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            required
            className="w-full border rounded px-3 py-2 focus:outline-none focus:ring focus:ring-blue-300"
          />
        </div>
        {error && <div className="text-red-500 text-sm mb-3">{error}</div>}
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition disabled:opacity-60"
          disabled={loading}
        >
          {loading ? '登录中...' : '登录'}
        </button>
        <p className="text-center text-sm mt-4">
          还没有账号？ <Link to="/register" className="text-blue-600">注册</Link>
        </p>
      </form>
    </div>
  );
}

export default Login; 
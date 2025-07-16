import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

// fetchWithTimeout 工具函数
function fetchWithTimeout(resource, options = {}) {
  const { timeout = 8000 } = options;
  return Promise.race([
    fetch(resource, options),
    new Promise((_, reject) =>
      setTimeout(() => reject(new Error('请求超时')), timeout)
    )
  ]);
}

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
    fetchWithTimeout('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: form.email,
        password: form.password
      }),
      timeout: 8000
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          localStorage.setItem('userId', data.user.id); // 新增
          onLogin && onLogin();
          navigate('/');
        } else {
          setError(data.message);
        }
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message || '网络错误');
        setLoading(false);
      });
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
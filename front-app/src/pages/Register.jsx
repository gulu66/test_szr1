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

function Register({ onRegister }) {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '', confirm: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    // 简单校验
    if (!form.email || !form.password) {
      setError('邮箱和密码不能为空');
      setLoading(false);
      return;
    }
    if (form.password !== form.confirm) {
      setError('两次密码不一致');
      setLoading(false);
      return;
    }
    fetchWithTimeout('/api/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: form.email,
        password: form.password,
        confirm: form.confirm
      }),
      timeout: 8000
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          localStorage.setItem('userId', data.user.id); // 新增
          onRegister && onRegister();
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
        <h2 className="text-2xl font-bold mb-6 text-center">注册</h2>
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
        <div className="mb-4">
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
        <div className="mb-6">
          <label className="block text-gray-700 mb-1">确认密码</label>
          <input
            type="password"
            name="confirm"
            value={form.confirm}
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
          {loading ? '注册中...' : '注册'}
        </button>
        <p className="text-center text-sm mt-4">
          已有账号？ <Link to="/login" className="text-blue-600">登录</Link>
        </p>
      </form>
    </div>
  );
}

export default Register; 
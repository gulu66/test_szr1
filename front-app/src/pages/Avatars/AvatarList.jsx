import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';

function AvatarList() {
  const [avatars, setAvatars] = useState([]);
  useEffect(() => {
    const userId = localStorage.getItem('userId');
    fetch(`/api/avatars?userId=${userId}`)
      .then(res => res.json())
      .then(data => setAvatars(data.avatars || []));
  }, []);

  const handleDelete = (id) => {
    if (!window.confirm('确定要删除该虚拟人吗？')) return;
    fetch(`/api/avatars/${id}`, { method: 'DELETE' })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setAvatars(data.avatars || []);
        } else {
          alert('删除失败');
        }
      });
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">现有虚拟人</h2>
      {/* 医生虚拟人 */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-3 text-blue-600">医生虚拟人</h3>
        <ul className="space-y-2">
          {avatars.filter(a => a.type === 'doctor').map((a) => (
            <li
              key={a.id}
              className="p-4 bg-white rounded shadow flex justify-between items-center border-l-4 border-blue-500"
            >
              <div>
                <span className="font-medium">{a.name}</span>
                <span className="ml-2 text-sm text-gray-500">（专业医疗）</span>
              </div>
              <div>
                <Link to={`/avatars/${a.id}`} className="text-blue-600 hover:text-blue-800 mr-4">
                  详情
                </Link>
                <button onClick={() => handleDelete(a.id)} className="text-red-500">删除</button>
              </div>
            </li>
          ))}
        </ul>
      </div>
      {/* 亲属虚拟人 */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-3 text-green-600">亲属虚拟人</h3>
        <ul className="space-y-2">
          {avatars.filter(a => a.type === 'family').map((a) => (
            <li
              key={a.id}
              className="p-4 bg-white rounded shadow flex justify-between items-center border-l-4 border-green-500"
            >
              <div>
                <span className="font-medium">{a.name}</span>
                <span className="ml-2 text-sm text-gray-500">（情感陪伴）</span>
              </div>
              <div>
                <Link to={`/avatars/${a.id}`} className="text-green-600 hover:text-green-800 mr-4">
                  详情
                </Link>
                <button onClick={() => handleDelete(a.id)} className="text-red-500">删除</button>
              </div>
            </li>
          ))}
        </ul>
      </div>
      <Link 
        to="/avatars/add" 
        className="mt-6 inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        新增虚拟人
      </Link>
    </div>
  );
}

export default AvatarList; 
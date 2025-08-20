import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';

function PatientList() {
  const [patients, setPatients] = useState([]);
  useEffect(() => {
    const userId = localStorage.getItem('userId');
    fetch(`/api/patients?userId=${userId}`)
      .then(res => res.json())
      .then(data => setPatients(data.patients || []));
  }, []);

  const handleDelete = (id) => {
    if (!window.confirm('确定要删除该病人吗？')) return;
    fetch(`/api/patients/${id}`, { method: 'DELETE' })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setPatients(data.patients || []);
        } else {
          alert('删除失败');
        }
      });
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">现有病人</h2>
      <ul className="space-y-2">
        {patients.map((p) => (
          <li
            key={p.id}
            className="p-4 bg-white rounded shadow flex justify-between items-center"
          >
            <span>
              {p.name}（{p.age} 岁）
            </span>
            <div>
              <Link to={`/patients/${p.id}`} className="text-blue-600 mr-4">
                详情
              </Link>
              <button onClick={() => handleDelete(p.id)} className="text-red-500">删除</button>
            </div>
          </li>
        ))}
      </ul>
      <Link 
        to="/patients/add" 
        className="mt-6 inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        新增病人
      </Link>
    </div>
  );
}

export default PatientList; 
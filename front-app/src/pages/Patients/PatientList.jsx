import { Link } from 'react-router-dom';

const dummyPatients = [
  { id: 1, name: '张三', age: 70 },
  { id: 2, name: '李四', age: 65 },
];

function PatientList() {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">现有病人</h2>
      <ul className="space-y-2">
        {dummyPatients.map((p) => (
          <li
            key={p.id}
            className="p-4 bg-white rounded shadow flex justify-between"
          >
            <span>
              {p.name}（{p.age} 岁）
            </span>
            <Link to={`/patients/${p.id}`} className="text-blue-600">
              详情
            </Link>
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
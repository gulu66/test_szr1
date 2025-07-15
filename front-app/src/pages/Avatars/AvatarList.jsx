import { Link } from 'react-router-dom';

const dummyAvatars = [
  { id: 1, name: '医生虚拟人', type: 'doctor' },
  { id: 2, name: '亲属虚拟人', type: 'family' },
];

function AvatarList() {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">现有虚拟人</h2>
      
      {/* 医生虚拟人 */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-3 text-blue-600">医生虚拟人</h3>
        <ul className="space-y-2">
          {dummyAvatars.filter(a => a.type === 'doctor').map((a) => (
            <li
              key={a.id}
              className="p-4 bg-white rounded shadow flex justify-between items-center border-l-4 border-blue-500"
            >
              <div>
                <span className="font-medium">{a.name}</span>
                <span className="ml-2 text-sm text-gray-500">(专业医疗)</span>
              </div>
              <Link to={`/avatars/${a.id}`} className="text-blue-600 hover:text-blue-800">
                详情
              </Link>
            </li>
          ))}
        </ul>
      </div>

      {/* 亲属虚拟人 */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-3 text-green-600">亲属虚拟人</h3>
        <ul className="space-y-2">
          {dummyAvatars.filter(a => a.type === 'family').map((a) => (
            <li
              key={a.id}
              className="p-4 bg-white rounded shadow flex justify-between items-center border-l-4 border-green-500"
            >
              <div>
                <span className="font-medium">{a.name}</span>
                <span className="ml-2 text-sm text-gray-500">(情感陪伴)</span>
              </div>
              <Link to={`/avatars/${a.id}`} className="text-green-600 hover:text-green-800">
                详情
              </Link>
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
import { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

function PatientDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [patient, setPatient] = useState(null);
  const [memories, setMemories] = useState([]);
  const [images, setImages] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({});
  const [showMemoryForm, setShowMemoryForm] = useState(false);
  const [memoryForm, setMemoryForm] = useState({ title: '', content: '' });
  const [editMemoryId, setEditMemoryId] = useState(null);
  const [showImageForm, setShowImageForm] = useState(false);
  const [imageForm, setImageForm] = useState({ title: '', description: '', url: '' });
  const [editImageId, setEditImageId] = useState(null);

  // 获取详情
  useEffect(() => {
    const userId = Number(localStorage.getItem('userId'));
    fetch(`/api/patients/${id}?userId=${userId}`)
      .then(res => res.json())
      .then(data => {
        setPatient(data.patient);
        setMemories(data.patient.memories || []);
        setImages(data.patient.images || []);
      });
  }, [id]);

  // 编辑基本信息
  const handleEdit = () => {
    setEditForm({ ...patient });
    setIsEditing(true);
  };
  const handleEditChange = e => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };
  const handleEditSave = () => {
    fetch(`/api/patients/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(editForm)
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setPatient(data.patient);
          setIsEditing(false);
        } else {
          alert('保存失败');
        }
      });
  };

  // 删除病人
  const handleDelete = () => {
    if (!window.confirm('确定要删除该病人吗？')) return;
    const userId = Number(localStorage.getItem('userId'));
    console.log('handleDelete: patient.id =', patient?.id, 'url id =', id, 'userId =', userId);
    fetch(`/api/patients/${id}?userId=${userId}`, { method: 'DELETE' })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          alert('删除成功');
          navigate('/patients');
        } else {
          alert('删除失败');
        }
      });
  };

  // 新增/编辑回忆
  const openMemoryForm = (memory = null) => {
    if (memory) {
      setMemoryForm({ title: memory.title, content: memory.content });
      setEditMemoryId(memory.id);
    } else {
      setMemoryForm({ title: '', content: '' });
      setEditMemoryId(null);
    }
    setShowMemoryForm(true);
  };
  const handleMemoryFormChange = e => {
    setMemoryForm({ ...memoryForm, [e.target.name]: e.target.value });
  };
  const handleMemoryFormSave = () => {
    if (!memoryForm.title || !memoryForm.content) return alert('请填写完整');
    const userId = Number(localStorage.getItem('userId'));
    let newMemories;
    if (editMemoryId) {
      newMemories = memories.map(m => m.id === editMemoryId ? { ...m, ...memoryForm, userId } : { ...m, userId: m.userId ?? userId });
    } else {
      newMemories = [...memories.map(m => ({ ...m, userId: m.userId ?? userId })), { id: Date.now(), ...memoryForm, timestamp: new Date().toISOString().split('T')[0], patient_id: patient.id, userId }];
    }
    setMemories(newMemories);
    setShowMemoryForm(false);
    setEditMemoryId(null);
    fetch(`/api/patients/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ memories: newMemories, userId })
    }).then(res => res.json());
  };
  const handleMemoryDelete = idToDelete => {
    if (!window.confirm('确定要删除该回忆吗？')) return;
    const userId = Number(localStorage.getItem('userId'));
    console.log('handleMemoryDelete: patient.id =', patient?.id, 'url id =', id, 'userId =', userId);
    const newMemories = memories.filter(m => m.id !== idToDelete).map(m => ({ ...m, userId: m.userId ?? userId }));
    setMemories(newMemories);
    fetch(`/api/patients/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ memories: newMemories, userId })
    }).then(res => res.json());
  };

  // 新增/编辑图片
  const openImageForm = (img = null) => {
    if (img) {
      setImageForm({ title: img.title, description: img.description, url: img.url });
      setEditImageId(img.id);
    } else {
      setImageForm({ title: '', description: '', url: '' });
      setEditImageId(null);
    }
    setShowImageForm(true);
  };
  const handleImageFormChange = e => {
    setImageForm({ ...imageForm, [e.target.name]: e.target.value });
  };
  const handleImageFormSave = () => {
    if (!imageForm.title || !imageForm.url) return alert('请填写完整');
    const userId = Number(localStorage.getItem('userId'));
    let newImages;
    if (editImageId) {
      newImages = images.map(img => img.id === editImageId ? { ...img, ...imageForm, userId } : { ...img, userId: img.userId ?? userId });
    } else {
      newImages = [...images.map(img => ({ ...img, userId: img.userId ?? userId })), { id: Date.now(), ...imageForm, timestamp: new Date().toISOString().split('T')[0], patient_id: patient.id, userId }];
    }
    setImages(newImages);
    setShowImageForm(false);
    setEditImageId(null);
    fetch(`/api/patients/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ images: newImages, userId })
    }).then(res => res.json());
  };
  const handleImageDelete = idToDelete => {
    if (!window.confirm('确定要删除该图片吗？')) return;
    const userId = Number(localStorage.getItem('userId'));
    console.log('handleImageDelete: patient.id =', patient?.id, 'url id =', id, 'userId =', userId);
    const newImages = images.filter(img => img.id !== idToDelete).map(img => ({ ...img, userId: img.userId ?? userId }));
    setImages(newImages);
    fetch(`/api/patients/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ images: newImages, userId })
    }).then(res => res.json());
  };

  const handleImageFileChange = e => {
    const file = e.target.files[0];
    if (file) {
      const reader = new window.FileReader();
      reader.onload = (ev) => {
        setImageForm(prev => ({ ...prev, url: ev.target.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  if (!patient) return <div>加载中...</div>;

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">病人 #{id} 详情</h2>
      {isEditing ? (
        <div className="space-y-2 mb-4">
          <input name="name" value={editForm.name} onChange={handleEditChange} className="border px-2 py-1" placeholder="姓名" />
          <select name="gender" value={editForm.gender} onChange={handleEditChange} className="border px-2 py-1">
            <option value="男">男</option>
            <option value="女">女</option>
          </select>
          <input name="age" type="number" value={editForm.age} onChange={handleEditChange} className="border px-2 py-1" placeholder="年龄" />
          <input name="medicalHistory" value={editForm.medicalHistory} onChange={handleEditChange} className="border px-2 py-1" placeholder="病史" />
          <button onClick={handleEditSave} className="bg-blue-600 text-white px-3 py-1 rounded">保存</button>
          <button onClick={() => setIsEditing(false)} className="ml-2 px-3 py-1">取消</button>
        </div>
      ) : (
        <div className="mb-4">
          <p>姓名：{patient.name}</p>
          <p>性别：{patient.gender}</p>
          <p>年龄：{patient.age}</p>
          <p>病史：{patient.medicalHistory}</p>
          <button onClick={handleEdit} className="bg-blue-600 text-white px-3 py-1 rounded">编辑</button>
          <button onClick={handleDelete} className="ml-2 bg-red-500 text-white px-3 py-1 rounded">删除</button>
        </div>
      )}
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2">回忆</h3>
        {memories.length === 0 ? <p>暂无回忆</p> : (
          <ul className="space-y-2">
            {memories.map(m => (
              <li key={m.id} className="bg-white p-3 rounded shadow flex justify-between items-center">
                <div>
                  <div className="font-bold">{m.title}</div>
                  <div>{m.content}</div>
                </div>
                <div>
                  <button onClick={() => openMemoryForm(m)} className="text-blue-600 mr-2">编辑</button>
                  <button onClick={() => handleMemoryDelete(m.id)} className="text-red-500">删除</button>
                </div>
              </li>
            ))}
          </ul>
        )}
        <button onClick={() => openMemoryForm()} className="mt-2 bg-green-600 text-white px-3 py-1 rounded">新增回忆</button>
        {showMemoryForm && (
          <div className="mt-2 p-3 border rounded bg-gray-50">
            <input name="title" value={memoryForm.title} onChange={handleMemoryFormChange} className="border px-2 py-1 mr-2" placeholder="标题" />
            <input name="content" value={memoryForm.content} onChange={handleMemoryFormChange} className="border px-2 py-1 mr-2" placeholder="内容" />
            <button onClick={handleMemoryFormSave} className="bg-blue-600 text-white px-3 py-1 rounded">保存</button>
            <button onClick={() => setShowMemoryForm(false)} className="ml-2 px-3 py-1">取消</button>
          </div>
        )}
      </div>
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2">图片</h3>
        {images.length === 0 ? <p>暂无图片</p> : (
          <ul className="space-y-2">
            {images.map(img => (
              <li key={img.id} className="bg-white p-3 rounded shadow flex justify-between items-center">
                <div>
                  <div className="font-bold">{img.title}</div>
                  <div>{img.description}</div>
                  <img src={img.url} alt={img.title} className="w-32 h-20 object-cover mt-1" />
                </div>
                <div>
                  <button onClick={() => openImageForm(img)} className="text-blue-600 mr-2">编辑</button>
                  <button onClick={() => handleImageDelete(img.id)} className="text-red-500">删除</button>
                </div>
              </li>
            ))}
          </ul>
        )}
        <button onClick={() => openImageForm()} className="mt-2 bg-green-600 text-white px-3 py-1 rounded">新增图片</button>
        {showImageForm && (
          <div className="mt-2 p-3 border rounded bg-gray-50">
            <input name="title" value={imageForm.title} onChange={handleImageFormChange} className="border px-2 py-1 mr-2" placeholder="标题" />
            <input name="description" value={imageForm.description} onChange={handleImageFormChange} className="border px-2 py-1 mr-2" placeholder="描述" />
            <input name="url" value={imageForm.url} onChange={handleImageFormChange} className="border px-2 py-1 mr-2" placeholder="图片URL（可上传或粘贴）" />
            <input type="file" accept="image/*" onChange={handleImageFileChange} className="border px-2 py-1 mr-2" />
            <button onClick={handleImageFormSave} className="bg-blue-600 text-white px-3 py-1 rounded">保存</button>
            <button onClick={() => setShowImageForm(false)} className="ml-2 px-3 py-1">取消</button>
          </div>
        )}
      </div>
    </div>
  );
}

export default PatientDetail; 
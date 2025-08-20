import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function PatientAdd() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    gender: '男',
    age: '',
    medicalHistory: ''
  });
  const [memories, setMemories] = useState([]);
  const [images, setImages] = useState([]);
  const [memoryForm, setMemoryForm] = useState({ title: '', content: '' });
  const [imageForm, setImageForm] = useState({ title: '', description: '', url: '' });

  // 基本信息表单
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // 回忆
  const handleMemoryFormChange = e => {
    setMemoryForm({ ...memoryForm, [e.target.name]: e.target.value });
  };
  const handleAddMemory = () => {
    if (!memoryForm.title || !memoryForm.content) return alert('请填写完整');
    setMemories([...memories, { ...memoryForm, id: Date.now(), timestamp: new Date().toISOString().split('T')[0] }]);
    setMemoryForm({ title: '', content: '' });
  };
  const handleDeleteMemory = id => {
    setMemories(memories.filter(m => m.id !== id));
  };

  // 图片
  const handleImageFormChange = e => {
    setImageForm({ ...imageForm, [e.target.name]: e.target.value });
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
  const handleAddImage = () => {
    if (!imageForm.title || !imageForm.url) return alert('请填写完整');
    setImages([...images, { ...imageForm, id: Date.now(), timestamp: new Date().toISOString().split('T')[0] }]);
    setImageForm({ title: '', description: '', url: '' });
  };
  const handleDeleteImage = id => {
    setImages(images.filter(img => img.id !== id));
  };

  // 提交
  const handleSubmit = (e) => {
    e.preventDefault();
    // 自动将未添加但已填写的回忆和图片加入数组
    const userId = Number(localStorage.getItem('userId'));
    let submitMemories = memories;
    if (memoryForm.title && memoryForm.content) {
      submitMemories = [
        ...memories,
        { ...memoryForm, id: Date.now(), timestamp: new Date().toISOString().split('T')[0], userId }
      ];
    } else {
      submitMemories = memories.map(m => ({ ...m, userId: m.userId ?? userId }));
    }
    let submitImages = images;
    if (imageForm.title && imageForm.url) {
      submitImages = [
        ...images,
        { ...imageForm, id: Date.now(), timestamp: new Date().toISOString().split('T')[0], userId }
      ];
    } else {
      submitImages = images.map(img => ({ ...img, userId: img.userId ?? userId }));
    }
    fetch('/api/patients', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: formData.name,
        gender: formData.gender,
        age: formData.age,
        medicalHistory: formData.medicalHistory,
        memories: submitMemories,
        images: submitImages,
        userId: userId
      })
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          alert('病人信息保存成功！');
          navigate('/patients');
        } else {
          alert('保存失败');
        }
      })
      .catch(() => {
        alert('网络错误');
      });
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">新增病人</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">姓名 *</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="请输入病人姓名"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">性别</label>
          <select
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="男">男</option>
            <option value="女">女</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">年龄 *</label>
          <input
            type="number"
            name="age"
            value={formData.age}
            onChange={handleChange}
            required
            min="0"
            max="150"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="请输入年龄"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">病史</label>
          <textarea
            name="medicalHistory"
            value={formData.medicalHistory}
            onChange={handleChange}
            rows="4"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="请输入病史信息"
          />
        </div>
        {/* 回忆 */}
        <div className="mb-4">
          <h3 className="text-lg font-semibold mb-2">回忆</h3>
          {memories.length === 0 ? <p className="text-gray-400">暂无回忆</p> : (
            <ul className="space-y-2">
              {memories.map(m => (
                <li key={m.id} className="bg-white p-3 rounded shadow flex justify-between items-center">
                  <div>
                    <div className="font-bold">{m.title}</div>
                    <div>{m.content}</div>
                  </div>
                  <button onClick={() => handleDeleteMemory(m.id)} type="button" className="text-red-500">删除</button>
                </li>
              ))}
            </ul>
          )}
          <div className="flex space-x-2 mt-2">
            <input name="title" value={memoryForm.title} onChange={handleMemoryFormChange} className="border px-2 py-1" placeholder="标题" />
            <input name="content" value={memoryForm.content} onChange={handleMemoryFormChange} className="border px-2 py-1" placeholder="内容" />
            <button type="button" onClick={handleAddMemory} className="bg-blue-600 text-white px-3 py-1 rounded">添加回忆</button>
          </div>
        </div>
        {/* 图片 */}
        <div className="mb-4">
          <h3 className="text-lg font-semibold mb-2">图片</h3>
          {images.length === 0 ? <p className="text-gray-400">暂无图片</p> : (
            <ul className="space-y-2">
              {images.map(img => (
                <li key={img.id} className="bg-white p-3 rounded shadow flex justify-between items-center">
                  <div>
                    <div className="font-bold">{img.title}</div>
                    <div>{img.description}</div>
                    <img src={img.url} alt={img.title} className="w-32 h-20 object-cover mt-1" />
                  </div>
                  <button onClick={() => handleDeleteImage(img.id)} type="button" className="text-red-500">删除</button>
                </li>
              ))}
            </ul>
          )}
          <div className="flex space-x-2 mt-2">
            <input name="title" value={imageForm.title} onChange={handleImageFormChange} className="border px-2 py-1" placeholder="标题" />
            <input name="description" value={imageForm.description} onChange={handleImageFormChange} className="border px-2 py-1" placeholder="描述" />
            <input name="url" value={imageForm.url} onChange={handleImageFormChange} className="border px-2 py-1" placeholder="图片URL（可上传或粘贴）" />
            <input type="file" accept="image/*" onChange={handleImageFileChange} className="border px-2 py-1" />
            <button type="button" onClick={handleAddImage} className="bg-blue-600 text-white px-3 py-1 rounded">添加图片</button>
          </div>
        </div>
        <div className="flex space-x-4 pt-4">
          <button
            type="submit"
            className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            保存
          </button>
          <button
            type="button"
            onClick={() => navigate('/patients')}
            className="bg-gray-300 text-gray-700 px-6 py-2 rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500"
          >
            取消
          </button>
        </div>
      </form>
    </div>
  );
}

export default PatientAdd; 
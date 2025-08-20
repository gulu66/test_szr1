import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

function AvatarDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [avatar, setAvatar] = useState(null);
  const [images, setImages] = useState([]);
  const [voices, setVoices] = useState([]);
  const [agents, setAgents] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({});
  const [showImageForm, setShowImageForm] = useState(false);
  const [imageForm, setImageForm] = useState({ name: '', url: '', description: '' });
  const [editImageId, setEditImageId] = useState(null);
  const [showVoiceForm, setShowVoiceForm] = useState(false);
  const [voiceForm, setVoiceForm] = useState({ name: '', audio_url: '', description: '' });
  const [editVoiceId, setEditVoiceId] = useState(null);
  const [showAgentForm, setShowAgentForm] = useState(false);
  const [agentForm, setAgentForm] = useState({ name: '', description: '' });
  const [editAgentId, setEditAgentId] = useState(null);

  // 获取详情
  useEffect(() => {
    fetch(`/api/avatars/${id}`)
      .then(res => res.json())
      .then(data => {
        setAvatar(data.avatar);
        setImages(data.images || []);
        setVoices(data.voices || []);
        setAgents(data.agents || []);
      });
  }, [id]);

  // 编辑基本信息
  const handleEdit = () => {
    setEditForm({ ...avatar });
    setIsEditing(true);
  };
  const handleEditChange = e => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };
  const handleEditSave = () => {
    fetch(`/api/avatars/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(editForm)
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          // 保存后重新获取详情，确保所有数据刷新
          fetch(`/api/avatars/${id}`)
            .then(res => res.json())
            .then(data => {
              setAvatar(data.avatar);
              setImages(data.images || []);
              setVoices(data.voices || []);
              setAgents(data.agents || []);
              setIsEditing(false);
            });
        } else {
          alert('保存失败');
        }
      });
  };

  // 删除虚拟人
  const handleDelete = () => {
    if (!window.confirm('确定要删除该虚拟人吗？')) return;
    fetch(`/api/avatars/${id}`, { method: 'DELETE' })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          alert('删除成功');
          navigate('/avatars');
        } else {
          alert('删除失败');
        }
      });
  };

  // 新增/编辑图片
  const openImageForm = (img = null) => {
    if (img) {
      setImageForm({ name: img.name, url: img.url, description: img.description });
      setEditImageId(img.id);
    } else {
      setImageForm({ name: '', url: '', description: '' });
      setEditImageId(null);
    }
    setShowImageForm(true);
  };
  const handleImageFormChange = e => {
    setImageForm({ ...imageForm, [e.target.name]: e.target.value });
  };
  const handleImageFormSave = () => {
    if (!imageForm.name || !imageForm.url) return alert('请填写完整');
    let newImages;
    if (editImageId) {
      newImages = images.map(img => img.id === editImageId ? { ...img, ...imageForm, avatar_id: Number(id) } : { ...img, avatar_id: img.avatar_id ?? Number(id) });
    } else {
      newImages = [...images.map(img => ({ ...img, avatar_id: img.avatar_id ?? Number(id) })), { id: Date.now(), ...imageForm, avatar_id: Number(id) }];
    }
    setImages(newImages);
    setShowImageForm(false);
    setEditImageId(null);
    fetch(`/api/avatars/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ images: newImages })
    }).then(res => res.json())
      .then(() => {
        fetch(`/api/avatars/${id}`)
          .then(res => res.json())
          .then(data => {
            setAvatar(data.avatar);
            setImages(data.images || []);
            setVoices(data.voices || []);
            setAgents(data.agents || []);
          });
      });
  };
  const handleImageDelete = idToDelete => {
    if (!window.confirm('确定要删除该图片吗？')) return;
    const newImages = images.filter(img => img.id !== idToDelete).map(img => ({ ...img, avatar_id: img.avatar_id ?? Number(id) }));
    setImages(newImages);
    fetch(`/api/avatars/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ images: newImages })
    }).then(res => res.json())
      .then(() => {
        fetch(`/api/avatars/${id}`)
          .then(res => res.json())
          .then(data => {
            setAvatar(data.avatar);
            setImages(data.images || []);
            setVoices(data.voices || []);
            setAgents(data.agents || []);
          });
      });
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

  // 新增/编辑声音
  const openVoiceForm = (voice = null) => {
    if (voice) {
      setVoiceForm({ name: voice.name, audio_url: voice.audio_url, description: voice.description });
      setEditVoiceId(voice.id);
    } else {
      setVoiceForm({ name: '', audio_url: '', description: '' });
      setEditVoiceId(null);
    }
    setShowVoiceForm(true);
  };
  const handleVoiceFormChange = e => {
    setVoiceForm({ ...voiceForm, [e.target.name]: e.target.value });
  };
  const handleVoiceFormSave = () => {
    if (!voiceForm.name || !voiceForm.audio_url) return alert('请填写完整');
    let newVoices;
    if (editVoiceId) {
      newVoices = voices.map(v => v.id === editVoiceId ? { ...v, ...voiceForm, avatar_id: Number(id) } : { ...v, avatar_id: v.avatar_id ?? Number(id) });
    } else {
      newVoices = [...voices.map(v => ({ ...v, avatar_id: v.avatar_id ?? Number(id) })), { id: Date.now(), ...voiceForm, avatar_id: Number(id) }];
    }
    // 过滤掉无效项，id 唯一
    newVoices = newVoices.filter(v => v.name && v.audio_url);
    const idSet = new Set();
    newVoices = newVoices.filter(v => {
      if (idSet.has(v.id)) return false;
      idSet.add(v.id);
      return true;
    });
    setVoices(newVoices);
    setShowVoiceForm(false);
    setEditVoiceId(null);
    fetch(`/api/avatars/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ voices: newVoices })
    }).then(res => res.json())
      .then(() => {
        fetch(`/api/avatars/${id}`)
          .then(res => res.json())
          .then(data => {
            setAvatar(data.avatar);
            setImages(data.images || []);
            setVoices(data.voices || []);
            setAgents(data.agents || []);
            console.log('voices after update:', data.voices);
          });
      });
  };
  const handleVoiceDelete = idToDelete => {
    if (!window.confirm('确定要删除该声音吗？')) return;
    let newVoices = voices.filter(v => v.id !== idToDelete).map(v => ({ ...v, avatar_id: v.avatar_id ?? Number(id) }));
    // 过滤掉无效项，id 唯一
    newVoices = newVoices.filter(v => v.name && v.audio_url);
    const idSet = new Set();
    newVoices = newVoices.filter(v => {
      if (idSet.has(v.id)) return false;
      idSet.add(v.id);
      return true;
    });
    setVoices(newVoices);
    fetch(`/api/avatars/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ voices: newVoices })
    }).then(res => res.json())
      .then(() => {
        fetch(`/api/avatars/${id}`)
          .then(res => res.json())
          .then(data => {
            setAvatar(data.avatar);
            setImages(data.images || []);
            setVoices(data.voices || []);
            setAgents(data.agents || []);
            console.log('voices after delete:', data.voices);
          });
      });
  };

  const handleVoiceFileChange = e => {
    const file = e.target.files[0];
    if (file) {
      const audioUrl = URL.createObjectURL(file);
      setVoiceForm(prev => ({ ...prev, audio_url: audioUrl }));
    }
  };

  // 新增/编辑Agent
  const openAgentForm = (agent = null) => {
    if (agent) {
      setAgentForm({ name: agent.name, description: agent.description });
      setEditAgentId(agent.id);
    } else {
      setAgentForm({ name: '', description: '' });
      setEditAgentId(null);
    }
    setShowAgentForm(true);
  };
  const handleAgentFormChange = e => {
    setAgentForm({ ...agentForm, [e.target.name]: e.target.value });
  };
  const handleAgentFormSave = () => {
    if (!agentForm.name) return alert('请填写完整');
    let newAgents;
    if (editAgentId) {
      newAgents = agents.map(a => a.id === editAgentId ? { ...a, ...agentForm } : a);
    } else {
      newAgents = [...agents, { id: Date.now(), ...agentForm }];
    }
    setAgents(newAgents);
    setShowAgentForm(false);
    setEditAgentId(null);
    // 同步到后端
    fetch(`/api/avatars/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ current_agent: agentForm.name })
    }).then(res => res.json())
      .then(() => {
        fetch(`/api/avatars/${id}`)
          .then(res => res.json())
          .then(data => {
            setAvatar(data.avatar);
            setImages(data.images || []);
            setVoices(data.voices || []);
            setAgents(data.agents || []);
          });
      });
  };
  const handleAgentDelete = id => {
    if (!window.confirm('确定要删除该Agent吗？')) return;
    const remain = agents.filter(a => a.id !== id);
    setAgents(remain);
    // 同步到后端（删除后传空）
    fetch(`/api/avatars/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ current_agent: '' })
    }).then(res => res.json())
      .then(() => {
        fetch(`/api/avatars/${id}`)
          .then(res => res.json())
          .then(data => {
            setAvatar(data.avatar);
            setImages(data.images || []);
            setVoices(data.voices || []);
            setAgents(data.agents || []);
          });
      });
  };

  if (!avatar) return <div>加载中...</div>;

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">虚拟人 #{id} 详情</h2>
      {isEditing ? (
        <div className="space-y-2 mb-4">
          <input name="name" value={editForm.name} onChange={handleEditChange} className="border px-2 py-1" placeholder="名称" />
          <input name="description" value={editForm.description} onChange={handleEditChange} className="border px-2 py-1" placeholder="描述" />
          <button onClick={handleEditSave} className="bg-blue-600 text-white px-3 py-1 rounded">保存</button>
          <button onClick={() => setIsEditing(false)} className="ml-2 px-3 py-1">取消</button>
        </div>
      ) : (
        <div className="mb-4">
          <p>名称：{avatar.name}</p>
          <p>描述：{avatar.description}</p>
          <button onClick={handleEdit} className="bg-blue-600 text-white px-3 py-1 rounded">编辑</button>
          <button onClick={handleDelete} className="ml-2 bg-red-500 text-white px-3 py-1 rounded">删除</button>
        </div>
      )}
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2">形象图片</h3>
        {images.length === 0 ? <p>暂无图片</p> : (
          <ul className="space-y-2">
            {images.map(img => (
              <li key={img.id} className="bg-white p-3 rounded shadow flex justify-between items-center">
                <div>
                  <div className="font-bold">{img.name}</div>
                  <div>{img.description}</div>
                  <img src={img.url} alt={img.name} className="w-32 h-20 object-cover mt-1" />
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
            <input name="name" value={imageForm.name} onChange={handleImageFormChange} className="border px-2 py-1 mr-2" placeholder="名称" />
            <input name="description" value={imageForm.description} onChange={handleImageFormChange} className="border px-2 py-1 mr-2" placeholder="描述" />
            <input name="url" value={imageForm.url} onChange={handleImageFormChange} className="border px-2 py-1 mr-2" placeholder="图片URL（可上传或粘贴）" />
            <input type="file" accept="image/*" onChange={handleImageFileChange} className="border px-2 py-1 mr-2" />
            <button onClick={handleImageFormSave} className="bg-blue-600 text-white px-3 py-1 rounded">保存</button>
            <button onClick={() => setShowImageForm(false)} className="ml-2 px-3 py-1">取消</button>
          </div>
        )}
      </div>
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2">声音</h3>
        {console.log('voices render:', voices)}
        {voices.length === 0 ? <p>暂无声音</p> : (
          <ul className="space-y-2">
            {voices.map(voice => (
              <li key={voice.id} className="bg-white p-3 rounded shadow flex justify-between items-center">
                <div>
                  <div className="font-bold">{voice.name}</div>
                  <div>{voice.description}</div>
                  <audio src={voice.audio_url} controls className="mt-1" />
                </div>
                <div>
                  <button onClick={() => openVoiceForm(voice)} className="text-blue-600 mr-2">编辑</button>
                  <button onClick={() => handleVoiceDelete(voice.id)} className="text-red-500">删除</button>
                </div>
              </li>
            ))}
          </ul>
        )}
        <button onClick={() => openVoiceForm()} className="mt-2 bg-green-600 text-white px-3 py-1 rounded">新增声音</button>
        {showVoiceForm && (
          <div className="mt-2 p-3 border rounded bg-gray-50">
            <input name="name" value={voiceForm.name} onChange={handleVoiceFormChange} className="border px-2 py-1 mr-2" placeholder="名称" />
            <input name="description" value={voiceForm.description} onChange={handleVoiceFormChange} className="border px-2 py-1 mr-2" placeholder="描述" />
            <input name="audio_url" value={voiceForm.audio_url} onChange={handleVoiceFormChange} className="border px-2 py-1 mr-2" placeholder="音频URL（可上传或粘贴）" />
            <input type="file" accept="audio/*" onChange={handleVoiceFileChange} className="border px-2 py-1 mr-2" />
            <button onClick={handleVoiceFormSave} className="bg-blue-600 text-white px-3 py-1 rounded">保存</button>
            <button onClick={() => setShowVoiceForm(false)} className="ml-2 px-3 py-1">取消</button>
          </div>
        )}
      </div>
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2">Agent</h3>
        {agents.length === 0 ? <p>暂无Agent</p> : (
          <ul className="space-y-2">
            {agents.map(agent => (
              <li key={agent.id} className="bg-white p-3 rounded shadow flex justify-between items-center">
                <div>
                  <div className="font-bold">{agent.name}</div>
                  <div>{agent.description}</div>
                </div>
                <div>
                  <button onClick={() => openAgentForm(agent)} className="text-blue-600 mr-2">编辑</button>
                  <button onClick={() => handleAgentDelete(agent.id)} className="text-red-500">删除</button>
                </div>
              </li>
            ))}
          </ul>
        )}
        <button onClick={() => openAgentForm()} className="mt-2 bg-green-600 text-white px-3 py-1 rounded">新增Agent</button>
        {showAgentForm && (
          <div className="mt-2 p-3 border rounded bg-gray-50">
            <input name="name" value={agentForm.name} onChange={handleAgentFormChange} className="border px-2 py-1 mr-2" placeholder="名称" />
            <input name="description" value={agentForm.description} onChange={handleAgentFormChange} className="border px-2 py-1 mr-2" placeholder="描述" />
            <button onClick={handleAgentFormSave} className="bg-blue-600 text-white px-3 py-1 rounded">保存</button>
            <button onClick={() => setShowAgentForm(false)} className="ml-2 px-3 py-1">取消</button>
          </div>
        )}
      </div>
    </div>
  );
}

export default AvatarDetail; 
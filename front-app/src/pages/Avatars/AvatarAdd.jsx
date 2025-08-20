import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function AvatarAdd() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    type: 'doctor',
    name: '',
    description: '',
    imageModel: '',
    voiceModel: '',
    agentModel: ''
  });
  // 新增：本地图片、音频、Agent自定义
  const [localImage, setLocalImage] = useState('');
  const [localVoice, setLocalVoice] = useState('');
  const [customAgent, setCustomAgent] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // 处理本地图片上传
  const handleImageFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new window.FileReader();
      reader.onload = (ev) => {
        setLocalImage(ev.target.result);
      };
      reader.readAsDataURL(file);
    }
  };
  // 处理本地音频上传
  const handleVoiceFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new window.FileReader();
      reader.onload = (ev) => {
        setLocalVoice(ev.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // 提交时优先本地/自定义
  const handleSubmit = (e) => {
    e.preventDefault();
    const submitData = {
      ...formData,
      imageModel: localImage || formData.imageModel,
      voiceModel: localVoice || formData.voiceModel,
      agentModel: customAgent || formData.agentModel
    };
    const userId = Number(localStorage.getItem('userId'));
    fetch('/api/avatars', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: submitData.name,
        description: submitData.description,
        imageModel: submitData.imageModel,
        voiceModel: submitData.voiceModel,
        agentModel: submitData.agentModel,
        type: submitData.type,
        userId: userId
      })
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          alert('虚拟人信息保存成功！');
          navigate('/avatars');
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
      <h2 className="text-2xl font-bold mb-6">新增虚拟人</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">类型 *</label>
          <select
            name="type"
            value={formData.type}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="doctor">医生虚拟人</option>
            <option value="family">亲属虚拟人</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">名称 *</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="请输入虚拟人名称"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">描述</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows="3"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="请输入虚拟人描述"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">形象图片</label>
          <select
            name="imageModel"
            value={formData.imageModel}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={!!localImage}
          >
            <option value="">请选择形象图片</option>
            {formData.type === 'doctor' ? (
              <>
                <option value="image_1">形象 1</option>
                <option value="image_2">形象 2</option>
                <option value="image_3">形象 3</option>
              </>
            ) : (
              <>
                <option value="family_image_1">形象 1</option>
                <option value="family_image_2">形象 2</option>
                <option value="family_image_3">形象 3</option>
              </>
            )}
          </select>
          <input type="file" accept="image/*" onChange={handleImageFileChange} className="mt-2" />
          {localImage && <img src={localImage} alt="预览" className="w-32 h-20 object-cover mt-2" />}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">声音</label>
          <select
            name="voiceModel"
            value={formData.voiceModel}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={!!localVoice}
          >
            <option value="">请选择声音</option>
            {formData.type === 'doctor' ? (
              <>
                <option value="voice_1">声音 1</option>
                <option value="voice_2">声音 2</option>
                <option value="voice_3">声音 3</option>
              </>
            ) : (
              <>
                <option value="family_voice_1">声音 1</option>
                <option value="family_voice_2">声音 2</option>
                <option value="family_voice_3">声音 3</option>
              </>
            )}
          </select>
          <input type="file" accept="audio/*" onChange={handleVoiceFileChange} className="mt-2" />
          {localVoice && <audio src={localVoice} controls className="mt-2" />}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Agent</label>
          <select
            name="agentModel"
            value={formData.agentModel}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={!!customAgent}
          >
            <option value="">请选择Agent</option>
            {formData.type === 'doctor' ? (
              <>
                <option value="agent_1">Agent 1</option>
                <option value="agent_2">Agent 2</option>
                <option value="agent_3">Agent 3</option>
              </>
            ) : (
              <>
                <option value="family_agent_1">Agent 1</option>
                <option value="family_agent_2">Agent 2</option>
                <option value="family_agent_3">Agent 3</option>
              </>
            )}
          </select>
          <input
            type="text"
            value={customAgent}
            onChange={e => setCustomAgent(e.target.value)}
            placeholder="自定义Agent名称/描述"
            className="mt-2 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
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
            onClick={() => navigate('/avatars')}
            className="bg-gray-300 text-gray-700 px-6 py-2 rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500"
          >
            取消
          </button>
        </div>
      </form>
    </div>
  );
}

export default AvatarAdd; 
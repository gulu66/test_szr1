import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function AvatarAdd() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    imageModel: '',
    voiceModel: '',
    agentModel: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: 这里应该调用API保存数据
    console.log('新增虚拟人数据:', formData);
    
    // 模拟保存成功，跳转到虚拟人列表
    alert('虚拟人信息保存成功！');
    navigate('/avatars');
  };

  const handleCancel = () => {
    navigate('/avatars');
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">新增虚拟人</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            名称 *
          </label>
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
          <label className="block text-sm font-medium text-gray-700 mb-1">
            描述
          </label>
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
          <label className="block text-sm font-medium text-gray-700 mb-1">
            形象图片
          </label>
          <select
            name="imageModel"
            value={formData.imageModel}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">请选择形象图片</option>
            <option value="image_1">形象 1</option>
            <option value="image_2">形象 2</option>
            <option value="image_3">形象 3</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            声音
          </label>
          <select
            name="voiceModel"
            value={formData.voiceModel}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">请选择声音</option>
            <option value="voice_1">声音 1</option>
            <option value="voice_2">声音 2</option>
            <option value="voice_3">声音 3</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Agent
          </label>
          <select
            name="agentModel"
            value={formData.agentModel}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">请选择Agent</option>
            <option value="agent_1">Agent 1</option>
            <option value="agent_2">Agent 2</option>
            <option value="agent_3">Agent 3</option>
          </select>
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
            onClick={handleCancel}
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
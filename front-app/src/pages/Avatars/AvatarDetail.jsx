import { useState, useRef } from 'react';
import { useParams } from 'react-router-dom';

// 模拟虚拟人数据
const mockAvatarData = {
  id: 1,
  name: '医生虚拟人',
  type: 'doctor',
  description: '专业的医疗虚拟人，具备丰富的医学知识和临床经验，能够为病人提供专业的医疗咨询和健康指导。',
  currentImage: 'image_1',
  currentVoice: 'voice_1',
  currentAgent: 'agent_1'
};

// 模拟亲属虚拟人数据
const mockFamilyAvatarData = {
  id: 2,
  name: '亲属虚拟人',
  type: 'family',
  description: '模拟病人亲人的虚拟形象，提供情感支持和陪伴，帮助病人缓解孤独感和焦虑情绪。',
  currentImage: 'family_image_1',
  currentVoice: 'family_voice_1',
  currentAgent: 'family_agent_1'
};

// 医生形象图片数据
const doctorImageOptions = [
  { id: 'image_1', name: '内科医生', url: 'https://via.placeholder.com/300x400/4F46E5/FFFFFF?text=内科医生', description: '中年男性医生，戴眼镜，穿着白大褂，专业严谨' },
  { id: 'image_2', name: '外科医生', url: 'https://via.placeholder.com/300x400/10B981/FFFFFF?text=外科医生', description: '中年女性医生，自信表情，穿着手术服，技术精湛' },
  { id: 'image_3', name: '儿科医生', url: 'https://via.placeholder.com/300x400/F59E0B/FFFFFF?text=儿科医生', description: '年轻男性医生，亲和力强，穿着彩色工作服，耐心细致' },
  { id: 'image_4', name: '老年科医生', url: 'https://via.placeholder.com/300x400/EF4444/FFFFFF?text=老年科医生', description: '资深女性医生，温和笑容，穿着白大褂，经验丰富' }
];

// 亲属形象图片数据
const familyImageOptions = [
  { id: 'family_image_1', name: '儿子形象', url: 'https://via.placeholder.com/300x400/4F46E5/FFFFFF?text=儿子形象', description: '中年男性，温和表情，穿着休闲装，亲切关怀' },
  { id: 'family_image_2', name: '女儿形象', url: 'https://via.placeholder.com/300x400/10B981/FFFFFF?text=女儿形象', description: '中年女性，温柔笑容，亲切形象，充满关爱' },
  { id: 'family_image_3', name: '孙子形象', url: 'https://via.placeholder.com/300x400/F59E0B/FFFFFF?text=孙子形象', description: '年轻男性，活力充沛，阳光形象，充满朝气' },
  { id: 'family_image_4', name: '孙女形象', url: 'https://via.placeholder.com/300x400/EF4444/FFFFFF?text=孙女形象', description: '年轻女性，甜美可爱，活泼形象，温馨陪伴' }
];

// 医生声音数据
const doctorVoiceOptions = [
  { id: 'voice_1', name: '专业男声', audioUrl: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav', description: '温和的男声，语速适中，专业严谨' },
  { id: 'voice_2', name: '专业女声', audioUrl: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav', description: '清晰的女声，语调专业，权威感强' },
  { id: 'voice_3', name: '年轻男声', audioUrl: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav', description: '年轻男声，活力充沛，亲和力强' },
  { id: 'voice_4', name: '温和女声', audioUrl: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav', description: '温柔女声，语调柔和，耐心细致' }
];

// 亲属声音数据
const familyVoiceOptions = [
  { id: 'family_voice_1', name: '儿子声音', audioUrl: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav', description: '温和的男声，语速适中，亲切关怀' },
  { id: 'family_voice_2', name: '女儿声音', audioUrl: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav', description: '温柔的女声，语调柔和，充满关爱' },
  { id: 'family_voice_3', name: '孙子声音', audioUrl: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav', description: '年轻男声，活力充沛，充满朝气' },
  { id: 'family_voice_4', name: '孙女声音', audioUrl: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav', description: '甜美女声，语调轻快，活泼可爱' }
];

// 医生Agent数据
const doctorAgentOptions = [
  { id: 'agent_1', name: '内科专家', description: '擅长高血压、糖尿病、心脏病等慢性病管理和治疗' },
  { id: 'agent_2', name: '神经科专家', description: '专注于认知障碍、阿尔茨海默病等神经系统疾病诊断和治疗' },
  { id: 'agent_3', name: '康复科专家', description: '擅长康复训练、功能恢复和运动疗法指导' },
  { id: 'agent_4', name: '心理咨询师', description: '提供心理健康评估、心理治疗和情绪管理指导' }
];

// 亲属Agent数据
const familyAgentOptions = [
  { id: 'family_agent_1', name: '关怀陪伴型', description: '专注于情感陪伴和日常关怀，提供温暖的家庭氛围' },
  { id: 'family_agent_2', name: '生活照料型', description: '关注日常生活照料，提醒服药、饮食、运动等' },
  { id: 'family_agent_3', name: '娱乐互动型', description: '提供娱乐活动，如聊天、游戏、音乐等互动' },
  { id: 'family_agent_4', name: '心理支持型', description: '提供心理安慰和情绪支持，缓解孤独和焦虑' }
];

function AvatarDetail() {
  const { id } = useParams();
  
  // 根据ID选择对应的虚拟人数据
  const getAvatarData = () => {
    if (id === '1') return mockAvatarData;
    if (id === '2') return mockFamilyAvatarData;
    return mockAvatarData; // 默认返回医生虚拟人
  };
  
  const [avatarData, setAvatarData] = useState(getAvatarData());
  const [isEditing, setIsEditing] = useState(false);
  const [selectedImage, setSelectedImage] = useState(avatarData.currentImage);
  const [selectedVoice, setSelectedVoice] = useState(avatarData.currentVoice);
  const [selectedAgent, setSelectedAgent] = useState(avatarData.currentAgent);
  const [isPlaying, setIsPlaying] = useState(false);
  const [editingImage, setEditingImage] = useState({});
  const [editingVoice, setEditingVoice] = useState({});
  const [editingAgent, setEditingAgent] = useState({});
  const audioRef = useRef(null);
  const fileInputRef = useRef(null);
  const voiceFileInputRef = useRef(null);

  const handleImageChange = (imageId) => {
    setSelectedImage(imageId);
  };

  const handleVoiceChange = (voiceId) => {
    setSelectedVoice(voiceId);
  };

  const handleAgentChange = (agentId) => {
    setSelectedAgent(agentId);
  };

  const handleSaveChanges = () => {
    setAvatarData(prev => ({
      ...prev,
      currentImage: selectedImage,
      currentVoice: selectedVoice,
      currentAgent: selectedAgent
    }));
    setIsEditing(false);
  };

  const handleCancelChanges = () => {
    setSelectedImage(avatarData.currentImage);
    setSelectedVoice(avatarData.currentVoice);
    setSelectedAgent(avatarData.currentAgent);
    setEditingImage({});
    setEditingVoice({});
    setEditingAgent({});
    setIsEditing(false);
  };

  const handleEditImage = (imageId, field, value) => {
    setEditingImage(prev => ({ 
      ...prev, 
      [imageId]: { ...prev[imageId], [field]: value } 
    }));
  };

  const handleSaveImage = (imageId) => {
    // 这里可以添加保存到后端的逻辑
    console.log('保存形象修改:', editingImage[imageId]);
    setEditingImage(prev => {
      const newState = { ...prev };
      delete newState[imageId];
      return newState;
    });
  };

  const handleCancelImage = (imageId) => {
    setEditingImage(prev => {
      const newState = { ...prev };
      delete newState[imageId];
      return newState;
    });
  };

  const handleEditVoice = (voiceId, field, value) => {
    setEditingVoice(prev => ({ 
      ...prev, 
      [voiceId]: { ...prev[voiceId], [field]: value } 
    }));
  };

  const handleSaveVoice = (voiceId) => {
    // 这里可以添加保存到后端的逻辑
    console.log('保存声音修改:', editingVoice[voiceId]);
    setEditingVoice(prev => {
      const newState = { ...prev };
      delete newState[voiceId];
      return newState;
    });
  };

  const handleCancelVoice = (voiceId) => {
    setEditingVoice(prev => {
      const newState = { ...prev };
      delete newState[voiceId];
      return newState;
    });
  };

  const handleEditAgent = (agentId, field, value) => {
    setEditingAgent(prev => ({ 
      ...prev, 
      [agentId]: { ...prev[agentId], [field]: value } 
    }));
  };

  const handleSaveAgent = (agentId) => {
    // 这里可以添加保存到后端的逻辑
    console.log('保存Agent修改:', editingAgent[agentId]);
    setEditingAgent(prev => {
      const newState = { ...prev };
      delete newState[agentId];
      return newState;
    });
  };

  const handleCancelAgent = (agentId) => {
    setEditingAgent(prev => {
      const newState = { ...prev };
      delete newState[agentId];
      return newState;
    });
  };

  const handlePlayVoice = (audioUrl) => {
    if (audioRef.current) {
      audioRef.current.src = audioUrl;
      audioRef.current.play();
      setIsPlaying(true);
    }
  };

  const handleStopVoice = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setIsPlaying(false);
    }
  };

  const handleUploadImage = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const newImage = {
          id: `custom_${Date.now()}`,
          name: '自定义形象',
          url: e.target.result,
          description: '用户上传的自定义形象'
        };
        const imageOptions = avatarData.type === 'doctor' ? doctorImageOptions : familyImageOptions;
        imageOptions.push(newImage);
        setSelectedImage(newImage.id);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUploadVoice = (event) => {
    const file = event.target.files[0];
    if (file) {
      const audioUrl = URL.createObjectURL(file);
      const newVoice = {
        id: `custom_voice_${Date.now()}`,
        name: '自定义声音',
        audioUrl: audioUrl,
        description: '用户上传的自定义声音'
      };
      const voiceOptions = avatarData.type === 'doctor' ? doctorVoiceOptions : familyVoiceOptions;
      voiceOptions.push(newVoice);
      setSelectedVoice(newVoice.id);
    }
  };

  const getCurrentImage = () => {
    const imageOptions = avatarData.type === 'doctor' ? doctorImageOptions : familyImageOptions;
    return imageOptions.find(img => img.id === selectedImage) || imageOptions[0];
  };

  const getCurrentVoice = () => {
    const voiceOptions = avatarData.type === 'doctor' ? doctorVoiceOptions : familyVoiceOptions;
    return voiceOptions.find(voice => voice.id === selectedVoice) || voiceOptions[0];
  };

  const getCurrentAgent = () => {
    const agentOptions = avatarData.type === 'doctor' ? doctorAgentOptions : familyAgentOptions;
    return agentOptions.find(agent => agent.id === selectedAgent) || agentOptions[0];
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">虚拟人 #{id} 详情</h2>

      {/* 基本信息 */}
      <section className="mb-6">
        <h3 className="text-lg font-semibold mb-2">基本信息</h3>
        <p>名称：{avatarData.name}</p>
        <p>描述：{avatarData.description}</p>
      </section>

      {/* 形象图片预览和选择 */}
      <section className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">形象图片</h3>
          {isEditing && (
            <button
              onClick={() => fileInputRef.current?.click()}
              className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700"
            >
              上传新形象
            </button>
          )}
        </div>
        
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleUploadImage}
          className="hidden"
        />
        
        <input
          ref={voiceFileInputRef}
          type="file"
          accept="audio/*"
          onChange={handleUploadVoice}
          className="hidden"
        />

        {/* 当前形象预览 */}
        <div className="mb-4">
          <h4 className="text-md font-medium mb-2">当前形象</h4>
          <div className="bg-white p-4 rounded-lg shadow border">
            <img
              src={getCurrentImage().url}
              alt={getCurrentImage().name}
              className="w-48 h-64 object-cover rounded mb-2"
            />
            <h5 className="font-medium text-gray-800">{getCurrentImage().name}</h5>
            <p className="text-gray-600 text-sm">{getCurrentImage().description}</p>
          </div>
        </div>

        {/* 形象选择 */}
        {isEditing && (
          <div>
            <h4 className="text-md font-medium mb-2">选择形象</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {(avatarData.type === 'doctor' ? doctorImageOptions : familyImageOptions).map((image) => (
                <div
                  key={image.id}
                  className={`bg-white p-3 rounded-lg shadow border cursor-pointer transition-all ${
                    selectedImage === image.id ? 'ring-2 ring-blue-500' : 'hover:shadow-md'
                  }`}
                  onClick={() => handleImageChange(image.id)}
                >
                  <img
                    src={image.url}
                    alt={image.name}
                    className="w-full h-32 object-cover rounded mb-2"
                  />
                  {editingImage[image.id] ? (
                    <div className="space-y-2">
                      <input
                        type="text"
                        value={editingImage[image.id].name || image.name}
                        onChange={(e) => handleEditImage(image.id, 'name', e.target.value)}
                        className="w-full p-1 border rounded text-sm"
                        placeholder="形象名称"
                      />
                      <textarea
                        value={editingImage[image.id].description || image.description}
                        onChange={(e) => handleEditImage(image.id, 'description', e.target.value)}
                        className="w-full p-1 border rounded text-xs resize-none"
                        rows="2"
                        placeholder="形象描述"
                      />
                      <div className="flex space-x-1">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleSaveImage(image.id);
                          }}
                          className="bg-green-600 text-white px-2 py-1 rounded text-xs hover:bg-green-700"
                        >
                          保存
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleCancelImage(image.id);
                          }}
                          className="bg-gray-600 text-white px-2 py-1 rounded text-xs hover:bg-gray-700"
                        >
                          取消
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <h5 className="font-medium text-gray-800 text-sm">{image.name}</h5>
                      <p className="text-gray-600 text-xs">{image.description}</p>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEditImage(image.id, 'name', image.name);
                        }}
                        className="text-blue-600 text-xs hover:text-blue-800 mt-1"
                      >
                        编辑
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </section>

      {/* 声音预览和选择 */}
      <section className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">声音</h3>
          {isEditing && (
            <button
              onClick={() => voiceFileInputRef.current?.click()}
              className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700"
            >
              上传新声音
            </button>
          )}
        </div>
        
        {/* 当前声音预览 */}
        <div className="mb-4">
          <h4 className="text-md font-medium mb-2">当前声音</h4>
          <div className="bg-white p-4 rounded-lg shadow border">
            <div className="flex items-center space-x-3">
              <button
                onClick={() => handlePlayVoice(getCurrentVoice().audioUrl)}
                disabled={isPlaying}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:bg-gray-400"
              >
                {isPlaying ? '播放中...' : '播放'}
              </button>
              {isPlaying && (
                <button
                  onClick={handleStopVoice}
                  className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                >
                  停止
                </button>
              )}
              <div>
                <h5 className="font-medium text-gray-800">{getCurrentVoice().name}</h5>
                <p className="text-gray-600 text-sm">{getCurrentVoice().description}</p>
              </div>
            </div>
          </div>
        </div>

        {/* 声音选择 */}
        {isEditing && (
          <div>
            <h4 className="text-md font-medium mb-2">选择声音</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {(avatarData.type === 'doctor' ? doctorVoiceOptions : familyVoiceOptions).map((voice) => (
                <div
                  key={voice.id}
                  className={`bg-white p-4 rounded-lg shadow border cursor-pointer transition-all ${
                    selectedVoice === voice.id ? 'ring-2 ring-blue-500' : 'hover:shadow-md'
                  }`}
                  onClick={() => handleVoiceChange(voice.id)}
                >
                  {editingVoice[voice.id] ? (
                    <div className="space-y-3">
                      <input
                        type="text"
                        value={editingVoice[voice.id].name || voice.name}
                        onChange={(e) => handleEditVoice(voice.id, 'name', e.target.value)}
                        className="w-full p-2 border rounded"
                        placeholder="声音名称"
                      />
                      <textarea
                        value={editingVoice[voice.id].description || voice.description}
                        onChange={(e) => handleEditVoice(voice.id, 'description', e.target.value)}
                        className="w-full p-2 border rounded resize-none"
                        rows="2"
                        placeholder="声音描述"
                      />
                      <div className="flex items-center justify-between">
                        <div className="flex space-x-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleSaveVoice(voice.id);
                            }}
                            className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700"
                          >
                            保存
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleCancelVoice(voice.id);
                            }}
                            className="bg-gray-600 text-white px-3 py-1 rounded text-sm hover:bg-gray-700"
                          >
                            取消
                          </button>
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handlePlayVoice(voice.audioUrl);
                          }}
                          className="bg-gray-200 text-gray-700 px-3 py-1 rounded text-sm hover:bg-gray-300"
                        >
                          试听
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between">
                      <div>
                        <h5 className="font-medium text-gray-800">{voice.name}</h5>
                        <p className="text-gray-600 text-sm">{voice.description}</p>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEditVoice(voice.id, 'name', voice.name);
                          }}
                          className="text-blue-600 text-sm hover:text-blue-800 mt-1"
                        >
                          编辑
                        </button>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handlePlayVoice(voice.audioUrl);
                        }}
                        className="bg-gray-200 text-gray-700 px-3 py-1 rounded text-sm hover:bg-gray-300"
                      >
                        试听
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </section>

      {/* Agent选择 */}
      <section className="mb-6">
        <h3 className="text-lg font-semibold mb-2">{avatarData.type === 'doctor' ? '专业领域' : '陪伴类型'}</h3>
        
        {/* 当前Agent信息 */}
        <div className="mb-4">
          <h4 className="text-md font-medium mb-2">当前{avatarData.type === 'doctor' ? '专业领域' : '陪伴类型'}</h4>
          <div className="bg-white p-4 rounded-lg shadow border">
            <h5 className="font-medium text-gray-800">{getCurrentAgent().name}</h5>
            <p className="text-gray-600 text-sm">{getCurrentAgent().description}</p>
          </div>
        </div>

        {/* Agent选择 */}
        {isEditing && (
          <div>
            <h4 className="text-md font-medium mb-2">选择{avatarData.type === 'doctor' ? '专业领域' : '陪伴类型'}</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {(avatarData.type === 'doctor' ? doctorAgentOptions : familyAgentOptions).map((agent) => (
                <div
                  key={agent.id}
                  className={`bg-white p-4 rounded-lg shadow border cursor-pointer transition-all ${
                    selectedAgent === agent.id ? 'ring-2 ring-blue-500' : 'hover:shadow-md'
                  }`}
                  onClick={() => handleAgentChange(agent.id)}
                >
                  {editingAgent[agent.id] ? (
                    <div className="space-y-3">
                      <input
                        type="text"
                        value={editingAgent[agent.id].name || agent.name}
                        onChange={(e) => handleEditAgent(agent.id, 'name', e.target.value)}
                        className="w-full p-2 border rounded"
                        placeholder="名称"
                      />
                      <textarea
                        value={editingAgent[agent.id].description || agent.description}
                        onChange={(e) => handleEditAgent(agent.id, 'description', e.target.value)}
                        className="w-full p-2 border rounded resize-none"
                        rows="3"
                        placeholder="描述"
                      />
                      <div className="flex space-x-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleSaveAgent(agent.id);
                          }}
                          className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700"
                        >
                          保存
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleCancelAgent(agent.id);
                          }}
                          className="bg-gray-600 text-white px-3 py-1 rounded text-sm hover:bg-gray-700"
                        >
                          取消
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <h5 className="font-medium text-gray-800">{agent.name}</h5>
                      <p className="text-gray-600 text-sm">{agent.description}</p>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEditAgent(agent.id, 'name', agent.name);
                        }}
                        className="text-blue-600 text-sm hover:text-blue-800 mt-2"
                      >
                        编辑
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </section>

      {/* 编辑控制按钮 */}
      <div className="flex space-x-4">
        {!isEditing ? (
          <button
            onClick={() => setIsEditing(true)}
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
          >
            编辑设置
          </button>
        ) : (
          <>
            <button
              onClick={handleSaveChanges}
              className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700"
            >
              保存更改
            </button>
            <button
              onClick={handleCancelChanges}
              className="bg-gray-600 text-white px-6 py-2 rounded hover:bg-gray-700"
            >
              取消
            </button>
          </>
        )}
      </div>

      {/* 音频元素 */}
      <audio ref={audioRef} onEnded={() => setIsPlaying(false)} />
    </div>
  );
}

export default AvatarDetail; 
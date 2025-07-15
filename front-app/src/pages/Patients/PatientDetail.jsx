import { useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';

const mockRecord = [
  { date: '2024-01-01', score: 25 },
  { date: '2024-02-01', score: 27 },
  { date: '2024-03-01', score: 29 },
];

// 模拟个性化回忆知识库数据
const mockMemoryData = {
  textMemories: [
    { id: 1, title: '家庭信息', content: '有一个儿子叫李小明，在北京工作。有一个女儿叫李小红，在上海读书。', timestamp: '2024-01-15' },
    { id: 2, title: '兴趣爱好', content: '喜欢下象棋，年轻时是厂里的象棋冠军。喜欢听京剧，特别是梅兰芳的唱段。', timestamp: '2024-01-20' },
    { id: 3, title: '重要经历', content: '1960年代在钢铁厂工作，担任技术员。1980年代参与过国家重点工程。', timestamp: '2024-02-01' }
  ],
  imageMemories: [
    { id: 1, title: '家庭照片', description: '与家人的合影', url: 'https://via.placeholder.com/300x200/4F46E5/FFFFFF?text=家庭照片', timestamp: '2024-01-10' },
    { id: 2, title: '工作照片', description: '年轻时在工厂工作的照片', url: 'https://via.placeholder.com/300x200/10B981/FFFFFF?text=工作照片', timestamp: '2024-01-25' }
  ]
};

function PatientDetail() {
  const { id } = useParams();
  const [isEditing, setIsEditing] = useState(false);
  const [memoryData, setMemoryData] = useState(mockMemoryData);
  const [editingText, setEditingText] = useState({});
  const [editingImage, setEditingImage] = useState({});
  const fileInputRef = useRef(null);

  const handleEditText = (memoryId, content) => {
    setEditingText(prev => ({ ...prev, [memoryId]: content }));
  };

  const handleSaveText = (memoryId) => {
    setMemoryData(prev => ({
      ...prev,
      textMemories: prev.textMemories.map(memory => 
        memory.id === memoryId 
          ? { ...memory, content: editingText[memoryId] }
          : memory
      )
    }));
    setEditingText(prev => {
      const newState = { ...prev };
      delete newState[memoryId];
      return newState;
    });
  };

  const handleCancelText = (memoryId) => {
    setEditingText(prev => {
      const newState = { ...prev };
      delete newState[memoryId];
      return newState;
    });
  };

  const handleEditImage = (imageId, field, value) => {
    setEditingImage(prev => ({ 
      ...prev, 
      [imageId]: { ...prev[imageId], [field]: value } 
    }));
  };

  const handleSaveImage = (imageId) => {
    setMemoryData(prev => ({
      ...prev,
      imageMemories: prev.imageMemories.map(image => 
        image.id === imageId 
          ? { ...image, ...editingImage[imageId] }
          : image
      )
    }));
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

  const handleAddTextMemory = () => {
    const newMemory = {
      id: Date.now(),
      title: '新回忆',
      content: '',
      timestamp: new Date().toISOString().split('T')[0]
    };
    setMemoryData(prev => ({
      ...prev,
      textMemories: [...prev.textMemories, newMemory]
    }));
    setEditingText(prev => ({ ...prev, [newMemory.id]: '' }));
  };

  const handleAddImageMemory = () => {
    fileInputRef.current?.click();
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const newImage = {
          id: Date.now(),
          title: '新图片',
          description: '',
          url: e.target.result,
          timestamp: new Date().toISOString().split('T')[0]
        };
        setMemoryData(prev => ({
          ...prev,
          imageMemories: [...prev.imageMemories, newImage]
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDeleteTextMemory = (memoryId) => {
    setMemoryData(prev => ({
      ...prev,
      textMemories: prev.textMemories.filter(memory => memory.id !== memoryId)
    }));
  };

  const handleDeleteImageMemory = (imageId) => {
    setMemoryData(prev => ({
      ...prev,
      imageMemories: prev.imageMemories.filter(image => image.id !== imageId)
    }));
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">病人 #{id} 详情</h2>

      {/* 基本信息示例 */}
      <section className="mb-6">
        <h3 className="text-lg font-semibold mb-2">基本信息</h3>
        <p>姓名：张三</p>
        <p>性别：男</p>
        <p>年龄：70</p>
      </section>

      {/* 病史等 */}
      <section className="mb-6">
        <h3 className="text-lg font-semibold mb-2">病历病史</h3>
        <p>2010 年诊断高血压，2020 年诊断轻度认知障碍 …</p>
      </section>

      {/* 个性化回忆知识库 */}
      <section className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">个性化回忆知识库</h3>
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700"
          >
            {isEditing ? '完成编辑' : '编辑模式'}
          </button>
        </div>

        {/* 文本回忆 */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-3">
            <h4 className="text-md font-medium">文本回忆</h4>
            {isEditing && (
              <button
                onClick={handleAddTextMemory}
                className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700"
              >
                添加文本
              </button>
            )}
          </div>
          <div className="space-y-3">
            {memoryData.textMemories.map((memory) => (
              <div key={memory.id} className="bg-white p-4 rounded-lg shadow border">
                <div className="flex justify-between items-start mb-2">
                  <h5 className="font-medium text-gray-800">{memory.title}</h5>
                  <div className="flex space-x-2">
                    {isEditing && (
                      <>
                        <button
                          onClick={() => handleEditText(memory.id, memory.content)}
                          className="text-blue-600 text-sm hover:text-blue-800"
                        >
                          编辑
                        </button>
                        <button
                          onClick={() => handleDeleteTextMemory(memory.id)}
                          className="text-red-600 text-sm hover:text-red-800"
                        >
                          删除
                        </button>
                      </>
                    )}
                    <span className="text-xs text-gray-500">{memory.timestamp}</span>
                  </div>
                </div>
                {editingText[memory.id] !== undefined ? (
                  <div className="space-y-2">
                    <textarea
                      value={editingText[memory.id]}
                      onChange={(e) => handleEditText(memory.id, e.target.value)}
                      className="w-full p-2 border rounded resize-none"
                      rows="3"
                    />
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleSaveText(memory.id)}
                        className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700"
                      >
                        保存
                      </button>
                      <button
                        onClick={() => handleCancelText(memory.id)}
                        className="bg-gray-600 text-white px-3 py-1 rounded text-sm hover:bg-gray-700"
                      >
                        取消
                      </button>
                    </div>
                  </div>
                ) : (
                  <p className="text-gray-700">{memory.content}</p>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* 图片回忆 */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-3">
            <h4 className="text-md font-medium">图片回忆</h4>
            {isEditing && (
              <button
                onClick={handleAddImageMemory}
                className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700"
              >
                添加图片
              </button>
            )}
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileUpload}
            className="hidden"
          />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {memoryData.imageMemories.map((image) => (
              <div key={image.id} className="bg-white p-4 rounded-lg shadow border">
                <div className="flex justify-between items-start mb-2">
                  <h5 className="font-medium text-gray-800">{image.title}</h5>
                  <div className="flex space-x-2">
                    {isEditing && (
                      <>
                        <button
                          onClick={() => handleEditImage(image.id, 'title', image.title)}
                          className="text-blue-600 text-sm hover:text-blue-800"
                        >
                          编辑
                        </button>
                        <button
                          onClick={() => handleDeleteImageMemory(image.id)}
                          className="text-red-600 text-sm hover:text-red-800"
                        >
                          删除
                        </button>
                      </>
                    )}
                    <span className="text-xs text-gray-500">{image.timestamp}</span>
                  </div>
                </div>
                <img
                  src={image.url}
                  alt={image.title}
                  className="w-full h-48 object-cover rounded mb-2"
                />
                {editingImage[image.id] ? (
                  <div className="space-y-2">
                    <input
                      type="text"
                      value={editingImage[image.id].title || image.title}
                      onChange={(e) => handleEditImage(image.id, 'title', e.target.value)}
                      className="w-full p-2 border rounded text-sm"
                      placeholder="图片标题"
                    />
                    <textarea
                      value={editingImage[image.id].description || image.description}
                      onChange={(e) => handleEditImage(image.id, 'description', e.target.value)}
                      className="w-full p-2 border rounded text-sm resize-none"
                      rows="2"
                      placeholder="图片描述"
                    />
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleSaveImage(image.id)}
                        className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700"
                      >
                        保存
                      </button>
                      <button
                        onClick={() => handleCancelImage(image.id)}
                        className="bg-gray-600 text-white px-3 py-1 rounded text-sm hover:bg-gray-700"
                      >
                        取消
                      </button>
                    </div>
                  </div>
                ) : (
                  <p className="text-gray-700 text-sm">{image.description}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 认知得分折线图 */}
      <section className="mb-6">
        <h3 className="text-lg font-semibold mb-2">认知得分记录</h3>
        <LineChart width={500} height={260} data={mockRecord}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis domain={[0, 30]} />
          <Tooltip />
          <Line type="monotone" dataKey="score" stroke="#8884d8" />
        </LineChart>
      </section>

      <button className="bg-green-600 text-white px-4 py-2 rounded">
        生成报告
      </button>
    </div>
  );
}

export default PatientDetail; 
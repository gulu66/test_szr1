const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(bodyParser.json({ limit: '10mb' }));

// mock 数据
let users = [
  { id: 1, email: 'test@example.com', password: '123456' }
];
// 初始化内置数据，默认属于 test 账号（id: 1）
let patients = [
  { id: 1, userId: 1, name: '张三', gender: '男', age: 70, medicalHistory: '2010年诊断高血压，2020年诊断轻度认知障碍' }
];
let memories = [];
let images = [];
let avatars = [
  {
    id: 1,
    userId: 1,
    name: '内科医生',
    type: 'doctor',
    description: '专业的内科医生，擅长慢性病管理',
    current_image: 'https://via.placeholder.com/300x400',
    current_voice: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav',
    current_agent: '内科专家'
  }
];
let avatar_images = [
  { id: 1, avatar_id: 1, name: '内科医生', url: 'https://via.placeholder.com/300x400', description: '内科医生形象' }
];
let avatar_voices = [
  { id: 1, avatar_id: 1, name: '专业男声', audio_url: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav', description: '温和的男声' }
];
let avatar_agents = [
  { id: 1, avatar_id: 1, name: '内科专家', description: '擅长慢性病管理' }
];
let recentActivities = [];

// 注册
app.post('/api/register', (req, res) => {
  try {
    console.log('收到注册请求', req.body, typeof req.body);
    const { email, password, confirm } = req.body;
    if (!email || !password || password !== confirm) {
      return res.json({ success: false, message: '参数错误' });
    }
    if (users.find(u => u.email === email)) {
      return res.json({ success: false, message: '邮箱已注册' });
    }
    const newUser = { id: users.length + 1, email, password };
    users.push(newUser);
    res.json({ success: true, message: '注册成功', user: { id: newUser.id, email: newUser.email } }); // 新增 user 字段
  } catch (err) {
    console.error('注册接口异常', err);
    res.status(500).json({ success: false, message: '服务器异常' });
  }
});

// 登录
app.post('/api/login', (req, res) => {
  try {
    console.log('收到登录请求', req.body, typeof req.body);
    const { email, password } = req.body;
    const user = users.find(u => u.email === email && u.password === password);
    if (!user) {
      return res.json({ success: false, message: '账号或密码错误' });
    }
    res.json({ success: true, token: 'mock-token', user: { id: user.id, email: user.email } });
  } catch (err) {
    console.error('登录接口异常', err);
    res.status(500).json({ success: false, message: '服务器异常' });
  }
});

// 获取患者列表，按 userId 过滤
app.get('/api/patients', (req, res) => {
  const userId = Number(req.query.userId);
  res.json({ patients: patients.filter(p => p.userId === userId) });
});

// 新增患者，自动加 userId
app.post('/api/patients', (req, res) => {
  const { name, gender, age, medicalHistory, memories: newMemories = [], images: newImages = [], userId } = req.body;
  const patient = { id: patients.length + 1, userId, name, gender, age, medicalHistory };
  patients.push(patient);
  // 保存回忆
  newMemories.forEach(m => {
    memories.push({ ...m, patient_id: patient.id, userId });
  });
  // 保存图片
  newImages.forEach(img => {
    images.push({ ...img, patient_id: patient.id, userId });
  });
  recentActivities.unshift({
    id: Date.now(),
    type: 'patient',
    action: '新增病人',
    name: patient.name,
    time: new Date().toLocaleString()
  });
  if (recentActivities.length > 20) recentActivities.pop();
  res.json({ success: true, patient });
});

// 获取患者详情
app.get('/api/patients/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const userId = Number(req.query.userId); // 新增
  const patient = patients.find(p => p.id === id && p.userId === userId); // 加 userId 校验
  if (!patient) return res.status(404).json({ success: false, message: '未找到患者' });
  // 只聚合属于该 userId 的回忆和图片
  const patientMemories = memories.filter(m => m.patient_id === id && m.userId === userId);
  const patientImages = images.filter(img => img.patient_id === id && img.userId === userId);
  res.json({ patient: { ...patient, memories: patientMemories, images: patientImages } });
});

// 更新患者
app.put('/api/patients/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const userId = Number(req.body.userId);
  console.log('PUT /api/patients/:id', { id, userId, patients });
  const idx = patients.findIndex(p => Number(p.id) === Number(id) && Number(p.userId) === Number(userId));
  if (idx === -1) return res.status(404).json({ success: false });

  // 更新基本信息
  patients[idx] = { ...patients[idx], ...req.body };

  // 更新回忆
  if (Array.isArray(req.body.memories)) {
    memories = memories.filter(m => !(m.patient_id === id && m.userId === userId));
    req.body.memories.forEach(m => {
      memories.push({ ...m, patient_id: id, userId }); // 强制 userId
    });
  }

  // 更新图片
  if (Array.isArray(req.body.images)) {
    images = images.filter(img => !(img.patient_id === id && img.userId === userId));
    req.body.images.forEach(img => {
      images.push({ ...img, patient_id: id, userId }); // 强制 userId
    });
  }

  recentActivities.unshift({
    id: Date.now(),
    type: 'patient',
    action: '编辑病人',
    name: patients[idx].name,
    time: new Date().toLocaleString()
  });
  if (recentActivities.length > 20) recentActivities.pop();

  res.json({ success: true, patient: patients[idx] });
});

// 删除患者
app.delete('/api/patients/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const patient = patients.find(p => p.id === id);
  patients = patients.filter(p => p.id !== id);
  memories = memories.filter(m => m.patient_id !== id);
  images = images.filter(img => img.patient_id !== id);
  if (patient) {
    recentActivities.unshift({
      id: Date.now(),
      type: 'patient',
      action: '删除病人',
      name: patient.name,
      time: new Date().toLocaleString()
    });
    if (recentActivities.length > 20) recentActivities.pop();
  }
  res.json({ success: true, patients });
});

// 获取虚拟人列表，按 userId 过滤
app.get('/api/avatars', (req, res) => {
  const userId = Number(req.query.userId);
  res.json({ avatars: avatars.filter(a => a.userId === userId) });
});

// 新增虚拟人，自动加 userId
app.post('/api/avatars', (req, res) => {
  const { name, description, imageModel, voiceModel, agentModel, type, userId } = req.body;
  const avatar = {
    id: avatars.length + 1,
    userId,
    name,
    type: type || 'doctor',
    description,
    current_image: imageModel,
    current_voice: voiceModel,
    current_agent: agentModel
  };
  avatars.push(avatar);

  // 新增：同步保存图片、声音、Agent
  if (imageModel) {
    avatar_images.push({
      id: avatar_images.length + 1,
      avatar_id: avatar.id,
      name: '自定义图片',
      url: imageModel,
      description: ''
    });
  }
  if (voiceModel) {
    avatar_voices.push({
      id: avatar_voices.length + 1,
      avatar_id: avatar.id,
      name: '自定义声音',
      audio_url: voiceModel,
      description: ''
    });
  }
  if (agentModel) {
    avatar_agents.push({
      id: avatar_agents.length + 1,
      avatar_id: avatar.id,
      name: agentModel,
      description: ''
    });
  }

  recentActivities.unshift({
    id: Date.now(),
    type: 'avatar',
    action: '新增虚拟人',
    name: avatar.name,
    time: new Date().toLocaleString()
  });
  if (recentActivities.length > 20) recentActivities.pop();
  res.json({ success: true, avatar });
});

// 获取虚拟人详情
app.get('/api/avatars/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const avatar = avatars.find(a => a.id === id);
  if (!avatar) return res.status(404).json({ success: false, message: '未找到虚拟人' });
  const images = avatar_images.filter(img => img.avatar_id === id);
  const voices = avatar_voices.filter(v => v.avatar_id === id);
  const agents = avatar_agents.filter(a => a.avatar_id === id);
  res.json({ avatar, images, voices, agents });
});

// 更新虚拟人
app.put('/api/avatars/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const idx = avatars.findIndex(a => a.id === id);
  if (idx === -1) return res.status(404).json({ success: false });
  avatars[idx] = { ...avatars[idx], ...req.body };

  // 更新图片
  if (Array.isArray(req.body.images)) {
    avatar_images = avatar_images.filter(img => img.avatar_id !== id);
    req.body.images.forEach(img => {
      avatar_images.push({ ...img, avatar_id: id }); // 强制 avatar_id
    });
  }
  // 更新声音
  if (Array.isArray(req.body.voices)) {
    avatar_voices = avatar_voices.filter(v => v.avatar_id !== id);
    req.body.voices.forEach((v, idx) => {
      avatar_voices.push({
        id: v.id || Date.now() + idx,
        avatar_id: id,
        name: v.name,
        audio_url: v.audio_url,
        description: v.description || ''
      });
    });
  }
  // 更新Agent
  if (req.body.current_agent) {
    avatar_agents = avatar_agents.filter(a => a.avatar_id !== id);
    avatar_agents.push({
      id: avatar_agents.length + 1,
      avatar_id: id,
      name: req.body.current_agent,
      description: ''
    });
  }

  recentActivities.unshift({
    id: Date.now(),
    type: 'avatar',
    action: '编辑虚拟人',
    name: avatars[idx].name,
    time: new Date().toLocaleString()
  });
  if (recentActivities.length > 20) recentActivities.pop();
  res.json({ success: true, avatar: avatars[idx] });
});

// 删除虚拟人
app.delete('/api/avatars/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const avatar = avatars.find(a => a.id === id);
  avatars = avatars.filter(a => a.id !== id);
  if (avatar) {
    recentActivities.unshift({
      id: Date.now(),
      type: 'avatar',
      action: '删除虚拟人',
      name: avatar.name,
      time: new Date().toLocaleString()
    });
    if (recentActivities.length > 20) recentActivities.pop();
  }
  res.json({ success: true, avatars });
});

// 系统概览 mock 接口
app.get('/api/overview', (req, res) => {
  const userId = Number(req.query.userId);
  const userPatients = patients.filter(p => p.userId === userId);
  const userAvatars = avatars.filter(a => a.userId === userId);
  const doctorAvatars = userAvatars.filter(a => a.type === 'doctor').length;
  const familyAvatars = userAvatars.filter(a => a.type === 'family').length;
  const stats = {
    totalPatients: userPatients.length,
    totalAvatars: userAvatars.length,
    doctorAvatars,
    familyAvatars
  };
  res.json({ stats, recentActivities });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Mock API server running at http://localhost:${PORT}`);
}); 
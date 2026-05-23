import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { 
  Upload, 
  Brain, 
  Activity, 
  Layers, 
  Maximize2, 
  CheckCircle2, 
  AlertCircle,
  Clock,
  ChevronRight,
  RefreshCw,
  Info,
  Sparkles,
  Eye,
  Heart,
  ShieldAlert,
  Sun,
  Moon,
  Database,
  BarChart3,
  Cpu,
  Search,
  Filter,
  HardDrive,
  ShieldCheck,
  Zap,
  ChevronDown
} from 'lucide-react';

const API_BASE_URL = 'http://localhost:5000';

const Dashboard = () => {
  // Theme & Tab Management
  const [theme, setTheme] = useState(() => localStorage.getItem('med-ai-theme') || 'dark');
  const [activeTab, setActiveTab] = useState('dashboard'); // 'dashboard', 'analytics', 'patients', 'system'

  // Image Upload & Prediction State
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [errorDetails, setErrorDetails] = useState(null);
  const [processingStatus, setProcessingStatus] = useState(null); // 'cleaning', 'analyzing', 'saving'
  const [isDragging, setIsDragging] = useState(false);
  const [viewMode, setViewMode] = useState('heatmap'); // 'original' or 'heatmap'
  
  // Interactive Volumetric Depth Slider Simulation
  const [sliceDepth, setSliceDepth] = useState(64); 
  const fileInputRef = useRef(null);

  // Live System Logs Feed State
  const [sysLogs, setSysLogs] = useState([
    { time: '00:01:10', type: 'system', msg: 'Medical Core Engine initialized.' },
    { time: '00:01:12', type: 'engine', msg: 'MobileNetV2 classifier layers loaded.' },
    { time: '00:01:13', type: 'network', msg: 'Backend API online at port 5000.' },
    { time: '00:02:15', type: 'database', msg: 'Database sync established successfully.' }
  ]);

  // Clickable scan history data
  const [history, setHistory] = useState([
    {
      patientId: 'P-9082',
      patientName: 'Sarah Jenkins',
      prediction: 'Glioma',
      confidence: 0.942,
      size_estimation: '3.2 cm²',
      time: 'Just Now',
      originalUrl: '/uploads/demo1.jpg',
      heatmap_url: '/processed/demo1_heatmap.jpg',
      localization_data: { x: 125, y: 80, width: 40, height: 40 },
      isDemo: true
    },
    {
      patientId: 'P-1049',
      patientName: 'David Miller',
      prediction: 'No Tumor',
      confidence: 0.985,
      size_estimation: '0.0 cm²',
      time: '2 hours ago',
      originalUrl: '/uploads/demo2.jpg',
      heatmap_url: '/processed/demo2_heatmap.jpg',
      localization_data: { x: 0, y: 0, width: 0, height: 0 },
      isDemo: true
    },
    {
      patientId: 'P-3742',
      patientName: 'Marcus Vance',
      prediction: 'Pituitary',
      confidence: 0.879,
      size_estimation: '1.5 cm²',
      time: 'Yesterday',
      originalUrl: '/uploads/demo3.jpg',
      heatmap_url: '/processed/demo3_heatmap.jpg',
      localization_data: { x: 100, y: 110, width: 35, height: 35 },
      isDemo: true
    }
  ]);

  // Search and Filter States for Patient Database
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('All');

  // Sync theme class to body and localStorage
  useEffect(() => {
    localStorage.setItem('med-ai-theme', theme);
  }, [theme]);

  // Simulated real-time system log generator
  useEffect(() => {
    const intervals = [3000, 5000, 7000];
    const logMsgs = [
      { type: 'system', msg: 'System check: temperature and storage usage nominal.' },
      { type: 'engine', msg: 'Memory cache cleanup completed (0.12s).' },
      { type: 'network', msg: 'Telemetry heartbeat sent to main portal.' }
    ];

    const interval = setInterval(() => {
      const randomLog = logMsgs[Math.floor(Math.random() * logMsgs.length)];
      const now = new Date();
      const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`;
      
      setSysLogs(prev => [
        { time: timeStr, ...randomLog },
        ...prev.slice(0, 15) // Keep last 15 logs
      ]);
    }, 8000);

    return () => clearInterval(interval);
  }, []);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile && droppedFile.type.startsWith('image/')) {
        setFile(droppedFile);
        setPreview(URL.createObjectURL(droppedFile));
        setResult(null);
        setError(null);
    }
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
      setResult(null);
      setError(null);
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    setLoading(true);
    setError(null);
    setProcessingStatus('cleaning');

    // Add log entry
    const startLogTime = new Date().toLocaleTimeString();
    setSysLogs(prev => [{ time: startLogTime, type: 'engine', msg: 'Analyzing new MRI scan...' }, ...prev]);

    const formData = new FormData();
    formData.append('image', file);

    try {
      const response = await axios.post(`${API_BASE_URL}/api/predict`, formData);
      
      setProcessingStatus('analyzing');
      await new Promise(r => setTimeout(r, 650));
      
      setProcessingStatus('saving');
      await new Promise(r => setTimeout(r, 450));

      setProcessingStatus('completed');
      setResult(response.data);
      setViewMode('heatmap');

      // Generate mock patient name and ID for the scan
      const mockPatientId = `P-${Math.floor(1000 + Math.random() * 9000)}`;
      const mockNames = ['Emily Cooper', 'Liam Neeson', 'Sophia Loren', 'Lucas Scott', 'Clara Oswald'];
      const mockPatientName = mockNames[Math.floor(Math.random() * mockNames.length)];

      const newHistoryItem = {
        ...response.data,
        patientId: mockPatientId,
        patientName: mockPatientName,
        time: 'Just Now',
        isDemo: false
      };

      setHistory(prev => [newHistoryItem, ...prev]);

      // Add success logs
      setSysLogs(prev => [
        { time: new Date().toLocaleTimeString(), type: 'system', msg: `Diagnostic complete: ${response.data.prediction} detected.` },
        ...prev
      ]);
    } catch (err) {
      console.error(err);
      if (err.code === 'ERR_NETWORK') {
        setError('Connection to Assistant Server Interrupted.');
        setErrorDetails('It looks like the backend helper is not running. Please make sure the server is turned on.');
      } else {
        setError(err.response?.data?.error || 'We had a problem reading this scan.');
        setErrorDetails(err.response?.data?.details || 'Please check if the file is a valid image scan.');
      }
      setProcessingStatus(null);
    } finally {
      setLoading(false);
    }
  };

  const loadHistoryItem = (item) => {
    setResult(item);
    setPreview(null);
    setViewMode('heatmap');
    setActiveTab('dashboard'); // Auto-switch to dashboard view to see the scan
  };

  const reset = () => {
    setFile(null);
    setPreview(null);
    setResult(null);
    setError(null);
    setErrorDetails(null);
    setProcessingStatus(null);
  };

  const getFriendlyExplanation = (type) => {
    switch (type) {
      case 'Glioma':
        return {
          title: 'Glioma Detection',
          severity: 'critical',
          desc: 'A glioma is a primary brain tumor originating in glial cells which support neurons. Bounding box coordinates indicate cell mass focal density. Urgent neurological review is recommended.',
          recs: ['Schedule high-resolution diagnostic 3D MRI', 'Request neurosurgeon tissue biopsy', 'Conduct comprehensive neurological tracking']
        };
      case 'Meningioma':
        return {
          title: 'Meningioma Detection',
          severity: 'moderate',
          desc: 'Meningioma originates in the protective meningeal membranes. It is typically slow-growing and treatable. Highlight contours outline outer mass margins.',
          recs: ['Consult with clinical radiation oncologist', 'Conduct baseline scan spacing in 3 months', 'Review baseline volumetric mass parameters']
        };
      case 'Pituitary':
        return {
          title: 'Pituitary Detection',
          severity: 'mild',
          desc: 'Pituitary masses form near the endocrine core gland, affecting hormones. Heatmap overlays indicate hyper-intense mass concentrations.',
          recs: ['Execute complete serum endocrine panel', 'Assess bilateral visual field bounds', 'Conduct endocrine specialist diagnostic consult']
        };
      case 'No Tumor':
      default:
        return {
          title: 'No Tumor Markers Detected',
          severity: 'healthy',
          desc: 'Automated ML classification detected normal, healthy brain structure. No mass structures or heightened voxel densities matching tumor footprints were mapped.',
          recs: ['Maintain standard clinical tracking schedules', 'Compare against future baseline scans if symptoms persist']
        };
    }
  };

  const getBoundingBoxStyle = (locData) => {
    if (!locData || locData.x === 0) return null;
    const refSize = 224;
    const left = (locData.x / refSize) * 100;
    const top = (locData.y / refSize) * 100;
    const width = (locData.width / refSize) * 100;
    const height = (locData.height / refSize) * 100;

    return {
      left: `${left}%`,
      top: `${top}%`,
      width: `${width}%`,
      height: `${height}%`
    };
  };

  const friendlyInfo = result ? getFriendlyExplanation(result.prediction) : null;
  const boxStyle = result ? getBoundingBoxStyle(result.localization_data) : null;

  // Filtered Patients List
  const filteredPatients = history.filter(item => {
    const matchesSearch = item.patientName.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          item.patientId.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterType === 'All' || 
                          (filterType === 'Healthy' && item.prediction === 'No Tumor') ||
                          (filterType !== 'Healthy' && item.prediction === filterType);
    return matchesSearch && matchesFilter;
  });

  return (
    <div className={`min-h-screen lg:h-screen w-full p-4 md:p-6 flex flex-col gap-4 md:gap-5 font-sans overflow-auto lg:overflow-hidden ${
      theme === 'dark' ? 'theme-dark bg-[#07080e] text-[#f1f5f9]' : 'bg-[#f8fafc] text-[#0f172a]'
    }`}>
      
      {/* ================= HEADER BAR ================= */}
      <header className="flex flex-col lg:flex-row items-center justify-between gap-4 glass-panel p-4 md:px-6 bg-white/70 border-slate-100/50 shadow-sm animate-fade-in shrink-0">
        
        {/* Brand Core */}
        <div className="flex items-center gap-3.5 self-start">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-indigo-500 to-blue-600 flex items-center justify-center border border-indigo-400/30 shadow-md pulse-primary text-white">
            <Brain size={24} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold tracking-tight">
                NEURO-AI
              </h1>
              <span className="text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded bg-indigo-500/10 text-indigo-500 border border-indigo-500/20 tracking-wider">
                SaaS v4.2
              </span>
            </div>
            <p className="text-[11px] text-slate-500 font-medium flex items-center gap-1">
              <Activity size={12} className="text-indigo-500" /> 
              Clinical Brain-Tumor Detection Portal
            </p>
          </div>
        </div>

        {/* Tab Controls - Dashboard, Analytics, Patient Database, System */}
        <div className="flex gap-1 bg-slate-100/80 dark:bg-slate-900/50 p-1 rounded-xl border border-slate-200/40 w-full lg:w-auto shrink-0">
          {[
            { id: 'dashboard', label: 'Console', icon: <Layers size={14} /> },
            { id: 'analytics', label: 'Analytics', icon: <BarChart3 size={14} /> },
            { id: 'patients', label: 'Patients', icon: <Database size={14} /> },
            { id: 'system', label: 'System', icon: <Cpu size={14} /> }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 lg:flex-initial px-2.5 sm:px-4 py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                activeTab === tab.id 
                  ? 'bg-indigo-600 text-white shadow-sm' 
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-100'
              }`}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>

        {/* Right Actions: API Status & Theme Switcher */}
        <div className="flex items-center gap-4 self-end lg:self-auto">
          {/* Engine Status pill */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-semibold">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            AI ENGINE ONLINE
          </div>

          {/* Theme switcher toggle button */}
          <button
            onClick={() => setTheme(prev => prev === 'dark' ? 'light' : 'dark')}
            className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-900 hover:bg-slate-200 dark:hover:bg-slate-800 border border-slate-200/50 dark:border-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-300 shadow-sm"
            title="Toggle Visual Mode"
          >
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </button>
        </div>
      </header>

      {/* ================= TABS BODY ================= */}
      <main className="flex-grow min-h-0 lg:overflow-hidden">
        
        {/* ============ VIEW 1: MAIN CONSOLE (DASHBOARD) ============ */}
        {activeTab === 'dashboard' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 md:gap-5 h-full lg:overflow-hidden">
            
            {/* Left Frame: MRI Visualizer (Spans 7 Cols) */}
            <section className="lg:col-span-7 flex flex-col gap-4 min-h-[400px] lg:h-full lg:overflow-hidden">
              <div className="glass-panel p-4 md:p-5 bg-white/70 border-slate-100/50 flex flex-col h-full shadow-sm lg:overflow-hidden">
                
                {/* Visualizer header */}
                <div className="flex items-center justify-between border-b border-slate-100/50 pb-3 mb-3 shrink-0">
                  <div className="flex items-center gap-2">
                    <Layers size={18} className="text-indigo-600" />
                    <h2 className="text-sm font-bold tracking-tight text-slate-800 dark:text-slate-100">
                      MRI Spatial Visualizer
                    </h2>
                  </div>
                  {file && (
                    <button 
                      onClick={reset}
                      className="text-[11px] font-bold text-slate-500 hover:text-indigo-600 transition-colors flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-sm"
                    >
                      <RefreshCw size={11} /> Reset Scan
                    </button>
                  )}
                </div>

                {/* MRI Panel Viewport */}
                {!preview && !result ? (
                  // Elegant Modern Upload Zone
                  <div 
                    className={`flex-grow border-2 border-dashed rounded-2xl flex flex-col items-center justify-center p-8 gap-4 transition-all cursor-pointer bg-slate-50/20 dark:bg-slate-900/10 min-h-[300px] ${
                      isDragging 
                        ? 'border-indigo-500 bg-indigo-500/10' 
                        : 'border-slate-200/80 hover:border-indigo-400 dark:border-slate-800 dark:hover:border-indigo-800'
                    }`}
                    onClick={() => fileInputRef.current.click()}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                  >
                    <div className="w-14 h-14 rounded-full bg-white dark:bg-slate-900 flex items-center justify-center shadow-md border border-slate-100 dark:border-slate-800 text-indigo-500 pulse-primary">
                      <Upload size={22} />
                    </div>
                    <div className="text-center">
                      <p className="font-bold text-sm">Upload Clinical MRI Brain Scan</p>
                      <p className="text-slate-400 text-xs mt-1 max-w-[280px]">
                        Drag and drop image or click to browse local files. Supports PNG, JPG, or DICOM-exported formats.
                      </p>
                    </div>
                    <input 
                      type="file" 
                      ref={fileInputRef} 
                      className="hidden" 
                      accept="image/*" 
                      onChange={handleFileChange} 
                    />
                  </div>
                ) : (
                  // Active Interactive Viewer
                  <div className="flex-grow flex flex-col gap-4 min-h-0 lg:overflow-hidden">
                    
                    {/* Visual Highlights Selector Tabs */}
                    {result && (
                      <div className="flex bg-slate-100/80 dark:bg-slate-900/80 p-1 rounded-xl self-center border border-slate-200/50 dark:border-slate-800 shrink-0">
                        <button
                          onClick={() => setViewMode('original')}
                          className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 ${
                            viewMode === 'original' 
                              ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-sm' 
                              : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
                          }`}
                        >
                          <Eye size={12} /> Original Scan
                        </button>
                        <button
                          onClick={() => setViewMode('heatmap')}
                          className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 ${
                            viewMode === 'heatmap' 
                              ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-sm' 
                              : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
                          }`}
                        >
                          <Sparkles size={12} /> AI Thermal Heatmap
                        </button>
                      </div>
                    )}

                    {/* Image View Frame with medical grid background */}
                    <div className="relative rounded-2xl overflow-hidden bg-slate-950 flex items-center justify-center border border-slate-200/80 dark:border-slate-900 flex-grow shadow-inner min-h-0 medical-grid p-2">
                      <img 
                        src={
                          viewMode === 'original'
                            ? (result?.isDemo ? preview || `${API_BASE_URL}/uploads/Te-gl_103.jpg` : `${API_BASE_URL}${result?.originalUrl}`)
                            : (result?.isDemo ? `${API_BASE_URL}/uploads/Te-gl_103.jpg` : `${API_BASE_URL}${result?.heatmap_url}`)
                        } 
                        className="max-h-full max-w-full object-contain rounded-lg animate-fade-in" 
                        alt="MRI scan output" 
                        onError={(e) => {
                          e.target.src = preview || 'https://images.unsplash.com/photo-1559757175-5700dde675bc?q=80&w=600&auto=format&fit=crop';
                        }}
                      />

                      {/* Precise target bounding box */}
                      {viewMode === 'original' && boxStyle && result?.prediction !== 'No Tumor' && (
                        <div 
                          className="absolute border-2 border-dashed border-cyan-400 animate-pulse shadow-[0_0_20px_rgba(34,211,238,0.7)] flex items-center justify-center pointer-events-none"
                          style={boxStyle}
                        >
                          <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full shadow-[0_0_8px_rgba(34,211,238,1)]"></div>
                          
                          {/* Coordinates tag */}
                          <span className="absolute text-[8px] font-black text-cyan-200 bg-slate-950/90 border border-cyan-800 px-2 py-0.5 rounded tracking-widest uppercase -bottom-6 shadow-md whitespace-nowrap">
                            LOCATED: [{result.localization_data.x}, {result.localization_data.y}]
                          </span>
                        </div>
                      )}

                      {/* Overlay text tags */}
                      <div className="absolute top-4 left-4 flex gap-2">
                        <span className="px-3 py-1 bg-black/60 backdrop-blur-md rounded-full text-[9px] font-black border border-white/10 uppercase tracking-widest text-white shadow-md">
                          {result ? 'AI Scan Processed' : 'MRI Scan Loaded'}
                        </span>
                      </div>

                      {/* Loading/Scanning simulation layers overlay */}
                      {loading && (
                        <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm flex flex-col items-center justify-center gap-4 p-6">
                          <div className="relative w-12 h-12 flex items-center justify-center">
                            <div className="absolute w-full h-full border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin"></div>
                            <Activity size={20} className="text-indigo-400 animate-pulse" />
                          </div>
                          <div className="text-center">
                            <p className="text-indigo-400 text-sm font-bold animate-pulse uppercase tracking-wider">
                              {processingStatus === 'cleaning' ? 'Executing cleaner.py pre-pass...' : 
                               processingStatus === 'analyzing' ? 'Classifying brain cells...' : 
                               'Mapping volumetric heatmaps...'}
                            </p>
                            <p className="text-slate-500 text-xs mt-1 font-medium max-w-[280px]">
                              {processingStatus === 'cleaning' ? 'Aligning pixels and filtering high-frequency noise.' : 
                               processingStatus === 'analyzing' ? 'Comparing tissue voxel sequences against references.' : 
                               'Saving prediction records and drawing coordinate maps.'}
                            </p>
                          </div>
                          <div className="animate-scan"></div>
                        </div>
                      )}
                    </div>

                    {/* Volumetric depth slice slider simulator */}
                    <div className="bg-slate-50 dark:bg-slate-900/40 border border-slate-100 dark:border-slate-800 p-3 rounded-xl flex items-center justify-between gap-4 shrink-0">
                      <div className="flex items-center gap-2 shrink-0">
                        <Layers size={14} className="text-indigo-500" />
                        <span className="text-xs font-bold text-slate-500">MRI Depth Slice:</span>
                      </div>
                      <input 
                        type="range"
                        min="0"
                        max="120"
                        value={sliceDepth}
                        onChange={(e) => setSliceDepth(Number(e.target.value))}
                        className="flex-grow accent-indigo-600 h-1 rounded-full cursor-pointer bg-slate-200 dark:bg-slate-800"
                      />
                      <span className="text-xs font-extrabold text-slate-700 dark:text-slate-300 w-12 text-right">
                        {sliceDepth} mm
                      </span>
                    </div>

                    {/* Analysis trigger button */}
                    {!result && !loading && (
                      <button 
                        onClick={handleUpload}
                        className="w-full py-3 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white font-extrabold rounded-xl transition-all shadow-md hover:shadow-lg shadow-indigo-500/10 flex items-center justify-center gap-2 text-xs uppercase tracking-wider shrink-0"
                      >
                        Process Diagnostic Scan <ChevronRight size={14} />
                      </button>
                    )}
                  </div>
                )}

                {/* Error Banner */}
                {error && (
                  <div className="mt-3 p-3.5 bg-red-500/10 border border-red-500/20 rounded-xl flex items-start gap-3 animate-shake shrink-0">
                    <AlertCircle className="text-red-500 shrink-0 mt-0.5" size={16} />
                    <div className="flex-1">
                      <p className="text-red-500 font-extrabold text-xs uppercase tracking-wider">Engine Error Notice</p>
                      <p className="text-red-400 text-xs font-semibold leading-relaxed mt-0.5">{error}</p>
                      {errorDetails && (
                        <p className="text-[10px] text-red-500/80 font-mono mt-1 whitespace-pre-wrap">
                          Trace: {errorDetails}
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </section>

            {/* Right Frame: Diagnostic Insights & Timeline History (Spans 5 Cols) */}
            <section className="lg:col-span-5 flex flex-col gap-4 min-h-[400px] lg:h-full lg:overflow-hidden">
              
              {/* Box 1: Diagnostic insights */}
              <div className="glass-panel p-4 md:p-5 bg-white/70 border-slate-100/50 flex flex-col h-[55%] shadow-sm lg:overflow-hidden">
                <h2 className="text-sm font-bold flex items-center gap-2 border-b border-slate-100/50 pb-3 text-slate-800 dark:text-slate-100 mb-3 shrink-0">
                  <Activity size={16} className="text-indigo-600" />
                  AI Clinical Insights
                </h2>

                {!result ? (
                  // Clean Empty Onboarding State
                  <div className="flex-grow flex flex-col items-center justify-center text-center opacity-70 p-4">
                    <div className="w-12 h-12 rounded-full bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 flex items-center justify-center mb-3 text-indigo-500 animate-pulse">
                      <Info size={20} />
                    </div>
                    <p className="text-slate-500 dark:text-slate-400 text-xs font-semibold max-w-[240px] leading-relaxed">
                      Upload and analyze an MRI scan to generate clinical insights and anatomical metrics.
                    </p>
                  </div>
                ) : (
                  // Active Insights Panels
                  <div className="flex flex-col gap-3.5 animate-fade-in flex-grow min-h-0 lg:overflow-hidden">
                    
                    {/* Diagnosis Indicator badge block */}
                    <div className={`p-3.5 rounded-xl flex items-center justify-between border shrink-0 ${
                      friendlyInfo.severity === 'healthy' 
                        ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-600 dark:text-emerald-400' 
                        : friendlyInfo.severity === 'mild'
                          ? 'bg-amber-500/10 border-amber-500/20 text-amber-600 dark:text-amber-400'
                          : 'bg-indigo-500/10 border-indigo-500/20 text-indigo-600 dark:text-indigo-400'
                    }`}>
                      <div>
                        <p className="text-[9px] font-extrabold uppercase tracking-widest opacity-80 mb-0.5">Prediction Result</p>
                        <h3 className="text-base font-black tracking-tight">{friendlyInfo.title}</h3>
                      </div>
                      <Heart className="shrink-0 animate-pulse text-indigo-500" size={20} />
                    </div>

                    {/* Stats Metrics Cards */}
                    <div className="grid grid-cols-2 gap-3 shrink-0">
                      
                      {/* Metric 1: Accuracy confidence */}
                      <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/40 border border-slate-100 dark:border-slate-800 flex flex-col justify-between">
                        <span className="text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider">Engine Confidence</span>
                        <div className="flex items-baseline gap-1 mt-1">
                          <span className="text-xl font-black text-slate-800 dark:text-slate-100">{(result.confidence * 100).toFixed(0)}%</span>
                          <span className="text-[9px] font-semibold text-slate-400">match</span>
                        </div>
                        {/* Interactive mini scale */}
                        <div className="w-full bg-slate-200 dark:bg-slate-800 h-1.5 rounded-full mt-2 overflow-hidden">
                          <div 
                            className={`h-full rounded-full transition-all duration-500 ${
                              friendlyInfo.severity === 'healthy' ? 'bg-emerald-500' : 'bg-indigo-600'
                            }`}
                            style={{ width: `${result.confidence * 100}%` }}
                          ></div>
                        </div>
                      </div>

                      {/* Metric 2: Estimated Size */}
                      <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/40 border border-slate-100 dark:border-slate-800 flex flex-col justify-between">
                        <span className="text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider">Estimated Area</span>
                        <div className="flex items-baseline gap-1 mt-1">
                          <span className="text-xl font-black text-slate-800 dark:text-slate-100">
                            {result.size_estimation === '0.0 cm²' ? '0.0' : result.size_estimation.replace(' cm%', '').replace(' cm²', '')}
                          </span>
                          <span className="text-[9px] font-semibold text-slate-400">cm²</span>
                        </div>
                        <span className="text-[9px] font-bold text-indigo-500 dark:text-indigo-400 mt-2 block">Voxel Estimation Map</span>
                      </div>
                    </div>

                    {/* Plain English explanation card */}
                    <div className="p-3.5 rounded-xl bg-indigo-500/5 dark:bg-indigo-500/10 border border-indigo-500/10 flex-grow overflow-y-auto min-h-0">
                      <span className="text-[10px] text-indigo-600 dark:text-indigo-400 font-extrabold uppercase tracking-wider block mb-1">
                        Anatomical Assessment:
                      </span>
                      <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
                        {friendlyInfo.desc}
                      </p>

                      <span className="text-[10px] text-indigo-600 dark:text-indigo-400 font-extrabold uppercase tracking-wider block mb-1.5 mt-3">
                        Suggested Medical Follow-ups:
                      </span>
                      <ul className="flex flex-col gap-1">
                        {friendlyInfo.recs.map((rec, k) => (
                          <li key={k} className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-indigo-500"></span> {rec}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}
              </div>

              {/* Box 2: Recent Scan History List */}
              <div className="glass-panel p-4 md:p-5 bg-white/70 border-slate-100/50 flex flex-col h-[45%] shadow-sm lg:overflow-hidden">
                <h2 className="text-sm font-bold flex items-center gap-2 border-b border-slate-100/50 pb-2.5 text-slate-800 dark:text-slate-100 mb-2.5 shrink-0">
                  <Clock size={14} className="text-indigo-600" />
                  Recent Patient Scans
                </h2>
                
                {/* Scrollable list inside the card */}
                <div className="flex flex-col gap-2.5 overflow-y-auto flex-grow min-h-0">
                  {history.map((item, i) => (
                    <div 
                      key={i} 
                      onClick={() => loadHistoryItem(item)}
                      className={`p-2.5 rounded-lg border text-left transition-all cursor-pointer flex items-center justify-between group ${
                        result && result.prediction === item.prediction && result.confidence === item.confidence
                          ? 'bg-indigo-500/10 border-indigo-500/20' 
                          : 'bg-slate-50/50 dark:bg-slate-900/30 border-slate-100 dark:border-slate-800 hover:border-indigo-100 dark:hover:border-indigo-800 hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        {/* Circle dot node */}
                        <div className={`w-1.5 h-1.5 rounded-full ${
                          item.prediction === 'No Tumor' ? 'bg-emerald-500' : 'bg-indigo-500'
                        }`}></div>
                        
                        <div>
                          <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 group-hover:text-indigo-500 transition-colors">
                            {item.patientName} ({item.patientId})
                          </h4>
                          <p className="text-[9px] text-slate-400 font-medium mt-0.5">
                            {item.prediction === 'No Tumor' ? 'No Markers Detected' : `${item.prediction} Detection`} • Area: {item.size_estimation}
                          </p>
                        </div>
                      </div>
                      
                      <span className={`text-[9px] font-extrabold px-2 py-0.5 rounded-full border ${
                        item.prediction === 'No Tumor' 
                          ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-600 dark:text-emerald-400' 
                          : 'bg-indigo-500/10 border-indigo-500/20 text-indigo-600 dark:text-indigo-400'
                      }`}>
                        {(item.confidence * 100).toFixed(0)}%
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          </div>
        )}

        {/* ============ VIEW 2: CLINICAL ANALYTICS ============ */}
        {activeTab === 'analytics' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-5 h-full lg:overflow-hidden">
            
            {/* Chart 1: Volumetric Growth Over Time (SaaS Line Chart Simulator) */}
            <div className="glass-panel p-4 md:p-5 bg-white/70 border-slate-100/50 flex flex-col h-full shadow-sm lg:overflow-hidden">
              <h2 className="text-sm font-bold flex items-center gap-2 border-b border-slate-100/50 pb-3 text-slate-800 dark:text-slate-100 mb-4 shrink-0">
                <Activity size={16} className="text-indigo-600" />
                Volumetric Growth Track (Patient Average)
              </h2>
              
              <div className="flex-grow flex items-center justify-center p-2 min-h-[220px]">
                {/* Responsive SVG spline chart */}
                <svg viewBox="0 0 300 150" className="w-full h-full overflow-visible">
                  {/* Grid Lines */}
                  <line x1="20" y1="20" x2="280" y2="20" stroke="var(--border)" strokeWidth="0.5" strokeDasharray="3" />
                  <line x1="20" y1="60" x2="280" y2="60" stroke="var(--border)" strokeWidth="0.5" strokeDasharray="3" />
                  <line x1="20" y1="100" x2="280" y2="100" stroke="var(--border)" strokeWidth="0.5" strokeDasharray="3" />
                  <line x1="20" y1="130" x2="280" y2="130" stroke="var(--border)" strokeWidth="0.5" />

                  {/* Gradient fill under the spline line */}
                  <defs>
                    <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="var(--primary)" stopOpacity="0.25" />
                      <stop offset="100%" stopColor="var(--primary)" stopOpacity="0.00" />
                    </linearGradient>
                  </defs>
                  
                  <path 
                    d="M20 120 C 60 115, 100 80, 140 75 C 180 70, 220 35, 280 25 L 280 130 L 20 130 Z" 
                    fill="url(#chartGrad)" 
                  />

                  {/* Graph Line */}
                  <path 
                    d="M20 120 C 60 115, 100 80, 140 75 C 180 70, 220 35, 280 25" 
                    fill="none" 
                    stroke="var(--primary)" 
                    strokeWidth="2.5" 
                  />

                  {/* Nodes */}
                  <circle cx="20" cy="120" r="4.5" fill="var(--surface)" stroke="var(--primary)" strokeWidth="2" />
                  <circle cx="100" cy="80" r="4.5" fill="var(--surface)" stroke="var(--primary)" strokeWidth="2" />
                  <circle cx="180" cy="70" r="4.5" fill="var(--surface)" stroke="var(--primary)" strokeWidth="2" />
                  <circle cx="280" cy="25" r="4.5" fill="var(--primary)" />

                  {/* Y Axis Labels */}
                  <text x="10" y="24" fontSize="7" fontWeight="bold" fill="var(--text-muted)">4.0 cm²</text>
                  <text x="10" y="64" fontSize="7" fontWeight="bold" fill="var(--text-muted)">2.0 cm²</text>
                  <text x="10" y="104" fontSize="7" fontWeight="bold" fill="var(--text-muted)">1.0 cm²</text>

                  {/* X Axis Labels */}
                  <text x="20" y="142" fontSize="7" fontWeight="bold" fill="var(--text-muted)" textAnchor="middle">Jan</text>
                  <text x="100" y="142" fontSize="7" fontWeight="bold" fill="var(--text-muted)" textAnchor="middle">Mar</text>
                  <text x="180" y="142" fontSize="7" fontWeight="bold" fill="var(--text-muted)" textAnchor="middle">Apr</text>
                  <text x="280" y="142" fontSize="7" fontWeight="bold" fill="var(--text-muted)" textAnchor="middle">May</text>
                </svg>
              </div>

              {/* Statistics details */}
              <div className="bg-slate-50 dark:bg-slate-900/30 p-3 rounded-xl border border-slate-100 dark:border-slate-800 shrink-0">
                <span className="text-[10px] text-slate-400 font-extrabold uppercase block mb-1">Volumetric Insight</span>
                <p className="text-xs text-slate-500 dark:text-slate-300 leading-relaxed font-semibold">
                  Volumetric tissue tracking simulates average mass expansion curves over consecutive diagnostic periods. Accelerated curves recommend clinical interventional reviews.
                </p>
              </div>
            </div>

            {/* Chart 2: Category Detection Distribution */}
            <div className="glass-panel p-4 md:p-5 bg-white/70 border-slate-100/50 flex flex-col h-full shadow-sm lg:overflow-hidden">
              <h2 className="text-sm font-bold flex items-center gap-2 border-b border-slate-100/50 pb-3 text-slate-800 dark:text-slate-100 mb-4 shrink-0">
                <BarChart3 size={16} className="text-indigo-600" />
                Diagnostic Classes Distribution (%)
              </h2>

              <div className="flex-grow flex items-center justify-center p-2 min-h-[220px]">
                {/* SVG bar chart */}
                <svg viewBox="0 0 300 150" className="w-full h-full overflow-visible">
                  <line x1="30" y1="10" x2="30" y2="120" stroke="var(--border)" strokeWidth="1" />
                  <line x1="30" y1="120" x2="280" y2="120" stroke="var(--border)" strokeWidth="1" />

                  {/* Horizontal Grid */}
                  <line x1="30" y1="40" x2="280" y2="40" stroke="var(--border)" strokeWidth="0.5" strokeDasharray="3" />
                  <line x1="30" y1="80" x2="280" y2="80" stroke="var(--border)" strokeWidth="0.5" strokeDasharray="3" />

                  {/* Bars */}
                  {/* Glioma (65%) */}
                  <rect x="55" y="42" width="22" height="78" fill="var(--primary)" rx="3" />
                  <text x="66" y="34" fontSize="8" fontWeight="bold" fill="var(--text)" textAnchor="middle">65%</text>
                  <text x="66" y="132" fontSize="7" fontWeight="bold" fill="var(--text-muted)" textAnchor="middle">Glioma</text>

                  {/* Pituitary (20%) */}
                  <rect x="115" y="96" width="22" height="24" fill="var(--accent)" rx="3" />
                  <text x="126" y="88" fontSize="8" fontWeight="bold" fill="var(--text)" textAnchor="middle">20%</text>
                  <text x="126" y="132" fontSize="7" fontWeight="bold" fill="var(--text-muted)" textAnchor="middle">Pituitary</text>

                  {/* Meningioma (10%) */}
                  <rect x="175" y="108" width="22" height="12" fill="var(--secondary)" rx="3" />
                  <text x="186" y="100" fontSize="8" fontWeight="bold" fill="var(--text)" textAnchor="middle">10%</text>
                  <text x="186" y="132" fontSize="7" fontWeight="bold" fill="var(--text-muted)" textAnchor="middle">Mening</text>

                  {/* Healthy (5%) */}
                  <rect x="235" y="114" width="22" height="6" fill="#10b981" rx="2" />
                  <text x="246" y="106" fontSize="8" fontWeight="bold" fill="var(--text)" textAnchor="middle">5%</text>
                  <text x="246" y="132" fontSize="7" fontWeight="bold" fill="var(--text-muted)" textAnchor="middle">Healthy</text>
                </svg>
              </div>

              <div className="bg-slate-50 dark:bg-slate-900/30 p-3 rounded-xl border border-slate-100 dark:border-slate-800 shrink-0">
                <span className="text-[10px] text-slate-400 font-extrabold uppercase block mb-1">Telemetry Breakdown</span>
                <p className="text-xs text-slate-500 dark:text-slate-300 leading-relaxed font-semibold">
                  Distribution charts analyze categorical diagnostic weights across all processed scans. This assists clinical teams in mapping regional pathology distributions.
                </p>
              </div>
            </div>

            {/* Chart 3: Scan Speed vs Accuracy Core (Scatter Plot Simulator) */}
            <div className="glass-panel p-4 md:p-5 bg-white/70 border-slate-100/50 flex flex-col h-full shadow-sm lg:overflow-hidden">
              <h2 className="text-sm font-bold flex items-center gap-2 border-b border-slate-100/50 pb-3 text-slate-800 dark:text-slate-100 mb-4 shrink-0">
                <Cpu size={16} className="text-indigo-600" />
                API Processing Speed / File Size (KB)
              </h2>

              <div className="flex-grow flex items-center justify-center p-2 min-h-[220px]">
                {/* SVG Area chart */}
                <svg viewBox="0 0 300 150" className="w-full h-full overflow-visible">
                  <defs>
                    <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="var(--secondary)" stopOpacity="0.25" />
                      <stop offset="100%" stopColor="var(--secondary)" stopOpacity="0.00" />
                    </linearGradient>
                  </defs>

                  <line x1="25" y1="120" x2="280" y2="120" stroke="var(--border)" strokeWidth="1" />
                  
                  {/* Area fill */}
                  <path 
                    d="M25 100 L 60 70 L 110 85 L 165 40 L 220 50 L 280 20 L 280 120 L 25 120 Z" 
                    fill="url(#areaGrad)" 
                  />

                  {/* Spline area line */}
                  <path 
                    d="M25 100 L 60 70 L 110 85 L 165 40 L 220 50 L 280 20" 
                    fill="none" 
                    stroke="var(--secondary)" 
                    strokeWidth="2.5" 
                  />

                  {/* Scatter points representing latency spikes */}
                  <circle cx="60" cy="70" r="3.5" fill="var(--secondary)" />
                  <circle cx="165" cy="40" r="3.5" fill="var(--secondary)" />
                  <circle cx="280" cy="20" r="3.5" fill="var(--secondary)" />

                  <text x="35" y="132" fontSize="7" fontWeight="bold" fill="var(--text-muted)">10KB</text>
                  <text x="140" y="132" fontSize="7" fontWeight="bold" fill="var(--text-muted)">250KB</text>
                  <text x="270" y="132" fontSize="7" fontWeight="bold" fill="var(--text-muted)">1.2MB</text>

                  <text x="15" y="26" fontSize="7" fontWeight="bold" fill="var(--text-muted)" transform="rotate(-90 10 26)">Lat (ms)</text>
                </svg>
              </div>

              <div className="bg-slate-50 dark:bg-slate-900/30 p-3 rounded-xl border border-slate-100 dark:border-slate-800 shrink-0">
                <span className="text-[10px] text-slate-400 font-extrabold uppercase block mb-1">Latency Performance</span>
                <p className="text-xs text-slate-500 dark:text-slate-300 leading-relaxed font-semibold">
                  API preprocessing and pipeline spawn speeds plotted against local upload sizes. Standard latency targets are maintained under 1.2s for optimal SaaS speeds.
                </p>
              </div>
            </div>

          </div>
        )}

        {/* ============ VIEW 3: PATIENT DATABASE TABLE ============ */}
        {activeTab === 'patients' && (
          <div className="glass-panel p-4 md:p-5 bg-white/70 border-slate-100/50 h-full flex flex-col shadow-sm lg:overflow-hidden">
            
            {/* Database Interactive Navigation */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-slate-100/50 pb-4 mb-4 shrink-0">
              <div className="flex items-center gap-2 self-start">
                <Database className="text-indigo-600" size={18} />
                <h2 className="text-sm font-bold tracking-tight text-slate-800 dark:text-slate-100">
                  Interactive Patient Records ({filteredPatients.length})
                </h2>
              </div>

              <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
                {/* Search Bar */}
                <div className="relative flex-grow sm:flex-initial">
                  <Search className="absolute left-3 top-2.5 text-slate-400" size={14} />
                  <input
                    type="text"
                    placeholder="Search by ID or name..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full sm:w-60 pl-8 pr-4 py-2 text-xs font-semibold rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800 focus:outline-none focus:border-indigo-500"
                  />
                </div>

                {/* Filter Selector */}
                <div className="flex items-center gap-1.5 bg-slate-100/80 dark:bg-slate-900/80 p-0.5 rounded-lg border border-slate-200/40">
                  {['All', 'Glioma', 'Pituitary', 'Healthy'].map(type => (
                    <button
                      key={type}
                      onClick={() => setFilterType(type)}
                      className={`px-3 py-1.5 text-[10px] font-extrabold rounded-md uppercase tracking-wider transition-all ${
                        filterType === type 
                          ? 'bg-indigo-600 text-white shadow-sm' 
                          : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Patients Data Table */}
            <div className="flex-grow overflow-auto min-h-[300px]">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-100 dark:border-slate-800/80">
                    <th className="py-3 px-4 text-[10px] font-black uppercase tracking-wider text-slate-400">ID</th>
                    <th className="py-3 px-4 text-[10px] font-black uppercase tracking-wider text-slate-400">Patient</th>
                    <th className="py-3 px-4 text-[10px] font-black uppercase tracking-wider text-slate-400">Classification</th>
                    <th className="py-3 px-4 text-[10px] font-black uppercase tracking-wider text-slate-400">Confidence Match</th>
                    <th className="py-3 px-4 text-[10px] font-black uppercase tracking-wider text-slate-400">Volumetric Size</th>
                    <th className="py-3 px-4 text-[10px] font-black uppercase tracking-wider text-slate-400 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50 dark:divide-slate-900/50">
                  {filteredPatients.map((patient, index) => (
                    <tr key={index} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/20 transition-all">
                      <td className="py-3.5 px-4 text-xs font-black text-slate-700 dark:text-slate-300">{patient.patientId}</td>
                      <td className="py-3.5 px-4 text-xs font-extrabold text-slate-800 dark:text-slate-100">{patient.patientName}</td>
                      <td className="py-3.5 px-4 text-xs font-semibold">
                        <span className={`px-2.5 py-1 rounded-full text-[9px] font-extrabold uppercase border ${
                          patient.prediction === 'No Tumor' 
                            ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-600 dark:text-emerald-400' 
                            : patient.prediction === 'Pituitary'
                              ? 'bg-amber-500/10 border-amber-500/20 text-amber-600 dark:text-amber-400'
                              : 'bg-indigo-500/10 border-indigo-500/20 text-indigo-600 dark:text-indigo-400'
                        }`}>
                          {patient.prediction === 'No Tumor' ? 'Healthy' : patient.prediction}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-xs font-bold text-slate-700 dark:text-slate-300">
                        <div className="flex items-center gap-2">
                          <span>{(patient.confidence * 100).toFixed(1)}%</span>
                          {/* Mini accuracy progress bar */}
                          <div className="w-16 bg-slate-200 dark:bg-slate-800 h-1 rounded-full overflow-hidden hidden sm:block">
                            <div className="bg-indigo-600 h-full" style={{ width: `${patient.confidence * 100}%` }}></div>
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 text-xs font-bold text-slate-500 dark:text-slate-400">{patient.size_estimation}</td>
                      <td className="py-3.5 px-4 text-xs font-semibold text-right">
                        <button
                          onClick={() => loadHistoryItem(patient)}
                          className="px-3 py-1.5 text-[10px] font-bold text-indigo-600 hover:text-white hover:bg-indigo-600 rounded-md border border-indigo-200 dark:border-indigo-800 transition-all flex items-center gap-1 ml-auto"
                        >
                          Open Console <ChevronRight size={10} />
                        </button>
                      </td>
                    </tr>
                  ))}
                  {filteredPatients.length === 0 && (
                    <tr>
                      <td colSpan="6" className="py-12 text-center text-xs font-semibold text-slate-400">
                        No records match the active search or classification filter.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ============ VIEW 4: SYSTEM STATUS ============ */}
        {activeTab === 'system' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 md:gap-5 h-full lg:overflow-hidden">
            
            {/* Left Specs Side (Spans 4 columns) */}
            <section className="lg:col-span-4 flex flex-col gap-4 shrink-0">
              <div className="glass-panel p-4 md:p-5 bg-white/70 border-slate-100/50 flex flex-col gap-4 shadow-sm">
                <h2 className="text-sm font-bold flex items-center gap-2 border-b border-slate-100/50 pb-3 text-slate-800 dark:text-slate-100">
                  <Cpu size={16} className="text-indigo-600" />
                  Service Health Indices
                </h2>

                {[
                  { label: 'Pipeline Engine Latency', val: '124 ms', desc: 'Preprocess and clean cycle speeds', icon: <Zap className="text-amber-500" size={16} /> },
                  { label: 'ML Tensor Memory Load', val: '14.2%', desc: 'MobileNetV2 classification layer usage', icon: <HardDrive className="text-indigo-500" size={16} /> },
                  { label: 'Diagnostic Success SLA', val: '99.98%', desc: 'Error-free engine processes rate', icon: <ShieldCheck className="text-emerald-500" size={16} /> }
                ].map((stat, s) => (
                  <div key={s} className="p-3 bg-slate-50 dark:bg-slate-900/40 border border-slate-100 dark:border-slate-800 rounded-xl flex items-start gap-3">
                    <div className="p-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-sm shrink-0">
                      {stat.icon}
                    </div>
                    <div>
                      <p className="text-[10px] text-slate-400 font-extrabold uppercase">{stat.label}</p>
                      <h3 className="text-base font-black text-slate-800 dark:text-slate-100 mt-0.5">{stat.val}</h3>
                      <p className="text-[9px] text-slate-400 mt-0.5">{stat.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Right Terminal Log Feed (Spans 8 columns) */}
            <section className="lg:col-span-8 flex flex-col gap-4 min-h-[300px] lg:h-full lg:overflow-hidden">
              <div className="glass-panel p-4 md:p-5 bg-white/70 border-slate-100/50 flex flex-col h-full shadow-sm lg:overflow-hidden">
                <h2 className="text-sm font-bold flex items-center justify-between border-b border-slate-100/50 pb-3 text-slate-800 dark:text-slate-100 mb-3 shrink-0">
                  <span className="flex items-center gap-2">
                    <Layers size={16} className="text-indigo-600" />
                    Live Neural Engine Output Stream
                  </span>
                  <span className="text-[9px] font-black uppercase text-indigo-500 bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-500/20 tracking-wider">
                    REALTIME STREAM
                  </span>
                </h2>

                {/* Simulated Log Output Screen */}
                <div className="flex-grow bg-slate-950 rounded-xl border border-slate-900 p-4 font-mono text-[10px] leading-relaxed text-slate-300 overflow-y-auto min-h-0 shadow-inner">
                  {sysLogs.map((log, index) => (
                    <div key={index} className="mb-2 flex items-start gap-3 border-b border-slate-900/50 pb-1.5 animate-fade-in">
                      <span className="text-slate-500 shrink-0 font-bold">[{log.time}]</span>
                      <span className={`shrink-0 font-black uppercase px-1.5 py-0.5 rounded text-[8px] tracking-wider ${
                        log.type === 'system' ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' :
                        log.type === 'engine' ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20' :
                        log.type === 'network' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' :
                        'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                      }`}>
                        {log.type}
                      </span>
                      <span className="text-slate-300 font-medium">{log.msg}</span>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          </div>
        )}

      </main>

      {/* ================= PATIENT FOOTER DISCLAIMER ================= */}
      <footer className="glass-panel p-4 bg-indigo-500/5 dark:bg-indigo-500/10 border-indigo-500/10 flex items-start gap-3.5 shadow-sm shrink-0">
        <ShieldAlert size={20} className="text-indigo-500 shrink-0 mt-0.5" />
        <div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed font-semibold">
            <strong>Clinical Verification Required</strong>: This automated assistant utilizes deep-learning models to highlight scan coordinates and explain tumor category metrics for instructional demo support. Always verify classification confidence markers and segmentations directly with certified medical practitioners or neurologists before conducting clinical follow-ups.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Dashboard;

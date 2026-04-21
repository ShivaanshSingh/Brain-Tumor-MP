import React, { useState, useRef } from 'react';
import axios from 'axios';
import { 
  Upload, 
  Brain, 
  Activity, 
  Layers, 
  Maximize, 
  CheckCircle2, 
  AlertCircle,
  Clock,
  ChevronRight,
  RefreshCw,
  Info
} from 'lucide-react';

const API_BASE_URL = 'http://localhost:5000';

const Dashboard = () => {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [errorDetails, setErrorDetails] = useState(null);
  const [processingStatus, setProcessingStatus] = useState(null); // 'cleaning', 'analyzing', 'saving'
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

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

    const formData = new FormData();
    formData.append('image', file);

    try {
      // Step 1 & 2 & 3: Clean, Predict, and Save handled by backend
      const response = await axios.post(`${API_BASE_URL}/api/predict`, formData);
      setProcessingStatus('completed');
      setResult(response.data);
    } catch (err) {
      console.error(err);
      if (err.code === 'ERR_NETWORK') {
        setError('CRITICAL: Backend Server Unreachable. Please ensure the server is running on port 5000.');
        setErrorDetails('Connection refused. Is the Node.js server running?');
      } else {
        setError(err.response?.data?.error || 'Failed to process image.');
        setErrorDetails(err.response?.data?.details || 'Check your MRI file format and Firebase configuration.');
      }
      setProcessingStatus(null);
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setFile(null);
    setPreview(null);
    setResult(null);
    setError(null);
  };

  return (
    <div className="min-h-screen p-4 md:p-8 flex flex-col gap-8 max-w-7xl mx-auto font-sans">
      {/* Header */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 glass-panel p-8 animate-fade-in" style={{animationDelay: '0.1s'}}>
        <div className="flex items-center gap-6">
          <div className="w-16 h-16 rounded-2xl bg-primary/20 flex items-center justify-center border border-primary/30 shadow-2xl shadow-primary/20 pulse-primary">
            <Brain className="text-primary" size={36} />
          </div>
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-white via-white to-primary/60 bg-clip-text text-transparent font-display tracking-tight leading-tight">
              Brain Tumor Insight System
            </h1>
            <p className="text-text-muted text-base flex items-center gap-2 mt-2 font-medium">
              <Activity size={18} className="text-primary animate-pulse" /> 
              Advanced CNN Diagnostic Assistant
            </p>
          </div>
        </div>
        <div className="flex items-center gap-6 border-l border-white/5 pl-8 h-16">
          <div className="flex flex-col items-end justify-center">
            <span className="text-[12px] font-bold text-text-muted uppercase tracking-[0.2em] mb-2">System Status</span>
            <span className="text-sm text-success font-bold flex items-center gap-2 bg-success/10 px-4 py-2 rounded-full border border-success/20">
              <span className="w-2.5 h-2.5 rounded-full bg-success animate-pulse"></span>
              Live & Processing
            </span>
          </div>
        </div>
      </header>

      <main className="flex-1 flex flex-col xl:flex-row gap-8 overflow-hidden min-h-0">
        {/* Primary Analysis View */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-8 min-h-0">
          {/* Upload & Preview Section */}
          <div className="lg:col-span-7 flex flex-col gap-6 min-h-0">
            <div className="glass-panel p-6 flex flex-col gap-6 h-full min-h-[500px]">
              <div className="flex items-center justify-between border-b border-white/5 pb-4">
                <h2 className="text-xl font-bold font-display flex items-center gap-3 text-slate-100">
                  <Layers size={22} className="text-primary" />
                  MRI Analysis Visualizer
                </h2>
                {file && (
                  <button 
                    onClick={reset}
                    className="text-xs font-bold text-text-muted hover:text-white transition-all flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-white/5 hover:border-white/10"
                  >
                    <RefreshCw size={14} /> Clear Scan
                  </button>
                )}
              </div>

              {!preview ? (
                <div 
                  className={`flex-1 border-2 border-dashed rounded-2xl flex flex-col items-center justify-center gap-4 transition-all cursor-pointer bg-slate-900/40 ${
                    isDragging ? 'border-primary bg-primary/10' : 'border-slate-700 hover:border-primary/50'
                  }`}
                  onClick={() => fileInputRef.current.click()}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                >
                  <div className="w-16 h-16 rounded-full bg-slate-800 flex items-center justify-center">
                    <Upload className="text-text-muted" size={32} />
                  </div>
                  <div className="text-center">
                    <p className="text-white font-medium font-display">Click or Drag MRI to Upload</p>
                    <p className="text-text-muted text-xs mt-1">Supports PNG, JPG, JPEG (Max 10MB)</p>
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
                <div className="flex-1 flex flex-col gap-4 min-h-0">
                  <div className="relative rounded-2xl overflow-hidden bg-black flex items-center justify-center border border-slate-700 flex-1 medical-grid">
                    {/* Result Heatmap vs Original */}
                    {result ? (
                      <div className="relative w-full h-full">
                        <img 
                          src={`${API_BASE_URL}${result.heatmap_url}`} 
                          className="w-full h-full object-contain animate-fade-in" 
                          alt="Heatmap Result" 
                        />
                        <div className="animate-scan"></div>
                      </div>
                    ) : (
                      <div className="relative w-full h-full flex items-center justify-center">
                        <img 
                          src={preview} 
                          className="w-full h-full object-contain" 
                          alt="MRI Preview" 
                        />
                        {loading && <div className="animate-scan"></div>}
                      </div>
                    )}
                    
                    {/* Label Overlays */}
                    <div className="absolute top-6 left-6 flex gap-3">
                      <span className="px-4 py-1.5 bg-black/60 backdrop-blur-md rounded-full text-[11px] font-black border border-white/10 uppercase tracking-[0.15em] text-primary shadow-xl">
                        {result ? 'AI Analysis Active' : 'Source MRI'}
                      </span>
                    </div>
                    
                    {loading && (
                      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex flex-col items-center justify-center gap-6">
                        <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                        <div className="text-center">
                          <p className="text-primary text-xl font-bold animate-pulse tracking-wide font-display uppercase">
                            {processingStatus === 'cleaning' ? 'Pulse Cleaning MRI' : 
                             processingStatus === 'analyzing' ? 'Executing Neural Scan' : 
                             'Syncing with Firebase'}
                          </p>
                          <p className="text-text-muted text-xs mt-2 font-medium">
                            {processingStatus === 'cleaning' ? 'Removing Gaussian noise via OpenCV...' : 
                             processingStatus === 'analyzing' ? 'Processing layers via MobileNetV2...' : 
                             'Securing records in Firestore Database...'}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>

                  {!result && !loading && (
                    <button 
                      onClick={handleUpload}
                      className="w-full py-4 bg-primary hover:bg-primary/90 text-white font-bold rounded-xl transition-all shadow-lg shadow-primary/20 flex items-center justify-center gap-2 font-display text-lg tracking-wide"
                    >
                      Analyze Scan <ChevronRight size={20} />
                    </button>
                  )}
                </div>
              )}

              {error && (
              <div className="p-6 bg-danger/10 border-2 border-danger/40 rounded-2xl flex items-start gap-4 animate-shake shadow-lg shadow-danger/5">
                <AlertCircle className="text-danger shrink-0 drop-shadow-[0_0_8px_rgba(244,63,94,0.6)]" size={24} />
                <div className="flex-1 overflow-hidden">
                  <p className="text-danger font-black text-xs uppercase tracking-[0.2em] mb-1">System Exception</p>
                  <p className="text-white/90 text-sm font-bold leading-relaxed mb-2">{error}</p>
                  {errorDetails && (
                    <div className="p-3 bg-black/40 rounded-lg border border-white/5">
                      <p className="text-[10px] text-text-muted font-mono whitespace-pre-wrap break-all uppercase leading-tight">
                        Technical Detail: {errorDetails}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}
            </div>
          </div>

          {/* Insights Section */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            <div className="glass-panel p-6 flex flex-col gap-6 overflow-y-auto max-h-[600px] flex-1">
              <h2 className="text-lg font-bold font-display flex items-center gap-2 border-b border-white/5 pb-4 text-slate-100">
                <Activity size={20} className="text-primary" />
                Diagnostic Insights
              </h2>

              {!result ? (
                <div className="flex-1 flex flex-col items-center justify-center text-center py-12 opacity-50">
                  <Info size={48} className="text-text-muted mb-4" />
                  <p className="text-text-muted font-medium">Upload an MRI image to generate automated diagnostic insights and tumor localization results.</p>
                </div>
              ) : (
                <div className="flex flex-col gap-6 animate-fade-in">
                  {/* Score Card */}
                  <div className="p-6 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-between shadow-inner">
                    <div>
                      <p className="text-primary text-[10px] font-black uppercase tracking-[0.2em] mb-2">Primary Detection</p>
                      <h3 className="text-3xl font-bold font-display text-white">{result.prediction}</h3>
                    </div>
                    <div className="text-right">
                      <p className="text-text-muted text-[10px] font-black uppercase tracking-[0.2em] mb-2">Confidence</p>
                      <p className="text-3xl font-bold font-display text-success">{(result.confidence * 100).toFixed(1)}%</p>
                    </div>
                  </div>

                  {/* Grid Stats */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 rounded-xl bg-slate-800/50 border border-white/5">
                      <div className="flex items-center gap-2 text-text-muted text-xs mb-2">
                        <Maximize size={14} /> Size Est.
                      </div>
                      <p className="text-lg font-semibold text-white">{result.size_estimation}</p>
                    </div>
                    <div className="p-4 rounded-xl bg-slate-800/50 border border-white/5">
                      <div className="flex items-center gap-2 text-text-muted text-xs mb-2">
                        <Clock size={14} /> Time Taken
                      </div>
                      <p className="text-lg font-semibold text-white">1.2s</p>
                    </div>
                  </div>

                  {/* Localization Note */}
                  <div className="space-y-3">
                    <p className="text-sm font-semibold text-white flex items-center gap-2">
                      <CheckCircle2 size={16} className="text-success" /> 
                      Localization Report
                    </p>
                    <p className="text-xs text-text-muted leading-relaxed font-medium">
                      The CNN heatmap highlights region intensity in the (X: {result.localization_data.x}, Y: {result.localization_data.y}) quadrant. 
                      Recommended follow-up: Axial contrast-enhanced sequence for boundary verification.
                    </p>
                  </div>

                  {/* Action Suggestions */}
                  <div className="mt-4 p-4 rounded-xl bg-white/5 border border-white/10">
                    <p className="text-[10px] font-bold text-text-muted uppercase tracking-widest mb-3">Suggested Next Steps</p>
                    <ul className="space-y-2">
                      <li className="text-xs flex items-center gap-2 text-slate-300 font-medium italic">
                        <div className="w-1.5 h-1.5 rounded-full bg-primary"></div> Compare with historical scans
                      </li>
                      <li className="text-xs flex items-center gap-2 text-slate-300 font-medium italic">
                        <div className="w-1.5 h-1.5 rounded-full bg-primary"></div> Segment detailed volumetric area
                      </li>
                    </ul>
                  </div>
                </div>
              )}
            </div>

            <div className="glass-panel p-6 flex items-center gap-4 bg-primary/5 border-primary/20 shadow-lg shadow-primary/5 group">
              <AlertCircle size={22} className="text-primary group-hover:scale-110 transition-transform" />
              <div className="flex-1">
                <p className="text-[11px] text-primary/80 leading-relaxed font-medium">
                  Clinical Warning: This AI simulation is for academic insight and decision-support only. 
                  All results MUST be verified by a board-certified radiologist.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Scan History Sidebar - Utilizing the right space */}
        <div className="xl:w-96 flex flex-col gap-6 animate-fade-in" style={{animationDelay: '0.3s'}}>
          <div className="glass-panel p-6 flex flex-col gap-6 h-full medical-grid">
            <h2 className="text-xl font-bold font-display flex items-center gap-3 border-b border-white/5 pb-4 text-slate-100">
              <Clock size={20} className="text-primary" />
              Scan History
            </h2>
            
            <div className="flex flex-col gap-4 overflow-y-auto max-h-[700px] pr-2">
              {[
                { type: 'Glioma Detection', time: 'Just Now', conf: '94.2%', size: '3.2 cm²' },
                { type: 'No Tumor ID', time: '2 hours ago', conf: '98.5%', size: '0.0 cm²' },
                { type: 'Pituitary Study', time: 'Yesterday', conf: '87.9%', size: '1.5 cm²' },
                { type: 'Meningioma ID', time: 'Apr 18', conf: '91.4%', size: '2.8 cm²' }
              ].map((item, i) => (
                <div key={i} className="p-4 rounded-xl bg-white/5 border border-white/5 hover:border-primary/30 transition-all cursor-pointer group hover:bg-primary/5">
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-white font-bold text-sm font-display tracking-tight group-hover:text-primary transition-colors">
                      {item.type}
                    </span>
                    <span className="text-[10px] text-success font-black bg-success/10 px-2 py-0.5 rounded-full border border-success/20">
                      {item.conf}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-text-muted flex items-center gap-1 font-medium">
                      <Clock size={10} /> {item.time}
                    </span>
                    <span className="text-[10px] text-primary font-bold">
                      {item.size}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <button className="mt-auto w-full py-3 rounded-xl border border-white/10 text-text-muted text-[10px] font-black uppercase tracking-widest hover:border-primary/50 hover:text-white transition-all bg-white/5">
              Access Patient Database
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;

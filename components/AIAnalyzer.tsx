
import React, { useState, useRef, useEffect } from 'react';
import { analyzePromotionScreenshot, getSmartOptimizationStrategy } from '../services/geminiService';
import { BankOffer, UserCard, BankName } from '../types';

interface AIAnalyzerProps {
  onAddOffer: (offer: BankOffer) => void;
  userCards: UserCard[];
  offers: BankOffer[];
}

const AIAnalyzer: React.FC<AIAnalyzerProps> = ({ onAddOffer, userCards, offers }) => {
  const [analyzing, setAnalyzing] = useState(false);
  const [strategy, setStrategy] = useState<string | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const processBase64 = async (base64: string) => {
    setAnalyzing(true);
    try {
      const result = await analyzePromotionScreenshot(base64);
      const newOffer: BankOffer = {
        id: Date.now().toString(),
        bank: result.bank as BankName || BankName.ICBC,
        title: result.title || '新发现福利',
        description: (result.category || '福利') + ' 活动',
        category: result.category || 'Lottery',
        status: 'active',
        expiryDate: result.expiryDate || '2024-12-31',
        estimatedValue: result.estimatedValue || 0,
        steps: result.steps || []
      };
      onAddOffer(newOffer);
      alert('识别成功！已添加到福利库。');
    } catch (err) {
      console.error(err);
      alert('解析失败，请确保截图或照片清晰。');
    } finally {
      setAnalyzing(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = async () => {
      const result = reader.result as string;
      setPreviewImage(result);
      const base64 = result.split(',')[1];
      await processBase64(base64);
    };
    reader.readAsDataURL(file);
  };

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' }, 
        audio: false 
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setIsCameraOpen(true);
    } catch (err) {
      console.error("Error accessing camera:", err);
      alert("无法访问摄像头，请检查权限设置。");
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setIsCameraOpen(false);
  };

  const takePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL('image/jpeg');
        setPreviewImage(dataUrl);
        const base64 = dataUrl.split(',')[1];
        stopCamera();
        processBase64(base64);
      }
    }
  };

  const generateStrategy = async () => {
    setAnalyzing(true);
    try {
      const cardNames = userCards.map(c => c.bank);
      const offerTitles = offers.map(o => `${o.bank}: ${o.title}`).join(', ');
      const res = await getSmartOptimizationStrategy(cardNames, offerTitles);
      setStrategy(res);
    } catch (err) {
      alert('AI 思考失败，请稍后再试。');
    } finally {
      setAnalyzing(false);
    }
  };

  useEffect(() => {
    return () => stopCamera();
  }, []);

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 text-center">
        {!isCameraOpen ? (
          <>
            <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <h3 className="font-bold text-slate-900 text-lg mb-2">获取活动信息</h3>
            <p className="text-sm text-slate-500 mb-6">上传截图或拍照，AI 自动识别银行福利</p>
            
            <div className="flex flex-col sm:flex-row justify-center gap-3">
              <button 
                onClick={startCamera}
                disabled={analyzing}
                className="flex items-center justify-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-colors shadow-lg shadow-blue-200 disabled:opacity-50"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4 5a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V7a2 2 0 00-2-2h-1.586a1 1 0 01-.707-.293l-1.121-1.121A2 2 0 0011.172 3H8.828a2 2 0 00-1.414.586L6.293 4.707A1 1 0 015.586 5H4zm6 9a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
                </svg>
                <span>立即拍照</span>
              </button>

              <label className="flex items-center justify-center space-x-2 px-6 py-3 bg-white text-slate-700 border border-slate-200 rounded-xl font-bold cursor-pointer hover:bg-slate-50 transition-colors disabled:opacity-50">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-slate-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                </svg>
                <span>{analyzing ? '解析中...' : '选择相册'}</span>
                <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" disabled={analyzing} />
              </label>
            </div>
          </>
        ) : (
          <div className="relative overflow-hidden rounded-xl bg-black">
            <video 
              ref={videoRef} 
              autoPlay 
              playsInline 
              className="w-full h-64 object-cover"
            />
            <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-4">
              <button 
                onClick={stopCamera}
                className="p-3 bg-white/20 backdrop-blur-md text-white rounded-full hover:bg-white/30 transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              <button 
                onClick={takePhoto}
                className="w-14 h-14 bg-white rounded-full border-4 border-white/50 shadow-lg flex items-center justify-center active:scale-90 transition-transform"
              >
                <div className="w-10 h-10 bg-blue-600 rounded-full"></div>
              </button>
            </div>
          </div>
        )}
        
        <canvas ref={canvasRef} className="hidden" />

        {previewImage && !isCameraOpen && (
          <div className="mt-6">
            <p className="text-xs text-slate-400 mb-2 font-medium">最近识别：</p>
            <div className="relative inline-block group">
              <img src={previewImage} alt="Preview" className="max-w-[200px] mx-auto rounded-lg border border-slate-200 shadow-sm" />
              {analyzing && (
                <div className="absolute inset-0 bg-blue-600/20 backdrop-blur-[2px] rounded-lg flex items-center justify-center">
                  <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      <div className="bg-slate-900 rounded-2xl p-6 text-white overflow-hidden relative">
        <div className="relative z-10">
          <div className="flex items-center space-x-2 mb-2">
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
            <h3 className="font-bold text-lg">AI 智能分析攻略</h3>
          </div>
          <p className="text-slate-400 text-sm mb-6">根据您绑定的 {userCards.length} 张银行卡，为您规划今日最优路径</p>
          
          <button 
            onClick={generateStrategy}
            className="w-full py-3 bg-white text-slate-900 rounded-xl font-bold hover:bg-slate-100 transition-colors disabled:opacity-50"
            disabled={analyzing}
          >
            {analyzing ? (
              <span className="flex items-center justify-center">
                <div className="w-4 h-4 border-2 border-slate-900 border-t-transparent rounded-full animate-spin mr-2"></div>
                AI 正在计算...
              </span>
            ) : '生成今日获利攻略'}
          </button>

          {strategy && (
            <div className="mt-6 bg-white/10 rounded-xl p-4 text-sm leading-relaxed whitespace-pre-wrap border border-white/5 text-slate-200">
              {strategy}
            </div>
          )}
        </div>
        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 blur-3xl rounded-full -mr-10 -mt-10"></div>
      </div>
    </div>
  );
};

export default AIAnalyzer;

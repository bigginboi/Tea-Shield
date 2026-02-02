import { useRef, useState, useCallback } from 'react';
import { Camera, Upload, X, Loader2, Leaf } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { analyzeLeafImage, AnalysisResult } from '@/lib/diseaseAnalyzer';

interface ImageUploaderProps {
  onAnalysisComplete: (result: AnalysisResult, imageUrl: string) => void;
}

export function ImageUploader({ onAnalysisComplete }: ImageUploaderProps) {
  const { t } = useLanguage();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  const [isCapturing, setIsCapturing] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);

  const startCamera = useCallback(async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } }
      });
      setStream(mediaStream);
      setIsCapturing(true);
      
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (error) {
      console.error('Camera access error:', error);
      fileInputRef.current?.click();
    }
  }, []);

  const stopCamera = useCallback(() => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    setIsCapturing(false);
  }, [stream]);

  const capturePhoto = useCallback(async () => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    if (!ctx) return;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    ctx.drawImage(video, 0, 0);

    const imageUrl = canvas.toDataURL('image/jpeg', 0.9);
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

    stopCamera();
    setIsAnalyzing(true);

    try {
      const result = await analyzeLeafImage(imageData);
      onAnalysisComplete(result, imageUrl);
    } finally {
      setIsAnalyzing(false);
    }
  }, [stopCamera, onAnalysisComplete]);

  const handleFileUpload = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsAnalyzing(true);

    const img = new Image();
    const imageUrl = URL.createObjectURL(file);
    
    img.onload = async () => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const maxSize = 1024;
      let width = img.width;
      let height = img.height;
      
      if (width > maxSize || height > maxSize) {
        const ratio = Math.min(maxSize / width, maxSize / height);
        width *= ratio;
        height *= ratio;
      }

      canvas.width = width;
      canvas.height = height;
      ctx.drawImage(img, 0, 0, width, height);

      const imageData = ctx.getImageData(0, 0, width, height);

      try {
        const result = await analyzeLeafImage(imageData);
        onAnalysisComplete(result, imageUrl);
      } finally {
        setIsAnalyzing(false);
      }
    };

    img.src = imageUrl;
    event.target.value = '';
  }, [onAnalysisComplete]);

  if (isAnalyzing) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-6 fade-in">
        <div className="relative">
          <div className="w-24 h-24 rounded-full hero-gradient flex items-center justify-center shadow-glow">
            <Leaf className="w-12 h-12 text-primary-foreground animate-leaf-sway" />
          </div>
          <div className="absolute inset-0 rounded-full border-4 border-primary/30 animate-ping" />
          <div className="absolute -inset-2 rounded-full border-2 border-primary/20 animate-pulse" />
        </div>
        <div className="text-center space-y-2">
          <p className="text-foreground font-semibold text-lg">Analyzing leaf...</p>
          <p className="text-muted-foreground text-sm">Processing color patterns</p>
        </div>
      </div>
    );
  }

  if (isCapturing) {
    return (
      <div className="relative rounded-2xl overflow-hidden bg-foreground/5 fade-in shadow-card">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className="w-full aspect-[4/3] object-cover"
        />
        
        {/* Overlay guide */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-8 border-2 border-primary-foreground/60 rounded-2xl" />
          <div className="absolute inset-10 border border-primary-foreground/30 rounded-xl" />
          
          {/* Corner markers */}
          <div className="absolute top-6 left-6 w-8 h-8 border-t-4 border-l-4 border-primary-foreground/80 rounded-tl-lg" />
          <div className="absolute top-6 right-6 w-8 h-8 border-t-4 border-r-4 border-primary-foreground/80 rounded-tr-lg" />
          <div className="absolute bottom-20 left-6 w-8 h-8 border-b-4 border-l-4 border-primary-foreground/80 rounded-bl-lg" />
          <div className="absolute bottom-20 right-6 w-8 h-8 border-b-4 border-r-4 border-primary-foreground/80 rounded-br-lg" />
          
          <div className="absolute bottom-24 left-0 right-0 text-center">
            <p className="text-primary-foreground text-sm bg-foreground/50 inline-block px-5 py-2.5 rounded-full backdrop-blur-sm font-medium">
              {t('cameraHint')}
            </p>
          </div>
        </div>

        {/* Controls */}
        <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-4">
          <Button
            variant="outline"
            size="icon"
            onClick={stopCamera}
            className="w-14 h-14 rounded-full bg-background/90 backdrop-blur-sm border-2 hover-lift"
          >
            <X className="h-6 w-6" />
          </Button>
          
          <Button
            size="icon"
            onClick={capturePhoto}
            className="w-20 h-20 rounded-full hero-gradient shadow-elevated hover-lift"
          >
            <Camera className="h-8 w-8" />
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 slide-up">
      <div className="grid grid-cols-2 gap-4">
        <Button
          onClick={startCamera}
          className="h-36 flex-col gap-4 hero-gradient text-primary-foreground hover:opacity-95 transition-all duration-300 rounded-2xl shadow-card hover-lift group"
        >
          <div className="w-14 h-14 rounded-xl bg-primary-foreground/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
            <Camera className="h-7 w-7" />
          </div>
          <span className="font-bold text-base">{t('capturePhoto')}</span>
        </Button>

        <Button
          variant="outline"
          onClick={() => fileInputRef.current?.click()}
          className="h-36 flex-col gap-4 bg-card hover:bg-secondary transition-all duration-300 rounded-2xl border-2 border-dashed border-border hover:border-primary/50 hover-lift group"
        >
          <div className="w-14 h-14 rounded-xl bg-secondary flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
            <Upload className="h-7 w-7 text-muted-foreground group-hover:text-primary transition-colors" />
          </div>
          <span className="font-bold text-base text-foreground">{t('uploadImage')}</span>
        </Button>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileUpload}
        className="hidden"
      />

      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
}

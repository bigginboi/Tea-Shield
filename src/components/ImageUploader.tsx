import { useRef, useState, useCallback } from 'react';
import { Camera, Upload, X, Loader2 } from 'lucide-react';
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
      // Fallback to file upload
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

      // Resize if too large
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
    
    // Reset input
    event.target.value = '';
  }, [onAnalysisComplete]);

  if (isAnalyzing) {
    return (
      <div className="flex flex-col items-center justify-center py-16 gap-4 fade-in">
        <div className="relative">
          <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">
            <Loader2 className="w-10 h-10 text-primary animate-spin" />
          </div>
          <div className="absolute inset-0 rounded-full border-4 border-primary/20 animate-ping" />
        </div>
        <p className="text-muted-foreground font-medium">Analyzing leaf...</p>
      </div>
    );
  }

  if (isCapturing) {
    return (
      <div className="relative rounded-2xl overflow-hidden bg-foreground/5 fade-in">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className="w-full aspect-[4/3] object-cover"
        />
        
        {/* Overlay guide */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-8 border-2 border-primary-foreground/50 rounded-xl" />
          <div className="absolute bottom-20 left-0 right-0 text-center">
            <p className="text-primary-foreground/90 text-sm bg-foreground/40 inline-block px-4 py-2 rounded-full backdrop-blur-sm">
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
            className="w-12 h-12 rounded-full bg-background/80 backdrop-blur-sm"
          >
            <X className="h-5 w-5" />
          </Button>
          
          <Button
            size="icon"
            onClick={capturePhoto}
            className="w-16 h-16 rounded-full hero-gradient shadow-elevated"
          >
            <Camera className="h-7 w-7" />
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
          className="h-32 flex-col gap-3 hero-gradient text-primary-foreground hover:opacity-90 transition-opacity rounded-2xl shadow-card"
        >
          <Camera className="h-8 w-8" />
          <span className="font-semibold">{t('capturePhoto')}</span>
        </Button>

        <Button
          variant="outline"
          onClick={() => fileInputRef.current?.click()}
          className="h-32 flex-col gap-3 bg-card hover:bg-secondary transition-colors rounded-2xl border-2 border-dashed border-border"
        >
          <Upload className="h-8 w-8 text-muted-foreground" />
          <span className="font-semibold text-foreground">{t('uploadImage')}</span>
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

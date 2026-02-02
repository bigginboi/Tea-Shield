import { useRef, useState, useCallback, useEffect } from 'react';
import { Camera, Upload, X, Leaf } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { AnalysisResult } from '@/lib/diseaseAnalyzer';
import { analyzeTeaLeafImage } from '@/lib/mlAnalyzer';

interface ImageUploaderProps {
  onAnalysisComplete: (result: AnalysisResult, imageUrl: string) => void;
}

export function ImageUploader({ onAnalysisComplete }: ImageUploaderProps) {
  const { t } = useLanguage();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  
  const [isCapturing, setIsCapturing] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [cameraReady, setCameraReady] = useState(false);

  // Attach stream to video element after component renders
  useEffect(() => {
    if (isCapturing && stream && videoRef.current) {
      videoRef.current.srcObject = stream;
      videoRef.current.play().catch(console.error);
    }
  }, [isCapturing, stream]);

  // Cleanup stream on unmount
  useEffect(() => {
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [stream]);

  const startCamera = useCallback(async () => {
    try {
      setCameraReady(false);
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { 
          facingMode: 'environment', 
          width: { ideal: 640 }, 
          height: { ideal: 480 } 
        }
      });
      setStream(mediaStream);
      setIsCapturing(true);
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
    setCameraReady(false);
  }, [stream]);

  const handleVideoReady = useCallback(() => {
    setCameraReady(true);
  }, []);

  const processAndAnalyze = useCallback((canvas: HTMLCanvasElement, imageUrl: string) => {
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      setIsAnalyzing(false);
      return;
    }

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    
    // Run analysis synchronously (it's now fast with sampling)
    const result = analyzeTeaLeafImage(imageData);
    console.log('Analysis complete:', result.processingTimeMs.toFixed(0), 'ms');
    
    onAnalysisComplete(result, imageUrl);
    setIsAnalyzing(false);
  }, [onAnalysisComplete]);

  const capturePhoto = useCallback(() => {
    if (!videoRef.current) return;

    const video = videoRef.current;
    
    if (video.videoWidth === 0 || video.videoHeight === 0) {
      console.error('Video not ready');
      return;
    }

    // Create canvas for capture
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.drawImage(video, 0, 0);
    const imageUrl = canvas.toDataURL('image/jpeg', 0.85);

    stopCamera();
    setIsAnalyzing(true);

    // Process immediately
    requestAnimationFrame(() => {
      processAndAnalyze(canvas, imageUrl);
    });
  }, [stopCamera, processAndAnalyze]);

  const handleFileUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsAnalyzing(true);

    const img = new Image();
    const imageUrl = URL.createObjectURL(file);
    
    img.onload = () => {
      // Create canvas for processing
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        setIsAnalyzing(false);
        return;
      }

      // Resize large images for faster processing
      const maxSize = 512;
      let width = img.width;
      let height = img.height;
      
      if (width > maxSize || height > maxSize) {
        const ratio = Math.min(maxSize / width, maxSize / height);
        width = Math.round(width * ratio);
        height = Math.round(height * ratio);
      }

      canvas.width = width;
      canvas.height = height;
      ctx.drawImage(img, 0, 0, width, height);

      // Process immediately
      requestAnimationFrame(() => {
        processAndAnalyze(canvas, imageUrl);
      });
    };

    img.onerror = () => {
      console.error('Failed to load image');
      setIsAnalyzing(false);
    };

    img.src = imageUrl;
    event.target.value = '';
  }, [processAndAnalyze]);

  if (isAnalyzing) {
    return (
      <div className="flex flex-col items-center justify-center py-16 gap-5 fade-in">
        <div className="relative">
          <div className="w-20 h-20 rounded-full hero-gradient flex items-center justify-center shadow-glow">
            <Leaf className="w-10 h-10 text-primary-foreground animate-leaf-sway" />
          </div>
          <div className="absolute inset-0 rounded-full border-4 border-primary/30 animate-ping" />
        </div>
        <div className="text-center space-y-1">
          <p className="text-foreground font-semibold">Analyzing leaf...</p>
          <p className="text-muted-foreground text-sm">Processing color patterns</p>
        </div>
      </div>
    );
  }

  if (isCapturing) {
    return (
      <div className="relative rounded-2xl overflow-hidden bg-black fade-in shadow-card">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          onLoadedMetadata={handleVideoReady}
          onCanPlay={handleVideoReady}
          className="w-full aspect-[4/3] object-cover"
        />
        
        {!cameraReady && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/80">
            <div className="text-center space-y-3">
              <div className="w-10 h-10 border-3 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
              <p className="text-white text-sm">Starting camera...</p>
            </div>
          </div>
        )}
        
        {cameraReady && (
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute inset-8 border-2 border-white/50 rounded-2xl" />
            <div className="absolute top-6 left-6 w-6 h-6 border-t-3 border-l-3 border-white/70 rounded-tl-lg" />
            <div className="absolute top-6 right-6 w-6 h-6 border-t-3 border-r-3 border-white/70 rounded-tr-lg" />
            <div className="absolute bottom-20 left-6 w-6 h-6 border-b-3 border-l-3 border-white/70 rounded-bl-lg" />
            <div className="absolute bottom-20 right-6 w-6 h-6 border-b-3 border-r-3 border-white/70 rounded-br-lg" />
            
            <div className="absolute bottom-24 left-0 right-0 text-center">
              <p className="text-white text-sm bg-black/50 inline-block px-4 py-2 rounded-full">
                Position leaf in frame
              </p>
            </div>
          </div>
        )}

        <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-4">
          <Button
            variant="outline"
            size="icon"
            onClick={stopCamera}
            className="w-12 h-12 rounded-full bg-white/90 backdrop-blur-sm"
          >
            <X className="h-5 w-5" />
          </Button>
          
          <Button
            size="icon"
            onClick={capturePhoto}
            disabled={!cameraReady}
            className="w-16 h-16 rounded-full hero-gradient shadow-elevated disabled:opacity-50"
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
          className="h-32 flex-col gap-3 hero-gradient text-primary-foreground hover:opacity-95 rounded-2xl shadow-card hover-lift group"
        >
          <div className="w-12 h-12 rounded-xl bg-primary-foreground/20 flex items-center justify-center group-hover:scale-110 transition-transform">
            <Camera className="h-6 w-6" />
          </div>
          <span className="font-bold">{t('capturePhoto')}</span>
        </Button>

        <Button
          variant="outline"
          onClick={() => fileInputRef.current?.click()}
          className="h-32 flex-col gap-3 bg-card hover:bg-secondary rounded-2xl border-2 border-dashed hover:border-primary/50 hover-lift group"
        >
          <div className="w-12 h-12 rounded-xl bg-secondary flex items-center justify-center group-hover:scale-110 transition-transform">
            <Upload className="h-6 w-6 text-muted-foreground group-hover:text-primary" />
          </div>
          <span className="font-bold text-foreground">{t('uploadImage')}</span>
        </Button>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileUpload}
        className="hidden"
      />
    </div>
  );
}

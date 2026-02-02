import { useRef, useState, useCallback, useEffect } from 'react';
import { Camera, Upload, X, Leaf, Brain } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { AnalysisResult, DiseaseType, SeverityLevel } from '@/lib/diseaseAnalyzer';
import { analyzeTeaLeafImage } from '@/lib/mlAnalyzer';
import { toast } from 'sonner';

// Lazy load supabase to avoid crash if env vars are missing
let supabaseClient: any = null;
const getSupabase = async () => {
  if (!supabaseClient) {
    try {
      const { supabase } = await import('@/integrations/supabase/client');
      supabaseClient = supabase;
    } catch (e) {
      console.warn('Supabase client not available, using local analysis');
      return null;
    }
  }
  return supabaseClient;
};

interface ImageUploaderProps {
  onAnalysisComplete: (result: AnalysisResult, imageUrl: string) => void;
}

interface AIAnalysisResponse {
  disease: DiseaseType;
  confidence: number;
  severity: SeverityLevel;
  severityPercentage: number;
  reasoning?: string;
  error?: string;
}

export function ImageUploader({ onAnalysisComplete }: ImageUploaderProps) {
  const { t } = useLanguage();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  
  const [isCapturing, setIsCapturing] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [cameraReady, setCameraReady] = useState(false);
  const [analysisStatus, setAnalysisStatus] = useState('');

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

  const analyzeWithLocalML = useCallback((imageBase64: string, imageUrl: string) => {
    setAnalysisStatus('Analyzing with local ML...');
    const startTime = performance.now();
    
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
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
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        setIsAnalyzing(false);
        return;
      }
      ctx.drawImage(img, 0, 0, width, height);
      
      const imageData = ctx.getImageData(0, 0, width, height);
      const result = analyzeTeaLeafImage(imageData);
      
      console.log('Local ML Analysis complete:', (performance.now() - startTime).toFixed(0), 'ms');
      onAnalysisComplete(result, imageUrl);
      setIsAnalyzing(false);
    };
    img.onerror = () => {
      toast.error('Failed to process image');
      setIsAnalyzing(false);
    };
    img.src = imageBase64;
  }, [onAnalysisComplete]);

  const analyzeWithAI = useCallback(async (imageBase64: string, imageUrl: string) => {
    setAnalysisStatus('Connecting to AI...');
    
    const startTime = performance.now();
    
    try {
      // Try to get Supabase client
      const supabase = await getSupabase();
      
      if (!supabase) {
        console.log('Supabase not available, falling back to local ML');
        setAnalysisStatus('Using local analysis...');
        analyzeWithLocalML(imageBase64, imageUrl);
        return;
      }

      setAnalysisStatus('Sending to AI model...');
      
      const response = await supabase.functions.invoke('analyze-leaf', {
        body: { imageBase64 }
      });
      
      const { data, error } = response as { data: AIAnalysisResponse | null; error: Error | null };

      if (error) {
        console.error('Edge function error:', error);
        throw new Error(error.message || 'Analysis failed');
      }

      if (!data || data.error) {
        throw new Error(data?.error || 'No analysis result');
      }

      const processingTimeMs = performance.now() - startTime;
      console.log('AI Analysis complete:', processingTimeMs.toFixed(0), 'ms', data);

      // Create full result object
      const result: AnalysisResult = {
        disease: data.disease,
        confidence: data.confidence,
        severity: data.severity,
        severityPercentage: data.severityPercentage,
        scores: {
          redRust: 0,
          algalLeafSpot: 0,
          birdsEyeSpot: 0,
          grayBlight: 0,
          blisterBlight: 0,
          anthracnose: 0,
          brownBlight: 0,
          healthy: 0,
          uncertain: 0,
          [data.disease]: data.confidence,
        },
        leafPixelCount: 0,
        infectedPixelCount: 0,
        processingTimeMs,
      };

      onAnalysisComplete(result, imageUrl);
      setIsAnalyzing(false);
      
    } catch (err) {
      console.error('AI analysis error:', err);
      const message = err instanceof Error ? err.message : 'Analysis failed';
      
      if (message.includes('Rate limit')) {
        toast.error('Too many requests. Please wait a moment and try again.');
        setIsAnalyzing(false);
      } else if (message.includes('credits')) {
        toast.error('AI credits exhausted. Please add credits to continue.');
        setIsAnalyzing(false);
      } else {
        // Fallback to local analysis
        console.log('AI failed, falling back to local ML');
        toast.info('Using local analysis');
        analyzeWithLocalML(imageBase64, imageUrl);
      }
    }
  }, [onAnalysisComplete, analyzeWithLocalML]);

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
    setAnalysisStatus('Preparing image...');

    // Send to AI for analysis
    analyzeWithAI(imageUrl, imageUrl);
  }, [stopCamera, analyzeWithAI]);

  const handleFileUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsAnalyzing(true);
    setAnalysisStatus('Loading image...');

    const reader = new FileReader();
    const imageUrl = URL.createObjectURL(file);
    
    reader.onload = () => {
      const base64 = reader.result as string;
      setAnalysisStatus('Preparing for analysis...');
      
      // Resize if too large (keep under 1MB for API)
      const img = new Image();
      img.onload = () => {
        const maxSize = 800;
        let width = img.width;
        let height = img.height;
        
        if (width > maxSize || height > maxSize) {
          const ratio = Math.min(maxSize / width, maxSize / height);
          width = Math.round(width * ratio);
          height = Math.round(height * ratio);
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          setIsAnalyzing(false);
          return;
        }
        ctx.drawImage(img, 0, 0, width, height);
        
        const resizedBase64 = canvas.toDataURL('image/jpeg', 0.85);
        analyzeWithAI(resizedBase64, imageUrl);
      };
      
      img.onerror = () => {
        console.error('Failed to load image');
        toast.error('Failed to load image');
        setIsAnalyzing(false);
      };
      
      img.src = base64;
    };

    reader.onerror = () => {
      console.error('Failed to read file');
      toast.error('Failed to read file');
      setIsAnalyzing(false);
    };

    reader.readAsDataURL(file);
    event.target.value = '';
  }, [analyzeWithAI]);

  if (isAnalyzing) {
    return (
      <div className="flex flex-col items-center justify-center py-16 gap-5 fade-in">
        <div className="relative">
          <div className="w-20 h-20 rounded-full hero-gradient flex items-center justify-center shadow-glow">
            <Brain className="w-10 h-10 text-primary-foreground animate-pulse" />
          </div>
          <div className="absolute inset-0 rounded-full border-4 border-primary/30 animate-ping" />
        </div>
        <div className="text-center space-y-1">
          <p className="text-foreground font-semibold">AI Analysis in Progress</p>
          <p className="text-muted-foreground text-sm">{analysisStatus}</p>
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
      {/* AI Badge */}
      <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
        <Brain className="h-4 w-4 text-primary" />
        <span>Powered by AI Vision Model</span>
      </div>
      
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

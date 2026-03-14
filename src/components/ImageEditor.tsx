import { useState, useRef } from 'react';
import { GoogleGenAI } from '@google/genai';
import { Upload, Image as ImageIcon, Loader2, Download, Wand2, AlertCircle } from 'lucide-react';

const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_GEMINI_API_KEY || import.meta.env.GEMINI_API_KEY });

export default function ImageEditor() {
  const [image, setImage] = useState<string | null>(null);
  const [mimeType, setMimeType] = useState<string>('');
  const [prompt, setPrompt] = useState('');
  const [resultImage, setResultImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setMimeType(file.type);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
        setResultImage(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleEdit = async () => {
    if (!image || !prompt) return;
    setLoading(true);
    setError(null);
    try {
      const base64Data = image.split(',')[1];
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: {
          parts: [
            {
              inlineData: {
                data: base64Data,
                mimeType: mimeType,
              },
            },
            {
              text: prompt,
            },
          ],
        },
      });

      let foundImage = false;
      for (const part of response.candidates?.[0]?.content?.parts || []) {
        if (part.inlineData) {
          const resultBase64 = part.inlineData.data;
          setResultImage(`data:image/png;base64,${resultBase64}`);
          foundImage = true;
          break;
        }
      }
      if (!foundImage) {
        setError("No image returned from the model. Please try a different prompt.");
      }
    } catch (err: any) {
      setError(err.message || "An error occurred while editing the image.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-full">
      <div className="flex flex-col gap-4">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-stone-200 flex-1 flex flex-col">
          <h2 className="text-lg font-medium mb-4 flex items-center gap-2">
            <Upload className="w-5 h-5 text-indigo-500" />
            Upload Original
          </h2>
          
          <div 
            className={`flex-1 border-2 border-dashed rounded-xl flex flex-col items-center justify-center p-6 transition-colors ${
              image ? 'border-indigo-200 bg-indigo-50/30' : 'border-stone-300 hover:border-indigo-400 bg-stone-50'
            }`}
          >
            {image ? (
              <div className="relative w-full h-full min-h-[300px] flex items-center justify-center">
                <img src={image} alt="Original" className="max-w-full max-h-[400px] object-contain rounded-lg shadow-sm" />
                <button 
                  onClick={() => { setImage(null); setResultImage(null); }}
                  className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm text-stone-700 p-2 rounded-full shadow-sm hover:bg-white transition-colors"
                >
                  <Upload className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="text-center">
                <div className="bg-white p-4 rounded-full shadow-sm inline-block mb-4">
                  <ImageIcon className="w-8 h-8 text-indigo-500" />
                </div>
                <p className="text-stone-600 font-medium mb-1">Click to upload an image</p>
                <p className="text-stone-400 text-sm mb-4">PNG, JPG, WEBP up to 10MB</p>
                <button 
                  onClick={() => fileInputRef.current?.click()}
                  className="bg-white border border-stone-200 text-stone-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-stone-50 transition-colors shadow-sm"
                >
                  Select File
                </button>
              </div>
            )}
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleImageUpload} 
              accept="image/*" 
              className="hidden" 
            />
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-stone-200">
          <h2 className="text-lg font-medium mb-4 flex items-center gap-2">
            <Wand2 className="w-5 h-5 text-indigo-500" />
            Edit Instructions
          </h2>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Describe how you want to edit the image..."
            className="w-full h-24 p-3 border border-stone-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none text-sm"
          />
          <button
            onClick={handleEdit}
            disabled={!image || !prompt || loading}
            className="w-full mt-4 bg-indigo-600 text-white py-2.5 rounded-xl font-medium hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Applying Magic...
              </>
            ) : (
              <>
                <Wand2 className="w-5 h-5" />
                Generate Edit
              </>
            )}
          </button>
          {error && (
            <div className="mt-4 p-3 bg-red-50 text-red-700 rounded-lg text-sm flex items-start gap-2">
              <AlertCircle className="w-5 h-5 shrink-0" />
              <p>{error}</p>
            </div>
          )}
        </div>
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-sm border border-stone-200 flex flex-col">
        <h2 className="text-lg font-medium mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ImageIcon className="w-5 h-5 text-indigo-500" />
            Result
          </div>
          {resultImage && (
            <a 
              href={resultImage} 
              download="edited-image.png"
              className="text-sm font-medium text-indigo-600 hover:text-indigo-700 flex items-center gap-1 bg-indigo-50 px-3 py-1.5 rounded-lg transition-colors"
            >
              <Download className="w-4 h-4" />
              Download
            </a>
          )}
        </h2>
        
        <div className="flex-1 border border-stone-200 rounded-xl bg-stone-50 flex items-center justify-center overflow-hidden relative min-h-[400px]">
          {loading ? (
            <div className="flex flex-col items-center text-stone-400">
              <Loader2 className="w-8 h-8 animate-spin mb-2 text-indigo-500" />
              <p className="text-sm font-medium">Processing image...</p>
              <p className="text-xs mt-1">This might take a few seconds</p>
            </div>
          ) : resultImage ? (
            <img src={resultImage} alt="Result" className="max-w-full max-h-full object-contain" />
          ) : (
            <div className="text-stone-400 text-center flex flex-col items-center">
              <ImageIcon className="w-12 h-12 mb-2 opacity-50" />
              <p className="text-sm">Your edited image will appear here</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

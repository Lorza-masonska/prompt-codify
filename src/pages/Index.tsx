import { useState } from 'react';
import { Header } from '@/components/Header';
import { ChatPanel } from '@/components/ChatPanel';
import { PreviewPanel } from '@/components/PreviewPanel';

const Index = () => {
  const [generatedCode, setGeneratedCode] = useState('');
  const [currentFilename, setCurrentFilename] = useState('');

  const handleCodeGenerated = (code: string, filename: string) => {
    setGeneratedCode(code);
    setCurrentFilename(filename);
  };

  return (
    <div className="h-screen flex flex-col bg-background">
      {/* Header */}
      <Header />
      
      {/* Main Content - Two Column Layout */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Panel - Chat */}
        <div className="w-1/2 min-w-[400px]">
          <ChatPanel onCodeGenerated={handleCodeGenerated} />
        </div>
        
        {/* Right Panel - Preview */}
        <div className="flex-1">
          <PreviewPanel code={generatedCode} filename={currentFilename} />
        </div>
      </div>
    </div>
  );
};

export default Index;

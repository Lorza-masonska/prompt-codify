import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { AIConfigDialog } from '@/components/AIConfigDialog';
import { Zap, Download, Github } from 'lucide-react';
import { useEffect, useState } from 'react';
import { aiService } from '@/services/aiService';

export function Header() {
  const [aiStatus, setAiStatus] = useState({
    isConfigured: false,
    provider: 'Brak konfiguracji'
  });

  useEffect(() => {
    const updateStatus = () => {
      setAiStatus({
        isConfigured: aiService.isConfigured(),
        provider: aiService.getProviderName()
      });
    };

    updateStatus();
    
    // Listen for AI settings changes
    window.addEventListener('ai-settings-changed', updateStatus);
    return () => window.removeEventListener('ai-settings-changed', updateStatus);
  }, []);

  return (
    <Card className="bg-gradient-surface border-border shadow-medium">
      <div className="px-6 py-4 flex items-center justify-between">
        {/* Logo and Title */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-primary rounded-lg flex items-center justify-center shadow-glow">
            <Zap className="w-6 h-6 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-xl font-bold gradient-text">AI Code Generator</h1>
            <p className="text-xs text-muted-foreground">Lokalna integracja AI • React App</p>
          </div>
        </div>

        {/* Status and Info */}
        <div className="flex items-center gap-4">
          <div className="text-right">
            <div className="flex items-center gap-2 text-sm">
              <div className={`w-2 h-2 rounded-full ${
                aiStatus.isConfigured 
                  ? 'bg-success animate-pulse-soft' 
                  : 'bg-warning'
              }`}></div>
              <span className="text-muted-foreground">
                {aiStatus.isConfigured ? 'AI skonfigurowane' : 'Wymaga konfiguracji'}
              </span>
            </div>
            <p className="text-xs text-muted-foreground">{aiStatus.provider}</p>
          </div>
          
          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              className="h-9 px-3"
            >
              <Github className="w-4 h-4 mr-2" />
              Export
            </Button>
            
            <AIConfigDialog />
          </div>
        </div>
      </div>
    </Card>
  );
}
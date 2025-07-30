import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Download, Code, Eye, RefreshCw, Smartphone, Monitor } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PreviewPanelProps {
  code: string;
  filename: string;
}

// Funkcja usuwająca nagłówki, Markdown i inne zbędne fragmenty
function extractPureHtml(code: string) {
  if (!code) return '';
  // Usuń nagłówki pliku (np. "index.html" na początku linii)
  code = code.replace(/^index\.html\s*/i, '');
  // Usuń "CODE:" jeśli występuje
  code = code.replace(/^CODE:\s*/i, '');
  // Usuń znaczniki Markdown ```html ... ```
  code = code.replace(/^```html([\s\S]*?)```$/i, '$1').trim();
  // Usuń ogólne znaczniki Markdown ``` ... ```
  code = code.replace(/^```([\s\S]*?)```$/i, '$1').trim();
  return code;
}

export function PreviewPanel({ code, filename }: PreviewPanelProps) {
  const [viewMode, setViewMode] = useState<'preview' | 'code'>('preview');
  const [deviceMode, setDeviceMode] = useState<'desktop' | 'mobile'>('desktop');
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleDownload = () => {
    const blob = new Blob([code], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename || 'generated-code.html';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleDownloadZip = async () => {
    const files = [
      { name: filename || 'index.html', content: code }
    ];
    const zipContent = files.map(file => 
      `File: ${file.name}\n${'='.repeat(50)}\n${file.content}\n\n`
    ).join('');
    const blob = new Blob([zipContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'generated-project.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const refreshPreview = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 500);
  };

  if (!code) {
    return (
      <div className="h-full flex items-center justify-center bg-surface border-l border-border">
        <div className="text-center animate-fade-in">
          <div className="w-24 h-24 mx-auto mb-6 bg-gradient-glow rounded-full flex items-center justify-center">
            <Code className="w-12 h-12 text-primary animate-pulse-soft" />
          </div>
          <h3 className="text-xl font-semibold mb-2 gradient-text">
            Gotowy na kreację?
          </h3>
          <p className="text-muted-foreground max-w-md">
            Wpisz prompt w panelu czatu, a wygenerowany kod pojawi się tutaj w czasie rzeczywistym
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-surface">
      {/* Header with controls */}
      <div className="p-4 border-b border-border bg-gradient-surface flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h3 className="font-semibold text-foreground">Live Preview</h3>
          <span className="text-xs bg-success/20 text-success px-2 py-1 rounded-full">
            {filename}
          </span>
        </div>
        
        <div className="flex items-center gap-2">
          {/* View Mode Toggle */}
          <div className="flex bg-muted rounded-lg p-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setViewMode('preview')}
              className={cn(
                "h-8 px-3",
                viewMode === 'preview' && "bg-background shadow-sm"
              )}
            >
              <Eye className="w-4 h-4 mr-1" />
              Preview
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setViewMode('code')}
              className={cn(
                "h-8 px-3",
                viewMode === 'code' && "bg-background shadow-sm"
              )}
            >
              <Code className="w-4 h-4 mr-1" />
              Code
            </Button>
          </div>
          
          {/* Device Mode Toggle (tylko dla preview) */}
          {viewMode === 'preview' && (
            <div className="flex bg-muted rounded-lg p-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setDeviceMode('desktop')}
                className={cn(
                  "h-8 px-2",
                  deviceMode === 'desktop' && "bg-background shadow-sm"
                )}
              >
                <Monitor className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setDeviceMode('mobile')}
                className={cn(
                  "h-8 px-2",
                  deviceMode === 'mobile' && "bg-background shadow-sm"
                )}
              >
                <Smartphone className="w-4 h-4" />
              </Button>
            </div>
          )}
          
          {/* Actions */}
          <Button
            variant="ghost"
            size="sm"
            onClick={refreshPreview}
            disabled={isRefreshing}
            className="h-8 px-2"
          >
            <RefreshCw className={cn("w-4 h-4", isRefreshing && "animate-spin")} />
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={handleDownload}
            className="h-8 px-2"
          >
            <Download className="w-4 h-4" />
          </Button>
          
          <Button
            onClick={handleDownloadZip}
            className="h-8 px-3 bg-gradient-primary hover:opacity-90 text-primary-foreground"
            size="sm"
          >
            <Download className="w-4 h-4 mr-1" />
            ZIP
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-hidden">
        {viewMode === 'preview' ? (
          <div className="h-full p-4 bg-preview-background">
            <div 
              className={cn(
                "h-full mx-auto bg-white rounded-lg shadow-strong overflow-hidden transition-all duration-300",
                deviceMode === 'mobile' ? "max-w-sm" : "w-full"
              )}
            >
              <iframe
                key={isRefreshing ? 'refreshing' : 'normal'}
                srcDoc={extractPureHtml(code)}
                className="w-full h-full border-0"
                title="Code Preview"
                sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-modals"
                onLoad={() => console.log('Iframe loaded successfully')}
                onError={(e) => console.error('Iframe error:', e)}
              />
            </div>
          </div>
        ) : (
          <div className="h-full bg-card">
            <pre className="h-full overflow-auto p-4 text-sm font-mono">
              <code className="text-card-foreground whitespace-pre-wrap">
                {code}
              </code>
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}

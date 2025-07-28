import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Zap, Download, Github, Settings } from 'lucide-react';

export function Header() {
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
            <p className="text-xs text-muted-foreground">Lokalny model AI • Windows App</p>
          </div>
        </div>

        {/* Status and Info */}
        <div className="flex items-center gap-4">
          <div className="text-right">
            <div className="flex items-center gap-2 text-sm">
              <div className="w-2 h-2 bg-success rounded-full animate-pulse-soft"></div>
              <span className="text-muted-foreground">Model AI gotowy</span>
            </div>
            <p className="text-xs text-muted-foreground">local_model/code-generator.bin</p>
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
            
            <Button
              variant="ghost"
              size="sm"
              className="h-9 px-3"
            >
              <Settings className="w-4 h-4 mr-2" />
              Ustawienia
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
}
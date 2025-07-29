import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Settings, Key, Trash2, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface AIProvider {
  id: string;
  name: string;
  apiKeyLabel: string;
  baseUrlLabel?: string;
  models: string[];
  defaultModel: string;
  requiresBaseUrl?: boolean;
}

const AI_PROVIDERS: AIProvider[] = [
  {
    id: 'openai',
    name: 'OpenAI',
    apiKeyLabel: 'OpenAI API Key',
    models: ['gpt-4.1-2025-04-14', 'gpt-3.5-turbo', 'gpt-4o-mini'],
    defaultModel: 'gpt-4.1-2025-04-14'
  },
  {
    id: 'anthropic',
    name: 'Anthropic Claude',
    apiKeyLabel: 'Anthropic API Key',
    models: ['claude-3-5-sonnet-20241022', 'claude-3-haiku-20240307'],
    defaultModel: 'claude-3-5-sonnet-20241022'
  },
  {
    id: 'ollama',
    name: 'Ollama (Lokalny)',
    apiKeyLabel: 'Token (opcjonalny)',
    baseUrlLabel: 'Ollama URL',
    models: ['llama3.2:3b', 'codellama:7b', 'deepseek-coder:6.7b'],
    defaultModel: 'llama3.2:3b',
    requiresBaseUrl: true
  },
  {
    id: 'huggingface',
    name: 'Hugging Face',
    apiKeyLabel: 'HF Token (opcjonalny)',
    models: ['microsoft/DialoGPT-medium', 'facebook/blenderbot-400M-distill'],
    defaultModel: 'microsoft/DialoGPT-medium'
  }
];

interface AISettings {
  provider: string;
  apiKey: string;
  baseUrl?: string;
  model: string;
}

export function AIConfigDialog() {
  const [open, setOpen] = useState(false);
  const [settings, setSettings] = useState<AISettings>({
    provider: 'openai',
    apiKey: '',
    baseUrl: '',
    model: 'gpt-4.1-2025-04-14'
  });
  const { toast } = useToast();

  useEffect(() => {
    // Load settings from localStorage
    const saved = localStorage.getItem('ai-settings');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setSettings(parsed);
      } catch (error) {
        console.error('Error loading AI settings:', error);
      }
    }
  }, []);

  const saveSettings = () => {
    const currentProvider = AI_PROVIDERS.find(p => p.id === settings.provider);
    
    if (!currentProvider) {
      toast({
        title: "Błąd",
        description: "Wybierz dostawcę AI",
        variant: "destructive"
      });
      return;
    }

    // Validate required fields
    if (currentProvider.id !== 'huggingface' && currentProvider.id !== 'ollama' && !settings.apiKey.trim()) {
      toast({
        title: "Błąd",
        description: `${currentProvider.apiKeyLabel} jest wymagany`,
        variant: "destructive"
      });
      return;
    }

    if (currentProvider.requiresBaseUrl && !settings.baseUrl?.trim()) {
      toast({
        title: "Błąd",
        description: `${currentProvider.baseUrlLabel} jest wymagany`,
        variant: "destructive"
      });
      return;
    }

    try {
      localStorage.setItem('ai-settings', JSON.stringify(settings));
      toast({
        title: "Zapisano",
        description: "Ustawienia AI zostały zapisane",
      });
      setOpen(false);
      
      // Trigger reload of AI service
      window.dispatchEvent(new CustomEvent('ai-settings-changed', { detail: settings }));
    } catch (error) {
      toast({
        title: "Błąd",
        description: "Nie udało się zapisać ustawień",
        variant: "destructive"
      });
    }
  };

  const clearSettings = () => {
    localStorage.removeItem('ai-settings');
    setSettings({
      provider: 'openai',
      apiKey: '',
      baseUrl: '',
      model: 'gpt-4.1-2025-04-14'
    });
    toast({
      title: "Wyczyszczono",
      description: "Ustawienia AI zostały usunięte",
    });
    window.dispatchEvent(new CustomEvent('ai-settings-changed', { detail: null }));
  };

  const currentProvider = AI_PROVIDERS.find(p => p.id === settings.provider);

  const handleProviderChange = (providerId: string) => {
    const provider = AI_PROVIDERS.find(p => p.id === providerId);
    if (provider) {
      setSettings({
        ...settings,
        provider: providerId,
        model: provider.defaultModel,
        baseUrl: provider.id === 'ollama' ? 'http://localhost:11434' : ''
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="h-9 px-3">
          <Settings className="w-4 h-4 mr-2" />
          Konfiguracja AI
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Key className="w-5 h-5" />
            Konfiguracja Modelu AI
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          {/* Warning about API keys */}
          <Card className="p-4 bg-warning/10 border-warning/20">
            <div className="flex gap-3">
              <AlertCircle className="w-5 h-5 text-warning flex-shrink-0 mt-0.5" />
              <div className="text-sm">
                <p className="font-medium mb-1">Bezpieczeństwo kluczy API</p>
                <p className="text-muted-foreground">
                  Klucze są przechowywane lokalnie w przeglądarce. Dla produkcji zalecamy integrację z Supabase.
                </p>
              </div>
            </div>
          </Card>

          {/* Provider Selection */}
          <div className="space-y-2">
            <Label htmlFor="provider">Dostawca AI</Label>
            <Select value={settings.provider} onValueChange={handleProviderChange}>
              <SelectTrigger>
                <SelectValue placeholder="Wybierz dostawcę AI" />
              </SelectTrigger>
              <SelectContent>
                {AI_PROVIDERS.map((provider) => (
                  <SelectItem key={provider.id} value={provider.id}>
                    {provider.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* API Key */}
          <div className="space-y-2">
            <Label htmlFor="apiKey">{currentProvider?.apiKeyLabel}</Label>
            <Input
              id="apiKey"
              type="password"
              value={settings.apiKey}
              onChange={(e) => setSettings({ ...settings, apiKey: e.target.value })}
              placeholder={
                currentProvider?.id === 'huggingface' 
                  ? "Opcjonalny - dla większego limitu"
                  : "Wprowadź klucz API"
              }
            />
          </div>

          {/* Base URL for Ollama */}
          {currentProvider?.requiresBaseUrl && (
            <div className="space-y-2">
              <Label htmlFor="baseUrl">{currentProvider.baseUrlLabel}</Label>
              <Input
                id="baseUrl"
                value={settings.baseUrl || ''}
                onChange={(e) => setSettings({ ...settings, baseUrl: e.target.value })}
                placeholder="http://localhost:11434"
              />
            </div>
          )}

          {/* Model Selection */}
          <div className="space-y-2">
            <Label htmlFor="model">Model</Label>
            <Select value={settings.model} onValueChange={(model) => setSettings({ ...settings, model })}>
              <SelectTrigger>
                <SelectValue placeholder="Wybierz model" />
              </SelectTrigger>
              <SelectContent>
                {currentProvider?.models.map((model) => (
                  <SelectItem key={model} value={model}>
                    {model}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Instructions for different providers */}
          {currentProvider && (
            <Card className="p-4 bg-muted/50">
              <h4 className="font-medium mb-2">Instrukcje dla {currentProvider.name}:</h4>
              <div className="text-sm text-muted-foreground space-y-1">
                {currentProvider.id === 'openai' && (
                  <>
                    <p>• Uzyskaj klucz API z: platform.openai.com</p>
                    <p>• Format: sk-...</p>
                  </>
                )}
                {currentProvider.id === 'anthropic' && (
                  <>
                    <p>• Uzyskaj klucz API z: console.anthropic.com</p>
                    <p>• Format: sk-ant-api03-...</p>
                  </>
                )}
                {currentProvider.id === 'ollama' && (
                  <>
                    <p>• Zainstaluj Ollama z: ollama.ai</p>
                    <p>• Uruchom z CORS: OLLAMA_ORIGINS=* ollama serve</p>
                    <p>• Lub: set OLLAMA_ORIGINS=* (Windows) i ollama serve</p>
                    <p>• Pobierz model: ollama pull llama3.2:3b</p>
                  </>
                )}
                {currentProvider.id === 'huggingface' && (
                  <>
                    <p>• Działa bez klucza API (ograniczony limit)</p>
                    <p>• Token z: huggingface.co/settings/tokens</p>
                    <p>• Modele działają lokalnie w przeglądarce</p>
                  </>
                )}
              </div>
            </Card>
          )}
        </div>

        <div className="flex justify-between pt-4">
          <Button
            variant="outline"
            onClick={clearSettings}
            className="text-destructive hover:text-destructive"
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Wyczyść
          </Button>
          <Button onClick={saveSettings} className="bg-gradient-primary">
            Zapisz ustawienia
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
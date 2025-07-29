import { pipeline } from '@huggingface/transformers';

interface AIMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

interface AISettings {
  provider: string;
  apiKey: string;
  baseUrl?: string;
  model: string;
}

class AIService {
  private settings: AISettings | null = null;
  private hfPipeline: any = null;
  private isLoading = false;

  constructor() {
    this.loadSettings();
    // Listen for settings changes
    window.addEventListener('ai-settings-changed', (event: any) => {
      this.settings = event.detail;
      this.hfPipeline = null; // Reset HF pipeline when settings change
    });
  }

  private loadSettings() {
    try {
      const saved = localStorage.getItem('ai-settings');
      if (saved) {
        this.settings = JSON.parse(saved);
      }
    } catch (error) {
      console.error('Error loading AI settings:', error);
    }
  }

  public isConfigured(): boolean {
    if (!this.settings) return false;
    
    if (this.settings.provider === 'huggingface') {
      return true; // HF can work without API key
    }
    
    if (this.settings.provider === 'ollama') {
      return !!this.settings.baseUrl;
    }
    
    return !!this.settings.apiKey;
  }

  public getProviderName(): string {
    if (!this.settings) return 'Brak konfiguracji';
    
    const providers: Record<string, string> = {
      openai: 'OpenAI',
      anthropic: 'Anthropic Claude',
      ollama: 'Ollama (Lokalny)',
      huggingface: 'Hugging Face'
    };
    
    return providers[this.settings.provider] || this.settings.provider;
  }

  public async generateResponse(messages: AIMessage[]): Promise<string> {
    if (!this.settings) {
      throw new Error('AI nie jest skonfigurowane. Ustaw klucz API w ustawieniach.');
    }

    const userPrompt = messages[messages.length - 1]?.content || '';

    try {
      switch (this.settings.provider) {
        case 'openai':
          return await this.callOpenAI(messages);
        case 'anthropic':
          return await this.callAnthropic(messages);
        case 'ollama':
          return await this.callOllama(messages);
        case 'huggingface':
          return await this.callHuggingFace(userPrompt);
        default:
          throw new Error(`Nieobsługiwany dostawca: ${this.settings.provider}`);
      }
    } catch (error) {
      console.error('AI generation error:', error);
      throw error;
    }
  }

  private async callOpenAI(messages: AIMessage[]): Promise<string> {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.settings!.apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: this.settings!.model,
        messages: [
          {
            role: 'system',
            content: 'Jesteś ekspertem od tworzenia stron internetowych. Generujesz kompletny, funkcjonalny kod HTML z CSS i JavaScript. Odpowiadaj w języku polskim. Twórz nowoczesne, responsywne strony z pięknym designem.'
          },
          ...messages
        ],
        temperature: 0.7,
        max_tokens: 2000
      }),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: { message: 'Unknown error' } }));
      throw new Error(error.error?.message || `HTTP ${response.status}`);
    }

    const data = await response.json();
    return data.choices[0]?.message?.content || 'Brak odpowiedzi z API';
  }

  private async callAnthropic(messages: AIMessage[]): Promise<string> {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': this.settings!.apiKey,
        'Content-Type': 'application/json',
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: this.settings!.model,
        max_tokens: 2000,
        messages: messages.filter(m => m.role !== 'system'),
        system: 'Jesteś ekspertem od tworzenia stron internetowych. Generujesz kompletny, funkcjonalny kod HTML z CSS i JavaScript. Odpowiadaj w języku polskim. Twórz nowoczesne, responsywne strony z pięknym designem.'
      }),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: { message: 'Unknown error' } }));
      throw new Error(error.error?.message || `HTTP ${response.status}`);
    }

    const data = await response.json();
    return data.content[0]?.text || 'Brak odpowiedzi z API';
  }

  private async callOllama(messages: AIMessage[]): Promise<string> {
    const prompt = messages.map(m => `${m.role}: ${m.content}`).join('\n\n');
    
    try {
      console.log('Ollama: Attempting connection to:', this.settings!.baseUrl);
      const response = await fetch(`${this.settings!.baseUrl}/api/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: this.settings!.model,
          prompt: `Jesteś ekspertem od tworzenia stron internetowych. Generujesz kompletny, funkcjonalny kod HTML z CSS i JavaScript. Odpowiadaj w języku polskim.\n\n${prompt}`,
          stream: false
        }),
      });

      if (!response.ok) {
        console.error('Ollama response not ok:', response.status, response.statusText);
        throw new Error(`Ollama error: ${response.status} - ${response.statusText}`);
      }

      const data = await response.json();
      console.log('Ollama response received:', data);
      return data.response || 'Brak odpowiedzi z Ollama';
    } catch (error) {
      console.error('Ollama connection error:', error);
      throw new Error(`Błąd połączenia z Ollama: ${error instanceof Error ? error.message : 'Nieznany błąd'}. Sprawdź czy Ollama jest uruchomiona (ollama serve) i czy masz model (ollama pull llama3.2:3b)`);
    }
  }

  private async callHuggingFace(prompt: string): Promise<string> {
    try {
      if (!this.hfPipeline) {
        if (this.isLoading) {
          throw new Error('Model jest już ładowany...');
        }
        
        this.isLoading = true;
        this.hfPipeline = await pipeline(
          'text-generation',
          'microsoft/DialoGPT-medium',
          { 
            device: 'webgpu',
            // Use API key if provided
            ...(this.settings!.apiKey && { 
              token: this.settings!.apiKey 
            })
          }
        );
        this.isLoading = false;
      }

      const result = await this.hfPipeline(prompt, {
        max_new_tokens: 200,
        temperature: 0.7,
        do_sample: true
      });

      return Array.isArray(result) ? result[0].generated_text : result.generated_text;
    } catch (error) {
      this.isLoading = false;
      throw error;
    }
  }

  // Generate code based on prompt
  public async generateCode(prompt: string): Promise<{ message: string; code: string; filename: string }> {
    const messages: AIMessage[] = [
      {
        role: 'user',
        content: `Stwórz kompletną stronę internetową na podstawie tego opisu: "${prompt}". 
        
        Wygeneruj:
        1. Kompletny kod HTML z CSS i JavaScript
        2. Responsywny design
        3. Nowoczesny wygląd
        4. Działające funkcjonalności
        
        Odpowiedz w formacie:
        OPIS: [krótki opis tego co utworzyłeś]
        FILENAME: [nazwa pliku, np. index.html]
        CODE:
        [pełny kod HTML]`
      }
    ];

    try {
      const response = await this.generateResponse(messages);
      
      // Parse response
      const descMatch = response.match(/OPIS:\s*(.+?)(?=FILENAME:|CODE:|$)/s);
      const filenameMatch = response.match(/FILENAME:\s*(.+?)(?=OPIS:|CODE:|$)/s);
      const codeMatch = response.match(/CODE:\s*([\s\S]+)/);
      
      const message = descMatch?.[1]?.trim() || 'Wygenerowano kod na podstawie Twojego promptu.';
      const filename = filenameMatch?.[1]?.trim() || 'index.html';
      const code = codeMatch?.[1]?.trim() || this.generateFallbackCode(prompt);
      
      return { message, code, filename };
    } catch (error) {
      console.error('Code generation error:', error);
      
      // Return fallback response
      return {
        message: `Wystąpił błąd podczas generowania kodu: ${error instanceof Error ? error.message : 'Nieznany błąd'}. Używam zapasowego generatora.`,
        code: this.generateFallbackCode(prompt),
        filename: 'index.html'
      };
    }
  }

  private generateFallbackCode(prompt: string): string {
    return `<!DOCTYPE html>
<html lang="pl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Strona wygenerowana przez AI</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: 'Arial', sans-serif;
            line-height: 1.6;
            color: #333;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        
        .container {
            max-width: 800px;
            background: white;
            padding: 3rem;
            border-radius: 15px;
            box-shadow: 0 20px 40px rgba(0,0,0,0.1);
            text-align: center;
        }
        
        h1 {
            color: #667eea;
            margin-bottom: 1rem;
            font-size: 2.5rem;
        }
        
        .prompt {
            background: #f8f9fa;
            padding: 1rem;
            border-radius: 8px;
            margin: 2rem 0;
            border-left: 4px solid #667eea;
        }
        
        .status {
            color: #666;
            font-style: italic;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>🤖 Strona AI</h1>
        <p>Ta strona została wygenerowana przez sztuczną inteligencję!</p>
        
        <div class="prompt">
            <strong>Twój prompt:</strong> "${prompt}"
        </div>
        
        <p class="status">
            ⚠️ To jest zapasowy szablon. Skonfiguruj prawdziwy model AI w ustawieniach, aby otrzymać lepsze rezultaty.
        </p>
    </div>
</body>
</html>`;
  }
}

export const aiService = new AIService();
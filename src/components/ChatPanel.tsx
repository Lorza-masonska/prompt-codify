import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card } from '@/components/ui/card';
import { Send, Bot, User, Loader2, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { aiService } from '@/services/aiService';
import { useToast } from '@/hooks/use-toast';

interface Message {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
}

interface ChatPanelProps {
  onCodeGenerated: (code: string, filename: string) => void;
}

export function ChatPanel({ onCodeGenerated }: ChatPanelProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'ai',
      content: 'Witaj! Jestem Twoim asystentem AI do generowania kodu. Opisz co chcesz stworzyć, a wygeneruję dla Ciebie kod HTML/CSS/JS.',
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    // Check if AI is configured
    if (!aiService.isConfigured()) {
      toast({
        title: "AI nie jest skonfigurowane",
        description: "Skonfiguruj dostawcę AI w ustawieniach, aby móc generować kod.",
        variant: "destructive"
      });
      return;
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: input.trim(),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      // Use real AI service
      const aiResponse = await aiService.generateCode(userMessage.content);
      
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: aiResponse.message,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, aiMessage]);
      
      if (aiResponse.code) {
        onCodeGenerated(aiResponse.code, aiResponse.filename);
      }
      
    } catch (error) {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: `Wystąpił błąd: ${error instanceof Error ? error.message : 'Nieznany błąd'}`,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, errorMessage]);
      
      toast({
        title: "Błąd generowania",
        description: error instanceof Error ? error.message : 'Nieznany błąd',
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };


  return (
    <div className="h-full flex flex-col bg-chat-background border-r border-border">
      {/* Header */}
      <div className="p-6 border-b border-border bg-gradient-surface">
        <h2 className="text-xl font-bold gradient-text flex items-center gap-2">
          <Bot className="w-6 h-6 text-primary" />
          AI Code Generator
        </h2>
        <p className="text-sm text-muted-foreground mt-1">
          Opisz co chcesz stworzyć, a wygeneruję kod HTML/CSS/JS
        </p>
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={cn(
                "flex gap-3 animate-fade-in",
                message.type === 'user' ? 'justify-end' : 'justify-start'
              )}
            >
              {message.type === 'ai' && (
                <div className="w-8 h-8 rounded-full bg-gradient-accent flex items-center justify-center flex-shrink-0">
                  <Bot className="w-4 h-4 text-accent-foreground" />
                </div>
              )}
              <Card className={cn(
                "max-w-[80%] p-4",
                message.type === 'user' 
                  ? 'bg-primary text-primary-foreground' 
                  : 'bg-card'
              )}>
                <p className="text-sm leading-relaxed whitespace-pre-wrap">
                  {message.content}
                </p>
                <div className="text-xs opacity-70 mt-2">
                  {message.timestamp.toLocaleTimeString('pl-PL', { 
                    hour: '2-digit', 
                    minute: '2-digit' 
                  })}
                </div>
              </Card>
              {message.type === 'user' && (
                <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                  <User className="w-4 h-4 text-primary-foreground" />
                </div>
              )}
            </div>
          ))}
          
          {isLoading && (
            <div className="flex gap-3 animate-fade-in">
              <div className="w-8 h-8 rounded-full bg-gradient-accent flex items-center justify-center">
                <Bot className="w-4 h-4 text-accent-foreground" />
              </div>
              <Card className="p-4 bg-card">
                <div className="flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span className="text-sm text-muted-foreground">AI pisze odpowiedź...</span>
                </div>
              </Card>
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Input */}
      <div className="p-4 border-t border-border bg-surface-elevated">
        <form onSubmit={handleSubmit} className="flex gap-2">
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Opisz co chcesz stworzyć... (np. 'stwórz stronę dla serwisu komputerowego')"
            className="min-h-[60px] resize-none bg-chat-input border-border focus:ring-primary"
            disabled={isLoading}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSubmit(e);
              }
            }}
          />
          <Button 
            type="submit" 
            disabled={!input.trim() || isLoading}
            className="bg-gradient-primary hover:opacity-90 transition-opacity shadow-glow"
          >
            <Send className="w-4 h-4" />
          </Button>
        </form>
      </div>
    </div>
  );
}
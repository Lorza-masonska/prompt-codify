import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card } from '@/components/ui/card';
import { Send, Bot, User, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: input.trim(),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    // Simulate AI response
    setTimeout(() => {
      const aiResponse = generateAIResponse(userMessage.content);
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
      
      setIsLoading(false);
    }, 2000);
  };

  const generateAIResponse = (prompt: string) => {
    // Symulacja odpowiedzi AI - w rzeczywistej aplikacji tutaj byłaby integracja z lokalnym modelem
    const lowerPrompt = prompt.toLowerCase();
    
    if (lowerPrompt.includes('serwis komputerowy')) {
      return {
        message: "Tworzę stronę internetową dla serwisu komputerowego. Dodaję plik index.html z responsywnym designem, sekcjami usług, kontaktem i galerią realizacji.",
        code: generateComputerServiceCode(),
        filename: 'index.html'
      };
    }
    
    if (lowerPrompt.includes('portfolio') || lowerPrompt.includes('wizytówka')) {
      return {
        message: "Generuję elegancką stronę portfolio z animacjami CSS i nowoczesnym designem.",
        code: generatePortfolioCode(),
        filename: 'portfolio.html'
      };
    }
    
    if (lowerPrompt.includes('sklep') || lowerPrompt.includes('e-commerce')) {
      return {
        message: "Tworzę layout sklepu internetowego z kategorią produktów, koszykiem i formularzem zamówienia.",
        code: generateShopCode(),
        filename: 'shop.html'
      };
    }
    
    return {
      message: "Rozumiem Twój prompt. Tworzę podstawową stronę HTML z CSS zgodnie z Twoimi wymaganiami.",
      code: generateBasicCode(prompt),
      filename: 'index.html'
    };
  };

  const generateComputerServiceCode = () => `<!DOCTYPE html>
<html lang="pl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>ComputerPro - Serwis Komputerowy</title>
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
        }
        
        .header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 2rem 0;
            text-align: center;
        }
        
        .header h1 {
            font-size: 3rem;
            margin-bottom: 0.5rem;
            text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
        }
        
        .nav {
            background: #2c3e50;
            padding: 1rem 0;
            text-align: center;
        }
        
        .nav a {
            color: white;
            text-decoration: none;
            margin: 0 2rem;
            font-weight: bold;
            transition: color 0.3s;
        }
        
        .nav a:hover {
            color: #3498db;
        }
        
        .container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 0 2rem;
        }
        
        .services {
            padding: 4rem 0;
            background: #f8f9fa;
        }
        
        .services h2 {
            text-align: center;
            margin-bottom: 3rem;
            font-size: 2.5rem;
            color: #2c3e50;
        }
        
        .service-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 2rem;
        }
        
        .service-card {
            background: white;
            padding: 2rem;
            border-radius: 10px;
            box-shadow: 0 5px 15px rgba(0,0,0,0.1);
            text-align: center;
            transition: transform 0.3s;
        }
        
        .service-card:hover {
            transform: translateY(-5px);
        }
        
        .service-card h3 {
            color: #667eea;
            margin-bottom: 1rem;
        }
        
        .contact {
            background: #2c3e50;
            color: white;
            padding: 4rem 0;
            text-align: center;
        }
        
        .contact h2 {
            margin-bottom: 2rem;
        }
        
        .contact-info {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 2rem;
            margin-top: 2rem;
        }
        
        .footer {
            background: #1a252f;
            color: white;
            text-align: center;
            padding: 2rem 0;
        }
        
        @media (max-width: 768px) {
            .header h1 {
                font-size: 2rem;
            }
            
            .nav a {
                margin: 0 1rem;
                font-size: 0.9rem;
            }
        }
    </style>
</head>
<body>
    <header class="header">
        <div class="container">
            <h1>ComputerPro</h1>
            <p>Profesjonalny serwis komputerowy i IT</p>
        </div>
    </header>
    
    <nav class="nav">
        <a href="#home">Start</a>
        <a href="#services">Usługi</a>
        <a href="#about">O nas</a>
        <a href="#contact">Kontakt</a>
    </nav>
    
    <section class="services" id="services">
        <div class="container">
            <h2>Nasze Usługi</h2>
            <div class="service-grid">
                <div class="service-card">
                    <h3>Naprawa Komputerów</h3>
                    <p>Profesjonalna diagnostyka i naprawa komputerów stacjonarnych i laptopów. Wymiana podzespołów, usuwanie wirusów.</p>
                </div>
                <div class="service-card">
                    <h3>Instalacja Systemów</h3>
                    <p>Instalacja i konfiguracja systemów operacyjnych Windows, Linux. Przywracanie danych z kopii zapasowych.</p>
                </div>
                <div class="service-card">
                    <h3>Sieci Komputerowe</h3>
                    <p>Projektowanie i wdrażanie sieci lokalnych. Konfiguracja routerów, switchy, punktów dostępowych WiFi.</p>
                </div>
                <div class="service-card">
                    <h3>Konserwacja IT</h3>
                    <p>Regularna konserwacja sprzętu komputerowego w firmach. Umowy serwisowe i wsparcie techniczne.</p>
                </div>
            </div>
        </div>
    </section>
    
    <section class="contact" id="contact">
        <div class="container">
            <h2>Skontaktuj się z nami</h2>
            <p>Oferujemy szybki i profesjonalny serwis</p>
            <div class="contact-info">
                <div>
                    <h3>Telefon</h3>
                    <p>+48 123 456 789</p>
                </div>
                <div>
                    <h3>Email</h3>
                    <p>kontakt@computerpro.pl</p>
                </div>
                <div>
                    <h3>Adres</h3>
                    <p>ul. Komputerowa 15<br>00-001 Warszawa</p>
                </div>
            </div>
        </div>
    </section>
    
    <footer class="footer">
        <div class="container">
            <p>&copy; 2024 ComputerPro. Wszystkie prawa zastrzeżone.</p>
        </div>
    </footer>
</body>
</html>`;

  const generatePortfolioCode = () => `<!DOCTYPE html>
<html lang="pl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Portfolio - Jan Kowalski</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: 'Arial', sans-serif;
            color: #333;
            overflow-x: hidden;
        }
        
        .hero {
            height: 100vh;
            background: linear-gradient(45deg, #ff6b6b, #4ecdc4);
            display: flex;
            align-items: center;
            justify-content: center;
            text-align: center;
            color: white;
        }
        
        .hero h1 {
            font-size: 4rem;
            margin-bottom: 1rem;
            animation: fadeInUp 1s ease-out;
        }
        
        .hero p {
            font-size: 1.5rem;
            animation: fadeInUp 1s ease-out 0.3s both;
        }
        
        @keyframes fadeInUp {
            from {
                opacity: 0;
                transform: translateY(30px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
        
        .section {
            padding: 5rem 2rem;
            max-width: 1200px;
            margin: 0 auto;
        }
        
        .skills {
            background: #f8f9fa;
        }
        
        .skill-bar {
            margin: 1rem 0;
        }
        
        .skill-bar h4 {
            margin-bottom: 0.5rem;
        }
        
        .bar {
            background: #ddd;
            height: 10px;
            border-radius: 5px;
            overflow: hidden;
        }
        
        .bar-fill {
            height: 100%;
            background: linear-gradient(45deg, #ff6b6b, #4ecdc4);
            border-radius: 5px;
            animation: fillBar 2s ease-out;
        }
        
        @keyframes fillBar {
            from { width: 0; }
        }
        
        .projects {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 2rem;
            margin-top: 3rem;
        }
        
        .project-card {
            background: white;
            border-radius: 10px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.1);
            overflow: hidden;
            transition: transform 0.3s;
        }
        
        .project-card:hover {
            transform: translateY(-10px);
        }
        
        .project-card img {
            width: 100%;
            height: 200px;
            background: linear-gradient(45deg, #667eea, #764ba2);
        }
        
        .project-card-content {
            padding: 1.5rem;
        }
    </style>
</head>
<body>
    <section class="hero">
        <div>
            <h1>Jan Kowalski</h1>
            <p>Frontend Developer & UI/UX Designer</p>
        </div>
    </section>
    
    <section class="section skills">
        <h2>Umiejętności</h2>
        <div class="skill-bar">
            <h4>HTML/CSS</h4>
            <div class="bar">
                <div class="bar-fill" style="width: 90%;"></div>
            </div>
        </div>
        <div class="skill-bar">
            <h4>JavaScript</h4>
            <div class="bar">
                <div class="bar-fill" style="width: 85%;"></div>
            </div>
        </div>
        <div class="skill-bar">
            <h4>React</h4>
            <div class="bar">
                <div class="bar-fill" style="width: 80%;"></div>
            </div>
        </div>
    </section>
    
    <section class="section">
        <h2>Projekty</h2>
        <div class="projects">
            <div class="project-card">
                <div style="width: 100%; height: 200px; background: linear-gradient(45deg, #667eea, #764ba2);"></div>
                <div class="project-card-content">
                    <h3>E-commerce Platform</h3>
                    <p>Nowoczesny sklep internetowy z React i Node.js</p>
                </div>
            </div>
            <div class="project-card">
                <div style="width: 100%; height: 200px; background: linear-gradient(45deg, #f093fb, #f5576c);"></div>
                <div class="project-card-content">
                    <h3>Mobile App UI</h3>
                    <p>Projekt interfejsu aplikacji mobilnej</p>
                </div>
            </div>
        </div>
    </section>
</body>
</html>`;

  const generateShopCode = () => `<!DOCTYPE html>
<html lang="pl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>TechShop - Sklep Elektroniczny</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: 'Arial', sans-serif;
            color: #333;
        }
        
        .header {
            background: #2c3e50;
            color: white;
            padding: 1rem 0;
        }
        
        .header-content {
            max-width: 1200px;
            margin: 0 auto;
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 0 2rem;
        }
        
        .logo {
            font-size: 2rem;
            font-weight: bold;
        }
        
        .cart {
            background: #e74c3c;
            padding: 0.5rem 1rem;
            border-radius: 5px;
            cursor: pointer;
        }
        
        .hero {
            background: linear-gradient(135deg, #3498db, #2980b9);
            color: white;
            text-align: center;
            padding: 4rem 2rem;
        }
        
        .hero h1 {
            font-size: 3rem;
            margin-bottom: 1rem;
        }
        
        .container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 2rem;
        }
        
        .products {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
            gap: 2rem;
            margin-top: 2rem;
        }
        
        .product-card {
            background: white;
            border-radius: 10px;
            box-shadow: 0 5px 15px rgba(0,0,0,0.1);
            overflow: hidden;
            transition: transform 0.3s;
        }
        
        .product-card:hover {
            transform: translateY(-5px);
        }
        
        .product-image {
            width: 100%;
            height: 200px;
            background: linear-gradient(45deg, #667eea, #764ba2);
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-size: 1.2rem;
        }
        
        .product-info {
            padding: 1.5rem;
        }
        
        .product-info h3 {
            margin-bottom: 0.5rem;
            color: #2c3e50;
        }
        
        .price {
            font-size: 1.5rem;
            color: #e74c3c;
            font-weight: bold;
            margin: 1rem 0;
        }
        
        .btn {
            background: #3498db;
            color: white;
            border: none;
            padding: 0.75rem 1.5rem;
            border-radius: 5px;
            cursor: pointer;
            font-size: 1rem;
            transition: background 0.3s;
            width: 100%;
        }
        
        .btn:hover {
            background: #2980b9;
        }
    </style>
</head>
<body>
    <header class="header">
        <div class="header-content">
            <div class="logo">TechShop</div>
            <div class="cart">Koszyk (0)</div>
        </div>
    </header>
    
    <section class="hero">
        <h1>Najlepsze produkty elektroniczne</h1>
        <p>Odkryj naszą szeroką gamę urządzeń technologicznych</p>
    </section>
    
    <div class="container">
        <h2>Popularne produkty</h2>
        <div class="products">
            <div class="product-card">
                <div class="product-image">Laptop Premium</div>
                <div class="product-info">
                    <h3>Laptop Gaming XPro</h3>
                    <p>Wysokowydajny laptop do gier z kartą RTX 4070</p>
                    <div class="price">4999 zł</div>
                    <button class="btn">Dodaj do koszyka</button>
                </div>
            </div>
            
            <div class="product-card">
                <div class="product-image">Smartfon Pro</div>
                <div class="product-info">
                    <h3>Smartphone Ultra 256GB</h3>
                    <p>Najnowszy smartfon z aparatem 108MP</p>
                    <div class="price">2999 zł</div>
                    <button class="btn">Dodaj do koszyka</button>
                </div>
            </div>
            
            <div class="product-card">
                <div class="product-image">Słuchawki BT</div>
                <div class="product-info">
                    <h3>Słuchawki Bluetooth Pro</h3>
                    <p>Bezprzewodowe słuchawki z redukcją szumów</p>
                    <div class="price">599 zł</div>
                    <button class="btn">Dodaj do koszyka</button>
                </div>
            </div>
            
            <div class="product-card">
                <div class="product-image">Monitor 4K</div>
                <div class="product-info">
                    <h3>Monitor 4K 27"</h3>
                    <p>Monitor dla profesjonalistów z HDR</p>
                    <div class="price">1899 zł</div>
                    <button class="btn">Dodaj do koszyka</button>
                </div>
            </div>
        </div>
    </div>
</body>
</html>`;

  const generateBasicCode = (prompt: string) => `<!DOCTYPE html>
<html lang="pl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Wygenerowana Strona</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 20px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: #333;
            min-height: 100vh;
        }
        
        .container {
            max-width: 800px;
            margin: 0 auto;
            background: white;
            padding: 2rem;
            border-radius: 10px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.2);
        }
        
        h1 {
            color: #667eea;
            text-align: center;
            margin-bottom: 2rem;
        }
        
        .content {
            line-height: 1.6;
            font-size: 1.1rem;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>Strona wygenerowana przez AI</h1>
        <div class="content">
            <p>Zostałeś poproszony o: <strong>"${prompt}"</strong></p>
            <p>To jest podstawowy szablon HTML wygenerowany na podstawie Twojego promptu. Strona zawiera responsywny design i nowoczesne style CSS.</p>
            <p>Możesz dalej rozwijać tę stronę lub poprosić o konkretne modyfikacje.</p>
        </div>
    </div>
</body>
</html>`;

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

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send, Brain, User, Sparkles } from 'lucide-react';

const ChatInterface = () => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'assistant',
      content: "Hi! I'm your AI knowledge assistant. Ask me anything about your notes, or let me help you discover connections in your knowledge base.",
      timestamp: '10:30 AM'
    },
    {
      id: 2,
      type: 'user',
      content: "What are the main themes in my AI research notes?",
      timestamp: '10:31 AM'
    },
    {
      id: 3,
      type: 'assistant',
      content: "Based on your AI research notes, I've identified three main themes:\n\n1. **Large Language Models (LLMs)** - You've documented developments in GPT architectures, training methodologies, and fine-tuning approaches.\n\n2. **Practical Applications** - Your notes cover real-world implementations including chatbots, code generation, and content creation.\n\n3. **Ethical Considerations** - You've collected insights on AI safety, bias mitigation, and responsible AI development.\n\nWould you like me to elaborate on any of these themes or help you explore connections between them?",
      timestamp: '10:31 AM'
    }
  ]);

  const handleSendMessage = () => {
    if (!message.trim()) return;

    const newMessage = {
      id: messages.length + 1,
      type: 'user' as const,
      content: message,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages([...messages, newMessage]);
    setMessage('');

    // Simulate AI response
    setTimeout(() => {
      const aiResponse = {
        id: messages.length + 2,
        type: 'assistant' as const,
        content: "I understand you're asking about that topic. Let me search through your knowledge base to provide you with the most relevant information...",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, aiResponse]);
    }, 1000);
  };

  return (
    <div className="space-y-6">
      <Card className="border-border/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5" />
            Chat with Your Knowledge
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <ScrollArea className="h-[500px] p-6">
            <div className="space-y-4">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex items-start gap-3 ${
                    msg.type === 'user' ? 'flex-row-reverse' : ''
                  }`}
                >
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    msg.type === 'user' 
                      ? 'bg-primary text-primary-foreground' 
                      : 'bg-muted text-muted-foreground'
                  }`}>
                    {msg.type === 'user' ? (
                      <User className="h-4 w-4" />
                    ) : (
                      <Sparkles className="h-4 w-4" />
                    )}
                  </div>
                  
                  <div className={`flex-1 space-y-1 ${
                    msg.type === 'user' ? 'items-end' : 'items-start'
                  } flex flex-col`}>
                    <div className={`max-w-[80%] rounded-lg p-3 ${
                      msg.type === 'user'
                        ? 'bg-primary text-primary-foreground ml-auto'
                        : 'bg-muted'
                    }`}>
                      <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                    </div>
                    <span className="text-xs text-muted-foreground">{msg.timestamp}</span>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
          
          <div className="border-t border-border/50 p-4">
            <div className="flex items-center gap-2">
              <Input
                placeholder="Ask about your notes, request summaries, or explore connections..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                className="flex-1"
              />
              <Button onClick={handleSendMessage} size="sm">
                <Send className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="flex items-center gap-2 mt-3">
              <Button variant="outline" size="sm">
                Summarize recent notes
              </Button>
              <Button variant="outline" size="sm">
                Find connections
              </Button>
              <Button variant="outline" size="sm">
                Generate insights
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ChatInterface;

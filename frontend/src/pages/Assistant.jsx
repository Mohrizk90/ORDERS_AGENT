import { useState, useRef, useEffect, useCallback } from 'react';
import { Send, Bot, User, Loader, Sparkles, FileText, Receipt, BarChart3, RefreshCw } from 'lucide-react';
import { getOrders } from '../services/ordersService';
import { getInvoices } from '../services/invoicesService';
import { getDashboardStats } from '../services/statsService';
import { formatCurrency, formatDate } from '../utils/dataTransformers';

// Process command and get response
const processCommand = async (message) => {
  const lowerMessage = message.toLowerCase();
  
  // Show orders
  if (lowerMessage.includes('show') && lowerMessage.includes('order')) {
    const result = await getOrders({ page: 1, limit: 5 });
    if (result.success) {
      const orders = result.data.data || [];
      return {
        type: 'orders',
        text: `Here are the latest ${orders.length} orders:`,
        data: orders,
      };
    }
    return {
      type: 'error',
      text: 'Sorry, I could not fetch the orders. Please try again.',
    };
  }
  
  // Show invoices
  if (lowerMessage.includes('show') && lowerMessage.includes('invoice')) {
    const result = await getInvoices({ page: 1, limit: 5 });
    if (result.success) {
      const invoices = result.data.data || [];
      return {
        type: 'invoices',
        text: `Here are the latest ${invoices.length} invoices:`,
        data: invoices,
      };
    }
    return {
      type: 'error',
      text: 'Sorry, I could not fetch the invoices. Please try again.',
    };
  }
  
  // Stats/summary
  if (lowerMessage.includes('stat') || lowerMessage.includes('summary') || lowerMessage.includes('total')) {
    const result = await getDashboardStats();
    if (result.success) {
      return {
        type: 'stats',
        text: 'Here\'s your current summary:',
        data: result.data,
      };
    }
    return {
      type: 'error',
      text: 'Sorry, I could not fetch the statistics. Please try again.',
    };
  }
  
  // High value transactions
  if (lowerMessage.includes('high value') || lowerMessage.includes('alert')) {
    const [ordersResult, invoicesResult] = await Promise.all([
      getOrders({ page: 1, limit: 100 }),
      getInvoices({ page: 1, limit: 100 }),
    ]);
    
    const allItems = [
      ...(ordersResult.data?.data || []),
      ...(invoicesResult.data?.data || []),
    ].filter(item => item.total_amount >= 50000).slice(0, 5);
    
    return {
      type: 'high_value',
      text: `Found ${allItems.length} high-value transactions (≥$50,000):`,
      data: allItems,
    };
  }
  
  // Pending items
  if (lowerMessage.includes('pending')) {
    const [ordersResult, invoicesResult] = await Promise.all([
      getOrders({ status: 'Pending', page: 1, limit: 100 }),
      getInvoices({ status: 'Pending', page: 1, limit: 100 }),
    ]);
    
    const pendingOrders = ordersResult.data?.data || [];
    const pendingInvoices = invoicesResult.data?.data || [];
    
    return {
      type: 'pending',
      text: `You have ${pendingOrders.length} pending orders and ${pendingInvoices.length} pending invoices.`,
      data: { orders: pendingOrders, invoices: pendingInvoices },
    };
  }
  
  // Create order simulation
  if (lowerMessage.includes('create') && lowerMessage.includes('order')) {
    return {
      type: 'action',
      text: '✅ I can help you create an order. Please provide the following details:\n\n• Supplier name\n• Order amount\n• Order date\n\nOr you can use the Orders page to create one with the full form.',
      action: 'create_order',
    };
  }
  
  // Create invoice simulation
  if (lowerMessage.includes('create') && lowerMessage.includes('invoice')) {
    return {
      type: 'action',
      text: '✅ I can help you create an invoice. Please provide the following details:\n\n• Supplier name\n• Invoice amount\n• Invoice date\n• Financing type (Credit/Cash)\n\nOr you can use the Invoices page to create one with the full form.',
      action: 'create_invoice',
    };
  }
  
  // Export
  if (lowerMessage.includes('export')) {
    return {
      type: 'action',
      text: '📊 I can export your data. What would you like to export?\n\n• "Export orders" - Download all orders\n• "Export invoices" - Download all invoices\n• "Export report" - Download monthly report',
      action: 'export',
    };
  }
  
  // Search by supplier
  if (lowerMessage.includes('from') || lowerMessage.includes('supplier')) {
    // Extract supplier name
    const match = lowerMessage.match(/from\s+([a-z]+)/i);
    if (match) {
      const supplierSearch = match[1];
      const [ordersResult, invoicesResult] = await Promise.all([
        getOrders({ search: supplierSearch, page: 1, limit: 10 }),
        getInvoices({ search: supplierSearch, page: 1, limit: 10 }),
      ]);
      
      const orders = ordersResult.data?.data || [];
      const invoices = invoicesResult.data?.data || [];
      
      return {
        type: 'search',
        text: `Found ${orders.length} orders and ${invoices.length} invoices matching "${supplierSearch}".`,
        data: { orders, invoices },
      };
    }
  }
  
  // Help
  if (lowerMessage.includes('help') || lowerMessage === 'hi' || lowerMessage === 'hello') {
    return {
      type: 'help',
      text: `👋 Hello! I'm your FMC Operations Assistant. Here's what I can do:\n\n📋 **View Data**\n• "Show me orders"\n• "Show invoices"\n• "Show stats" or "Summary"\n• "Show pending items"\n• "Show high value transactions"\n\n🔍 **Search**\n• "Orders from TechCorp"\n• "Invoices from supplier X"\n\n✏️ **Create**\n• "Create order"\n• "Create invoice"\n\n📊 **Export**\n• "Export orders"\n• "Export report"\n\nJust type naturally and I'll help you!`,
    };
  }
  
  // Default response
  return {
    type: 'default',
    text: `I understand you're asking about "${message}". I can help you with:\n\n• Viewing orders and invoices\n• Creating new entries\n• Searching by supplier\n• Exporting data\n• Showing statistics\n\nTry asking "Show me orders" or "Help" for more options.`,
  };
};

// Message bubble component
function MessageBubble({ message }) {
  const isBot = message.sender === 'bot';
  
  return (
    <div className={`flex gap-3 ${isBot ? '' : 'flex-row-reverse'} animate-fade-in`}>
      <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
        isBot ? 'bg-primary-100 text-primary-600' : 'bg-gray-200 text-gray-600'
      }`}>
        {isBot ? <Bot className="w-4 h-4" /> : <User className="w-4 h-4" />}
      </div>
      
      <div className={`max-w-[80%] ${isBot ? '' : 'text-right'}`}>
        <div className={`inline-block p-4 rounded-2xl ${
          isBot 
            ? 'bg-white border border-gray-200 text-gray-900' 
            : 'bg-primary-600 text-white'
        }`}>
          {/* Text content with markdown-like formatting */}
          <div className="whitespace-pre-wrap text-sm">
            {message.text.split('\n').map((line, i) => (
              <p key={i} className={line.startsWith('•') ? 'ml-2' : ''}>
                {line.startsWith('**') && line.endsWith('**') 
                  ? <strong>{line.slice(2, -2)}</strong>
                  : line
                }
              </p>
            ))}
          </div>
          
          {/* Orders data */}
          {message.data && message.type === 'orders' && (
            <div className="mt-3 space-y-2">
              {message.data.map((order) => (
                <div key={order.id} className="p-3 bg-blue-50 rounded-lg text-left">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-gray-900">{order.supplier}</span>
                    <span className="text-sm font-semibold text-blue-600">
                      {formatCurrency(order.total_amount)}
                    </span>
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    {formatDate(order.order_date)} • {order.status}
                  </div>
                </div>
              ))}
            </div>
          )}
          
          {/* Invoices data */}
          {message.data && message.type === 'invoices' && (
            <div className="mt-3 space-y-2">
              {message.data.map((invoice) => (
                <div key={invoice.id} className="p-3 bg-green-50 rounded-lg text-left">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-gray-900">{invoice.supplier}</span>
                    <span className="text-sm font-semibold text-green-600">
                      {formatCurrency(invoice.total_amount)}
                    </span>
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    {formatDate(invoice.invoice_date)} • {invoice.status}
                  </div>
                </div>
              ))}
            </div>
          )}
          
          {/* Stats data */}
          {message.data && message.type === 'stats' && (
            <div className="mt-3 grid grid-cols-2 gap-2">
              <div className="p-3 bg-blue-50 rounded-lg text-left">
                <p className="text-xs text-gray-500">Orders</p>
                <p className="font-bold text-blue-600">{message.data.totalOrders}</p>
              </div>
              <div className="p-3 bg-green-50 rounded-lg text-left">
                <p className="text-xs text-gray-500">Invoices</p>
                <p className="font-bold text-green-600">{message.data.totalInvoices}</p>
              </div>
              <div className="p-3 bg-yellow-50 rounded-lg text-left">
                <p className="text-xs text-gray-500">Order Value</p>
                <p className="font-bold text-yellow-600">{formatCurrency(message.data.totalOrderAmount)}</p>
              </div>
              <div className="p-3 bg-purple-50 rounded-lg text-left">
                <p className="text-xs text-gray-500">Invoice Value</p>
                <p className="font-bold text-purple-600">{formatCurrency(message.data.totalInvoiceAmount)}</p>
              </div>
            </div>
          )}
        </div>
        <p className="text-xs text-gray-400 mt-1 px-2">
          {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </p>
      </div>
    </div>
  );
}

// Quick action buttons
function QuickActions({ onAction }) {
  const actions = [
    { label: 'Show Orders', icon: FileText, query: 'Show me orders' },
    { label: 'Show Invoices', icon: Receipt, query: 'Show invoices' },
    { label: 'Summary', icon: BarChart3, query: 'Show summary' },
  ];
  
  return (
    <div className="flex flex-wrap gap-2 mb-4">
      {actions.map((action) => (
        <button
          key={action.label}
          onClick={() => onAction(action.query)}
          className="inline-flex items-center gap-2 px-3 py-1.5 bg-white border border-gray-200 rounded-full text-sm text-gray-600 hover:bg-gray-50 hover:border-gray-300 transition-colors"
        >
          <action.icon className="w-4 h-4" />
          {action.label}
        </button>
      ))}
    </div>
  );
}

export default function Assistant() {
  const [messages, setMessages] = useState([
    {
      id: '1',
      sender: 'bot',
      text: '👋 Hello! I\'m your FMC Operations Assistant.\n\nI can help you manage orders, invoices, and view analytics - just like the Telegram bot, but right here in your dashboard.\n\nTry asking me:\n• "Show me orders"\n• "Show invoices"\n• "What are my stats?"\n\nOr type "Help" for all available commands.',
      timestamp: new Date(),
      type: 'help',
    },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = useCallback(async (text = input) => {
    if (!text.trim()) return;

    // Add user message
    const userMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text: text.trim(),
      timestamp: new Date(),
    };
    
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    // Process command and get response
    const response = await processCommand(text);
    
    const botMessage = {
      id: (Date.now() + 1).toString(),
      sender: 'bot',
      text: response.text,
      timestamp: new Date(),
      type: response.type,
      data: response.data,
    };

    setMessages((prev) => [...prev, botMessage]);
    setIsTyping(false);
  }, [input]);

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const clearChat = () => {
    setMessages([
      {
        id: '1',
        sender: 'bot',
        text: '🔄 Chat cleared. How can I help you today?\n\nType "Help" to see available commands.',
        timestamp: new Date(),
        type: 'help',
      },
    ]);
  };

  return (
    <div className="h-[calc(100vh-7rem)] flex flex-col animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">AI Assistant</h1>
            <p className="text-sm text-gray-500">Chat with your data, just like the Telegram bot</p>
          </div>
        </div>
        <button
          onClick={clearChat}
          className="btn btn-secondary btn-sm"
        >
          <RefreshCw className="w-4 h-4 mr-1" />
          Clear Chat
        </button>
      </div>

      {/* Chat Container */}
      <div className="flex-1 bg-gray-50 rounded-2xl border border-gray-200 flex flex-col overflow-hidden">
        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-thin">
          {messages.map((message) => (
            <MessageBubble key={message.id} message={message} />
          ))}
          
          {/* Typing indicator */}
          {isTyping && (
            <div className="flex gap-3 animate-fade-in">
              <div className="w-8 h-8 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center">
                <Bot className="w-4 h-4" />
              </div>
              <div className="bg-white border border-gray-200 rounded-2xl p-4">
                <div className="flex gap-1">
                  <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-4 bg-white border-t border-gray-200">
          <QuickActions onAction={handleSend} />
          
          <div className="flex gap-3">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask me anything about your orders and invoices..."
              className="flex-1 px-4 py-3 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              disabled={isTyping}
            />
            <button
              onClick={() => handleSend()}
              disabled={!input.trim() || isTyping}
              className="btn btn-primary px-6 disabled:opacity-50"
            >
              {isTyping ? (
                <Loader className="w-5 h-5 animate-spin" />
              ) : (
                <Send className="w-5 h-5" />
              )}
            </button>
          </div>
          
          <p className="text-xs text-gray-400 mt-2 text-center">
            💡 Tip: Try "Show orders from TechCorp" or "Create order"
          </p>
        </div>
      </div>
    </div>
  );
}

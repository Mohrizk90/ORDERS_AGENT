import { HelpCircle, Book, MessageCircle, Mail, ExternalLink } from 'lucide-react';

const faqs = [
  {
    question: 'How do I upload a document?',
    answer: 'Go to the Upload page, drag and drop your PDF file or click to browse. The system will automatically process and extract data from your document.',
  },
  {
    question: 'What document formats are supported?',
    answer: 'Currently, the system supports PDF documents for invoices and orders. Documents in Spanish and English are supported.',
  },
  {
    question: 'How do high-value alerts work?',
    answer: 'When a transaction exceeds the configured threshold (default: $50,000), an alert is automatically sent via Telegram and/or email to configured recipients.',
  },
  {
    question: 'Can I export my data?',
    answer: 'Yes! You can export orders and invoices to CSV format from the Orders, Invoices, or Analytics pages. Click the Export button to download.',
  },
  {
    question: 'How do I use the Telegram bot?',
    answer: 'Open Telegram, find Order_DB_Bot, and start chatting. You can ask questions like "Show me orders" or "Create a new invoice" using natural language.',
  },
];

export default function Help() {
  return (
    <div className="space-y-6 animate-fade-in max-w-4xl">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Help & Support</h1>
        <p className="text-gray-500 mt-1">Get help with using the FMC Operations Dashboard</p>
      </div>

      {/* Quick Links */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <a href="#" className="card hover:border-primary-300 transition-colors group">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg group-hover:bg-blue-200 transition-colors">
              <Book className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="font-medium text-gray-900">Documentation</p>
              <p className="text-sm text-gray-500">Read the user manual</p>
            </div>
          </div>
        </a>

        <a href="#" className="card hover:border-primary-300 transition-colors group">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-lg group-hover:bg-green-200 transition-colors">
              <MessageCircle className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="font-medium text-gray-900">Telegram Bot</p>
              <p className="text-sm text-gray-500">Chat with Order_DB_Bot</p>
            </div>
          </div>
        </a>

        <a href="#" className="card hover:border-primary-300 transition-colors group">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-100 rounded-lg group-hover:bg-purple-200 transition-colors">
              <Mail className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="font-medium text-gray-900">Contact Support</p>
              <p className="text-sm text-gray-500">Get help from our team</p>
            </div>
          </div>
        </a>
      </div>

      {/* FAQs */}
      <div className="card">
        <h2 className="text-lg font-semibold text-gray-900 mb-6">Frequently Asked Questions</h2>
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <details key={index} className="group">
              <summary className="flex items-center justify-between p-4 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors">
                <span className="font-medium text-gray-900">{faq.question}</span>
                <span className="text-gray-400 group-open:rotate-180 transition-transform">
                  ▼
                </span>
              </summary>
              <div className="p-4 text-gray-600">
                {faq.answer}
              </div>
            </details>
          ))}
        </div>
      </div>

      {/* Bot Commands */}
      <div className="card">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Telegram Bot Commands</h2>
        <p className="text-gray-500 mb-4">
          Use natural language to interact with the bot. Here are some example commands:
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {[
            'Show me orders',
            'Show invoices from supplier X',
            'Create order for supplier Y with amount 50000',
            'Update order [id] with supplier Z',
            'Delete invoice [id]',
            'Export all orders',
            'Show monthly totals for 2024',
            'Create a chart of orders and invoices',
          ].map((command, index) => (
            <div key={index} className="p-3 bg-gray-50 rounded-lg font-mono text-sm text-gray-700">
              {command}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

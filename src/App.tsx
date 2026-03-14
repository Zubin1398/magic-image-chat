/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ImageIcon, MessageSquare } from 'lucide-react';
import ImageEditor from './components/ImageEditor';
import Chatbot from './components/Chatbot';

export default function App() {
  const [activeTab, setActiveTab] = useState<'editor' | 'chat'>('editor');

  return (
    <div className="min-h-screen bg-stone-50 text-stone-900 flex flex-col">
      <header className="bg-white border-b border-stone-200 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          <h1 className="text-xl font-semibold tracking-tight flex items-center gap-2">
            <span className="bg-indigo-600 text-white p-1.5 rounded-lg">
              <ImageIcon className="w-5 h-5" />
            </span>
            Magic Studio
          </h1>
          <div className="flex bg-stone-100 p-1 rounded-lg">
            <button
              onClick={() => setActiveTab('editor')}
              className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${
                activeTab === 'editor' ? 'bg-white shadow-sm text-indigo-600' : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <div className="flex items-center gap-2">
                <ImageIcon className="w-4 h-4" />
                Image Editor
              </div>
            </button>
            <button
              onClick={() => setActiveTab('chat')}
              className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${
                activeTab === 'chat' ? 'bg-white shadow-sm text-indigo-600' : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <div className="flex items-center gap-2">
                <MessageSquare className="w-4 h-4" />
                AI Assistant
              </div>
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-5xl w-full mx-auto p-4 md:p-6">
        <AnimatePresence mode="wait">
          {activeTab === 'editor' ? (
            <motion.div
              key="editor"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="h-full"
            >
              <ImageEditor />
            </motion.div>
          ) : (
            <motion.div
              key="chat"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="h-full"
            >
              <Chatbot />
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}

'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { MessageSquare, Mic, ArrowRight } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex flex-col">
      {/* Hero Section */}
      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="text-center max-w-3xl">
          {/* Logo/Avatar */}
          <div className="mb-8">
            <div className="w-24 h-24 mx-auto rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-4xl shadow-2xl">
              🤖
            </div>
          </div>

          {/* Headline */}
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Pranjal's <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">Digital Twin</span>
          </h1>
          
          <p className="text-xl text-slate-400 mb-8 max-w-xl mx-auto">
            An AI-powered professional presence. Chat or talk with me about my skills, projects, and availability.
          </p>

          {/* CTA Button */}
          <Link href="/chat" className="inline-block">
            <Button size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-lg px-8 py-6">
              <MessageSquare className="mr-2 h-5 w-5" />
              Start Conversation
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>

          {/* Features */}
          <div className="mt-12 grid md:grid-cols-2 gap-4 max-w-md mx-auto">
            <div className="flex items-center gap-3 p-4 bg-slate-800/50 rounded-lg border border-slate-700">
              <MessageSquare className="h-6 w-6 text-blue-400" />
              <div className="text-left">
                <p className="font-medium text-white">Text Chat</p>
                <p className="text-xs text-slate-400">Type your questions</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 bg-slate-800/50 rounded-lg border border-slate-700">
              <Mic className="h-6 w-6 text-purple-400" />
              <div className="text-left">
                <p className="font-medium text-white">Voice Mode</p>
                <p className="text-xs text-slate-400">Toggle in chat</p>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="mt-12 flex flex-wrap justify-center gap-4 text-sm">
            <span className="text-slate-500">Quick questions:</span>
            {[
              "What are your skills?",
              "Tell me about your projects",
              "Are you available?",
            ].map((q, i) => (
              <Link 
                key={i}
                href={`/chat?q=${encodeURIComponent(q)}`}
                className="text-slate-400 hover:text-blue-400 transition-colors"
              >
                {q}
              </Link>
            ))}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800 py-6 px-4">
        <div className="max-w-3xl mx-auto text-center text-sm text-slate-500">
          <p>Built with Next.js, Groq AI, and ❤️</p>
        </div>
      </footer>
    </div>
  );
}

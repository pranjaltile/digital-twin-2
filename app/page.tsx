'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Link from 'next/link';

export default function Home() {
  const [dbConnected, setDbConnected] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Test database connection on page load
    async function checkDb() {
      try {
        const response = await fetch('/api/test-db');
        const data = await response.json();
        setDbConnected(data.connected);
      } catch (error) {
        console.error('Error checking database:', error);
        setDbConnected(false);
      } finally {
        setLoading(false);
      }
    }

    checkDb();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="flex min-h-screen flex-col items-center justify-center px-4 py-16 sm:px-6 lg:px-8">
        <div className="w-full max-w-2xl space-y-8 text-center">
          {/* Header */}
          <div className="space-y-4">
            <h1 className="text-5xl font-bold text-white">Digital Twin</h1>
            <p className="text-xl text-slate-300">
              Your AI-powered professional presence. Available 24/7.
            </p>
          </div>

          {/* Status Card */}
          <Card className="border-slate-700 bg-slate-800/50 p-6">
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-white">System Status</h2>

              {/* Database Status */}
              <div className="flex items-center justify-between rounded-lg bg-slate-900/50 p-4">
                <div className="flex items-center gap-3">
                  <div
                    className={`h-3 w-3 rounded-full ${
                      dbConnected ? 'bg-green-500' : 'bg-red-500'
                    }`}
                  />
                  <span className="text-slate-200">Database Connection</span>
                </div>
                <span className="text-sm font-medium">
                  {loading ? (
                    <span className="text-slate-400">Checking...</span>
                  ) : dbConnected ? (
                    <span className="text-green-400">Connected ✓</span>
                  ) : (
                    <span className="text-red-400">Disconnected ✗</span>
                  )}
                </span>
              </div>

              {/* Next.js Status */}
              <div className="flex items-center justify-between rounded-lg bg-slate-900/50 p-4">
                <div className="flex items-center gap-3">
                  <div className="h-3 w-3 rounded-full bg-green-500" />
                  <span className="text-slate-200">Frontend (Next.js 16)</span>
                </div>
                <span className="text-sm font-medium text-green-400">
                  Running ✓
                </span>
              </div>

              {/* AI SDK Status */}
              <div className="flex items-center justify-between rounded-lg bg-slate-900/50 p-4">
                <div className="flex items-center gap-3">
                  <div className="h-3 w-3 rounded-full bg-green-500" />
                  <span className="text-slate-200">AI SDK (Vercel AI v6)</span>
                </div>
                <span className="text-sm font-medium text-green-400">
                  Ready ✓
                </span>
              </div>
            </div>
          </Card>

          {/* Features Overview */}
          <div className="grid gap-4 sm:grid-cols-3">
            <Card className="border-slate-700 bg-slate-800/50 p-4">
              <div className="text-center">
                <div className="mb-2 text-2xl">💬</div>
                <h3 className="font-semibold text-white">Chat Interface</h3>
                <p className="text-xs text-slate-400">Real-time conversations</p>
              </div>
            </Card>

            <Card className="border-slate-700 bg-slate-800/50 p-4">
              <div className="text-center">
                <div className="mb-2 text-2xl">🤖</div>
                <h3 className="font-semibold text-white">AI Agent</h3>
                <p className="text-xs text-slate-400">Claude Sonnet 4.5</p>
              </div>
            </Card>

            <Card className="border-slate-700 bg-slate-800/50 p-4">
              <div className="text-center">
                <div className="mb-2 text-2xl">💾</div>
                <h3 className="font-semibold text-white">Database</h3>
                <p className="text-xs text-slate-400">Neon Postgres</p>
              </div>
            </Card>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
            <Link href="/chat" className="w-full sm:w-auto">
              <Button
                size="lg"
                className="w-full bg-blue-600 hover:bg-blue-700"
              >
                Start Chatting →
              </Button>
            </Link>

            <Button
              variant="outline"
              size="lg"
              className="w-full border-slate-600 text-slate-300 hover:border-slate-500 hover:bg-slate-800 sm:w-auto"
              onClick={() => window.open('/api/test-db', '_blank')}
            >
              Check DB Status
            </Button>
          </div>

          {/* Footer Info */}
          <div className="border-t border-slate-700 pt-8 text-sm text-slate-400">
            <p>
              Milestone 1: Foundation Complete ✓
              <br />
              Ready for Milestone 2: Chat Interface & Agent Wiring
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

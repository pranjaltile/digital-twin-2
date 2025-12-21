/**
 * Admin Dashboard
 * Milestone 9: Polish & Launch Quality
 * 
 * View all visitors, bookings, and conversation analytics
 * With real data from the database
 */

'use client';

import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { 
  BarChart3, Users, Calendar, MessageSquare, Download, Home, 
  RefreshCw, TrendingUp, Clock, Loader2 
} from 'lucide-react';

interface Visitor {
  id: string;
  name: string;
  email: string;
  role: string;
  createdAt: string;
}

interface Booking {
  id: string;
  visitorName: string;
  requestedDatetime: string;
  meetingType: string;
  status: string;
}

interface Stats {
  totalVisitors: number;
  totalConversations: number;
  totalBookings: number;
  pendingBookings: number;
  totalMessages: number;
  conversationsThisWeek: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats>({
    totalVisitors: 0,
    totalConversations: 0,
    totalBookings: 0,
    pendingBookings: 0,
    totalMessages: 0,
    conversationsThisWeek: 0,
  });

  const [visitors, setVisitors] = useState<Visitor[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/admin/stats');
      const data = await response.json();
      
      setStats(data.stats);
      setVisitors(data.recentVisitors || []);
      setBookings(data.recentBookings || []);
      setLastUpdated(new Date());
    } catch (error) {
      console.error('Failed to fetch admin data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    // Auto-refresh every 30 seconds
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, []);

  const downloadVisitors = () => {
    const csv = 'Name,Email,Role,Date\n' + visitors.map(v => 
      `"${v.name}","${v.email}","${v.role}","${v.createdAt}"`
    ).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `visitors-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <header className="border-b border-slate-700 bg-slate-800/50 px-4 py-4 backdrop-blur-sm sticky top-0 z-10">
        <div className="mx-auto flex max-w-6xl items-center justify-between">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-white">Admin Dashboard</h1>
            <p className="text-sm text-slate-400">Pranjal's Digital Twin Analytics</p>
          </div>
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={fetchData}
              disabled={loading}
              className="border-slate-600"
              aria-label="Refresh data"
            >
              <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline ml-2">Refresh</span>
            </Button>
            <Link href="/">
              <Button variant="outline" size="sm" className="border-slate-600">
                <Home className="h-4 w-4" />
                <span className="hidden sm:inline ml-2">Home</span>
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-6xl space-y-6 px-4 py-8" role="main">
        {/* Last Updated */}
        {lastUpdated && (
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <Clock className="h-3 w-3" />
            Last updated: {lastUpdated.toLocaleTimeString()}
          </div>
        )}

        {/* Stats Grid */}
        <section aria-label="Statistics">
          <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4 xl:grid-cols-6">
            {/* Total Visitors */}
            <Card className="border-slate-700 bg-slate-800/50 p-4 md:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs md:text-sm text-slate-400">Visitors</p>
                  <p className="text-2xl md:text-3xl font-bold text-white">
                    {loading ? <Loader2 className="h-6 w-6 animate-spin" /> : stats.totalVisitors}
                  </p>
                </div>
                <Users className="h-8 w-8 md:h-12 md:w-12 text-blue-500 opacity-20" aria-hidden="true" />
              </div>
            </Card>

            {/* Total Conversations */}
            <Card className="border-slate-700 bg-slate-800/50 p-4 md:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs md:text-sm text-slate-400">Conversations</p>
                  <p className="text-2xl md:text-3xl font-bold text-white">
                    {loading ? <Loader2 className="h-6 w-6 animate-spin" /> : stats.totalConversations}
                  </p>
                </div>
                <MessageSquare className="h-8 w-8 md:h-12 md:w-12 text-green-500 opacity-20" aria-hidden="true" />
              </div>
            </Card>

            {/* This Week */}
            <Card className="border-slate-700 bg-slate-800/50 p-4 md:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs md:text-sm text-slate-400">This Week</p>
                  <p className="text-2xl md:text-3xl font-bold text-white">
                    {loading ? <Loader2 className="h-6 w-6 animate-spin" /> : stats.conversationsThisWeek}
                  </p>
                </div>
                <TrendingUp className="h-8 w-8 md:h-12 md:w-12 text-cyan-500 opacity-20" aria-hidden="true" />
              </div>
            </Card>

            {/* Total Messages */}
            <Card className="border-slate-700 bg-slate-800/50 p-4 md:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs md:text-sm text-slate-400">Messages</p>
                  <p className="text-2xl md:text-3xl font-bold text-white">
                    {loading ? <Loader2 className="h-6 w-6 animate-spin" /> : stats.totalMessages}
                  </p>
                </div>
                <BarChart3 className="h-8 w-8 md:h-12 md:w-12 text-yellow-500 opacity-20" aria-hidden="true" />
              </div>
            </Card>

            {/* Total Bookings */}
            <Card className="border-slate-700 bg-slate-800/50 p-4 md:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs md:text-sm text-slate-400">Bookings</p>
                  <p className="text-2xl md:text-3xl font-bold text-white">
                    {loading ? <Loader2 className="h-6 w-6 animate-spin" /> : stats.totalBookings}
                  </p>
                </div>
                <Calendar className="h-8 w-8 md:h-12 md:w-12 text-purple-500 opacity-20" aria-hidden="true" />
              </div>
            </Card>

            {/* Pending Bookings */}
            <Card className="border-slate-700 bg-slate-800/50 p-4 md:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs md:text-sm text-slate-400">Pending</p>
                  <p className="text-2xl md:text-3xl font-bold text-orange-400">
                    {loading ? <Loader2 className="h-6 w-6 animate-spin" /> : stats.pendingBookings}
                  </p>
                </div>
                <Clock className="h-8 w-8 md:h-12 md:w-12 text-orange-500 opacity-20" aria-hidden="true" />
              </div>
            </Card>
          </div>
        </section>
      <div className="mx-auto max-w-6xl space-y-6 px-4 py-8">
        {/* Recent Visitors */}
        <section aria-label="Recent visitors">
          <Card className="border-slate-700 bg-slate-800/50 p-4 md:p-6">
            <div className="mb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <h2 className="text-lg md:text-xl font-bold text-white">Recent Visitors</h2>
              <Button
                size="sm"
                variant="outline"
                onClick={downloadVisitors}
                className="border-slate-600 w-full sm:w-auto"
                disabled={visitors.length === 0}
                aria-label="Export visitors to CSV"
              >
                <Download className="mr-2 h-4 w-4" />
                Export CSV
              </Button>
            </div>

            {loading ? (
              <div className="flex justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-slate-400" />
              </div>
            ) : visitors.length > 0 ? (
              <div className="overflow-x-auto -mx-4 md:mx-0">
                <table className="w-full text-sm min-w-[500px]" role="table">
                  <thead>
                    <tr className="border-b border-slate-700">
                      <th className="px-4 py-2 text-left text-slate-300 font-medium">Name</th>
                      <th className="px-4 py-2 text-left text-slate-300 font-medium">Email</th>
                      <th className="px-4 py-2 text-left text-slate-300 font-medium">Role</th>
                      <th className="px-4 py-2 text-left text-slate-300 font-medium">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {visitors.map((visitor) => (
                      <tr key={visitor.id} className="border-b border-slate-700/50 hover:bg-slate-700/30 transition-colors">
                        <td className="px-4 py-3 text-slate-200 font-medium">{visitor.name}</td>
                        <td className="px-4 py-3 text-slate-300">{visitor.email}</td>
                        <td className="px-4 py-3">
                          <span className="px-2 py-1 bg-slate-700 rounded text-xs text-slate-300">
                            {visitor.role}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-slate-400 text-xs">{visitor.createdAt}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-center text-slate-400 py-8">No visitors yet. Share your Digital Twin to get started!</p>
            )}
          </Card>
        </section>

        {/* Bookings */}
        <section aria-label="Recent bookings">
          <Card className="border-slate-700 bg-slate-800/50 p-4 md:p-6">
            <h2 className="mb-4 text-lg md:text-xl font-bold text-white">Recent Bookings</h2>

            {loading ? (
              <div className="flex justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-slate-400" />
              </div>
            ) : bookings.length > 0 ? (
              <div className="space-y-3">
                {bookings.map((booking) => (
                  <div
                    key={booking.id}
                    className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 rounded-lg bg-slate-700/50 p-4"
                  >
                    <div>
                      <p className="font-semibold text-white">{booking.visitorName}</p>
                      <p className="text-sm text-slate-400">{booking.meetingType}</p>
                    </div>
                    <div className="sm:text-right">
                      <p className="text-sm text-slate-300">{booking.requestedDatetime}</p>
                      <span className={`inline-block px-2 py-0.5 rounded text-xs font-semibold ${
                        booking.status === 'pending' 
                          ? 'bg-yellow-500/20 text-yellow-400' 
                          : booking.status === 'confirmed'
                            ? 'bg-green-500/20 text-green-400'
                            : 'bg-slate-600 text-slate-300'
                      }`}>
                        {booking.status.toUpperCase()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-slate-400 py-8">No bookings yet</p>
            )}
          </Card>
        </section>

        {/* Quick Actions */}
        <section aria-label="Quick actions">
          <Card className="border-slate-700 bg-slate-800/50 p-4 md:p-6">
            <h2 className="mb-4 text-lg font-bold text-white">Quick Actions</h2>
            <div className="flex flex-wrap gap-2">
              <Link href="/chat">
                <Button variant="outline" size="sm" className="border-slate-600">
                  <MessageSquare className="mr-2 h-4 w-4" />
                  Test Chat
                </Button>
              </Link>
              <Link href="/">
                <Button variant="outline" size="sm" className="border-slate-600">
                  <Home className="mr-2 h-4 w-4" />
                  View Landing
                </Button>
              </Link>
            </div>
          </Card>
        </section>

        {/* Info Box */}
        <Card className="border-slate-700 bg-blue-900/20 p-4 md:p-6">
          <h3 className="mb-2 font-semibold text-blue-200">ℹ️ About This Dashboard</h3>
          <p className="text-sm text-blue-300">
            This admin dashboard displays real-time analytics from your Digital Twin conversations. 
            Data refreshes automatically every 30 seconds. All visitor information is stored securely 
            in your Neon Postgres database.
          </p>
        </Card>
      </div>
    </main>
    </div>
  );
}

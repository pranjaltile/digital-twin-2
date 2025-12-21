/**
 * Admin Dashboard
 * Milestone 7: Deployment & Real-World Access
 * 
 * View all visitors, bookings, and conversation analytics
 */

'use client';

import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { BarChart3, Users, Calendar, MessageSquare, Download, Home } from 'lucide-react';

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
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats>({
    totalVisitors: 0,
    totalConversations: 0,
    totalBookings: 0,
    pendingBookings: 0,
  });

  const [visitors, setVisitors] = useState<Visitor[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // In production, these would be real API calls to fetch data
        // For now, showing placeholder structure
        setStats({
          totalVisitors: 0,
          totalConversations: 0,
          totalBookings: 0,
          pendingBookings: 0,
        });
        setLoading(false);
      } catch (error) {
        console.error('Failed to fetch admin data:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const downloadVisitors = () => {
    const csv = 'Name,Email,Role,Date\n' + visitors.map(v => `${v.name},${v.email},${v.role},${v.createdAt}`).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'visitors.csv';
    a.click();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <div className="border-b border-slate-700 bg-slate-800/50 px-4 py-4 backdrop-blur-sm">
        <div className="mx-auto flex max-w-6xl items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white">Admin Dashboard</h1>
            <p className="text-sm text-slate-400">Pranjal's Digital Twin Analytics</p>
          </div>
          <Link href="/">
            <Button variant="outline" className="border-slate-600">
              <Home className="mr-2 h-4 w-4" />
              Back to Home
            </Button>
          </Link>
        </div>
      </div>

      {/* Main Content */}
      <div className="mx-auto max-w-6xl space-y-6 px-4 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {/* Total Visitors */}
          <Card className="border-slate-700 bg-slate-800/50 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">Total Visitors</p>
                <p className="text-3xl font-bold text-white">{stats.totalVisitors}</p>
              </div>
              <Users className="h-12 w-12 text-blue-500 opacity-20" />
            </div>
          </Card>

          {/* Total Conversations */}
          <Card className="border-slate-700 bg-slate-800/50 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">Conversations</p>
                <p className="text-3xl font-bold text-white">{stats.totalConversations}</p>
              </div>
              <MessageSquare className="h-12 w-12 text-green-500 opacity-20" />
            </div>
          </Card>

          {/* Total Bookings */}
          <Card className="border-slate-700 bg-slate-800/50 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">Bookings</p>
                <p className="text-3xl font-bold text-white">{stats.totalBookings}</p>
              </div>
              <Calendar className="h-12 w-12 text-purple-500 opacity-20" />
            </div>
          </Card>

          {/* Pending Bookings */}
          <Card className="border-slate-700 bg-slate-800/50 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">Pending</p>
                <p className="text-3xl font-bold text-white">{stats.pendingBookings}</p>
              </div>
              <BarChart3 className="h-12 w-12 text-orange-500 opacity-20" />
            </div>
          </Card>
        </div>

        {/* Recent Visitors */}
        <Card className="border-slate-700 bg-slate-800/50 p-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-bold text-white">Recent Visitors</h2>
            <Button
              size="sm"
              variant="outline"
              onClick={downloadVisitors}
              className="border-slate-600"
            >
              <Download className="mr-2 h-4 w-4" />
              Export CSV
            </Button>
          </div>

          {visitors.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-700">
                    <th className="px-4 py-2 text-left text-slate-300">Name</th>
                    <th className="px-4 py-2 text-left text-slate-300">Email</th>
                    <th className="px-4 py-2 text-left text-slate-300">Role</th>
                    <th className="px-4 py-2 text-left text-slate-300">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {visitors.map((visitor) => (
                    <tr key={visitor.id} className="border-b border-slate-700 hover:bg-slate-700/50">
                      <td className="px-4 py-2 text-slate-200">{visitor.name}</td>
                      <td className="px-4 py-2 text-slate-200">{visitor.email}</td>
                      <td className="px-4 py-2 text-slate-400">{visitor.role}</td>
                      <td className="px-4 py-2 text-slate-400">{visitor.createdAt}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-center text-slate-400">No visitors yet</p>
          )}
        </Card>

        {/* Bookings */}
        <Card className="border-slate-700 bg-slate-800/50 p-6">
          <h2 className="mb-4 text-xl font-bold text-white">Recent Bookings</h2>

          {bookings.length > 0 ? (
            <div className="space-y-3">
              {bookings.map((booking) => (
                <div
                  key={booking.id}
                  className="flex items-center justify-between rounded-lg bg-slate-700/50 p-4"
                >
                  <div>
                    <p className="font-semibold text-white">{booking.visitorName}</p>
                    <p className="text-sm text-slate-400">{booking.meetingType}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-slate-300">{booking.requestedDatetime}</p>
                    <p className={`text-xs font-semibold ${booking.status === 'pending' ? 'text-yellow-400' : 'text-green-400'}`}>
                      {booking.status.toUpperCase()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-slate-400">No bookings yet</p>
          )}
        </Card>

        {/* Info Box */}
        <Card className="border-slate-700 bg-blue-900/20 p-6">
          <h3 className="mb-2 font-semibold text-blue-200">ℹ️ About This Dashboard</h3>
          <p className="text-sm text-blue-300">
            This admin dashboard displays analytics from your Digital Twin conversations. Data is automatically collected as visitors interact with your AI agent. All visitor information is stored securely in your Neon Postgres database.
          </p>
        </Card>
      </div>
    </div>
  );
}

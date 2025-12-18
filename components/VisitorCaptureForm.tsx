/**
 * Visitor Capture Form Component
 * Collects visitor information for lead capture
 * 
 * Milestone 4: Lead Capture
 */

'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { AlertCircle, CheckCircle, Loader2, Calendar } from 'lucide-react';

interface VisitorCaptureFormProps {
  conversationId: string;
  onSuccess?: () => void;
}

export function VisitorCaptureForm({ conversationId, onSuccess }: VisitorCaptureFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    linkedin: '',
  });

  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    setErrorMessage('');

    try {
      // Validate required fields
      if (!formData.name || !formData.email) {
        setErrorMessage('Name and email are required');
        setStatus('error');
        return;
      }

      // Email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        setErrorMessage('Please enter a valid email address');
        setStatus('error');
        return;
      }

      // Submit visitor information
      const response = await fetch('/api/visitors', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          conversationId,
          name: formData.name,
          email: formData.email,
          linkedin: formData.linkedin,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to save visitor information');
      }

      setStatus('success');
      setFormData({ name: '', email: '', linkedin: '' });

      // Call success callback after 2 seconds
      setTimeout(() => {
        onSuccess?.();
      }, 2000);
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'An error occurred');
      setStatus('error');
    }
  };

  return (
    <Card className="bg-slate-800 border-slate-700 p-4 sm:p-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Header */}
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-white mb-1">Connect with me</h3>
          <p className="text-sm text-slate-400">I'd love to hear more about your needs</p>
        </div>

        {/* Name Field */}
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-slate-300 mb-1">
            Full Name <span className="text-red-400">*</span>
          </label>
          <Input
            id="name"
            name="name"
            type="text"
            placeholder="John Doe"
            value={formData.name}
            onChange={handleChange}
            disabled={status === 'loading'}
            className="border-slate-600 bg-slate-900 text-white placeholder-slate-500"
          />
        </div>

        {/* Email Field */}
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-slate-300 mb-1">
            Email <span className="text-red-400">*</span>
          </label>
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="john@example.com"
            value={formData.email}
            onChange={handleChange}
            disabled={status === 'loading'}
            className="border-slate-600 bg-slate-900 text-white placeholder-slate-500"
          />
        </div>

        {/* LinkedIn Field */}
        <div>
          <label htmlFor="linkedin" className="block text-sm font-medium text-slate-300 mb-1">
            LinkedIn URL <span className="text-slate-500">(optional)</span>
          </label>
          <Input
            id="linkedin"
            name="linkedin"
            type="url"
            placeholder="https://linkedin.com/in/johndoe"
            value={formData.linkedin}
            onChange={handleChange}
            disabled={status === 'loading'}
            className="border-slate-600 bg-slate-900 text-white placeholder-slate-500"
          />
        </div>

        {/* Error Message */}
        {status === 'error' && (
          <div className="flex items-start gap-2 p-3 rounded-lg bg-red-900/20 border border-red-900/50">
            <AlertCircle className="h-4 w-4 text-red-400 mt-0.5 flex-shrink-0" />
            <p className="text-sm text-red-400">{errorMessage}</p>
          </div>
        )}

        {/* Success Message */}
        {status === 'success' && (
          <div className="flex items-start gap-2 p-3 rounded-lg bg-green-900/20 border border-green-900/50">
            <CheckCircle className="h-4 w-4 text-green-400 mt-0.5 flex-shrink-0" />
            <p className="text-sm text-green-400">Information saved! I'll follow up soon.</p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-2 pt-2">
          <Button
            type="submit"
            disabled={status === 'loading' || status === 'success'}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
          >
            {status === 'loading' && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {status === 'success' ? '✓ Saved' : 'Save & Connect'}
          </Button>
          <Button
            type="button"
            variant="outline"
            disabled={status === 'loading' || status === 'success'}
            className="border-slate-600 text-slate-300 hover:border-slate-500 hover:bg-slate-700"
            onClick={() => {
              // Scroll to calendar section if available
              document.getElementById('scheduling')?.scrollIntoView({ behavior: 'smooth' });
            }}
          >
            <Calendar className="h-4 w-4" />
            <span className="hidden sm:inline ml-2">Schedule Call</span>
          </Button>
        </div>
      </form>
    </Card>
  );
}

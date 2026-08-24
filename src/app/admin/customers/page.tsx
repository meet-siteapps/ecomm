'use client';

import { useState, useEffect } from 'react';
import { Users, Mail, Phone, Calendar, Shield, Loader2 } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { UserProfile } from '@/types/user';

export default function AdminCustomersPage() {
  const [customers, setCustomers] = useState<UserProfile[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadCustomers() {
      setIsLoading(true);
      try {
        const supabase = createClient();
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .order('created_at', { ascending: false });

        if (!error && data) {
          setCustomers(data as UserProfile[]);
        }
      } catch (err) {
        console.error('Error fetching customers:', err);
      } finally {
        setIsLoading(false);
      }
    }
    loadCustomers();
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1F2937] tracking-tight">
          Customer Accounts
        </h1>
        <p className="text-xs sm:text-sm text-gray-500 mt-1">
          Registered customers and admin accounts from your Supabase profiles
        </p>
      </div>

      <div className="bg-white rounded-3xl border border-gray-200/80 shadow-xs overflow-hidden">
        {isLoading ? (
          <div className="p-16 text-center space-y-3">
            <Loader2 className="w-8 h-8 animate-spin text-[#4DA3FF] mx-auto" />
            <p className="text-xs text-gray-500 font-medium">Loading user profiles...</p>
          </div>
        ) : customers.length === 0 ? (
          <div className="p-16 text-center space-y-3">
            <Users className="w-10 h-10 text-gray-300 mx-auto" />
            <h3 className="text-sm font-bold text-[#1F2937]">No customer records yet</h3>
            <p className="text-xs text-gray-400">
              When users register on your site, their profiles will appear here.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-gray-700">
              <thead className="bg-gray-50/80 text-[11px] font-bold uppercase tracking-wider text-gray-500 border-b border-gray-100">
                <tr>
                  <th className="px-5 py-3.5">User</th>
                  <th className="px-4 py-3.5">Email</th>
                  <th className="px-4 py-3.5">Phone</th>
                  <th className="px-4 py-3.5">Role</th>
                  <th className="px-5 py-3.5 text-right">Joined</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {customers.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50/70 transition-colors">
                    <td className="px-5 py-4 font-bold text-[#1F2937]">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-[#EAF6FF] text-[#4DA3FF] font-bold flex items-center justify-center text-xs">
                          {user.name ? user.name[0]?.toUpperCase() : 'U'}
                        </div>
                        <span>{user.name || 'Anonymous User'}</span>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-gray-600">
                      <div className="flex items-center gap-1.5">
                        <Mail className="w-3.5 h-3.5 text-gray-400" />
                        <span>{user.email}</span>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-gray-600">
                      {user.phone ? (
                        <div className="flex items-center gap-1.5">
                          <Phone className="w-3.5 h-3.5 text-gray-400" />
                          <span>{user.phone}</span>
                        </div>
                      ) : (
                        <span className="text-gray-400">—</span>
                      )}
                    </td>
                    <td className="px-4 py-4">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                          user.role === 'admin'
                            ? 'bg-purple-100 text-purple-700 border border-purple-200'
                            : 'bg-blue-50 text-blue-700 border border-blue-200'
                        }`}
                      >
                        {user.role === 'admin' && <Shield className="w-3 h-3" />}
                        <span className="capitalize">{user.role}</span>
                      </span>
                    </td>
                    <td className="px-5 py-4 text-right text-gray-500 text-[11px]">
                      {user.created_at
                        ? new Date(user.created_at).toLocaleDateString('en-IN', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                          })
                        : '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

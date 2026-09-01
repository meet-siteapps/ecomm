'use client';

import { useState, useEffect } from 'react';
import { Users, Mail, Phone, Calendar, Shield, Loader2, Search, ShoppingBag, RefreshCw } from 'lucide-react';
import { createClient } from '@/frontend/lib/supabase/client';
import { UserProfile } from '@/frontend/types/user';

interface CustomerWithStats extends UserProfile {
  order_count?: number;
  total_spent?: number;
}

export default function AdminCustomersPage() {
  const [customers, setCustomers] = useState<CustomerWithStats[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');

  const loadCustomers = async () => {
    setIsLoading(true);
    try {
      const supabase = createClient();

      // 1. Fetch all profiles
      const { data: profiles, error: profErr } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      // 2. Fetch orders to calculate customer order counts
      const { data: ordersData, error: ordersErr } = await supabase
        .from('orders')
        .select('user_id, customer_email, total');

      if (!profErr && profiles) {
        const enhanced: CustomerWithStats[] = profiles.map((p) => {
          const userOrders = (ordersData || []).filter(
            (o) => o.user_id === p.id || (o.customer_email && o.customer_email.toLowerCase() === p.email.toLowerCase())
          );
          const totalSpent = userOrders.reduce((sum, o) => sum + (Number(o.total) || 0), 0);

          return {
            ...p,
            order_count: userOrders.length,
            total_spent: totalSpent,
          };
        });

        setCustomers(enhanced);
      }
    } catch (err) {
      console.error('Error fetching customers:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadCustomers();
  }, []);

  const filteredCustomers = customers.filter((c) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    const nameMatch = c.name?.toLowerCase().includes(q);
    const emailMatch = c.email?.toLowerCase().includes(q);
    const phoneMatch = c.phone?.toLowerCase().includes(q);
    return nameMatch || emailMatch || phoneMatch;
  });

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1F2937] tracking-tight">
            Customer Directory
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            Registered customer accounts, contact details, and lifetime order counts
          </p>
        </div>

        <button
          type="button"
          onClick={loadCustomers}
          disabled={isLoading}
          className="self-start sm:self-auto inline-flex items-center gap-2 px-3.5 py-2 rounded-xl border border-gray-200 bg-white text-xs font-semibold text-gray-600 hover:bg-gray-50 transition-colors shadow-2xs"
          title="Refresh customers"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
          <span>Refresh</span>
        </button>
      </div>

      {/* Search Filter Bar */}
      <div className="bg-white p-4 rounded-2xl border border-gray-200/80 shadow-xs flex items-center">
        <div className="relative flex-1">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search customers by name, email, or phone..."
            className="w-full bg-gray-50 text-xs text-[#1F2937] placeholder-gray-400 rounded-xl pl-9 pr-3 py-2 border border-gray-200 focus:bg-white focus:border-[#4DA3FF] focus:outline-none"
          />
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
        </div>
      </div>

      {/* Customers Table */}
      <div className="bg-white rounded-3xl border border-gray-200/80 shadow-xs overflow-hidden">
        {isLoading ? (
          <div className="p-16 text-center space-y-3">
            <Loader2 className="w-8 h-8 animate-spin text-[#4DA3FF] mx-auto" />
            <p className="text-xs text-gray-500 font-medium">Loading customer profiles...</p>
          </div>
        ) : filteredCustomers.length === 0 ? (
          <div className="p-16 text-center space-y-3">
            <Users className="w-10 h-10 text-gray-300 mx-auto" />
            <h3 className="text-sm font-bold text-[#1F2937]">No customers found</h3>
            <p className="text-xs text-gray-400">
              When users register on your storefront, their profiles will appear here.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-gray-700">
              <thead className="bg-gray-50/80 text-[11px] font-bold uppercase tracking-wider text-gray-500 border-b border-gray-100">
                <tr>
                  <th className="px-5 py-3.5">Customer Name</th>
                  <th className="px-4 py-3.5">Email</th>
                  <th className="px-4 py-3.5">Phone</th>
                  <th className="px-4 py-3.5 text-center">Orders</th>
                  <th className="px-4 py-3.5">Account Type</th>
                  <th className="px-5 py-3.5 text-right">Registered</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredCustomers.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50/70 transition-colors">
                    {/* Name */}
                    <td className="px-5 py-4 font-bold text-[#1F2937]">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-[#EAF6FF] text-[#4DA3FF] font-bold flex items-center justify-center text-xs">
                          {user.name ? user.name[0]?.toUpperCase() : 'U'}
                        </div>
                        <span>{user.name || 'Anonymous Customer'}</span>
                      </div>
                    </td>

                    {/* Email */}
                    <td className="px-4 py-4 text-gray-600">
                      <div className="flex items-center gap-1.5">
                        <Mail className="w-3.5 h-3.5 text-gray-400" />
                        <span>{user.email}</span>
                      </div>
                    </td>

                    {/* Phone */}
                    <td className="px-4 py-4 text-gray-600">
                      {user.phone ? (
                        <div className="flex items-center gap-1.5">
                          <Phone className="w-3.5 h-3.5 text-gray-400" />
                          <span>{user.phone}</span>
                        </div>
                      ) : (
                        <span className="text-gray-400 italic">Not provided</span>
                      )}
                    </td>

                    {/* Orders Count & Total Spent */}
                    <td className="px-4 py-4 text-center">
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-gray-100 font-bold text-gray-800 text-xs">
                        <ShoppingBag className="w-3 h-3 text-[#4DA3FF]" />
                        <span>{user.order_count || 0}</span>
                      </span>
                    </td>

                    {/* Role */}
                    <td className="px-4 py-4">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide ${
                          user.role === 'admin'
                            ? 'bg-purple-100 text-purple-700 border border-purple-200'
                            : 'bg-blue-50 text-blue-700 border border-blue-200'
                        }`}
                      >
                        {user.role === 'admin' && <Shield className="w-3 h-3" />}
                        <span>{user.role}</span>
                      </span>
                    </td>

                    {/* Registered Date */}
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

'use client';

import { useState } from 'react';
import { MapPin, CheckCircle2, AlertCircle, Truck } from 'lucide-react';

export function PincodeChecker() {
  const [pincode, setPincode] = useState('');
  const [status, setStatus] = useState<'idle' | 'available' | 'invalid'>('idle');
  const [deliveryDate, setDeliveryDate] = useState('');

  const handleCheck = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanPin = pincode.trim();
    if (/^\d{6}$/.test(cleanPin)) {
      setStatus('available');
      const date = new Date();
      date.setDate(date.getDate() + 3);
      setDeliveryDate(
        date.toLocaleDateString('en-IN', {
          weekday: 'short',
          month: 'short',
          day: 'numeric',
        })
      );
    } else {
      setStatus('invalid');
      setDeliveryDate('');
    }
  };

  return (
    <div className="p-4 rounded-3xl bg-[#FAF7F2] border border-[#EFE7DE] space-y-3 shadow-2xs">
      <div className="flex items-center gap-2 text-xs font-bold text-[#2D3748]">
        <div className="w-6 h-6 rounded-lg bg-[#FFEAEF] text-[#FF6B8B] flex items-center justify-center">
          <Truck className="w-3.5 h-3.5" />
        </div>
        <span>Delivery Options & Estimate</span>
      </div>

      <form onSubmit={handleCheck} className="flex gap-2">
        <div className="relative flex-1">
          <input
            type="text"
            maxLength={6}
            value={pincode}
            onChange={(e) => {
              setPincode(e.target.value.replace(/\D/g, ''));
              if (status !== 'idle') setStatus('idle');
            }}
            placeholder="Enter 6-digit Pincode"
            className="w-full bg-white text-xs text-[#2D3748] placeholder-gray-400 rounded-full pl-9 pr-3.5 py-2.5 border border-[#EFE7DE] focus:border-[#FF6B8B] focus:outline-none focus:ring-2 focus:ring-[#FF6B8B]/20 font-medium"
          />
          <MapPin className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
        </div>
        <button
          type="submit"
          disabled={pincode.length !== 6}
          className="px-5 py-2.5 rounded-full bg-[#FF6B8B] hover:bg-[#FA5578] text-white text-xs font-bold disabled:bg-gray-200 disabled:text-gray-400 transition-all shadow-cute-pink active:scale-95"
        >
          Check
        </button>
      </form>

      {status === 'available' && (
        <div className="flex items-center gap-2 text-xs text-[#059669] font-medium bg-[#D1FAE5]/60 p-2.5 rounded-2xl animate-in fade-in-50 duration-200">
          <CheckCircle2 className="w-4 h-4 shrink-0 text-[#10B981]" />
          <span>Delivery available by <strong>{deliveryDate}</strong>. Free shipping applicable.</span>
        </div>
      )}

      {status === 'invalid' && (
        <div className="flex items-center gap-2 text-xs text-[#E11D48] font-medium bg-[#FFEAEF] p-2.5 rounded-2xl animate-in fade-in-50 duration-200">
          <AlertCircle className="w-4 h-4 shrink-0 text-[#FF6B8B]" />
          <span>Please enter a valid 6-digit Indian pincode.</span>
        </div>
      )}
    </div>
  );
}

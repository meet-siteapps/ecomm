'use client';

import { useState } from 'react';
import { Mail, Phone, MapPin, Send, CheckCircle2, MessageSquare, Clock, Sparkles } from 'lucide-react';

export default function ContactPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !message.trim()) return;
    setSubmitted(true);
  };

  return (
    <div className="w-full space-y-12 sm:space-y-16 pb-16">
      {/* 1. HEADER SECTION */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#FDE8EB]/60 via-[#FAF4EE] to-[#FAF4EE] pt-10 sm:pt-16 pb-10 sm:pb-14 px-4 sm:px-6 lg:px-8 border-b border-[#EFE4D6]">
        <div className="max-w-3xl mx-auto text-center space-y-3 relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white text-[#F27A8A] text-xs font-extrabold border border-[#F27A8A]/20 shadow-cute">
            <Sparkles className="w-3.5 h-3.5 text-[#F27A8A]" />
            <span>We&apos;re Here to Help</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold text-[#193653] tracking-tight leading-tight">
            Get in Touch with Us
          </h1>

          <p className="text-xs sm:text-sm text-[#5D7285] max-w-xl mx-auto font-medium leading-relaxed">
            Have questions about sizes, order status, or nursery products? Our friendly team is always here to assist you and your little one!
          </p>
        </div>
      </section>

      {/* 2. MAIN CONTACT GRID (CARDS + FORM) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Contact Cards */}
          <div className="lg:col-span-5 space-y-4">
            {/* Email Support */}
            <div className="bg-white p-6 rounded-3xl border border-[#EFE4D6] shadow-cute space-y-2 flex items-start gap-4">
              <div className="w-11 h-11 rounded-2xl bg-[#FDE8EB] text-[#F27A8A] flex items-center justify-center shrink-0">
                <Mail className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <h3 className="text-sm font-extrabold text-[#193653]">Email Support</h3>
                <p className="text-xs text-[#5D7285] font-medium">For orders, inquiries, &amp; returns</p>
                <a href="mailto:support@babyladoo.com" className="text-xs font-bold text-[#F27A8A] hover:underline block pt-0.5">
                  support@babyladoo.com
                </a>
              </div>
            </div>

            {/* Phone & WhatsApp */}
            <div className="bg-white p-6 rounded-3xl border border-[#EFE4D6] shadow-cute space-y-2 flex items-start gap-4">
              <div className="w-11 h-11 rounded-2xl bg-[#EBF8FC] text-[#8FD3E8] flex items-center justify-center shrink-0">
                <Phone className="w-5 h-5 text-[#3599b8]" />
              </div>
              <div className="space-y-1">
                <h3 className="text-sm font-extrabold text-[#193653]">Phone &amp; WhatsApp</h3>
                <p className="text-xs text-[#5D7285] font-medium">Mon - Sat, 9:00 AM - 7:00 PM</p>
                <a href="tel:+919876543210" className="text-xs font-bold text-[#193653] hover:text-[#F27A8A] transition-colors block pt-0.5">
                  +91 98765 43210
                </a>
              </div>
            </div>

            {/* Business Hours */}
            <div className="bg-white p-6 rounded-3xl border border-[#EFE4D6] shadow-cute space-y-2 flex items-start gap-4">
              <div className="w-11 h-11 rounded-2xl bg-[#EFF7E9] text-[#A8C98B] flex items-center justify-center shrink-0">
                <Clock className="w-5 h-5 text-[#729c50]" />
              </div>
              <div className="space-y-1">
                <h3 className="text-sm font-extrabold text-[#193653]">Fast Order Dispatch</h3>
                <p className="text-xs text-[#5D7285] font-medium">Orders are packed and dispatched within 24–48 hours across India.</p>
              </div>
            </div>
          </div>

          {/* Right Column: Interactive Contact Form */}
          <div className="lg:col-span-7">
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#EFE4D6] shadow-cute space-y-6">
              <div className="border-b border-[#EFE4D6] pb-4">
                <h2 className="text-lg font-extrabold text-[#193653] flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-[#F27A8A]" />
                  <span>Send Us a Message</span>
                </h2>
                <p className="text-xs text-[#5D7285] mt-1 font-medium">
                  Fill out the form below and we will get back to you within 24 hours.
                </p>
              </div>

              {submitted ? (
                <div className="p-8 text-center space-y-4 bg-[#EFF7E9] rounded-2xl border border-[#A8C98B]/40 animate-in fade-in">
                  <div className="w-14 h-14 rounded-full bg-white text-[#729c50] flex items-center justify-center mx-auto shadow-2xs">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h3 className="text-base font-extrabold text-[#193653]">Thank You for Reaching Out!</h3>
                  <p className="text-xs text-[#5D7285] max-w-sm mx-auto font-medium">
                    We have received your message and our customer care team will get back to you shortly.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setSubmitted(false);
                      setName('');
                      setEmail('');
                      setPhone('');
                      setSubject('');
                      setMessage('');
                    }}
                    className="px-6 py-2.5 rounded-full bg-[#F27A8A] text-white text-xs font-bold shadow-cute-pink"
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-[#193653]">Your Name *</label>
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="e.g. Priyanshu Sharma"
                        className="w-full text-xs text-[#193653] bg-[#FAF4EE] rounded-2xl px-4 py-3 border border-[#EFE4D6] focus:bg-white focus:border-[#F27A8A] focus:outline-none focus:ring-2 focus:ring-[#F27A8A]/20 font-medium"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-[#193653]">Email Address *</label>
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="name@example.com"
                        className="w-full text-xs text-[#193653] bg-[#FAF4EE] rounded-2xl px-4 py-3 border border-[#EFE4D6] focus:bg-white focus:border-[#F27A8A] focus:outline-none focus:ring-2 focus:ring-[#F27A8A]/20 font-medium"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-[#193653]">Phone Number (Optional)</label>
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="+91 98765 43210"
                        className="w-full text-xs text-[#193653] bg-[#FAF4EE] rounded-2xl px-4 py-3 border border-[#EFE4D6] focus:bg-white focus:border-[#F27A8A] focus:outline-none focus:ring-2 focus:ring-[#F27A8A]/20 font-medium"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-[#193653]">Subject</label>
                      <input
                        type="text"
                        value={subject}
                        onChange={(e) => setSubject(e.target.value)}
                        placeholder="e.g. Order inquiry, size question"
                        className="w-full text-xs text-[#193653] bg-[#FAF4EE] rounded-2xl px-4 py-3 border border-[#EFE4D6] focus:bg-white focus:border-[#F27A8A] focus:outline-none focus:ring-2 focus:ring-[#F27A8A]/20 font-medium"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-[#193653]">Your Message *</label>
                    <textarea
                      required
                      rows={4}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Write your question or feedback here..."
                      className="w-full text-xs text-[#193653] bg-[#FAF4EE] rounded-2xl px-4 py-3 border border-[#EFE4D6] focus:bg-white focus:border-[#F27A8A] focus:outline-none focus:ring-2 focus:ring-[#F27A8A]/20 font-medium resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-[#F27A8A] hover:bg-[#e06878] text-white font-extrabold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shadow-cute-pink active:scale-98"
                  >
                    <span>Send Message</span>
                    <Send className="w-4 h-4" />
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

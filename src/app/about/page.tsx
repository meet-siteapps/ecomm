import Link from 'next/link';
import { ShieldCheck, Heart, Leaf, Sparkles, ArrowRight, Award, Users, Smile } from 'lucide-react';
import { CuteTeddyLogo, HotAirBalloonIllustration } from '@/components/common/CartoonIllustrations';

export const metadata = {
  title: 'About Us | Baby Ladoo',
  description: 'Learn about our passion for creating safe, soft, and sustainable baby essentials.',
};

export default function AboutPage() {
  return (
    <div className="w-full space-y-12 sm:space-y-16 pb-16">
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#FDE8EB]/60 via-[#FAF4EE] to-[#FAF4EE] pt-10 sm:pt-16 pb-12 sm:pb-16 px-4 sm:px-6 lg:px-8 border-b border-[#EFE4D6]">
        <div className="max-w-4xl mx-auto text-center space-y-4 relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white text-[#F27A8A] text-xs font-extrabold border border-[#F27A8A]/20 shadow-cute">
            <Sparkles className="w-3.5 h-3.5 text-[#F27A8A]" />
            <span>Our Story &amp; Passion</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold text-[#193653] tracking-tight leading-tight">
            Crafted with <span className="text-[#F27A8A]">Love</span> for Every Little Smile
          </h1>

          <p className="text-sm sm:text-base text-[#5D7285] max-w-2xl mx-auto font-medium leading-relaxed">
            At Baby Ladoo, we believe every baby deserves gentle, non-toxic, and joyful essentials designed with the utmost care, softest organic fabrics, and playful imagination.
          </p>
        </div>
      </section>

      {/* 2. OUR VALUES GRID */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#193653] tracking-tight">
            Why Parents Trust Us
          </h2>
          <p className="text-xs sm:text-sm text-[#5D7285] font-medium">
            Every product in our collection is thoughtfully vetted for purity, comfort, and durability.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {/* Card 1: 100% Safe */}
          <div className="bg-white p-6 rounded-3xl border border-[#EFE4D6] shadow-cute space-y-3 hover:-translate-y-1 transition-transform">
            <div className="w-12 h-12 rounded-2xl bg-[#EFF7E9] text-[#A8C98B] flex items-center justify-center">
              <ShieldCheck className="w-6 h-6 text-[#729c50]" />
            </div>
            <h3 className="text-base font-extrabold text-[#193653]">100% Safe &amp; Certified</h3>
            <p className="text-xs text-[#5D7285] leading-relaxed font-medium">
              Free from harmful chemicals, heavy metals, and rough seams. Dermatologist and safety certified.
            </p>
          </div>

          {/* Card 2: Pure Organic */}
          <div className="bg-white p-6 rounded-3xl border border-[#EFE4D6] shadow-cute space-y-3 hover:-translate-y-1 transition-transform">
            <div className="w-12 h-12 rounded-2xl bg-[#FDE8EB] text-[#F27A8A] flex items-center justify-center">
              <Leaf className="w-6 h-6" />
            </div>
            <h3 className="text-base font-extrabold text-[#193653]">Organic Materials</h3>
            <p className="text-xs text-[#5D7285] leading-relaxed font-medium">
              Made with pure, breathable GOTS-certified organic cotton, natural woods, and food-grade silicone.
            </p>
          </div>

          {/* Card 3: Thoughtful Design */}
          <div className="bg-white p-6 rounded-3xl border border-[#EFE4D6] shadow-cute space-y-3 hover:-translate-y-1 transition-transform">
            <div className="w-12 h-12 rounded-2xl bg-[#EBF8FC] text-[#8FD3E8] flex items-center justify-center">
              <Smile className="w-6 h-6 text-[#3599b8]" />
            </div>
            <h3 className="text-base font-extrabold text-[#193653]">Gentle on Skin</h3>
            <p className="text-xs text-[#5D7285] leading-relaxed font-medium">
              Designed with ultra-soft tagless necklines, smooth rounded edges, and easy-change snaps.
            </p>
          </div>

          {/* Card 4: Parent Approved */}
          <div className="bg-white p-6 rounded-3xl border border-[#EFE4D6] shadow-cute space-y-3 hover:-translate-y-1 transition-transform">
            <div className="w-12 h-12 rounded-2xl bg-[#FEF9E8] text-[#F6D77A] flex items-center justify-center">
              <Heart className="w-6 h-6 fill-[#E0B538] text-[#E0B538]" />
            </div>
            <h3 className="text-base font-extrabold text-[#193653]">Loved by Parents</h3>
            <p className="text-xs text-[#5D7285] leading-relaxed font-medium">
              Trusted by thousands of happy families across the country for everyday comfort and smiles.
            </p>
          </div>
        </div>
      </section>

      {/* 3. STORY SECTION WITH MASCOT */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl border border-[#EFE4D6] p-8 sm:p-12 shadow-cute grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
          <div className="md:col-span-7 space-y-4">
            <div className="w-10 h-10 rounded-2xl bg-[#FDE8EB] p-1 flex items-center justify-center border border-[#F27A8A]/30">
              <CuteTeddyLogo className="w-full h-full" />
            </div>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-[#193653] tracking-tight">
              From Baby Ladoo with Love
            </h3>
            <p className="text-xs sm:text-sm text-[#5D7285] leading-relaxed font-medium">
              Our journey started with a simple vision: to create baby essentials that do not compromise on softness, safety, or design. We wanted items that look beautiful in modern nurseries while ensuring your baby sleeps, plays, and grows in total comfort.
            </p>
            <p className="text-xs sm:text-sm text-[#5D7285] leading-relaxed font-medium">
              From our organic cotton onesies and cozy muslin swaddles to durable cribs and sensory wooden toys, every single piece is created with love, safety, and joy.
            </p>
            <div className="pt-2">
              <Link
                href="/products"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-[#F27A8A] hover:bg-[#e06878] text-white text-xs font-extrabold shadow-cute-pink transition-all"
              >
                <span>Shop Our Collection</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          <div className="md:col-span-5 flex justify-center items-center">
            <HotAirBalloonIllustration className="w-36 h-52 sm:w-44 sm:h-60" />
          </div>
        </div>
      </section>
    </div>
  );
}

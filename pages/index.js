import Image from 'next/image';

export default function Home() {
  return (
    <div className="min-h-screen bg-[#F7F9FB] text-[#2C3E50] flex items-center justify-center p-6">
      <div className="text-center max-w-2xl space-y-6">
        {/* Logo */}
        <div className="flex justify-center">
          <Image src="/logo.png" width={140} height={140} alt="BuyRight logo" />
        </div>

        {/* Headline */}
        <h1 className="text-4xl md:text-5xl font-bold">
          Know if it’s a good deal — in 60 seconds.
        </h1>

        {/* Subheading */}
        <p className="text-lg text-[#555]">
          We help first-time buyers evaluate service businesses instantly —
          no spreadsheets, no confusion, just clear next steps.
        </p>

        {/* CTA Button */}
        <div className="mt-6">
          <a
            href="/analyzer"
            className="bg-[#2C3E50] text-white px-6 py-3 rounded-xl text-base font-medium hover:bg-[#1B2838]"
          >
            Launch Analyzer
          </a>
        </div>
      </div>
    </div>
  );
}

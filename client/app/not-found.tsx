import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-6 text-center">
      <h2 className="text-4xl font-black mb-4">404 - Page Not Found</h2>
      <p className="text-neutral-400 mb-6 text-sm">The academic page or resource you are looking for does not exist.</p>
      <Link href="/" className="px-6 py-3 bg-white text-black font-bold rounded-xl text-sm shadow-[0_0_20px_rgba(255,255,255,0.3)] hover:scale-105 transition-all">
        Return to Command Center
      </Link>
    </div>
  );
}

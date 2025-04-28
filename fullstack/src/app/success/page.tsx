import Link from 'next/link';

export default function SuccessPage() {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-black text-white p-8">
        <h1 className="text-4xl font-bold mb-4">✨ Payment Complete!</h1>
        <p className="text-lg text-gray-300 mb-8">
          Your magical artifacts are being summoned.
        </p>
        <Link
          href="/"
          className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 px-6 rounded-lg transition"
        >
          Return to the Enchanted Store
        </Link>
      </div>
    );
  }
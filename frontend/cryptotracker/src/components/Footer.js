import React from 'react'

function Footer() {
  return (
    <footer className="bg-[#031021] text-primary-50 border-t border-zinc-700">
  <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8">
      <div>
        <h3 className="text-xl font-semibold mb-4">About Us</h3>
        <p className="text-gray-400">Discover the power of blockchain with our comprehensive cryptocurrency data platform. Stay ahead with real-time analytics, news, and in-depth market analysis.</p>
        <div className="mt-4">
          <a href="/about" className="text-teal-500 hover:text-teal-400">Learn more &rarr;</a>
        </div>
      </div>
      <div>
        <h3 className="text-xl font-semibold mb-4">Quick Links</h3>
        <ul className="space-y-2">
          <li><a href="/cryptocurrencies" className="hover:text-teal-500">Cryptocurrencies</a></li>
          <li><a href="/exchanges" className="hover:text-teal-500">Exchanges</a></li>
          <li><a href="/news" className="hover:text-teal-500">News</a></li>
          <li><a href="/watchlist" className="hover:text-teal-500">Watchlist</a></li>
        </ul>
      </div>
      <div>
        <h3 className="text-xl font-semibold mb-4">Support</h3>
        <ul className="space-y-2">
          <li><a href="/contact" className="hover:text-teal-500">Contact Us</a></li>
          <li><a href="/faq" className="hover:text-teal-500">FAQs</a></li>
          <li><a href="/support" className="hover:text-teal-500">Technical Support</a></li>
        </ul>
      </div>
      <div>
        <h3 className="text-xl font-semibold mb-4">Follow Us</h3>
        <div className="flex space-x-4">
          <a href="https://twitter.com" className="hover:text-teal-500"><i className="fab fa-twitter"></i></a>
          <a href="https://facebook.com" className="hover:text-teal-500"><i className="fab fa-facebook-f"></i></a>
          <a href="https://linkedin.com" className="hover:text-teal-500"><i className="fab fa-linkedin-in"></i></a>
          <a href="https://instagram.com" className="hover:text-teal-500"><i className="fab fa-instagram"></i></a>
        </div>
      </div>
    </div>
    <div className="mt-12 border-t border-gray-700 pt-8">
      <p className="text-center text-gray-400">&copy; 2023 CryptoData. All rights reserved.</p>
    </div>
  </div>
</footer>

  )
}

export default Footer
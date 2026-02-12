export default function Footer() {
  return (
    <footer className="bg-gray-50 border-t border-gray-200 py-8">
      <div className="container mx-auto px-4">
        <div className="text-center">
          <div className="flex items-center gap-2 mb-3 justify-center">
            <div className="w-8 h-8 bg-gradient-to-br from-teal-500 to-teal-600 rounded-lg flex items-center justify-center">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <rect x="7" y="4" width="2" height="12" rx="1" fill="white" />
                <rect x="4" y="7" width="12" height="2" rx="1" fill="white" />
              </svg>
            </div>
            <span className="text-lg font-bold text-gray-900">
              VitalCare<span className="text-teal-600">AI</span>
            </span>
          </div>
          <p className="text-sm text-gray-600 mb-2">Your 24/7 AI Health Assistant</p>
          <p className="text-xs text-gray-500">© 2026 VitalCare AI. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

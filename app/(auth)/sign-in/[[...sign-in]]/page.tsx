import { SignIn } from '@clerk/nextjs'
import Link from 'next/link'
import Image from 'next/image'

export default function Page() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-white to-teal-50 flex">
      {/* Left Side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-teal-600 to-teal-700 p-12 flex-col justify-between relative overflow-hidden">
        {/* Decorative circles */}
        <div className="absolute top-20 right-20 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 left-20 w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>

        <div className="relative z-10">
          <Link href="/" className="flex items-center gap-2 mb-12">
            <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <rect x="9" y="5" width="2" height="14" rx="1" fill="#14B8A6" />
                <rect x="5" y="9" width="14" height="2" rx="1" fill="#14B8A6" />
              </svg>
            </div>
            <span className="text-2xl font-bold text-white">VitalCare<span className="text-teal-200">AI</span></span>
          </Link>

          <div className="space-y-6 text-white">
            <h1 className="text-4xl font-bold leading-tight">
              Welcome Back to Your Health Journey
            </h1>
            <p className="text-lg text-teal-100">
              Access your personalized AI health assistant and continue your path to better health.
            </p>

            <div className="space-y-4 pt-8">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                  <span className="text-white">✓</span>
                </div>
                <p className="text-teal-50">24/7 AI-powered health support</p>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                  <span className="text-white">✓</span>
                </div>
                <p className="text-teal-50">Instant symptom analysis</p>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                  <span className="text-white">✓</span>
                </div>
                <p className="text-teal-50">Personalized health reports</p>
              </div>
            </div>
          </div>
        </div>

        <div className="relative z-10 text-teal-100 text-sm">
          <p>&copy; 2026 VitalCare AI. All rights reserved.</p>
        </div>
      </div>

      {/* Right Side - Sign In Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <Link href="/" className="flex lg:hidden items-center gap-2 mb-8 justify-center">
            <div className="w-10 h-10 bg-gradient-to-br from-teal-500 to-teal-600 rounded-lg flex items-center justify-center">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <rect x="9" y="5" width="2" height="14" rx="1" fill="white" />
                <rect x="5" y="9" width="14" height="2" rx="1" fill="white" />
              </svg>
            </div>
            <span className="text-2xl font-bold text-gray-900">VitalCare<span className="text-teal-600">AI</span></span>
          </Link>

          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Sign In</h2>
            <p className="text-gray-600">Enter your credentials to access your account</p>
          </div>

          <SignIn
            appearance={{
              elements: {
                rootBox: "w-full",
                card: "shadow-xl bg-white rounded-2xl border border-gray-100 p-8",
                headerTitle: "hidden",
                headerSubtitle: "hidden",
                socialButtonsBlockButton: "bg-white border-2 border-gray-200 hover:border-teal-500 hover:bg-teal-50 text-gray-700 rounded-xl transition-all duration-200 font-medium",
                socialButtonsBlockButtonText: "font-semibold text-gray-700",
                dividerLine: "bg-gray-200",
                dividerText: "text-gray-500 text-sm",
                formButtonPrimary: "bg-teal-600 hover:bg-teal-700 text-white rounded-xl py-3 font-semibold shadow-md hover:shadow-lg transition-all duration-200",
                footerActionLink: "text-teal-600 hover:text-teal-700 font-semibold",
                footerActionText: "text-gray-600",
                formFieldInput: "border-2 border-gray-200 focus:border-teal-500 focus:ring-2 focus:ring-teal-200 rounded-xl py-3 transition-all duration-200 text-gray-900",
                formFieldLabel: "text-gray-700 font-semibold mb-2",
                identityPreviewText: "text-gray-700 font-medium",
                identityPreviewEditButton: "text-teal-600 hover:text-teal-700 font-medium",
                formFieldInputShowPasswordButton: "text-gray-500 hover:text-teal-600",
                otpCodeFieldInput: "border-2 border-gray-200 focus:border-teal-500 rounded-xl",
                formResendCodeLink: "text-teal-600 hover:text-teal-700 font-medium",
                formFieldAction: "text-teal-600 hover:text-teal-700 font-medium",
                identityPreview: "border-2 border-gray-200 rounded-xl",
                alternativeMethodsBlockButton: "border-2 border-gray-200 hover:border-teal-500 hover:bg-teal-50 rounded-xl"
              },
              layout: {
                socialButtonsPlacement: "top",
                socialButtonsVariant: "blockButton"
              }
            }}
          />
        </div>
      </div>
    </div>
  )
}

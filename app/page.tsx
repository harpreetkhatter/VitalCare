"use client";

import { motion } from "motion/react";
import { Button } from "@/components/ui/button";
import { useUser, UserButton } from "@clerk/nextjs";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function LandingPage() {
  const router = useRouter();

  return (
    <div className="relative min-h-screen bg-white">
      <Navbar />

      {/* Hero Section */}
      <HeroSection router={router} />

      {/* How It Works Section */}
      <HowItWorksSection />

      {/* Comprehensive Care Section */}
      <ComprehensiveCareSection />

      {/* AI Specialists Section */}
      <AISpecialistsSection />

      {/* CTA Section */}
      <CTASection router={router} />

      {/* Footer */}
      <Footer />
    </div>
  );
}

const Navbar = () => {
  const { user } = useUser();
  const router = useRouter();

  return (
    <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-100">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 md:h-18">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-teal-500 to-teal-600 rounded-lg flex items-center justify-center">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <rect x="7" y="4" width="2" height="12" rx="1" fill="white" />
                  <rect x="4" y="7" width="12" height="2" rx="1" fill="white" />
                  <circle cx="10" cy="10" r="1.5" fill="white" opacity="0.5" />
                </svg>
              </div>
              <span className="text-xl font-bold text-gray-900">VitalCare<span className="text-teal-600">AI</span></span>
            </div>
          </Link>

          {/* Right Side */}
          <div className="flex items-center gap-3">
            {!user ? (
              <>
                <Link href="/sign-in">
                  <Button
                    variant="ghost"
                    className="text-gray-700 hover:text-teal-600 hover:bg-teal-50"
                  >
                    Login
                  </Button>
                </Link>
                <Link href="/sign-up">
                  <Button className="bg-teal-600 hover:bg-teal-700 text-white rounded-lg px-6">
                    Get Started
                  </Button>
                </Link>
              </>
            ) : (
              <div className="flex items-center gap-3">
                <Button
                  onClick={() => router.push("/dashboard")}
                  variant="outline"
                  className="border-teal-600 text-teal-600 hover:bg-teal-50"
                >
                  Dashboard
                </Button>
                <UserButton />
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

const HeroSection = ({ router }: { router: any }) => {
  return (
    <div className="container mx-auto px-4 py-12 md:py-20">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center max-w-7xl mx-auto">
        {/* Left Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="space-y-6"
        >
          <div className="inline-block">
            <span className="bg-teal-50 text-teal-700 px-4 py-2 rounded-full text-sm font-medium border border-teal-200">
              ✨ AI-POWERED HEALTHCARE
            </span>
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
            Your AI Doctor.
            <br />
            <span className="text-teal-600">24/7 Care.</span>
            <br />
            Instant Answers.
          </h1>

          <p className="text-base md:text-lg text-gray-600 leading-relaxed">
            Transform patient care with intelligent voice technology that handles appointments,
            answers medical questions, and provides 24/7 support. Reduce administrative burden
            while enhancing patient satisfaction.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <Button
              onClick={() => router.push("/dashboard")}
              className="bg-teal-600 hover:bg-teal-700 text-white px-8 py-6 text-lg rounded-xl"
            >
              Start Diagnosis →
            </Button>

            <Button
              variant="outline"
              className="border-2 border-gray-300 text-gray-700 hover:bg-gray-50 px-8 py-6 text-lg rounded-xl"
            >
              Learn More
            </Button>
          </div>
        </motion.div>

        {/* Right Content */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="relative"
        >
          <div className="relative rounded-3xl overflow-hidden shadow-2xl">
            <Image
              src="/landingpageherosection.png"
              alt="AI Healthcare Dashboard"
              width={600}
              height={500}
              className="rounded-2xl w-full h-auto"
              priority
            />
          </div>
        </motion.div>
      </div>
    </div>
  );
};

const HowItWorksSection = () => {
  const steps = [
    {
      icon: "💬",
      title: "Describe Symptoms",
      description: "Tell our AI about your symptoms through voice or text for instant analysis."
    },
    {
      icon: "🔍",
      title: "Instant Analysis",
      description: "Get AI-powered health insights and preliminary diagnosis in seconds."
    },
    {
      icon: "🕐",
      title: "24/7 Availability",
      description: "Access healthcare guidance anytime, anywhere with our AI assistant."
    }
  ];

  return (
    <div className="bg-gray-50 py-16 md:py-20">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            How It Works
          </h2>
          <p className="text-base md:text-lg text-gray-600 max-w-2xl mx-auto">
            Get started with AI-powered healthcare in three simple steps
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="text-5xl mb-4">{step.icon}</div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">{step.title}</h3>
              <p className="text-gray-600">{step.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

const ComprehensiveCareSection = () => {
  const features = [
    {
      icon: "🩺",
      title: "Comprehensive Care",
      description: "Complete health monitoring and personalized care plans tailored to your needs."
    },
    {
      icon: "🎤",
      title: "Voice Connection",
      description: "Natural voice interactions for seamless communication with your AI doctor."
    },
    {
      icon: "🛡️",
      title: "Transparency & Support",
      description: "Clear explanations and continuous support throughout your healthcare journey."
    },
    {
      icon: "📋",
      title: "Symptom Checker",
      description: "Advanced AI-powered symptom analysis for accurate preliminary diagnosis."
    },
    {
      icon: "📄",
      title: "Medical Reports",
      description: "Generate comprehensive health reports and track your medical history easily."
    },
    {
      icon: "👨‍⚕️",
      title: "Doctor Recommendations",
      description: "Get matched with the right specialists based on your symptoms and needs."
    }
  ];

  return (
    <div className="py-16 md:py-20">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Comprehensive Healthcare Solutions
          </h2>
          <p className="text-base md:text-lg text-gray-600 max-w-2xl mx-auto">
            Everything you need for modern healthcare in one platform
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="bg-gradient-to-br from-teal-50 to-white rounded-2xl p-6 border border-teal-100 hover:border-teal-300 transition-all hover:shadow-lg"
            >
              <div className="text-4xl mb-4">{feature.icon}</div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">{feature.title}</h3>
              <p className="text-sm text-gray-600">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

const AISpecialistsSection = () => {
  return (
    <div className="bg-gradient-to-br from-teal-600 to-teal-700 py-16 md:py-20">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="text-white"
          >
            <div className="inline-block bg-white/20 px-4 py-2 rounded-full text-sm font-medium mb-6">
              AI SPECIALISTS
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Get Expert Care from AI Specialists
            </h2>
            <p className="text-base md:text-lg text-teal-50 mb-8">
              Our AI is trained on millions of medical cases and continuously learns to provide
              you with the most accurate diagnosis and treatment recommendations.
            </p>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-white">✓</span>
                </div>
                <p className="text-teal-50">Trained on 10M+ medical cases</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-white">✓</span>
                </div>
                <p className="text-teal-50">95% accuracy in preliminary diagnosis</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-white">✓</span>
                </div>
                <p className="text-teal-50">Available 24/7 in multiple languages</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="bg-white rounded-3xl p-6 shadow-2xl">
              <div className="grid grid-cols-2 gap-4">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="relative">
                    <Image
                      src={`/doctor${i}.png`}
                      alt={`Doctor ${i}`}
                      width={200}
                      height={200}
                      className="rounded-xl w-full h-auto"
                    />
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

const CTASection = ({ router }: { router: any }) => {
  return (
    <div className="bg-gradient-to-br from-teal-50 to-white py-16 md:py-20">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-gradient-to-br from-teal-600 to-teal-700 rounded-3xl p-8 md:p-12 text-center text-white max-w-4xl mx-auto"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to feel better?
          </h2>
          <p className="text-lg md:text-xl text-teal-50 mb-8 max-w-2xl mx-auto">
            Join thousands of patients who trust VitalCare AI for their healthcare needs
          </p>
          <Button
            onClick={() => router.push("/dashboard")}
            className="bg-white text-teal-600 hover:bg-gray-100 px-10 py-6 text-lg rounded-xl font-semibold"
          >
            Start Free Diagnosis
          </Button>
        </motion.div>
      </div>
    </div>
  );
};

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300 py-8">
      <div className="container mx-auto px-4">
        <div className="text-center">
          <div className="flex items-center gap-2 mb-3 justify-center">
            <div className="w-8 h-8 bg-gradient-to-br from-teal-500 to-teal-600 rounded-lg flex items-center justify-center">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <rect x="7" y="4" width="2" height="12" rx="1" fill="white" />
                <rect x="4" y="7" width="12" height="2" rx="1" fill="white" />
              </svg>
            </div>
            <span className="text-lg font-bold text-white">VitalCare<span className="text-teal-500">AI</span></span>
          </div>
          <p className="text-sm text-gray-400 mb-4">Your 24/7 AI Health Assistant</p>
          <p className="text-sm text-gray-500">&copy; 2026 VitalCare AI. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

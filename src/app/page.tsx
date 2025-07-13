"use client"
import Link from "next/link"
import { Shield, Lock, FileText, Stethoscope, Database, Eye, Clock, ArrowRight, Globe, Zap } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export default function HomePage() {
  const features = [
    {
      icon: <Shield className="h-8 w-8 text-blue-400" />,
      title: "Immutable Security",
      description:
        "Blockchain technology ensures your medical records cannot be altered or tampered with, providing unprecedented data integrity.",
    },
    {
      icon: <Lock className="h-8 w-8 text-blue-400" />,
      title: "Advanced Encryption",
      description:
        "All patient data is encrypted using cryptographic methods with role-based access control for maximum privacy protection.",
    },
    {
      icon: <Eye className="h-8 w-8 text-blue-400" />,
      title: "Complete Audit Trail",
      description:
        "Every access and modification is permanently recorded, creating a transparent and verifiable history of all medical data.",
    },
    {
      icon: <Clock className="h-8 w-8 text-blue-400" />,
      title: "99.5% Uptime",
      description:
        "Built on Internet Computer Protocol (ICP) and Hedera blockchain for maximum reliability and availability.",
    },
  ]

  const stats = [
    { value: "<0.1", label: "Tampered Records per 1,000", unit: "entries" },
    { value: "99.5%", label: "System Uptime", unit: "guaranteed" },
    { value: "99.9%", label: "Access Control Accuracy", unit: "precision" },
    { value: "256-bit", label: "Encryption Standard", unit: "security" },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 overflow-hidden relative">
      {/* Background Effects */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.1)_1px,transparent_1px)] bg-[size:60px_60px] animate-[pulse_4s_ease-in-out_infinite]" />
      </div>

      {/* Floating Medical Icons */}
      <div className="absolute inset-0">
        {[...Array(25)].map((_, i) => (
          <div
            key={i}
            className="absolute text-blue-400 opacity-20 animate-[float_linear_infinite]"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 20}s`,
              animationDuration: `${25 + Math.random() * 30}s`,
            }}
          >
            {i % 4 === 0 ? (
              <Stethoscope className="h-4 w-4" />
            ) : i % 4 === 1 ? (
              <Shield className="h-4 w-4" />
            ) : i % 4 === 2 ? (
              <FileText className="h-4 w-4" />
            ) : (
              <Database className="h-4 w-4" />
            )}
          </div>
        ))}
      </div>

      {/* Gradient Orbs */}
      <div className="absolute top-20 left-20 w-96 h-96 bg-gradient-to-br from-blue-500 to-transparent rounded-full opacity-20 blur-3xl animate-pulse" />
      <div className="absolute bottom-10 right-10 w-80 h-80 bg-gradient-to-tr from-indigo-400 to-transparent rounded-full opacity-15 blur-2xl animate-pulse" />

      {/* Navigation */}
      <nav className="relative z-10 flex items-center justify-between p-6 lg:px-8">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
            <Shield className="h-6 w-6 text-white" />
          </div>
          <span className="text-xl font-bold text-white">BlockchainEMR</span>
        </div>
        <div className="flex items-center space-x-4">
          <Link href="/login">
            <Button variant="ghost" className="text-white hover:bg-white/10">
              Sign In
            </Button>
          </Link>
          <Link href="/register">
            <Button className="bg-blue-600 hover:bg-blue-700 text-white">Get Started</Button>
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 pt-20 pb-32">
        <div className="text-center">
          <Badge className="mb-6 bg-blue-600/20 text-blue-300 border-blue-400/30">
            <Zap className="h-4 w-4 mr-2" />
            Powered by ICP & Hedera Blockchain
          </Badge>
          <h1 className="text-5xl lg:text-7xl font-bold text-white mb-8 leading-tight">
            Secure Medical Records
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-300">
              Built on Blockchain
            </span>
          </h1>
          <p className="text-xl text-blue-100 mb-12 max-w-3xl mx-auto leading-relaxed">
            Revolutionary EMR system leveraging blockchain technology to ensure immutable, secure, and transparent
            medical record management for outpatient clinics.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/register">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 text-lg">
                Start Free Trial
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/demo">
              <Button
                size="lg"
                variant="outline"
                className="border-blue-400 text-blue-300 hover:bg-blue-600/10 px-8 py-4 text-lg bg-transparent"
              >
                View Demo
              </Button>
            </Link>
          </div>
        </div>

        {/* Stats Section */}
        <div className="mt-24 grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-3xl lg:text-4xl font-bold text-white mb-2">{stat.value}</div>
              <div className="text-blue-200 text-sm lg:text-base">{stat.label}</div>
              <div className="text-blue-400 text-xs uppercase tracking-wide mt-1">{stat.unit}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Features Section */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 pb-32">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-white mb-6">Why Choose Blockchain EMR?</h2>
          <p className="text-xl text-blue-200 max-w-2xl mx-auto">
            Experience the future of medical record management with cutting-edge blockchain technology
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <Card
              key={index}
              className="bg-white/10 backdrop-blur-sm border-blue-400/20 hover:bg-white/15 transition-all duration-300"
            >
              <CardHeader className="text-center pb-4">
                <div className="mx-auto w-16 h-16 bg-blue-600/20 rounded-full flex items-center justify-center mb-4">
                  {feature.icon}
                </div>
                <CardTitle className="text-white text-xl">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-blue-200 text-center leading-relaxed">
                  {feature.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Architecture Section */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 pb-32">
        <Card className="bg-white/10 backdrop-blur-sm border-blue-400/20">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-bold text-white mb-4">Hybrid Blockchain Architecture</CardTitle>
            <CardDescription className="text-blue-200 text-lg">
              Built on Internet Computer Protocol (ICP) with Hedera verification layer
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-8">
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Database className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">ICP Blockchain</h3>
                <p className="text-blue-200">Primary EMR system hosting with smart contract canisters</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shield className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">Hedera Network</h3>
                <p className="text-blue-200">Immutable hash fingerprints for tamper detection</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Globe className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">IPFS Storage</h3>
                <p className="text-blue-200">Secure off-chain storage for large medical files</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* CTA Section */}
      <div className="relative z-10 max-w-4xl mx-auto px-6 lg:px-8 pb-32 text-center">
        <Card className="bg-gradient-to-r from-blue-600/20 to-indigo-600/20 backdrop-blur-sm border-blue-400/30">
          <CardContent className="p-12">
            <h2 className="text-4xl font-bold text-white mb-6">Ready to Secure Your Medical Records?</h2>
            <p className="text-xl text-blue-200 mb-8">
              Join healthcare providers who trust blockchain technology for their EMR needs
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/register">
                <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4">
                  Create Account
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/terms-and-conditions">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-blue-400 text-blue-300 hover:bg-blue-600/10 px-8 py-4 bg-transparent"
                >
                  View Terms
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>

      <style jsx>{`
        @keyframes float {
          0% {
            transform: translateY(100vh) rotate(0deg);
            opacity: 0;
          }
          10% {
            opacity: 1;
          }
          90% {
            opacity: 1;
          }
          100% {
            transform: translateY(-100vh) rotate(360deg);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  )
}

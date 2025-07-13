"use client"
import Link from "next/link"
import { Shield, ArrowLeft, FileText, Lock, Database, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

export default function TermsConditionsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 overflow-hidden relative">
      {/* Background Effects */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.1)_1px,transparent_1px)] bg-[size:60px_60px]" />
      </div>

      {/* Navigation */}
      <nav className="relative z-10 flex items-center justify-between p-6 lg:px-8 border-b border-blue-400/20">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
            <Shield className="h-6 w-6 text-white" />
          </div>
          <span className="text-xl font-bold text-white">BlockchainEMR</span>
        </div>
        <Link href="/">
          <Button variant="ghost" className="text-white hover:bg-white/10">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Button>
        </Link>
      </nav>

      {/* Main Content */}
      <div className="relative z-10 max-w-4xl mx-auto px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <FileText className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-white mb-4">Terms and Conditions</h1>
          <p className="text-blue-200 text-lg">Last updated: {new Date().toLocaleDateString()}</p>
        </div>

        <Card className="bg-white/10 backdrop-blur-sm border-blue-400/20 mb-8">
          <CardContent className="p-8">
            <div className="prose prose-invert max-w-none">
              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-white mb-4 flex items-center">
                  <Users className="h-6 w-6 mr-3 text-blue-400" />
                  1. Acceptance of Terms
                </h2>
                <p className="text-blue-100 leading-relaxed mb-4">
                  By accessing and using the BlockchainEMR system, you acknowledge that you have read, understood, and
                  agree to be bound by these Terms and Conditions. This agreement is effective immediately upon your
                  first use of the system.
                </p>
                <p className="text-blue-100 leading-relaxed">
                  These terms apply to all users including healthcare providers, medical staff, administrators, and
                  patients who access the system.
                </p>
              </section>

              <Separator className="bg-blue-400/20 my-8" />

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-white mb-4 flex items-center">
                  <Shield className="h-6 w-6 mr-3 text-blue-400" />
                  2. HIPAA Compliance and Privacy
                </h2>
                <p className="text-blue-100 leading-relaxed mb-4">
                  BlockchainEMR is designed to comply with the Health Insurance Portability and Accountability Act
                  (HIPAA) and other applicable healthcare privacy regulations. All Protected Health Information (PHI) is
                  encrypted and stored securely.
                </p>
                <ul className="list-disc list-inside text-blue-100 space-y-2 mb-4">
                  <li>All medical data is encrypted using 256-bit AES encryption</li>
                  <li>Access is controlled through role-based permissions</li>
                  <li>All system access and data modifications are logged</li>
                  <li>Data is stored on secure blockchain infrastructure</li>
                </ul>
                <p className="text-blue-100 leading-relaxed">
                  Users must not share login credentials or access PHI beyond their authorized scope.
                </p>
              </section>

              <Separator className="bg-blue-400/20 my-8" />

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-white mb-4 flex items-center">
                  <Database className="h-6 w-6 mr-3 text-blue-400" />
                  3. Blockchain Technology Usage
                </h2>
                <p className="text-blue-100 leading-relaxed mb-4">
                  Our system utilizes hybrid blockchain architecture combining Internet Computer Protocol (ICP) and
                  Hedera networks to ensure data integrity and immutability.
                </p>
                <div className="bg-blue-900/30 p-4 rounded-lg mb-4">
                  <h3 className="text-lg font-semibold text-white mb-2">Key Technical Features:</h3>
                  <ul className="list-disc list-inside text-blue-100 space-y-1">
                    <li>Immutable record storage preventing unauthorized alterations</li>
                    <li>Cryptographic hash verification through Hedera network</li>
                    <li>Decentralized architecture for enhanced security</li>
                    <li>Smart contract-based access control</li>
                  </ul>
                </div>
                <p className="text-blue-100 leading-relaxed">
                  Users acknowledge that blockchain transactions are irreversible and permanent.
                </p>
              </section>

              <Separator className="bg-blue-400/20 my-8" />

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-white mb-4 flex items-center">
                  <Lock className="h-6 w-6 mr-3 text-blue-400" />
                  4. User Responsibilities
                </h2>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-2">Healthcare Providers:</h3>
                    <ul className="list-disc list-inside text-blue-100 space-y-1">
                      <li>Maintain accurate and complete patient records</li>
                      <li>Ensure proper authorization before accessing patient data</li>
                      <li>Report any suspected security breaches immediately</li>
                      <li>Keep login credentials secure and confidential</li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-2">Patients:</h3>
                    <ul className="list-disc list-inside text-blue-100 space-y-1">
                      <li>Provide accurate personal and medical information</li>
                      <li>Notify providers of any changes to contact information</li>
                      <li>Understand that blockchain records are permanent</li>
                      <li>Report unauthorized access to your records</li>
                    </ul>
                  </div>
                </div>
              </section>

              <Separator className="bg-blue-400/20 my-8" />

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-white mb-4">5. System Availability and Performance</h2>
                <p className="text-blue-100 leading-relaxed mb-4">
                  We strive to maintain system availability of 99.5% uptime. However, the system may be temporarily
                  unavailable due to:
                </p>
                <ul className="list-disc list-inside text-blue-100 space-y-2 mb-4">
                  <li>Scheduled maintenance and updates</li>
                  <li>Blockchain network congestion</li>
                  <li>Emergency security measures</li>
                  <li>Force majeure events</li>
                </ul>
                <p className="text-blue-100 leading-relaxed">
                  Users should maintain backup procedures for critical operations.
                </p>
              </section>

              <Separator className="bg-blue-400/20 my-8" />

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-white mb-4">6. Data Integrity and Audit Trail</h2>
                <p className="text-blue-100 leading-relaxed mb-4">Our blockchain architecture ensures:</p>
                <div className="grid md:grid-cols-2 gap-4 mb-4">
                  <div className="bg-blue-900/30 p-4 rounded-lg">
                    <h3 className="font-semibold text-white mb-2">Data Integrity</h3>
                    <p className="text-blue-100 text-sm">Target: {"<"}0.1 tampered records per 1,000 entries</p>
                  </div>
                  <div className="bg-blue-900/30 p-4 rounded-lg">
                    <h3 className="font-semibold text-white mb-2">Access Control</h3>
                    <p className="text-blue-100 text-sm">Target: {">"}99.9% accuracy in authorization</p>
                  </div>
                </div>
                <p className="text-blue-100 leading-relaxed">
                  All system interactions are permanently recorded and cannot be deleted or modified.
                </p>
              </section>

              <Separator className="bg-blue-400/20 my-8" />

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-white mb-4">7. Limitation of Liability</h2>
                <p className="text-blue-100 leading-relaxed mb-4">
                  While we implement industry-leading security measures, users acknowledge that:
                </p>
                <ul className="list-disc list-inside text-blue-100 space-y-2 mb-4">
                  <li>No system is 100% secure from all threats</li>
                  <li>Blockchain technology is still evolving</li>
                  <li>Users are responsible for their own access credentials</li>
                  <li>Clinical decisions remain the responsibility of healthcare providers</li>
                </ul>
                <p className="text-blue-100 leading-relaxed">
                  Our liability is limited to the extent permitted by applicable law.
                </p>
              </section>

              <Separator className="bg-blue-400/20 my-8" />

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-white mb-4">8. Termination</h2>
                <p className="text-blue-100 leading-relaxed mb-4">
                  Either party may terminate access to the system with appropriate notice. Upon termination:
                </p>
                <ul className="list-disc list-inside text-blue-100 space-y-2">
                  <li>User access will be immediately revoked</li>
                  <li>Existing blockchain records remain immutable</li>
                  <li>Data export may be provided per applicable regulations</li>
                  <li>Confidentiality obligations continue indefinitely</li>
                </ul>
              </section>

              <Separator className="bg-blue-400/20 my-8" />

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-white mb-4">9. Updates to Terms</h2>
                <p className="text-blue-100 leading-relaxed mb-4">
                  These terms may be updated to reflect changes in technology, regulations, or business practices. Users
                  will be notified of material changes through:
                </p>
                <ul className="list-disc list-inside text-blue-100 space-y-2">
                  <li>Email notifications to registered users</li>
                  <li>System notifications upon login</li>
                  <li>Updates posted on our website</li>
                </ul>
              </section>

              <Separator className="bg-blue-400/20 my-8" />

              {/* <section>
                <h2 className="text-2xl font-semibold text-white mb-4">10. Contact Information</h2>
                <p className="text-blue-100 leading-relaxed mb-4">
                  For questions about these terms or the BlockchainEMR system, contact:
                </p>
                <div className="bg-blue-900/30 p-4 rounded-lg">
                  <p className="text-blue-100">
                    <strong>BlockchainEMR Support</strong>
                    <br />
                    Email: legal@blockchainemr.com
                    <br />
                    Phone: 1-800-EMR-HELP
                    <br />
                    Address: [Your Business Address]
                  </p>
                </div>
              </section> */}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default function LegalPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12 space-y-10 bg-gray-900 min-h-screen text-gray-200">
      <h1 className="text-4xl font-bold text-center text-white mb-8">
        Legal & Policies
      </h1>

      {/* Terms & Conditions */}
      <section className="bg-gray-800 p-6 rounded-2xl shadow-md">
        <h2 className="text-2xl font-semibold text-white mb-3">Terms & Conditions</h2>
        <p className="text-gray-300 mb-4">
          By accessing and using <span className="font-semibold text-white">Skill Nest</span>, you agree to comply with our terms of service. All course content is for personal learning only and may not be redistributed without permission.
        </p>
        <p className="text-gray-300">
          We reserve the right to modify these terms at any time. Continued use of the site means you accept any changes.
        </p>
      </section>

      {/* Privacy Policy */}
      <section className="bg-gray-800 p-6 rounded-2xl shadow-md">
        <h2 className="text-2xl font-semibold text-white mb-3">Privacy Policy</h2>
        <p className="text-gray-300 mb-4">
          <span className="font-semibold text-white">Skill Nest</span> values your privacy. We collect your name, email, and course activity to provide better service. We never sell your data to third parties.
        </p>
        <p className="text-gray-300">
          You can request to view or delete your data by contacting us at{" "}
          <a href="mailto:support@skillnest.com" className="text-blue-400 hover:underline">
            support@skillnest.com
          </a>.
        </p>
      </section>

      {/* Refund Policy */}
      <section className="bg-gray-800 p-6 rounded-2xl shadow-md">
        <h2 className="text-2xl font-semibold text-white mb-3">Refund Policy</h2>
        <p className="text-gray-300 mb-4">
          For paid courses, we offer refunds within 7 days of purchase if you haven’t completed more than 20% of the course.
        </p>
        <p className="text-gray-300">
          To request a refund, please contact us at{" "}
          <a href="mailto:refunds@skillnest.com" className="text-blue-400 hover:underline">
            refunds@skillnest.com
          </a>{" "}
          with your order details.
        </p>
      </section>

      {/* Contact */}
      <section className="bg-gray-800 p-6 rounded-2xl shadow-md">
        <h2 className="text-2xl font-semibold text-white mb-3">Contact Us</h2>
        <p className="text-gray-300">
          For any legal questions, email us at{" "}
          <a href="mailto:legal@skillnest.com" className="text-blue-400 hover:underline">
            legal@skillnest.com
          </a>.
        </p>
      </section>
    </div>
  );
}

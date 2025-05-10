import mainLogo from "../assets/mainLogo.png";
import Image from "next/image";

export default function TermsPage() {
  return (
    <div className="max-w-3xl mx-auto py-10 px-4">
      {/* Logo */}
      <div className="flex justify-center mb-6">
        <Image src={mainLogo} alt="Finance Fusion Logo" width={200} height={90} />
      </div>

      {/* Heading */}
      <h1 className="text-3xl font-bold  mb-6">Terms and Policies</h1>

      <p className="mb-4">
        Welcome to <strong>Finance Fusion</strong>. By using our expense tracking application, you agree to the following terms and policies. Please read them carefully.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">1. General Overview</h2>
      <p className="mb-4">
        Finance Fusion is a personal finance tool that helps users track their income and expenses manually. We do not integrate with or connect to any real banks or financial institutions. All data entered into the platform is user-controlled and stored for tracking and visualization purposes only.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">2. User Responsibilities</h2>
      <ul className="list-disc pl-5 mb-4">
        <li>Users are responsible for maintaining the accuracy of the data they input.</li>
        <li>Users must not upload or input sensitive information such as credit card numbers, bank account details, or passwords.</li>
        <li>Users are prohibited from using the platform for illegal, unauthorized, or abusive activities.</li>
      </ul>

      <h2 className="text-xl font-semibold mt-6 mb-2">3. Data and Privacy</h2>
      <ul className="list-disc pl-5 mb-4">
        <li>We store only the data you provide (e.g., expenses, income, savings goals).</li>
        <li>We do not share your data with third parties unless required by law.</li>
        <li>We implement standard security measures to protect your data, but cannot guarantee absolute security.</li>
        <li>By using the app, you consent to the collection and use of your data for functionality and performance improvement purposes.</li>
      </ul>

      <h2 className="text-xl font-semibold mt-6 mb-2">4. No Financial Advice</h2>
      <p className="mb-4">
        Finance Fusion is intended solely as a tool to help users manage and visualize their finances. It does not provide financial, investment, legal, or tax advice. Any decisions made based on the information presented in the app are the sole responsibility of the user.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">5. Service Limitations</h2>
      <ul className="list-disc pl-5 mb-4">
        <li>We reserve the right to modify or discontinue the app (temporarily or permanently) without notice.</li>
        <li>We are not responsible for any loss or damage resulting from such modifications, downtimes, or data inaccuracies.</li>
      </ul>

      <h2 className="text-xl font-semibold mt-6 mb-2">6. Changes to Terms</h2>
      <p className="mb-4">
        We may update these terms from time to time. Continued use of the app after changes are posted means you accept the updated terms. It is your responsibility to review them periodically.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">7. Contact Us</h2>
      <p className="mb-4">
        If you have questions, feedback, or concerns regarding these terms or the app, please contact our support team at{" "}
        <a href="mailto:support@financefusion.com" className="text-blue-600 underline">
          support@financefusion.com
        </a>.
      </p>

      <p className="mt-8 text-sm text-gray-500">Last updated: May 10, 2025</p>
    </div>
  );
}

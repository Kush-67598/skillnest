import AuthForm from "@/Components/AuthForm";

export default function LoginPage() {
  return (
    <main className="flex items-center justify-center min-h-screen p-4">
      <div className="bg-white rounded-2xl shadow-md p-8 w-full max-w-md">
        <h1 className="text-2xl font-semibold mb-6 text-center">Login</h1>
        <AuthForm type="login" />
      </div>
    </main>
  );
}

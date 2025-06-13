import AuthLayout from "@/components/AuthLayout";

export default function Login() {
  return (
    <AuthLayout>
      <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-gray-100">
        Login
      </h2>
      <form className="space-y-4">
        <input
          type="email"
          placeholder="Email"
          className="w-full px-4 py-2 border rounded dark:bg-gray-700 dark:text-white"
        />
        <button className="w-full py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
          Login
        </button>
      </form>
    </AuthLayout>
  );
}

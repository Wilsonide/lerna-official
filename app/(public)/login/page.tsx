"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../context/authcontext";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const { refresh } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      if (response.ok) {
        await refresh();
        router.push("/");
        return;
      }

      const data = await response.json();
      setError(data?.error || "Invalid credentials");
    } catch {
      setError("Network error. Try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
      <form
        onSubmit={submit}
        className="w-full max-w-md bg-white p-8 rounded-3xl shadow-lg"
      >
        <h1 className="text-3xl font-bold">Login</h1>

        {error && (
          <p className="mt-4 text-sm text-red-600 bg-red-50 p-3 rounded-xl">
            {error}
          </p>
        )}

        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          className="w-full border p-4 mt-6 rounded-xl"
        />

        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          className="w-full border p-4 mt-4 rounded-xl"
        />

        <button
          disabled={loading}
          className="w-full mt-6 bg-brand-blue text-white py-4 rounded-xl disabled:opacity-60"
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        <p className="text-center text-sm text-gray-600 mt-6">
          Don’t have an account?{" "}
          <Link href="/register" className="text-brand-blue font-semibold">
            Register
          </Link>
        </p>
      </form>
    </main>
  );
}

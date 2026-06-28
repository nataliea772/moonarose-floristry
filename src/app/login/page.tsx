"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { setAdminAuthCookie } from "@/lib/adminAuthCookie";
import { BRAND_NAME } from "@/lib/brand";

const inputClassName =
  "w-full rounded-2xl border border-[#ecd1c8] bg-white px-4 py-3 text-[#3b2521] outline-none transition focus:border-[#c99393] focus:ring-2 focus:ring-[#fceeea]";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    setError("");

    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (signInError) {
      setError("פרטי ההתחברות אינם נכונים");
      setIsLoading(false);
      return;
    }

    setAdminAuthCookie();
    router.replace("/admin");
  };

  return (
    <main
      className="flex min-h-screen items-center justify-center bg-[#fff8f5] px-4 py-10 text-[#2f1f1b]"
      dir="rtl"
    >
      <div className="category-card w-full max-w-md">
        <div className="mb-8 text-center">
          <p className="mb-3 text-sm tracking-[0.35em] text-[#b47b7b]">
            ADMIN LOGIN
          </p>
          <h1 className="mb-3 font-serif text-4xl font-light italic tracking-[0.08em] text-[#9f5f5f] sm:text-5xl">
            {BRAND_NAME}
          </h1>
          <p className="text-base text-[#755d56] sm:text-lg">
            כניסה למערכת הניהול
          </p>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <label className="block">
            <span className="mb-2 block text-sm font-semibold text-[#5a3731]">
              אימייל
            </span>
            <input
              type="email"
              required
              autoComplete="email"
              className={inputClassName}
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />
          </label>

          <label className="block">
            <span className="mb-2 block text-sm font-semibold text-[#5a3731]">
              סיסמה
            </span>
            <input
              type="password"
              required
              autoComplete="current-password"
              className={inputClassName}
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />
          </label>

          {error && (
            <p className="text-sm font-semibold text-[#8b3a3a]">{error}</p>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="order-btn disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isLoading ? "מתחברת..." : "כניסה"}
          </button>
        </form>

        <div className="mt-6 text-center">
          <Link href="/" className="contact-btn inline-flex">
            חזרה לאתר
          </Link>
        </div>
      </div>
    </main>
  );
}

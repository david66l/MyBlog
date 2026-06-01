"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { login, setToken } from "@/lib/api";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("admin@louis.dev");
  const [password, setPassword] = useState("admin123");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    setLoading(true);
    setError("");
    try {
      const { token } = await login(email, password);
      setToken(token);
      router.push("/articles");
    } catch {
      setError("登录失败，请检查邮箱和密码。");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="shell">
      <p style={{ letterSpacing: "0.25em", textTransform: "uppercase", color: "rgba(255,255,255,0.4)" }}>
        // admin
      </p>
      <h1 style={{ fontSize: "1.5rem", marginTop: "0.75rem" }}>Louis.dev CMS</h1>
      <form className="card" style={{ marginTop: "2rem", maxWidth: 420 }} onSubmit={onSubmit}>
        <div className="field">
          <label htmlFor="email">email</label>
          <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
        <div className="field">
          <label htmlFor="password">password</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        {error && <p className="error">{error}</p>}
        <button className="btn btn-primary" type="submit" disabled={loading}>
          {loading ? "signing in..." : "sign_in_"}
        </button>
      </form>
    </main>
  );
}

import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent } from "react";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Staff Login | Tokyo Academy ERP" },
      {
        name: "description",
        content:
          "Tokyo Academy staff login for the student management dashboard — manage students and website inquiries.",
      },
      { property: "og:title", content: "Staff Login | Tokyo Academy ERP" },
      {
        property: "og:description",
        content: "Sign in to manage Tokyo Academy students and inquiries.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [busy, setBusy] = useState(false);
  const [note, setNote] = useState<{ text: string; error?: boolean } | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) navigate({ to: "/admin" });
    });
  }, [navigate]);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const email = String(data.get("email") ?? "");
    const password = String(data.get("password") ?? "");
    setBusy(true);
    setNote(null);

    if (mode === "signup") {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: { emailRedirectTo: `${window.location.origin}/admin` },
      });
      setBusy(false);
      if (error) return setNote({ text: error.message, error: true });
      setNote({ text: "Account তৈরি হয়েছে। এখন sign in করুন।" });
      setMode("signin");
      return;
    }

    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setBusy(false);
    if (error) return setNote({ text: error.message, error: true });
    navigate({ to: "/admin" });
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-muted px-4 py-16">
      <div className="w-full max-w-sm rounded-2xl bg-background p-8 shadow-xl">
        <h1 className="text-2xl font-bold text-foreground">Tokyo Academy ERP</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {mode === "signin" ? "Staff sign in" : "Create staff account"}
        </p>

        <form className="mt-6 space-y-3" onSubmit={onSubmit}>
          <input
            required
            name="email"
            type="email"
            placeholder="Email"
            className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground"
          />
          <input
            required
            name="password"
            type="password"
            minLength={6}
            placeholder="Password"
            className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground"
          />
          <button
            type="submit"
            disabled={busy}
            className="w-full rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground disabled:opacity-60"
          >
            {busy ? "অপেক্ষা করুন..." : mode === "signin" ? "Sign In" : "Sign Up"}
          </button>
        </form>

        {note && (
          <p className={`mt-3 text-sm ${note.error ? "text-destructive" : "text-foreground"}`}>
            {note.text}
          </p>
        )}

        <button
          onClick={() => {
            setMode(mode === "signin" ? "signup" : "signin");
            setNote(null);
          }}
          className="mt-4 text-sm text-muted-foreground underline"
        >
          {mode === "signin" ? "নতুন staff account তৈরি করুন" : "আগের account দিয়ে sign in করুন"}
        </button>
      </div>
    </main>
  );
}

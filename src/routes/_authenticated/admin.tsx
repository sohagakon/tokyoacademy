import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState, type FormEvent } from "react";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/_authenticated/admin")({
  head: () => ({
    meta: [
      { title: "Student Management | Tokyo Academy ERP" },
      {
        name: "description",
        content:
          "Manage Tokyo Academy students, application status and website inquiries in one dashboard.",
      },
      { property: "og:title", content: "Student Management | Tokyo Academy ERP" },
      {
        property: "og:description",
        content: "Internal dashboard for students and inquiries.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: AdminPage,
});

const STATUSES = ["inquiry", "applied", "enrolled", "visa", "departed"] as const;
const LEVELS = ["N5", "N4", "N3", "N2", "N1", "Beginner"];

type Student = {
  id: string;
  full_name: string;
  phone: string;
  email: string | null;
  course: string | null;
  status: string;
  japanese_level: string | null;
  notes: string | null;
  enrolled_at: string | null;
  created_at: string;
};

const input =
  "w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground";

function AdminPage() {
  const navigate = useNavigate();
  const qc = useQueryClient();
  const [tab, setTab] = useState<"students" | "inquiries">("students");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [editing, setEditing] = useState<Student | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const students = useQuery({
    queryKey: ["students"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("students")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data as Student[];
    },
  });

  const inquiries = useQuery({
    queryKey: ["inquiries"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("inquiries")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const rows = (students.data ?? []).filter((s) => {
    const q = search.trim().toLowerCase();
    const hit =
      !q ||
      s.full_name.toLowerCase().includes(q) ||
      s.phone.includes(q) ||
      (s.email ?? "").toLowerCase().includes(q);
    return hit && (!statusFilter || s.status === statusFilter);
  });

  const counts = STATUSES.map((st) => ({
    st,
    n: (students.data ?? []).filter((s) => s.status === st).length,
  }));

  async function saveStudent(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    const f = new FormData(e.currentTarget);
    const payload = {
      full_name: String(f.get("full_name") ?? ""),
      phone: String(f.get("phone") ?? ""),
      email: String(f.get("email") ?? "") || null,
      course: String(f.get("course") ?? "") || null,
      status: String(f.get("status") ?? "inquiry"),
      japanese_level: String(f.get("japanese_level") ?? "") || null,
      notes: String(f.get("notes") ?? "") || null,
      enrolled_at: String(f.get("enrolled_at") ?? "") || null,
    };
    const res = editing
      ? await supabase.from("students").update(payload).eq("id", editing.id)
      : await supabase.from("students").insert(payload);
    if (res.error) return setError(res.error.message);
    setShowForm(false);
    setEditing(null);
    qc.invalidateQueries({ queryKey: ["students"] });
  }

  async function removeStudent(id: string) {
    if (!confirm("এই student delete করবেন?")) return;
    const { error } = await supabase.from("students").delete().eq("id", id);
    if (error) return setError(error.message);
    qc.invalidateQueries({ queryKey: ["students"] });
  }

  async function convertInquiry(i: {
    name: string;
    phone: string;
    email: string | null;
    course: string | null;
    message: string | null;
  }) {
    const { error } = await supabase.from("students").insert({
      full_name: i.name,
      phone: i.phone,
      email: i.email,
      course: i.course,
      notes: i.message,
      status: "inquiry",
    });
    if (error) return setError(error.message);
    qc.invalidateQueries({ queryKey: ["students"] });
    setTab("students");
  }

  async function signOut() {
    await supabase.auth.signOut();
    qc.clear();
    navigate({ to: "/auth" });
  }

  return (
    <main className="min-h-screen bg-muted">
      <header className="border-b border-border bg-background">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
          <div>
            <h1 className="text-lg font-bold text-foreground">Tokyo Academy ERP</h1>
            <p className="text-xs text-muted-foreground">Student Management</p>
          </div>
          <div className="flex gap-2">
            <a
              href="/"
              className="rounded-lg border border-input px-3 py-2 text-sm text-foreground"
            >
              Website
            </a>
            <button
              onClick={signOut}
              className="rounded-lg bg-primary px-3 py-2 text-sm font-medium text-primary-foreground"
            >
              Sign out
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-4 py-6">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
          {counts.map((c) => (
            <div key={c.st} className="rounded-xl bg-background p-4 shadow-sm">
              <div className="text-2xl font-bold text-foreground">{c.n}</div>
              <div className="text-xs uppercase text-muted-foreground">{c.st}</div>
            </div>
          ))}
        </div>

        <div className="mt-6 flex gap-2">
          {(["students", "inquiries"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`rounded-lg px-4 py-2 text-sm font-medium capitalize ${
                tab === t
                  ? "bg-primary text-primary-foreground"
                  : "bg-background text-foreground"
              }`}
            >
              {t}
              {t === "inquiries" && inquiries.data ? ` (${inquiries.data.length})` : ""}
            </button>
          ))}
        </div>

        {error && (
          <p className="mt-4 rounded-lg bg-destructive/10 p-3 text-sm text-destructive">{error}</p>
        )}

        {tab === "students" && (
          <section className="mt-4 rounded-xl bg-background p-4 shadow-sm">
            <div className="flex flex-wrap items-center gap-2">
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="নাম / phone / email খুঁজুন"
                className={`${input} max-w-xs`}
              />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className={`${input} max-w-[160px]`}
              >
                <option value="">All status</option>
                {STATUSES.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
              <button
                onClick={() => {
                  setEditing(null);
                  setShowForm(true);
                }}
                className="ml-auto rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground"
              >
                + Add Student
              </button>
            </div>

            <div className="mt-4 overflow-x-auto">
              <table className="w-full min-w-[720px] text-left text-sm">
                <thead className="text-xs uppercase text-muted-foreground">
                  <tr>
                    <th className="py-2">Name</th>
                    <th>Phone</th>
                    <th>Course</th>
                    <th>Level</th>
                    <th>Status</th>
                    <th />
                  </tr>
                </thead>
                <tbody>
                  {students.isLoading && (
                    <tr>
                      <td colSpan={6} className="py-6 text-muted-foreground">
                        Loading...
                      </td>
                    </tr>
                  )}
                  {!students.isLoading && rows.length === 0 && (
                    <tr>
                      <td colSpan={6} className="py-6 text-muted-foreground">
                        কোনো student নেই।
                      </td>
                    </tr>
                  )}
                  {rows.map((s) => (
                    <tr key={s.id} className="border-t border-border">
                      <td className="py-3 font-medium text-foreground">{s.full_name}</td>
                      <td className="text-muted-foreground">{s.phone}</td>
                      <td className="text-muted-foreground">{s.course ?? "—"}</td>
                      <td className="text-muted-foreground">{s.japanese_level ?? "—"}</td>
                      <td>
                        <span className="rounded-full bg-muted px-2 py-1 text-xs capitalize text-foreground">
                          {s.status}
                        </span>
                      </td>
                      <td className="text-right">
                        <button
                          onClick={() => {
                            setEditing(s);
                            setShowForm(true);
                          }}
                          className="px-2 text-sm text-foreground underline"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => removeStudent(s.id)}
                          className="px-2 text-sm text-destructive underline"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {tab === "inquiries" && (
          <section className="mt-4 rounded-xl bg-background p-4 shadow-sm">
            {inquiries.isLoading && <p className="text-muted-foreground">Loading...</p>}
            {inquiries.data?.length === 0 && (
              <p className="text-muted-foreground">কোনো inquiry আসেনি।</p>
            )}
            <div className="space-y-3">
              {inquiries.data?.map((i) => (
                <article key={i.id} className="rounded-lg border border-border p-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <b className="text-foreground">{i.name}</b>
                    <span className="text-sm text-muted-foreground">{i.phone}</span>
                    {i.email && <span className="text-sm text-muted-foreground">{i.email}</span>}
                    <span className="ml-auto text-xs text-muted-foreground">
                      {new Date(i.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  {i.course && (
                    <p className="mt-1 text-sm text-muted-foreground">Course: {i.course}</p>
                  )}
                  {i.message && <p className="mt-1 text-sm text-foreground">{i.message}</p>}
                  <button
                    onClick={() => convertInquiry(i)}
                    className="mt-2 rounded-lg bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground"
                  >
                    Student হিসেবে add করুন
                  </button>
                </article>
              ))}
            </div>
          </section>
        )}
      </div>

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-foreground/40 p-4">
          <form
            onSubmit={saveStudent}
            className="mt-10 w-full max-w-lg space-y-3 rounded-2xl bg-background p-6 shadow-xl"
          >
            <h2 className="text-lg font-bold text-foreground">
              {editing ? "Edit Student" : "Add Student"}
            </h2>
            <input
              required
              name="full_name"
              defaultValue={editing?.full_name ?? ""}
              placeholder="Full name"
              className={input}
            />
            <input
              required
              name="phone"
              defaultValue={editing?.phone ?? ""}
              placeholder="Phone"
              className={input}
            />
            <input
              name="email"
              type="email"
              defaultValue={editing?.email ?? ""}
              placeholder="Email"
              className={input}
            />
            <input
              name="course"
              defaultValue={editing?.course ?? ""}
              placeholder="Course"
              className={input}
            />
            <div className="grid grid-cols-2 gap-3">
              <select name="status" defaultValue={editing?.status ?? "inquiry"} className={input}>
                {STATUSES.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
              <select
                name="japanese_level"
                defaultValue={editing?.japanese_level ?? ""}
                className={input}
              >
                <option value="">Japanese level</option>
                {LEVELS.map((l) => (
                  <option key={l} value={l}>
                    {l}
                  </option>
                ))}
              </select>
            </div>
            <input
              name="enrolled_at"
              type="date"
              defaultValue={editing?.enrolled_at ?? ""}
              className={input}
            />
            <textarea
              name="notes"
              rows={3}
              defaultValue={editing?.notes ?? ""}
              placeholder="Notes"
              className={input}
            />
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  setEditing(null);
                }}
                className="rounded-lg border border-input px-4 py-2 text-sm text-foreground"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground"
              >
                Save
              </button>
            </div>
          </form>
        </div>
      )}
    </main>
  );
}

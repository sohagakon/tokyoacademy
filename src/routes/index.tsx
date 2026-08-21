import { createFileRoute } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { supabase } from "@/integrations/supabase/client";
import logo from "@/assets/tokyo-logo.png.asset.json";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Tokyo Academy | Study in Japan & Japanese Language" },
      {
        name: "description",
        content:
          "Tokyo Academy — Japanese language training, study in Japan guidance and career support for students from Bangladesh.",
      },
      { property: "og:title", content: "Tokyo Academy | Study in Japan" },
      {
        property: "og:description",
        content:
          "Japanese language, higher education in Japan and career support — all in one place.",
      },
    ],
  }),
  component: Index,
});

const COURSES = [
  {
    n: "01",
    title: "Japanese Language School",
    text: "Japanese language skill উন্নত করে পরবর্তী study বা career-এর প্রস্তুতি নিন।",
    img: "https://images.unsplash.com/photo-1528360983277-13d401cdc186?auto=format&fit=crop&w=800&q=80",
  },
  {
    n: "02",
    title: "University",
    text: "আপনার academic goal অনুযায়ী Japan-এর higher education path সম্পর্কে guidance.",
    img: "https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&w=800&q=80",
  },
  {
    n: "03",
    title: "Vocational School",
    text: "Skill-based education ও practical career-এর জন্য বিভিন্ন study option.",
    img: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=800&q=80",
  },
  {
    n: "04",
    title: "IT & Engineering",
    text: "Technology ও engineering background-এর শিক্ষার্থীদের জন্য career-focused guidance.",
    img: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=800&q=80",
  },
];

const STEPS = [
  ["01", "Free Consultation", "আপনার profile ও goal বুঝে initial guidance."],
  ["02", "School Selection", "আপনার জন্য উপযুক্ত study option নির্বাচন."],
  ["03", "Documents", "প্রয়োজনীয় documents প্রস্তুত ও application guidance."],
  ["04", "Application", "School application ও পরবর্তী process-এর support."],
  ["05", "COE & Visa", "প্রয়োজনীয় process সম্পর্কে guidance."],
  ["06", "Japan ✈️", "Japan যাওয়ার পরের journey-এর জন্য প্রস্তুতি."],
];

const NAV = [
  ["#home", "Home"],
  ["#about", "About"],
  ["#study", "Study in Japan"],
  ["#courses", "Courses"],
  ["#career", "Job Support"],
  ["#stories", "Success Stories"],
  ["#contact", "Contact"],
];

function Brand() {
  return (
    <a className="brand" href="#home">
      <img src={logo.url} alt="Tokyo Academy logo" />
      <span>
        <b>TOKYO</b>
        <small>ACADEMY</small>
      </span>
    </a>
  );
}

function Index() {
  const [open, setOpen] = useState(false);
  const [sending, setSending] = useState(false);
  const [message, setMessage] = useState<{ text: string; error?: boolean } | null>(null);

  async function submitForm(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    setSending(true);
    setMessage(null);
    const { error } = await supabase.from("inquiries").insert({
      name: String(data.get("name") ?? ""),
      phone: String(data.get("phone") ?? ""),
      email: String(data.get("email") ?? "") || null,
      course: String(data.get("course") ?? "") || null,
      message: String(data.get("message") ?? "") || null,
    });
    setSending(false);
    if (error) {
      setMessage({ text: "দুঃখিত, পাঠানো যায়নি। আবার চেষ্টা করুন।", error: true });
      return;
    }
    setMessage({ text: "ধন্যবাদ! আপনার inquiry গ্রহণ করা হয়েছে। আমরা শীঘ্রই যোগাযোগ করব।" });
    form.reset();
  }

  return (
    <>
      <header className="site-header">
        <div className="container-x nav">
          <Brand />
          <button className="menu-btn" aria-label="Menu" onClick={() => setOpen((o) => !o)}>
            ☰
          </button>
          <nav className={open ? "menu open" : "menu"}>
            {NAV.map(([href, label]) => (
              <a key={href} href={href} onClick={() => setOpen(false)}>
                {label}
              </a>
            ))}
            <a className="nav-cta" href="#contact" onClick={() => setOpen(false)}>
              Apply Now
            </a>
          </nav>
        </div>
      </header>

      <main>
        <section id="home" className="hero">
          <div className="container-x hero-content">
            <span className="eyebrow">🇯🇵 YOUR JAPAN JOURNEY STARTS HERE</span>
            <h1>
              জাপানে আপনার
              <br />
              <span>ভবিষ্যৎ গড়ুন</span>
            </h1>
            <p>
              জাপানি ভাষা শিক্ষা, উচ্চশিক্ষা, ক্যারিয়ার ও Japan-এর জীবনযাত্রা সম্পর্কে প্রয়োজনীয়
              দিকনির্দেশনা—সবকিছু এক জায়গায়।
            </p>
            <div className="hero-buttons">
              <a href="#study" className="btn btn-primary">
                🎓 Study in Japan
              </a>
              <a href="#contact" className="btn btn-light">
                📞 Free Consultation
              </a>
            </div>
            <div className="hero-trust">
              <div>
                <strong>01</strong>
                <span>Personal Guidance</span>
              </div>
              <div>
                <strong>02</strong>
                <span>Admission Support</span>
              </div>
              <div>
                <strong>03</strong>
                <span>Career Guidance</span>
              </div>
            </div>
          </div>
        </section>

        <section id="about" className="section">
          <div className="container-x">
            <div className="section-head">
              <span className="eyebrow red">WHY TOKYO ACADEMY</span>
              <h2>
                জাপানে যাওয়ার পথটা হোক <span>সহজ ও সঠিক</span>
              </h2>
              <p>
                আপনার শিক্ষা ও career goal অনুযায়ী সঠিক পথ বেছে নিতে Tokyo Academy পাশে থাকবে।
              </p>
            </div>
            <div className="grid-3">
              <article className="feature-card">
                <div className="icon">🎓</div>
                <h3>জাপানে উচ্চ শিক্ষা</h3>
                <p>Language School, University ও Vocational Education বেছে নেওয়ার জন্য guidance.</p>
                <a className="link-accent" href="#study">
                  Explore →
                </a>
              </article>
              <article className="feature-card">
                <div className="icon">💼</div>
                <h3>Career & Job Support</h3>
                <p>Japan-এ career development ও job hunting-এর জন্য প্রয়োজনীয় guidance.</p>
                <a className="link-accent" href="#career">
                  Explore →
                </a>
              </article>
              <article className="feature-card">
                <div className="icon">🏠</div>
                <h3>Japan Life Support</h3>
                <p>Accommodation, daily life ও নতুন পরিবেশে মানিয়ে নেওয়ার practical support.</p>
                <a className="link-accent" href="#life">
                  Explore →
                </a>
              </article>
            </div>
          </div>
        </section>

        <section id="study" className="section gray">
          <div className="container-x">
            <div className="section-head">
              <span className="eyebrow red">STUDY IN JAPAN</span>
              <h2>
                আপনার জন্য সঠিক <span>Study Path</span>
              </h2>
            </div>
            <div className="grid-4">
              {COURSES.map((c) => (
                <article key={c.n} className="course-card">
                  <div className="course-image" style={{ backgroundImage: `url('${c.img}')` }} />
                  <div className="course-body">
                    <span>{c.n}</span>
                    <h3>{c.title}</h3>
                    <p>{c.text}</p>
                    <a className="link-accent" href="#contact">
                      Learn More →
                    </a>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="courses" className="section">
          <div className="container-x">
            <div className="section-head left">
              <span className="eyebrow red">HOW IT WORKS</span>
              <h2>
                Your <span>Japan Journey</span>
              </h2>
              <p>শুরু থেকে Japan পৌঁছানো পর্যন্ত একটি পরিষ্কার step-by-step process.</p>
            </div>
            <div className="grid-3">
              {STEPS.map(([n, title, text]) => (
                <div key={n} className="step">
                  <b>{n}</b>
                  <h3>{title}</h3>
                  <p>{text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="career" className="career section">
          <div className="container-x career-wrap">
            <div>
              <span className="eyebrow">CAREER SUPPORT</span>
              <h2 className="block-title">
                Study → Skill → <span className="accent-text">Job → Career</span>
              </h2>
              <p>
                Japan-এ পড়াশোনার পর career planning ও job hunting সম্পর্কে practical guidance নিন।
              </p>
              <a href="#contact" className="btn btn-light">
                Talk to an Advisor
              </a>
            </div>
            <div className="career-list">
              <div>✓ Resume / CV Guidance</div>
              <div>✓ Interview Preparation</div>
              <div>✓ Job Hunting Guidance</div>
              <div>✓ Career Counseling</div>
              <div>✓ Employment Support</div>
              <div>✓ Career Planning</div>
            </div>
          </div>
        </section>

        <section id="life" className="section">
          <div className="container-x">
            <div className="section-head">
              <span className="eyebrow red">LIFE IN JAPAN</span>
              <h2>
                Japan-এ নতুন জীবন হোক <span>আরও সহজ</span>
              </h2>
            </div>
            <div className="grid-4">
              <div className="life-card">
                <span>🏠</span>
                <b>Accommodation</b>
                <small>Housing guidance</small>
              </div>
              <div className="life-card">
                <span>🚆</span>
                <b>Transportation</b>
                <small>Daily travel guidance</small>
              </div>
              <div className="life-card">
                <span>💴</span>
                <b>Daily Life</b>
                <small>Practical information</small>
              </div>
              <div className="life-card">
                <span>👨‍🎓</span>
                <b>Student Support</b>
                <small>Student life guidance</small>
              </div>
            </div>
          </div>
        </section>

        <section id="stories" className="section gray">
          <div className="container-x">
            <div className="section-head">
              <span className="eyebrow red">STUDENT STORIES</span>
              <h2>
                আমাদের শিক্ষার্থীদের <span>অভিজ্ঞতা</span>
              </h2>
            </div>
            <div className="grid-2">
              <article className="story">
                <div className="avatar">S</div>
                <div>
                  <div className="stars">★★★★★</div>
                  <p>
                    “Japan যাওয়ার পুরো process-এ সঠিক guidance পাওয়াটা আমার জন্য সবচেয়ে গুরুত্বপূর্ণ
                    ছিল।”
                  </p>
                  <b>Student Name</b>
                  <small>Bangladesh → Japan</small>
                </div>
              </article>
              <article className="story">
                <div className="avatar">A</div>
                <div>
                  <div className="stars">★★★★★</div>
                  <p>
                    “Study option নির্বাচন থেকে application preparation—সবকিছু সুন্দরভাবে বুঝিয়ে
                    দেওয়া হয়েছে।”
                  </p>
                  <b>Student Name</b>
                  <small>Bangladesh → Japan</small>
                </div>
              </article>
            </div>
          </div>
        </section>

        <section id="contact" className="section">
          <div className="container-x contact-wrap">
            <div>
              <span className="eyebrow red">GET IN TOUCH</span>
              <h2 className="block-title">
                আপনার Japan Journey <span className="accent-text">আজ থেকেই শুরু করুন</span>
              </h2>
              <p>আপনার শিক্ষা ও career goal আমাদের জানান। একজন advisor আপনার সাথে যোগাযোগ করবে।</p>
              <div className="contact-info">
                <p>
                  📞 <b>Phone:</b> +880 1717588112
                </p>
                <p>
                  💬 <b>WhatsApp:</b> +880 1763902264
                </p>
                <p>
                  📧 <b>Email:</b> info@tokyoacademy.com
                </p>
                <p>
                  📍 <b>Office:</b> Dhaka, Bangladesh
                </p>
              </div>
            </div>
            <form className="form" onSubmit={submitForm}>
              <input required name="name" type="text" placeholder="আপনার নাম" />
              <input required name="phone" type="tel" placeholder="Phone Number" />
              <input name="email" type="email" placeholder="Email Address" />
              <select name="course" defaultValue="">
                <option value="">Preferred Course</option>
                <option>Japanese Language School</option>
                <option>University</option>
                <option>Vocational School</option>
                <option>IT & Engineering</option>
              </select>
              <textarea name="message" rows={4} placeholder="আপনার প্রশ্ন লিখুন..." />
              <button className="btn btn-primary" type="submit" disabled={sending}>
                {sending ? "পাঠানো হচ্ছে..." : "Send Inquiry →"}
              </button>
              {message && (
                <p className={message.error ? "form-message error" : "form-message"}>
                  {message.text}
                </p>
              )}
            </form>
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <div className="container-x footer-grid">
          <div>
            <Brand />
            <p>Learn Japanese • Study in Japan • Build Your Career</p>
          </div>
          <div>
            <h4>Quick Links</h4>
            <a href="#about">About</a>
            <a href="#study">Study in Japan</a>
            <a href="#career">Job Support</a>
            <a href="#contact">Contact</a>
          </div>
          <div>
            <h4>Follow Us</h4>
            <a href="#">Facebook</a>
            <a href="#">Instagram</a>
            <a href="#">YouTube</a>
            <a href="#">TikTok</a>
          </div>
        </div>
        <div className="copyright">© 2026 Tokyo Academy. All Rights Reserved.</div>
      </footer>
    </>
  );
}

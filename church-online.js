(() => {
  const config = window.CHURCH_CONFIG || {};
  const whatsAppUrl = (message) => "https://wa.me/" + config.whatsappNumber + "?text=" + encodeURIComponent(message);

  const devotionals = [
    ["God is with you.", "Whatever today holds, you do not walk through it alone. God is near, faithful, and able to strengthen you.", "Isaiah 41:10"],
    ["Grace for today.", "God's grace meets you in every moment. Receive His help and take the next step with confidence.", "2 Corinthians 12:9"],
    ["Choose gratitude.", "Give thanks for the gifts you can see and trust God with the things still unfolding.", "1 Thessalonians 5:18"]
  ];
  let devotionalIndex = 0;
  document.getElementById("nextDevotional")?.addEventListener("click", () => {
    devotionalIndex = (devotionalIndex + 1) % devotionals.length;
    const [title, text, verse] = devotionals[devotionalIndex];
    document.getElementById("devotionalTitle").textContent = title;
    document.getElementById("devotionalText").textContent = text;
    document.getElementById("devotionalVerse").textContent = verse;
  });

  document.getElementById("sermonSearch")?.addEventListener("input", (event) => {
    const term = event.target.value.trim().toLowerCase();
    document.querySelectorAll("#sermonGrid .sermon-card").forEach((card) => {
      card.hidden = !card.textContent.toLowerCase().includes(term) && !card.dataset.search.includes(term);
    });
  });

  document.getElementById("prayerForm")?.addEventListener("submit", (event) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    window.open(whatsAppUrl("Prayer request from " + form.get("name") + ":\n\n" + form.get("request")), "_blank", "noopener");
  });

  document.getElementById("testimonyForm")?.addEventListener("submit", (event) => {
    event.preventDefault();
    const name = document.getElementById("testimonyName").value.trim() || "Anonymous";
    const testimony = document.getElementById("testimonyText").value.trim();
    window.open(whatsAppUrl("Testimony / praise report from " + name + ":\n\n" + testimony), "_blank", "noopener");
  });

  document.getElementById("eventForm")?.addEventListener("submit", (event) => {
    event.preventDefault();
    const name = document.getElementById("eventName").value.trim();
    const choice = document.getElementById("eventChoice").value;
    const ticketId = "OH-" + Date.now().toString(36).toUpperCase();
    const ticket = document.getElementById("ticketResult");
    const ticketData = "RCCG Open Heavens | " + choice + " | " + name + " | " + ticketId;
    ticket.hidden = false;
    ticket.innerHTML = "<strong>Registration received</strong><p>" + choice + "<br>Ticket: " + ticketId + "</p><img alt=\"QR confirmation\" src=\"https://api.qrserver.com/v1/create-qr-code/?size=140x140&amp;data=" + encodeURIComponent(ticketData) + "\"><p>Please also confirm your registration with the church team on WhatsApp.</p>";
    window.open(whatsAppUrl("Event registration:\nName: " + name + "\nEvent: " + choice + "\nTicket: " + ticketId), "_blank", "noopener");
  });

  document.getElementById("paystackButton")?.addEventListener("click", () => {
    const note = document.getElementById("paymentNote");
    if (!config.paystackPublicKey) { note.textContent = "Paystack is awaiting the church public key. No payment has been started."; return; }
    const amount = Number(document.getElementById("givingAmount").value) * 100;
    const email = document.getElementById("givingEmail").value.trim();
    if (!amount || !email) { note.textContent = "Enter a valid amount and email address to continue."; return; }
    const script = document.createElement("script");
    script.src = "https://js.paystack.co/v1/inline.js";
    script.onload = () => window.PaystackPop.setup({ key: config.paystackPublicKey, email, amount, currency: "NGN", callback: () => { note.textContent = "Thank you. Your Paystack payment was completed."; } }).openIframe();
    document.body.appendChild(script);
  });

  let supabaseClient;
  const loadSupabase = () => new Promise((resolve, reject) => {
    if (window.supabase) return resolve(window.supabase);
    const library = document.createElement("script");
    library.src = "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2";
    library.onload = () => resolve(window.supabase);
    library.onerror = reject;
    document.head.appendChild(library);
  });

  document.getElementById("memberPortalButton")?.addEventListener("click", async () => {
    const note = document.getElementById("portalNote");
    if (!config.supabaseUrl || !config.supabaseAnonKey) { note.textContent = "Supabase project details are still required before secure sign-in can be enabled."; return; }
    try {
      if (!supabaseClient) {
        const supabase = await loadSupabase();
        supabaseClient = supabase.createClient(config.supabaseUrl, config.supabaseAnonKey);
      }
      const email = window.prompt("Enter your email address to receive a secure member sign-in link:");
      if (!email) return;
      const { error } = await supabaseClient.auth.signInWithOtp({ email, options: { emailRedirectTo: window.location.href } });
      note.textContent = error ? error.message : "Check your email for your secure member sign-in link.";
    } catch {
      note.textContent = "Unable to connect to member sign-in right now. Please try again later.";
    }
  });

  const languageSwitch = document.getElementById("languageSwitch");
  if (languageSwitch) {
    languageSwitch.outerHTML = '<div class="language-switcher" aria-label="Choose language"><button type="button" data-language="en" class="active">English</button><button type="button" data-language="yo">Yorùbá</button></div>';
    const translations = {
      en: {
        heroEyebrow: "RCCG OPEN HEAVENS ONLINE", heroTitle: "Church with you,<br><em>wherever you are.</em>", heroText: "Watch live, grow through the Word, share a prayer request, give securely, and stay connected with your church family.", watch: "Watch Live <span>→</span>", prayer: "Send a Prayer Request", liveEyebrow: '<span class="live-dot"></span> LIVE &amp; ON DEMAND', liveTitle: "Worship with us <em>online.</em>", sermonTitle: "Find a word for <em>today.</em>", devotionalTitle: "God is with you.", givingTitle: "Give with a<br><em>joyful heart.</em>", memberTitle: "Serve, connect, and<br><em>belong.</em>"
      },
      yo: {
        heroEyebrow: "RCCG OPEN HEAVENS LÓRÍ AYÉLÙJÁRÀ", heroTitle: "Ìjọ pẹ̀lú rẹ,<br><em>níbi gbogbo tí o wà.</em>", heroText: "Wo ìsìn wa láàyè, dàgbà nínú Ọ̀rọ̀ Ọlọ́run, fi ìbéèrè àdúrà ránṣẹ́, kí o sì máa bá ìdílé ìjọ rẹ pọ̀.", watch: "Wo Ìsìn Láàyè <span>→</span>", prayer: "Fi Ìbéèrè Àdúrà Ránṣẹ́", liveEyebrow: '<span class="live-dot"></span> ÌSÌN LÁÀYÈ', liveTitle: "Jọ́sìn pẹ̀lú wa <em>lórí ayélujára.</em>", sermonTitle: "Wá ọ̀rọ̀ fún <em>òní.</em>", devotionalTitle: "Ọlọ́run wà pẹ̀lú rẹ.", givingTitle: "Fúnni pẹ̀lú<br><em>ọkàn ayọ̀.</em>", memberTitle: "Sìn, sopọ̀, kí o sì<br><em>jẹ́ ọmọ ìdílé.</em>"
      }
    };
    const setText = (selector, content) => { const element = document.querySelector(selector); if (element) element.innerHTML = content; };
    const setLanguage = (language) => {
      const copy = translations[language];
      document.documentElement.lang = language;
      setText(".online-hero .eyebrow", copy.heroEyebrow);
      setText(".online-hero h1", copy.heroTitle);
      setText(".online-hero > div > p:not(.eyebrow)", copy.heroText);
      setText(".online-actions a:first-child", copy.watch);
      setText(".online-actions a:last-child", copy.prayer);
      setText("#live .section-title .eyebrow", copy.liveEyebrow);
      setText("#live .section-title h2", copy.liveTitle);
      setText("#sermons .section-title h2", copy.sermonTitle);
      setText("#devotionalTitle", copy.devotionalTitle);
      setText("#giving h2", copy.givingTitle);
      setText("#members h2", copy.memberTitle);
      document.querySelectorAll("[data-language]").forEach((button) => button.classList.toggle("active", button.dataset.language === language));
      localStorage.setItem("church-language", language);
    };
    document.querySelectorAll("[data-language]").forEach((button) => button.addEventListener("click", () => setLanguage(button.dataset.language)));
    setLanguage(localStorage.getItem("church-language") || "en");
  }
})();

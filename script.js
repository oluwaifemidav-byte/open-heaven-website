// RCCG Open Heavens Church website interactions
document.addEventListener("DOMContentLoaded", () => {
  const favicon = document.createElement("link");
  favicon.rel = "icon";
  favicon.type = "image/png";
  favicon.href = "assets/church-logo.png";
  document.head.appendChild(favicon);

  if (!document.querySelector('link[rel="manifest"]')) {
    const manifest = document.createElement("link");
    manifest.rel = "manifest";
    manifest.href = "manifest.webmanifest";
    document.head.appendChild(manifest);
  }

  if ("serviceWorker" in navigator) navigator.serviceWorker.register("sw.js").catch(() => {});

  const revealItems = document.querySelectorAll(
    ".hero-content, .page-hero-content, .welcome, .service-band, .section-wrap, .quote-section, .about-intro, .values-section, .beliefs, .ministry-grid, .ministry-card, .schedule-item, .events-banner, .contact-layout, .contact-form, .social-card, .giving-card, .account-card, .live-preview-content, .stream-screen, .online-section"
  );
  revealItems.forEach((item) => item.classList.add("reveal"));

  if ("IntersectionObserver" in window) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("reveal-visible");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -30px 0px" });

    revealItems.forEach((item) => revealObserver.observe(item));
  } else {
    revealItems.forEach((item) => item.classList.add("reveal-visible"));
  }

  const onlineNav = document.querySelector(".nav");
  const giveLink = onlineNav && onlineNav.querySelector('a[href="give.html"]');
  if (giveLink) {
    giveLink.classList.add("giving-nav-icon");
    if (!giveLink.querySelector("svg")) {
      giveLink.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M12 21.35 10.55 20C5.4 15.36 2 12.28 2 8.5A4.5 4.5 0 0 1 6.5 4c1.74 0 3.41.81 4.5 2.09A6.08 6.08 0 0 1 15.5 4 4.5 4.5 0 0 1 20 8.5c0 3.78-3.4 6.86-8.55 11.5L12 21.35Z"/></svg><span>Give</span>';
    }
  }

  const desiredOrder = [
    { href: "index.html", label: "Home" },
    { href: "ministries.html", label: "Ministries" },
    { href: "church-online.html", label: "Church Online" },
    { href: "events.html", label: "Events" },
    { href: "about.html", label: "About Us" },
    { href: "social.html", label: "Social Media" },
    { href: "give.html", label: "Give" }
  ];

  desiredOrder.forEach(({ href, label }) => {
    const exactLink = onlineNav && onlineNav.querySelector(`a[href="${href}"]`);
    if (!onlineNav) return;
    if (exactLink) return;

    const link = document.createElement("a");
    link.href = href;
    link.textContent = label;
    if (href === "give.html") {
      link.className = "giving-nav-icon";
      link.setAttribute("aria-label", "Give online");
      link.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M12 21.35 10.55 20C5.4 15.36 2 12.28 2 8.5A4.5 4.5 0 0 1 6.5 4c1.74 0 3.41.81 4.5 2.09A6.08 6.08 0 0 1 15.5 4 4.5 4.5 0 0 1 20 8.5c0 3.78-3.4 6.86-8.55 11.5L12 21.35Z"/></svg><span>Give</span>';
    }
    if (window.location.pathname.endsWith(href)) link.classList.add("active");
    const contactLink = onlineNav.querySelector('a[href="contact.html"]');
    onlineNav.insertBefore(link, contactLink || null);
  });

  if (onlineNav) {
    const orderedNodes = [];
    const nodes = [...onlineNav.querySelectorAll("a")];
    desiredOrder.forEach(({ href }) => {
      const match = nodes.find((node) => (node.getAttribute("href") || "").split("?")[0].split("#")[0].endsWith(href));
      if (match) orderedNodes.push(match);
    });

    const remaining = nodes.filter((node) => !orderedNodes.includes(node));
    orderedNodes.push(...remaining);
    orderedNodes.forEach((node) => onlineNav.appendChild(node));
  }

  document.querySelectorAll(".footer-links").forEach((footerLinks) => {
    if (!footerLinks.querySelector('a[href="social.html"]')) {
      const socialLink = document.createElement("a");
      socialLink.href = "social.html";
      socialLink.textContent = "Social Media";
      footerLinks.appendChild(socialLink);
    }
  });

  const config = window.CHURCH_CONFIG || {};
  const churchAddress = config.churchAddress || "RF44+QXX, Canaan Land Rd, Camp, Loburo 110113, Ogun State";
  const mapUrl = "https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent(churchAddress);
  const address = document.getElementById("churchAddressText") || document.querySelector(".contact-detail p");
  if (address) {
    address.textContent = churchAddress;
  }

  const serviceList = document.getElementById("serviceList");
  if (serviceList && Array.isArray(config.serviceTimes)) {
    serviceList.innerHTML = config.serviceTimes.map((service) => `
      <div>
        <span class="service-day">${service.day}</span>
        <div>
          <b>${service.shortLabel || service.label || "Service"}</b>
          <small>${service.detail || service.time || "Check back soon"}</small>
        </div>
        <span class="service-arrow">↗</span>
      </div>
    `).join("");
  }

  const weeklyServices = document.getElementById("weeklyServicesText");
  if (weeklyServices && Array.isArray(config.serviceTimes)) {
    weeklyServices.innerHTML = config.serviceTimes.map((service) => `${service.shortLabel || service.label || "Service"}: ${service.detail || service.time || "Check back soon"}`).join("<br>");
  }

  const mapAddress = document.getElementById("churchMapAddress");
  if (mapAddress) mapAddress.textContent = churchAddress;

  const directionsLink = document.getElementById("mapDirectionsLink");
  if (directionsLink) directionsLink.href = mapUrl;

  const contactInfo = document.getElementById("contactInfoText");
  if (contactInfo) {
    const phone = config.whatsappNumber ? `<a href="tel:${config.whatsappNumber}">${config.whatsappNumber}</a>` : "[Add official phone number]";
    const emailText = config.churchEmail ? `<a href="mailto:${config.churchEmail}">${config.churchEmail}</a>` : "[Add official email]";
    contactInfo.innerHTML = `${emailText}<br>${phone}`;
  }

  const mapSection = document.querySelector(".map-placeholder");
  if (mapSection) {
    const map = document.createElement("iframe");
    map.className = "church-map";
    map.title = "Map to RCCG Open Heavens Church";
    map.loading = "lazy";
    map.referrerPolicy = "no-referrer-when-downgrade";
    map.src = "https://www.google.com/maps?q=" + encodeURIComponent(churchAddress) + "&output=embed";

    const heading = document.createElement("h3");
    heading.textContent = "Find your way to church";
    const location = document.createElement("p");
    location.textContent = churchAddress;
    const directions = document.createElement("a");
    directions.className = "text-link";
    directions.href = mapUrl;
    directions.target = "_blank";
    directions.rel = "noopener noreferrer";
    directions.textContent = "Get directions ";
    const arrow = document.createElement("span");
    arrow.textContent = "→";
    directions.appendChild(arrow);

    mapSection.replaceChildren(map, heading, location, directions);
  }

  const year = document.getElementById("year");
  if (year) year.textContent = new Date().getFullYear();

  const toggle = document.querySelector(".menu-toggle");
  const nav = document.querySelector(".nav");
  if (toggle && nav) {
    toggle.addEventListener("click", () => {
      const open = nav.classList.toggle("nav-open");
      toggle.setAttribute("aria-expanded", String(open));
      toggle.textContent = open ? "✕" : "☰";
    });
  }

  const CHURCH_EMAIL = (window.CHURCH_CONFIG && window.CHURCH_CONFIG.churchEmail) || "openheavenschurchrccg@gmail.com";
  const form = document.getElementById("contactForm");
  if (form) {
    const params = new URLSearchParams(window.location.search);
    const ministry = params.get("ministry");
    if (ministry) {
      const reason = document.getElementById("reason");
      if (reason) reason.value = "Ministry / volunteering";
      const message = document.getElementById("message");
      if (message) message.value = "I am interested in joining the " + ministry + ". Please contact me with more information.";
    }
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      const feedback = document.getElementById("formFeedback");
      if (CHURCH_EMAIL.includes("YOUR-CHURCH-EMAIL")) {
        feedback.textContent = "Demo mode: please add the church's official email in script.js before publishing. Your message has not been sent.";
        feedback.classList.add("show");
        return;
      }
      const data = new FormData(form);
      const subject = encodeURIComponent("Website enquiry: " + data.get("reason"));
      const body = encodeURIComponent(
        "Name: " + data.get("name") + "\nEmail: " + data.get("email") +
        "\nPhone: " + (data.get("phone") || "Not provided") +
        "\nReason: " + data.get("reason") + "\n\nMessage:\n" + data.get("message")
      );
      window.location.href = "mailto:" + CHURCH_EMAIL + "?subject=" + subject + "&body=" + body;
      feedback.textContent = "Your email app should open with your message prepared. Please send it from your email app.";
      feedback.classList.add("show");
    });
  }
});

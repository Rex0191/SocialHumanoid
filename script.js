const tabButtons = Array.from(document.querySelectorAll("[data-demo-tab]"));
const tabPanels = Array.from(document.querySelectorAll("[data-demo-panel]"));
const navLinks = Array.from(document.querySelectorAll(".nav-links a"));
const copyButton = document.querySelector("[data-copy-citation]");
const citationCode = document.querySelector(".citation-box code");

function pausePanelVideos(panel) {
  panel.querySelectorAll("video").forEach((video) => {
    video.pause();
  });
}

tabButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const target = button.dataset.demoTab;

    tabButtons.forEach((item) => {
      const selected = item === button;
      item.classList.toggle("is-active", selected);
      item.setAttribute("aria-selected", String(selected));
    });

    tabPanels.forEach((panel) => {
      const selected = panel.dataset.demoPanel === target;
      panel.classList.toggle("is-active", selected);
      panel.hidden = !selected;
      if (!selected) {
        pausePanelVideos(panel);
      }
    });
  });
});

if ("IntersectionObserver" in window) {
  const sections = navLinks
    .map((link) => document.querySelector(link.getAttribute("href")))
    .filter(Boolean);

  const observer = new IntersectionObserver(
    (entries) => {
      const visible = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

      if (!visible) {
        return;
      }

      navLinks.forEach((link) => {
        link.classList.toggle("is-active", link.getAttribute("href") === `#${visible.target.id}`);
      });
    },
    {
      rootMargin: "-30% 0px -55% 0px",
      threshold: [0.08, 0.2, 0.45, 0.7],
    }
  );

  sections.forEach((section) => observer.observe(section));
}

if (copyButton && citationCode) {
  copyButton.addEventListener("click", async () => {
    const text = citationCode.textContent.trim();

    try {
      await navigator.clipboard.writeText(text);
      copyButton.textContent = "Copied";
      copyButton.classList.add("is-copied");
      window.setTimeout(() => {
        copyButton.textContent = "Copy";
        copyButton.classList.remove("is-copied");
      }, 1600);
    } catch (error) {
      const range = document.createRange();
      const selection = window.getSelection();
      range.selectNodeContents(citationCode);
      selection.removeAllRanges();
      selection.addRange(range);
      copyButton.textContent = "Selected";
      window.setTimeout(() => {
        copyButton.textContent = "Copy";
      }, 1600);
    }
  });
}

document.addEventListener("visibilitychange", () => {
  if (document.hidden) {
    document.querySelectorAll("video").forEach((video) => video.pause());
  }
});

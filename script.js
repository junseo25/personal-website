// Tabs: show one section at a time, driven by the URL hash (#about, #work, ...)
document.documentElement.classList.add("js");

const panels = [...document.querySelectorAll(".panel")];
const tabs = [...document.querySelectorAll(".tabs a")];

function show() {
  const id = location.hash.slice(1);
  const target = panels.find((p) => p.id === id) || panels[0];
  panels.forEach((p) => p.classList.toggle("active", p === target));
  tabs.forEach((t) => t.classList.toggle("active", t.getAttribute("href") === "#" + target.id));
}

window.addEventListener("hashchange", () => {
  show();
  window.scrollTo({ top: 0 });
});
show();

// Dark mode switch: light (white) by default, remembers the visitor's choice
const root = document.documentElement;
const toggle = document.getElementById("themeToggle");

function setTheme(theme) {
  root.dataset.theme = theme;
  toggle.checked = theme === "dark";
}

try { setTheme(localStorage.getItem("theme") === "dark" ? "dark" : "light"); }
catch (e) { setTheme("light"); }

toggle.addEventListener("change", () => {
  setTheme(toggle.checked ? "dark" : "light");
  try { localStorage.setItem("theme", root.dataset.theme); } catch (e) {}
});

document.getElementById("year").textContent = new Date().getFullYear();

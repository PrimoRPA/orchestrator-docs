// Дерево документации: меню, хлебные крошки, «назад/вперёд», оглавление раздела.
// Страница подключает скрипт и задаёт <body data-root="../" data-page="deploy/first-run">.
// Версия черновика и время сборки — проставляет скрипт публикации.
const BUILD = { ver: "4.8.7", at: "10.11.2026 12:53" };

const TREE = [
  { id: "start", title: "Начало работы", task: "понять, что это и с чего начать", items: [
    ["where-to-start", "Путеводитель"],
    ["concepts", "Основные понятия"],
    ["overview", "Общие сведения"],
  ]},
  { id: "deploy", title: "Развертывание", task: "поставить с нуля", items: [
    ["planning", "Планирование установки", [
      ["know", "Что нужно знать"],
      ["planning-options", "Выбор варианта развертывания"],
      ["hardware", "Требования к железу"],
      ["network", "Порты и сетевой трафик"],
      ["service-accounts", "Учётные записи и права служб"],
      ["download", "Дистрибутивы"],
      ["checklist", "Что подготовить"],
    ]],
    ["install", "Установка", [
      ["install-docker", "Установка в Docker"],
      ["install-services", "Установка служб"],
      ["agent", "Машины роботов и агент"],
    ]],
    ["first-run", "Первый запуск"],
    ["verify", "Проверка установки"],
  ]},
  { id: "upgrade", title: "Обновление", task: "перейти на новую версию", items: [
    ["before", "Перед обновлением: лицензия и бэкап"],
    ["config-changes", "Изменения в конфигах между LTS"],
    ["order", "Порядок обновления: Windows, Linux, Docker"],
    ["from-root", "Переход с root на работу без root"],
    ["migrate", "Перенос на другой сервер или СУБД"],
  ]},
  { id: "configure", title: "Настройка", task: "настроить под себя", items: [
    ["access", "Вход и доступ"],
    ["security", "Безопасность"],
    ["robots-rdp", "Запуск роботов и RDP-сессии"],
    ["project-queue", "Очередь проектов"],
    ["notifications", "Почта и оповещения"],
    ["storage", "Хранилища"],
    ["integrations", "Интеграции"],
    ["scaling", "Масштабирование и отказоустойчивость"],
  ]},
  { id: "operate", title: "Сопровождение", task: "следить и обслуживать", items: [
    ["monitoring", "Мониторинг и метрики"],
    ["events", "События и их коды"],
    ["db-maintenance", "Обслуживание БД"],
    ["backup", "Резервное копирование и восстановление"],
    ["service-logs", "Журналы служб"],
  ]},
  { id: "work", title: "Работа в Оркестраторе", task: "работать в интерфейсе", items: [
    ["quickstart", "Быстрый старт"],
    ["robots", "Роботы и машины"],
    ["projects", "RPA-проекты"],
    ["jobs-triggers", "Задания и триггеры"],
    ["queues", "Очереди"],
    ["logs", "Журналы"],
    ["dashboards", "Дашборды и аналитика"],
    ["administration", "Администрирование"],
    ["ui2-to-ui4", "Где это теперь: UI2 → UI4"],
  ]},
  { id: "troubleshoot", title: "Неполадки", task: "разобраться со сбоем", items: [
    ["job-not-started", "Задание не запускается по расписанию или триггеру"],
    ["email-trigger", "Не срабатывает триггер по почте"],
    ["project-queue", "Проект висит в очереди и не уходит на робота"],
    ["robot-not-starting", "Робот не запускается: запуск завис на 50 % или 75 %"],
    ["robot-stops", "Робот останавливается сам или не останавливается по кнопке"],
    ["rdp", "Сессия робота не поднимается или не видна в консоли"],
    ["logs-empty", "Журнал робота пустой или не открывается"],
    ["license", "Нет валидной лицензии или робот не получает лицензию"],
    ["ui-not-opening", "Интерфейс не открывается или падает WebApi"],
    ["slow", "Оркестратор и БД работают медленно"],
    ["login", "Не получается войти через AD, SSO или Keycloak"],
    ["access", "Пользователь не видит папки, проекты или разделы"],
  ]},
  { id: "reference", title: "Справочник", task: "найти параметр, порт, файл", items: [
    ["compatibility", "Совместимость продуктов и платформ"],
    ["lifecycle", "Жизненный цикл версий и LTS"],
    ["config", "Параметры конфигурации"],
    ["components", "Компоненты и службы"],
    ["ports", "Порты"],
    ["delivery", "Комплект поставки"],
    ["db-schema", "Структура БД"],
    ["api", "API"],
    ["mcp", "MCP Server"],
    ["glossary", "Глоссарий"],
  ]},
];

(function () {
  const body = document.body;
  const root = body.dataset.root || "";
  const page = body.dataset.page || "";
  const href = (p) => root + (p.endsWith("/") ? p + "index.html" : p + ".html");

  // Плоский список страниц для «назад/вперёд»
  const flat = [{ path: "", title: "Главная" }];
  const walk = (sec, items, parent) => items.forEach(([slug, title, kids]) => {
    const node = { path: `${sec.id}/${slug}`, title, sec, parent };
    flat.push(node);
    if (kids) walk(sec, kids, node);
  });
  TREE.forEach((sec) => {
    flat.push({ path: `${sec.id}/`, title: sec.title, sec, isSection: true });
    walk(sec, sec.items, null);
  });
  const idx = flat.findIndex((n) => n.path === page);
  const cur = flat[idx] || flat[0];

  // Шапка
  const header = document.createElement("header");
  header.className = "top";
  header.innerHTML = `
    <a class="brand" href="${root}index.html">Primo RPA <b>Оркестратор</b></a>
    <span class="draft">черновик</span>
    <span class="build" title="Версия черновика и время последней сборки">${BUILD.ver} · ${BUILD.at}</span>
    <button class="menu-btn" aria-label="Меню">☰</button>`;
  body.prepend(header);

  // Меню
  const nav = document.createElement("nav");
  nav.className = "side";
  const li = (path, title, extra = "") =>
    `<li class="${path === page ? "cur" : ""} ${extra}"><a href="${href(path)}">${title}</a></li>`;
  const list = (sec, items) => "<ul>" + items.map(([slug, title, kids]) =>
    li(`${sec.id}/${slug}`, title) + (kids ? `<li class="kids">${list(sec, kids)}</li>` : "")
  ).join("") + "</ul>";
  // Какие разделы меню открыты — помним между страницами (пользователь мог оставить их открытыми специально)
  let openSecs = [];
  try { openSecs = JSON.parse(localStorage.getItem("nav:open") || "[]"); } catch (e) { openSecs = []; }
  nav.innerHTML = TREE.map((sec, i) => {
    const open = (cur.sec && cur.sec.id === sec.id) || openSecs.includes(sec.id);
    return `<details data-sec="${sec.id}" ${open ? "open" : ""}>
      <summary><span class="n">${i + 1}</span>${sec.title}</summary>
      ${sec.id === "start" ? "" : `<a class="sec-link ${page === sec.id + "/" ? "cur" : ""}" href="${href(sec.id + "/")}">Обзор раздела</a>`}
      ${list(sec, sec.items)}
    </details>`;
  }).join("");

  nav.querySelectorAll("details").forEach((d) => d.addEventListener("toggle", () => {
    const ids = [...nav.querySelectorAll("details[open]")].map((x) => x.dataset.sec);
    try { localStorage.setItem("nav:open", JSON.stringify(ids)); } catch (e) {}
  }));
  const main = document.querySelector("main");
  const wrap = document.createElement("div");
  wrap.className = "layout";
  main.replaceWith(wrap);
  wrap.append(nav, main);
  header.querySelector(".menu-btn").onclick = () => body.classList.toggle("nav-open");

  // Хлебные крошки
  if (cur.sec) {
    const bc = document.createElement("div");
    bc.className = "crumbs";
    let html = `<a href="${root}index.html">Оркестратор</a> › <a href="${href(cur.sec.id + "/")}">${cur.sec.title}</a>`;
    if (cur.parent) html += ` › <a href="${href(cur.parent.path)}">${cur.parent.title}</a>`;
    bc.innerHTML = html;
    main.prepend(bc);
  }

  // Оглавление раздела или дочерних страниц
  const kidsBox = document.getElementById("children");
  if (kidsBox) {
    const kids = cur.isSection
      ? flat.filter((n) => n.sec === cur.sec && !n.isSection && !n.parent)
      : flat.filter((n) => n.parent === cur);
    kidsBox.innerHTML = "<ul class='cards'>" + kids.map((n) =>
      `<li><a href="${href(n.path)}">${n.title}</a></li>`).join("") + "</ul>";
  }
  const secBox = document.getElementById("sections");
  if (secBox) {
    secBox.innerHTML = "<ol class='sections'>" + TREE.map((s) =>
      `<li><a href="${href(s.id + "/")}">${s.title}</a><span>${s.task}</span></li>`).join("") + "</ol>";
  }

  // Вкладки: <div class="tabs" data-key="…" [data-detect="1"]><section class="tab" id data-title data-os>
  const osNames = { windows: "Windows", linux: "Linux", macos: "macOS" };
  const detectOs = () => {
    const ua = ((navigator.userAgentData && navigator.userAgentData.platform) || navigator.platform || "") + " " + navigator.userAgent;
    if (/win/i.test(ua)) return "windows";
    if (/android/i.test(ua)) return "";
    if (/mac/i.test(ua)) return "macos";
    if (/linux|x11/i.test(ua)) return "linux";
    return "";
  };
  const store = {
    get: (k) => { try { return localStorage.getItem(k); } catch (e) { return null; } },
    set: (k, v) => { try { localStorage.setItem(k, v); } catch (e) {} },
  };
  document.querySelectorAll(".tabs").forEach((box) => {
    const tabs = [...box.children].filter((n) => n.matches("section.tab"));
    if (!tabs.length) return;
    const key = "tab:" + (box.dataset.key || "default");
    const detect = box.dataset.detect === "1";
    const sys = detect ? detectOs() : "";
    const bar = document.createElement("div");
    bar.className = "tab-bar";
    bar.setAttribute("role", "tablist");
    const btns = tabs.map((t) => {
      const b = document.createElement("button");
      b.type = "button";
      b.setAttribute("role", "tab");
      b.textContent = t.dataset.title || t.id;
      b.onclick = () => select(t.id, "manual", true);
      bar.append(b);
      return b;
    });
    box.prepend(bar);
    const info = document.createElement("p");
    info.className = "tab-info";
    box.after(info);
    function select(id, how, push) {
      tabs.forEach((t, i) => {
        const on = t.id === id;
        t.hidden = !on;
        btns[i].setAttribute("aria-selected", on);
      });
      const t = tabs.find((x) => x.id === id);
      if (how === "manual") store.set(key, id);
      if (push) history.replaceState(null, "", "#" + id);
      const howText = { manual: "вкладка выбрана вручную", auto: "вкладка выбрана автоматически", link: "вкладка открыта по ссылке" }[how];
      info.innerHTML = (detect ? `Ваша система: <b>${osNames[sys] || "не определена"}</b>. ` : "") +
        `Открыта «${t.dataset.title || t.id}», ${howText}.`;
    }
    function fromHash() {
      const h = decodeURIComponent(location.hash.slice(1));
      if (!h) return false;
      const t = tabs.find((x) => x.id === h) || tabs.find((x) => x.querySelector("#" + CSS.escape(h)));
      if (!t) return false;
      select(t.id, "link", false);
      if (t.id !== h) document.getElementById(h).scrollIntoView();
      else box.scrollIntoView();
      return true;
    }
    if (!fromHash()) {
      const saved = store.get(key);
      const auto = sys && tabs.find((x) => x.dataset.os === sys);
      if (saved && tabs.some((x) => x.id === saved)) select(saved, "manual", false);
      else if (auto) select(auto.id, "auto", false);
      else select(tabs[0].id, "auto", false);
    }
    window.addEventListener("hashchange", fromHash);
  });

  document.title = (cur.title && cur.path ? cur.title + " — " : "") + "Оркестратор: документация";

  // Таблицы с одинаковой шапкой на странице — одинаковые ширины колонок
  const groups = {};
  document.querySelectorAll("main table").forEach((t) => {
    const head = t.rows[0];
    if (!head || !head.querySelector("th")) return;
    const key = [...head.cells].map((c) => c.textContent.trim()).join("|");
    (groups[key] = groups[key] || []).push(t);
  });
  Object.values(groups).filter((g) => g.length > 1).forEach((g) => {
    const n = g[0].rows[0].cells.length;
    const w = new Array(n).fill(0);
    g.forEach((t) => {
      const cells = [...t.rows[0].cells];
      const total = t.offsetWidth;
      if (!total) return;
      cells.forEach((c, i) => { w[i] = Math.max(w[i], c.offsetWidth / total); });
    });
    const sum = w.reduce((a, b) => a + b, 0);
    if (!sum) return;
    g.forEach((t) => {
      t.style.tableLayout = "fixed";
      const cg = document.createElement("colgroup");
      w.forEach((x) => { const col = document.createElement("col"); col.style.width = (100 * x / sum).toFixed(1) + "%"; cg.append(col); });
      t.prepend(cg);
    });
  });

  // Переключатели «Версия» и «Платформа» вместо строки «Применимо». Выбор общий для сайта, по умолчанию Linux и 1.26.9.
  // Разметка текста: data-only="docker|linux|windows" (можно несколько), data-ver="1.26.7|1.26.9".
  const DIM = {
    platform: { attr: "only", names: { docker: "Docker", linux: "Linux", windows: "Windows Server" }, from: { Docker: "docker", Linux: "linux", Windows: "windows" } },
    ver: { attr: "ver", names: { "1.26.7": "1.26.7 LTS", "1.26.9": "1.26.9" }, from: { "1.26.9": "1.26.9" } },
  };
  Object.entries(DIM).forEach(([dim, d]) => {
    document.querySelectorAll(`main [data-${d.attr}]`).forEach((el) => {
      const tag = document.createElement("span");
      tag.className = "ptag ptag-" + dim;
      tag.textContent = el.dataset[d.attr].split(" ").map((k) => d.names[k] || k).join(" · ");
      const target = el.matches("tr") ? el.cells[0] : (el.querySelector("h2, h3, summary") || el);
      if (el.matches("tr, li, span, p")) target.prepend(tag); else target.append(tag);
    });
  });
  const DEF = { platform: "linux", ver: "1.26.9" };
  const ap = document.querySelector("main .applies");
  if (ap) {
    const spans = [...ap.querySelectorAll(":scope > span")];
    const groups = [];
    const plat = ["linux", "windows", "docker"].filter((k) => spans.some((s) => DIM.platform.from[s.textContent.trim()] === k));
    const verSpan = spans.find((s) => DIM.ver.from[s.textContent.trim()]);
    if (verSpan) groups.push(["ver", "Версия:", ["1.26.7", "1.26.9"]]);
    if (plat.length >= 2) groups.push(["platform", "Платформа:", plat]);
    if (!groups.length) ap.classList.add("static");
    if (groups.length) {
      const box = document.createElement("div");
      box.className = "switches";
      const apply = {};
      groups.forEach(([dim, label, keys]) => {
        const d = DIM[dim];
        const wrap = document.createElement("span");
        wrap.className = "sw";
        wrap.innerHTML = `<span class="sw-l">${label}</span>`;
        const seg = document.createElement("span");
        seg.className = "seg"; seg.setAttribute("role", "group"); seg.setAttribute("aria-label", label);
        const btns = keys.map((k) => [k, d.names[k]]).map(([k, t]) => {
          const bt = document.createElement("button");
          bt.type = "button"; bt.dataset.k = k; bt.textContent = t;
          bt.onclick = () => { try { localStorage.setItem("sw:" + dim, k); } catch (e) {} apply[dim](k); };
          seg.append(bt); return bt;
        });
        wrap.append(seg); box.append(wrap);
        apply[dim] = (p) => {
          const on = keys.includes(p) ? p : keys.includes(DEF[dim]) ? DEF[dim] : keys[0];
          btns.forEach((x) => x.setAttribute("aria-pressed", x.dataset.k === on));
          document.body.dataset[dim] = on;
          if (dim !== "platform") return;
          document.querySelectorAll(".tabs").forEach((tb) => {
            const tabs = [...tb.children].filter((n) => n.matches("section.tab"));
            const bs = [...tb.querySelectorAll(".tab-bar button")];
            const fits = tabs.map((t) => (t.dataset.os || t.id) === on);
            if (!fits.some(Boolean)) { bs.forEach((x) => (x.hidden = false)); return; }
            bs.forEach((x, i) => (x.hidden = !fits[i]));
            const curTab = tabs.findIndex((t) => !t.hidden);
            if (curTab >= 0 && !fits[curTab]) bs[fits.indexOf(true)].click();
          });
        };
      });
      ap.replaceWith(box);
      Object.keys(apply).forEach((dim) => {
        let saved = DEF[dim];
        try { saved = localStorage.getItem("sw:" + dim) || DEF[dim]; } catch (e) {}
        apply[dim](saved);
      });
    }
  }
})();

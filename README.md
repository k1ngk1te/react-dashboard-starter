# 🚀 React Starter Dashboard

A production-ready **React + TypeScript** dashboard starter for building admin panels, analytics apps, and internal tools — fast. Comes with modern tooling, a feature-based structure, reusable hooks, and UI powered by **Ant Design (antd)** and **Tailwind CSS**.

---

## ✨ Key Features

- ✅ **React + TypeScript**
- ✅ **Ant Design (antd)** UI library (pre-built components & patterns)
- ✅ **Tailwind CSS** utility styling
- ⚡ **Vite** for fast dev & build
- 🔁 **React Query** for server state & caching
- ♻️ Feature-based folder structure (components, hooks, pages, store)
- 🔒 Auth-ready architecture (placeholder flows)
- ✅ Pre-configured **ESLint** and **Prettier**
- ♻️ Example hooks & utilities (in `src/hooks/`)
- 🧩 Pagination, modals, tables, forms examples included

---

## 📦 Tech Stack

- React (TypeScript)
- Vite
- Ant Design (antd)
- Tailwind CSS
- React Router
- React Query
- ESLint + Prettier

---

## 🔧 Prerequisites

- Node.js (v16+ recommended)
- npm or yarn

---

## ⛳ Quick Start

```bash
# clone
git clone https://github.com/<your-username>/react-starter-dashboard.git
cd react-starter-dashboard

# install dependencies
npm install
# or
# yarn install

# start dev server
npm run dev
# or
# yarn dev
```

Open [http://localhost:3000](http://localhost:3000) (Vite default port change in the vite.config.ts) in your browser.

---

## 📁 Project Structure (example)

```
src/
 ├── components/            # shared UI components (cards, buttons, etc.)
 ├── hooks/                 # custom hooks (useInfiniteScroll, useDebounce, etc.)
 ├── layout/                # dashboard/layout components
 ├── pages/                 # route-level components
 ├── store/                 # API queries & global store (react-query, contexts)
 ├── services/              # api service wrappers, axios/fetch utils
 ├── styles/                # tailwind/global css
 ├── utils/                 # helpers, date utils, constants
 ├── App.tsx                # app bootstrap (AntD + Tailwind imports)
 └── index.tsx              # entry
```

---

## ⚙️ Environment Variables

Create a `.env` (or `.env.local`) file in project root. Example:

```env
VITE_API_BASE_URL=https://api.example.com
VITE_APP_NAME=React Starter Dashboard
VITE_AUTH_ENABLED=true
```

> All `VITE_` prefixed vars will be exposed to the client code (via `import.meta.env.VITE_...`).

---

## 🧩 Ant Design (antd) Notes

- Ant Design is included as the UI library for components (forms, tables, modals, icons, etc.).
- Import antd styles in your entry file (`src/main.tsx` / `src/main.jsx`):

```ts
// For antd v5:
import 'antd/dist/reset.css';

// or for older antd versions:
import 'antd/dist/antd.css';
```

- If you want theme customization (less variables), use `craco`/`vite-plugin-style-import` or the AntD less theme approach with Vite plugin. (This starter ships with plain CSS/Tailwind integration out-of-the-box.)

---

## 📜 Available Scripts

Run with `npm run <script>` or `yarn <script>`.

| Script    | Description                       |
| --------- | --------------------------------- |
| `dev`     | Start Vite dev server             |
| `build`   | Build production bundle           |
| `preview` | Preview production build locally  |
| `lint`    | Run ESLint                        |
| `format`  | Run Prettier or formatting script |
| `test`    | Run unit tests (if configured)    |

Example:

```bash
npm run dev
npm run build
npm run preview
npm run lint
npm run format
npm test
```

---

## 🧭 Routing & State

- Routes are managed with **React Router** (v6+).
- Server state is recommended via **React Query** (already wired in examples).
- Query params utilities and useful hooks (e.g., `useSearchParams`, `useDebouncedSearchParamInput`) are included in `src/hooks/`.

---

## ✅ Examples & Patterns Included

- Infinite scroll sentinel (`useInfiniteScroll`)
- Debounced search input synced to URL (`useDebouncedSearchParamInput`)
- Auth-ready patterns & contexts
- Pagination + filters example
- File view/download helper hooks
- Reusable components built on the antd library like `Input`, `Form`, and more UI components.

---

## 🛠 Customization Tips

- **Tailwind**: edit `tailwind.config.js` to adjust theme, breakpoints, etc.
- **AntD theme**: if customizing AntD tokens, add a Vite plugin or Less setup to override variables.
- **New pages**: add components under `src/pages` and register them in router.

---

## ✅ Best Practices

- Keep API calls in `src/services/` and call them from `src/store/queries` (React Query).
- Prefer hooks for shared logic (`src/hooks/`).
- Use `prefix` pattern with query param hooks to avoid collisions when reusing hooks across nested components.

---

## 🧾 Contributing

1. Fork the repo
2. Create a feature branch (`git checkout -b feature/xyz`)
3. Make changes, run `npm run lint` and `npm run test`
4. Submit a PR with a clear description

Please follow the code style rules (ESLint & Prettier).

---

## ❗ Troubleshooting

- If UI styles look broken, ensure AntD styles are imported in `src/index.tsx`.
- When using SSR (Next.js), guard any `window` / `localStorage` references with `typeof window !== 'undefined'`.
- For portal/modals with infinite scroll, pass the correct scroll `root` to observers or fallback to `scroll` listeners.

---

## 📄 License

This project is licensed under the **MIT License** — see `LICENSE` for details.

---

## 👨‍💻 Author

Built with ❤️ by **Emmanuel (k1ngk1te)** — [https://github.com/k1ngk1te](https://github.com/k1ngk1te)

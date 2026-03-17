# Features

A full inventory of what's included in this starter.

---

## Authentication

- JWT-based authentication stored in an `httpOnly` cookie
- CSRF double-submit cookie protection on all mutating endpoints
- Automatic CSRF token rotation on login and logout
- Browser auto-refresh fallback if CSRF token is missing
- Automatic logout on `401` responses (via React Query global error handler)
- Automatic CSRF token update on `ERROR_CSRF_100` responses
- Route-level protection via `Authenticated` and `NotAuthenticated` wrappers
- Session verification on app load via `CheckAuth`
- Repository pattern for swappable data sources — mock for demos, real API for production (controlled via `VITE_USE_MOCK`)

---

## Backend (Express)

- TypeScript — fully typed controllers, middleware, and utilities
- Rate limiting — separate limiters for auth and general API routes (configurable via env vars)
- CORS — configurable origin whitelist
- Helmet — HTTP security headers
- Zod — request body validation with proper 400 responses for validation errors
- Startup env validation — throws on missing required vars in production
- Netlify serverless support via `serverless-http`

---

## Frontend

- React 19 with TypeScript strict mode
- Vite 8 — fast dev server with HMR, API proxy to Express
- Path alias (`~/*` → `src/*`) for clean imports
- Ant Design 5 theme customisation via `ConfigProvider` tokens
- Tailwind CSS with custom breakpoints (`xs`, `sm`, `md`, `lg`, `xl`, `2xl`)
- Global alert/notification context
- SplashScreen during initial auth check
- Error boundary page with navigation options

---

## Custom Hooks

| Hook | Description |
|---|---|
| `useDebounce` | Debounces a value with configurable delay (default 1000ms) |
| `useDebouncedSearchParamInput` | Debounced input synced to URL search params |
| `useInfiniteScroll` | IntersectionObserver-based infinite scroll sentinel |
| `useInterval` | Managed interval with play/pause/clear controls |
| `useLocalStorage` | Typed state synced to `localStorage` |
| `useNavigate` | Wraps React Router navigate with `navigate()` and `goBack()` |
| `useOutClick` | Detects clicks outside a target element |
| `usePageFilters` | Comprehensive filter + pagination state manager |
| `usePathname` | Returns the current route pathname |
| `useSearchParams` | URL search param manager with optional prefix support |
| `useViewDownloadFile` | View or download a file by URL with loading state |
| `useExternalViewDownloadFile` | Dynamic URL-based file view/download |

---

## UI Components

All components are wrappers around Ant Design that apply consistent styling and expose a simplified API. Exported from `src/components/controls/` and `src/components/common/`.

### Form & Input

| Component | Description |
|---|---|
| `Form` | Ant Design Form wrapper |
| `Input` | Text input |
| `InputPassword` | Password input with show/hide toggle |
| `Select` | Dropdown select |
| `Checkbox` | Checkbox input |
| `DatePicker` | Date picker |
| `TimePicker` | Time picker |
| `Calendar` | Full calendar |
| `ColorPicker` | Color picker |

### Buttons & Actions

| Component | Description |
|---|---|
| `Button` | Primary/secondary/text button |
| `ButtonDropdown` | Button with dropdown menu |
| `IconButton` | Icon-only button |
| `Link` | Styled anchor/router link |

### Feedback & Overlay

| Component | Description |
|---|---|
| `Alert` | Inline alert banner |
| `Modal` | Dialog/modal |
| `Drawer` | Slide-in panel |
| `Popover` | Floating popover |
| `Popconfirm` | Confirmation popover |
| `Dropdown` | Contextual dropdown menu |
| `Badge` | Status badge |
| `Spin` | Loading spinner |
| `Skeleton` | Skeleton loading placeholder |
| `Progress` | Progress bar |

### Layout & Navigation

| Component | Description |
|---|---|
| `Breadcrumbs` | Breadcrumb trail |
| `Steps` | Step indicator |
| `Tabs` | Tabbed content |
| `Divider` | Horizontal/vertical divider |
| `Carousel` | Image/content carousel |
| `SegmentedControl` | Segmented button group |

### Data Display

| Component | Description |
|---|---|
| `Table` | Data table (powered by TanStack React Table) |
| `Descriptions` | Key-value description list |
| `Image` | Image with preview |
| `Empty` | Empty state placeholder |

### Common / Utility

| Component | Description |
|---|---|
| `Container` | Responsive content container |
| `Portal` | Renders children in a DOM portal |
| `ErrorBoundary` | React error boundary wrapper |
| `SplashScreen` | Full-screen loading state |
| `LoadingScreen` | Centered loading spinner |
| `OverlayLoadingScreen` | Fixed overlay with loading spinner |
| `Title` | Sets the document `<title>` |
| `Dynamic` | Suspense wrapper for lazy-loaded components |
| `FilterDate` | Date range filter control |
| `CopyItem` | Click-to-copy text |
| `DropdownItems` | Reusable dropdown item list |

---

## Utilities

| Utility | Description |
|---|---|
| `AppError` | Custom error class with HTTP status codes |
| `handleAllErrors` | Generic error handler (Axios + AppError) |
| `HttpInstance` | Axios singleton with CSRF/JWT header management |
| `capitalize` / `capitalizeAll` | String capitalisation helpers |
| `truncateText` | Truncate string with ellipsis |
| `generateRandomText` | Generate a random alphanumeric string |
| `getImageUrl` | Resolve base64 or URL image source |
| `createURLSearchParams` | Build a URL query string from an object |
| `classNames` | Conditionally join CSS class names |
| `formatPrice` | Format a number as Nigerian Naira (NGN) |
| `numberShortener` | Shorten large numbers (K, M, B, T) |
| Date utilities | `getDate`, `formatDate`, `getStringedDate`, `getOffsetDate`, and more (via Dayjs) |

---

## Repository Pattern

Services use a repository abstraction to decouple the data source from the rest of the app. Two implementations exist per resource:

| Repository | Behaviour |
|---|---|
| `MockRepository` | Returns hardcoded local data — no external API required. Used for demos and early development. |
| `ApiRepository` | Makes real HTTP calls to the external backend. Activated when the backend is ready. |

A factory in `src/server/repositories/<resource>/index.ts` picks the active implementation based on `VITE_USE_MOCK`:

```ts
export const AuthRepository = USE_MOCK ? new MockAuthRepository() : new ApiAuthRepository();
```

Services (`src/server/services/`) delegate entirely to the repository, so queries and components are never aware of which implementation is running.

**Switching to the real backend:**
1. Set `VITE_USE_MOCK=0` in `.env`
2. Set `VITE_API_URL` to your backend base URL
3. Update the serializer (`src/server/serializers/`) if the API response shape differs from `ApiLoginResponseType`

**Adding a repository for a new resource:**
1. Create `src/server/repositories/<resource>/<resource>.type.ts` — define the contract
2. Create `mock.repository.ts` and `api.repository.ts` implementing it
3. Create `index.ts` — export the active implementation via the factory
4. Slim the service down to delegate to the repository

---

## TypeScript

- Strict mode enabled across all configs
- `noUnusedLocals` and `noUnusedParameters` enforced
- Shared generic types: `ResponseType<T>`, `PaginatedResponseType<T>`, `MutationOptionsType<T, U>`
- Separate tsconfig files for app, node (vite config), and server
- Server compiled to plain JS via `tsconfig.server.build.json`

# Mizan V2

**Mizan** is a web application developed for **Bijouterie Al Andalous**, a jewellery shop located in Nador, Morocco. It provides a centralized dashboard for monitoring gold and silver market prices and managing a product catalogue.

The application is a learning project focused on JavaScript fundamentals, API integration, asynchronous programming, CRUD operations, and browser storage.

## Technologies

| Technology | Role |
|---|---|
| HTML | Page structure and semantic markup |
| [Tailwind CSS](https://tailwindcss.com/) v4 | Utility-first styling (built with `@tailwindcss/cli`) |
| Vanilla JavaScript (ES modules) | Application logic, DOM manipulation, async data fetching |
| [JSON Server](https://github.com/typicode/json-server) | Local mock REST API for the product catalogue |
| [Font Awesome](https://fontawesome.com/) 6.7 | Icons (loaded from CDN) |
| `localStorage` | Persistent browser storage for currency preference, filters, and favourite products |
| [XAUS API](https://xaus.com/api/) | External precious-metals market data |

## Features

### Market Dashboard (`index.html`)

- **Current gold and silver prices** — Displays up-to-date spot prices per gram in the selected currency.
- **Currency selection** — Switch between MAD, USD, and EUR. The selected currency is persisted in `localStorage`.
- **Price change indicators** — Shows the absolute and percentage price change compared to the previous trading day, with colour-coded up/down arrows.
- **Historical price charts** — SVG line charts rendered from historical closing prices, with 7-day and 30-day range selectors for both gold and silver.
- **Jewellery value estimator** — Calculates an estimated value based on a weight input (grams) and the current metal price.
- **Refresh** — Manual refresh button to re-fetch market data on demand.

### Product Catalogue (`catalogue.html`)

- **Display products** — Lists all products fetched from JSON Server, rendered using an HTML `<template>`.
- **Add a product** — Opens a modal dialog form to create a new product (title, description, price, category, status).
- **Edit a product** — Pre-fills the dialog form with the selected product's data and updates it via PATCH.
- **Delete a product** — Removes a product from the server.
- **Search by title** — Real-time text search that filters products as the user types.
- **Filter by status** — Filter products by *disponible*, *réservé*, or *vendu*.
- **Filter by category** — Filter products by *bijoux*, *lingot*, or *pièce*.
- **Sort products** — Sort by title (A–Z / Z–A), price (ascending / descending), or date (newest / oldest).
- **Favourite products** — Toggle a bookmark on any product. Favourites are stored in `localStorage` and can be filtered to show only bookmarked items.
- **Reset filters** — A single button clears all active search, filter, and sort selections.
- **Filter persistence** — Active filter and sort settings are saved to `localStorage` and restored on page load.
- **Input validation** — Title (3–80 characters, letters only), description (minimum 10 characters), and price are validated on blur and on submit, with inline error messages.
- **Loading state** — A loading indicator is displayed while products are being fetched.
- **Empty catalogue state** — A dedicated message is shown when the catalogue has no products.
- **Empty search state** — A message appears when no products match the current filters.
- **Network error state** — Displayed when the connection to JSON Server fails.
- **General error state** — A fallback message for unexpected errors.

## API Management

All HTTP requests pass through a centralized `request()` function in [`js/services/api.js`](file:///c:/Users/ouhsa/Projects/Mizan%20v2/js/services/api.js).

This function is responsible for:

| Concern | Implementation |
|---|---|
| HTTP requests | Uses the Fetch API with configurable options (method, headers, body) |
| Timeout | Creates an `AbortController` that aborts the request after **8 seconds** |
| Response parsing | Reads the response as text, returns `null` for empty responses, otherwise parses JSON |
| HTTP errors | Throws an error with `type: "http"` and the response `status` code for non-OK responses |
| Network errors | Catches `TypeError` and tags it with `type: "network"` |
| Parse errors | Catches `SyntaxError` and tags it with `type: "parse"` |
| Timeout errors | Catches `AbortError` and tags it with `type: "timeout"` |
| Cleanup | Clears the timeout in a `finally` block regardless of outcome |

Every error thrown by `request()` carries a normalized `type` property (`"http"`, `"network"`, `"parse"`, or `"timeout"`) and a `status` property (`null` for non-HTTP errors), allowing callers to handle each category consistently.

## APIs and Data Sources

### External Metals API — XAUS

**Base URL:** `https://xaus.com/api/v1`

The API serves data through standard HTTP GET requests and does not require an API key.

| Endpoint | Description |
|---|---|
| `/spot?currency={CUR}&unit=gram` | Returns the current gold spot price (`xau.price`, `xau.currency`), silver price per troy ounce in USD (`silver_usd_oz`), and the exchange rate (`fx_rate`) between USD and the requested currency. |
| `/chart?symbol={SYMBOL}&range=5d` | Returns the last 5 trading days of historical data. Used internally to calculate the previous-day closing price for price change indicators. |
| `/chart?symbol={SYMBOL}&range=1mo&interval=1d` | Returns one month of daily historical data points (timestamp `t`, close price `c`). Used to render historical price charts. |

**Symbols used:** `xau` (gold), `silver`.  
**Currencies supported:** `MAD`, `USD`, `EUR`.

Prices from the XAUS API are in USD per troy ounce. The application converts them to the selected currency per gram using the `fx_rate` and dividing by 31.1035 (troy ounce to gram).

### Local JSON Server

**Base URL:** `http://localhost:3001`

| Endpoint | Methods | Description |
|---|---|---|
| `/products` | GET, POST | List all products or create a new product |
| `/products/:id` | GET, PUT, PATCH, DELETE | Retrieve, replace, update, or delete a product by ID |

JSON Server reads from and writes to [`db.json`](file:///c:/Users/ouhsa/Projects/Mizan%20v2/db.json) at the project root. It acts as a mock REST API for development and is not intended for production use.

**Product schema:**

```json
{
  "id": "1",
  "title": "Bague en or 18 carats",
  "description": "Bague élégante en or jaune 18 carats",
  "price": 2000,
  "category": "bijoux",
  "status": "disponible",
  "createdAt": "2026-11-10"
}
```

## HTTP Methods: PUT vs PATCH

The catalogue service uses all five standard HTTP methods. Each serves a different purpose:

| Method | Purpose | Catalogue Service Function |
|---|---|---|
| **GET** | Retrieve one or all products | `getProducts()`, `getProductById(id)` |
| **POST** | Create a new product | `addProductToStorage(product)` |
| **PUT** | Completely replace an existing product | `replaceProduct(product, id)` |
| **PATCH** | Modify only selected properties of a product | `updateProductInStorage(data, id)` |
| **DELETE** | Remove a product | `deleteProductFromStorage(id)` |

### PUT — Full Replacement

PUT sends a complete product object. The server replaces the entire resource with the request body.

```js
// replaceProduct() sends the full object — every field must be present
const options = {
  method: 'PUT',
  headers: { 'content-type': 'application/json' },
  body: JSON.stringify({
    title: "Bague en or 18 carats",
    description: "Bague élégante en or jaune 18 carats",
    price: 2200,
    category: "bijoux",
    status: "disponible",
    createdAt: "2026-11-10"
  })
}
// PUT /products/1
```

If a field is omitted from the PUT body, it is removed from the resource.

### PATCH — Partial Update

PATCH sends only the fields that need to change. All other fields are preserved.

```js
// updateProductInStorage() sends only what changed
const options = {
  method: 'PATCH',
  headers: { 'content-type': 'application/json' },
  body: JSON.stringify({
    price: 2200,
    status: "vendu"
  })
}
// PATCH /products/1  →  only price and status are updated
```

### Idempotency

- **GET** is safe and idempotent — it does not modify server state.
- **PUT** is idempotent — sending the same full replacement repeatedly produces the same final state.
- **DELETE** is idempotent — deleting the same resource again results in the same outcome (the resource no longer exists).
- **POST** is **not** idempotent — each call creates a new resource with a new ID.
- **PATCH** idempotency **depends on the operation**. Setting a field to an absolute value (e.g., `{ "price": 2200 }`) is idempotent. An operation that increments a value would not be, though this application uses only absolute value patches.

## Project Structure

```
Mizan v2/
├── css/
│   ├── input.css              # Tailwind source stylesheet
│   └── output.css             # Compiled Tailwind CSS
├── images/                    # UI state illustrations
│   ├── empty-catalogue-icon.png
│   ├── empty-search-icon.png
│   ├── error-icon.png
│   ├── loading-icon.png
│   ├── network-failed-icon.png
│   └── products-images-placeholder.jpg
├── js/
│   ├── services/
│   │   ├── api.js             # Centralized request function, base URLs
│   │   ├── catalogue-service.js  # CRUD operations for products (JSON Server)
│   │   └── metals-service.js  # Gold/silver data fetching (XAUS API)
│   ├── filters/
│   │   ├── filter.js          # Filter by title, status, category, favourites
│   │   └── sort.js            # Sort by date, title, price
│   ├── render/
│   │   ├── render.js          # Page initialization, data loading orchestration
│   │   ├── render-metals.js   # Metal price card rendering, last-update label
│   │   ├── render-products.js # Product card rendering, form dialog, validation UI
│   │   └── render-filters.js  # Applies active filters and sorts to product list
│   ├── app.js                 # Market dashboard entry point (index.html)
│   ├── catalogue.js           # Catalogue entry point (catalogue.html)
│   ├── calculator.js          # Jewellery value estimation (weight × price)
│   ├── charts.js              # SVG line chart coordinate calculation and rendering
│   ├── state.js               # Centralized application state object
│   ├── storage.js             # localStorage read/write, state management helpers
│   └── validations.js         # Input validation (title, description, price)
├── src/
│   └── icons/
│       └── Gold Scales and Bullion Icon.ico
├── index.html                 # Market dashboard page
├── catalogue.html             # Product catalogue page
├── db.json                    # JSON Server database file
├── package.json               # Project dependencies and scripts
└── package-lock.json
```

### Module Responsibilities

| Module | Responsibility |
|---|---|
| `js/services/api.js` | Centralized `request()` function with timeout, error normalization, and JSON parsing. Exports base URLs for the XAUS API and JSON Server. |
| `js/services/metals-service.js` | Fetches gold and silver spot prices and historical data from the XAUS API. Converts prices to the selected currency per gram. |
| `js/services/catalogue-service.js` | Provides CRUD functions (GET, POST, PUT, PATCH, DELETE) for the product resource through JSON Server. |
| `js/state.js` | Exports a single `state` object holding products, favourite IDs, filters, loading/error flags, currency, and current metal prices. |
| `js/storage.js` | Reads from and writes to `localStorage` (currency, filters, favourites). Contains helper functions for updating state (products, prices, filters). |
| `js/render/render.js` | Orchestrates page rendering: initializes the market dashboard and catalogue pages, loads data, and coordinates UI updates. |
| `js/render/render-metals.js` | Renders metal price cards from a template and updates the last-updated timestamp. |
| `js/render/render-products.js` | Renders product cards from a template, manages the add/edit dialog, runs form validation, and handles product submission. |
| `js/render/render-filters.js` | Applies the active combination of search, status filter, category filter, favourites filter, and sort to the product list. |
| `js/filters/filter.js` | Pure filter functions: by title (case-insensitive substring match), by status, by category, and by favourites. |
| `js/filters/sort.js` | Pure sort functions: by date, by title (locale-aware), and by price. |
| `js/charts.js` | Calculates SVG coordinates for line charts and renders polylines with data point circles. |
| `js/calculator.js` | Computes estimated jewellery value given a weight and a price per gram. |
| `js/validations.js` | Validates product title (3–80 characters, Unicode letters), description (minimum 10 characters), and price (non-negative number). |
| `js/app.js` | Entry point for `index.html`. Sets up event listeners for currency selection, price refresh, weight estimation, and history range buttons. |
| `js/catalogue.js` | Entry point for `catalogue.html`. Sets up event listeners for product CRUD, search, filters, sort, favourites, and filter reset. |

## Installation and Execution

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or later recommended)
- npm (included with Node.js)

### Setup

```bash
# Clone the repository
git clone <repository-url>
cd mizan-v2

# Install dependencies
npm install
```

### Start JSON Server

JSON Server must be running for all catalogue operations (listing, adding, editing, deleting products) to work.

```bash
npm run mock-api
```

This starts JSON Server on **port 3001**, serving the data from `db.json`.

### Start the Frontend

Open `index.html` directly in a browser, or use any local development server. For example, with the VS Code [Live Server](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer) extension, right-click `index.html` and select **Open with Live Server**.

### Access the Application

| Page | URL |
|---|---|
| Market Dashboard | `http://localhost:5500/index.html` (port depends on your dev server) |
| Product Catalogue | `http://localhost:5500/catalogue.html` |

> **Note:** The market dashboard (prices, charts, estimator) works independently of JSON Server, as it fetches data from the external XAUS API. The product catalogue requires JSON Server to be running.

## License

This project is developed for Bijouterie Al Andalous, Nador, Morocco.

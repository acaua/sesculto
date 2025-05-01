# Sesculto

[![Deploy with Cloudflare](https://img.shields.io/badge/Cloudflare-Deploy-F38020?logo=cloudflare)](https://developers.cloudflare.com/workers/)
[![Built with Astro](https://img.shields.io/badge/Astro-Built-FF5D01?logo=astro)](https://astro.build)
[![UI Components](https://img.shields.io/badge/UI-shadcn/ui-000000)](https://ui.shadcn.com/)
[![Package Manager](https://img.shields.io/badge/PNPM-Package_Manager-F69220?logo=pnpm)](https://pnpm.io/)

Sesculto is a modern web application that provides an enhanced browsing experience for SESC São Paulo cultural events. It fetches event data from the official SESC API, processes it, and presents it in a user-friendly interface with powerful search and filtering capabilities.

**Live site**: [sesculto.acaua.dev](https://sesculto.acaua.dev)

## Features

- 🔍 **Search Events**: Easily search for events by title and description
- 🏢 **Filter by Branch**: Filter events by SESC branches, grouped by region (capital, interior, litoral)
- 🏷️ **Filter by Category**: Find events by their cultural category
- ⌨️ **Keyboard Shortcuts**: Use Cmd+K / Ctrl+K to quickly access search
- 🔄 **Infinite Scrolling**: Browse events with smooth infinite scrolling
- 📱 **Responsive Design**: Works across all device sizes
- ⚡ **Fast Performance**: Built with performance in mind, runs on Cloudflare's edge network

## Tech Stack

- **Framework**: [Astro](https://astro.build) with [React](https://react.dev/) islands
- **UI Components**: [shadcn/ui](https://ui.shadcn.com/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Data Fetching**: [TanStack Query](https://tanstack.com/query)
- **Search**: [Fuse.js](https://fusejs.io/) for fuzzy searching
- **Package Manager**: [pnpm](https://pnpm.io/)
- **Deployment**: [Cloudflare Workers](https://workers.cloudflare.com/)
- **Storage**: [Cloudflare R2](https://developers.cloudflare.com/r2/) for JSON data

## Architecture

The application follows a hybrid rendering approach:

1. **Frontend**: An Astro site with React components for interactive elements
2. **Data Pipeline**:
   - Scheduled Cloudflare Workers fetch data from the SESC API
   - The data is processed and stored in a public R2 bucket as JSON files
   - The frontend fetches this pre-processed data from R2

### Cron Jobs

Two scheduled functions maintain the data:

- **Events & Categories Update**: Runs hourly (`2 * * * *`)
- **Branches Update**: Runs weekly on Mondays (`1 * * * 1`)

## Development

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or later)
- [pnpm](https://pnpm.io/) package manager
- [Wrangler](https://developers.cloudflare.com/workers/wrangler/) for Cloudflare Workers development

### Setup

1. Clone the repository:

   ```bash
   git clone https://github.com/YOUR_USERNAME/sesculto.git
   cd sesculto
   ```

2. Install dependencies:

   ```bash
   pnpm install
   ```

3. Start the development server:

   ```bash
   pnpm dev
   ```

4. Open [http://localhost:4321](http://localhost:4321) in your browser

### Adding new shadcn/ui components

```bash
pnpm dlx shadcn@canary add <component-name>
```

### Preview production build locally

```bash
pnpm preview
```

## Deployment

The project is deployed to Cloudflare Workers:

```bash
pnpm deploy
```

This command builds the Astro site and deploys it to Cloudflare Workers.

## Project Structure

```
sesculto/
├── src/
│   ├── api/           # API clients (events, categories, branches)
│   ├── cloudflare/    # Cloudflare Worker functions and scheduled jobs
│   ├── components/    # React components
│   ├── hooks/         # Custom React hooks
│   ├── layouts/       # Astro layouts
│   ├── lib/           # Utility functions
│   ├── pages/         # Astro pages
│   └── styles/        # Global CSS
├── public/            # Static assets
├── astro.config.mjs   # Astro configuration
├── tailwind.config.js # Tailwind configuration
├── wrangler.jsonc     # Cloudflare Workers configuration
└── ...                # Other configuration files
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the GNU General Public License v3.0 (GPLv3) - see the LICENSE file for details.

## Acknowledgements

- [SESC São Paulo](https://www.sescsp.org.br/) for the events data
- All the open source libraries and tools used in this project

---

Built with ❤️, and ☕

## SESC, please don't sue me

This is an open source project created as a gift to the SESC community. Sesculto is developed independently with the sole purpose of making it easier for people to discover and enjoy the amazing cultural programming that SESC São Paulo offers. No commercial interests are involved - this is simply a labor of love and appreciation for SESC's cultural contribution to society. All event data is sourced from SESC's public API, and proper attribution is given. If there are any concerns, please reach out before taking legal action.

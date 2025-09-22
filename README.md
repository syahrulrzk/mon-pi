# 🚀 MON-PI - Monitoring API Dashboard

MON-PI adalah aplikasi modern untuk memantau performa API dan layanan secara real-time.
Dibangun menggunakan Next.js, TailwindCSS, dan Recharts tanpa database tambahan sehingga ringan, cepat, dan mudah digunakan.

### ✨ Fitur Utama

- **✅ Status Dashboard: Tampilkan status API, uptime, dan health check
- **📊 Performance Chart: Grafik performa 24 jam, 7 hari, dan 30 hari
- **⚡ Realtime Monitoring: Auto-refresh setiap 30 detik untuk update status server
- **🌗 Dark/Light Mode: Tema otomatis dengan dukungan Next Themes
- **🔔 Error Tracking: Tampilkan error rate dan response time API
- **📈 Statistik Lengkap: Jumlah request, rata-rata response time, dan error ratio


### 🛠️ Teknologi

- ** ⚡ Next.js 15 - Framework React untuk produksi
- ** 📘 TypeScript - Menjamin type-safety
- ** 🎨 Tailwind CSS - Styling cepat dan responsif
- ** 🧩 shadcn/ui - Komponen modern berbasis Radix UI
- ** 📊 Recharts - Grafik interaktif untuk analitik performa
- ** 🌗 Next Themes - Dark/light mode otomatis

### 🚀 Quick Start

```bash
# Clone repo
git clone https://github.com/syahrulrzk/mon-pi.git
cd mon-pi

# Install dependencies
npm install

# Jalankan mode development
npm run dev

# Build untuk production
npm run build
npm start

```

Buka http://localhost:3000 untuk melihat dashboard.


### 📊 Tampilan Dashboard

- System Health: Menunjukkan persentase uptime layanan
- Total Requests: Jumlah total request API
- Error Rate: Persentase error dari semua request
- Avg Response Time: Rata-rata waktu respon API
- Performance Chart: Grafik interaktif untuk monitoring performa


### 📂 Struktur Project

```bash
src/
├── app/                 # Routing Next.js App Router
├── components/          # Reusable React components
│   └── ui/              # shadcn/ui components
├── lib/                 # Utility functions
├── hooks/               # Custom hooks
└── charts/              # Recharts configuration

```

### 🎯 Kenapa MON-PI?

- 🏎️ Ringan & Cepat - Tidak perlu database
- 🔎 Real-time Insight - Monitoring dengan auto refresh
- 🎨 UI Modern - Tampilan dashboard profesional
- 🌍 Open Source - Bisa dikustomisasi sesuai kebutuhan


### ❤️ Kontribusi
Proyek ini open source, silakan fork, pull request, atau laporkan issue di GitHub.

📌 100% Dibangun dengan ai ❤️ oleh Z.ai











# 🚀 Welcome to MON-PI 

A modern, production-ready web application monitoring

## ✨ Technology Stack

This scaffold provides a robust foundation built with:

### 🎯 Core Framework
- **⚡ Next.js 15** - The React framework for production with App Router
- **📘 TypeScript 5** - Type-safe JavaScript for better developer experience
- **🎨 Tailwind CSS 4** - Utility-first CSS framework for rapid UI development

### 🧩 UI Components & Styling
- **🧩 shadcn/ui** - High-quality, accessible components built on Radix UI
- **🎯 Lucide React** - Beautiful & consistent icon library
- **🌈 Framer Motion** - Production-ready motion library for React
- **🎨 Next Themes** - Perfect dark mode in 2 lines of code

### 📋 Forms & Validation
- **🎣 React Hook Form** - Performant forms with easy validation
- **✅ Zod** - TypeScript-first schema validation

### 🔄 State Management & Data Fetching
- **🐻 Zustand** - Simple, scalable state management
- **🔄 TanStack Query** - Powerful data synchronization for React
- **🌐 Axios** - Promise-based HTTP client

### 🗄️ Database & Backend
- **🗄️ Prisma** - Next-generation Node.js and TypeScript ORM
- **🔐 NextAuth.js** - Complete open-source authentication solution

### 🎨 Advanced UI Features
- **📊 TanStack Table** - Headless UI for building tables and datagrids
- **🖱️ DND Kit** - Modern drag and drop toolkit for React
- **📊 Recharts** - Redefined chart library built with React and D3
- **🖼️ Sharp** - High performance image processing

### 🌍 Internationalization & Utilities
- **🌍 Next Intl** - Internationalization library for Next.js
- **📅 Date-fns** - Modern JavaScript date utility library
- **🪝 ReactUse** - Collection of essential React hooks for modern development

## 🎯 Why This Scaffold?

- **🏎️ Fast Development** - Pre-configured tooling and best practices
- **🎨 Beautiful UI** - Complete shadcn/ui component library with advanced interactions
- **🔒 Type Safety** - Full TypeScript configuration with Zod validation
- **📱 Responsive** - Mobile-first design principles with smooth animations
- **🗄️ Database Ready** - Prisma ORM configured for rapid backend development
- **🔐 Auth Included** - NextAuth.js for secure authentication flows
- **📊 Data Visualization** - Charts, tables, and drag-and-drop functionality
- **🌍 i18n Ready** - Multi-language support with Next Intl
- **🚀 Production Ready** - Optimized build and deployment settings
- **🤖 AI-Friendly** - Structured codebase perfect for AI assistance

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

Open [http://localhost:3000](http://localhost:3000) to see your application running.

## 🤖 Powered by Z.ai

This scaffold is optimized for use with [Z.ai](https://chat.z.ai) - your AI assistant for:

- **💻 Code Generation** - Generate components, pages, and features instantly
- **🎨 UI Development** - Create beautiful interfaces with AI assistance  
- **🔧 Bug Fixing** - Identify and resolve issues with intelligent suggestions
- **📝 Documentation** - Auto-generate comprehensive documentation
- **🚀 Optimization** - Performance improvements and best practices

Ready to build something amazing? Start chatting with Z.ai at [chat.z.ai](https://chat.z.ai) and experience the future of AI-powered development!

## 📁 Project Structure

```
src/
├── app/                 # Next.js App Router pages
├── components/          # Reusable React components
│   └── ui/             # shadcn/ui components
├── hooks/              # Custom React hooks
└── lib/                # Utility functions and configurations
```

## 🎨 Available Features & Components

This scaffold includes a comprehensive set of modern web development tools:

### 🧩 UI Components (shadcn/ui)
- **Layout**: Card, Separator, Aspect Ratio, Resizable Panels
- **Forms**: Input, Textarea, Select, Checkbox, Radio Group, Switch
- **Feedback**: Alert, Toast (Sonner), Progress, Skeleton
- **Navigation**: Breadcrumb, Menubar, Navigation Menu, Pagination
- **Overlay**: Dialog, Sheet, Popover, Tooltip, Hover Card
- **Data Display**: Badge, Avatar, Calendar

### 📊 Advanced Data Features
- **Tables**: Powerful data tables with sorting, filtering, pagination (TanStack Table)
- **Charts**: Beautiful visualizations with Recharts
- **Forms**: Type-safe forms with React Hook Form + Zod validation

### 🎨 Interactive Features
- **Animations**: Smooth micro-interactions with Framer Motion
- **Drag & Drop**: Modern drag-and-drop functionality with DND Kit
- **Theme Switching**: Built-in dark/light mode support

### 🔐 Backend Integration
- **Authentication**: Ready-to-use auth flows with NextAuth.js
- **Database**: Type-safe database operations with Prisma
- **API Client**: HTTP requests with Axios + TanStack Query
- **State Management**: Simple and scalable with Zustand

### 🌍 Production Features
- **Internationalization**: Multi-language support with Next Intl
- **Image Optimization**: Automatic image processing with Sharp
- **Type Safety**: End-to-end TypeScript with Zod validation
- **Essential Hooks**: 100+ useful React hooks with ReactUse for common patterns

## 🤝 Get Started with Z.ai

1. **Clone this scaffold** to jumpstart your project
2. **Visit [chat.z.ai](https://chat.z.ai)** to access your AI coding assistant
3. **Start building** with intelligent code generation and assistance
4. **Deploy with confidence** using the production-ready setup

---

Built with ❤️ for the developer community. Supercharged by [Z.ai](https://chat.z.ai) 🚀

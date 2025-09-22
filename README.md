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

Built with ❤️ for the developer community. Supercharged by [Z.ai](https://chat.z.ai) 🚀

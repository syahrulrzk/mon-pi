# API Monitoring Dashboard - Panduan Instalasi Server

## Prasyarat Server

Sebelum menginstal, pastikan server Anda memiliki:
- Node.js (v18 atau lebih tinggi)
- npm atau yarn
- Git (untuk clone repository)

## Cara 1: Instalasi Manual

### 1. Clone Repository
```bash
git clone <repository-url>
cd api-monitoring-dashboard
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Build untuk Produksi
```bash
npm run build
```

### 4. Jalankan Aplikasi
```bash
npm start
```

Aplikasi akan berjalan di http://localhost:3000

## Cara 2: Instalasi dengan PM2 (Disarankan untuk Produksi)

### 1. Install PM2 secara global
```bash
npm install -g pm2
```

### 2. Clone Repository
```bash
git clone <repository-url>
cd api-monitoring-dashboard
```

### 3. Install Dependencies
```bash
npm install
```

### 4. Build untuk Produksi
```bash
npm run build
```

### 5. Buat konfigurasi PM2
Buat file `ecosystem.config.js`:
```javascript
module.exports = {
  apps: [{
    name: 'api-monitoring-dashboard',
    script: 'npm',
    args: 'start',
    cwd: './',
    instances: 'max',
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    },
    error_file: './logs/err.log',
    out_file: './logs/out.log',
    log_file: './logs/combined.log',
    time: true
  }]
};
```

### 6. Jalankan dengan PM2
```bash
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

## Cara 3: Menggunakan Docker

### 1. Buat Dockerfile
```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
```

### 2. Buat docker-compose.yml
```yaml
version: '3.8'
services:
  api-monitor:
    build: .
    ports:
      - "3000:3000"
    restart: unless-stopped
    environment:
      - NODE_ENV=production
```

### 3. Jalankan dengan Docker
```bash
docker-compose up -d
```

## Konfigurasi Nginx (Opsional)

### 1. Install Nginx
```bash
# Ubuntu/Debian
sudo apt update
sudo apt install nginx

# CentOS/RHEL
sudo yum install epel-release
sudo yum install nginx
```

### 2. Buat konfigurasi Nginx
```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### 3. Aktifkan konfigurasi
```bash
sudo ln -s /etc/nginx/sites-available/your-config /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

## Konfigurasi Firewall

### Ubuntu/Debian (UFW)
```bash
sudo ufw allow 22/tcp
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw enable
```

### CentOS/RHEL (Firewalld)
```bash
sudo firewall-cmd --permanent --add-service=ssh
sudo firewall-cmd --permanent --add-service=http
sudo firewall-cmd --permanent --add-service=https
sudo firewall-cmd --reload
```

## Monitoring dan Maintenance

### Cek status PM2
```bash
pm2 status
pm2 logs api-monitoring-dashboard
```

### Restart aplikasi
```bash
pm2 restart api-monitoring-dashboard
```

### Update aplikasi
```bash
git pull origin main
npm install
npm run build
pm2 restart api-monitoring-dashboard
```

### Backup
```bash
# Backup database (jika ada)
# Backup konfigurasi
cp -r /path/to/api-monitoring-dashboard /backup/location/
```

## Troubleshooting

### Port 3000 sudah digunakan
```bash
# Cek proses yang menggunakan port 3000
lsof -i :3000
# Kill proses
kill -9 <PID>
```

### Permission issues
```bash
# Berikan permission yang tepat
chmod +x *.sh
chown -R user:user /path/to/api-monitoring-dashboard
```

### Memory issues
```bash
# Cek memory usage
pm2 monit
# Atur memory limit di ecosystem.config.js
max_memory_restart: '1G'
```

## SSL/HTTPS (Opsional)

### Menggunakan Let's Encrypt
```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx

# Dapatkan sertifikat
sudo certbot --nginx -d your-domain.com

# Auto-renewal
sudo crontab -e
# Tambahkan: 0 12 * * * /usr/bin/certbot renew --quiet
```

## Environment Variables

Buat file `.env.production`:
```env
NODE_ENV=production
PORT=3000
# Tambahkan environment variables lainnya jika diperlukan
```

## Script Instalasi Otomatis

Saya juga akan membuat script instalasi otomatis untuk mempermudah proses deployment di server Anda.
#!/bin/bash

# API Monitoring Dashboard - Auto Installation Script
# This script will automatically install and configure the API Monitoring Dashboard

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Configuration
APP_NAME="api-monitoring-dashboard"
APP_PORT=3000
APP_DIR="/opt/$APP_NAME"
SERVICE_USER="api-monitor"
NODE_VERSION="18"

# Print colored output
print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if running as root
if [[ $EUID -ne 0 ]]; then
   print_error "This script must be run as root"
   exit 1
fi

# Function to install Node.js
install_nodejs() {
    print_status "Installing Node.js $NODE_VERSION..."
    
    # Check if Node.js is already installed
    if command -v node &> /dev/null; then
        NODE_CURRENT_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
        if [ "$NODE_CURRENT_VERSION" -ge "$NODE_VERSION" ]; then
            print_status "Node.js is already installed with version $(node -v)"
            return
        fi
    fi
    
    # Install Node.js using NodeSource repository
    curl -fsSL https://deb.nodesource.com/setup_${NODE_VERSION}.x | bash -
    apt-get install -y nodejs
    
    print_status "Node.js $(node -v) installed successfully"
}

# Function to install PM2
install_pm2() {
    print_status "Installing PM2..."
    npm install -g pm2
    print_status "PM2 installed successfully"
}

# Function to create service user
create_service_user() {
    print_status "Creating service user..."
    
    if ! id "$SERVICE_USER" &>/dev/null; then
        useradd -r -s /bin/false -d "$APP_DIR" "$SERVICE_USER"
        print_status "Service user '$SERVICE_USER' created"
    else
        print_warning "Service user '$SERVICE_USER' already exists"
    fi
}

# Function to create application directory
create_app_directory() {
    print_status "Creating application directory..."
    
    mkdir -p "$APP_DIR"
    mkdir -p "$APP_DIR/logs"
    print_status "Application directory created at $APP_DIR"
}

# Function to setup application files
setup_application() {
    print_status "Setting up application files..."
    
    # Copy application files (assuming they are in the current directory)
    cp -r . "$APP_DIR/"
    cd "$APP_DIR"
    
    # Install dependencies
    print_status "Installing Node.js dependencies..."
    npm ci --only=production
    
    # Build application
    print_status "Building application..."
    npm run build
    
    # Set permissions
    chown -R "$SERVICE_USER:$SERVICE_USER" "$APP_DIR"
    chmod +x "$APP_DIR"
    
    print_status "Application setup completed"
}

# Function to create PM2 ecosystem configuration
create_pm2_config() {
    print_status "Creating PM2 ecosystem configuration..."
    
    cat > "$APP_DIR/ecosystem.config.js" << EOF
module.exports = {
  apps: [{
    name: '$APP_NAME',
    script: 'npm',
    args: 'start',
    cwd: '$APP_DIR',
    instances: 'max',
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production',
      PORT: $APP_PORT
    },
    error_file: './logs/err.log',
    out_file: './logs/out.log',
    log_file: './logs/combined.log',
    time: true,
    max_memory_restart: '1G',
    watch: false,
    merge_logs: true
  }]
};
EOF
    
    print_status "PM2 ecosystem configuration created"
}

# Function to configure systemd service
configure_systemd() {
    print_status "Configuring systemd service..."
    
    cat > "/etc/systemd/system/$APP_NAME.service" << EOF
[Unit]
Description=API Monitoring Dashboard
After=network.target

[Service]
Type=forking
User=$SERVICE_USER
Group=$SERVICE_USER
WorkingDirectory=$APP_DIR
Environment=PATH=/usr/bin:/usr/local/bin
Environment=NODE_ENV=production
Environment=PORT=$APP_PORT
ExecStart=$(which pm2) start ecosystem.config.js
ExecReload=$(which pm2) reload $APP_NAME
ExecStop=$(which pm2) stop $APP_NAME
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target
EOF
    
    systemctl daemon-reload
    systemctl enable "$APP_NAME"
    
    print_status "Systemd service configured"
}

# Function to configure firewall
configure_firewall() {
    print_status "Configuring firewall..."
    
    # Check if UFW is available
    if command -v ufw &> /dev/null; then
        ufw allow "$APP_PORT/tcp"
        print_status "Firewall configured with UFW"
    elif command -v firewall-cmd &> /dev/null; then
        firewall-cmd --permanent --add-port="$APP_PORT/tcp"
        firewall-cmd --reload
        print_status "Firewall configured with firewalld"
    else
        print_warning "No firewall manager found. Please configure firewall manually"
    fi
}

# Function to start application
start_application() {
    print_status "Starting application..."
    
    cd "$APP_DIR"
    
    # Start with PM2
    pm2 start ecosystem.config.js
    pm2 save
    
    # Configure PM2 to start on boot
    pm2 startup systemd -u "$SERVICE_USER" --hp "$APP_DIR"
    
    # Start systemd service
    systemctl start "$APP_NAME"
    
    print_status "Application started successfully"
}

# Function to display status
display_status() {
    print_status "Installation completed successfully!"
    echo
    echo "Application Information:"
    echo "  Name: $APP_NAME"
    echo "  Port: $APP_PORT"
    echo "  Directory: $APP_DIR"
    echo "  URL: http://localhost:$APP_PORT"
    echo
    echo "Useful Commands:"
    echo "  Check status: pm2 status"
    echo "  View logs: pm2 logs $APP_NAME"
    echo "  Restart: pm2 restart $APP_NAME"
    echo "  Stop: pm2 stop $APP_NAME"
    echo "  Systemd: systemctl status $APP_NAME"
    echo
    print_warning "Please remember to:"
    echo "  1. Configure your domain name if needed"
    echo "  2. Set up SSL/TLS certificates for HTTPS"
    echo "  3. Configure Nginx reverse proxy if needed"
}

# Main installation process
main() {
    print_status "Starting API Monitoring Dashboard installation..."
    
    # Update system
    print_status "Updating system packages..."
    apt-get update
    apt-get upgrade -y
    
    # Install dependencies
    install_nodejs
    install_pm2
    
    # Setup application
    create_service_user
    create_app_directory
    setup_application
    create_pm2_config
    
    # Configure system
    configure_systemd
    configure_firewall
    
    # Start application
    start_application
    
    # Display status
    display_status
}

# Run main function
main "$@"
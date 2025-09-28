# ⚡ Hosting Manager Dashboard  

A lightweight, open-source alternative to cPanel for managing websites on Linux (Ubuntu/WSL) servers.  
This project provides a **React frontend** and a **Node.js/Express backend** to manage Apache virtual hosts, run commands, deploy sites, and switch sites into **maintenance mode** with automatic backup/restore of configs.  

---

## ✨ Features  
- 💻 Run Linux commands directly from web UI  
- 🌐 Apache controls: start, stop, restart  
- 📂 Website manager: enable, disable, maintenance mode  
- 📦 Deploy new sites with subdomain + file upload  
- 🛠️ Maintenance mode: auto-backup & restore configs  
- 🔒 Authentication (planned)  
- 🤖 AI integration (future): log analyzer, security advisor, performance tuner  

---

## ⚙️ Installation  

### Prerequisites  
- Ubuntu / Debian / WSL with Apache2 installed  
- Node.js (v16+) & npm  
- Git  

### Steps  
1. Clone the repository:  
   ```bash
   git clone https://github.com/yourusername/hosting-manager.git
   cd hosting-manager
2. Install & run backend:
    
  cd backend
  npm install
  node server.js


Runs on: http://localhost:5000

3.Install & run frontend:
  
  cd ../frontend
  npm install
  npm start
  
  
  Runs on: http://localhost:3000


📋 Usage

Open http://localhost:3000

From dashboard you can:

Run shell commands (via backend)

Start/stop/restart Apache

View available & enabled sites

Enable / disable websites

Switch to maintenance mode

Deploy new sites by uploading files


  


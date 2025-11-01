# 🌐 Orbit - Student Collaboration Platform

> A cloud-hosted MERN stack application designed for college students to connect, collaborate, and communicate through discussion hubs, workspaces, and informal chatrooms — deployed on AWS EC2 with CloudWatch monitoring.

---

## 🚀 Project Overview

**Orbit** is a student community platform built using the **MERN stack (MongoDB, Express.js, React.js, Node.js)**.  
It enables students from the same college (e.g., VIT) to create and join topic-based rooms — “Hubs,” “Workspaces,” and “Nexus” — for collaborative discussion, knowledge sharing, and social interaction.

The application is **hosted on AWS EC2 (Ubuntu)** with a complete **monitoring setup using AWS CloudWatch Agent** for CPU, memory, and disk usage metrics.

---

## 🎯 Problem Statement

College students often lack a centralized and private online space to:
- Discuss coursework and assignments.
- Collaborate on projects.
- Form study groups or social circles within the same institution.

**Orbit** solves this by providing a community-driven communication app where students can create structured yet flexible spaces for academic and informal discussions — similar to Discord, but focused on college communities.

---

## 🧩 Features

- 👥 User authentication & authorization (JWT)
- 💬 Real-time messaging using WebSocket (Socket.io)
- 🧠 Discussion rooms (Hubs, Workspaces, Nexus)
- 🖥️ Responsive React UI
- ⚙️ Backend API using Express.js
- ☁️ AWS EC2-hosted full-stack deployment
- 📊 CloudWatch monitoring for performance metrics
- 🔒 PM2 for backend process management

---

## 🧱 Tech Stack

| Layer | Technology |
|-------|-------------|
| **Frontend** | React.js, Axios, TailwindCSS |
| **Backend** | Node.js, Express.js |
| **Database** | MongoDB (Local / Atlas) |
| **Hosting** | AWS EC2 (Ubuntu) |
| **Monitoring** | AWS CloudWatch Agent |
| **Process Manager** | PM2 |
| **Web Server** | Nginx |
| **Version Control** | Git & GitHub |

---

## ⚙️ Local Development Setup

### 1️⃣ Clone the Repository
```bash
git clone https://github.com/<your-username>/orbit.git
cd orbit
2️⃣ Backend Setup
bash
Copy code
cd backend
npm install
npm start
Create .env file with:

ini
Copy code
PORT=5000
MONGO_URI=<your_mongodb_connection_string>
JWT_SECRET=<your_secret_key>

```
3️⃣ Frontend Setup
```bash
Copy code
cd frontend
npm install
npm run dev
```
☁️ AWS Deployment Steps
Step 1: Launch EC2 Instance
Open AWS Console → EC2 → Launch Instance

Choose Ubuntu 22.04 LTS AMI

Instance type: t2.micro (Free Tier)

Add SSH Key Pair (download .pem file)

Open security groups for ports 22 (SSH), 80 (HTTP), and 5000 (Backend)

Step 2: Connect & Install Dependencies
```bash
Copy code
sudo apt update
sudo apt install nodejs npm nginx -y
sudo npm install pm2 -g
Step 3: Upload Project to EC2
Use SCP or Git:
```
```bash
Copy code
scp -i your-key.pem -r ./orbit ubuntu@<EC2-PUBLIC-IP>:/home/ubuntu/
```
Step 4: Configure & Run Backend
```bash
Copy code
cd orbit/backend
npm install
pm2 start server.js
pm2 save
pm2 startup
```
Step 5: Build & Deploy Frontend
```bash
Copy code
cd orbit/frontend
npm run build
sudo cp -r dist/* /var/www/html/
```
Step 6: Configure Nginx
```bash
Copy code
sudo nano /etc/nginx/sites-available/default
```
Example config:
```
nginx
Copy code
server {
    listen 80;
    server_name _;
    root /var/www/html;

    location /api {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
Restart Nginx:

bash
Copy code
sudo systemctl restart nginx
```
📈 AWS CloudWatch Monitoring Setup
Step 1: Create IAM Role
Go to IAM → Roles → Create Role

Choose AWS Service → EC2

Attach policy CloudWatchAgentServerPolicy

Name: EC2CloudWatchAgentRole

Attach the role to your EC2 instance

Step 2: Install CloudWatch Agent
```bash
Copy code
sudo apt install amazon-cloudwatch-agent -y
```
Step 3: Configure the Agent
```bash
Copy code
sudo nano amazon-cloudwatch-agent.json
Sample config:

json
Copy code
{
  "metrics": {
    "metrics_collected": {
      "mem": { "measurement": ["mem_used_percent"] },
      "cpu": { "measurement": ["cpu_usage_idle", "cpu_usage_user", "cpu_usage_system"] }
    }
  }
}
Start the agent:

bash
Copy code
sudo /opt/aws/amazon-cloudwatch-agent/bin/amazon-cloudwatch-agent-ctl \
-a fetch-config -m ec2 -c file:amazon-cloudwatch-agent.json -s
```
Step 4: Verify Metrics
Open CloudWatch Console → Metrics → All metrics → CWAgent

View CPU & Memory usage graphs in real-time

🧩 Folder Structure
pgsql
Copy code
orbit/
├── backend/
│   ├── server.js
│   ├── routes/
│   ├── models/
│   ├── controllers/
│   └── config/
├── frontend/
│   ├── src/
│   ├── public/
│   ├── package.json
│   └── vite.config.js
└── amazon-cloudwatch-agent.json
📸 Screenshots :


(Replace image paths with actual screenshots)

🧾 Results<br/>
✅ Successfully deployed a MERN app on AWS EC2.
✅ Configured Nginx for frontend & backend proxy.
✅ Enabled CloudWatch for real-time monitoring.
✅ Application accessible globally via EC2 public IP

🧠 Future Enhancements
🔔 Push notifications

🎥 Video/Audio chat integration

🤖 AI-based discussion summarization

☁️ Auto-scale using AWS Elastic Beanstalk or ECS

👤 Author
Vignesh V.
📧 [vignesh.v06.dev@gmail.com
].


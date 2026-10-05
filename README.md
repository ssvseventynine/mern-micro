## 📸 Application Preview
![Dashboard Preview](resources/Jumbo_8.jpg)

## MERN Enterprise Microservices Control Center Matrix

> A modernized MERN-stack microservices control matrix engineered with Express.js services, HashiCorp Consul service discovery, and an API Gateway to manage real-time inventory synchronization, order queue processing, and system-wide shipping notification alerts.

[![Azure Cloud](https://img.shields.io/badge/Cloud-Microsoft%20Azure-0089D6?logo=microsoftazure&logoColor=white)](#)
[![Kubernetes](https://img.shields.io/badge/Orchestration-Kubernetes-326CE5?logo=kubernetes&logoColor=white)](#)
[![HashiCorp Consul](https://img.shields.io/badge/Service%20Discovery-HashiCorp%20Consul-D52B1E?logo=consul&logoColor=white)](#)
[![GitHub Actions](https://img.shields.io/badge/CI%2FCD-GitHub%20Actions-2088FF?logo=githubactions&logoColor=white)](#)
[![Backend Node.js](https://img.shields.io/badge/Backend-Node.js-339933?logo=nodedotjs&logoColor=white)](#)
[![Frontend React](https://img.shields.io/badge/Frontend-ReactJS-61DAFB?logo=react&logoColor=white)](#)
[![Database MongoDB](https://img.shields.io/badge/Database-MongoDB-47A248?logo=mongodb&logoColor=white)](#)

---

## 🌐 Live Application

* **Live Azure Cluster Endpoint:** [http://20.212.101.191/](http://20.212.101.191/)

---

## 📐 System Architecture & Workflow

The matrix utilizes a modernized **Microservices Architecture**. The ReactJS client sends HTTP requests via an Express API Gateway (`8080`), which dynamically resolves routes using **HashiCorp Consul Service Discovery** (`8500`). Requests are routed to User Service (`3001`), Product Service (`3002`), or Order Service (`3003`). Successful order fulfillment and shipping events trigger automated processing pipelines to the Notification Service (`3004`), which logs alerts back to the matrix UI. Persistent entities are mapped using Mongoose ODM into MongoDB instances on port `27017`.

```
                                         +----------------------------------+
                                         |  HashiCorp Consul Discovery      |
                                         |  (Port 8500)                     |
                                         +----------------------------------+
                                                          ^
                                                          | Service Registration & Lookup
                                                          v
+------------------+     HTTP / REST     +----------------------------------+
|                  | ------------------> |       Express API Gateway        | ---> User Service (3001)
|  ReactJS Client  |                     |       (Port 8080)                | ---> Product Service (3002)
| (Matrix Portal)  | <------------------ +----------------------------------+ ---> Order Service (3003)
+------------------+     JSON Data                        |                   ---> Notification Service (3004)
    (Port 3000)                                           | Mongoose ODM
                                                          v
                                                 +------------------+
                                                 |  MongoDB Store   |
                                                 |  (Port 27017)    |
                                                 +------------------+
```

---

## ✨ Key Features & Capabilities

* **User Management Dashboard:** Publishes active user account details, role permissions, and profile metadata persisted in backend document collections.
* **Real-Time Product Inventory:** Live inventory grid rendering stock quantities, SKU metrics, and dynamic product catalog updates.
* **Interactive Order Queue Placement:** Interactive checkout capabilities allowing users to select active inventory, configure quantities, and push items to the order queue.
* **Automated Shipping Alert Logs:** Instant alert propagation to the system notification log upon successful order shipping and fulfillment execution.
* **Architecture Modernization:** Refactored decoupled Node.js microservices integrated with HashiCorp Consul for dynamic discovery on Azure Kubernetes Service (AKS).

---

## 🛠️ Tech Stack & Dependencies

* **Back-End:** Node.js, Express.js, Mongoose ODM
* **Front-End:** ReactJS, JavaScript (ES6+), HTML5/CSS3
* **Service Discovery & CI/CD:** HashiCorp Consul, GitHub Actions
* **Database & Persistence:** MongoDB
* **Cloud & Infrastructure:** Docker Desktop, Kubernetes (k8s), Microsoft Azure (AKS)

---

## 🔌 Port Configuration & Environment Setup

| Component / Service | Default Port | Protocol / Description |
| :--- | :--- | :--- |
| **Front-End Application** | `3000` | ReactJS Control Center Matrix |
| **API Gateway** | `8080` | Express API Gateway Router |
| **Consul Service Discovery** | `8500` | Service Discovery & Registry |
| **User Service** | `3001` | Microservice Endpoint |
| **Product Service** | `3002` | Microservice Endpoint |
| **Order Service** | `3003` | Microservice Endpoint |
| **Notification Service** | `3004` | Microservice Endpoint |
| **MongoDB Database** | `27017` | Persistent NoSQL Store |

---

## 💻 Local Getting Started

### Prerequisites
* Node.js (v16+) & npm
* HashiCorp Consul Binary / Docker Image
* MongoDB Server 5.0+
* Docker Desktop

---

### 1. Database & Consul Setup

Start local MongoDB and HashiCorp Consul instances:

```bash
# Start MongoDB container
docker run -d --name mongodb -p 27017:27017 mongo:latest

# Start HashiCorp Consul in dev mode
docker run -d --name consul -p 8500:8500 consul:latest agent -dev -client=0.0.0.0
```

---

### 2. Configure Environment Properties

Set environment configuration files across backend microservices:

```properties
PORT=8080
MONGODB_URI=mongodb://localhost:27017/mern_matrix_db
CONSUL_HOST=localhost
CONSUL_PORT=8500
```

---

### 3. Build and Run Backend Microservices

Launch services in sequence:

```bash
# 1. API Gateway (Port 8080)
cd api-gateway
npm install
npm start

# 2. User & Product Microservices (Ports 3001, 3002)
cd ../user-service && npm start
cd ../product-service && npm start

# 3. Order & Notification Microservices (Ports 3003, 3004)
cd ../order-service && npm start
cd ../notification-service && npm start
```

---

### 4. Build and Run Frontend

Launch the ReactJS control matrix:

```bash
cd ../client

# Install dependencies
npm install

# Start React app
npm start
```

Access the control center matrix at `http://localhost:3000`.

---

## 🚀 Cloud & CI/CD Deployment

1. **GitHub Actions Pipeline:** Automated CI/CD workflows run linting, execute service unit tests, build container images, and publish to Azure Container Registry (ACR).
2. **Azure Kubernetes Service (AKS):** Manifests deploy microservice pods, Consul agent sidecars, and load balancers to Microsoft Azure infrastructure.
# Deployment Strategy - OpenLake Hub v1

## Recommended Topology
Since OpenLake Hub is stateless and acts as the entry point, the best deployment target is a standardized **Linux VPS (Virtual Private Server)** running **Docker Compose**.

### Why VPS?
- **Cost**: Fixed low cost (e.g., Hetzner CX21 ~€5/mo).
- **Control**: Full access to Nginx configurations and firewall.
- **Performance**: No "cold starts" unlike serverless.
- **Simplicity**: No complex Kubernetes cluster to manage for v1.

## Architecture

```
[ Internet ]
      │
      ▼
[ Cloud VPS (Hetzner / AWS / DO) ]
      │
      ├── [ Nginx Container (Port 80/443) ]
      │         │
      │         ▼
      ├── [ Hub Container (Port 3000) ]
      │         │
      │         ├── connects to -> OpenLake Auth
      │         ├── connects to -> CoSA Service
      │         └── connects to -> Marketplace Service
      │
      └── [ Watchtower (Optional) ]
            (Auto-updates containers)
```

## Deployment Steps

1.  **Provision Server**: Ubuntu 22.04 LTS.
2.  **Install Docker**: `curl -fsSL https://get.docker.com | sh`
3.  **Clone Repo**:
    ```bash
    git clone https://github.com/OpenLake/Hub.git
    cd Hub
    ```
4.  **Configure Environment**:
    ```bash
    cp .env.example .env
    nano .env # Set real service URLs
    ```
5.  **Start Services**:
    ```bash
    docker compose up -d --build
    ```

## Scaling
For v1, a single instance can handle thousands of concurrent requests due to Fastify + Node.js async nature.
**Horizontal Scaling (Future)**:
- Put a Load Balancer (AWS ALB / Hetzner LB) in front.
- Spin up multiple VPSc with the same Docker setup.

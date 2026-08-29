# 🏗️ System Architecture

FitTrack follows a **microservices-based architecture** where the React frontend communicates with backend services through a centralized Spring Cloud API Gateway. Eureka is used for service discovery, RabbitMQ handles asynchronous communication, and Gemini AI provides personalized fitness recommendations.

## Architecture Overview

```text
React Frontend
      │ HTTP / REST + JWT
      ▼
Spring Cloud API Gateway
      │
      ├──────────────► USER-SERVICE ─────► Database
      │
      ├──────────────► ACTIVITY-SERVICE ─► Database
      │                         │
      │                         │ Activity Event
      │                         ▼
      │                      RabbitMQ
      │                         │
      │                         ▼
      └──────────────► AI-SERVICE ───────► MongoDB
                              │
                              │ HTTPS
                              ▼
                         Gemini AI API
```

## 🔐 Security Architecture

FitTrack uses **Spring Security with JWT authentication**.

```text
React Frontend
      │
      │ Authorization: Bearer <JWT>
      ▼
API Gateway
      │
      ├── Invalid Token → 401 Unauthorized
      │
      └── Valid Token
              │
              ▼
       Backend Microservice
```

The API Gateway validates JWT tokens and forwards trusted user information using:

```text
X-User-ID
X-User-Email
X-User-Role
```

Client-supplied identity headers are removed before forwarding requests.

## 🌐 API Gateway

The Spring Cloud Gateway is the single entry point for the frontend.

### Responsibilities

- Centralized API entry point
- Request routing
- JWT validation
- CORS handling
- Eureka-based service discovery
- Load balancing

### Routes

```text
/api/users/**            → USER-SERVICE
/api/activities/**       → ACTIVITY-SERVICE
/api/recommendations/**  → AI-SERVICE
```

Logical service names are used instead of hard-coded service URLs:

```text
lb://USER-SERVICE
lb://ACTIVITY-SERVICE
lb://AI-SERVICE
```

## 🔎 Eureka Service Discovery

Netflix Eureka provides service registration and discovery.

```text
                 ┌──────────────────┐
                 │   Eureka Server   │
                 └────────┬─────────┘
                          │
          ┌───────────────┼────────────────┐
          ▼               ▼                ▼
   USER-SERVICE    ACTIVITY-SERVICE    AI-SERVICE
          │               │                │
          └───────────────┼────────────────┘
                          ▼
                    API Gateway
```

Each microservice registers with Eureka, allowing the Gateway to discover available service instances dynamically.

## 📨 RabbitMQ Asynchronous Processing

AI recommendation generation is decoupled from activity creation using RabbitMQ.

```text
React
  │
  ▼
API Gateway
  │
  ▼
Activity Service
  │
  ├── Save Activity
  │
  └── Publish Activity Event
             │
             ▼
          RabbitMQ
             │
             ▼
          AI Service
             │
             ▼
          Gemini AI
             │
             ▼
       Save Recommendation
             │
             ▼
          MongoDB
```

### RabbitMQ Components

| Component | Purpose |
|---|---|
| Exchange | Receives activity events |
| Routing Key | Routes activity messages |
| Queue | Stores messages until consumed |
| Consumer | AI Service processes activity events |

Example messaging configuration:

```text
Exchange: fitness.exchange
Queue: activity.queue
Routing Key: activity.tracking
```

## 🤖 AI Recommendation Architecture

The AI Service consumes activity events and generates personalized recommendations.

```text
RabbitMQ
    │
    ▼
ActivityMessageListener
    │
    ▼
ActivityAIService
    │
    │ Build Prompt
    ▼
GeminiService
    │
    │ HTTPS Request
    ▼
Gemini API
    │
    │ AI Response
    ▼
GeminiService
    │
    ▼
ActivityAIService
    │
    ▼
Recommendation
    │
    ▼
MongoDB
```

Recommendations can contain:

- Activity analysis
- Performance analysis
- Improvement recommendations
- Workout suggestions
- Safety recommendations

## 🗄️ Database Architecture

Each service manages its own persistence layer.

### User Service

```text
User Service
     │
     ▼
User Database
     │
     └── User information
```

### Activity Service

```text
Activity Service
      │
      ▼
Activity Database
      │
      └── Fitness activities
```

### AI Service

```text
AI Service
    │
    ▼
MongoDB
    │
    └── AI recommendations
```

## 📊 Complete End-to-End Flow

When a user creates a fitness activity:

```text
1. User enters activity information
          │
          ▼
2. React sends POST request
          │
          ▼
3. API Gateway validates JWT
          │
          ▼
4. Gateway routes request to Activity Service
          │
          ▼
5. Activity Service stores the activity
          │
          ▼
6. Activity Service publishes an activity event
          │
          ▼
7. RabbitMQ receives the event
          │
          ▼
8. AI Service consumes the event
          │
          ▼
9. AI Service builds the recommendation prompt
          │
          ▼
10. Gemini API processes the prompt
          │
          ▼
11. Gemini returns the AI response
          │
          ▼
12. AI Service processes the response
          │
          ▼
13. Recommendation is stored in MongoDB
          │
          ▼
14. React requests the recommendation
          │
          ▼
15. Gateway routes the request to AI Service
          │
          ▼
16. AI Service returns the saved recommendation
          │
          ▼
17. React displays the recommendation
```

## 🧩 Technology Architecture

```text
Frontend
├── React
├── React Router
├── Axios
└── Material UI

Backend
├── Spring Boot
├── Spring Security
├── Spring Cloud Gateway
├── Spring Cloud Netflix Eureka
├── Spring Data JPA
├── Spring Data MongoDB
└── Spring AI

Communication
├── REST APIs
├── RabbitMQ
└── HTTP/HTTPS

Security
├── JWT Authentication
├── Spring Security
└── Role-Based Authorization

Databases
├── PostgreSQL / relational database
└── MongoDB

AI
└── Google Gemini API

DevOps
├── Docker
├── Maven
└── Git/GitHub
```

## ☁️ Deployment Architecture

The application is containerized using Docker and deployed as independent services.

```text
                         Internet
                            │
                            ▼
                    React Frontend
                            │
                            │ HTTPS
                            ▼
                    API Gateway
                            │
              ┌─────────────┼──────────────┐
              ▼             ▼              ▼
        User Service   Activity Service  AI Service
              │             │              │
              ▼             ▼              ▼
         User DB       Activity DB       MongoDB
                            │
                            ▼
                         RabbitMQ
                            │
                            ▼
                        AI Service
                            │
                            ▼
                       Gemini API
```

The frontend communicates with backend services through the API Gateway instead of directly accessing individual microservices.

## 🔁 Synchronous vs Asynchronous Communication

### Synchronous

Used for normal user-facing API operations:

```text
React
  ↓
API Gateway
  ↓
Microservice
  ↓
Database
  ↓
Response
  ↓
React
```

Examples:

- Login
- Register
- Get activities
- Create activity
- Update activity
- Delete activity
- Get recommendations

### Asynchronous

Used for AI recommendation generation:

```text
Activity Service
      ↓
   RabbitMQ
      ↓
   AI Service
      ↓
  Gemini API
      ↓
   MongoDB
```

This prevents activity creation from being tightly coupled to AI processing time.

## 🏛️ Microservices Design

| Service | Responsibility |
|---|---|
| User Service | User management and authentication |
| Activity Service | Fitness activity management |
| AI Service | AI recommendation generation |
| API Gateway | Routing, JWT validation and centralized entry point |
| Eureka Server | Service registration and discovery |
| RabbitMQ | Asynchronous event communication |

## 🚀 Key Architectural Benefits

### Scalability
Individual services can be scaled independently.

### Fault Isolation
AI processing is separated from core activity management.

### Loose Coupling
RabbitMQ decouples activity creation from AI recommendation generation.

### Security
JWT validation provides centralized authentication for protected APIs.

### Service Discovery
Eureka removes the need to hard-code service instance addresses.

### Maintainability
Each microservice has a focused responsibility and manages its own data.

### AI Integration
Gemini-specific logic is isolated inside the AI Service.

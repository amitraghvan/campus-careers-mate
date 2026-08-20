# Software Requirements Specification (SRS) - Campus Careers Mate

## 1. Introduction

### 1.1 Purpose
The purpose of this document is to provide a comprehensive description of the **Campus Careers Mate** platform. It outlines the functional and non-functional requirements, project scope, and system architecture to ensure all stakeholders have a shared understanding of the platform's objectives and capabilities.

### 1.2 Intended Audience
This document is intended for:
- **Developers**: For implementation and system architecture guidance.
- **Project Managers**: To track progress and ensure scope compliance.
- **University Career Centers**: To evaluate the platform's suitability for student career development.
- **Students**: As a reference for the platform's features and data privacy standards.

### 1.3 Scope
**Campus Careers Mate** is an AI-powered personal career and academic assistant. The platform serves as a centralized hub for university students to manage their professional growth through:
- AI-assisted resume building and document management.
- Intelligent study planning and deadline tracking.
- Personalized internship and job opportunity matching.
- Real-time peer-to-peer networking and collaboration.
- Advanced learning analytics to visualize academic progress.

### 1.4 References
- **Project Repository**: [Campus Careers Mate](file:///Users/amitkumar/campus-careers-mate-1)
- **Authentication**: [Clerk Authentication](https://clerk.com/)
- **AI Engine**: [Groq SDK](https://groq.com/)
- **UI Framework**: [Shadcn UI](https://ui.shadcn.com/) / [Radix UI](https://www.radix-ui.com/)
- **Real-time Engine**: [Socket.io](https://socket.io/)

---

## 2. Overall Description

### 2.1 Use Cases
- **UC-01: AI Resume Generation**: A student provides their details, and the platform uses AI to generate a professional resume tailored to specific job roles.
- **UC-02: Study Plan Optimization**: A student inputs their exam dates and course syllabi; the system generates an adaptive study schedule.
- **UC-03: Opportunity Tracking**: A student tracks internship applications through a Kanban-style pipeline.
- **UC-04: Peer Networking**: Students connect and message each other in real-time to discuss career opportunities or course materials.

### 2.2 Test Cases
- **TC-01: Authentication Flow**: Verify that users can securely sign up/in using Clerk and maintain session state.
- **TC-02: AI Response Reliability**: Ensure the Groq-powered AI components return structured, relevant advice within defined latency limits (< 2 seconds).
- **TC-03: PDF Export**: Validate that the Resume Builder generates a correctly formatted PDF file that is industry-compliant.
- **TC-04: Real-time Message Sync**: Confirm that messages sent via Socket.io are delivered instantly across multiple client sessions.

### 2.3 Product Perspective
Campus Careers Mate is a standalone web application designed to bridge the gap between academic learning and career readiness. It integrates multiple disconnected tools (Planners, Job Boards, Chat Apps, Resume Builders) into a single, cohesive ecosystem powered by localized and cloud AI models.

### 2.4 Product Functions
- **Unified Dashboard**: Real-time overview of deadlines, pending tasks, and career opportunities.
- **Intelligent Planner**: Calendar integration with automated workload balancing.
- **Resume Hub**: Multiple resume templates with AI-driven content suggestions.
- **Opportunities Pipeline**: CRM-like interface for tracking professional applications.
- **Peer Connect**: Real-time messaging and collaborative networking.

### 2.5 User Characteristics
- **Primary Users**: University students looking for structure in their academic and professional journey.
- **Secondary Users**: Mentors or Alumni provide guidance through the networking feature.
- **Technical Literacy**: Expected to be moderate to high, as the target audience is university-level students.

### 2.6 Design and Implementation Constraints
- **Performance**: Must remain responsive under heavy document rendering (PDFs).
- **Interoperability**: Must work across all modern browsers (Edge, Chrome, Safari, Firefox).
- **Data Privacy**: AI interactions must be sanitized of sensitive personal information before external API transmission.

### 2.7 Assumptions
- Users have access to a stable internet connection for AI and real-time features.
- The project will be deployed on a platform supporting Node.js backends and WebSocket persistence (e.g., Vercel + dedicated backend).

---

## 3. External Interface Requirements

### 3.1 User Interfaces
- **Design System**: Follows a "Premium Modern" aesthetic using a light/dark mode design system.
- **Frameworks**: Built using **Vite + React + Tailwind CSS**.
- **Components**: Heavy utilization of **Shadcn UI** for consistency and accessibility.
- **Animations**: **Framer Motion** for smooth transitions and interactive micro-animations.

### 3.2 Software Security and Data Privacy
- **Authentication**: Managed via **Clerk**, supporting MFA and social logins.
- **AI Security**: Implementation of the **Groq SDK** with specific system prompts to prevent prompt injection.
- **Data Encryption**: All data transmitted over HTTPS; sensitive student data in the database is encrypted at rest.
- **Compliance**: Adherence to standard data protection principles (mimicking GDPR/CCPA best practices).

### 3.3 Communication
- **Client-Server**: RESTful API for standard data fetching.
- **Real-time**: **Socket.io** for instant notifications and peer-to-peer messaging.
- **External APIs**: Integration with Groq for NLP tasks and Clerk for identity management.

---

## 4. System Features / Functional Requirements

### 4.1 Personalized Learning Paths & Adaptive Content
- **FR-01: Goal Setting**: Users can define academic or career goals (e.g., "Get a Frontend Developer Internship").
- **FR-02: Progress Tracking**: The system tracks completed modules, assignments, and study sessions.
- **FR-03: AI Recommendations**: Based on learning analytics, the system suggests specific topics to focus on or resources to review.
- **FR-04: Adaptive Scheduling**: If a student misses a study block, the system automatically redistributes the workload across future sessions.

### 4.2 Intelligent Content Delivery & Management
- **FR-05: Opportunity Aggregator**: Fetches and filters job/internship listings based on the user's skillset and preferences.
- **FR-06: Smart Formatting**: Automatically formats user-uploaded content into professional PDF resumes.
- **FR-07: Context-Aware Insights**: Provides AI-driven feedback on why a specific student might be a good fit for an opportunity (Gap Analysis).
- **FR-08: Real-time Notifications**: Alerts for upcoming deadlines or new opportunity matches delivered via the dashboard and browser notifications.

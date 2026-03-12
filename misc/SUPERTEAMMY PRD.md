# **Product Requirements Document (PRD)**

Superteam Malaysia Official Website

---

## **1\. Project Overview**

Superteam Malaysia is launching its official website to serve as the digital headquarters for Solana builders in Malaysia. The platform must align with the global Superteam brand while reflecting Malaysia’s unique Web3 ecosystem.

The website must function as a scalable, production-ready ecosystem platform — not a static landing page — and include a CMS for continuous content management by non-technical administrators.

---

## **2\. Objectives**

Primary Objectives:

* Establish Superteam Malaysia’s digital HQ  
* Showcase members, events, partners, and ecosystem impact  
* Enable continuous content management via CMS  
* Align with global Superteam branding  
* Reflect Malaysia’s Web3 ecosystem identity

Secondary Objectives:

* Demonstrate strong frontend and backend architecture  
* Implement Luma integration for events  
* Build a scalable, maintainable content system  
* Optimize for performance and SEO

---

## **3\. Target Users**

1. Builders (Developers, Designers, Product Builders)  
2. Founders and Web3 Entrepreneurs  
3. Contributors and Community Members  
4. Ecosystem Partners  
5. Superteam Malaysia Admin Team

---

## **4\. Technical Stack (Required and Preferred)**

### **Frontend**

* Next.js (Required)  
* React  
* Tailwind CSS (or equivalent modern CSS framework)  
* Fully responsive (desktop and mobile)  
* Optional: Framer Motion for animations

### **Backend / Database**

* Supabase (Preferred)  
  * PostgreSQL database  
  * Authentication  
  * Role-based access control  
  * Storage (media uploads)

### **Integrations**

* Luma (Event management integration)  
* Twitter/X embeds  
* SEO optimization

Optional:

* Web3 integrations (non-required)

### **Deployment**

* Vercel (Recommended)  
* Netlify (Alternative)

---

## **5\. Functional Requirements**

### **5.1 Landing Page**

#### **5.1.1 Hero Section**

* Bold headline describing Superteam Malaysia’s mission  
* Supporting subheadline with value proposition  
* Subtle Malaysian cultural elements (modern, minimal)  
* Primary CTAs:  
  * Join Community  
  * Explore Opportunities  
* Dynamic visuals (animations, illustrations, or community imagery)

#### **5.1.2 Mission / What We Do**

Display key pillars:

* Builder support & mentorship  
* Events & hackathons  
* Grants & funding access  
* Jobs, bounties & opportunities  
* Education & workshops  
* Ecosystem connections

#### **5.1.3 Stats / Impact Section**

Display key metrics:

* Members  
* Events hosted  
* Projects built  
* Bounties completed  
* Community reach

Requirements:

* Animated counters or dynamic visual presentation

#### **5.1.4 Events Section (Luma Integration)**

Must:

* Display upcoming events from Superteam Malaysia Luma  
* Highlight past events  
* Include “View All Events” CTA linking to Luma

Optional Enhancements:

* Embedded Luma widget  
* Custom calendar UI  
* Animated event cards

#### **5.1.5 Members Section (Spotlight)**

Dynamic showcase, not static list.

Each member card must include:

* Profile photo  
* Name  
* Role / Company  
* Skill tags (Dev, Design, Content, BizDev, etc.)  
* Twitter/X link  
* Solana achievements:  
  * Hackathon wins  
  * Projects built  
  * Grants received  
  * DAO contributions  
  * Bounties completed

UX Enhancements (optional):

* Hover animations  
* Modal popups  
* Featured members  
* Badge system (e.g., Solana Builder, Hackathon Winner)

#### **5.1.6 Partners / Ecosystem**

* Logo grid of Solana projects and Malaysian ecosystem partners  
* Hover effects (colorize, scale, glow)

#### **5.1.7 Community / Wall of Love**

* Embedded tweets from Superteam Malaysia  
* Testimonials from builders and ecosystem leaders  
* Social proof content

#### **5.1.8 FAQ Section**

Expandable accordion format including:

* What is Superteam Malaysia?  
* How do I join?  
* What opportunities are available?  
* How can projects collaborate?  
* Do I need to be a developer to join?

#### **5.1.9 Join CTA**

* Prominent call-to-action  
* Links to Telegram, Discord, Twitter/X  
* Optional newsletter signup

#### **5.1.10 Footer**

* Superteam Malaysia logo  
* Social links  
* Quick navigation  
* Link to global Superteam

---

### **5.2 Members Page (Dedicated Page)**

Must include:

Search and Filter Functionality:

* Text-based search  
* Skill-based filters:  
  * Core Team  
  * Rust  
  * Frontend  
  * Design  
  * Content  
  * Growth  
  * Product  
  * Community

Member Cards:

* Photo  
* Name  
* Title  
* Company  
* Skills  
* Twitter/X link

UX:

* Smooth animations and transitions  
* Fully responsive layout

---

## **6\. CMS Requirements**

The website must include a content management system allowing administrators to update content without modifying code.

### **6.1 CMS Capabilities**

Admins must be able to:

* Add, edit, delete events  
* Manage member profiles  
* Manage featured members  
* Update partner logos  
* Edit landing page content (text, images, links)  
* Publish announcements  
* Manage testimonials

### **6.2 Implementation**

Preferred:

* Supabase as backend CMS database  
* Custom admin dashboard interface  
* Role-based access control:  
  * Admin (full access)  
  * Editor (limited content access)

Optional Enhancements:

* Headless CMS integration (Sanity, Strapi, Contentful)  
* Markdown support  
* Media upload and asset management  
* Real-time updates

---

## **7\. Database Requirements (High-Level)**

Core Tables:

* Members  
* Events  
* Partners  
* Testimonials  
* Announcements  
* Admin Users

Each table must support CRUD operations via CMS.

Role-based access must be enforced using Supabase RLS policies.

---

## **8\. Non-Functional Requirements**

### **Performance**

* Optimized images  
* Lazy loading where applicable  
* Good Lighthouse performance scores  
* Optimized bundle size

### **Responsiveness**

* Fully responsive (desktop, tablet, mobile)

### **SEO**

* Metadata optimization  
* Structured semantic HTML  
* Social preview support

### **Code Quality**

* Clean project structure  
* Modular component architecture  
* Clear naming conventions  
* Environment variable management

---

## **9\. Deliverables**

### **9.1 Design Deliverables**

* Figma file (view-only link)  
  * Landing page (desktop \+ mobile)  
  * Members page (desktop \+ mobile)  
  * Design system & components  
  * Typography & color system  
  * Interactive prototype

### **9.2 Development Deliverables**

* GitHub repository  
  * Complete Next.js codebase  
  * Clean project structure  
  * Production-ready implementation

### **9.3 Documentation**

README.md must include:

* Project overview  
* Tech stack  
* Installation steps  
* Environment variables  
* Local development guide  
* Deployment instructions

Example:

* npm install  
* npm run dev

### **9.4 Optional**

* Live demo link (Vercel / Netlify)  
* Architecture diagram  
* Design rationale documentation

---

## **10\. Evaluation Criteria Alignment**

UI/UX Design Quality – 20%  
Frontend Implementation (Next.js) – 25%  
Code Quality & Architecture – 20%  
Feature Completeness – 15%  
Performance & Responsiveness – 10%  
Web3 Identity & Malaysia Relevance – 10%

---

## **11\. Success Criteria**

The project will be considered successful if:

* All required pages and features are implemented  
* CMS allows non-developers to manage content  
* Luma integration is functional  
* Members directory is dynamic and filterable  
* Website aligns with global Superteam brand  
* Codebase is clean and production-ready  
* Site is responsive and performant


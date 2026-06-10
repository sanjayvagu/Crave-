# Multi-Client Architecture & Phased Development Plan

## Product Required Documents (PRD Overview)

### 1. User Application (Existing)
**Core Functionality:**
- Browse restaurants, menus, and grocery items.
- Place orders and manage cart.
- Live real-time order tracking.
- Profile and payment management.

### 2. Vendor (Restaurant/Store) Application
**Core Functionality:**
- **Order Management:** Receive incoming orders, accept/reject, update status (Preparing, Ready for Pickup).
- **Menu Management:** Toggle item availability, update prices (syncs with User App).
- **Analytics:** Daily sales, order volume, and performance metrics.
- **Store Settings:** Online/Offline toggle, operating hours.

### 3. Rider (Delivery Partner) Application
**Core Functionality:**
- **Order Assignment:** Accept/Reject delivery requests.
- **Navigation & Tracking:** Turn-by-turn navigation, update location in real-time (syncs with User App).
- **Earnings & Payouts:** Track daily/weekly earnings and incentives.
- **Status Updates:** Arrived at store, Picked up, Arrived at customer, Delivered.

---

## Integration & Synchronization Mechanism (How they sync)
The synchronization across all three apps relies on a central real-time database and Pub/Sub architecture:

1. **Order State Machine:**
   - **User** places order (Status: `PENDING`).
   - **Vendor App** receives real-time alert, accepts order (Status: `PREPARING`).
   - System searches for nearest Rider. **Rider App** receives prompt. Rider accepts (Status: `ASSIGNED`).
   - Vendor marks as `READY`. Rider marks as `PICKED_UP`. 
   - Rider continuously pushes GPS coordinates to the DB, which the **User App** listens to for live tracking updates.
   - Rider marks as `DELIVERED` (Status: `COMPLETED`).

2. **Real-time Engine:**
   - We will use **Supabase (PostgreSQL with Realtime)** as the central database. Supabase provides out-of-the-box WebSocket channels to broadcast INSERT, UPDATE, and DELETE changes on Postgres tables, which is perfect for real-time order tracking and state management.

---

## Step-by-Step Phased Development Plan

### Phase 1: Shared Core & Service Decoupling
1. **Extract Types & Interfaces:** Move shared Types (Order, User, Product, Location) into a shared directory or `.npm` package.
2. **Backend Provisioning:** Initialize the unified backend database with authentication.
3. **Database Schema:** Model `users`, `vendors`, `riders`, and `orders` as separate entities grouped by relational constraints.

### Phase 2: Vendor Application Development
1. **Vendor Dashboard:** Build a separate SPA (or route prefix `/vendor`) with a specialized UI.
2. **Authentication:** Implement Role-Based Access Control (RBAC) to ensure only verified vendors can access store data.
3. **Order Pipeline Board:** Implement Kanban-style boards for `New`, `Preparing`, and `Ready` orders.

### Phase 3: Rider Application Development
1. **Rider Interface & Location Services:** Develop the mobile-first SPA optimized for outdoor usage. 
2. **GPS Polling:** Implement continuous geolocation polling using the `Geolocation API` or native bridging.
3. **Dispatch Logic:** Establish geospatial queries to route the nearest rider to the vendor.

### Phase 4: Integration, Testing & Transition
1. **End-to-End Sync Test:** Place an order on User App -> Process on Vendor App -> Deliver on Rider app.
2. **WebSockets/Real-time Audit:** Optimize database listeners to avoid memory leaks during long tracking sessions.
3. **Deployment:** Serve the applications via unified domain routing (e.g., `app.domain.com`, `vendor.domain.com`, `rider.domain.com`).

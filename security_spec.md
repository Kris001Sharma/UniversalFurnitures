# Security Specification - Sales & Logistics Dashboard

## Data Invariants
1. **User Profiles:** A user can only edit their own profile, except for roles/admin fields.
2. **User Tracking:** Only the user themselves can write their location data.
3. **Delivery Tasks:** Only assigned agents or admins can update task status. Agents can only update status, not reassign.
4. **Orders:** Only admins or assigned sales agents can create/update orders.
5. **Clients:** Only admins or assigned sales agents can update client info.
6. **Interaction Logs:** Immutable once created. Only relevant agents can create.

## The Dirty Dozen Payloads (Negative Tests)

1. **Identity Spoofing (Profile):**
   - **Payload:** `PATCH /user_profiles/target_user_id { "role": "ADMIN", "is_verified": true }`
   - **Expected:** PERMISSION_DENIED (User attempting to escalate own privileges).

2. **Resource Poisoning (Tracking):**
   - **Payload:** `POST /user_tracking { "userId": "victim_id", "latitude": 91.0, "longitude": 181.0 }`
   - **Expected:** PERMISSION_DENIED (Invalid coordinates and spoofing ID).

3. **Orphaned Write (Order):**
   - **Payload:** `POST /orders { "clientId": "non_existent_id", "value": 1000 }`
   - **Expected:** PERMISSION_DENIED (Referential integrity: Client must exist).

4. **Shadow Update (Client):**
   - **Payload:** `PATCH /clients/id { "name": "New Name", "is_deleted": false, "hidden_internal_rating": 10 }`
   - **Expected:** PERMISSION_DENIED (Update includes non-whitelisted/ghost field).

5. **Terminal State Bypass (Task):**
   - **Payload:** `PATCH /delivery_tasks/completed_task_id { "status": "Pending" }`
   - **Expected:** PERMISSION_DENIED (Cannot revert a terminal 'Completed' state).

6. **Unauthorized Status Jump (Order):**
   - **Payload:** `PATCH /orders/id { "status": "Delivered" }`
   - **Expected:** PERMISSION_DENIED (Only delivery agents or system can set 'Delivered').

7. **Bulk Data Scrape (List Query):**
   - **Payload:** `QUERY /user_profiles WHERE role == 'SALES'` (without proper filters)
   - **Expected:** PERMISSION_DENIED (Rules must enforce that searcher has permission to see members).

8. **PII Leak (Profile):**
   - **Payload:** `GET /user_profiles/any_user_id` (revealing email/phone to non-admin)
   - **Expected:** PERMISSION_DENIED (Must restrict PII to owner or admin).

9. **Timestamp Spoofing:**
   - **Payload:** `POST /activity_logs { "action": "Visit", "created_at": "2020-01-01T00:00:00Z" }`
   - **Expected:** PERMISSION_DENIED (Must use server-provided `request.time`).

10. **Role Escalation (Self-Admin):**
    - **Payload:** `POST /admins/my_uid { "confirmed": true }`
    - **Expected:** PERMISSION_DENIED (Cannot add self to admin collection).

11. **ID Injection Attack:**
    - **Payload:** `POST /clients/<script>alert(1)</script> { ... }`
    - **Expected:** PERMISSION_DENIED (Invalid ID format).

12. **Denial of Wallet (Huge String):**
    - **Payload:** `POST /activity_logs { "notes": "A" * 1024 * 1024 }` (1MB string)
    - **Expected:** PERMISSION_DENIED (String size limit exceeded).

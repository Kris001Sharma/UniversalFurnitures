-- Supabase Database Seed File for Sales Order & Deployment App
-- Ensure running after supabase_schema.sql

-- For standard mock seeding, let's create random UUIDs into variables
-- Depending on your environment, you may want to skip the auth.users insert if it conflicts.
-- By default, creating a user and their profile simultaneously works well here for pure testing.

-- 1. Insert Users & Agents
-- Seed auth.users first to satisfy foreign key constraints
INSERT INTO auth.users (id, aud, role, email, encrypted_password, email_confirmed_at, created_at, updated_at) VALUES
('11111111-1111-1111-1111-111111111111', 'authenticated', 'authenticated', 'admin@erp.com', 'mockpassword123', NOW(), NOW(), NOW()),
('22222222-2222-2222-2222-222222222222', 'authenticated', 'authenticated', 'john.sales@erp.com', 'mockpassword123', NOW(), NOW(), NOW()),
('33333333-3333-3333-3333-333333333333', 'authenticated', 'authenticated', 'sarah.miller@erp.com', 'mockpassword123', NOW(), NOW(), NOW()),
('44444444-4444-4444-4444-444444444444', 'authenticated', 'authenticated', 'james.driver@erp.com', 'mockpassword123', NOW(), NOW(), NOW()),
('55555555-5555-5555-5555-555555555555', 'authenticated', 'authenticated', 'alice.smith@erp.com', 'mockpassword123', NOW(), NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.user_profiles (id, name, email, role, status) VALUES
('11111111-1111-1111-1111-111111111111', 'Admin User', 'admin@erp.com', 'Administrator', 'Online'),
('22222222-2222-2222-2222-222222222222', 'John Sales', 'john.sales@erp.com', 'Sales Agent', 'Online'),
('33333333-3333-3333-3333-333333333333', 'Sarah Miller', 'sarah.miller@erp.com', 'Sales Agent', 'In Meeting'),
('44444444-4444-4444-4444-444444444444', 'James Wilson', 'james.driver@erp.com', 'Delivery', 'Online'),
('55555555-5555-5555-5555-555555555555', 'Alice Smith', 'alice.smith@erp.com', 'Accountant', 'Online')
ON CONFLICT (id) DO NOTHING;

-- Insert Role-Specific Metrics
INSERT INTO public.sales_agent_metrics (agent_id, leads, active_clients, past_clients, revenue, conversion) VALUES
('22222222-2222-2222-2222-222222222222', 45, 12, 18, 125000, 50),
('33333333-3333-3333-3333-333333333333', 38, 15, 22, 182000, 60)
ON CONFLICT (agent_id) DO NOTHING;

INSERT INTO public.accountant_metrics (accountant_id, processed_invoices, pending_approvals, accuracy) VALUES
('55555555-5555-5555-5555-555555555555', 145, 12, '99.8%')
ON CONFLICT (accountant_id) DO NOTHING;

-- 2. Insert Clients
INSERT INTO public.clients (id, name, address, type, contact_person, contact, email, interest, status, is_client, sales_agent_id) VALUES
('b303a744-4632-4d4c-a192-3a5f8dfbdcad', 'City General Hospital', '123 Medical Way, Downtown', 'Hospital', 'Dr. Sarah Smith', '+1 234 567 890', 'sarah@cityhosp.com', 'Ergonomic chairs for waiting area', 'Priority', true, '22222222-2222-2222-2222-222222222222'),
('f6b92a54-7128-48da-ab7b-d2c67d3e2ab1', 'TechCorp Campus', '456 Innovation Blvd, Tech Park', 'Corporate Office', 'Mark Johnson', '+1 234 567 890', 'mark@techcorp.com', 'Bulk workstations', 'Active', true, '33333333-3333-3333-3333-333333333333');

-- 3. Insert Products
INSERT INTO public.products (id, name, category, unit, base_price, description) VALUES
('PRD-101', 'Ergonomic Office Chair', 'Chairs', 'pcs', 12000, 'Premium ergonomic mesh chair designed for 8+ hours of comfort.'),
('PRD-102', 'Standing Desk Pro', 'Desks', 'pcs', 25000, 'Motorized sit-stand desk with memory presets.');

-- 4. Insert Orders
INSERT INTO public.orders (id, org_id, customer_name, sales_agent, category, status, payment_status, total_amount, date) VALUES
('ORD-2024-001', 'b303a744-4632-4d4c-a192-3a5f8dfbdcad', 'City General Hospital', 'John Sales', 'Active', 'Assembly', 'Partial', 120000, '2024-03-01'),
('ORD-2024-002', 'f6b92a54-7128-48da-ab7b-d2c67d3e2ab1', 'TechCorp Campus', 'Sarah Miller', 'Active', 'Ready for Delivery', 'Paid', 250000, '2024-03-02');

-- 5. Insert Order Items
INSERT INTO public.order_items (order_id, product_id, quantity, unit_price) VALUES
('ORD-2024-001', 'PRD-101', 10, 12000),
('ORD-2024-002', 'PRD-102', 10, 25000);

-- 6. Insert Inventory
INSERT INTO public.inventory (id, name, category, quantity, unit) VALUES
('INV-001', 'Steel Framework A', 'Raw Material', 450, 'pcs'),
('INV-002', 'Wooden Desk Tops', 'Raw Material', 120, 'pcs');

-- 7. Insert Production Lines
INSERT INTO public.production_lines (id, name, status, efficiency, output, target, operator) VALUES
('L1', 'Metal Forging Line 1', 'Running', 92, 145, 150, 'John Doe'),
('L2', 'Assembly Line A', 'Running', 88, 380, 400, 'Jane Smith');

-- 8. Insert Delivery Tasks
INSERT INTO public.delivery_tasks (id, order_id, client_name, address, status, priority, agent_id) VALUES
('DEL-001', 'ORD-2024-002', 'TechCorp Campus', '456 Innovation Blvd, Tech Park', 'Open', 'High', '44444444-4444-4444-4444-444444444444');

-- 9. Insert Transactions
INSERT INTO public.transactions (id, order_id, date, description, amount, type, status) VALUES
('TXN-001', 'ORD-2024-001', '2024-03-01', 'Advance Payment received', 60000, 'Income', 'Completed'),
('TXN-002', 'ORD-2024-002', '2024-03-02', 'Full payment received', 250000, 'Income', 'Completed');

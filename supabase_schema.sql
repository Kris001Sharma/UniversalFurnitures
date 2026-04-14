-- ========================================================================================
-- 0. EXTENSIONS & ENUMS
-- ========================================================================================
-- Enable PostGIS for future spatial queries (optional, using double precision for now as fallback)
-- CREATE EXTENSION IF NOT EXISTS postgis;

CREATE TYPE user_role AS ENUM ('ADMIN', 'SALES', 'SUPERVISOR', 'DELIVERY', 'ACCOUNTS');
CREATE TYPE org_status AS ENUM ('New', 'Priority', 'Active');
CREATE TYPE interaction_type AS ENUM ('Visit', 'Call');
CREATE TYPE sentiment_type AS ENUM ('Positive', 'Neutral', 'Negative');
CREATE TYPE order_status AS ENUM ('Draft', 'Active', 'In Production', 'Ready for Delivery', 'Delivered', 'Closed');
CREATE TYPE payment_status AS ENUM ('Pending', 'Partial', 'Paid');
CREATE TYPE order_item_status AS ENUM ('Pending', 'In Production', 'Completed');
CREATE TYPE production_stage AS ENUM ('Forging', 'Cutting', 'Assembly', 'Painting', 'Finishing');
CREATE TYPE inventory_type AS ENUM ('Raw Material', 'Finished Good');
CREATE TYPE inventory_change_type AS ENUM ('In', 'Out');
CREATE TYPE delivery_status AS ENUM ('Open', 'In Progress', 'Delivered');
CREATE TYPE transaction_type AS ENUM ('Income', 'Expense');
CREATE TYPE transaction_status AS ENUM ('Pending', 'Completed');
CREATE TYPE production_tracking_mode AS ENUM ('Order Level', 'Item Level');

-- ========================================================================================
-- 1. IDENTITY & ACCESS LAYER
-- ========================================================================================
CREATE TABLE user_profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT NOT NULL,
    role user_role NOT NULL,
    phone TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ========================================================================================
-- 2. CRM LAYER (Sales)
-- ========================================================================================
CREATE TABLE organizations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    address TEXT,
    latitude DOUBLE PRECISION,
    longitude DOUBLE PRECISION,
    status org_status DEFAULT 'New',
    is_client BOOLEAN DEFAULT false, -- Distinguishes between a Lead (false) and a Client (true)
    created_by UUID REFERENCES user_profiles(id),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE contacts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    phone TEXT,
    email TEXT,
    designation TEXT
);

CREATE TABLE interactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
    profile_id UUID REFERENCES user_profiles(id),
    type interaction_type NOT NULL,
    sentiment sentiment_type,
    notes TEXT,
    latitude DOUBLE PRECISION,
    longitude DOUBLE PRECISION,
    image_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ========================================================================================
-- 3. ORDER MANAGEMENT (CORE PIVOT)
-- ========================================================================================
CREATE TABLE products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    category TEXT,
    unit TEXT,
    base_price DECIMAL(12, 2) NOT NULL,
    is_active BOOLEAN DEFAULT true
);

CREATE TABLE orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID REFERENCES organizations(id),
    created_by UUID REFERENCES user_profiles(id),
    assigned_supervisor_id UUID REFERENCES user_profiles(id),
    status order_status DEFAULT 'Draft',
    payment_status payment_status DEFAULT 'Pending',
    total_amount DECIMAL(12, 2) DEFAULT 0.00,
    tracking_mode production_tracking_mode, -- Allows supervisor to choose how to track production
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE order_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
    product_id UUID REFERENCES products(id),
    quantity INTEGER NOT NULL CHECK (quantity > 0),
    unit_price DECIMAL(12, 2) NOT NULL,
    status order_item_status DEFAULT 'Pending'
);

-- ========================================================================================
-- 4. MANUFACTURING LAYER
-- ========================================================================================
CREATE TABLE production_tracking (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID REFERENCES orders(id) ON DELETE CASCADE, -- Used if tracking_mode is 'Order Level'
    order_item_id UUID REFERENCES order_items(id) ON DELETE CASCADE, -- Used if tracking_mode is 'Item Level'
    stage production_stage NOT NULL,
    quantity INTEGER NOT NULL CHECK (quantity > 0),
    updated_by UUID REFERENCES user_profiles(id),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE inventory (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    item_name TEXT NOT NULL,
    type inventory_type NOT NULL,
    quantity_available INTEGER DEFAULT 0,
    unit TEXT,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE inventory_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    inventory_id UUID REFERENCES inventory(id) ON DELETE CASCADE,
    change_type inventory_change_type NOT NULL,
    quantity INTEGER NOT NULL,
    reference_type TEXT, -- e.g., 'order', 'manual_adjustment'
    reference_id UUID,   -- e.g., order_id
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ========================================================================================
-- 5. LOGISTICS LAYER
-- ========================================================================================
CREATE TABLE delivery_tasks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
    assigned_to UUID REFERENCES user_profiles(id),
    status delivery_status DEFAULT 'Open',
    started_at TIMESTAMPTZ,
    completed_at TIMESTAMPTZ
);

CREATE TABLE delivery_task_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    task_id UUID REFERENCES delivery_tasks(id) ON DELETE CASCADE,
    order_item_id UUID REFERENCES order_items(id),
    quantity_assigned INTEGER NOT NULL,
    quantity_delivered INTEGER DEFAULT 0
);

CREATE TABLE delivery_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    task_id UUID REFERENCES delivery_tasks(id) ON DELETE CASCADE,
    latitude DOUBLE PRECISION,
    longitude DOUBLE PRECISION,
    note TEXT,
    image_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ========================================================================================
-- 6. FINANCE LAYER
-- ========================================================================================
CREATE TABLE transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
    type transaction_type NOT NULL,
    amount DECIMAL(12, 2) NOT NULL,
    status transaction_status DEFAULT 'Pending',
    payment_method TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE invoices (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
    invoice_number TEXT UNIQUE NOT NULL,
    issued_date DATE DEFAULT CURRENT_DATE,
    due_date DATE,
    total_amount DECIMAL(12, 2) NOT NULL
);

-- ========================================================================================
-- 7. SYSTEM / ADMIN LAYER
-- ========================================================================================
CREATE TABLE activity_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    profile_id UUID REFERENCES user_profiles(id),
    action TEXT NOT NULL,
    entity_type TEXT NOT NULL,
    entity_id UUID,
    metadata JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE file_uploads (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    url TEXT NOT NULL,
    type TEXT, -- 'image', 'document'
    linked_entity TEXT,
    linked_id UUID,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ========================================================================================
-- 8. PERFORMANCE DESIGN (INDEXES)
-- ========================================================================================
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_org_id ON orders(organization_id);
CREATE INDEX idx_delivery_tasks_assigned ON delivery_tasks(assigned_to);
CREATE INDEX idx_production_tracking_item ON production_tracking(order_item_id);
CREATE INDEX idx_interactions_org_id ON interactions(organization_id);

-- ========================================================================================
-- 9. STATE TRANSITION CONTROL (TRIGGERS)
-- ========================================================================================
-- Trigger to auto-update 'updated_at' columns
CREATE OR REPLACE FUNCTION update_modified_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_orders_modtime BEFORE UPDATE ON orders FOR EACH ROW EXECUTE FUNCTION update_modified_column();
CREATE TRIGGER update_production_modtime BEFORE UPDATE ON production_tracking FOR EACH ROW EXECUTE FUNCTION update_modified_column();
CREATE TRIGGER update_inventory_modtime BEFORE UPDATE ON inventory FOR EACH ROW EXECUTE FUNCTION update_modified_column();

-- CRITICAL LOGIC: Enforce Order State Transitions based on Role
CREATE OR REPLACE FUNCTION enforce_order_state_transition()
RETURNS TRIGGER AS $$
DECLARE
    current_user_role user_role;
BEGIN
    -- Skip check if status hasn't changed
    IF OLD.status = NEW.status THEN
        RETURN NEW;
    END IF;

    -- Fetch the role of the user making the change
    SELECT role INTO current_user_role FROM user_profiles WHERE id = auth.uid();

    -- If no user is found (e.g., system process), allow it, or strictly block it.
    -- For safety, we allow ADMIN to do anything.
    IF current_user_role = 'ADMIN' THEN
        RETURN NEW;
    END IF;

    -- Enforce Transitions
    IF OLD.status = 'Draft' AND NEW.status = 'Active' THEN
        IF current_user_role != 'SALES' THEN
            RAISE EXCEPTION 'Only SALES or ADMIN can activate a Draft order.';
        END IF;
        
        -- Automatically mark organization as client when order becomes active
        UPDATE organizations SET is_client = true WHERE id = NEW.organization_id;
    
    ELSIF OLD.status = 'Active' AND NEW.status = 'In Production' THEN
        IF current_user_role != 'SUPERVISOR' THEN
            RAISE EXCEPTION 'Only SUPERVISOR or ADMIN can move an order to In Production.';
        END IF;

    ELSIF OLD.status = 'In Production' AND NEW.status = 'Ready for Delivery' THEN
        IF current_user_role != 'SUPERVISOR' THEN
            RAISE EXCEPTION 'Only SUPERVISOR or ADMIN can mark an order Ready for Delivery.';
        END IF;

    ELSIF OLD.status = 'Ready for Delivery' AND NEW.status = 'Delivered' THEN
        IF current_user_role != 'DELIVERY' THEN
            RAISE EXCEPTION 'Only DELIVERY or ADMIN can mark an order as Delivered.';
        END IF;

    ELSIF OLD.status = 'Delivered' AND NEW.status = 'Closed' THEN
        IF current_user_role != 'ACCOUNTS' THEN
            RAISE EXCEPTION 'Only ACCOUNTS or ADMIN can close a Delivered order.';
        END IF;
    
    ELSE
        RAISE EXCEPTION 'Invalid state transition from % to %', OLD.status, NEW.status;
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER check_order_transition
BEFORE UPDATE OF status ON orders
FOR EACH ROW
EXECUTE FUNCTION enforce_order_state_transition();

-- ========================================================================================
-- 10. ROW LEVEL SECURITY (RLS) FOUNDATION
-- ========================================================================================
-- Enable RLS on all tables
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE interactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE production_tracking ENABLE ROW LEVEL SECURITY;
ALTER TABLE inventory ENABLE ROW LEVEL SECURITY;
ALTER TABLE inventory_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE delivery_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE delivery_task_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE delivery_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_logs ENABLE ROW LEVEL SECURITY;

-- Example Base Policy: Admins can do everything
CREATE POLICY "Admins have full access to user_profiles" ON user_profiles FOR ALL USING (
  (SELECT role FROM user_profiles WHERE id = auth.uid()) = 'ADMIN'
);
-- Users can read their own profile
CREATE POLICY "Users can view own profile" ON user_profiles FOR SELECT USING (auth.uid() = id);

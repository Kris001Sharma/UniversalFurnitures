-- ========================================================================================
-- 0. SCHEMAS & ENUMS
-- ========================================================================================
CREATE SCHEMA IF NOT EXISTS crm;
CREATE SCHEMA IF NOT EXISTS sales;
CREATE SCHEMA IF NOT EXISTS manufacturing;
CREATE SCHEMA IF NOT EXISTS logistics;
CREATE SCHEMA IF NOT EXISTS finance;
CREATE SCHEMA IF NOT EXISTS system;

-- Enums (Created in public schema so they are globally accessible)
CREATE TYPE public.user_role AS ENUM ('ADMIN', 'SALES', 'SUPERVISOR', 'DELIVERY', 'ACCOUNTS');
CREATE TYPE public.org_status AS ENUM ('New', 'Priority', 'Active','Inactive');
CREATE TYPE public.interaction_type AS ENUM ('Visit', 'Call');
CREATE TYPE public.sentiment_type AS ENUM ('Positive', 'Neutral', 'Negative');
CREATE TYPE public.order_status AS ENUM ('Draft', 'Active', 'In Production', 'Ready for Delivery', 'Delivered', 'Closed');
CREATE TYPE public.payment_status AS ENUM ('Pending', 'Partial', 'Paid');
CREATE TYPE public.order_item_status AS ENUM ('Pending', 'In Production', 'Completed');
CREATE TYPE public.production_stage AS ENUM ('Forging', 'Cutting', 'Assembly', 'Painting', 'Finishing');
CREATE TYPE public.inventory_type AS ENUM ('Raw Material', 'Finished Good');
CREATE TYPE public.inventory_change_type AS ENUM ('In', 'Out');
CREATE TYPE public.delivery_status AS ENUM ('Open', 'In Progress', 'Delivered');
CREATE TYPE public.transaction_type AS ENUM ('Income', 'Expense');
CREATE TYPE public.transaction_status AS ENUM ('Pending', 'Completed');
CREATE TYPE public.production_tracking_mode AS ENUM ('Order Level', 'Item Level');

-- ========================================================================================
-- 1. IDENTITY & ACCESS LAYER (Public Schema)
-- ========================================================================================
CREATE TABLE public.user_profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT NOT NULL,
    role public.user_role NOT NULL,
    phone TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ========================================================================================
-- 2. CRM LAYER (crm schema)
-- ========================================================================================
CREATE TABLE crm.organizations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    address TEXT,
    latitude DOUBLE PRECISION,
    longitude DOUBLE PRECISION,
    status public.org_status DEFAULT 'New',
    is_client BOOLEAN DEFAULT false,
    created_by UUID REFERENCES public.user_profiles(id),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE crm.contacts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID REFERENCES crm.organizations(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    phone TEXT,
    email TEXT,
    designation TEXT
);

CREATE TABLE crm.interactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID REFERENCES crm.organizations(id) ON DELETE CASCADE,
    profile_id UUID REFERENCES public.user_profiles(id),
    type public.interaction_type NOT NULL,
    sentiment public.sentiment_type,
    notes TEXT,
    latitude DOUBLE PRECISION,
    longitude DOUBLE PRECISION,
    image_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ========================================================================================
-- 3. ORDER MANAGEMENT (sales schema)
-- ========================================================================================
CREATE TABLE sales.products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    category TEXT,
    unit TEXT,
    base_price DECIMAL(12, 2) NOT NULL,
    is_active BOOLEAN DEFAULT true
);

CREATE TABLE sales.orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID REFERENCES crm.organizations(id),
    created_by UUID REFERENCES public.user_profiles(id),
    assigned_supervisor_id UUID REFERENCES public.user_profiles(id),
    status public.order_status DEFAULT 'Draft',
    payment_status public.payment_status DEFAULT 'Pending',
    total_amount DECIMAL(12, 2) DEFAULT 0.00,
    tracking_mode public.production_tracking_mode,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE sales.order_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID REFERENCES sales.orders(id) ON DELETE CASCADE,
    product_id UUID REFERENCES sales.products(id),
    quantity INTEGER NOT NULL CHECK (quantity > 0),
    unit_price DECIMAL(12, 2) NOT NULL,
    status public.order_item_status DEFAULT 'Pending'
);

-- ========================================================================================
-- 4. MANUFACTURING LAYER (manufacturing schema)
-- ========================================================================================
CREATE TABLE manufacturing.production_tracking (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID REFERENCES sales.orders(id) ON DELETE CASCADE,
    order_item_id UUID REFERENCES sales.order_items(id) ON DELETE CASCADE,
    stage public.production_stage NOT NULL,
    quantity INTEGER NOT NULL CHECK (quantity > 0),
    updated_by UUID REFERENCES public.user_profiles(id),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE manufacturing.inventory (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    item_name TEXT NOT NULL,
    type public.inventory_type NOT NULL,
    quantity_available INTEGER DEFAULT 0,
    unit TEXT,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE manufacturing.inventory_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    inventory_id UUID REFERENCES manufacturing.inventory(id) ON DELETE CASCADE,
    change_type public.inventory_change_type NOT NULL,
    quantity INTEGER NOT NULL,
    reference_type TEXT,
    reference_id UUID,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ========================================================================================
-- 5. LOGISTICS LAYER (logistics schema)
-- ========================================================================================
CREATE TABLE logistics.delivery_tasks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID REFERENCES sales.orders(id) ON DELETE CASCADE,
    assigned_to UUID REFERENCES public.user_profiles(id),
    status public.delivery_status DEFAULT 'Open',
    started_at TIMESTAMPTZ,
    completed_at TIMESTAMPTZ
);

CREATE TABLE logistics.delivery_task_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    task_id UUID REFERENCES logistics.delivery_tasks(id) ON DELETE CASCADE,
    order_item_id UUID REFERENCES sales.order_items(id),
    quantity_assigned INTEGER NOT NULL,
    quantity_delivered INTEGER DEFAULT 0
);

CREATE TABLE logistics.delivery_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    task_id UUID REFERENCES logistics.delivery_tasks(id) ON DELETE CASCADE,
    latitude DOUBLE PRECISION,
    longitude DOUBLE PRECISION,
    note TEXT,
    image_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ========================================================================================
-- 6. FINANCE LAYER (finance schema)
-- ========================================================================================
CREATE TABLE finance.transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID REFERENCES sales.orders(id) ON DELETE CASCADE,
    type public.transaction_type NOT NULL,
    amount DECIMAL(12, 2) NOT NULL,
    status public.transaction_status DEFAULT 'Pending',
    payment_method TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE finance.invoices (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID REFERENCES sales.orders(id) ON DELETE CASCADE,
    invoice_number TEXT UNIQUE NOT NULL,
    issued_date DATE DEFAULT CURRENT_DATE,
    due_date DATE,
    total_amount DECIMAL(12, 2) NOT NULL
);

-- ========================================================================================
-- 7. SYSTEM / ADMIN LAYER (system schema)
-- ========================================================================================
CREATE TABLE system.activity_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    profile_id UUID REFERENCES public.user_profiles(id),
    action TEXT NOT NULL,
    entity_type TEXT NOT NULL,
    entity_id UUID,
    metadata JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE system.file_uploads (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    url TEXT NOT NULL,
    type TEXT,
    linked_entity TEXT,
    linked_id UUID,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ========================================================================================
-- 8. PERFORMANCE DESIGN (INDEXES)
-- ========================================================================================
CREATE INDEX idx_orders_status ON sales.orders(status);
CREATE INDEX idx_orders_org_id ON sales.orders(organization_id);
CREATE INDEX idx_delivery_tasks_assigned ON logistics.delivery_tasks(assigned_to);
CREATE INDEX idx_production_tracking_item ON manufacturing.production_tracking(order_item_id);
CREATE INDEX idx_interactions_org_id ON crm.interactions(organization_id);

-- ========================================================================================
-- 9. STATE TRANSITION CONTROL (TRIGGERS)
-- ========================================================================================
CREATE OR REPLACE FUNCTION public.update_modified_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_orders_modtime BEFORE UPDATE ON sales.orders FOR EACH ROW EXECUTE FUNCTION public.update_modified_column();
CREATE TRIGGER update_production_modtime BEFORE UPDATE ON manufacturing.production_tracking FOR EACH ROW EXECUTE FUNCTION public.update_modified_column();
CREATE TRIGGER update_inventory_modtime BEFORE UPDATE ON manufacturing.inventory FOR EACH ROW EXECUTE FUNCTION public.update_modified_column();

-- CRITICAL LOGIC: Enforce Order State Transitions based on Role
CREATE OR REPLACE FUNCTION public.enforce_order_state_transition()
RETURNS TRIGGER AS $$
DECLARE
    current_user_role public.user_role;
BEGIN
    IF OLD.status = NEW.status THEN
        RETURN NEW;
    END IF;

    SELECT role INTO current_user_role FROM public.user_profiles WHERE id = auth.uid();

    IF current_user_role = 'ADMIN' THEN
        RETURN NEW;
    END IF;

    IF OLD.status = 'Draft' AND NEW.status = 'Active' THEN
        IF current_user_role != 'SALES' THEN
            RAISE EXCEPTION 'Only SALES or ADMIN can activate a Draft order.';
        END IF;
        UPDATE crm.organizations SET is_client = true WHERE id = NEW.organization_id;
    
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
BEFORE UPDATE OF status ON sales.orders
FOR EACH ROW
EXECUTE FUNCTION public.enforce_order_state_transition();

-- ========================================================================================
-- 10. ROW LEVEL SECURITY (RLS) FOUNDATION
-- ========================================================================================
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE crm.organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE crm.contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE crm.interactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE sales.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE sales.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE sales.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE manufacturing.production_tracking ENABLE ROW LEVEL SECURITY;
ALTER TABLE manufacturing.inventory ENABLE ROW LEVEL SECURITY;
ALTER TABLE manufacturing.inventory_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE logistics.delivery_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE logistics.delivery_task_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE logistics.delivery_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE finance.transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE finance.invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE system.activity_logs ENABLE ROW LEVEL SECURITY;

-- Example Base Policy: Admins can do everything
CREATE POLICY "Admins have full access to user_profiles" ON public.user_profiles FOR ALL USING (
  (SELECT role FROM public.user_profiles WHERE id = auth.uid()) = 'ADMIN'
);
CREATE POLICY "Users can view own profile" ON public.user_profiles FOR SELECT USING (auth.uid() = id);

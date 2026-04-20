-- ========================================================================================
-- 0. EXTENSIONS & ENUMS
-- ========================================================================================
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

DO $$ BEGIN CREATE TYPE public.user_role AS ENUM ('Administrator', 'Sales Agent', 'Supervisor', 'Delivery', 'Accountant'); EXCEPTION WHEN duplicate_object THEN null; END $$;
DO $$ BEGIN CREATE TYPE public.org_status AS ENUM ('New', 'Priority', 'Active','Inactive'); EXCEPTION WHEN duplicate_object THEN null; END $$;
DO $$ BEGIN CREATE TYPE public.interaction_type AS ENUM ('Visit', 'Call'); EXCEPTION WHEN duplicate_object THEN null; END $$;
DO $$ BEGIN CREATE TYPE public.sentiment_type AS ENUM ('Positive', 'Neutral', 'Negative'); EXCEPTION WHEN duplicate_object THEN null; END $$;
DO $$ BEGIN CREATE TYPE public.order_status AS ENUM ('Draft', 'Received', 'Active', 'Metal Forging', 'Wood Cutting', 'Assembly', 'Painting', 'Finishing', 'Ready for Delivery', 'Out for Delivery', 'Delivered', 'Closed'); EXCEPTION WHEN duplicate_object THEN null; END $$;
DO $$ BEGIN CREATE TYPE public.payment_status AS ENUM ('Pending', 'Partial', 'Paid'); EXCEPTION WHEN duplicate_object THEN null; END $$;
DO $$ BEGIN CREATE TYPE public.order_item_status AS ENUM ('Pending', 'In Production', 'Completed'); EXCEPTION WHEN duplicate_object THEN null; END $$;
DO $$ BEGIN CREATE TYPE public.production_stage AS ENUM ('Forging', 'Cutting', 'Assembly', 'Painting', 'Finishing'); EXCEPTION WHEN duplicate_object THEN null; END $$;
DO $$ BEGIN CREATE TYPE public.inventory_type AS ENUM ('Raw Material', 'Finished Good'); EXCEPTION WHEN duplicate_object THEN null; END $$;
DO $$ BEGIN CREATE TYPE public.inventory_change_type AS ENUM ('In', 'Out'); EXCEPTION WHEN duplicate_object THEN null; END $$;
DO $$ BEGIN CREATE TYPE public.delivery_status AS ENUM ('Open', 'In Progress', 'Delivered'); EXCEPTION WHEN duplicate_object THEN null; END $$;
DO $$ BEGIN CREATE TYPE public.transaction_type AS ENUM ('Income', 'Expense'); EXCEPTION WHEN duplicate_object THEN null; END $$;
DO $$ BEGIN CREATE TYPE public.transaction_status AS ENUM ('Pending', 'Completed'); EXCEPTION WHEN duplicate_object THEN null; END $$;
DO $$ BEGIN CREATE TYPE public.production_tracking_mode AS ENUM ('Order Level', 'Item Level'); EXCEPTION WHEN duplicate_object THEN null; END $$;

-- ========================================================================================
-- 1. IDENTITY & ACCESS LAYER (Public Schema)
-- ========================================================================================
CREATE TABLE IF NOT EXISTS public.user_profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    role public.user_role NOT NULL,
    status TEXT DEFAULT 'Active',
    last_login TIMESTAMPTZ DEFAULT NOW(),
    reports_to UUID REFERENCES public.user_profiles(id),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Ensure backwards compatibility if old columns exist or need to be added
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='user_profiles' AND column_name='name') THEN
        ALTER TABLE public.user_profiles ADD COLUMN name TEXT;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='user_profiles' AND column_name='email') THEN
        ALTER TABLE public.user_profiles ADD COLUMN email TEXT;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='user_profiles' AND column_name='status') THEN
        ALTER TABLE public.user_profiles ADD COLUMN status TEXT DEFAULT 'Active';
    END IF;
END $$;

CREATE TABLE IF NOT EXISTS public.sales_agent_metrics (
    agent_id UUID PRIMARY KEY REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    leads INTEGER DEFAULT 0,
    active_clients INTEGER DEFAULT 0,
    past_clients INTEGER DEFAULT 0,
    revenue NUMERIC(15,2) DEFAULT 0,
    conversion NUMERIC(5,2) DEFAULT 0,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.accountant_metrics (
    accountant_id UUID PRIMARY KEY REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    processed_invoices INTEGER DEFAULT 0,
    pending_approvals INTEGER DEFAULT 0,
    accuracy TEXT DEFAULT '0%',
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ========================================================================================
-- 2. CRM LAYER
-- ========================================================================================
CREATE TABLE IF NOT EXISTS public.clients (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    address TEXT,
    type TEXT,
    contact_person TEXT,
    contact TEXT,
    email TEXT,
    interest TEXT,
    status public.org_status DEFAULT 'New',
    is_client BOOLEAN DEFAULT false,
    next_follow_up DATE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    latitude DOUBLE PRECISION,
    longitude DOUBLE PRECISION,
    sales_agent_id UUID REFERENCES public.user_profiles(id)
);

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='clients' AND column_name='sales_agent_id') THEN
        ALTER TABLE public.clients ADD COLUMN sales_agent_id UUID REFERENCES public.user_profiles(id);
    END IF;
END $$;

CREATE TABLE IF NOT EXISTS public.contacts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    client_id UUID REFERENCES public.clients(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    phone TEXT,
    email TEXT,
    designation TEXT
);

CREATE TABLE IF NOT EXISTS public.interactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    client_id UUID REFERENCES public.clients(id) ON DELETE CASCADE,
    user_id UUID REFERENCES public.user_profiles(id),
    type public.interaction_type NOT NULL,
    sentiment public.sentiment_type,
    notes TEXT,
    latitude DOUBLE PRECISION,
    longitude DOUBLE PRECISION,
    image_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ========================================================================================
-- 3. ORDER MANAGEMENT
-- ========================================================================================
CREATE TABLE IF NOT EXISTS public.products (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    category TEXT,
    unit TEXT,
    base_price DECIMAL(12, 2) NOT NULL,
    description TEXT,
    image_url TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.orders (
    id TEXT PRIMARY KEY,
    org_id UUID REFERENCES public.clients(id),
    customer_name TEXT NOT NULL,
    sales_agent TEXT,
    category TEXT NOT NULL,
    status public.order_status DEFAULT 'Received',
    payment_status public.payment_status DEFAULT 'Pending',
    total_amount DECIMAL(12, 2) DEFAULT 0.00,
    priority TEXT,
    date DATE DEFAULT CURRENT_DATE,
    expected_delivery DATE,
    tracking_mode TEXT,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.order_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id TEXT REFERENCES public.orders(id) ON DELETE CASCADE,
    product_id TEXT REFERENCES public.products(id),
    quantity INTEGER NOT NULL CHECK (quantity > 0),
    unit_price DECIMAL(12, 2) DEFAULT 0.00,
    status public.order_item_status DEFAULT 'Pending',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ========================================================================================
-- 4. MANUFACTURING LAYER
-- ========================================================================================
CREATE TABLE IF NOT EXISTS public.production_tracking (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id TEXT REFERENCES public.orders(id) ON DELETE CASCADE,
    order_item_id UUID REFERENCES public.order_items(id) ON DELETE CASCADE,
    stage public.production_stage NOT NULL,
    quantity INTEGER NOT NULL CHECK (quantity > 0),
    updated_by UUID REFERENCES public.user_profiles(id),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.inventory (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    category TEXT,
    quantity INTEGER DEFAULT 0,
    unit TEXT,
    min_stock INTEGER DEFAULT 10,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.inventory_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    inventory_id TEXT REFERENCES public.inventory(id) ON DELETE CASCADE,
    change_type public.inventory_change_type NOT NULL,
    quantity INTEGER NOT NULL,
    reference_type TEXT,
    reference_id TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.production_lines (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    status TEXT NOT NULL,
    efficiency INTEGER,
    output INTEGER,
    target INTEGER,
    operator TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.production_log (
    id TEXT PRIMARY KEY,
    product_name TEXT NOT NULL,
    date DATE NOT NULL,
    delivered_to TEXT,
    status TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ========================================================================================
-- 5. LOGISTICS LAYER
-- ========================================================================================
CREATE TABLE IF NOT EXISTS public.delivery_tasks (
    id TEXT PRIMARY KEY,
    order_id TEXT REFERENCES public.orders(id) ON DELETE CASCADE,
    client_name TEXT NOT NULL,
    address TEXT NOT NULL,
    status TEXT DEFAULT 'Open',
    priority TEXT,
    agent_id UUID REFERENCES public.user_profiles(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    started_at TIMESTAMPTZ,
    completed_at TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS public.delivery_task_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    task_id TEXT REFERENCES public.delivery_tasks(id) ON DELETE CASCADE,
    order_item_id UUID REFERENCES public.order_items(id),
    quantity_assigned INTEGER NOT NULL,
    quantity_delivered INTEGER DEFAULT 0
);

CREATE TABLE IF NOT EXISTS public.delivery_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    task_id TEXT REFERENCES public.delivery_tasks(id) ON DELETE CASCADE,
    latitude DOUBLE PRECISION,
    longitude DOUBLE PRECISION,
    note TEXT,
    image_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ========================================================================================
-- 6. FINANCE LAYER
-- ========================================================================================
CREATE TABLE IF NOT EXISTS public.transactions (
    id TEXT PRIMARY KEY,
    order_id TEXT REFERENCES public.orders(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    description TEXT NOT NULL,
    amount DECIMAL(12, 2) NOT NULL,
    type TEXT NOT NULL,
    status TEXT DEFAULT 'Pending',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.invoices (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id TEXT REFERENCES public.orders(id) ON DELETE CASCADE,
    invoice_number TEXT UNIQUE NOT NULL,
    issued_date DATE DEFAULT CURRENT_DATE,
    due_date DATE,
    total_amount DECIMAL(12, 2) NOT NULL
);

-- ========================================================================================
-- 7. SYSTEM / ADMIN LAYER
-- ========================================================================================
CREATE TABLE IF NOT EXISTS public.activity_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.user_profiles(id),
    action TEXT NOT NULL,
    entity_type TEXT NOT NULL,
    entity_id TEXT,
    metadata JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.file_uploads (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    url TEXT NOT NULL,
    type TEXT,
    linked_entity TEXT,
    linked_id TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ========================================================================================
-- 8. PERFORMANCE DESIGN (INDEXES)
-- ========================================================================================
CREATE INDEX IF NOT EXISTS idx_orders_status ON public.orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_org_id ON public.orders(org_id);
CREATE INDEX IF NOT EXISTS idx_delivery_tasks_assigned ON public.delivery_tasks(agent_id);
CREATE INDEX IF NOT EXISTS idx_production_tracking_item ON public.production_tracking(order_item_id);
CREATE INDEX IF NOT EXISTS idx_interactions_org_id ON public.interactions(client_id);

-- ========================================================================================
-- 9. TRIGGERS & METRICS CALCULATIONS
-- ========================================================================================
CREATE OR REPLACE FUNCTION public.recalculate_sales_metrics(agent_uuid UUID)
RETURNS VOID AS $$
DECLARE
    v_leads INT;
    v_active INT;
    v_past INT;
    v_revenue NUMERIC;
    v_conversion NUMERIC;
BEGIN
    SELECT COUNT(*) INTO v_leads FROM public.clients WHERE sales_agent_id = agent_uuid AND is_client = false AND status != 'Inactive';
    SELECT COUNT(*) INTO v_active FROM public.clients WHERE sales_agent_id = agent_uuid AND is_client = true AND status = 'Active';
    SELECT COUNT(*) INTO v_past FROM public.clients WHERE sales_agent_id = agent_uuid AND is_client = true AND status = 'Inactive';
    
    SELECT COALESCE(SUM(total_amount), 0) INTO v_revenue FROM public.orders o JOIN public.clients c ON o.org_id = c.id WHERE c.sales_agent_id = agent_uuid AND o.status = 'Closed';
    
    IF (v_leads + v_active + v_past) > 0 THEN
        v_conversion := ROUND((v_active + v_past)::NUMERIC / (v_leads + v_active + v_past)::NUMERIC * 100, 2);
    ELSE
        v_conversion := 0;
    END IF;

    INSERT INTO public.sales_agent_metrics (agent_id, leads, active_clients, past_clients, revenue, conversion, updated_at)
    VALUES (agent_uuid, v_leads, v_active, v_past, v_revenue, v_conversion, NOW())
    ON CONFLICT (agent_id) DO UPDATE 
    SET leads = EXCLUDED.leads, active_clients = EXCLUDED.active_clients, past_clients = EXCLUDED.past_clients, revenue = EXCLUDED.revenue, conversion = EXCLUDED.conversion, updated_at = NOW();
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION public.update_sales_metrics_on_client_change()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' AND NEW.sales_agent_id IS NOT NULL THEN
        PERFORM public.recalculate_sales_metrics(NEW.sales_agent_id);
    ELSIF TG_OP = 'UPDATE' THEN
        IF NEW.sales_agent_id IS NOT NULL THEN
            PERFORM public.recalculate_sales_metrics(NEW.sales_agent_id);
        END IF;
        IF OLD.sales_agent_id IS NOT NULL AND OLD.sales_agent_id <> COALESCE(NEW.sales_agent_id, '00000000-0000-0000-0000-000000000000'::UUID) THEN
            PERFORM public.recalculate_sales_metrics(OLD.sales_agent_id);
        END IF;
    ELSIF TG_OP = 'DELETE' AND OLD.sales_agent_id IS NOT NULL THEN
        PERFORM public.recalculate_sales_metrics(OLD.sales_agent_id);
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION public.update_sales_metrics_on_order_change()
RETURNS TRIGGER AS $$
DECLARE
    v_agent_id UUID;
BEGIN
    IF TG_OP = 'INSERT' OR TG_OP = 'UPDATE' THEN
        SELECT sales_agent_id INTO v_agent_id FROM public.clients WHERE id = NEW.org_id;
        IF v_agent_id IS NOT NULL THEN
            PERFORM public.recalculate_sales_metrics(v_agent_id);
        END IF;
    END IF;
    IF TG_OP = 'DELETE' OR TG_OP = 'UPDATE' THEN
        SELECT sales_agent_id INTO v_agent_id FROM public.clients WHERE id = OLD.org_id;
        IF v_agent_id IS NOT NULL THEN
            PERFORM public.recalculate_sales_metrics(v_agent_id);
        END IF;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_sales_metrics_client ON public.clients;
CREATE TRIGGER trigger_sales_metrics_client
AFTER INSERT OR UPDATE OR DELETE ON public.clients
FOR EACH ROW EXECUTE FUNCTION public.update_sales_metrics_on_client_change();

DROP TRIGGER IF EXISTS trigger_sales_metrics_order ON public.orders;
CREATE TRIGGER trigger_sales_metrics_order
AFTER INSERT OR UPDATE OR DELETE ON public.orders
FOR EACH ROW EXECUTE FUNCTION public.update_sales_metrics_on_order_change();


CREATE OR REPLACE FUNCTION public.update_modified_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS update_orders_modtime ON public.orders;
CREATE TRIGGER update_orders_modtime BEFORE UPDATE ON public.orders FOR EACH ROW EXECUTE FUNCTION public.update_modified_column();

DROP TRIGGER IF EXISTS update_production_modtime ON public.production_tracking;
CREATE TRIGGER update_production_modtime BEFORE UPDATE ON public.production_tracking FOR EACH ROW EXECUTE FUNCTION public.update_modified_column();

DROP TRIGGER IF EXISTS update_inventory_modtime ON public.inventory;
CREATE TRIGGER update_inventory_modtime BEFORE UPDATE ON public.inventory FOR EACH ROW EXECUTE FUNCTION public.update_modified_column();

DROP TRIGGER IF EXISTS update_clients_modtime ON public.clients;
CREATE TRIGGER update_clients_modtime BEFORE UPDATE ON public.clients FOR EACH ROW EXECUTE FUNCTION public.update_modified_column();

-- ========================================================================================
-- 10. ROW LEVEL SECURITY (RLS) FOUNDATION
-- ========================================================================================
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sales_agent_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.accountant_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.interactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.production_tracking ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inventory ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inventory_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.production_lines ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.production_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.delivery_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.delivery_task_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.delivery_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activity_logs ENABLE ROW LEVEL SECURITY;

-- Disable RLS partially or add blanket rules
DO $$ BEGIN CREATE POLICY "Authenticated users have full access" ON public.user_profiles FOR ALL USING (auth.role() = 'authenticated'); EXCEPTION WHEN duplicate_object THEN null; END $$;
DO $$ BEGIN CREATE POLICY "Authenticated users can use sales_agent_metrics" ON public.sales_agent_metrics FOR ALL USING (auth.role() = 'authenticated'); EXCEPTION WHEN duplicate_object THEN null; END $$;
DO $$ BEGIN CREATE POLICY "Authenticated users can use accountant_metrics" ON public.accountant_metrics FOR ALL USING (auth.role() = 'authenticated'); EXCEPTION WHEN duplicate_object THEN null; END $$;
DO $$ BEGIN CREATE POLICY "Authenticated users can use clients" ON public.clients FOR ALL USING (auth.role() = 'authenticated'); EXCEPTION WHEN duplicate_object THEN null; END $$;
DO $$ BEGIN CREATE POLICY "Authenticated users can use contacts" ON public.contacts FOR ALL USING (auth.role() = 'authenticated'); EXCEPTION WHEN duplicate_object THEN null; END $$;
DO $$ BEGIN CREATE POLICY "Authenticated users can use interactions" ON public.interactions FOR ALL USING (auth.role() = 'authenticated'); EXCEPTION WHEN duplicate_object THEN null; END $$;
DO $$ BEGIN CREATE POLICY "Authenticated users can use products" ON public.products FOR ALL USING (auth.role() = 'authenticated'); EXCEPTION WHEN duplicate_object THEN null; END $$;
DO $$ BEGIN CREATE POLICY "Authenticated users can use orders" ON public.orders FOR ALL USING (auth.role() = 'authenticated'); EXCEPTION WHEN duplicate_object THEN null; END $$;
DO $$ BEGIN CREATE POLICY "Authenticated users can use order_items" ON public.order_items FOR ALL USING (auth.role() = 'authenticated'); EXCEPTION WHEN duplicate_object THEN null; END $$;
DO $$ BEGIN CREATE POLICY "Authenticated users can use production_tracking" ON public.production_tracking FOR ALL USING (auth.role() = 'authenticated'); EXCEPTION WHEN duplicate_object THEN null; END $$;
DO $$ BEGIN CREATE POLICY "Authenticated users can use inventory" ON public.inventory FOR ALL USING (auth.role() = 'authenticated'); EXCEPTION WHEN duplicate_object THEN null; END $$;
DO $$ BEGIN CREATE POLICY "Authenticated users can use inventory_logs" ON public.inventory_logs FOR ALL USING (auth.role() = 'authenticated'); EXCEPTION WHEN duplicate_object THEN null; END $$;
DO $$ BEGIN CREATE POLICY "Authenticated users can use production_lines" ON public.production_lines FOR ALL USING (auth.role() = 'authenticated'); EXCEPTION WHEN duplicate_object THEN null; END $$;
DO $$ BEGIN CREATE POLICY "Authenticated users can use production_log" ON public.production_log FOR ALL USING (auth.role() = 'authenticated'); EXCEPTION WHEN duplicate_object THEN null; END $$;
DO $$ BEGIN CREATE POLICY "Authenticated users can use delivery_tasks" ON public.delivery_tasks FOR ALL USING (auth.role() = 'authenticated'); EXCEPTION WHEN duplicate_object THEN null; END $$;
DO $$ BEGIN CREATE POLICY "Authenticated users can use delivery_task_items" ON public.delivery_task_items FOR ALL USING (auth.role() = 'authenticated'); EXCEPTION WHEN duplicate_object THEN null; END $$;
DO $$ BEGIN CREATE POLICY "Authenticated users can use delivery_logs" ON public.delivery_logs FOR ALL USING (auth.role() = 'authenticated'); EXCEPTION WHEN duplicate_object THEN null; END $$;
DO $$ BEGIN CREATE POLICY "Authenticated users can use transactions" ON public.transactions FOR ALL USING (auth.role() = 'authenticated'); EXCEPTION WHEN duplicate_object THEN null; END $$;
DO $$ BEGIN CREATE POLICY "Authenticated users can use invoices" ON public.invoices FOR ALL USING (auth.role() = 'authenticated'); EXCEPTION WHEN duplicate_object THEN null; END $$;
DO $$ BEGIN CREATE POLICY "Authenticated users can use activity_logs" ON public.activity_logs FOR ALL USING (auth.role() = 'authenticated'); EXCEPTION WHEN duplicate_object THEN null; END $$;

-- Create profiles table
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  role TEXT NOT NULL CHECK (role IN ('client', 'admin', 'delivery')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create food_items table
CREATE TABLE food_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  category TEXT NOT NULL,
  image TEXT NOT NULL,
  available BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create orders table
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id),
  status TEXT NOT NULL CHECK (status IN ('pending', 'accepted', 'picked', 'delivered', 'cancelled')),
  total DECIMAL(10, 2) NOT NULL,
  delivery_address TEXT NOT NULL,
  delivery_time TIMESTAMP WITH TIME ZONE,
  delivery_person_id UUID REFERENCES profiles(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create order_items table
CREATE TABLE order_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  food_item_id UUID NOT NULL REFERENCES food_items(id),
  quantity INTEGER NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create RLS policies

-- Profiles table policies
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Allow users to read their own profile
CREATE POLICY "Users can view own profile" 
  ON profiles FOR SELECT 
  USING (auth.uid() = id);

-- Allow admins to read all profiles
CREATE POLICY "Admins can view all profiles" 
  ON profiles FOR SELECT 
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

-- Allow users to update their own profile
CREATE POLICY "Users can update own profile" 
  ON profiles FOR UPDATE 
  USING (auth.uid() = id);

-- Food items table policies
ALTER TABLE food_items ENABLE ROW LEVEL SECURITY;

-- Allow anyone to read food items
CREATE POLICY "Anyone can view food items" 
  ON food_items FOR SELECT 
  USING (true);

-- Allow admins to insert, update, delete food items
CREATE POLICY "Admins can manage food items" 
  ON food_items FOR ALL 
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

-- Orders table policies
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- Allow clients to read their own orders
CREATE POLICY "Clients can view own orders" 
  ON orders FOR SELECT 
  USING (auth.uid() = user_id);

-- Allow clients to create orders
CREATE POLICY "Clients can create orders" 
  ON orders FOR INSERT 
  WITH CHECK (auth.uid() = user_id AND EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'client'));

-- Allow delivery personnel to view assigned orders
CREATE POLICY "Delivery personnel can view assigned orders" 
  ON orders FOR SELECT 
  USING (auth.uid() = delivery_person_id);

-- Allow delivery personnel to update assigned orders
CREATE POLICY "Delivery personnel can update assigned orders" 
  ON orders FOR UPDATE 
  USING (auth.uid() = delivery_person_id);

-- Allow admins to view and manage all orders
CREATE POLICY "Admins can manage all orders" 
  ON orders FOR ALL 
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

-- Order items table policies
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

-- Allow clients to view their own order items
CREATE POLICY "Clients can view own order items" 
  ON order_items FOR SELECT 
  USING (EXISTS (SELECT 1 FROM orders WHERE orders.id = order_items.order_id AND orders.user_id = auth.uid()));

-- Allow clients to create order items
CREATE POLICY "Clients can create order items" 
  ON order_items FOR INSERT 
  WITH CHECK (EXISTS (SELECT 1 FROM orders WHERE orders.id = order_items.order_id AND orders.user_id = auth.uid()));

-- Allow delivery personnel to view assigned order items
CREATE POLICY "Delivery personnel can view assigned order items" 
  ON order_items FOR SELECT 
  USING (EXISTS (SELECT 1 FROM orders WHERE orders.id = order_items.order_id AND orders.delivery_person_id = auth.uid()));

-- Allow admins to view and manage all order items
CREATE POLICY "Admins can manage all order items" 
  ON order_items FOR ALL 
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

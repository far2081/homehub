# HomeHub — Supabase Database Setup & Administrator Guide

This guide walks you through running [`supabase/HOMEHUB_DATABASE_SETUP.sql`](file:///c:/Users/zuni/Desktop/webstore/supabase/HOMEHUB_DATABASE_SETUP.sql) in your Supabase project (`webstore`), setting up the security policies, and granting administrative access.

---

## 1. How to Open the Supabase SQL Editor

1. Open your browser and log in to [Supabase Dashboard](https://supabase.com/dashboard).
2. Select your project named **`webstore`**.
3. In the left-hand navigation sidebar, click on the **SQL Editor** icon (shaped like a terminal prompt `>_` or SQL icon).
4. Click **`+ New query`** (or **`New query`** button at the top).
5. Name the query tab: `HomeHub Database Setup`.

---

## 2. How to Run the SQL File

1. Open [`supabase/HOMEHUB_DATABASE_SETUP.sql`](file:///c:/Users/zuni/Desktop/webstore/supabase/HOMEHUB_DATABASE_SETUP.sql) in your code editor.
2. Copy the **entire contents** of the file (Ctrl+A, Ctrl+C).
3. Paste the contents into the Supabase SQL Editor query window.
4. Click the green **`Run`** button (or press `Ctrl + Enter` / `Cmd + Enter`).
5. Wait 2–5 seconds until you see:
   ```text
   Success. No rows returned.
   ```
6. The database setup is complete. This script has:
   - Created the `uuid-ossp` and `pgcrypto` extensions.
   - Built the 6 core tables: `categories`, `products`, `customers`, `orders`, `order_items`, and `admin_profiles`.
   - Applied indexes and automatic `updated_at` triggers.
   - Activated Row Level Security (RLS) on all tables with strict access policies.
   - Created the secure server-side checkout function `create_homehub_order()`.
   - Created the public `product-images` Supabase Storage bucket with admin-only upload policies.
   - Seeded all 9 HomeHub categories and all 14 core luxury furniture, lighting, and décor pieces with verified pricing in PKR.

---

## 3. How to Create the First Administrator Securely

To prevent unauthorized public visitors from registering as administrators, administrator profiles are strictly linked to authenticated Supabase accounts.

### Step 3.1: Create the User in Supabase Authentication
1. In the Supabase dashboard sidebar, click **Authentication** $\rightarrow$ **Users**.
2. Click **`Add user`** $\rightarrow$ **`Create user`**.
3. Enter your administrator details:
   - **Email:** `admin@homehub.atelier` (or your preferred admin email)
   - **Password:** A strong, secure password (e.g. `HomeHub@Atelier2026`)
   - **Auto Confirm User?:** Toggle **ON** (Yes, auto-confirm so you can log in immediately without waiting for an email verification).
4. Click **`Create user`**.
5. Once created, copy the user's **User UID** (a UUID string, e.g. `a1b2c3d4-e5f6-7890-abcd-ef1234567890`).

### Step 3.2: Register the UID in `admin_profiles`
1. Go back to the **SQL Editor** in Supabase.
2. Run the following command (replace `<PASTE_USER_UID_HERE>` and the email with your actual values):

```sql
INSERT INTO public.admin_profiles (id, email, full_name, role, is_active)
VALUES (
    '<PASTE_USER_UID_HERE>',
    'admin@homehub.atelier',
    'Farhana Aamir',
    'SUPER_ADMIN',
    TRUE
)
ON CONFLICT (id) DO UPDATE SET
    role = 'SUPER_ADMIN',
    is_active = TRUE;
```

3. Click **`Run`**. Your account now has full administrative privileges over products, orders, categories, and storage.

---

## 4. How to Verify All Tables and Policies Were Created

### Step 4.1: Verify Tables via Table Editor
In the Supabase dashboard sidebar, click **Table Editor**:
- [x] **`categories`** — Contains all 9 categories (`bedroom`, `living-room`, `dining-room`, `furniture`, `small-spaces`, `kitchen`, `lighting`, `decor`, `storage`).
- [x] **`products`** — Contains all 14 initial luxury pieces with images, variants, dimensions, and prices in PKR.
- [x] **`customers`** — Ready to receive guest or authenticated customer profiles.
- [x] **`orders`** — Ready for verified order transactions.
- [x] **`order_items`** — Ready for line items.
- [x] **`admin_profiles`** — Contains your newly registered administrator record.

### Step 4.2: Verify Row Level Security (RLS) Status
Run this quick query in the SQL Editor to confirm that all tables are protected:

```sql
SELECT tablename, rowsecurity
FROM pg_tables
WHERE schemaname = 'public'
  AND tablename IN ('categories', 'products', 'customers', 'orders', 'order_items', 'admin_profiles');
```
*Every row will return `rowsecurity = true`.*

### Step 4.3: Verify Supabase Storage Bucket
In the Supabase dashboard sidebar, click **Storage**:
- You will see the bucket **`product-images`** marked as **Public Bucket** with a 10MB file limit.
- RLS policies ensure public visitors can view images, but only users in `admin_profiles` can upload, update, or delete images.

### Step 4.4: Verify Server-Side Checkout Function
In the SQL Editor, run:
```sql
SELECT proname, prosecdef 
FROM pg_proc 
WHERE proname IN ('create_homehub_order', 'is_admin');
```
*Both functions will return `prosecdef = true` (`SECURITY DEFINER`), guaranteeing safe execution without exposing credentials.*

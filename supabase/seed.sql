-- Create initial schema for Legal MVP

CREATE TABLE IF NOT EXISTS public.profiles (
  id uuid primary key default gen_random_uuid(),
  first_name text not null,
  last_name text not null,
  -- common Algerian identity fields (NIN: Numéro d'Identification Nationale)
  nin text unique,
  email text unique,
  phone text
);

CREATE TABLE IF NOT EXISTS public.cases (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id),
  case_type text not null, -- 'MISE_EN_DEMEURE', 'INJONCTION_DE_PAYER', 'LITIGE_TRAVAIL'
  status text not null default 'DRAFT', -- DRAFT, PENDING, GENERATED, SUBMITTED
  opponent_name text not null,
  opponent_address text,
  principal_amount numeric,
  created_at timestamp with time zone default timezone('utc'::text, now()),
  updated_at timestamp with time zone default timezone('utc'::text, now())
);

-- Fake Algerian Identities
INSERT INTO public.profiles (id, first_name, last_name, nin, email, phone) VALUES
  ('d1f7cbbb-4b6e-4e5c-a1b2-c0ffee123456', 'Amine', 'Benali', '198516000001234567', 'amine.benali@example.dz', '+213770123456'),
  ('f3e4d5c6-b7a8-9a0b-1c2d-3e4f5a6b7c8d', 'Fatima', 'Boukhalfa', '199016000009876543', 'fatima.b@example.dz', '+213550987654'),
  ('a1b2c3d4-e5f6-4a5b-8c7d-9e0f1a2b3c4d', 'Karim', 'Zerrouk', '198216000004561239', 'karim.z@entreprise.dz', '+213661456789')
ON CONFLICT (id) DO NOTHING;

-- Fake Legal Scenarios
INSERT INTO public.cases (user_id, case_type, status, opponent_name, opponent_address, principal_amount) VALUES
  -- Amine's unpaid invoice from a client in Bab Ezzouar
  ('d1f7cbbb-4b6e-4e5c-a1b2-c0ffee123456', 'MISE_EN_DEMEURE', 'GENERATED', 'Sarl El Houda Import/Export', 'Quartier d''Affaires, Bab Ezzouar, Alger', 450000.00),
  
  -- Fatima's rental dispute with her landlord in Oran
  ('f3e4d5c6-b7a8-9a0b-1c2d-3e4f5a6b7c8d', 'MISE_EN_DEMEURE', 'DRAFT', 'Ahmed Mansouri', 'Rue Khemisti, Oran', 120000.00),
  
  -- Karim's labor dispute with former employer
  ('a1b2c3d4-e5f6-4a5b-8c7d-9e0f1a2b3c4d', 'LITIGE_TRAVAIL', 'PENDING', 'SARL Construction Moderne', 'Zone Industrielle Rouiba, Alger', NULL),
  
  -- Another unpaid invoice for Amine requiring Injonction de Payer
  ('d1f7cbbb-4b6e-4e5c-a1b2-c0ffee123456', 'INJONCTION_DE_PAYER', 'DRAFT', 'EURL Tech Nord', 'Rue Didouche Mourad, Alger', 250000.00);

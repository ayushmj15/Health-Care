-- ============================================================================
-- Health Care — Doctor contact details (phone + WhatsApp)
-- Lets patients call or WhatsApp doctors directly from hospital cards,
-- the booking flow and their appointment list.
-- ============================================================================

-- ----------------------------------------------------------------------------
-- 1. Add phone and whatsapp columns to the doctors table
-- ----------------------------------------------------------------------------
alter table public.doctors
    add column if not exists phone text,
    add column if not exists whatsapp text;

-- ----------------------------------------------------------------------------
-- 2. Backfill deterministic demo numbers for existing doctors so every
--    doctor has a working call + WhatsApp link right away.
--    Pattern: phone = +91 9xxxx xxxxx (10-digit mobile), whatsapp shares
--    the same number. Each doctor gets a unique number derived from a
--    stable row order.
-- ----------------------------------------------------------------------------
with numbered as (
    select id,
           row_number() over (order by created_at, id) as rn
    from public.doctors
)
update public.doctors d
set phone    = '+91 9' || lpad(n.rn::text, 9, '0'),
    whatsapp = '+91 9' || lpad(n.rn::text, 9, '0')
from numbered n
where d.id = n.id
  and (d.phone is null or d.whatsapp is null);
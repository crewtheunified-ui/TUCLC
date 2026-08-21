-- TUCLC Admin/RLS safety setup
-- Your Supabase project already has the six required tables.
-- In Supabase Dashboard > SQL Editor, run this if the Admin receives permission errors.
-- Replace nothing: the Admin email is crewtheunified@gmail.com.

alter table public.students enable row level security;
alter table public.teachers enable row level security;
alter table public.exam_results enable row level security;
alter table public.notices enable row level security;
alter table public.admissions enable row level security;
alter table public.site_settings enable row level security;

-- If you already have policies with the same names, skip those duplicate CREATE POLICY lines.
create policy tuclc_students_public_read on public.students for select using (true);
create policy tuclc_teachers_public_read on public.teachers for select using (true);
create policy tuclc_results_public_read on public.exam_results for select using (published = true or (auth.jwt()->>'email') = 'crewtheunified@gmail.com');
create policy tuclc_notices_public_read on public.notices for select using (published = true or (auth.jwt()->>'email') = 'crewtheunified@gmail.com');
create policy tuclc_admissions_public_insert on public.admissions for insert with check (true);
create policy tuclc_admissions_admin_read on public.admissions for select using ((auth.jwt()->>'email') = 'crewtheunified@gmail.com');
create policy tuclc_settings_public_read on public.site_settings for select using (true);

create policy tuclc_students_admin_insert on public.students for insert with check ((auth.jwt()->>'email') = 'crewtheunified@gmail.com');
create policy tuclc_students_admin_update on public.students for update using ((auth.jwt()->>'email') = 'crewtheunified@gmail.com') with check ((auth.jwt()->>'email') = 'crewtheunified@gmail.com');
create policy tuclc_students_admin_delete on public.students for delete using ((auth.jwt()->>'email') = 'crewtheunified@gmail.com');
create policy tuclc_teachers_admin_insert on public.teachers for insert with check ((auth.jwt()->>'email') = 'crewtheunified@gmail.com');
create policy tuclc_teachers_admin_update on public.teachers for update using ((auth.jwt()->>'email') = 'crewtheunified@gmail.com') with check ((auth.jwt()->>'email') = 'crewtheunified@gmail.com');
create policy tuclc_teachers_admin_delete on public.teachers for delete using ((auth.jwt()->>'email') = 'crewtheunified@gmail.com');
create policy tuclc_results_admin_insert on public.exam_results for insert with check ((auth.jwt()->>'email') = 'crewtheunified@gmail.com');
create policy tuclc_results_admin_update on public.exam_results for update using ((auth.jwt()->>'email') = 'crewtheunified@gmail.com') with check ((auth.jwt()->>'email') = 'crewtheunified@gmail.com');
create policy tuclc_results_admin_delete on public.exam_results for delete using ((auth.jwt()->>'email') = 'crewtheunified@gmail.com');
create policy tuclc_notices_admin_insert on public.notices for insert with check ((auth.jwt()->>'email') = 'crewtheunified@gmail.com');
create policy tuclc_notices_admin_update on public.notices for update using ((auth.jwt()->>'email') = 'crewtheunified@gmail.com') with check ((auth.jwt()->>'email') = 'crewtheunified@gmail.com');
create policy tuclc_notices_admin_delete on public.notices for delete using ((auth.jwt()->>'email') = 'crewtheunified@gmail.com');
create policy tuclc_admissions_admin_update on public.admissions for update using ((auth.jwt()->>'email') = 'crewtheunified@gmail.com') with check ((auth.jwt()->>'email') = 'crewtheunified@gmail.com');
create policy tuclc_admissions_admin_delete on public.admissions for delete using ((auth.jwt()->>'email') = 'crewtheunified@gmail.com');
create policy tuclc_settings_admin_insert on public.site_settings for insert with check ((auth.jwt()->>'email') = 'crewtheunified@gmail.com');
create policy tuclc_settings_admin_update on public.site_settings for update using ((auth.jwt()->>'email') = 'crewtheunified@gmail.com') with check ((auth.jwt()->>'email') = 'crewtheunified@gmail.com');

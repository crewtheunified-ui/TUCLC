# TUCLC Final — Supabase + Vercel

এই version-এ পুরোনো localStorage/demo Admin বাদ দিয়ে Supabase Auth + online database ব্যবহার করা হয়েছে। আগের HTML-এ data localStorage-এ থাকত; এই version-এ students, teachers, exam_results, notices, admissions এবং site_settings Supabase table ব্যবহার করে।

## 1) Supabase Admin account
Supabase Dashboard → Authentication → Users → Add user → Create new user.

Email: `crewtheunified@gmail.com`
Password: নিজের শক্তিশালী password দিন।

## 2) যদি Admin-এ permission error আসে
Supabase Dashboard → SQL Editor → `admin-setup.sql` খুলে SQL run করুন।

## 3) Vercel/GitHub
এই folder-এর সব file GitHub-এর `TUCLC` repository-তে upload করুন। Vercel project-টিকে ওই repository-র সঙ্গে connect করুন। তারপর commit push হলে Vercel automatically deploy করবে।

## 4) গুরুত্বপূর্ণ
`SUPABASE_KEY` হলো publishable/anon frontend key। এখানে service_role key ব্যবহার করা হয়নি। Admin নিরাপত্তা Supabase Auth + Row Level Security-এর ওপর নির্ভর করে।

## 5) Public website
`index.html` public homepage। `admin.html` শুধু Admin account দিয়ে ব্যবহার করা যাবে।
TUCLC Vercel deployment connected.

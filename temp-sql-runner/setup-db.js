const token = "sbp_500ee9b1fc0c063eb050622e0af7e52914fcbc13";
const projectRef = "cyedbvictfuezubiavoy";

const sql = `
create table if not exists progress (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users not null,
  day integer not null,
  completed_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(user_id, day)
);

alter table progress enable row level security;

drop policy if exists "Users can view own progress." on progress;
create policy "Users can view own progress."
  on progress for select
  using ( auth.uid() = user_id );

drop policy if exists "Users can insert own progress." on progress;
create policy "Users can insert own progress."
  on progress for insert
  with check ( auth.uid() = user_id );

drop policy if exists "Users can update own progress." on progress;
create policy "Users can update own progress."
  on progress for update
  using ( auth.uid() = user_id )
  with check ( auth.uid() = user_id );

drop policy if exists "Users can delete own progress." on progress;
create policy "Users can delete own progress."
  on progress for delete
  using ( auth.uid() = user_id );
`;

async function runSQL() {
  const url = `https://api.supabase.com/v1/projects/${projectRef}/database/query`;
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ query: sql })
    });
    
    if (!res.ok) {
      const errText = await res.text();
      console.error("HTTP Error:", res.status, errText);
      process.exit(1);
    }
    
    const data = await res.json();
    console.log("Success:", data);
  } catch(e) {
    console.error("Exception:", e);
  }
}

runSQL();

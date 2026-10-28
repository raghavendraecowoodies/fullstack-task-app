import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { createClient } from '@supabase/supabase-js';

const app = express();
app.use(cors({ origin: process.env.FRONTEND_URL }));
app.use(express.json());

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

app.get('/health', (_, res) => res.json({ ok: true }));

app.get('/api/tasks', async (_, res) => {
  const { data, error } = await supabase.from('tasks').select('*').order('id');
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

app.post('/api/tasks', async (req, res) => {
  const title = req.body.title?.trim();
  if (!title) return res.status(400).json({ error: 'Title is required' });
  const { data, error } = await supabase.from('tasks').insert({ title }).select().single();
  if (error) return res.status(500).json({ error: error.message });
  res.status(201).json(data);
});

app.patch('/api/tasks/:id', async (req, res) => {
  const { data, error } = await supabase.from('tasks')
    .update({ done: !!req.body.done }).eq('id', req.params.id).select().single();
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

app.delete('/api/tasks/:id', async (req, res) => {
  const { error } = await supabase.from('tasks').delete().eq('id', req.params.id);
  if (error) return res.status(500).json({ error: error.message });
  res.status(204).end();
});

const port = process.env.PORT || 4000;
app.listen(port, () => console.log(`API on ${port}`));
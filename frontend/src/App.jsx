import { useEffect, useState } from 'react';
const API = import.meta.env.VITE_API_URL;

export default function App() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState('');
  const [error, setError] = useState('');

  const load = async () => {
    try {
      const res = await fetch(`${API}/api/tasks`);
      setTasks(await res.json());
    } catch { setError('Could not load tasks'); }
  };
  useEffect(() => { load(); }, []);

  const add = async () => {
    if (!title.trim()) return;
    await fetch(`${API}/api/tasks`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title }),
    });
    setTitle(''); load();
  };
  const toggle = async (t) => {
    await fetch(`${API}/api/tasks/${t.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ done: !t.done }),
    });
    load();
  };
  const remove = async (id) => {
    await fetch(`${API}/api/tasks/${id}`, { method: 'DELETE' });
    load();
  };

  return (
    <div style={{ maxWidth: 480, margin: '40px auto', fontFamily: 'sans-serif' }}>
      <h1>Task Tracker</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <input value={title} onChange={e => setTitle(e.target.value)} placeholder="New task" />
      <button onClick={add}>Add</button>
      <ul>
        {tasks.map(t => (
          <li key={t.id}>
            <input type="checkbox" checked={t.done} onChange={() => toggle(t)} />
            <span style={{ textDecoration: t.done ? 'line-through' : 'none' }}>{t.title}</span>
            <button onClick={() => remove(t.id)}>✕</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
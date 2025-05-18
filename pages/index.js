import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/router';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

export default function Home() {
  const [mood, setMood] = useState('');
  const [journal, setJournal] = useState('');
  const [response, setResponse] = useState('');
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingUser, setLoadingUser] = useState(true);
  const router = useRouter();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) router.push('/login');
      else {
        setLoadingUser(false);
        fetchHistory();
      }
    });
  }, []);

  async function fetchHistory() {
    const { data: { user } } = await supabase.auth.getUser();
    const { data } = await supabase
      .from('entries')
      .select('mood, created_at')
      .eq('user_id', user.id)
      .order('created_at', { ascending: true });
    setHistory(data || []);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    const res = await fetch('/api/analyze', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ mood, journal }),
    });
    const data = await res.json();
    setResponse(data.message);
    setLoading(false);
    setMood('');
    setJournal('');
    fetchHistory();
  }

  if (loadingUser) return <div className="p-4">Loading user...</div>;

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">SerenityAI - Mood Journal</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          className="w-full border p-2 rounded"
          placeholder="Your mood (e.g. anxious, happy, tired)"
          value={mood}
          onChange={(e) => setMood(e.target.value)}
        />
        <textarea
          className="w-full border p-2 rounded h-32"
          placeholder="Write about your day or how you're feeling..."
          value={journal}
          onChange={(e) => setJournal(e.target.value)}
        />
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded"
          disabled={loading}
        >
          {loading ? 'Analyzing...' : 'Submit'}
        </button>
      </form>

      {response && (
        <div className="mt-6 p-4 bg-green-100 rounded">
          <strong>AI Response:</strong>
          <p>{response}</p>
        </div>
      )}

      <h2 className="text-xl mt-8 mb-2 font-semibold">Mood History</h2>
      <ResponsiveContainer width="100%" height={250}>
        <LineChart data={history.map((entry, i) => ({
          name: new Date(entry.created_at).toLocaleDateString(),
          mood: entry.mood.length,
        }))}>
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="mood" stroke="#8884d8" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
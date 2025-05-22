import { Configuration, OpenAIApi } from 'openai';
import { supabase } from '../../Lib/supabase';

const config = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(config);

export default async function handler(req, res) {
  const { mood, journal } = req.body;

  if (!mood || !journal) {
    return res.status(400).json({ message: 'Mood and journal are required' });
  }

  const prompt = 'The user is feeling "${mood}" and wrote: "${journal}". Respond with a short, calming, and helpful message like a supportive therapist.';

  try {
    const completion = await openai.createChatCompletion({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: prompt }],
    });

    const message = completion.data.choices[0].message.content;

    const { data: { user } } = await supabase.auth.getUser();

    await supabase.from('entries').insert([
      { mood, journal, response: message, user_id: user.id }
    ]);

    res.status(200).json({ message });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Something went wrong.' });
  }
}
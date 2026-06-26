import { useState } from 'react';
import { GoogleGenAI } from "@google/genai";
import { isSupabaseConfigured, supabase } from '../supabaseClient';

const SKILLS = {
  'Technical': ['React', 'Debugging', 'API Integration', 'Git'],
  'Communication': ['Presenting', 'Teamwork', 'Documentation'],
  'Creativity': ['UI Design', 'Storytelling', 'Experimentation'],
  'Life & Wellbeing': ['Fitness', 'Rest', 'Relationships', 'Hobbies']
};

const FLOWERS = {
  'Seed': '🌱',
  'Sprout': '🌿',
  'Bud': '🌷',
  'Bloom': '🌸'
};

export default function MomentModal({ onClose, onConfirm }) {
  const [step, setStep] = useState('questions');
  const [answers, setAnswers] = useState({
    action: '',
    type: 'accomplishment',
    category: '',
    skill: '',
    significance: 3
  });
  const [reflection, setReflection] = useState('');
  const [flower, setFlower] = useState('Bud');
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('');

  const handleAnswerChange = (field, value) => {
    setAnswers(prev => ({ ...prev, [field]: value }));
    if (field === 'category') {
      setSelectedCategory(value);
      setAnswers(prev => ({ ...prev, skill: '' }));
    }
  };

  const generateReflection = async () => {
    setLoading(true);
    try {
      const prompt = `Generate a one-line encouraging reflection for someone who: ${answers.action}. They connected it to the ${answers.skill || answers.category} skill category. Significance level: ${answers.significance}/5. Make it specific, positive, and mention if they're at a Seed, Sprout, Bud, or Bloom level of mastery. Keep it under 15 words.`;
      const ai = new GoogleGenAI({});
      const interaction = await ai.interactions.create({
        model: "gemini-3.5-flash",
        input: prompt,
      });
      setReflection(interaction.output_text);
      const significanceMap = { 1: 'Seed', 2: 'Sprout', 3: 'Bud', 4: 'Bloom', 5: 'Bloom' };
      setFlower(significanceMap[answers.significance]);
      setStep('reflection');
    } catch (error) {
      setReflection('Great work on that moment! Keep growing.');
      setStep('reflection');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleConfirm = async () => {
    if (!isSupabaseConfigured) {
      alert('Supabase is not configured. Add VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY to save moments.');
      return;
    }

    setSaving(true);
    try {
      const { error } = await supabase
        .from('moments')
        .insert({
          skill: answers.skill,
          category: answers.category,
          description: answers.action,
          significance: answers.significance,
          reflection: reflection,
          stage: flower,
          type: answers.type,
        });

      if (error) {
        console.error('Supabase error:', error);
        alert('Failed to save moment.');
        return;
      }

      onConfirm({ ...answers, reflection, flower });
    } catch (err) {
      console.error('Unexpected error:', err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
      <div className="bg-[#F5F3EC] rounded-2xl shadow-2xl p-8 w-full max-w-2xl max-h-[90vh] overflow-y-auto">

        {step === 'questions' && (
          <div className="flex flex-col">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-bold text-[#2D4A3A]">Log a Moment</h2>
              <button onClick={onClose} className="text-2xl font-bold text-[#6b8275] hover:bg-[#EAF0EA] w-10 h-10 flex items-center justify-center rounded-lg transition">×</button>
            </div>

            <div>
              <div className="mb-8 flex gap-3">
                <button
                  onClick={() => handleAnswerChange('type', 'accomplishment')}
                  className={`flex-1 py-3 rounded-xl font-semibold text-base transition border ${answers.type === 'accomplishment' ? 'bg-[#4F6F5E] text-[#F5F3EC] border-[#4F6F5E]' : 'bg-white text-[#2D4A3A] border-[#C5D6CC] hover:bg-[#EAF0EA]'}`}
                >
                  🏆 Accomplishment
                </button>
                <button
                  onClick={() => handleAnswerChange('type', 'challenge')}
                  className={`flex-1 py-3 rounded-xl font-semibold text-base transition border ${answers.type === 'challenge' ? 'bg-[#4F6F5E] text-[#F5F3EC] border-[#4F6F5E]' : 'bg-white text-[#2D4A3A] border-[#C5D6CC] hover:bg-[#EAF0EA]'}`}
                >
                  ⚡ Challenge
                </button>
              </div>

              <div className="border-t border-[#dfe7e0] mb-8"></div>

              <div className="mb-8">
                <label className="flex items-center text-base font-semibold text-[#2D4A3A] mb-3">
                  <span className="inline-flex items-center justify-center w-7 h-7 rounded-md bg-[#4F6F5E] text-[#F5F3EC] text-sm font-bold mr-3">1</span>
                  What did you do?
                </label>
                <textarea
                  value={answers.action}
                  onChange={(e) => handleAnswerChange('action', e.target.value)}
                  placeholder="e.g., Fixed a critical bug in production..."
                  className="w-full px-4 py-3 bg-white border border-[#C5D6CC] rounded-xl text-[#2D4A3A] placeholder-[#8aa394] focus:outline-none focus:ring-2 focus:ring-[#4F6F5E] focus:border-[#4F6F5E] resize-none text-base transition"
                  rows="4"
                />
              </div>

              <div className="border-t border-[#dfe7e0] my-8"></div>

              <div className="mb-8">
                <label className="flex items-center text-base font-semibold text-[#2D4A3A] mb-3">
                  <span className="inline-flex items-center justify-center w-7 h-7 rounded-md bg-[#4F6F5E] text-[#F5F3EC] text-sm font-bold mr-3">2</span>
                  Which skill category?
                </label>
                <select
                  value={selectedCategory}
                  onChange={(e) => handleAnswerChange('category', e.target.value)}
                  className="w-full px-4 py-3 bg-white border border-[#C5D6CC] rounded-xl text-[#2D4A3A] focus:outline-none focus:ring-2 focus:ring-[#4F6F5E] focus:border-[#4F6F5E] text-base transition"
                >
                  <option value="">Select a category...</option>
                  <option value="Technical">💻 Technical</option>
                  <option value="Communication">💬 Communication</option>
                  <option value="Creativity">🎨 Creativity</option>
                  <option value="Life & Wellbeing">🌳 Life & Wellbeing</option>
                </select>

                {selectedCategory && (
                  <div className="mt-4">
                    <label className="block text-sm font-semibold text-[#6b8275] mb-3">Select specific skill:</label>
                    <div className="grid grid-cols-3 gap-3">
                      {SKILLS[selectedCategory].map(skill => (
                        <button
                          key={skill}
                          onClick={() => handleAnswerChange('skill', skill)}
                          className={`px-4 py-3 rounded-xl text-base font-medium transition border ${answers.skill === skill ? 'bg-[#4F6F5E] text-[#F5F3EC] border-[#4F6F5E]' : 'bg-white text-[#2D4A3A] border-[#C5D6CC] hover:bg-[#EAF0EA]'}`}
                        >
                          {skill}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="border-t border-[#dfe7e0] my-8"></div>

              <div className="mb-8">
                <label className="flex items-center text-base font-semibold text-[#2D4A3A] mb-3">
                  <span className="inline-flex items-center justify-center w-7 h-7 rounded-md bg-[#4F6F5E] text-[#F5F3EC] text-sm font-bold mr-3">3</span>
                  How significant? {answers.significance}/5
                </label>
                <div className="flex gap-3">
                  {[1, 2, 3, 4, 5].map(num => (
                    <button
                      key={num}
                      onClick={() => handleAnswerChange('significance', num)}
                      className={`flex-1 py-4 rounded-xl font-bold text-lg transition border ${answers.significance === num ? 'bg-[#4F6F5E] text-[#F5F3EC] border-[#4F6F5E]' : 'bg-[#FBFAF5] text-[#2D4A3A] border-[#C5D6CC] hover:bg-[#EAF0EA]'}`}
                    >
                      {num}
                    </button>
                  ))}
                </div>
                <div className="text-sm text-[#6b8275] mt-3 flex justify-between">
                  <span>Small</span>
                  <span>Life-changing</span>
                </div>
              </div>
            </div>

            <div className="mt-4">
              <button
                onClick={generateReflection}
                disabled={!answers.action || !answers.skill || loading}
                className="bg-[#E8806B] text-white px-8 py-4 rounded-full font-bold hover:bg-[#d9735f] disabled:bg-[#cbd5cd] disabled:text-[#8aa394] transition text-lg shadow-md shadow-[#E8806B]/30 disabled:shadow-none"
              >
                {loading ? 'Reflecting...' : 'Get AI Reflection'}
              </button>
            </div>
          </div>
        )}

        {step === 'reflection' && (
          <div className="text-center flex flex-col items-center justify-center">
            <div className="mb-8">
              <div className="text-8xl mb-6 animate-bounce">{FLOWERS[flower]}</div>
              <div className="text-2xl font-semibold text-[#4a6553] mb-6">You've reached {flower} level!</div>
            </div>

            <div className="bg-[#EAF0EA] p-8 rounded-xl mb-8 border border-[#C5D6CC] w-full">
              <p className="text-xl text-[#2D4A3A] font-medium">✨ {reflection}</p>
            </div>

            <div className="text-lg text-[#4a6553] mb-10">
              <div className="font-bold text-2xl text-[#2D4A3A] mb-3">{answers.skill}</div>
              <div className="text-base text-[#6b8275]">Significance: {answers.significance}/5</div>
            </div>

            <div className="flex gap-4">
              <button
                onClick={handleConfirm}
                disabled={saving}
                className="bg-[#E8B84B] text-[#2D4A3A] px-8 py-4 rounded-full font-bold hover:bg-[#d9a93c] disabled:opacity-60 transition text-lg shadow-md shadow-[#E8B84B]/30"
              >
                {saving ? 'Saving...' : '🎉 Confirm & Update Flower'}
              </button>
              <button
                onClick={() => setStep('questions')}
                className="bg-white text-[#2D4A3A] border border-[#C5D6CC] px-8 py-4 rounded-full font-bold hover:bg-[#EAF0EA] transition text-lg"
              >
                Edit
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

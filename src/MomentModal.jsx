import { useState } from 'react';
import { GoogleGenAI } from "@google/genai";

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
  const [step, setStep] = useState('questions'); // questions, reflection, confirm
  const [answers, setAnswers] = useState({
    action: '',
    category: '',
    skill: '',
    significance: 3
  });
  const [reflection, setReflection] = useState('');
  const [flower, setFlower] = useState('Bud');
  const [loading, setLoading] = useState(false);
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
      // Determine flower based on significance
      const significanceMap = {
        1: 'Seed',
        2: 'Sprout',
        3: 'Bud',
        4: 'Bloom',
        5: 'Bloom'
      };
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

  const handleConfirm = () => {
    onConfirm({
      ...answers,
      reflection,
      flower
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50">
      <div className="bg-white w-screen h-screen flex flex-col overflow-hidden">
        
        {/* QUESTIONS STEP */}
        {step === 'questions' && (
          <div className="p-12 overflow-y-auto flex-1 flex flex-col">
            {/* Header */}
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-4xl font-bold">✨ Log a Moment</h2>
              <button
                onClick={onClose}
                className="text-4xl font-bold hover:bg-gray-100 w-12 h-12 flex items-center justify-center rounded"
              >
                ×
              </button>
            </div>

            {/* Questions Container */}
            <div className="max-w-2xl">
              {/* Question 1: What did you do? */}
              <div className="mb-8">
                <label className="block text-lg font-semibold text-gray-700 mb-3">
                  1️⃣ What did you do?
                </label>
                <textarea
                  value={answers.action}
                  onChange={(e) => handleAnswerChange('action', e.target.value)}
                  placeholder="e.g., Fixed a critical bug in production..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500 resize-none text-base"
                  rows="4"
                />
              </div>

              {/* Question 2: Which skill? */}
              <div className="mb-8">
                <label className="block text-lg font-semibold text-gray-700 mb-3">
                  2️⃣ Which skill category?
                </label>
                <select
                  value={selectedCategory}
                  onChange={(e) => handleAnswerChange('category', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500 text-base"
                >
                  <option value="">Select a category...</option>
                  <option value="Technical">💻 Technical</option>
                  <option value="Communication">💬 Communication</option>
                  <option value="Creativity">🎨 Creativity</option>
                  <option value="Life & Wellbeing">🌳 Life & Wellbeing</option>
                </select>

                {selectedCategory && (
                  <div className="mt-4">
                    <label className="block text-sm font-semibold text-gray-600 mb-3">
                      Select specific skill:
                    </label>
                    <div className="grid grid-cols-3 gap-3">
                      {SKILLS[selectedCategory].map(skill => (
                        <button
                          key={skill}
                          onClick={() => handleAnswerChange('skill', skill)}
                          className={`px-4 py-3 rounded-lg text-base font-medium transition ${
                            answers.skill === skill
                              ? 'bg-rose-500 text-white'
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }`}
                        >
                          {skill}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Question 3: How significant? */}
              <div className="mb-8">
                <label className="block text-lg font-semibold text-gray-700 mb-3">
                  3️⃣ How significant? {answers.significance}/5
                </label>
                <div className="flex gap-3">
                  {[1, 2, 3, 4, 5].map(num => (
                    <button
                      key={num}
                      onClick={() => handleAnswerChange('significance', num)}
                      className={`flex-1 py-4 rounded-lg font-bold text-lg transition ${
                        answers.significance === num
                          ? 'bg-rose-500 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {num}
                    </button>
                  ))}
                </div>
                <div className="text-sm text-gray-500 mt-3 flex justify-between">
                  <span>Small</span>
                  <span>Life-changing</span>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="mt-8">
              <button
                onClick={generateReflection}
                disabled={!answers.action || !answers.skill || loading}
                className="bg-rose-500 text-white px-8 py-4 rounded-lg font-bold hover:bg-rose-600 disabled:bg-gray-400 transition text-lg"
              >
                {loading ? 'Reflecting...' : 'Get AI Reflection'}
              </button>
            </div>
          </div>
        )}

        {/* REFLECTION STEP */}
        {step === 'reflection' && (
          <div className="p-12 text-center flex flex-col items-center justify-center flex-1">
            {/* Flower Animation */}
            <div className="mb-8">
              <div className="text-9xl mb-6 animate-bounce">
                {FLOWERS[flower]}
              </div>
              <div className="text-2xl font-semibold text-gray-600 mb-6">
                You've reached {flower} level!
              </div>
            </div>

            {/* Reflection Text */}
            <div className="bg-gradient-to-r from-rose-50 to-pink-50 p-8 rounded-lg mb-8 border-2 border-rose-200 max-w-2xl">
              <p className="text-xl text-gray-800 font-medium">✨ {reflection}</p>
            </div>

            {/* Skill & Category Display */}
            <div className="text-lg text-gray-600 mb-12">
              <div className="font-bold text-2xl text-gray-700 mb-3">{answers.skill}</div>
              <div className="text-base text-gray-500">Significance: {answers.significance}/5</div>
            </div>

            {/* Buttons */}
            <div className="flex gap-4">
              {/* Confirm Button */}
              <button
                onClick={handleConfirm}
                className="bg-gradient-to-r from-rose-500 to-pink-500 text-white px-8 py-4 rounded-lg font-bold hover:from-rose-600 hover:to-pink-600 transition text-lg"
              >
                🎉 Confirm & Update Flower
              </button>

              {/* Back Button */}
              <button
                onClick={() => setStep('questions')}
                className="bg-gray-200 text-gray-700 px-8 py-4 rounded-lg font-bold hover:bg-gray-300 transition text-lg"
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

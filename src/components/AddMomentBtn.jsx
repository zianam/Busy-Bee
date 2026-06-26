
export default function AddMomentBtn({ onClick }) {
  return (
    <button
      onClick={onClick}
      className="fixed bottom-8 right-8 flex items-center gap-2 rounded-full bg-rose-500 text-white font-bold px-6 py-4 shadow-lg shadow-rose-500/50 hover:bg-rose-600 transition"
    >
      <span className="text-2xl leading-none">+</span>
      <span className="text-sm tracking-wide">ADD MOMENT</span>
    </button>
  );
}

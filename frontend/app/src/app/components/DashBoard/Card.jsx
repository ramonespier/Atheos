export default function Card({ title, value, description, color }) {
  return (
    <div
      className={`p-6 rounded-3xl border-2 ${color} bg-gray-950 shadow-xl hover:shadow-orange-500/30 transition-all duration-300 flex flex-col gap-2`}
    >
      <h3 className="text-xs uppercase tracking-widest text-gray-400">{title}</h3>
      <p className="text-3xl font-extrabold text-white">{value}</p>
      <p className="text-xs text-gray-500">{description}</p>
    </div>
  );
}

export default function Card({ title, value, description, color }) {
    return (
      <div className={`p-4 rounded border ${color} flex-1`}>
        <h3 className="text-sm uppercase">{title}</h3>
        <p className="text-2xl font-bold">{value}</p>
        <p className="text-xs">{description}</p>
      </div>
    );
  }
  
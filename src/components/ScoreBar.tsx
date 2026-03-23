interface Props {
  value: number   // 0–100
  label?: string
}

export function ScoreBar({ value, label }: Props) {
  return (
    <div className="w-full">
      {label && (
        <div className="flex justify-between text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
          <span>{label}</span>
          <span className="text-swiss-red">{value}%</span>
        </div>
      )}
      <div className="h-2 w-full bg-slate-200 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-swiss-darkred to-swiss-red transition-all duration-700"
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  )
}

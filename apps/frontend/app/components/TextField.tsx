export function TextField({
  title,
  type,
  exampleInput,
  value,
  onChange,
}: TextFieldProps) {
  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={title} className="text-sm font-medium text-slate-700">
        {title}
      </label>
      <input
        id={title}
        type={type}
        placeholder={exampleInput}
        className="h-11 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 transition"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}

interface TextFieldProps {
  title: string;
  type: string;
  exampleInput: string;
  value: string;
  onChange: (value: string) => void;
}

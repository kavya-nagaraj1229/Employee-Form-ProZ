import React, { useState } from "react";

function Form({
  btnText,
  onClick,
  className,
  name,
  value,
  placeholder,
  onChange,
  Label,
  color,
  type = "text",
  options = [],
  error,
}) {
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredOptions = options.filter((opt) =>
    opt.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelectAll = () => {
    if (value.length === options.length) {
      onChange(name, []);
    } else {
      onChange(name, options);
    }
  };

  const handleOptionChange = (opt) => {
    let updated;
    if (value.includes(opt)) {
      updated = value.filter((v) => v !== opt);
    } else {
      updated = [...value, opt];
    }
    onChange(name, updated);
  };

  return (
    <div className="w-full flex flex-col gap-1">
      {Label && (
        <label className="font-medium mb-1" style={{ color }}>
          {Label}
        </label>
      )}

      {btnText && (
        <button type="button" onClick={onClick} className={className}>
          {btnText}
        </button>
      )}

      {!btnText &&
        type !== "radio" &&
        type !== "select" &&
        type !== "multiselect" && (
          <input
            type={type}
            name={name}
            value={value}
            placeholder={placeholder}
            onChange={onChange}
            className={`w-full rounded px-4 py-2 bg-gray-50 focus:ring-2 
            ${error ? "border-red-500" : "border-gray-300"} 
            border focus:ring-blue-500`}
          />
        )}
      {type === "select" && (
        <select
          name={name}
          value={value}
          onChange={onChange}
          className={`w-full rounded px-4 py-2 bg-gray-50 
          ${error ? "border-red-500" : "border-gray-300"} border`}
        >
          <option value="">Select</option>
          {options.map((opt) => (
            <option key={opt}>{opt}</option>
          ))}
        </select>
      )}
      {type === "radio" && (
        <div className="flex gap-4 mt-2">
          {options.map((opt) => (
            <label key={opt} className="flex gap-2">
              <input
                type="radio"
                name={name}
                value={opt}
                checked={value === opt}
                onChange={onChange}
              />
              {opt}
            </label>
          ))}
        </div>
      )}

      {type === "multiselect" && (
        <div className="relative">
          <div
            onClick={() => setOpen(!open)}
            className={`rounded px-4 py-2 cursor-pointer bg-white flex justify-between border
            ${error ? "border-red-500" : "border-gray-300"}`}
          >
            {value.length > 0 ? value.join(", ") : "Select Skills"}
            <span>{open ? "▲" : "▼"}</span>
          </div>

          {open && (
            <div className="absolute w-full bg-white border mt-2 p-2 rounded shadow z-10">
              <input
                className="w-full mb-2 p-1 border rounded"
                placeholder="Search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />

              <label className="flex gap-2">
                <input
                  type="checkbox"
                  checked={value.length === options.length}
                  onChange={handleSelectAll}
                />
                Select All
              </label>

              {filteredOptions.map((opt) => (
                <label key={opt} className="flex gap-2">
                  <input
                    type="checkbox"
                    checked={value.includes(opt)}
                    onChange={() => handleOptionChange(opt)}
                  />
                  {opt}
                </label>
              ))}
            </div>
          )}
        </div>
      )}

      {error && <span className="text-red-500 text-sm">{error}</span>}
    </div>
  );
}

export default Form;

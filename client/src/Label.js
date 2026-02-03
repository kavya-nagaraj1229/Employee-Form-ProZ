
function Label({ text, htmlFor, color="block",className = "form-label " }) {
  return (
    <label htmlFor={htmlFor} style={{color:color}} className={className}>
      {text}
    </label>
    
  );
}

export default Label;

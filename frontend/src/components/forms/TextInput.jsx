function TextInput({
    label,
    name,
    value,
    onChange,
    type="text",
    placeholder="",
}) {
    return (
        <div>
            <label htmlFor={name}>{label}</label>

            <input 
                type={type}
                name={name}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
            />
        </div>
    )
}

export default TextInput
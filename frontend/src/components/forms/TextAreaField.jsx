function TextAreaField({
    label,
    name,
    value,
    onChange,
    placeholder="",
}) {
    return (
        <div>
            <label htmlFor={name}>{label}</label>

            <textarea 
                id={name}
                name={name}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
            >

            </textarea>

        </div>
    )
}

export default TextAreaField
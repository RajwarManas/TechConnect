function SelectField({
    label,
    name,
    value,
    onChange,
    options,
    placeholder= "Select an option",
    disablePlaceholder= true,
}) {
    return (
        <div>
            <label>{label}</label>
            <select 
                id={name}
                name={name}
                value={value}
                onChange={onChange}
            >
                <option value="" disabled={disablePlaceholder}>
                    {placeholder}
                </option>
                {options.map(option => (
                    <option
                        key = {option.value}
                        value = {option.value}
                    >
                        {option.label}
                    </option>
                ))}
            </select>
        </div>
    )   
}

export default SelectField
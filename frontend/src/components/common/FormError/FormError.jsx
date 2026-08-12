import "./FormError.css"

function FormError({ error }) {
    if (!error) return null;

    return (
        <p className="form-error">
            {Array.isArray(error) ? error[0] : error}
        </p>
    );
}

export default FormError;
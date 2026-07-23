import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../../api/auth";

function Login() {
    const navigate = useNavigate();

    const [credentials, setCredentials] = useState({
        email: "",
        password: "",
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    function handleChange(event) {
        const { name, value } = event.target;

        setCredentials((prev) => ({
            ...prev,
            [name]: value,
        }));
    }

    async function handleSubmit(event) {
        event.preventDefault();

        setError("");
        setLoading(true);

        try {
            // TODO:
            // 1. Call login(credentials)
            const tokens = await login(credentials)
            console.log(tokens)
            // 2. Store access & refresh tokens
            localStorage.setItem("access", tokens.access)
            localStorage.setItem("refresh", tokens.refresh)
            // 3. Navigate to dashboard
            navigate("/")

        } catch (error) {
            // TODO:
            // Display appropriate error message
            console.log(error)

        } finally {
            setLoading(false);
        }
    }

    return (
        <div>
            <h1>Login</h1>

            {error && <p>{error}</p>}

            <form onSubmit={handleSubmit}>
                <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={credentials.email}
                    onChange={handleChange}
                />

                <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    value={credentials.password}
                    onChange={handleChange}
                />

                <button type="submit" disabled={loading}>
                    {loading ? "Logging in..." : "Login"}
                </button>
            </form>
        </div>
    );
}

export default Login;
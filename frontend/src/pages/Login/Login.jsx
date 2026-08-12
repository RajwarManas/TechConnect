import { useState, useContext } from "react";
import { useNavigate, NavLink } from "react-router-dom";

import { AuthContext } from "../../contexts/AuthContext";

import TextInput from "../../components/forms/TextInput";
import FormError from "../../components/common/FormError/FormError";

import "./Login.css";

function Login() {

    const navigate = useNavigate();
    const { login } = useContext(AuthContext);

    const [credentials, setCredentials] = useState({
        email: "",
        password: "",
    });

    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});

    function handleChange(e) {

        setCredentials(prev => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));

    }

    async function handleSubmit(e) {

        e.preventDefault();
        console.log("Login Button clicked")
        setErrors({});
        setLoading(true);

        try {
            console.log(credentials)
            await login(credentials)
            navigate("/");

        } catch (error) {

            console.log(error.response?.data);
            setErrors(error.response?.data || {});

        } finally {

            setLoading(false);

        }

    }

    return (

        <div className="login-page">

            <div className="login-card">

                <h1>Welcome Back</h1>

                <p className="login-subtitle">
                    Sign in to continue collaborating.
                </p>

                <form
                    className="login-form"
                    onSubmit={handleSubmit}
                >

                    <TextInput
                        label="Email  "
                        name="email"
                        type="email"
                        value={credentials.email}
                        onChange={handleChange}
                        placeholder="Enter your email"
                    />

                    <TextInput
                        label="Password  "
                        name="password"
                        type="password"
                        value={credentials.password}
                        onChange={handleChange}
                        placeholder="Enter your password"
                    />

                    <FormError
                        error={errors.detail || errors.non_field_errors}
                    />

                    <button
                        className="login-btn"
                        type="submit"
                        disabled={loading}
                    >
                        {loading ? "Logging in..." : "Login"}
                    </button>

                </form>

                <p className="login-footer">
                    Don't have an account?{" "}
                    <NavLink to="/register">
                        Register
                    </NavLink>
                </p>

            </div>

        </div>

    );

}

export default Login;
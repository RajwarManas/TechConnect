import { useState } from "react";
import { useNavigate, NavLink } from "react-router-dom";

import { register } from "../../api/auth";

import TextInput from "../../components/forms/TextInput";
import FormError from "../../components/common/FormError/FormError";

import "./Register.css";

function Register() {

    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        email: "",
        username: "",
        password: "",
        confirm_password: "",
    });

    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});

    function handleChange(e) {

        setFormData(prev => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));

    }

    async function handleSubmit(e) {

        e.preventDefault();

        setLoading(true);
        setErrors({});

        try {

            await register(formData);

            navigate("/login");

        } catch (error) {

            setErrors(error.response?.data || {});

        } finally {

            setLoading(false);

        }

    }

    return (

        <div className="register-page">

            <div className="register-card">

                <h1>Create Account</h1>

                <p className="register-subtitle">
                    Join TechConnect and start collaborating.
                </p>

                <form
                    className="register-form"
                    onSubmit={handleSubmit}
                >

                    <TextInput
                        label="Email  "
                        name="email"
                        type="email"
                        value={formData.email}
                        placeholder="Enter your email"
                        onChange={handleChange}
                    />
                    <FormError error={errors.email} />

                    <TextInput
                        label="Username  "
                        name="username"
                        value={formData.username}
                        placeholder="Enter a username"
                        onChange={handleChange}
                    />
                    <FormError error={errors.username} />

                    <TextInput
                        label="Password  "
                        name="password"
                        type="password"
                        value={formData.password}
                        placeholder="Enter a password"
                        onChange={handleChange}
                    />
                    <FormError error={errors.password} />

                    <TextInput
                        label="Confirm Password  "
                        name="confirm_password"
                        type="password"
                        value={formData.confirm_password}
                        placeholder="Confirm your password"
                        onChange={handleChange}
                    />
                    <FormError error={errors.confirm_password} />

                    <button
                        className="register-btn"
                        type="submit"
                        disabled={loading}
                    >
                        {loading ? "Registering..." : "Create Account"}
                    </button>

                </form>

                <p className="register-footer">
                    Already have an account?{" "}
                    <NavLink to="/login">
                        Login
                    </NavLink>
                </p>

            </div>

        </div>

    );

}

export default Register;
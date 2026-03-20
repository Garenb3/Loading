import { useState } from "react";
import Navbar from "../components/Navbar";

function Register() {

    const [error, setError] = useState("");

    const handleSubmit = (event) => {
        event.preventDefault();

        const password = event.target.password.value;
        const confirmPassword = event.target.confirmPassword.value;

        if (password !== confirmPassword) {
            setError("Passwords do not match");
            event.target.confirmPassword.value = "";
        } else {
            setError("");
            alert("Registered successfully (mock)");
        }
    };

    return (
    <div
        style={{
        backgroundColor: "var(--bg)",
        color: "var(--text)",
        minHeight: "100vh"
        }}
    >
        <Navbar />

        <main className="container">
        <section className="form-box">
            <h1>Create Account</h1>

            <form onSubmit={handleSubmit}>

            <label htmlFor="username">Username</label>
            <input type="text" id="username" name="username" placeholder="enter your username" required />

            <label htmlFor="email">Email</label>
            <input type="email" id="email" name="email" placeholder="example@email.com" required />

            <label htmlFor="password">Password</label>
            <input type="password" id="password" name="password" placeholder="enter password" required />

            <label htmlFor="confirmPassword">Confirm Password</label>
            <input type="password" id="confirmPassword" name="confirmPassword" placeholder="rewrite password" required />

            <p style={{ color: "red", fontSize: "12px" }}>{error}</p>

            <button type="submit">Register</button>
            </form>

            <p className="login-link">
            Already have an account? <br />
            <a href="#">Login here</a>
            </p>
        </section>
        </main>
    </div>
    );
}

export default Register;
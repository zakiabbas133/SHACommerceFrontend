import type { SubmitEvent } from "react";
import { ArrowRight } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useStoreUI } from "../../context/StoreUIContext";
import "../../styles/commerce.css";

export function AuthForm({ mode }: { mode: "login" | "register" }) {
  const navigate = useNavigate();
  const { notify } = useStoreUI();
  const submit = (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const name =
      mode === "register"
        ? `${data.get("firstName")} ${data.get("lastName")}`
        : String(data.get("email")).split("@")[0];
    localStorage.setItem(
      "nexa-demo-user",
      JSON.stringify({ name, email: data.get("email") }),
    );
    notify("Signed in to your demo account");
    navigate("/account");
  };
  return (
    <div className="auth-page">
      <div className="auth-card">
        <span className="eyebrow">NEXATECH ACCOUNT</span>
        <h1>{mode === "login" ? "Welcome back." : "Join the community."}</h1>
        <p>
          This is a demo account experience. No credentials leave this browser.
        </p>
        <form onSubmit={submit} className="auth-form">
          {mode === "register" && (
            <div className="form-grid">
              <label className="form-field">
                First name
                <input name="firstName" required autoComplete="given-name" />
              </label>
              <label className="form-field">
                Last name
                <input name="lastName" required autoComplete="family-name" />
              </label>
            </div>
          )}
          <label className="form-field">
            Email address
            <input type="email" name="email" required autoComplete="email" />
          </label>
          <label className="form-field">
            Password
            <input
              type="password"
              name="password"
              required
              minLength={6}
              autoComplete={
                mode === "login" ? "current-password" : "new-password"
              }
            />
          </label>
          <button className="button button-primary">
            {mode === "login"
              ? "Sign in to your account"
              : "Create demo account"}{" "}
            <ArrowRight size={15} />
          </button>
        </form>
        <p className="auth-switch">
          {mode === "login" ? (
            <>
              New to NexaTech? <Link to="/register">Create an account</Link>
            </>
          ) : (
            <>
              Already a member? <Link to="/login">Sign in</Link>
            </>
          )}
        </p>
      </div>
    </div>
  );
}

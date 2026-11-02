import { ArrowRight, Heart, PackageCheck, UserRound } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import "../../styles/commerce.css";
import "../../components/products/catalog.css";

type DemoUser = { name?: string; email?: string };
function getUser(): DemoUser | null {
  try {
    return JSON.parse(
      localStorage.getItem("nexa-demo-user") || "null",
    ) as DemoUser | null;
  } catch {
    return null;
  }
}

export function Account() {
  const user = getUser();
  const navigate = useNavigate();
  return (
    <div className="account-page page-width">
      <div className="page-intro">
        <span className="eyebrow">YOUR NEXATECH</span>
        <h1>
          {user?.name
            ? `Good to see you, ${user.name.split(" ")[0]}.`
            : "Your account."}
        </h1>
        <p>
          {user?.email ||
            "Sign in or create a demo account. Your details stay on this device."}
        </p>
      </div>
      <div className="account-cards">
        {user ? (
          <>
            <Link to="/orders">
              <span>
                <PackageCheck />
              </span>
              <strong>
                Order history<small>View demo orders saved here</small>
              </strong>
              <ArrowRight />
            </Link>
            <Link to="/wishlist">
              <span>
                <Heart />
              </span>
              <strong>
                Wishlist<small>Your saved products</small>
              </strong>
              <ArrowRight />
            </Link>
            <button
              onClick={() => {
                localStorage.removeItem("nexa-demo-user");
                navigate("/account");
              }}
            >
              <span>
                <UserRound />
              </span>
              <strong>
                Sign out<small>End this demo session</small>
              </strong>
              <ArrowRight />
            </button>
          </>
        ) : (
          <>
            <Link to="/login">
              <span>
                <UserRound />
              </span>
              <strong>
                Sign in<small>Welcome back to NexaTech</small>
              </strong>
              <ArrowRight />
            </Link>
            <Link to="/register">
              <span>
                <PackageCheck />
              </span>
              <strong>
                Create an account
                <small>A demo account, saved on this device</small>
              </strong>
              <ArrowRight />
            </Link>
            <Link to="/orders">
              <span>
                <Heart />
              </span>
              <strong>
                Order history<small>View demo orders on this browser</small>
              </strong>
              <ArrowRight />
            </Link>
          </>
        )}
      </div>
    </div>
  );
}

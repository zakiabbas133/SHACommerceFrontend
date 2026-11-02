import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Outlet, useLocation } from "react-router-dom";
import { Check } from "lucide-react";
import { StoreUIContext } from "../../context/StoreUIContext";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { CartDrawer } from "../cart/CartDrawer";
import "./layout.css";

export function StoreLayout() {
  const [toast, setToast] = useState("");
  const [cartOpen, setCartOpen] = useState(false);
  const location = useLocation();
  const reducedMotion = useReducedMotion();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: reducedMotion ? "instant" : "smooth" });
  }, [location.pathname, reducedMotion]);
  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(() => setToast(""), 2600);
    return () => window.clearTimeout(timer);
  }, [toast]);
  const context = useMemo(
    () => ({ notify: setToast, openCart: () => setCartOpen(true) }),
    [],
  );
  return (
    <StoreUIContext.Provider value={context}>
      <Header />
      <AnimatePresence mode="wait">
        <motion.main
          key={location.pathname}
          initial={reducedMotion ? false : { opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={reducedMotion ? undefined : { opacity: 0 }}
          transition={{ duration: 0.23 }}
        >
          <Outlet />
        </motion.main>
      </AnimatePresence>
      <Footer />
      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
      <AnimatePresence>
        {toast && (
          <motion.div
            className="toast"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
          >
            <span>
              <Check size={14} />
            </span>
            {toast}
          </motion.div>
        )}
      </AnimatePresence>
    </StoreUIContext.Provider>
  );
}

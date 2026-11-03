import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Outlet, useLocation } from "react-router-dom";
import { ArrowUp, Check } from "lucide-react";
import { StoreUIContext } from "../../context/StoreUIContext";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { CartDrawer } from "../cart/CartDrawer";
import "./layout.css";

export function StoreLayout() {
  const [toast, setToast] = useState("");
  const [cartOpen, setCartOpen] = useState(false);
  const [scrollStatus, setScrollStatus] = useState({ visible: false, progress: 0 });
  const location = useLocation();
  const reducedMotion = useReducedMotion();
  useEffect(() => {
    let frame = 0;
    const updateScrollStatus = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const scrollableHeight =
          document.documentElement.scrollHeight - window.innerHeight;
        const progress =
          scrollableHeight > 0
            ? Math.min(1, Math.max(0, window.scrollY / scrollableHeight))
            : 0;
        setScrollStatus({
          visible: window.scrollY > 420,
          progress,
        });
      });
    };

    updateScrollStatus();
    window.addEventListener("scroll", updateScrollStatus, { passive: true });
    window.addEventListener("resize", updateScrollStatus);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", updateScrollStatus);
      window.removeEventListener("resize", updateScrollStatus);
    };
  }, []);
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
        {scrollStatus.visible && (
          <motion.button
            type="button"
            className="scroll-top-button"
            aria-label="Scroll to top"
            title="Scroll to top"
            initial={reducedMotion ? false : { opacity: 0, y: 18, scale: 0.88 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={reducedMotion ? undefined : { opacity: 0, y: 12, scale: 0.9 }}
            transition={{ type: "spring", stiffness: 360, damping: 26 }}
            whileHover={reducedMotion ? undefined : { y: -4 }}
            whileTap={reducedMotion ? undefined : { scale: 0.95 }}
            onClick={() =>
              window.scrollTo({
                top: 0,
                behavior: reducedMotion ? "instant" : "smooth",
              })
            }
          >
            <span className="scroll-top-icon" aria-hidden="true">
              <svg viewBox="0 0 44 44">
                <circle className="scroll-top-track" cx="22" cy="22" r="18" />
                <circle
                  className="scroll-top-progress"
                  cx="22"
                  cy="22"
                  r="18"
                  strokeDasharray="113.1"
                  strokeDashoffset={113.1 * (1 - scrollStatus.progress)}
                />
              </svg>
              <span className="scroll-top-arrow">
                <ArrowUp size={18} strokeWidth={2.2} />
              </span>
            </span>
          </motion.button>
        )}
      </AnimatePresence>
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

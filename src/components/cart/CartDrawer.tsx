import { AnimatePresence, motion } from "motion/react";
import { X } from "lucide-react";
import { CartContents } from "./CartContents";

export function CartDrawer({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="drawer-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.aside
            className="cart-drawer"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 280, damping: 26 }}
            onClick={(event) => event.stopPropagation()}
          >
            <div className="drawer-heading">
              <div>
                <h2>Your cart</h2>
                <span>Ready for a better setup</span>
              </div>
              <button
                className="icon-button"
                onClick={onClose}
                aria-label="Close cart"
              >
                <X />
              </button>
            </div>
            <CartContents onClose={onClose} />
          </motion.aside>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

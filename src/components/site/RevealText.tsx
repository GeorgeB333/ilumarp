import { motion, type Variants } from "framer-motion";
import type { ElementType, ReactNode } from "react";

type RevealTextProps = {
  children: string;
  as?: ElementType;
  className?: string;
  delay?: number;
  stagger?: number;
  duration?: number;
  // when true, animation triggers as soon as the component mounts (good for hero on initial load)
  immediate?: boolean;
  // amount of viewport visible before triggering (0..1)
  amount?: number;
  // animate per "word" (default) or per "char"
  splitBy?: "word" | "char";
  // class applied to each animated token — useful for gradients that must live on the leaf
  tokenClassName?: string;
};

const easeOut = [0.22, 1, 0.36, 1] as const;

const itemVariants: Variants = {
  hidden: { opacity: 0, y: "0.6em", filter: "blur(10px)" },
  show: { opacity: 1, y: "0em", filter: "blur(0px)" },
};

export function RevealText({
  children,
  as,
  className,
  delay = 0,
  stagger = 0.06,
  duration = 0.9,
  immediate = false,
  amount = 0.4,
  splitBy = "word",
  tokenClassName,
}: RevealTextProps) {
  const Tag = (as ?? "span") as ElementType;
  const tokens =
    splitBy === "char"
      ? Array.from(children)
      : children.split(/(\s+)/); // keep whitespace tokens to preserve spacing

  const container: Variants = {
    hidden: {},
    show: {
      transition: { staggerChildren: stagger, delayChildren: delay },
    },
  };

  const motionProps = immediate
    ? { initial: "hidden", animate: "show" }
    : { initial: "hidden", whileInView: "show", viewport: { once: true, amount } };

  return (
    <Tag className={className}>
      <motion.span
        variants={container}
        {...motionProps}
        style={{ display: "inline-block" }}
      >
        {tokens.map((token, i) => {
          if (/^\s+$/.test(token)) {
            return (
              <span key={i} style={{ whiteSpace: "pre" }}>
                {token}
              </span>
            );
          }
          return (
            <motion.span
              key={i}
              variants={itemVariants}
              transition={{ duration, ease: easeOut }}
              className={tokenClassName}
              style={{ display: "inline-block", willChange: "transform, filter, opacity" }}
            >
              {token as ReactNode}
            </motion.span>
          );
        })}
      </motion.span>
    </Tag>
  );
}

// Block-level fade+rise wrapper for non-text elements (cards, sections) so they share
// the same easing/feel when entering the viewport.
export function RevealBlock({
  children,
  className,
  delay = 0,
  duration = 0.9,
  y = 28,
  amount = 0.2,
  immediate = false,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  duration?: number;
  y?: number;
  amount?: number;
  immediate?: boolean;
}) {
  const props = immediate
    ? { initial: { opacity: 0, y, filter: "blur(8px)" }, animate: { opacity: 1, y: 0, filter: "blur(0px)" } }
    : {
        initial: { opacity: 0, y, filter: "blur(8px)" },
        whileInView: { opacity: 1, y: 0, filter: "blur(0px)" },
        viewport: { once: true, amount },
      };
  return (
    <motion.div
      {...(props as any)}
      transition={{ duration, ease: easeOut, delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

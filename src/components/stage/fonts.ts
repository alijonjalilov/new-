import { Manrope, Unbounded } from "next/font/google";

/* Шрифты дизайна «Сцена»: для русского и английского — Unbounded + Manrope.
   В них нет таджикских букв, поэтому для таджикского — Geologica + Golos (подключены на всём сайте). */
export const unbounded = Unbounded({ subsets: ["latin", "cyrillic"], weight: ["500", "700", "800"], variable: "--font-unbounded", display: "swap" });
export const manrope = Manrope({ subsets: ["latin", "cyrillic"], weight: ["400", "600", "700"], variable: "--font-manrope", display: "swap" });
export const stageFontVars = `${unbounded.variable} ${manrope.variable}`;

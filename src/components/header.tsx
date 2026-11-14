"use client";
import { useEffect, useState } from "react";
import { Moon, Sun, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
export function Header() {
  const [dark, setDark] = useState(false);
  const [menu, setMenu] = useState(false);
  useEffect(() => {
    const value = localStorage.getItem("pachapdf-theme");
    const d = value
      ? value === "dark"
      : matchMedia("(prefers-color-scheme: dark)").matches;
    setDark(d);
    document.documentElement.classList.toggle("dark", d);
  }, []);
  function toggle() {
    const d = !dark;
    setDark(d);
    document.documentElement.classList.toggle("dark", d);
    localStorage.setItem("pachapdf-theme", d ? "dark" : "light");
  }
  return (
    <header className="site-header">
      <div className="header-inner">
        <a
          href="/"
          className="brand"
          title="Volver al inicio"
        >
          <span className="logo-frame">
            <img
              src="/brand/pachapdf-logo-transparente.png"
              alt=""
              width="48"
              height="48"
            />
          </span>
          <span>
            <strong>
              Pacha<span>PDF</span>
            </strong>
            <small>by PachaTech</small>
          </span>
        </a>
        <nav
          className={menu ? "header-nav open" : "header-nav"}
          aria-label="Navegación principal"
        >
          <a href="/#herramientas">Herramientas</a>
          <a href="/#como-funciona">Cómo funciona</a>
          <a href="/help/">Ayuda</a>
        </nav>
        <div className="header-actions">
          <Button
            variant="ghost"
            size="icon"
            aria-label={dark ? "Activar tema claro" : "Activar tema oscuro"}
            onClick={toggle}
          >
            {dark ? <Sun size={20} /> : <Moon size={20} />}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="mobile-menu"
            aria-label="Menú"
            aria-expanded={menu}
            onClick={() => setMenu(!menu)}
          >
            <Menu size={22} />
          </Button>
        </div>
      </div>
    </header>
  );
}

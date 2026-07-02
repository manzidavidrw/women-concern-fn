"use client";

import { MoreVertical } from "lucide-react";
import { ReactNode, useEffect, useRef, useState } from "react";

export interface DropdownItem {
  key: string;
  label: string;
  icon: ReactNode;
  onClick: () => void;
  dividerAbove?: boolean;
  visible?: boolean;
  disabled?: boolean;
  title?: string;
  className?: string;
}

interface ActionDropdownProps {
  id: string;
  items: DropdownItem[];
  estimatedHeight?: number;
  gap?: number;
}

interface DropdownPosition {
  top?: number;
  bottom?: number;
  right: number;
}

export default function ActionDropdown({
  id,
  items,
  estimatedHeight = 220,
  gap = 4,
}: ActionDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [pos, setPos] = useState<DropdownPosition | null>(null);
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  const computePosition = (): DropdownPosition | null => {
    const btn = buttonRef.current;
    if (!btn) return null;

    const rect = btn.getBoundingClientRect();
    const spaceBelow = window.innerHeight - rect.bottom;
    const right = window.innerWidth - rect.right - window.scrollX;

    if (spaceBelow < estimatedHeight && rect.top > spaceBelow) {
      return { bottom: window.innerHeight - rect.top + gap, right };
    }

    return { top: rect.bottom + window.scrollY + gap, right };
  };

  const close = () => {
    setIsOpen(false);
    setPos(null);
  };

  const toggle = () => {
    if (isOpen) {
      close();
    } else {
      setPos(computePosition());
      setIsOpen(true);
    }
  };

  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current?.contains(event.target as Node) ||
        buttonRef.current?.contains(event.target as Node)
      ) {
        return;
      }
      close();
    };

    const handleScroll = () => {
      const next = computePosition();
      if (next) {
        setPos(next);
      } else {
        close();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    window.addEventListener("scroll", handleScroll, true);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("scroll", handleScroll, true);
    };
  }, [isOpen]);

  return (
    <>
      <button
        ref={buttonRef}
        type="button"
        onClick={toggle}
        aria-haspopup="true"
        aria-expanded={isOpen}
        aria-controls={`dropdown-${id}`}
        title="More actions"
        className="inline-flex items-center justify-center rounded-full p-2 text-w-black/60 transition-colors hover:bg-w-green/10 hover:text-w-green"
      >
        <MoreVertical size={18} />
      </button>

      {isOpen && pos && (
        <div
          id={`dropdown-${id}`}
          ref={dropdownRef}
          role="menu"
          className="z-50 space-y-1 overflow-y-auto rounded-md border border-w-black/10 bg-w-white py-1 shadow-lg focus:outline-none"
          style={{
            position: "fixed",
            maxHeight: `${5 * 42 + 8}px`,
            ...(pos.top !== undefined ? { top: pos.top } : { bottom: pos.bottom }),
            right: pos.right,
          }}
        >
          {items.map((item, index) => (
            <div key={item.key}>
              {item.dividerAbove && index > 0 && (
                <div className="my-1 border-t border-w-black/10" />
              )}
              <button
                type="button"
                role="menuitem"
                onClick={() => {
                  if (!item.disabled) {
                    item.onClick();
                    close();
                  }
                }}
                disabled={item.disabled}
                title={item.title}
                className={`flex w-full cursor-pointer items-center gap-3 px-4 py-2.5 text-left text-sm transition-colors ${
                  item.disabled
                    ? "cursor-not-allowed text-w-black/40"
                    : (item.className ?? "text-w-black/80 hover:bg-w-green/5")
                }`}
              >
                <span className="shrink-0">{item.icon}</span>
                <span className="flex-1">{item.label}</span>
              </button>
            </div>
          ))}
        </div>
      )}
    </>
  );
}

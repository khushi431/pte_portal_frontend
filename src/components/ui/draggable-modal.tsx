"use client";

import * as React from "react";
import { X, GripVertical } from "lucide-react";
import { cn } from "@/lib/utils";

interface DraggableModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    title?: React.ReactNode;
    description?: React.ReactNode;
    children: React.ReactNode;
    footer?: React.ReactNode;
    size?: "sm" | "md" | "lg" | "xl" | "2xl" | "full";
    className?: string;
    showCloseButton?: boolean;
    closeOnOverlayClick?: boolean;
    maxHeight?: string;
}

const SIZE_CLASSES = {
    sm: "max-w-md",
    md: "max-w-lg",
    lg: "max-w-2xl",
    xl: "max-w-4xl",
    "2xl": "max-w-6xl",
    full: "max-w-[95vw]",
};

export function DraggableModal({
    open,
    onOpenChange,
    title,
    description,
    children,
    footer,
    size = "lg",
    className,
    showCloseButton = true,
    closeOnOverlayClick = true,
    maxHeight = "max-h-[90vh]",
}: DraggableModalProps) {
    const [position, setPosition] = React.useState({ x: 0, y: 0 });
    const [isDragging, setIsDragging] = React.useState(false);
    const [dragStart, setDragStart] = React.useState({ x: 0, y: 0 });
    const modalRef = React.useRef<HTMLDivElement>(null);
    const headerRef = React.useRef<HTMLDivElement>(null);

    // Reset position when modal opens
    React.useEffect(() => {
        if (open) {
            setPosition({ x: 0, y: 0 });
        }
    }, [open]);

    // Handle dragging
    const handleMouseDown = (e: React.MouseEvent) => {
        if (!headerRef.current || !modalRef.current) return;
        
        // Prevent dragging if clicking on close button or other interactive elements
        const target = e.target as HTMLElement;
        if (target.closest('button') || target.closest('input') || target.closest('select')) {
            return;
        }
        
        const rect = modalRef.current.getBoundingClientRect();
        setDragStart({
            x: e.clientX - rect.left,
            y: e.clientY - rect.top,
        });
        setIsDragging(true);
        e.preventDefault();
    };

    React.useEffect(() => {
        if (!isDragging) return;

        const handleMouseMove = (e: MouseEvent) => {
            if (!modalRef.current) return;

            // Calculate new position relative to center of viewport
            const centerX = window.innerWidth / 2;
            const centerY = window.innerHeight / 2;
            
            const newX = e.clientX - centerX - (dragStart.x - modalRef.current.offsetWidth / 2);
            const newY = e.clientY - centerY - (dragStart.y - modalRef.current.offsetHeight / 2);

            // Constrain to viewport (allow some margin)
            const margin = 50;
            const maxX = (window.innerWidth - modalRef.current.offsetWidth) / 2 - margin;
            const maxY = (window.innerHeight - modalRef.current.offsetHeight) / 2 - margin;

            setPosition({
                x: Math.max(-maxX, Math.min(maxX, newX)),
                y: Math.max(-maxY, Math.min(maxY, newY)),
            });
        };

        const handleMouseUp = () => {
            setIsDragging(false);
        };

        document.addEventListener("mousemove", handleMouseMove);
        document.addEventListener("mouseup", handleMouseUp);
        document.body.style.userSelect = "none"; // Prevent text selection while dragging

        return () => {
            document.removeEventListener("mousemove", handleMouseMove);
            document.removeEventListener("mouseup", handleMouseUp);
            document.body.style.userSelect = "";
        };
    }, [isDragging, dragStart]);

    if (!open) return null;

    return (
        <>
            {/* Backdrop */}
            <div
                className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm animate-in fade-in-0"
                onClick={() => closeOnOverlayClick && onOpenChange(false)}
            />

            {/* Modal */}
            <div
                className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
                onClick={(e) => {
                    if (e.target === e.currentTarget && closeOnOverlayClick) {
                        onOpenChange(false);
                    }
                }}
            >
                <div
                    ref={modalRef}
                    className={cn(
                        "relative w-full bg-white rounded-xl shadow-2xl flex flex-col pointer-events-auto animate-in fade-in-0 zoom-in-95 duration-200",
                        SIZE_CLASSES[size],
                        maxHeight,
                        isDragging && "cursor-grabbing",
                        className
                    )}
                    style={{
                        transform: `translate(${position.x}px, ${position.y}px)`,
                        transition: isDragging ? "none" : "transform 0.1s ease-out",
                    }}
                >
                    {/* Header with drag handle */}
                    {(title || description || showCloseButton) && (
                        <div
                            ref={headerRef}
                            onMouseDown={handleMouseDown}
                            className={cn(
                                "relative flex items-start gap-4 p-5 sm:p-6 rounded-t-xl bg-gradient-to-r from-primary to-primary/90 text-primary-foreground cursor-grab active:cursor-grabbing shadow-sm",
                                isDragging && "cursor-grabbing"
                            )}
                        >
                            {/* Decorative accent */}
                            <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent rounded-t-xl pointer-events-none" />
                            
                            <div className="relative flex-1 min-w-0 z-10">
                                {title && (
                                    <h3 className="text-lg font-semibold text-primary-foreground mb-1.5">
                                        {title}
                                    </h3>
                                )}
                                {description && (
                                    <p className="text-sm text-primary-foreground/90 leading-relaxed">
                                        {description}
                                    </p>
                                )}
                            </div>
                            <div className="relative flex items-center gap-2 shrink-0 z-10">
                                <div 
                                    className="text-primary-foreground/70 hover:text-primary-foreground transition-colors cursor-grab active:cursor-grabbing rounded-md p-1 hover:bg-white/10"
                                    title="Drag to move"
                                >
                                    <GripVertical className="size-5" />
                                </div>
                                {showCloseButton && (
                                    <button
                                        type="button"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            onOpenChange(false);
                                        }}
                                        className="text-primary-foreground/70 hover:text-primary-foreground transition-colors rounded-md p-1.5 hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-primary-foreground/20"
                                        aria-label="Close"
                                    >
                                        <X className="size-5" />
                                    </button>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Content */}
                    <div className="flex-1 overflow-y-auto p-6">{children}</div>

                    {/* Footer */}
                    {footer && (
                        <div className="p-6 border-t border-slate-200 bg-slate-50/50">
                            {footer}
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}

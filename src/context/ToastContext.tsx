import { createContext, useContext, useState } from 'react';
import type { ReactNode, CSSProperties } from 'react'; 

type ToastType = 'success' | 'error' | 'info';

interface Toast {
    id: number;
    message: string;
    type: ToastType;
}

interface ToastContextType {
    showToast: (message: string, type: ToastType) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider = ({ children }: { children: ReactNode }) => {
    const [toasts, setToasts] = useState<Toast[]>([]);

    const showToast = (message: string, type: ToastType) => {
        const id = Date.now();
        setToasts(prev => [...prev, { id, message, type }]);
        
        setTimeout(() => {
            setToasts(prev => prev.filter(t => t.id !== id));
        }, 3000);
    };


    const getBackgroundColor = (type: ToastType): string => {
        switch (type) {
            case 'success': return '#39FF14'; 
            case 'error': return '#ff4444';   
            default: return '#333';           
        }
    };

    const getTextColor = (type: ToastType): string => {
        return type === 'success' ? '#000000' : '#ffffff';
    };

    return (
        <ToastContext.Provider value={{ showToast }}>
            {children}
            {/* Contenedor visual de los Toasts */}
            <div style={{ 
                position: 'fixed', 
                top: '20px', 
                right: '20px', 
                zIndex: 9999, 
                display: 'flex', 
                flexDirection: 'column', 
                gap: '10px' 
            }}>
                {toasts.map(toast => {
                    const toastStyle: CSSProperties = {
                        padding: '12px 20px',
                        borderRadius: '8px',
                        background: getBackgroundColor(toast.type),
                        color: getTextColor(toast.type), 
                        fontWeight: 'bold',
                        boxShadow: '0 4px 6px rgba(0,0,0,0.3)',
                        animation: 'fadeIn 0.3s ease-in-out',
                        minWidth: '250px'
                    };

                    return (
                        <div key={toast.id} style={toastStyle}>
                            {toast.type === 'success' ? '✅ ' : toast.type === 'error' ? '❌ ' : 'ℹ️ '}
                            {toast.message}
                        </div>
                    );
                })}
            </div>
        </ToastContext.Provider>
    );
};

export const useToast = () => {
    const context = useContext(ToastContext);
    if (!context) throw new Error("useToast debe usarse dentro de ToastProvider");
    return context;
};
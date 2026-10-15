import { WifiOff, AlertCircle } from 'lucide-react';
export function Notice({ type='info', children }) { const Icon=type==='offline'?WifiOff:AlertCircle; return <div className={`notice ${type}`} role="status"><Icon size={18}/><span>{children}</span></div>; }

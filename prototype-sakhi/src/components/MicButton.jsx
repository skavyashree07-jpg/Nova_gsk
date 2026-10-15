import { motion } from 'framer-motion';
import { Mic, MicOff } from 'lucide-react';
export default function MicButton({ listening, disabled, onClick, label }) { return <motion.button type="button" className={`mic-button ${listening?'is-listening':''}`} onClick={onClick} disabled={disabled} aria-label={label} whileHover={!disabled?{scale:1.03}:undefined} whileTap={!disabled?{scale:.96}:undefined}><span className="mic-orbit orbit-one"/><span className="mic-orbit orbit-two"/><span className="mic-core">{listening?<MicOff size={30}/>:<Mic size={30}/>}</span></motion.button>; }

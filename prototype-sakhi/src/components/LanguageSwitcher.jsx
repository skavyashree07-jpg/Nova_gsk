import { languages } from '../lib/i18n.js';
export default function LanguageSwitcher({ value, onChange, label }) { return <div className="language-switcher" role="group" aria-label={label}>{languages.map(l => <button key={l.code} className={value===l.code?'active':''} onClick={()=>onChange(l.code)} aria-pressed={value===l.code}>{l.label}</button>)}</div>; }

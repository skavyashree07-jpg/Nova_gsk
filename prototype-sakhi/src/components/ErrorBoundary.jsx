import React from 'react';
import { i18n } from '../lib/i18n.js';
export default class ErrorBoundary extends React.Component { state={failed:false}; static getDerivedStateFromError(){return {failed:true};} render(){const t=i18n.en;return this.state.failed?<main className="error-page"><span className="sticker">🌷</span><h1>{t.errorTitle}</h1><p>{t.errorBody}</p><button className="button primary" onClick={()=>this.setState({failed:false})}>{t.tryAgain}</button></main>:this.props.children;} }

export function ApiKeySplash() {
  return (
    <div style={{display:'flex',alignItems:'center',justifyContent:'center',height:'100vh',fontFamily:'system-ui, sans-serif',backgroundColor:'#f8fafc',padding:'24px'}}>
      <div style={{textAlign:'center',maxWidth:560,background:'#ffffff',padding:'40px',borderRadius:'16px',boxShadow:'0 10px 25px -5px rgba(0,0,0,0.05), 0 8px 10px -6px rgba(0,0,0,0.05)',border:'1px solid #e2e8f0'}}>
        <div style={{width:'64px',height:'64px',background:'#eff6ff',borderRadius:'50%',display:'flex',alignItems:'center',justifyContent:'center',margin:'0 auto 20px auto',color:'#2563eb'}}>
          <svg width="32" height="32" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
        </div>
        <h2 style={{fontSize:'24px',fontWeight:'700',color:'#0f172a',marginBottom:'12px'}}>Google Maps API Key Required</h2>
        <p style={{color:'#475569',fontSize:'15px',lineHeight:'1.6',marginBottom:'24px'}}>
          To view the interactive Tamil Nadu hospital map and live location services, please configure your Google Maps Platform API key.
        </p>
        <div style={{background:'#f8fafc',padding:'20px',borderRadius:'12px',textAlign:'left',marginBottom:'24px',border:'1px solid #e2e8f0'}}>
          <p style={{fontWeight:'600',color:'#1e293b',marginBottom:'8px'}}>Setup Instructions:</p>
          <ol style={{margin:0,paddingLeft:'20px',color:'#334155',fontSize:'14px',lineHeight:'1.7'}}>
            <li>Get an API key from <a href="https://console.cloud.google.com/google/maps-apis/start?utm_campaign=gmp-code-assist-ais" target="_blank" rel="noopener" style={{color:'#2563eb',textDecoration:'underline'}}>Google Cloud Console</a>.</li>
            <li>When the <strong>"Enter your environment variable to continue"</strong> popup appears, paste your key and press <strong>Enter</strong>.</li>
            <li>Or manually: Open <strong>Settings</strong> (⚙️ gear icon, top-right corner) → <strong>Secrets</strong> → type <code style={{background:'#e2e8f0',padding:'2px 6px',borderRadius:'4px'}}>GOOGLE_MAPS_PLATFORM_KEY</code> → paste key.</li>
          </ol>
        </div>
        <p style={{fontSize:'13px',color:'#64748b'}}>The application will rebuild automatically once the secret is saved.</p>
      </div>
    </div>
  );
}

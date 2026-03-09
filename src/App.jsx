import { useState, useEffect, useRef, useCallback } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  "https://qdoowrwvxtfczevuxyth.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFkb293cnd2eHRmY3pldnV4eXRoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI5MjExNTgsImV4cCI6MjA4ODQ5NzE1OH0.apBRxi45A-w2mI69cAfA9Ve0jOtoSO4ZFPPhRUss-YA"
);

function useBreakpoint() {
  const [bp, setBp] = useState(() => { const w = window.innerWidth; return w>=1024?"desktop":w>=640?"tablet":"mobile"; });
  useEffect(() => {
    const h = () => { const w=window.innerWidth; setBp(w>=1024?"desktop":w>=640?"tablet":"mobile"); };
    window.addEventListener("resize",h); return ()=>window.removeEventListener("resize",h);
  },[]);
  return bp;
}

const CURRENCIES = {
  USD:{symbol:"$",label:"USD",flag:"🇺🇸",rate:1},
  GBP:{symbol:"£",label:"GBP",flag:"🇬🇧",rate:0.79},
  INR:{symbol:"₹",label:"INR",flag:"🇮🇳",rate:83.5},
};
function fmt(amount,currency){
  const c=CURRENCIES[currency]; const val=amount*c.rate;
  if(currency==="INR"&&val>=100000) return c.symbol+(val/100000).toFixed(1)+"L";
  if(val>=1000) return c.symbol+(val/1000).toFixed(1)+"k";
  return c.symbol+Math.round(val);
}

const HABIT_LIST=[
  {id:"log",label:"Log expenses",icon:"📝"},
  {id:"review",label:"Review budget",icon:"📊"},
  {id:"save",label:"Transfer to savings",icon:"💰"},
  {id:"learn",label:"Read a finance tip",icon:"📚"},
  {id:"goal",label:"Check goal progress",icon:"🎯"},
];
const TIPS=[
  "Pay yourself first — automate savings before spending.",
  "The best time to invest was yesterday. The second best is today.",
  "Track every expense for 30 days. The patterns will surprise you.",
  "An emergency fund is not an investment — it's insurance.",
  "Index funds beat most professional fund managers over 10+ years.",
  "Lifestyle inflation is the silent wealth killer.",
  "Compound interest works both ways — avoid high-interest debt.",
  "Net worth is the only financial number that truly matters.",
];
const CATEGORIES=["Housing","Food","Transport","Entertainment","Health","Shopping","Other"];
const CATEGORY_COLORS={Housing:"#6366f1",Food:"#f59e0b",Transport:"#10b981",Entertainment:"#f43f5e",Health:"#3b82f6",Shopping:"#8b5cf6",Other:"#6b7280"};
const NAV_CONFIG={
  track:{label:"Track",icon:"📋",color:"#6366f1",tabs:[{id:"overview",label:"Overview",icon:"🏠"},{id:"expenses",label:"Expenses",icon:"💸"},{id:"goals",label:"Goals",icon:"🎯"}]},
  wealth:{label:"Wealth",icon:"💼",color:"#8b5cf6",tabs:[{id:"networth",label:"Net Worth",icon:"📊"},{id:"subs",label:"Subscriptions",icon:"🔄"},{id:"bills",label:"Bills",icon:"📅"}]},
  grow:{label:"Grow",icon:"🌱",color:"#10b981",tabs:[{id:"habits",label:"Habits",icon:"🔥"},{id:"coach",label:"AI Coach",icon:"🧠"},{id:"rules",label:"Wealth Rules",icon:"📜"},{id:"invest",label:"Investing",icon:"📈"}]},
};
const inputStyle={width:"100%",background:"#0f0f13",border:"1px solid #2d2d3d",borderRadius:10,padding:"10px 12px",color:"#e2e8f0",fontSize:14,boxSizing:"border-box",outline:"none",marginBottom:0};
const btnStyle=(bg)=>({width:"100%",padding:10,background:bg,border:"none",borderRadius:10,color:"#fff",fontWeight:600,cursor:"pointer",fontSize:14});
const FONTS="https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=DM+Serif+Display&display=swap";
const GCSS=`*{box-sizing:border-box}body{margin:0}::-webkit-scrollbar{width:4px;height:4px}::-webkit-scrollbar-track{background:#0f0f13}::-webkit-scrollbar-thumb{background:#2d2d3d;border-radius:4px}input,select,button{font-family:'DM Sans',sans-serif}@keyframes bounce{0%,100%{transform:translateY(0)}50%{transform:translateY(-4px)}}@keyframes fadeIn{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:translateY(0)}}.tab-content{animation:fadeIn 0.2s ease}.sidebar-overlay{position:fixed;inset:0;background:rgba(0,0,0,0.6);z-index:199;backdrop-filter:blur(2px)}`;

function Card({children,style={}}){return <div style={{background:"#16161e",borderRadius:16,padding:16,marginBottom:12,border:"1px solid #1e1e2e",...style}}>{children}</div>;}
function ST({children}){return <div style={{fontSize:11,fontWeight:700,color:"#64748b",textTransform:"uppercase",letterSpacing:1.2,marginBottom:10}}>{children}</div>;}

// LOGIN
function LoginScreen(){
  const [loading,setLoading]=useState(false);
  const [error,setError]=useState("");
  const signIn=async()=>{
    setLoading(true);setError("");
    const {error} = await supabase.auth.signInWithOAuth({
  provider: "google",
  options: {
    redirectTo: window.location.origin,
    queryParams: {
      prompt: "select_account"
    }
  }
});
if(error){setError(error.message);setLoading(false);}
  };
  return(
    <div style={{minHeight:"100vh",background:"#0f0f13",display:"flex",alignItems:"center",justifyContent:"center",padding:24,fontFamily:"'DM Sans',sans-serif"}}>
      <link href={FONTS} rel="stylesheet"/><style>{GCSS}</style>
      <div style={{width:"100%",maxWidth:400,textAlign:"center"}}>
        <div style={{width:80,height:80,borderRadius:24,margin:"0 auto 20px",background:"linear-gradient(135deg,#6366f1,#8b5cf6,#10b981)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:38,boxShadow:"0 12px 48px rgba(99,102,241,0.4)"}}>💰</div>
        <div style={{fontSize:36,fontWeight:700,fontFamily:"'DM Serif Display'",color:"#e2e8f0",marginBottom:8}}>WealthWise</div>
        <div style={{fontSize:15,color:"#64748b",marginBottom:40,lineHeight:1.6}}>Your personal finance companion.<br/>Track, grow, and protect your wealth.</div>
        <div style={{display:"flex",flexDirection:"column",gap:10,marginBottom:36}}>
          {[["📊","Track expenses & net worth"],["🎯","Set and achieve savings goals"],["🧠","AI-powered finance coaching"],["☁️","Syncs across all your devices"]].map(([icon,text])=>(
            <div key={text} style={{display:"flex",alignItems:"center",gap:12,background:"#16161e",borderRadius:12,padding:"12px 16px",border:"1px solid #1e1e2e"}}>
              <span style={{fontSize:20}}>{icon}</span><span style={{fontSize:14,color:"#94a3b8"}}>{text}</span>
            </div>
          ))}
        </div>
        <button onClick={signIn} disabled={loading} style={{width:"100%",padding:14,background:loading?"#2d2d3d":"#fff",border:"none",borderRadius:14,cursor:loading?"not-allowed":"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:12,fontSize:15,fontWeight:600,color:"#1a1a2e",fontFamily:"'DM Sans'",boxShadow:"0 4px 20px rgba(0,0,0,0.3)"}}>
          {loading?<span style={{color:"#64748b"}}>Signing in...</span>:<>
            <svg width="20" height="20" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
            Continue with Google
          </>}
        </button>
        {error&&<div style={{marginTop:12,fontSize:13,color:"#f43f5e"}}>{error}</div>}
        <div style={{marginTop:20,fontSize:11,color:"#64748b"}}>Free forever · No credit card · Your data stays private</div>
      </div>
    </div>
  );
}

// ROOT
export default function WealthWise(){
  const [session,setSession]=useState(null);
  const [authLoading,setAuthLoading]=useState(true);
  useEffect(()=>{
    supabase.auth.getSession().then(({data:{session}})=>{setSession(session);setAuthLoading(false);});
    const {data:{subscription}}=supabase.auth.onAuthStateChange((_e,s)=>setSession(s));
    return ()=>subscription.unsubscribe();
  },[]);
  if(authLoading) return(
    <div style={{minHeight:"100vh",background:"#0f0f13",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:12,fontFamily:"'DM Sans',sans-serif"}}>
      <link href={FONTS} rel="stylesheet"/>
      <div style={{fontSize:40}}>💰</div>
      <div style={{fontSize:20,fontWeight:700,fontFamily:"'DM Serif Display'",color:"#e2e8f0"}}>WealthWise</div>
      <div style={{fontSize:13,color:"#64748b"}}>Loading...</div>
    </div>
  );
  if(!session) return <LoginScreen/>;
  return <AppShell session={session}/>;
}

// APP SHELL
function AppShell({session}){
  const [data,setData]=useState(null);
  const [loading,setLoading]=useState(true);
  const [activeGroup,setActiveGroup]=useState("track");
  const [activeTab,setActiveTab]=useState("overview");
  const [showCurrencyMenu,setShowCurrencyMenu]=useState(false);
  const [sidebarOpen,setSidebarOpen]=useState(false);
  const bp=useBreakpoint();
  const uid=session.user.id;

  useEffect(()=>{loadAll();},[uid]);

  const loadAll=async()=>{
    setLoading(true);
    const [profile,expenses,goals,assets,liabilities,subscriptions,bills,habits]=await Promise.all([
      supabase.from("profiles").select("*").eq("id",uid).single(),
      supabase.from("expenses").select("*").eq("user_id",uid).order("created_at",{ascending:false}),
      supabase.from("goals").select("*").eq("user_id",uid).order("created_at"),
      supabase.from("assets").select("*").eq("user_id",uid).order("created_at"),
      supabase.from("liabilities").select("*").eq("user_id",uid).order("created_at"),
      supabase.from("subscriptions").select("*").eq("user_id",uid).order("created_at"),
      supabase.from("bills").select("*").eq("user_id",uid).order("due_day"),
      supabase.from("habits").select("*").eq("user_id",uid).single(),
    ]);
    setData({
      currency:profile.data?.currency||"USD",
      income:profile.data?.income||5000,
      expenses:(expenses.data||[]).map(e=>({...e,desc:e.description})),
      goals:goals.data||[],assets:assets.data||[],
      liabilities:liabilities.data||[],subscriptions:subscriptions.data||[],
      bills:bills.data||[],habits:habits.data||{streak:0,today:[]},
    });
    setLoading(false);
  };

  const updateIncome=async(val)=>{setData(d=>({...d,income:val}));await supabase.from("profiles").update({income:val}).eq("id",uid);};
  const updateCurrency=async(val)=>{setData(d=>({...d,currency:val}));await supabase.from("profiles").update({currency:val}).eq("id",uid);};
  const addExpense=async(exp)=>{const{data:row}=await supabase.from("expenses").insert({user_id:uid,description:exp.desc,amount:exp.amount,category:exp.category,date:exp.date}).select().single();if(row)setData(d=>({...d,expenses:[{...row,desc:row.description},...d.expenses]}));};
  const removeExpense=async(id)=>{await supabase.from("expenses").delete().eq("id",id);setData(d=>({...d,expenses:d.expenses.filter(e=>e.id!==id)}));};
  const addGoal=async(g)=>{const{data:row}=await supabase.from("goals").insert({user_id:uid,...g}).select().single();if(row)setData(d=>({...d,goals:[...d.goals,row]}));};
  const updateGoal=async(id,patch)=>{await supabase.from("goals").update(patch).eq("id",id);setData(d=>({...d,goals:d.goals.map(g=>g.id===id?{...g,...patch}:g)}));};
  const addAsset=async(a)=>{const{data:row}=await supabase.from("assets").insert({user_id:uid,...a}).select().single();if(row)setData(d=>({...d,assets:[...d.assets,row]}));};
  const addLiability=async(l)=>{const{data:row}=await supabase.from("liabilities").insert({user_id:uid,...l}).select().single();if(row)setData(d=>({...d,liabilities:[...d.liabilities,row]}));};
  const addSubscription=async(s)=>{const{data:row}=await supabase.from("subscriptions").insert({user_id:uid,...s}).select().single();if(row)setData(d=>({...d,subscriptions:[...d.subscriptions,row]}));};
  const removeSubscription=async(id)=>{await supabase.from("subscriptions").delete().eq("id",id);setData(d=>({...d,subscriptions:d.subscriptions.filter(s=>s.id!==id)}));};
  const toggleBill=async(id,paid)=>{await supabase.from("bills").update({paid}).eq("id",id);setData(d=>({...d,bills:d.bills.map(b=>b.id===id?{...b,paid}:b)}));};
  const updateHabits=async(habits)=>{setData(d=>({...d,habits}));await supabase.from("habits").upsert({user_id:uid,streak:habits.streak,today:habits.today,updated_at:new Date().toISOString()},{onConflict:"user_id"});};
  const signOut=()=>supabase.auth.signOut();

  const groupColor=NAV_CONFIG[activeGroup]?.color||"#6366f1";
  const switchGroup=(gid)=>{setActiveGroup(gid);setActiveTab(NAV_CONFIG[gid].tabs[0].id);setSidebarOpen(false);};
  const switchTab=(tid)=>{setActiveTab(tid);setSidebarOpen(false);};
  const isDesktop=bp==="desktop",isTablet=bp==="tablet";

  if(loading) return(
    <div style={{minHeight:"100vh",background:"#0f0f13",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:16,fontFamily:"'DM Sans',sans-serif"}}>
      <link href={FONTS} rel="stylesheet"/>
      <div style={{fontSize:40}}>💰</div>
      <div style={{fontSize:20,fontWeight:700,fontFamily:"'DM Serif Display'",color:"#e2e8f0"}}>WealthWise</div>
      <div style={{fontSize:13,color:"#64748b"}}>Loading your financial data...</div>
    </div>
  );

  const totalExpenses=data.expenses.reduce((s,e)=>s+e.amount,0);
  const savings=data.income-totalExpenses;
  const savingsRate=data.income>0?Math.round((savings/data.income)*100):0;
  const netWorth=data.assets.reduce((s,a)=>s+a.value,0)-data.liabilities.reduce((s,l)=>s+l.value,0);
  const c=data.currency;
  const tip=TIPS[new Date().getDate()%TIPS.length];
  const hour=new Date().getHours();
  const greeting=hour<12?"Good morning":hour<17?"Good afternoon":"Good evening";
  const userName=session.user.user_metadata?.full_name?.split(" ")[0]||"there";
  const cp={data,fmt,c,savings,savingsRate,netWorth,totalExpenses,tip,groupColor,addExpense,removeExpense,addGoal,updateGoal,addAsset,addLiability,addSubscription,removeSubscription,toggleBill,updateHabits,updateIncome,updateCurrency};

  const SidebarNav=()=>(
    <div style={{display:"flex",flexDirection:"column",height:"100%"}}>
      <div style={{padding:"24px 20px 12px"}}>
        <div style={{fontSize:10,color:"#64748b",fontWeight:600}}>{greeting}, {userName} 👋</div>
        <div style={{fontSize:22,fontWeight:700,fontFamily:"'DM Serif Display'",color:"#e2e8f0"}}>WealthWise</div>
      </div>
      <div style={{padding:"0 12px 12px"}}>
        <div style={{background:"#1e1e2e",borderRadius:12,padding:"10px 12px",display:"flex",alignItems:"center",gap:10}}>
          <img src={session.user.user_metadata?.avatar_url||`https://api.dicebear.com/7.x/initials/svg?seed=${userName}`} alt="avatar" style={{width:32,height:32,borderRadius:"50%",flexShrink:0}}/>
          <div style={{flex:1,minWidth:0}}>
            <div style={{fontSize:13,fontWeight:600,color:"#e2e8f0",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{session.user.user_metadata?.full_name||session.user.email}</div>
            <div style={{fontSize:10,color:"#64748b"}}>Free plan · ∞ data</div>
          </div>
        </div>
      </div>
      <div style={{padding:"0 12px 12px",position:"relative"}}>
        <button onClick={()=>setShowCurrencyMenu(v=>!v)} style={{width:"100%",background:"#1e1e2e",border:"1px solid #2d2d3d",borderRadius:10,padding:"8px 12px",color:"#e2e8f0",fontSize:13,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
          <span>{CURRENCIES[c].flag} {CURRENCIES[c].label}</span><span style={{color:"#64748b"}}>▾</span>
        </button>
        {showCurrencyMenu&&(
          <div style={{position:"absolute",top:"110%",left:12,right:12,background:"#1e1e2e",border:"1px solid #2d2d3d",borderRadius:10,padding:6,zIndex:300}}>
            {Object.entries(CURRENCIES).map(([key,cur])=>(
              <div key={key} onClick={()=>{updateCurrency(key);setShowCurrencyMenu(false);}} style={{padding:"8px 12px",borderRadius:8,cursor:"pointer",fontSize:13,color:key===c?groupColor:"#e2e8f0",fontWeight:key===c?600:400,background:key===c?groupColor+"15":"transparent"}}>
                {cur.flag} {cur.label}
              </div>
            ))}
          </div>
        )}
      </div>
      <div style={{flex:1,overflowY:"auto",padding:"0 12px"}}>
        {Object.entries(NAV_CONFIG).map(([gid,g])=>(
          <div key={gid} style={{marginBottom:6}}>
            <div style={{fontSize:10,fontWeight:700,color:"#64748b",textTransform:"uppercase",letterSpacing:1,padding:"6px 8px 4px"}}>{g.icon} {g.label}</div>
            {g.tabs.map(tab=>(
              <button key={tab.id} onClick={()=>{setActiveGroup(gid);switchTab(tab.id);}} style={{width:"100%",display:"flex",alignItems:"center",gap:10,padding:"9px 12px",borderRadius:10,border:"none",cursor:"pointer",fontSize:13,fontWeight:500,textAlign:"left",background:activeTab===tab.id?g.color+"20":"transparent",color:activeTab===tab.id?g.color:"#94a3b8",transition:"all 0.15s"}}>
                <span style={{fontSize:15}}>{tab.icon}</span> {tab.label}
                {activeTab===tab.id&&<div style={{marginLeft:"auto",width:4,height:4,borderRadius:"50%",background:g.color}}/>}
              </button>
            ))}
          </div>
        ))}
      </div>
      <div style={{padding:"12px 20px 20px",borderTop:"1px solid #1e1e2e"}}>
        <button onClick={signOut} style={{width:"100%",padding:8,background:"transparent",border:"1px solid #2d2d3d",borderRadius:10,color:"#64748b",fontSize:13,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:8}}>🚪 Sign out</button>
        <div style={{fontSize:10,color:"#64748b",marginTop:8,textAlign:"center"}}>v1.0 · Built with ❤️ Claude AI</div>
      </div>
    </div>
  );

  const TopGroupTabs=()=>(
    <div style={{display:"flex",gap:isTablet?8:5}}>
      {Object.entries(NAV_CONFIG).map(([gid,g])=>(
        <button key={gid} onClick={()=>switchGroup(gid)} style={{flex:1,padding:isTablet?"8px 0":"6px 0",borderRadius:isTablet?10:9,border:"none",cursor:"pointer",fontSize:isTablet?13:11,fontWeight:600,background:activeGroup===gid?g.color:"#1e1e2e",color:activeGroup===gid?"#fff":"#64748b",transition:"all 0.2s"}}>{g.icon} {g.label}</button>
      ))}
    </div>
  );
  const SubTabs=()=>(
    <div style={{display:"flex",gap:5,overflowX:"auto",padding:isTablet?"8px 20px":"0"}}>
      {NAV_CONFIG[activeGroup].tabs.map(tab=>(
        <button key={tab.id} onClick={()=>switchTab(tab.id)} style={{flexShrink:0,padding:isTablet?"6px 16px":"5px 11px",borderRadius:20,border:"none",cursor:"pointer",fontSize:isTablet?13:11,fontWeight:500,background:activeTab===tab.id?groupColor+"22":"transparent",color:activeTab===tab.id?groupColor:"#64748b",outline:activeTab===tab.id?`1px solid ${groupColor}44`:"none",transition:"all 0.2s"}}>{tab.icon} {tab.label}</button>
      ))}
    </div>
  );

  return(
    <div style={{fontFamily:"'DM Sans',sans-serif",background:"#0f0f13",minHeight:"100vh",color:"#e2e8f0"}}>
      <link href={FONTS} rel="stylesheet"/><style>{GCSS}</style>
      {isDesktop?(
        <div style={{display:"flex",minHeight:"100vh"}}>
          <div style={{width:240,background:"#16161e",borderRight:"1px solid #1e1e2e",position:"fixed",top:0,left:0,bottom:0,zIndex:100}}><SidebarNav/></div>
          <div style={{marginLeft:240,flex:1}}>
            <div style={{background:"#16161e",borderBottom:"1px solid #1e1e2e",padding:"16px 32px",display:"flex",alignItems:"center",justifyContent:"space-between",position:"sticky",top:0,zIndex:50}}>
              <div>
                <div style={{fontSize:18,fontWeight:700,color:"#e2e8f0"}}>{NAV_CONFIG[activeGroup].tabs.find(t=>t.id===activeTab)?.icon} {NAV_CONFIG[activeGroup].tabs.find(t=>t.id===activeTab)?.label}</div>
                <div style={{fontSize:12,color:"#64748b"}}>{NAV_CONFIG[activeGroup].label} · WealthWise</div>
              </div>
              <div style={{display:"flex",gap:16,alignItems:"center"}}>
                <div style={{fontSize:13,color:"#f59e0b"}}>🔥 {data.habits.streak} day streak</div>
                <div style={{height:20,width:1,background:"#2d2d3d"}}/>
                <div style={{fontSize:13,color:savings>=0?"#10b981":"#f43f5e",fontWeight:600}}>Saving {fmt(savings,c)}/mo</div>
              </div>
            </div>
            <div style={{padding:"28px 32px",maxWidth:900}} className="tab-content"><TabContent tab={activeTab} {...cp}/></div>
            <AboutFooter desktop/>
          </div>
        </div>
      ):isTablet?(
        <div style={{display:"flex",flexDirection:"column",minHeight:"100vh"}}>
          <div style={{background:"#16161e",borderBottom:"1px solid #1e1e2e",padding:"12px 20px",position:"sticky",top:0,zIndex:100}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
              <div style={{display:"flex",alignItems:"center",gap:10}}>
                <button onClick={()=>setSidebarOpen(true)} style={{background:"#1e1e2e",border:"1px solid #2d2d3d",borderRadius:8,padding:"7px 10px",color:"#e2e8f0",cursor:"pointer",fontSize:16}}>☰</button>
                <div style={{fontSize:16,fontWeight:700,fontFamily:"'DM Serif Display'",color:"#e2e8f0"}}>WealthWise</div>
              </div>
              <div style={{fontSize:12,color:"#f59e0b"}}>🔥 {data.habits.streak} streak</div>
            </div>
            <TopGroupTabs/>
          </div>
          {sidebarOpen&&(<><div className="sidebar-overlay" onClick={()=>setSidebarOpen(false)}/><div style={{position:"fixed",left:0,top:0,bottom:0,width:260,background:"#16161e",zIndex:200,borderRight:"1px solid #2d2d3d"}}><SidebarNav/></div></>)}
          <div style={{background:"#13131a",borderBottom:"1px solid #1e1e2e"}}><SubTabs/></div>
          <div style={{flex:1,padding:"20px",maxWidth:720,margin:"0 auto",width:"100%"}} className="tab-content"><TabContent tab={activeTab} {...cp}/></div>
          <AboutFooter/>
        </div>
      ):(
        <div style={{display:"flex",flexDirection:"column",minHeight:"100vh"}}>
          <div style={{background:"#16161e",borderBottom:"1px solid #1e1e2e",padding:"10px 14px",position:"sticky",top:0,zIndex:100}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
              <div style={{display:"flex",alignItems:"center",gap:8}}>
                <div style={{width:30,height:30,borderRadius:9,background:"linear-gradient(135deg,#6366f1,#10b981)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:14}}>💰</div>
                <div style={{fontSize:16,fontWeight:700,fontFamily:"'DM Serif Display'",color:"#e2e8f0"}}>WealthWise</div>
              </div>
              <div style={{display:"flex",alignItems:"center",gap:8}}>
                <div style={{fontSize:11,color:"#f59e0b"}}>🔥 {data.habits.streak}</div>
                <button onClick={()=>setSidebarOpen(true)} style={{background:"#1e1e2e",border:"1px solid #2d2d3d",borderRadius:8,padding:"5px 8px",color:"#e2e8f0",cursor:"pointer",fontSize:14}}>☰</button>
              </div>
            </div>
            <div style={{marginBottom:8}}><TopGroupTabs/></div>
            <SubTabs/>
          </div>
          {sidebarOpen&&(<><div className="sidebar-overlay" onClick={()=>setSidebarOpen(false)}/><div style={{position:"fixed",left:0,top:0,bottom:0,width:260,background:"#16161e",zIndex:200,borderRight:"1px solid #2d2d3d"}}><SidebarNav/></div></>)}
          <div style={{flex:1,padding:"14px"}} className="tab-content"><TabContent tab={activeTab} {...cp}/></div>
          <AboutFooter/>
        </div>
      )}
    </div>
  );
}

function TabContent({tab,...p}){
  switch(tab){
    case"overview":return<Overview {...p}/>;case"expenses":return<Expenses {...p}/>;
    case"goals":return<Goals {...p}/>;case"networth":return<NetWorth {...p}/>;
    case"subs":return<Subscriptions {...p}/>;case"bills":return<Bills {...p}/>;
    case"habits":return<Habits {...p}/>;case"coach":return<AICoach {...p}/>;
    case"rules":return<WealthRules {...p}/>;case"invest":return<Investing {...p}/>;
    default:return null;
  }
}

// OVERVIEW — income field fix: store as string so backspace works
function Overview({data,updateIncome,fmt,c,savings,savingsRate,netWorth,totalExpenses,tip}){
  const bp=useBreakpoint();
  const [incomeStr,setIncomeStr]=useState(String(data.income));
  useEffect(()=>{ setIncomeStr(String(data.income)); },[data.income]);
  const handleChange=(e)=>{
    const raw=e.target.value;
    setIncomeStr(raw);
    const num=parseFloat(raw);
    if(!isNaN(num)&&num>=0) updateIncome(num);
  };
  const handleBlur=()=>{ if(incomeStr===""||isNaN(parseFloat(incomeStr))) setIncomeStr(String(data.income)); };
  const needs=Math.round(data.income*0.5),wants=Math.round(data.income*0.3),savT=Math.round(data.income*0.2);
  return(
    <div>
      <Card style={{background:"linear-gradient(135deg,#1e1e2e,#16161e)",border:"1px solid #2d2d3d"}}>
        <div style={{fontSize:10,color:"#6366f1",fontWeight:700,marginBottom:4}}>💡 TIP OF THE DAY</div>
        <div style={{fontSize:13,color:"#94a3b8",lineHeight:1.6}}>{tip}</div>
      </Card>
      <div style={{display:"grid",gridTemplateColumns:bp==="desktop"?"repeat(4,1fr)":"1fr 1fr",gap:10,marginBottom:12}}>
        {[{label:"Monthly Income",value:fmt(data.income,c),icon:"💵",color:"#10b981"},{label:"Total Expenses",value:fmt(totalExpenses,c),icon:"💸",color:"#f43f5e"},{label:"Savings",value:fmt(savings,c),icon:"🏦",color:"#6366f1",sub:`${savingsRate}% rate`},{label:"Net Worth",value:fmt(netWorth,c),icon:"📊",color:"#f59e0b"}].map(m=>(
          <Card key={m.label} style={{marginBottom:0}}>
            <div style={{fontSize:20}}>{m.icon}</div>
            <div style={{fontSize:11,color:"#64748b",marginTop:4}}>{m.label}</div>
            <div style={{fontSize:bp==="desktop"?24:20,fontWeight:700,color:m.color,fontFamily:"'DM Serif Display'"}}>{m.value}</div>
            {m.sub&&<div style={{fontSize:10,color:"#64748b"}}>{m.sub}</div>}
          </Card>
        ))}
      </div>
      <div style={{display:bp==="desktop"?"grid":"block",gridTemplateColumns:"1fr 1fr",gap:12}}>
        <Card>
          <ST>Monthly Income</ST>
          <input type="number" value={incomeStr} onChange={handleChange} onBlur={handleBlur}
            placeholder="Enter income" style={{...inputStyle,fontSize:18,fontWeight:700}}/>
        </Card>
        <Card>
          <ST>50/30/20 Budget Rule</ST>
          {[{label:"Needs (50%)",target:needs,color:"#6366f1"},{label:"Wants (30%)",target:wants,color:"#f59e0b"},{label:"Savings (20%)",target:savT,color:"#10b981"}].map(b=>(
            <div key={b.label} style={{marginBottom:10}}>
              <div style={{display:"flex",justifyContent:"space-between",fontSize:12,marginBottom:4}}><span>{b.label}</span><span style={{color:b.color,fontWeight:600}}>{fmt(b.target,c)}</span></div>
              <div style={{height:6,background:"#1e1e2e",borderRadius:10}}><div style={{height:"100%",width:`${Math.min(100,(totalExpenses/b.target)*50)}%`,background:b.color,borderRadius:10,transition:"width 0.4s"}}/></div>
            </div>
          ))}
        </Card>
      </div>
      <Card>
        <ST>Spending by Category</ST>
        <div style={{display:bp==="desktop"?"grid":"block",gridTemplateColumns:"1fr 1fr",gap:"0 24px"}}>
          {Object.entries(CATEGORY_COLORS).map(([cat,color])=>{
            const total=data.expenses.filter(e=>e.category===cat).reduce((s,e)=>s+e.amount,0);
            if(!total) return null;
            const pct=Math.round((total/totalExpenses)*100);
            return(
              <div key={cat} style={{display:"flex",alignItems:"center",gap:10,marginBottom:8}}>
                <div style={{width:10,height:10,borderRadius:"50%",background:color,flexShrink:0}}/>
                <div style={{flex:1,fontSize:13}}>{cat}</div>
                <div style={{width:70,height:4,background:"#1e1e2e",borderRadius:10}}><div style={{height:"100%",width:`${pct}%`,background:color,borderRadius:10}}/></div>
                <div style={{fontSize:12,color:"#94a3b8",width:44,textAlign:"right"}}>{fmt(total,c)}</div>
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
}

function Expenses({data,addExpense,removeExpense,fmt,c,totalExpenses}){
  const bp=useBreakpoint();
  const [form,setForm]=useState({desc:"",amount:"",category:"Food",date:new Date().toISOString().split("T")[0]});
  const [saving,setSaving]=useState(false);
  const handleAdd=async()=>{
    if(!form.desc||!form.amount) return;
    setSaving(true);
    await addExpense({...form,amount:Number(form.amount)});
    setForm({desc:"",amount:"",category:"Food",date:new Date().toISOString().split("T")[0]});
    setSaving(false);
  };
  return(
    <div style={{display:bp==="desktop"?"grid":"block",gridTemplateColumns:"380px 1fr",gap:20,alignItems:"start"}}>
      <Card>
        <ST>Add Expense</ST>
        <input placeholder="Description" value={form.desc} onChange={e=>setForm(f=>({...f,desc:e.target.value}))} style={inputStyle}/>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,margin:"8px 0"}}>
          <input type="number" placeholder="Amount" value={form.amount} onChange={e=>setForm(f=>({...f,amount:e.target.value}))} style={inputStyle}/>
          <select value={form.category} onChange={e=>setForm(f=>({...f,category:e.target.value}))} style={{...inputStyle,background:"#0f0f13"}}>{CATEGORIES.map(cat=><option key={cat}>{cat}</option>)}</select>
        </div>
        <input type="date" value={form.date} onChange={e=>setForm(f=>({...f,date:e.target.value}))} style={{...inputStyle,marginBottom:8}}/>
        <button onClick={handleAdd} disabled={saving} style={btnStyle("#6366f1")}>{saving?"Saving...":"+ Add Expense"}</button>
      </Card>
      <Card>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
          <ST>All Expenses</ST>
          <span style={{fontSize:14,fontWeight:700,color:"#f43f5e"}}>{fmt(totalExpenses,c)}</span>
        </div>
        {data.expenses.length===0&&<div style={{color:"#64748b",fontSize:13,textAlign:"center",padding:20}}>No expenses yet — add your first one!</div>}
        <div style={{maxHeight:bp==="desktop"?440:"none",overflowY:bp==="desktop"?"auto":"visible"}}>
          {data.expenses.map(exp=>(
            <div key={exp.id} style={{display:"flex",alignItems:"center",gap:10,padding:"10px 0",borderBottom:"1px solid #1e1e2e"}}>
              <div style={{width:8,height:8,borderRadius:"50%",background:CATEGORY_COLORS[exp.category]||"#6b7280",flexShrink:0}}/>
              <div style={{flex:1,minWidth:0}}>
                <div style={{fontSize:13,fontWeight:500,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{exp.desc}</div>
                <div style={{fontSize:11,color:"#64748b"}}>{exp.category} · {exp.date}</div>
              </div>
              <div style={{fontWeight:600,color:"#f43f5e",fontSize:14,flexShrink:0}}>{fmt(exp.amount,c)}</div>
              <button onClick={()=>removeExpense(exp.id)} style={{background:"none",border:"none",color:"#64748b",cursor:"pointer",fontSize:18,padding:"0 4px"}}>×</button>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

function Goals({data,addGoal,updateGoal,fmt,c}){
  const bp=useBreakpoint();
  const [form,setForm]=useState({name:"",target:"",icon:"🎯"});
  const ICONS=["🎯","🏖️","🚗","🏠","📱","💍","🎓","✈️","🛡️","💊"];
  const handleAdd=async()=>{
    if(!form.name||!form.target) return;
    await addGoal({name:form.name,target:Number(form.target),saved:0,icon:form.icon});
    setForm({name:"",target:"",icon:"🎯"});
  };
  return(
    <div>
      <Card>
        <ST>New Goal</ST>
        <div style={{display:"flex",gap:8,flexWrap:"wrap",marginBottom:10}}>
          {ICONS.map(icon=><button key={icon} onClick={()=>setForm(f=>({...f,icon}))} style={{fontSize:20,background:form.icon===icon?"#6366f122":"transparent",border:form.icon===icon?"1px solid #6366f1":"1px solid transparent",borderRadius:8,padding:4,cursor:"pointer"}}>{icon}</button>)}
        </div>
        <div style={{display:"grid",gridTemplateColumns:bp==="mobile"?"1fr":"1fr 1fr",gap:8,marginBottom:8}}>
          <input placeholder="Goal name" value={form.name} onChange={e=>setForm(f=>({...f,name:e.target.value}))} style={inputStyle}/>
          <input type="number" placeholder={`Target (${CURRENCIES[c].symbol})`} value={form.target} onChange={e=>setForm(f=>({...f,target:e.target.value}))} style={inputStyle}/>
        </div>
        <button onClick={handleAdd} style={btnStyle("#10b981")}>+ Create Goal</button>
      </Card>
      <div style={{display:bp==="desktop"?"grid":"block",gridTemplateColumns:"1fr 1fr",gap:12}}>
        {data.goals.map(goal=>{
          const pct=Math.min(100,Math.round((goal.saved/goal.target)*100));
          return(
            <Card key={goal.id} style={{marginBottom:bp==="desktop"?0:12}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:10}}>
                <div>
                  <div style={{fontSize:24}}>{goal.icon}</div>
                  <div style={{fontWeight:600,fontSize:15,marginTop:2}}>{goal.name}</div>
                  <div style={{fontSize:12,color:"#64748b"}}>{fmt(goal.saved,c)} of {fmt(goal.target,c)}</div>
                </div>
                <div style={{fontSize:30,fontWeight:700,color:pct===100?"#10b981":"#6366f1",fontFamily:"'DM Serif Display'"}}>{pct}%</div>
              </div>
              <div style={{height:8,background:"#1e1e2e",borderRadius:10,marginBottom:12}}>
                <div style={{height:"100%",width:`${pct}%`,background:pct===100?"#10b981":"#6366f1",borderRadius:10,transition:"width 0.4s"}}/>
              </div>
              <div style={{display:"flex",gap:8}}>
                {[50,100,500].map(amt=><button key={amt} onClick={()=>updateGoal(goal.id,{saved:Math.min(goal.target,goal.saved+amt)})} style={{flex:1,padding:"7px 0",background:"#1e1e2e",border:"1px solid #2d2d3d",borderRadius:8,color:"#e2e8f0",fontSize:12,cursor:"pointer"}}>+{CURRENCIES[c].symbol}{amt}</button>)}
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

function NetWorth({data,addAsset,addLiability,fmt,c,netWorth}){
  const bp=useBreakpoint();
  const [af,setAf]=useState({name:"",value:""});
  const [lf,setLf]=useState({name:"",value:""});
  const tA=data.assets.reduce((s,a)=>s+a.value,0),tL=data.liabilities.reduce((s,l)=>s+l.value,0);
  const sr=data.income>0?(data.income-data.expenses.reduce((s,e)=>s+e.amount,0))/data.income:0.1;
  const ann=data.income*sr*12;
  const yrs=[5,10,15,20,25,30];
  const maxP=Math.max(1,...yrs.map(y=>netWorth+ann*y*Math.pow(1.07,y/2)));
  return(
    <div>
      <Card style={{textAlign:"center"}}>
        <div style={{fontSize:12,color:"#64748b",marginBottom:4,textTransform:"uppercase",letterSpacing:1}}>Your Net Worth</div>
        <div style={{fontSize:bp==="desktop"?52:42,fontWeight:700,fontFamily:"'DM Serif Display'",color:netWorth>=0?"#10b981":"#f43f5e"}}>{fmt(netWorth,c)}</div>
        <div style={{display:"flex",justifyContent:"center",gap:24,marginTop:8}}>
          <div style={{fontSize:13}}><span style={{color:"#10b981"}}>↑</span> {fmt(tA,c)} assets</div>
          <div style={{fontSize:13}}><span style={{color:"#f43f5e"}}>↓</span> {fmt(tL,c)} debts</div>
        </div>
      </Card>
      <Card>
        <ST>Wealth Timeline (7% avg return)</ST>
        <div style={{display:"flex",alignItems:"flex-end",gap:8,height:120}}>
          {yrs.map(y=>{
            const p=netWorth+ann*y*Math.pow(1.07,y/2);
            const h=Math.max(12,(p/maxP)*100);
            return(
              <div key={y} style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:6}}>
                <div style={{fontSize:9,color:"#64748b",textAlign:"center"}}>{fmt(p,c)}</div>
                <div style={{height:h,background:`hsl(${140+y*4},65%,48%)`,borderRadius:"4px 4px 2px 2px",width:"100%",transition:"height 0.5s"}}/>
                <div style={{fontSize:10,color:"#64748b"}}>{y}y</div>
              </div>
            );
          })}
        </div>
      </Card>
      <div style={{display:bp==="desktop"?"grid":"block",gridTemplateColumns:"1fr 1fr",gap:12}}>
        <Card>
          <ST>Assets</ST>
          {data.assets.map(a=><div key={a.id} style={{display:"flex",justifyContent:"space-between",padding:"8px 0",borderBottom:"1px solid #1e1e2e",fontSize:13}}><span>{a.name}</span><span style={{color:"#10b981",fontWeight:600}}>{fmt(a.value,c)}</span></div>)}
          <div style={{display:"flex",gap:8,marginTop:10}}>
            <input placeholder="Asset name" value={af.name} onChange={e=>setAf(f=>({...f,name:e.target.value}))} style={{...inputStyle,flex:2,margin:0}}/>
            <input type="number" placeholder="Value" value={af.value} onChange={e=>setAf(f=>({...f,value:e.target.value}))} style={{...inputStyle,flex:1,margin:0}}/>
            <button onClick={async()=>{if(af.name&&af.value){await addAsset({name:af.name,value:Number(af.value)});setAf({name:"",value:""});}}} style={{padding:"8px 14px",background:"#10b981",border:"none",borderRadius:8,color:"#fff",fontWeight:700,cursor:"pointer"}}>+</button>
          </div>
        </Card>
        <Card>
          <ST>Liabilities</ST>
          {data.liabilities.map(l=><div key={l.id} style={{display:"flex",justifyContent:"space-between",padding:"8px 0",borderBottom:"1px solid #1e1e2e",fontSize:13}}><span>{l.name}</span><span style={{color:"#f43f5e",fontWeight:600}}>{fmt(l.value,c)}</span></div>)}
          <div style={{display:"flex",gap:8,marginTop:10}}>
            <input placeholder="Liability" value={lf.name} onChange={e=>setLf(f=>({...f,name:e.target.value}))} style={{...inputStyle,flex:2,margin:0}}/>
            <input type="number" placeholder="Value" value={lf.value} onChange={e=>setLf(f=>({...f,value:e.target.value}))} style={{...inputStyle,flex:1,margin:0}}/>
            <button onClick={async()=>{if(lf.name&&lf.value){await addLiability({name:lf.name,value:Number(lf.value)});setLf({name:"",value:""});}}} style={{padding:"8px 14px",background:"#f43f5e",border:"none",borderRadius:8,color:"#fff",fontWeight:700,cursor:"pointer"}}>+</button>
          </div>
        </Card>
      </div>
    </div>
  );
}

function Subscriptions({data,addSubscription,removeSubscription,fmt,c}){
  const bp=useBreakpoint();
  const [form,setForm]=useState({name:"",amount:"",cycle:"monthly"});
  const mTotal=data.subscriptions.reduce((s,sub)=>s+(sub.cycle==="monthly"?sub.amount:sub.amount/12),0);
  return(
    <div>
      <Card style={{textAlign:"center"}}>
        <div style={{fontSize:12,color:"#64748b",textTransform:"uppercase",letterSpacing:1}}>Monthly Subscription Drain</div>
        <div style={{fontSize:bp==="desktop"?44:36,fontWeight:700,fontFamily:"'DM Serif Display'",color:"#f43f5e"}}>{fmt(mTotal,c)}</div>
        <div style={{fontSize:12,color:"#64748b"}}>= {fmt(mTotal*12,c)} per year</div>
      </Card>
      <div style={{display:bp==="desktop"?"grid":"block",gridTemplateColumns:"360px 1fr",gap:20,alignItems:"start"}}>
        <Card>
          <ST>Add Subscription</ST>
          <input placeholder="Service name" value={form.name} onChange={e=>setForm(f=>({...f,name:e.target.value}))} style={inputStyle}/>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,margin:"8px 0"}}>
            <input type="number" placeholder="Amount" value={form.amount} onChange={e=>setForm(f=>({...f,amount:e.target.value}))} style={inputStyle}/>
            <select value={form.cycle} onChange={e=>setForm(f=>({...f,cycle:e.target.value}))} style={{...inputStyle,background:"#0f0f13"}}><option value="monthly">Monthly</option><option value="yearly">Yearly</option></select>
          </div>
          <button onClick={async()=>{if(form.name&&form.amount){await addSubscription({name:form.name,amount:Number(form.amount),cycle:form.cycle});setForm({name:"",amount:"",cycle:"monthly"});}}} style={btnStyle("#8b5cf6")}>+ Add Subscription</button>
        </Card>
        <div>
          {data.subscriptions.map(sub=>(
            <Card key={sub.id} style={{display:"flex",alignItems:"center",gap:12,marginBottom:8}}>
              <div style={{width:40,height:40,borderRadius:12,background:"#8b5cf622",display:"flex",alignItems:"center",justifyContent:"center",fontSize:18,flexShrink:0}}>🔄</div>
              <div style={{flex:1}}><div style={{fontWeight:500,fontSize:14}}>{sub.name}</div><div style={{fontSize:11,color:"#64748b"}}>{sub.cycle}</div></div>
              <div style={{fontWeight:700,color:"#f43f5e"}}>{fmt(sub.amount,c)}/{sub.cycle==="monthly"?"mo":"yr"}</div>
              <button onClick={()=>removeSubscription(sub.id)} style={{background:"#1e1e2e",border:"none",borderRadius:8,padding:"6px 10px",color:"#64748b",cursor:"pointer",fontSize:12}}>Cancel</button>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}

function Bills({data,toggleBill,fmt,c}){
  const bp=useBreakpoint();
  const today=new Date().getDate();
  const getS=(bill)=>{
    if(bill.paid) return{label:"Paid ✓",color:"#10b981"};
    const diff=bill.due_day-today;
    if(diff<0) return{label:"Overdue!",color:"#f43f5e"};
    if(diff<=3) return{label:`${diff}d left`,color:"#f59e0b"};
    return{label:`Due ${bill.due_day}th`,color:"#64748b"};
  };
  return(
    <Card>
      <ST>Bill Calendar — {new Date().toLocaleString("default",{month:"long",year:"numeric"})}</ST>
      <div style={{display:bp==="desktop"?"grid":"block",gridTemplateColumns:"1fr 1fr",gap:"0 24px"}}>
        {data.bills.map(bill=>{
          const s=getS(bill);
          return(
            <div key={bill.id} style={{display:"flex",alignItems:"center",gap:12,padding:"12px 0",borderBottom:"1px solid #1e1e2e"}}>
              <div style={{width:40,height:40,borderRadius:12,background:"#1e1e2e",display:"flex",alignItems:"center",justifyContent:"center",fontSize:14,fontWeight:700,color:s.color,flexShrink:0}}>{bill.due_day}</div>
              <div style={{flex:1}}><div style={{fontWeight:500,fontSize:14}}>{bill.name}</div><div style={{fontSize:12,color:s.color}}>{s.label}</div></div>
              <div style={{fontWeight:700,fontSize:14,flexShrink:0}}>{fmt(bill.amount,c)}</div>
              <button onClick={()=>toggleBill(bill.id,!bill.paid)} style={{padding:"6px 14px",background:bill.paid?"#10b98122":"#6366f122",border:`1px solid ${bill.paid?"#10b981":"#6366f1"}44`,borderRadius:8,color:bill.paid?"#10b981":"#6366f1",fontSize:12,cursor:"pointer",fontWeight:600}}>{bill.paid?"Paid":"Pay"}</button>
            </div>
          );
        })}
      </div>
    </Card>
  );
}

function Habits({data,updateHabits}){
  const todayDone=data.habits.today||[];
  const toggle=async(hid)=>{
    const updated=todayDone.includes(hid)?todayDone.filter(h=>h!==hid):[...todayDone,hid];
    const streak=updated.length===HABIT_LIST.length?data.habits.streak+1:data.habits.streak;
    await updateHabits({streak,today:updated});
  };
  return(
    <div>
      <Card style={{textAlign:"center",background:"linear-gradient(135deg,#1e1e2e,#16161e)"}}>
        <div style={{fontSize:52}}>🔥</div>
        <div style={{fontSize:48,fontWeight:700,fontFamily:"'DM Serif Display'",color:"#f59e0b"}}>{data.habits.streak}</div>
        <div style={{fontSize:14,color:"#64748b"}}>day streak</div>
      </Card>
      <Card>
        <ST>Today's Habits — {todayDone.length}/{HABIT_LIST.length} done</ST>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(200px,1fr))",gap:8}}>
          {HABIT_LIST.map(h=>{
            const done=todayDone.includes(h.id);
            return(
              <div key={h.id} onClick={()=>toggle(h.id)} style={{display:"flex",alignItems:"center",gap:12,padding:12,borderRadius:12,cursor:"pointer",background:done?"#10b98112":"#1e1e2e",border:`1px solid ${done?"#10b98133":"#2d2d3d"}`,transition:"all 0.2s"}}>
                <div style={{width:22,height:22,borderRadius:"50%",background:done?"#10b981":"transparent",border:`2px solid ${done?"#10b981":"#2d2d3d"}`,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>{done&&<span style={{color:"#fff",fontSize:11}}>✓</span>}</div>
                <span style={{fontSize:18}}>{h.icon}</span>
                <span style={{fontSize:13,color:done?"#10b981":"#e2e8f0",textDecoration:done?"line-through":"none"}}>{h.label}</span>
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
}

function AICoach({data,fmt,c,savings,savingsRate,netWorth,totalExpenses}){
  const [messages,setMessages]=useState([{role:"assistant",content:"Hi! I'm your AI Finance Coach 🧠 I can analyze your real financial data and give personalized advice. What would you like to know?"}]);
  const [input,setInput]=useState("");
  const [loading,setLoading]=useState(false);
  const bottomRef=useRef(null);
  const bp=useBreakpoint();
  useEffect(()=>{bottomRef.current?.scrollIntoView({behavior:"smooth"});},[messages,loading]);
  const PROMPTS=["Am I saving enough?","How can I reduce expenses?","How long to reach my goals?","Explain the Rule of 72"];
  const send=useCallback(async(text)=>{
    if(!text.trim()||loading) return;
    setInput("");setLoading(true);
    const updated=[...messages,{role:"user",content:text}];
    setMessages(updated);
    const ctx=`You are WealthWise AI Coach. User data: Income: ${fmt(data.income,c)} | Expenses: ${fmt(totalExpenses,c)} | Savings: ${fmt(savings,c)} (${savingsRate}%) | Net Worth: ${fmt(netWorth,c)} | Goals: ${data.goals.map(g=>`${g.name}: ${fmt(g.saved,c)}/${fmt(g.target,c)}`).join(", ")} | Subs: ${fmt(data.subscriptions.reduce((s,sub)=>s+sub.amount,0),c)}/mo. Give concise personalized advice under 150 words.`;
    try{
      const res=await fetch("https://api.anthropic.com/v1/messages",{method:"POST",headers:{"Content-Type":"application/json","anthropic-version":"2023-06-01","anthropic-dangerous-direct-browser-access":"true"},body:JSON.stringify({model:"claude-sonnet-4-20250514",max_tokens:300,system:ctx,messages:updated.slice(1).map(m=>({role:m.role,content:m.content}))})});
      const d=await res.json();
      setMessages(prev=>[...prev,{role:"assistant",content:d.content?.find(b=>b.type==="text")?.text||"Sorry, try again."}]);
    }catch{setMessages(prev=>[...prev,{role:"assistant",content:"Connection error. Please try again."}]);}
    finally{setLoading(false);}
  },[messages,loading,data,fmt,c,savings,savingsRate,netWorth,totalExpenses]);
  return(
    <div style={{maxWidth:bp==="desktop"?680:"100%"}}>
      <div style={{display:"flex",gap:6,flexWrap:"wrap",marginBottom:12}}>
        {PROMPTS.map(p=><button key={p} onClick={()=>send(p)} style={{padding:"6px 14px",background:"#1e1e2e",border:"1px solid #2d2d3d",borderRadius:20,color:"#94a3b8",fontSize:12,cursor:"pointer"}}>{p}</button>)}
      </div>
      <Card style={{minHeight:bp==="desktop"?420:300,maxHeight:bp==="desktop"?420:300,overflowY:"auto",display:"flex",flexDirection:"column",gap:12}}>
        {messages.map((msg,i)=>(
          <div key={i} style={{display:"flex",justifyContent:msg.role==="user"?"flex-end":"flex-start"}}>
            <div style={{maxWidth:"85%",padding:"10px 14px",borderRadius:msg.role==="user"?"18px 18px 4px 18px":"18px 18px 18px 4px",background:msg.role==="user"?"#6366f1":"#1e1e2e",fontSize:13,lineHeight:1.6}}>{msg.content}</div>
          </div>
        ))}
        {loading&&<div style={{display:"flex"}}><div style={{background:"#1e1e2e",padding:"12px 16px",borderRadius:"18px 18px 18px 4px",display:"flex",gap:5}}>{[0,1,2].map(i=><div key={i} style={{width:6,height:6,borderRadius:"50%",background:"#6366f1",animation:`bounce 1s infinite ${i*0.15}s`}}/>)}</div></div>}
        <div ref={bottomRef}/>
      </Card>
      <div style={{display:"flex",gap:8,marginTop:10}}>
        <input value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>e.key==="Enter"&&send(input)} placeholder="Ask about your finances..." style={{...inputStyle,flex:1,margin:0}}/>
        <button onClick={()=>send(input)} disabled={loading||!input.trim()} style={{padding:"10px 18px",background:loading?"#2d2d3d":"#6366f1",border:"none",borderRadius:10,color:"#fff",fontWeight:700,cursor:loading?"not-allowed":"pointer"}}>↑</button>
      </div>
    </div>
  );
}

function WealthRules({data,fmt,c}){
  const [open,setOpen]=useState(null);
  const bp=useBreakpoint();
  const income=data?.income||5000;
  const RULES=[
    {title:"50/30/20 Rule",icon:"🥧",summary:"50% needs · 30% wants · 20% savings",detail:`On ${fmt(income,c)}/mo: Needs=${fmt(income*0.5,c)}, Wants=${fmt(income*0.3,c)}, Savings=${fmt(income*0.2,c)}.`},
    {title:"Emergency Fund",icon:"🛡️",summary:"3–6 months of expenses as cash",detail:`Aim for ${fmt(income*4,c)} in a high-yield savings account. Not invested.`},
    {title:"Pay Yourself First",icon:"💸",summary:"Save before you spend anything",detail:"Automatically transfer savings the moment you receive income."},
    {title:"Rule of 72",icon:"⚡",summary:"72 ÷ return % = years to double money",detail:"At 8%: 9 years to double. At 12%: 6 years. Start early."},
    {title:"100 Minus Age",icon:"📊",summary:"Stock allocation = 100 − your age",detail:"If you're 30, keep 70% stocks, 30% bonds. Auto-adjusts over time."},
  ];
  return(
    <div style={{display:bp==="desktop"?"grid":"block",gridTemplateColumns:"1fr 1fr",gap:12,alignItems:"start"}}>
      {RULES.map((rule,i)=>(
        <Card key={i} style={{cursor:"pointer",marginBottom:bp==="desktop"?0:12}} onClick={()=>setOpen(open===i?null:i)}>
          <div style={{display:"flex",alignItems:"center",gap:12}}>
            <div style={{fontSize:30}}>{rule.icon}</div>
            <div style={{flex:1}}><div style={{fontWeight:600,fontSize:15}}>{rule.title}</div><div style={{fontSize:12,color:"#64748b"}}>{rule.summary}</div></div>
            <div style={{color:"#64748b",fontSize:18,transition:"transform 0.2s",transform:open===i?"rotate(90deg)":"none"}}>›</div>
          </div>
          {open===i&&<div style={{marginTop:12,fontSize:13,color:"#94a3b8",lineHeight:1.7,paddingTop:12,borderTop:"1px solid #1e1e2e"}}>{rule.detail}</div>}
        </Card>
      ))}
    </div>
  );
}

function Investing({fmt,c}){
  const [monthly,setMonthly]=useState(200);
  const [rate,setRate]=useState(8);
  const [years,setYears]=useState(20);
  const bp=useBreakpoint();
  const fv=monthly*(((Math.pow(1+rate/1200,years*12)-1)/(rate/1200)));
  const invested=monthly*years*12;
  const TOPICS=[
    {icon:"🌊",title:"Compound Interest",desc:"Earning returns on your returns. Start early."},
    {icon:"📦",title:"Index Funds",desc:"Low-fee baskets of stocks. Beat 90% of active managers."},
    {icon:"🔄",title:"SIP / DCA",desc:"Invest a fixed amount monthly. Removes emotion."},
    {icon:"🌍",title:"Diversification",desc:"Spread across asset classes, geographies, sectors."},
    {icon:"🏦",title:"Emergency Fund First",desc:"Never invest money you might need in 3–5 years."},
    {icon:"⚖️",title:"Risk vs Return",desc:"Higher returns = higher risk. Match to your time horizon."},
  ];
  return(
    <div>
      <Card>
        <ST>SIP Compound Calculator</ST>
        <div style={{display:bp==="desktop"?"grid":"block",gridTemplateColumns:"1fr 1fr",gap:24}}>
          <div>
            {[{label:"Monthly Investment",value:fmt(monthly,c)+"/mo",min:50,max:5000,step:50,val:monthly,setter:setMonthly,color:"#6366f1"},{label:"Annual Return",value:rate+"%",min:1,max:20,step:0.5,val:rate,setter:setRate,color:"#10b981"},{label:"Years",value:years+" years",min:1,max:40,step:1,val:years,setter:setYears,color:"#f59e0b"}].map(s=>(
              <div key={s.label} style={{marginBottom:16}}>
                <div style={{display:"flex",justifyContent:"space-between",fontSize:12,marginBottom:6}}><span>{s.label}</span><span style={{color:s.color,fontWeight:600}}>{s.value}</span></div>
                <input type="range" min={s.min} max={s.max} step={s.step} value={s.val} onChange={e=>s.setter(Number(e.target.value))} style={{width:"100%",accentColor:s.color}}/>
              </div>
            ))}
          </div>
          <div style={{background:"#0f0f13",borderRadius:16,padding:20,textAlign:"center",display:"flex",flexDirection:"column",justifyContent:"center"}}>
            <div style={{fontSize:11,color:"#64748b",marginBottom:4}}>PORTFOLIO IN {years} YEARS</div>
            <div style={{fontSize:bp==="desktop"?40:34,fontWeight:700,fontFamily:"'DM Serif Display'",color:"#10b981"}}>{fmt(fv,c)}</div>
            <div style={{fontSize:12,color:"#64748b",marginTop:8}}>Invested: {fmt(invested,c)}</div>
            <div style={{fontSize:13,color:"#10b981",fontWeight:600}}>Gains: +{fmt(fv-invested,c)}</div>
          </div>
        </div>
      </Card>
      <div style={{display:bp==="desktop"?"grid":"block",gridTemplateColumns:"1fr 1fr",gap:12}}>
        {TOPICS.map((t,i)=><Card key={i} style={{display:"flex",gap:14,marginBottom:bp==="desktop"?0:12}}><div style={{fontSize:26}}>{t.icon}</div><div><div style={{fontWeight:600,fontSize:14,marginBottom:4}}>{t.title}</div><div style={{fontSize:13,color:"#94a3b8",lineHeight:1.6}}>{t.desc}</div></div></Card>)}
      </div>
    </div>
  );
}

function AboutFooter({desktop}){
  const [expanded,setExpanded]=useState(false);
  return(
    <div style={{margin:desktop?"24px 32px 32px":"0 16px 32px",borderRadius:20,overflow:"hidden",border:"1px solid #1e1e2e"}}>
      <button onClick={()=>setExpanded(v=>!v)} style={{width:"100%",background:"#16161e",border:"none",cursor:"pointer",padding:"14px 18px",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
        <div style={{display:"flex",alignItems:"center",gap:10}}>
          <div style={{width:28,height:28,borderRadius:"50%",background:"linear-gradient(135deg,#6366f1,#8b5cf6)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:14}}>💡</div>
          <div style={{textAlign:"left"}}><div style={{fontSize:12,fontWeight:600,color:"#e2e8f0"}}>About WealthWise</div><div style={{fontSize:10,color:"#64748b"}}>Vision · Team · Story</div></div>
        </div>
        <div style={{color:"#64748b",fontSize:16,transition:"transform 0.3s",transform:expanded?"rotate(180deg)":"rotate(0deg)"}}>⌃</div>
      </button>
      {expanded&&(
        <div style={{background:"#0f0f13",padding:"0 18px 20px"}}>
          <div style={{height:1,background:"#1e1e2e",marginBottom:20}}/>
          <div style={{textAlign:"center",marginBottom:24}}>
            <div style={{width:64,height:64,borderRadius:18,margin:"0 auto 12px",background:"linear-gradient(135deg,#6366f1,#8b5cf6,#10b981)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:30,boxShadow:"0 8px 32px rgba(99,102,241,0.4)"}}>💰</div>
            <div style={{fontSize:22,fontWeight:700,fontFamily:"'DM Serif Display'",color:"#e2e8f0"}}>WealthWise</div>
            <div style={{fontSize:12,color:"#64748b",marginTop:4}}>Your personal finance companion</div>
          </div>
          <div style={{background:"#16161e",borderRadius:14,padding:14,marginBottom:16,border:"1px solid #1e1e2e"}}>
            <div style={{fontSize:10,fontWeight:700,color:"#6366f1",letterSpacing:1.2,textTransform:"uppercase",marginBottom:6}}>Our Mission</div>
            <div style={{fontSize:13,color:"#94a3b8",lineHeight:1.7}}>To make personal finance simple, approachable, and empowering for everyone — regardless of where they start. No jargon. No paywalls. Just clarity.</div>
          </div>
          <div style={{fontSize:10,fontWeight:700,color:"#64748b",letterSpacing:1.2,textTransform:"uppercase",marginBottom:10}}>The Team</div>
          <div style={{display:"flex",flexDirection:"column",gap:10,marginBottom:20}}>
            {[{name:"Govindaraju Dinadayalan",role:"💡 Product Vision & Strategy",desc:"The brain behind WealthWise. Dreamed up every feature, user flow, and the mission to democratise personal finance for beginners worldwide.",icon:"🧠",grad:"linear-gradient(135deg,#f59e0b,#f43f5e)",color:"#f59e0b"},{name:"Claude by Anthropic",role:"⚡ Design & Engineering",desc:"Built every screen, component, calculation, and the AI coach powering this app — translating a bold vision into a product people love.",icon:"🤖",grad:"linear-gradient(135deg,#6366f1,#3b82f6)",color:"#6366f1"}].map(m=>(
              <div key={m.name} style={{background:"#16161e",borderRadius:14,padding:14,border:"1px solid #2d2d3d",display:"flex",alignItems:"center",gap:14}}>
                <div style={{width:48,height:48,borderRadius:14,flexShrink:0,background:m.grad,display:"flex",alignItems:"center",justifyContent:"center",fontSize:22}}>{m.icon}</div>
                <div>
                  <div style={{fontSize:14,fontWeight:700,color:"#e2e8f0"}}>{m.name}</div>
                  <div style={{display:"inline-block",fontSize:10,fontWeight:600,color:m.color,background:m.color+"18",borderRadius:6,padding:"2px 8px",margin:"3px 0 5px"}}>{m.role}</div>
                  <div style={{fontSize:12,color:"#64748b",lineHeight:1.6}}>{m.desc}</div>
                </div>
              </div>
            ))}
          </div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:8,marginBottom:20}}>
            {[{value:"10",label:"Features",icon:"⚡"},{value:"77",label:"Tests run",icon:"✅"},{value:"3",label:"Currencies",icon:"💱"}].map(s=>(
              <div key={s.label} style={{background:"#16161e",borderRadius:12,padding:"12px 8px",textAlign:"center",border:"1px solid #1e1e2e"}}>
                <div style={{fontSize:16}}>{s.icon}</div>
                <div style={{fontSize:20,fontWeight:700,color:"#e2e8f0",fontFamily:"'DM Serif Display'"}}>{s.value}</div>
                <div style={{fontSize:10,color:"#64748b"}}>{s.label}</div>
              </div>
            ))}
          </div>
          <div style={{textAlign:"center",padding:14,borderRadius:12,background:"linear-gradient(135deg,rgba(99,102,241,0.08),rgba(16,185,129,0.08))",border:"1px solid rgba(99,102,241,0.15)"}}>
            <div style={{fontSize:12,color:"#94a3b8",lineHeight:1.7,fontStyle:"italic"}}>"The best financial decision you can make is to start — no matter how small."</div>
            <div style={{fontSize:10,color:"#64748b",marginTop:6}}>— WealthWise v1.0 · Built with ❤️ using Claude AI</div>
          </div>
        </div>
      )}
    </div>
  );
}

const { useState, useEffect } = React;
const API = window.API_URL || 'http://localhost:5000';

const DIFF_LABEL = { easy:'Хялбар', medium:'Дунд', hard:'Хэцүү' };
const STATUS_LABEL = { open:'Нээлттэй', claimed:'Хариулт илгэсэн', completed:'Зөвшөөрсөн', rejected:'Татгалзсан', cancelled:'Цуцласан' };
const STATUS_ICON   = { open:'circle', claimed:'hourglass-half', completed:'check-circle', rejected:'times-circle', cancelled:'ban' };
const STATUS_STYLE  = {
    open:{bg:'#eff6ff',color:'#1d4ed8'}, claimed:{bg:'#fffbeb',color:'#92400e'},
    completed:{bg:'#f0fdf4',color:'#065f46'}, rejected:{bg:'#fef2f2',color:'#991b1b'}, cancelled:{bg:'#f1f5f9',color:'#64748b'},
};

function useToast() {
    const [t, setT] = useState({ show:false, msg:'', type:'success' });
    const fire = (msg, type='success') => { setT({show:true,msg,type}); setTimeout(()=>setT({show:false,msg:'',type:'success'}),3200); };
    return [t, fire];
}

function timeAgo(ts) {
    if (!ts) return '';
    const d = Date.now() - new Date(ts).getTime();
    if (d < 60000) return 'Дөнгөж';
    if (d < 3600000) return Math.floor(d/60000) + ' минутын өмнө';
    if (d < 86400000) return Math.floor(d/3600000) + ' цагийн өмнө';
    return Math.floor(d/86400000) + ' өдрийн өмнө';
}

function fmtMoney(n) { return '₮' + (n||0).toLocaleString(); }

function StatusBadge({ status }) {
    const s = STATUS_STYLE[status] || STATUS_STYLE.open;
    return (
        <span className="tm-status-badge" style={{background:s.bg,color:s.color,border:`1px solid ${s.bg}`}}>
            <i className={`fas fa-${STATUS_ICON[status]||'circle'}`}></i> {STATUS_LABEL[status]||status}
        </span>
    );
}

function DiffBadge({ diff }) {
    return <span className={`tm-diff-badge ${diff||'easy'}`}>{DIFF_LABEL[diff||'easy']}</span>;
}

function TeacherMarket() {
    const userId      = sessionStorage.getItem('user_id') || sessionStorage.getItem('userId') || 'teacher_1';
    const user         = JSON.parse(sessionStorage.getItem('user') || '{}');
    const teacherName  = [user.firstName, user.lastName].filter(Boolean).join(' ') || 'Багш';

    const [tasks, setTasks]         = useState([]);
    const [balance, setBalance]     = useState(0);
    const [loading, setLoading]     = useState(true);
    const [toast, triggerToast]     = useToast();

    const [myFilter, setMyFilter]       = useState('all');
    const [marketFilter, setMarketFilter] = useState('all');

    const [answerModal, setAnswerModal]  = useState(null);
    const [answerText, setAnswerText]   = useState('');

    const loadData = async () => {
        setLoading(true);
        try {
            const [tRes, uRes] = await Promise.all([
                fetch(`${API}/tasks`),
                fetch(`${API}/users/${userId}`)
            ]);
            const tData = await tRes.json();
            const uData = await uRes.json();
            setTasks(Array.isArray(tData) ? tData : []);
            setBalance(uData.balance || 0);
        } catch(e) { console.error(e); }
        setLoading(false);
    };
    useEffect(() => { loadData(); }, []);

    const myClaimed      = tasks.filter(t => t.claimedBy === userId);
    const myFiltered     = myFilter === 'all' ? myClaimed : myClaimed.filter(t => t.status === myFilter);
    const marketTasks    = tasks.filter(t => t.status === 'open' && t.studentId !== userId);
    const filteredMarket = marketFilter === 'all' ? marketTasks : marketTasks.filter(t => t.subject === marketFilter);
    const earnedAmt      = myClaimed.filter(t => t.status === 'completed').reduce((s,t) => s + (t.reward||0), 0);
    const pendingAmt     = myClaimed.filter(t => t.status === 'claimed').reduce((s,t) => s + (t.reward||0), 0);

    const handleSubmitAnswer = async () => {
        if (!answerText.trim()) { triggerToast('Хариулт бичнэ үү','error'); return; }
        await fetch(`${API}/tasks/${answerModal.id}`, {
            method:'PATCH', headers:{'Content-Type':'application/json'},
            body: JSON.stringify({ status:'claimed', claimedBy:userId, claimedByName:teacherName, answer:answerText.trim(), answerSubmittedAt:new Date().toISOString() })
        });
        setAnswerModal(null); setAnswerText('');
        triggerToast('Хариулт илгээгдлээ! Сурагч зөвшөөрөхийг хүлээнэ.');
        loadData();
    };

    if (loading) return <div className="page" style={{textAlign:'center',paddingTop:'60px',color:'#64748b'}}>Ачааллаж байна...</div>;

    return (
        <div className="page">
            {toast.show && <div className={`tm-toast tm-toast-${toast.type} show`}>{toast.msg}</div>}

            <div className="tm-page-head">
                <div>
                    <h1><i className="fas fa-store" style={{color:'#07437d',marginRight:'10px'}}></i>Асуулт маркет</h1>
                    <p>Сурагчдын хүсэлтүүдийг харж, хариулт илгээж мөнгө ол</p>
                </div>
                <div className="tm-wallet-card" style={{maxWidth:'420px',padding:'14px 20px'}}>
                    <div className="tm-wallet-left">
                        <div className="tm-wallet-icon" style={{background:'#f0fdf4',color:'#059669'}}><i className="fas fa-wallet"></i></div>
                        <div>
                            <div className="tm-wallet-label">Олсон мөнгө</div>
                            <div className="tm-wallet-balance" style={{color:'#059669'}}>{fmtMoney(earnedAmt)}</div>
                        </div>
                    </div>
                    <div className="tm-wallet-right" style={{gap:'12px'}}>
                        <div className="tm-wallet-stat">
                            <div className="tm-ws-val" style={{color:'#d97706'}}>{fmtMoney(pendingAmt)}</div>
                            <div className="tm-ws-lbl">Хүлээгдэж буй</div>
                        </div>
                        <div className="tm-wallet-stat">
                            <div className="tm-ws-val">{myClaimed.length}</div>
                            <div className="tm-ws-lbl">Нийт авсан</div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="tm-section-head">
                <div className="tm-section-title">
                    <i className="fas fa-store"></i>Нээлттэй хүсэлтүүд
                    <span style={{fontSize:'12px',fontWeight:600,color:'#64748b',marginLeft:'8px'}}>{filteredMarket.length} хүсэлт</span>
                </div>
                <div className="tm-tab-pills">
                    {['all','Алгебр','Геометр','Тригонометр'].map(f=>(
                        <button key={f} className={`tm-pill ${marketFilter===f?'active':''}`} onClick={()=>setMarketFilter(f)}>
                            {f==='all'?'Бүгд':f}
                        </button>
                    ))}
                </div>
            </div>

            <div className="tm-tasks-grid">
                {filteredMarket.length === 0 ? (
                    <div className="tm-empty"><i className="fas fa-store"></i><p>Нээлттэй хүсэлт байхгүй байна</p></div>
                ) : filteredMarket.map(t => (
                    <div key={t.id} className="tm-task-card market-card open" style={{borderLeft:'4px solid #3b82f6'}}>
                        <div className="tm-task-card-top">
                            <span className="tm-subject-badge">{t.subject}</span>
                            <div style={{display:'flex',gap:'5px',alignItems:'center'}}>
                                <DiffBadge diff={t.difficulty}/>
                                <StatusBadge status="open"/>
                            </div>
                        </div>
                        <div className="tm-task-title">{t.title}</div>
                        <div className="tm-task-desc">{t.description}</div>
                        <div style={{fontSize:'11px',color:'#64748b',marginBottom:'5px'}}>
                            <i className="fas fa-user" style={{marginRight:'3px'}}></i>{t.studentName}
                            <span style={{margin:'0 6px'}}>·</span>
                            <i className="fas fa-clock" style={{marginRight:'3px'}}></i>{timeAgo(t.postedAt)}
                        </div>
                        <div className="tm-task-footer">
                            <div className="tm-task-meta"></div>
                            <button className="tm-claim-btn" onClick={()=>{setAnswerModal(t);setAnswerText('');}}>
                                <i className="fas fa-pen"></i> Хариулт бичих ({fmtMoney(t.reward)})
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            <div style={{height:'1px',background:'#e2e8f0',margin:'32px 0 24px'}}></div>

            <div className="tm-section-head">
                <div className="tm-section-title"><i className="fas fa-clipboard-check"></i>Миний хариултууд</div>
                <div className="tm-tab-pills">
                    {['all','claimed','completed','rejected'].map(f=>(
                        <button key={f} className={`tm-pill ${myFilter===f?'active':''}`} onClick={()=>setMyFilter(f)}>
                            {f==='all'?'Бүгд':STATUS_LABEL[f]}
                        </button>
                    ))}
                </div>
            </div>

            <div className="tm-tasks-grid">
                {myFiltered.length === 0 ? (
                    <div className="tm-empty"><i className="fas fa-clipboard-check"></i><p>{myClaimed.length ? 'Энэ ангилалд байхгүй' : 'Та одоогоор хариулт илгээгүй байна'}</p></div>
                ) : myFiltered.map(t => {
                    const st = t.status;
                    return (
                        <div key={t.id} className="tm-task-card" style={{
                            borderLeft:`4px solid ${STATUS_STYLE[st]?.color||'#94a3b8'}`,
                            opacity:st==='rejected'?0.65:1
                        }}>
                            <div className="tm-task-card-top">
                                <span className="tm-subject-badge">{t.subject}</span>
                                <div style={{display:'flex',gap:'5px',alignItems:'center'}}>
                                    <DiffBadge diff={t.difficulty}/>
                                    <StatusBadge status={st}/>
                                </div>
                            </div>
                            <div className="tm-task-title">{t.title}</div>
                            <div className="tm-task-desc" style={{fontSize:'12px',marginBottom:'8px'}}>
                                <strong style={{color:'#64748b'}}>Асуулт:</strong> {t.description}
                            </div>
                            {t.answer && (
                                <div style={{background:'#f0fdf4',border:'1px solid #bbf7d0',borderRadius:'8px',padding:'10px 12px',marginBottom:'8px',fontSize:'13px',color:'#1e293b',lineHeight:1.6,whiteSpace:'pre-wrap'}}>
                                    <div style={{fontSize:'10px',fontWeight:700,color:'#065f46',marginBottom:'4px'}}><i className="fas fa-pen"></i> Миний хариулт</div>
                                    {t.answer}
                                </div>
                            )}
                            <div className="tm-task-footer">
                                <div className="tm-task-meta">
                                    <span><i className="fas fa-user"></i>{t.studentName}</span>
                                    <span><i className="fas fa-clock"></i>{timeAgo(t.postedAt)}</span>
                                    {st==='claimed' && <span style={{color:'#d97706',fontWeight:600}}><i className="fas fa-hourglass-half"></i> Хүлээгдэж буй</span>}
                                    {st==='completed' && <span style={{color:'#059669',fontWeight:600}}><i className="fas fa-check"></i> Зөвшөөрсөн</span>}
                                    {st==='rejected' && <span style={{color:'#ef4444',fontWeight:600}}><i className="fas fa-times"></i> Татгалзсан</span>}
                                </div>
                                <div className="tm-reward-badge" style={{
                                    background:st==='completed'?'#f0fdf4':st==='rejected'?'#f1f5f9':'#fffbeb',
                                    color:st==='completed'?'#065f46':st==='rejected'?'#94a3b8':'#92400e'
                                }}>
                                    <i className="fas fa-coins"></i>{fmtMoney(t.reward)}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {answerModal && (
                <div className="tm-overlay open" onClick={e=>{if(e.target===e.currentTarget){setAnswerModal(null);setAnswerText('');}}}>
                    <div className="tm-modal tm-modal-lg">
                        <div className="tm-modal-head">
                            <h3><i className="fas fa-pen" style={{color:'#07437d',marginRight:'8px'}}></i>Хариулт бичих</h3>
                            <button className="tm-modal-close" onClick={()=>{setAnswerModal(null);setAnswerText('');}}><i className="fas fa-times"></i></button>
                        </div>
                        <div className="tm-modal-body">
                            <div style={{background:'#f8fafc',border:'1px solid #e2e8f0',borderRadius:'12px',padding:'14px 16px',marginBottom:'16px'}}>
                                <div style={{fontSize:'11px',fontWeight:700,color:'#64748b',textTransform:'uppercase',letterSpacing:'.5px',marginBottom:'6px'}}>
                                    <i className="fas fa-user"></i> {answerModal.studentName} — Сурагчийн асуулт
                                </div>
                                <div style={{fontSize:'14px',fontWeight:700,color:'#0f172a',marginBottom:'4px'}}>{answerModal.title}</div>
                                <div style={{fontSize:'13px',color:'#475569',lineHeight:1.6,whiteSpace:'pre-wrap'}}>{answerModal.description}</div>
                                <div style={{display:'flex',gap:'8px',marginTop:'8px'}}>
                                    <span className="tm-subject-badge">{answerModal.subject}</span>
                                    <DiffBadge diff={answerModal.difficulty}/>
                                </div>
                            </div>
                            <div className="tm-field">
                                <label>Таны хариулт / шийдвэр <span style={{color:'#059669',fontSize:'11px',marginLeft:'6px'}}>Зөвшөрвөл {fmtMoney(answerModal.reward)} олно</span></label>
                                <textarea value={answerText} onChange={e=>setAnswerText(e.target.value)}
                                    rows="8" placeholder="Дэлгэрэнгүй шийдвэрээ бичнэ үү..." style={{fontSize:'14px',lineHeight:1.7}}/>
                            </div>
                            <div className="tm-info-box">
                                <i className="fas fa-info-circle"></i>
                                Хариулт илгэсний дараа сурагч <strong>зөвшөөрөх</strong> эсвэл <strong>татгалзах</strong> боломжтой.
                                Зөвшөрвөл {fmtMoney(answerModal.reward)} таны данс руу орно, татгалзавал сурагчид буцна.
                            </div>
                        </div>
                        <div className="tm-modal-foot">
                            <button className="tm-btn-cancel" onClick={()=>{setAnswerModal(null);setAnswerText('');}}>Болих</button>
                            <button className="tm-btn-confirm" onClick={handleSubmitAnswer}><i className="fas fa-paper-plane"></i> Хариулт илгэх</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

window.TeacherMarket = TeacherMarket;
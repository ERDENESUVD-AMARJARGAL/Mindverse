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

function Market() {
    const userId  = sessionStorage.getItem('user_id') || sessionStorage.getItem('userId') || 'stu_001';
    const user     = JSON.parse(sessionStorage.getItem('user') || '{}');
    const userName = [user.firstName, user.lastName].filter(Boolean).join(' ') || 'Сурагч';

    const [tasks, setTasks]         = useState([]);
    const [balance, setBalance]     = useState(0);
    const [loading, setLoading]     = useState(true);
    const [toast, triggerToast]     = useToast();

    const [myFilter, setMyFilter]   = useState('all');
    const [showChargeModal, setCharge] = useState(false);
    const [showPostModal, setPost]     = useState(false);
    const [reviewTask, setReview]     = useState(null);

    const [chargeAmt, setChargeAmt]     = useState('');
    const [postForm, setPostForm]       = useState({ subject:'', title:'', description:'', reward:'', difficulty:'easy' });
    const [postError, setPostError]     = useState('');

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

    const myTasks        = tasks.filter(t => t.studentId === userId);
    const myFiltered     = myFilter === 'all' ? myTasks : myTasks.filter(t => t.status === myFilter);
    const postedCount    = myTasks.length;
    const completedCount = myTasks.filter(t => t.status === 'completed').length;
    const escrowedAmt    = myTasks.filter(t => ['open','claimed'].includes(t.status)).reduce((s,t) => s + (t.reward||0), 0);

    const handleCharge = async () => {
        const amt = parseInt(chargeAmt);
        if (!amt || amt < 1000) { triggerToast('1,000₮-өөс их дүн оруулна уу','error'); return; }
        await fetch(`${API}/users/${userId}`, {
            method:'PATCH', headers:{'Content-Type':'application/json'},
            body: JSON.stringify({ balance: balance + amt })
        });
        setChargeAmt(''); setCharge(false);
        triggerToast(fmtMoney(amt) + ' амжилттай нэмэгдлээ!');
        loadData();
    };

    const handlePost = async (e) => {
        e.preventDefault(); setPostError('');
        const { subject, title, description, reward, difficulty } = postForm;
        if (!subject || !title || !description || !reward || reward < 500) {
            setPostError('Бүх талбарыг зөв бөглөнө үү (Урамшуулал хамгийн багадаа ₮500)');
            return;
        }
        if (parseInt(reward) > balance) {
            setPostError(`Дансны үлдэгдэл хүрэлцэхгүй (Таны баланс: ${fmtMoney(balance)})`);
            return;
        }
        await fetch(`${API}/tasks`, {
            method:'POST', headers:{'Content-Type':'application/json'},
            body: JSON.stringify({
                id:'task_'+Date.now(), studentId:userId, studentName:userName,
                subject, title, description, reward:parseInt(reward), difficulty,
                status:'open', claimedBy:null, claimedByName:null, answer:null,
                postedAt: new Date().toISOString()
            })
        });
        await fetch(`${API}/users/${userId}`, {
            method:'PATCH', headers:{'Content-Type':'application/json'},
            body: JSON.stringify({ balance: balance - parseInt(reward) })
        });
        setPost(false);
        setPostForm({ subject:'', title:'', description:'', reward:'', difficulty:'easy' });
        triggerToast('Нийтлэгдлээ! ' + fmtMoney(parseInt(reward)) + ' түрээслэгдлээ.');
        loadData();
    };

    const handleCancel = async (task) => {
        if (!confirm('Та энэ хүсэлтийг цуцлах уу?\n' + fmtMoney(task.reward) + ' буцаж ирнэ.')) return;
        await fetch(`${API}/tasks/${task.id}`, {
            method:'PATCH', headers:{'Content-Type':'application/json'},
            body: JSON.stringify({ status:'cancelled' })
        });
        await fetch(`${API}/users/${userId}`, {
            method:'PATCH', headers:{'Content-Type':'application/json'},
            body: JSON.stringify({ balance: balance + task.reward })
        });
        triggerToast('Цуцагдлаа. ' + fmtMoney(task.reward) + ' буцаж ирлээ.');
        setReview(null); loadData();
    };

    const handleApprove = async (task) => {
        if (!confirm('Багшийн хариултыг зөвшөөрөх үү?\n' + fmtMoney(task.reward) + ' багш руу шилжинэ.')) return;
        await fetch(`${API}/tasks/${task.id}`, {
            method:'PATCH', headers:{'Content-Type':'application/json'},
            body: JSON.stringify({ status:'completed' })
        });
        if (task.claimedBy) {
            try {
                const td = await (await fetch(`${API}/users/${task.claimedBy}`)).json();
                await fetch(`${API}/users/${task.claimedBy}`, {
                    method:'PATCH', headers:{'Content-Type':'application/json'},
                    body: JSON.stringify({ balance: (td.balance||0) + task.reward })
                });
            } catch {}
        }
        triggerToast('Зөвшөөрсөн! ' + fmtMoney(task.reward) + ' багш руу шилжлээ.');
        setReview(null); loadData();
    };

    const handleReject = async (task) => {
        if (!confirm('Багшийн хариултыг татгалзах уу?\n' + fmtMoney(task.reward) + ' танд буцаж ирнэ.')) return;
        await fetch(`${API}/tasks/${task.id}`, {
            method:'PATCH', headers:{'Content-Type':'application/json'},
            body: JSON.stringify({ status:'rejected' })
        });
        await fetch(`${API}/users/${userId}`, {
            method:'PATCH', headers:{'Content-Type':'application/json'},
            body: JSON.stringify({ balance: balance + task.reward })
        });
        triggerToast('Татгалзлаа. ' + fmtMoney(task.reward) + ' буцаж ирлээ.');
        setReview(null); loadData();
    };

    if (loading) return <div className="page" style={{textAlign:'center',paddingTop:'60px',color:'#64748b'}}>Ачааллаж байна...</div>;

    return (
        <div className="page">
            {toast.show && <div className={`tm-toast tm-toast-${toast.type} show`}>{toast.msg}</div>}

            <div className="tm-page-head">
                <div>
                    <h1><i className="fas fa-store" style={{color:'#07437d',marginRight:'10px'}}></i>Асуулт маркет</h1>
                    <p>Мэдэхгүй бодлогоо нийтлэж, багш нараас тусламж ав</p>
                </div>
                <button className="tm-post-btn" onClick={() => setPost(true)}>
                    <i className="fas fa-plus"></i> Хүсэлт нийтлэх
                </button>
            </div>

            <div className="tm-wallet-card">
                <div className="tm-wallet-left">
                    <div className="tm-wallet-icon"><i className="fas fa-wallet"></i></div>
                    <div>
                        <div className="tm-wallet-label">Миний данс</div>
                        <div className="tm-wallet-balance">{fmtMoney(balance)}</div>
                    </div>
                </div>
                <div className="tm-wallet-right">
                    <div className="tm-wallet-stat">
                        <div className="tm-ws-val">{postedCount}</div>
                        <div className="tm-ws-lbl">Нийтлэсэн</div>
                    </div>
                    <div className="tm-wallet-divider"></div>
                    <div className="tm-wallet-stat">
                        <div className="tm-ws-val">{completedCount}</div>
                        <div className="tm-ws-lbl">Дууссан</div>
                    </div>
                    <div className="tm-wallet-divider"></div>
                    <div className="tm-wallet-stat">
                        <div className="tm-ws-val" style={{color:'#d97706'}}>{fmtMoney(escrowedAmt)}</div>
                        <div className="tm-ws-lbl">Түрээслэгдсэн</div>
                    </div>
                    <button className="tm-charge-btn" onClick={() => setCharge(true)}>
                        <i className="fas fa-plus-circle"></i> Цэнэглэх
                    </button>
                </div>
            </div>

            <div className="tm-section-head">
                <div className="tm-section-title"><i className="fas fa-list-alt"></i>Миний хүсэлтүүд</div>
                <div className="tm-tab-pills">
                    {['all','open','claimed','completed','rejected'].map(f => (
                        <button key={f} className={`tm-pill ${myFilter===f?'active':''}`} onClick={() => setMyFilter(f)}>
                            {f==='all'?'Бүгд':STATUS_LABEL[f]}
                        </button>
                    ))}
                </div>
            </div>

            <div className="tm-tasks-grid">
                {myFiltered.length === 0 ? (
                    <div className="tm-empty">
                        <i className="fas fa-inbox"></i>
                        <p>{myTasks.length ? 'Энэ ангилалд байхгүй' : 'Та одоогоор хүсэлт нийтлээгүй байна'}</p>
                        <button className="tm-post-btn-sm" onClick={() => setPost(true)}><i className="fas fa-plus"></i> Нийтлэх</button>
                    </div>
                ) : myFiltered.map(t => {
                    const st = t.status;
                    return (
                        <div key={t.id} className="tm-task-card" style={{
                            borderLeft:`4px solid ${STATUS_STYLE[st]?.color||'#94a3b8'}`,
                            opacity:(st==='cancelled'||st==='rejected')?0.65:1
                        }}>
                            <div className="tm-task-card-top">
                                <span className="tm-subject-badge">{t.subject}</span>
                                <div style={{display:'flex',gap:'5px',alignItems:'center'}}>
                                    <DiffBadge diff={t.difficulty}/>
                                    <StatusBadge status={st}/>
                                </div>
                            </div>
                            <div className="tm-task-title">{t.title}</div>
                            <div className="tm-task-desc">{t.description}</div>
                            <div className="tm-task-footer">
                                <div className="tm-task-meta">
                                    <span><i className="fas fa-clock"></i>{timeAgo(t.postedAt)}</span>
                                    {st==='claimed' && (
                                        <span style={{color:'#059669',fontWeight:600}}>
                                            <i className="fas fa-chalkboard-teacher"></i> {t.claimedByName} хариулт илгэсэн
                                        </span>
                                    )}
                                    {st==='completed' && (
                                        <span style={{color:'#059669',fontWeight:600}}>
                                            <i className="fas fa-check"></i> {t.claimedByName} зөвшөөрсөн
                                        </span>
                                    )}
                                </div>
                                <div className="tm-reward-badge" style={{
                                    background:st==='completed'?'#f0fdf4':st==='rejected'?'#f1f5f9':'#fffbeb',
                                    color:st==='completed'?'#065f46':st==='rejected'?'#94a3b8':'#92400e'
                                }}>
                                    <i className="fas fa-coins"></i>{fmtMoney(t.reward)}
                                </div>
                            </div>
                            <div style={{display:'flex',gap:'6px',marginTop:'10px',justifyContent:'flex-end'}}>
                                {st==='open' && (
                                    <button className="tm-claim-btn" style={{background:'#f1f5f9',color:'#64748b',borderColor:'#e2e8f0'}}
                                        onClick={(e)=>{e.stopPropagation();handleCancel(t);}}>
                                        <i className="fas fa-ban"></i> Цуцлах
                                    </button>
                                )}
                                {st==='claimed' && (
                                    <button className="tm-claim-btn" style={{background:'#eff6ff',color:'#1d4ed8',borderColor:'#bfdbfe'}}
                                        onClick={(e)=>{e.stopPropagation();setReview(t);}}>
                                        <i className="fas fa-eye"></i> Хариулт харах
                                    </button>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>

            {showChargeModal && (
                <div className="tm-overlay open" onClick={e=>{if(e.target===e.currentTarget)setCharge(false);}}>
                    <div className="tm-modal">
                        <div className="tm-modal-head">
                            <h3><i className="fas fa-wallet"></i> Данс цэнэглэх</h3>
                            <button className="tm-modal-close" onClick={()=>setCharge(false)}><i className="fas fa-times"></i></button>
                        </div>
                        <div className="tm-modal-body">
                            <div className="tm-quick-amounts">
                                {[5000,10000,20000,50000].map(v=>(
                                    <button key={v} className="tm-qa-btn" onClick={()=>setChargeAmt(v)}>{fmtMoney(v)}</button>
                                ))}
                            </div>
                            <div className="tm-field">
                                <label>Дүн (₮)</label>
                                <input type="number" value={chargeAmt} placeholder="5000" min="1000" step="500" onChange={e=>setChargeAmt(e.target.value)}/>
                            </div>
                            <p className="tm-hint"><i className="fas fa-info-circle"></i> Энэ нь демо систем учир жинхэнэ гүйлгээ хийгдэхгүй.</p>
                        </div>
                        <div className="tm-modal-foot">
                            <button className="tm-btn-cancel" onClick={()=>setCharge(false)}>Болих</button>
                            <button className="tm-btn-confirm" onClick={handleCharge}><i className="fas fa-check"></i> Нэмэх</button>
                        </div>
                    </div>
                </div>
            )}

            {showPostModal && (
                <div className="tm-overlay open" onClick={e=>{if(e.target===e.currentTarget){setPost(false);setPostError('');}}}>
                    <div className="tm-modal tm-modal-lg">
                        <div className="tm-modal-head">
                            <h3><i className="fas fa-paper-plane"></i> Хүсэлт нийтлэх</h3>
                            <button className="tm-modal-close" onClick={()=>{setPost(false);setPostError('');}}><i className="fas fa-times"></i></button>
                        </div>
                        <form onSubmit={handlePost}>
                            <div className="tm-modal-body">
                                <div className="tm-field">
                                    <label>Хичээл</label>
                                    <select value={postForm.subject} onChange={e=>setPostForm({...postForm,subject:e.target.value})}>
                                        <option value="">— Сонгох —</option>
                                        <option>Алгебр</option><option>Геометр</option><option>Тригонометр</option>
                                        <option>Арифметик</option><option>Комбинаторик</option><option>Тооны онол</option>
                                        <option>C++ програмчлал</option><option>Бусад</option>
                                    </select>
                                </div>
                                <div className="tm-field">
                                    <label>Гарчиг</label>
                                    <input type="text" value={postForm.title} onChange={e=>setPostForm({...postForm,title:e.target.value})}
                                        placeholder="Жишээ: 2x² + 5x - 3 = 0 бодлого"/>
                                </div>
                                <div className="tm-field">
                                    <label>Хүндрэлийн түвшин</label>
                                    <div className="tm-diff-pills">
                                        {['easy','medium','hard'].map(d=>(
                                            <button key={d} type="button"
                                                className={`tm-diff-btn ${postForm.difficulty===d?'active':''}`}
                                                onClick={()=>setPostForm({...postForm,difficulty:d})}>
                                                <i className="fas fa-circle" style={{fontSize:'8px'}}></i> {DIFF_LABEL[d]}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                                <div className="tm-field">
                                    <label>Бодлого / тайлбар <span style={{color:'#d97706',fontSize:'11px',marginLeft:'6px'}}>(Үлдэгдэл: {fmtMoney(balance)})</span></label>
                                    <textarea value={postForm.description} onChange={e=>setPostForm({...postForm,description:e.target.value})}
                                        rows="5" placeholder="Бодлогоо дэлгэрэнгүй бич..."/>
                                </div>
                                <div className="tm-field">
                                    <label>Урамшуулал (₮)</label>
                                    <input type="number" value={postForm.reward} onChange={e=>setPostForm({...postForm,reward:e.target.value})}
                                        placeholder="2000" min="500" step="500"/>
                                </div>
                                {postError && <div className="tm-error">{postError}</div>}
                                <div className="tm-info-box">
                                    <i className="fas fa-info-circle"></i>
                                    Нийтлэх үед <strong>{fmtMoney(parseInt(postForm.reward)||0)}</strong> таны дансаас түрээслэгдэнэ.
                                    Багш зөвшөөрвөл мөнгө багш руу шилжинэ, татгалзавал буцаж ирнэ.
                                </div>
                            </div>
                            <div className="tm-modal-foot">
                                <button type="button" className="tm-btn-cancel" onClick={()=>{setPost(false);setPostError('');}}>Болих</button>
                                <button type="submit" className="tm-btn-confirm"><i className="fas fa-paper-plane"></i> Нийтлэх</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {reviewTask && (
                <div className="tm-overlay open" onClick={e=>{if(e.target===e.currentTarget)setReview(null);}}>
                    <div className="tm-modal tm-modal-lg">
                        <div className="tm-modal-head">
                            <h3><i className="fas fa-eye" style={{color:'#07437d',marginRight:'8px'}}></i>Багшийн хариулт</h3>
                            <button className="tm-modal-close" onClick={()=>setReview(null)}><i className="fas fa-times"></i></button>
                        </div>
                        <div className="tm-modal-body">
                            <div style={{background:'#f8fafc',border:'1px solid #e2e8f0',borderRadius:'12px',padding:'16px',marginBottom:'20px'}}>
                                <div style={{fontSize:'11px',fontWeight:700,color:'#64748b',textTransform:'uppercase',letterSpacing:'.5px',marginBottom:'8px'}}>
                                    <i className="fas fa-question-circle"></i> Таны асуулт
                                </div>
                                <div style={{fontSize:'15px',fontWeight:700,color:'#0f172a',marginBottom:'6px'}}>{reviewTask.title}</div>
                                <div style={{fontSize:'13px',color:'#475569',lineHeight:1.6,whiteSpace:'pre-wrap'}}>{reviewTask.description}</div>
                                <div style={{display:'flex',gap:'8px',marginTop:'10px'}}>
                                    <span className="tm-subject-badge">{reviewTask.subject}</span>
                                    <DiffBadge diff={reviewTask.difficulty}/>
                                    <span className="tm-reward-badge" style={{background:'#fffbeb',color:'#92400e'}}>
                                        <i className="fas fa-coins"></i>{fmtMoney(reviewTask.reward)}
                                    </span>
                                </div>
                            </div>
                            <div style={{background:'#f0fdf4',border:'1.5px solid #bbf7d0',borderRadius:'12px',padding:'16px',marginBottom:'24px'}}>
                                <div style={{fontSize:'11px',fontWeight:700,color:'#065f46',textTransform:'uppercase',letterSpacing:'.5px',marginBottom:'8px',display:'flex',alignItems:'center',gap:'6px'}}>
                                    <i className="fas fa-chalkboard-teacher"></i>
                                    {reviewTask.claimedByName} — Багшийн хариулт
                                </div>
                                <div style={{fontSize:'14px',color:'#1e293b',lineHeight:1.7,whiteSpace:'pre-wrap'}}>{reviewTask.answer}</div>
                                {reviewTask.answerSubmittedAt && (
                                    <div style={{fontSize:'11px',color:'#94a3b8',marginTop:'8px'}}>
                                        <i className="fas fa-clock"></i> {timeAgo(reviewTask.answerSubmittedAt)} илгэсэн
                                    </div>
                                )}
                            </div>
                            <div style={{display:'flex',gap:'10px',justifyContent:'flex-end'}}>
                                <button className="tm-btn-cancel" style={{flex:1}} onClick={()=>setReview(null)}>Болих</button>
                                <button className="tm-btn-confirm" style={{flex:1,background:'#ef4444',borderColor:'#ef4444'}}
                                    onClick={()=>handleReject(reviewTask)}>
                                    <i className="fas fa-times"></i> Татгалзах
                                </button>
                                <button className="tm-btn-confirm" style={{flex:1}}
                                    onClick={()=>handleApprove(reviewTask)}>
                                    <i className="fas fa-check"></i> Зөвшөөрөх
                                </button>
                            </div>
                            <div style={{fontSize:'11px',color:'#94a3b8',marginTop:'12px',textAlign:'center'}}>
                                Зөвшөрвөл {fmtMoney(reviewTask.reward)} багш руу шилжинэ · Татгалзавал танд буцаж ирнэ
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

window.StudentMarket = StudentMarket;
import React, { useMemo, useState } from 'react'
import { BookOpen, Search, Menu, X, Zap, Laptop, Building2, Settings, CircuitBoard, GraduationCap, FileText, Download, Languages, Plus, ExternalLink, Trash2, FileUp, ShieldCheck, ChevronRight, LibraryBig, BookMarked } from 'lucide-react'
import { starterResources, branches, semesters, categories } from './data.js'

const STORAGE_KEY = 'dsh-resources-v1'
const getSaved = () => {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')
    return Array.isArray(saved) ? saved : []
  } catch { return [] }
}
const copy = {
  en: {
    tagline: 'Free Notes · Books · PYQs · Syllabus',
    heroTitle: 'Study smarter. Build your future.',
    heroText: 'Your study material, organized in one place.',
    search: 'Search subject, topic or material…',
    branches: 'Explore by stream',
    allResources: 'Study material',
    subtitle: 'Find notes, question papers, books and syllabus links.',
    all: 'All',
    semester: 'Semester',
    category: 'Type',
    open: 'Open resource',
    empty: 'No resources match your search yet.',
    admin: 'Admin tools',
    adminNote: 'Add a resource link',
    title: 'Resource title',
    branch: 'Stream / branch',
    chooseSemester: 'Choose semester',
    type: 'Material type',
    language: 'Language',
    description: 'Short description',
    url: 'Public PDF or webpage URL',
    add: 'Add resource',
    export: 'Export custom resources',
    demo: 'Sample',
    footer: 'Built for learners. Share only material you own or have permission to distribute.',
    adminWarning: 'Static-site demo: additions are saved only in this browser. They do not publish for other visitors. See README for permanent publishing and real file uploads.',
    browse: 'Browse material',
    home: 'Home',
    hideAdmin: 'Close admin',
    saved: 'Saved in this browser',
    remove: 'Remove',
  },
  hi: {
    tagline: 'मुफ़्त नोट्स · किताबें · PYQ · सिलेबस',
    heroTitle: 'बेहतर पढ़ें, अपना भविष्य बनाएँ।',
    heroText: 'आपकी पढ़ाई की सामग्री, एक ही जगह।',
    search: 'विषय, टॉपिक या सामग्री खोजें…',
    branches: 'ब्रांच के अनुसार देखें',
    allResources: 'स्टडी मटेरियल',
    subtitle: 'नोट्स, प्रश्नपत्र, किताबें और सिलेबस लिंक खोजें।',
    all: 'सभी',
    semester: 'सेमेस्टर',
    category: 'प्रकार',
    open: 'सामग्री खोलें',
    empty: 'आपकी खोज से मेल खाती सामग्री नहीं मिली।',
    admin: 'एडमिन टूल्स',
    adminNote: 'सामग्री का लिंक जोड़ें',
    title: 'सामग्री का नाम',
    branch: 'स्ट्रीम / ब्रांच',
    chooseSemester: 'सेमेस्टर चुनें',
    type: 'सामग्री का प्रकार',
    language: 'भाषा',
    description: 'छोटा विवरण',
    url: 'पब्लिक PDF या वेबसाइट URL',
    add: 'सामग्री जोड़ें',
    export: 'अपनी सामग्री Export करें',
    demo: 'नमूना',
    footer: 'विद्यार्थियों के लिए बनाया गया। केवल अपनी या अनुमति प्राप्त सामग्री साझा करें।',
    adminWarning: 'यह static-site demo है: जोड़े गए लिंक केवल इसी ब्राउज़र में सेव होते हैं। दूसरे visitors को नहीं दिखेंगे। स्थायी प्रकाशन और असली file upload के लिए README देखें।',
    browse: 'सामग्री देखें',
    home: 'होम',
    hideAdmin: 'एडमिन बंद करें',
    saved: 'इस ब्राउज़र में सेव',
    remove: 'हटाएँ',
  },
}
const iconMap = {
  'Electrical Engineering': Zap,
  'Computer Engineering': Laptop,
  'Civil Engineering': Building2,
  'Mechanical Engineering': Settings,
  'Electronics Engineering': CircuitBoard,
  'School Classes 7–12': GraduationCap,
}
const categoryIcon = { Notes: BookOpen, PYQ: FileText, Books: LibraryBig, Syllabus: BookMarked }

export default function App() {
  const [lang, setLang] = useState('en')
  const t = copy[lang]
  const [query, setQuery] = useState('')
  const [branch, setBranch] = useState('All branches')
  const [semester, setSemester] = useState('All semesters')
  const [category, setCategory] = useState('All material')
  const [adminOpen, setAdminOpen] = useState(false)
  const [mobileMenu, setMobileMenu] = useState(false)
  const [customResources, setCustomResources] = useState(getSaved)
  const [form, setForm] = useState({
    title: '', branch: 'Electrical Engineering', semester: 'Semester 3',
    category: 'Notes', language: 'English + Hindi', description: '', url: ''
  })
  const allResources = useMemo(() => [...customResources, ...starterResources], [customResources])
  const filtered = useMemo(() => allResources.filter(r => {
    const text = `${r.title} ${r.titleHi || ''} ${r.branch} ${r.semester} ${r.category} ${r.description}`.toLowerCase()
    return (!query || text.includes(query.toLowerCase())) &&
      (branch === 'All branches' || r.branch === branch) &&
      (semester === 'All semesters' || r.semester === semester) &&
      (category === 'All material' || r.category === category)
  }), [allResources, query, branch, semester, category])

  const setField = (key, value) => setForm(prev => ({ ...prev, [key]: value }))
  const addResource = (e) => {
    e.preventDefault()
    if (!form.title.trim() || !form.url.trim()) return
    let parsed
    try { parsed = new URL(form.url) } catch { alert('Please enter a valid URL beginning with https://'); return }
    if (!['https:', 'http:'].includes(parsed.protocol)) { alert('Only web links are supported.'); return }
    const item = { ...form, id: `custom-${Date.now()}`, title: form.title.trim(), url: parsed.href, description: form.description.trim(), isDemo: false }
    const next = [item, ...customResources]
    setCustomResources(next)
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(next)) } catch { alert('Browser storage is full. Export your data and remove some items.'); return }
    setForm({ title: '', branch: 'Electrical Engineering', semester: 'Semester 3', category: 'Notes', language: 'English + Hindi', description: '', url: '' })
  }
  const removeResource = (id) => {
    const next = customResources.filter(r => r.id !== id)
    setCustomResources(next)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
  }
  const exportResources = () => {
    const blob = new Blob([JSON.stringify(customResources, null, 2)], { type: 'application/json' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = 'diploma-study-hub-resources.json'
    link.click()
    URL.revokeObjectURL(link.href)
  }

  return <div className="app-shell">
    <header className="topbar">
      <a className="brand" href="#home" aria-label="Diploma Study Hub home">
        <span className="brand-icon"><Zap size={23} fill="currentColor" /></span>
        <span><strong>Diploma Study Hub</strong><small>{t.tagline}</small></span>
      </a>
      <nav className={mobileMenu ? 'nav-links nav-open' : 'nav-links'}>
        <a href="#home" onClick={() => setMobileMenu(false)}>{t.home}</a>
        <a href="#branches" onClick={() => setMobileMenu(false)}>{t.branches}</a>
        <a href="#resources" onClick={() => setMobileMenu(false)}>{t.browse}</a>
        <button className="nav-admin" onClick={() => { setAdminOpen(!adminOpen); setMobileMenu(false) }}><Plus size={16}/>{adminOpen ? t.hideAdmin : t.admin}</button>
      </nav>
      <div className="header-actions">
        <button className="language-btn" onClick={() => setLang(lang === 'en' ? 'hi' : 'en')} aria-label="Toggle language"><Languages size={17}/>{lang === 'en' ? 'हिंदी' : 'English'}</button>
        <button className="menu-btn" onClick={() => setMobileMenu(!mobileMenu)} aria-label="Toggle menu">{mobileMenu ? <X/> : <Menu/>}</button>
      </div>
    </header>

    <main>
      <section className="hero" id="home">
        <div className="hero-content">
          <span className="eyebrow"><span className="pulse-dot"></span> {lang === 'en' ? 'YOUR LEARNING COMPANION' : 'आपका पढ़ाई साथी'}</span>
          <h1>{t.heroTitle}</h1>
          <p>{t.heroText}</p>
          <div className="hero-search">
            <Search size={21}/>
            <input value={query} onChange={e => setQuery(e.target.value)} placeholder={t.search} aria-label={t.search}/>
            {query && <button onClick={() => setQuery('')} aria-label="Clear search"><X size={18}/></button>}
          </div>
          <div className="hero-points"><span><ShieldCheck size={16}/> {lang === 'en' ? 'Organized resources' : 'व्यवस्थित सामग्री'}</span><span><BookOpen size={16}/> {lang === 'en' ? 'Student-friendly' : 'विद्यार्थियों के लिए'}</span></div>
        </div>
        <div className="hero-art" aria-hidden="true">
          <div className="orbit orbit-one"></div><div className="orbit orbit-two"></div>
          <div className="book-illustration"><div className="book-spine"></div><div className="book-cover"><Zap size={52}/><span>STUDY<br/>HUB</span></div><div className="book-pages"></div></div>
          <div className="float-card float-one"><FileText size={20}/><span>Notes & PYQs</span></div>
          <div className="float-card float-two"><BookOpen size={20}/><span>Learn daily</span></div>
        </div>
      </section>

      <section className="section" id="branches">
        <div className="section-heading"><div><span className="section-kicker">01 / STREAMS</span><h2>{t.branches}</h2><p>{lang === 'en' ? 'Choose a stream to narrow down your resources.' : 'सामग्री देखने के लिए अपनी ब्रांच चुनें।'}</p></div></div>
        <div className="branch-grid">
          {branches.map((name, i) => {
            const Icon = iconMap[name] || GraduationCap
            return <button key={name} className={`branch-card ${branch === name ? 'selected' : ''}`} onClick={() => { setBranch(branch === name ? 'All branches' : name); document.getElementById('resources')?.scrollIntoView({ behavior: 'smooth' }) }}>
              <span className={`branch-icon branch-${i}`}><Icon size={23}/></span><span className="branch-name">{name}</span><span className="branch-meta">{name === 'School Classes 7–12' ? 'Classes 7–12' : 'Semesters 1–6'}</span><ChevronRight className="branch-arrow" size={18}/>
            </button>
          })}
        </div>
      </section>

      <section className="section resource-section" id="resources">
        <div className="section-heading resource-heading"><div><span className="section-kicker">02 / LIBRARY</span><h2>{t.allResources}</h2><p>{t.subtitle}</p></div><span className="result-count">{filtered.length} {lang === 'en' ? 'resources' : 'सामग्री'}</span></div>
        <div className="filters">
          <label><span>{t.semester}</span><select value={semester} onChange={e => setSemester(e.target.value)}>{semesters.map(s => <option key={s}>{s}</option>)}</select></label>
          <label><span>{t.category}</span><select value={category} onChange={e => setCategory(e.target.value)}>{categories.map(c => <option key={c}>{c}</option>)}</select></label>
          <label><span>{lang === 'en' ? 'Branch' : 'ब्रांच'}</span><select value={branch} onChange={e => setBranch(e.target.value)}><option>All branches</option>{branches.map(b => <option key={b}>{b}</option>)}</select></label>
          {(branch !== 'All branches' || semester !== 'All semesters' || category !== 'All material' || query) && <button className="reset-btn" onClick={() => { setBranch('All branches'); setSemester('All semesters'); setCategory('All material'); setQuery('') }}>{lang === 'en' ? 'Reset filters' : 'फ़िल्टर हटाएँ'}</button>}
        </div>
        {filtered.length ? <div className="resource-grid">{filtered.map(r => {
          const Icon = categoryIcon[r.category] || FileText
          return <article className="resource-card" key={r.id}>
            <div className="resource-card-top"><span className={`resource-type type-${r.category.toLowerCase()}`}><Icon size={17}/>{r.category}</span>{r.isDemo && <span className="sample-pill">{t.demo}</span>}</div>
            <h3>{lang === 'hi' && r.titleHi ? r.titleHi : r.title}</h3>
            <p>{r.description}</p>
            <div className="resource-meta"><span>{r.branch}</span><span>{r.semester}</span></div>
            <a className="resource-link" href={r.url} target="_blank" rel="noreferrer">{t.open}<ExternalLink size={16}/></a>
            {!r.isDemo && <button className="remove-resource" onClick={() => removeResource(r.id)} title={t.remove} aria-label={t.remove}><Trash2 size={15}/></button>}
          </article>
        })}</div> : <div className="empty-state"><Search size={30}/><h3>{t.empty}</h3><p>{lang === 'en' ? 'Try a different search or clear the filters.' : 'दूसरी खोज करें या फ़िल्टर हटाएँ।'}</p></div>}
      </section>

      {adminOpen && <section className="section admin-section" id="admin">
        <div className="section-heading"><div><span className="section-kicker">03 / ADMIN</span><h2>{t.admin}</h2><p>{t.adminNote}</p></div></div>
        <div className="admin-warning"><ShieldCheck size={20}/><span>{t.adminWarning}</span></div>
        <form className="admin-form" onSubmit={addResource}>
          <label>{t.title}<input required value={form.title} onChange={e => setField('title', e.target.value)} placeholder="e.g. Basic Electrical Notes"/></label>
          <label>{t.branch}<select value={form.branch} onChange={e => setField('branch', e.target.value)}>{branches.map(b => <option key={b}>{b}</option>)}</select></label>
          <label>{t.chooseSemester}<select value={form.semester} onChange={e => setField('semester', e.target.value)}>{semesters.slice(1).map(s => <option key={s}>{s}</option>)}<option>Class 7</option><option>Class 8</option><option>Class 9</option><option>Class 10</option><option>Class 11</option><option>Class 12</option></select></label>
          <label>{t.type}<select value={form.category} onChange={e => setField('category', e.target.value)}>{categories.slice(1).map(c => <option key={c}>{c}</option>)}</select></label>
          <label>{t.language}<select value={form.language} onChange={e => setField('language', e.target.value)}><option>English + Hindi</option><option>English</option><option>Hindi</option><option>Gujarati</option></select></label>
          <label className="wide-field">{t.url}<input required type="url" value={form.url} onChange={e => setField('url', e.target.value)} placeholder="https://example.com/your-notes.pdf"/></label>
          <label className="wide-field">{t.description}<textarea value={form.description} onChange={e => setField('description', e.target.value)} rows="3" placeholder="What will students learn from this resource?"/></label>
          <div className="form-actions"><button className="primary-btn" type="submit"><Plus size={17}/>{t.add}</button><button className="secondary-btn" type="button" onClick={exportResources}><Download size={17}/>{t.export}</button></div>
        </form>
        {customResources.length > 0 && <p className="saved-note"><ShieldCheck size={16}/>{customResources.length} {t.saved}</p>}
      </section>}
    </main>

    <footer className="footer"><div className="footer-brand"><span className="brand-icon"><Zap size={20} fill="currentColor"/></span><strong>Diploma Study Hub</strong></div><p>{t.footer}</p><span className="copyright">© {new Date().getFullYear()} Diploma Study Hub · Independent student project</span></footer>
  </div>
}

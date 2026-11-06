import React, { useEffect, useRef, useState } from 'react';
import { Home, Search, Library, Heart, Play, Pause, SkipBack, SkipForward, Shuffle, Repeat2, Volume2, MoreHorizontal, Plus, Music2, Headphones, Clock3, ChevronDown, ListMusic, Disc3, Radio, Sparkles } from 'lucide-react';

const tracks = [
  { id: 1, title: 'Midnight City', artist: 'M83', album: 'Hurry Up, We’re Dreaming', color: 'cover-purple', duration: '4:03', url: '' },
  { id: 2, title: 'After Dark', artist: 'Mr.Kitty', album: 'Time', color: 'cover-blue', duration: '4:17', url: '' },
  { id: 3, title: 'The Less I Know The Better', artist: 'Tame Impala', album: 'Currents', color: 'cover-pink', duration: '3:36', url: '' },
  { id: 4, title: 'Resonance', artist: 'HOME', album: 'Odyssey', color: 'cover-orange', duration: '3:32', url: '' },
  { id: 5, title: 'Nightcall', artist: 'Kavinsky', album: 'OutRun', color: 'cover-red', duration: '4:18', url: '' },
  { id: 6, title: 'Sunset Lover', artist: 'Petit Biscuit', album: 'Presence', color: 'cover-green', duration: '3:57', url: '' }
];

function Cover({ track, small = false }) {
  return <div className={`cover ${track.color} ${small ? 'cover-small' : ''}`}><div className="cover-glow"/><Music2 size={small ? 20 : 34} strokeWidth={1.4}/><span className="cover-label">QS<span>BASE</span></span></div>;
}

export default function App() {
  const [page, setPage] = useState('home');
  const [query, setQuery] = useState('');
  const [current, setCurrent] = useState(tracks[0]);
  const [playing, setPlaying] = useState(false);
  const [liked, setLiked] = useState([]);
  const [favoritesOnly, setFavoritesOnly] = useState(false);
  const [volume, setVolume] = useState(75);
  const [progress, setProgress] = useState(0);
  const [telegramUser, setTelegramUser] = useState(null);
  const audioRef = useRef(null);

  useEffect(() => {
    const tg = window.Telegram?.WebApp;
    if (tg) { tg.ready(); tg.expand(); setTelegramUser(tg.initDataUnsafe?.user || null); }
  }, []);

  useEffect(() => {
    if (!current?.url) { setPlaying(false); return; }
    const audio = audioRef.current;
    if (!audio) return;
    audio.src = current.url;
    audio.volume = volume / 100;
    if (playing) audio.play().catch(() => setPlaying(false));
  }, [current]);

  useEffect(() => { if (audioRef.current) audioRef.current.volume = volume / 100; }, [volume]);
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !current?.url) return;
    if (playing) audio.play().catch(() => setPlaying(false)); else audio.pause();
  }, [playing]);

  const toggleTrack = (track) => {
    if (current?.id === track.id) setPlaying(!playing);
    else { setCurrent(track); setPlaying(Boolean(track.url)); setProgress(0); }
  };
  const nextTrack = (direction = 1) => {
    const index = tracks.findIndex(t => t.id === current?.id);
    const next = tracks[(index + direction + tracks.length) % tracks.length];
    setCurrent(next); setPlaying(Boolean(next.url)); setProgress(0);
  };
  const toggleLike = (id) => setLiked(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  const visibleTracks = (page === 'library' && favoritesOnly ? tracks.filter(t => liked.includes(t.id)) : tracks)
    .filter(t => (page !== 'search' || query.trim() === '' || (t.title + t.artist + t.album).toLowerCase().includes(query.toLowerCase())));
  const title = page === 'home' ? 'Твоя музыка. Твои правила.' : page === 'search' ? 'Поиск' : 'Моя библиотека';

  return <div className="app-shell">
    <aside className="sidebar">
      <a className="brand" href="#" onClick={e => {e.preventDefault();setPage('home')}}><div className="brand-mark"><Headphones size={22}/></div><span>QSound<span className="brand-base">Base</span></span></a>
      <div className="side-label">МЕНЮ</div>
      <button className={page==='home'?'nav-item active':'nav-item'} onClick={()=>setPage('home')}><Home size={19}/> Главная</button>
      <button className={page==='search'?'nav-item active':'nav-item'} onClick={()=>setPage('search')}><Search size={19}/> Поиск</button>
      <button className={page==='library'?'nav-item active':'nav-item'} onClick={()=>{setPage('library');setFavoritesOnly(false)}}><Library size={19}/> Моя библиотека</button>
      <div className="side-divider"/>
      <div className="side-label row-label">ТВОИ ПЛЕЙЛИСТЫ <button className="icon-button" title="Создать плейлист"><Plus size={16}/></button></div>
      <button className="playlist-link"><span className="playlist-icon purple"><Heart size={15}/></span> Любимые треки</button>
      <button className="playlist-link"><span className="playlist-icon teal"><ListMusic size={15}/></span> Ночной вайб</button>
      <button className="playlist-link"><span className="playlist-icon orange"><Disc3 size={15}/></span> В дороге</button>
      <div className="sidebar-bottom"><div className="upgrade-card"><Sparkles size={18}/><b>Музыка без границ</b><span>Твоя личная музыкальная база.</span></div><div className="user-profile"><div className="avatar">{telegramUser?.first_name?.[0] || 'Q'}</div><div><b>{telegramUser?.first_name || 'Гость QSound'}</b><span>{telegramUser?.username ? '@'+telegramUser.username : 'Слушатель'}</span></div><MoreHorizontal size={18}/></div></div>
    </aside>

    <main className="main-area">
      <header className="topbar"><div className="mobile-brand"><div className="brand-mark"><Headphones size={19}/></div>QSound<span>Base</span></div><div className="top-actions"><span className="status-dot"/> <span className="status-text">Твоя музыкальная вселенная</span><button className="avatar top-avatar">{telegramUser?.first_name?.[0] || 'Q'}</button></div></header>
      <div className="content">
        <div className="greeting"><div className="eyebrow"><span className="eyebrow-line"/> Q S O U N D B A S E</div><h1>{title}</h1><p>{page==='home'?'Открой новые звуки и найди свой ритм.':'Найди трек, который звучит именно так, как ты.'}</p></div>
        {page==='search' && <div className="search-box"><Search size={20}/><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Песня, исполнитель или альбом..."/>{query && <button onClick={()=>setQuery('')}>×</button>}</div>}
        {page==='home' && <section className="hero"><div className="hero-content"><span className="pill"><Sparkles size={13}/> FEATURED PLAYLIST</span><h2>Ночь звучит<br/><span>по-другому.</span></h2><p>Музыка для поздних поездок,<br/>больших мыслей и маленьких моментов.</p><button className="primary-button" onClick={()=>toggleTrack(tracks[0])}><Play size={17} fill="currentColor"/> Слушать подборку</button></div><div className="hero-art"><div className="orbit orbit-one"/><div className="orbit orbit-two"/><div className="hero-disc"><div className="disc-center"><Headphones size={42}/></div></div><div className="floating-note note-one">♫</div><div className="floating-note note-two">♪</div></div><div className="hero-footer"><span><span className="live-dot"/> QSB EDITION 001</span><span>MOOD · NIGHT DRIVE</span></div></section>}
        {page==='home' && <div className="section-heading"><div><h2>Твой вайб сегодня</h2><p>Подборка под настроение</p></div><button className="text-button" onClick={()=>setPage('search')}>Все треки <span>↗</span></button></div>}
        {page==='home' && <div className="mood-grid"><button className="mood-card mood-violet" onClick={()=>setPage('search')}><span>✦</span><b>Ночной вайб</b><small>Chill · Ambient</small></button><button className="mood-card mood-blue" onClick={()=>setPage('search')}><span>◉</span><b>В потоке</b><small>Electronic · Focus</small></button><button className="mood-card mood-pink" onClick={()=>setPage('search')}><span>♡</span><b>На повторе</b><small>Indie · Dream pop</small></button><button className="mood-card mood-green" onClick={()=>setPage('search')}><span>↗</span><b>Дорога</b><small>Synthwave · Retro</small></button></div>}
        <div className="section-heading tracks-heading"><div><h2>{page==='library'?'Твоя коллекция':page==='search'?'Результаты поиска':'Популярное в QSoundBase'}</h2><p>{page==='library'?'Собрано тобой':'Звуки, которые стоит услышать'}</p></div>{page==='library' && <button className="filter-button" onClick={()=>setFavoritesOnly(!favoritesOnly)}><Heart size={14} fill={favoritesOnly?'currentColor':'none'}/> Избранное</button>}</div>
        <div className="track-table"><div className="table-head"><span>#</span><span>ТРЕК</span><span>АЛЬБОМ</span><span><Clock3 size={14}/></span><span/></div>{visibleTracks.map((track,index)=><div className={current?.id===track.id?'track-row selected':'track-row'} key={track.id} onDoubleClick={()=>toggleTrack(track)}><span className="track-number">{current?.id===track.id&&playing?<span className="equalizer">▂▅▃</span>:String(index+1).padStart(2,'0')}</span><div className="track-info"><button className="track-cover-button" onClick={()=>toggleTrack(track)}><Cover track={track} small/><span className="cover-play"><Play size={15} fill="currentColor"/></span></button><div><b>{track.title}</b><span>{track.artist}</span></div></div><span className="album-name">{track.album}</span><span className="duration">{track.duration}</span><button className={liked.includes(track.id)?'like-button liked':'like-button'} onClick={()=>toggleLike(track.id)}><Heart size={16} fill={liked.includes(track.id)?'currentColor':'none'}/></button></div>)}</div>
        {visibleTracks.length===0 && <div className="empty-state"><Music2 size={30}/><b>Ничего не найдено</b><span>Попробуй другой запрос или добавь музыку в библиотеку.</span></div>}
        <div className="catalog-note"><Music2 size={15}/> Демонстрационный каталог. Администратор сможет добавлять аудиофайлы после подключения хранилища.</div>
      </div>
    </main>

    <div className="player-bar"><div className="now-playing"><Cover track={current || tracks[0]} small/><div className="now-text"><b>{current?.title || 'Выбери трек'}</b><span>{current?.artist || 'QSoundBase'}</span></div><button className={liked.includes(current?.id)?'like-button liked':'like-button'} onClick={()=>current&&toggleLike(current.id)}><Heart size={16} fill={liked.includes(current?.id)?'currentColor':'none'}/></button></div><div className="player-center"><div className="player-controls"><button title="Перемешать"><Shuffle size={15}/></button><button onClick={()=>nextTrack(-1)}><SkipBack size={19} fill="currentColor"/></button><button className="play-button" onClick={()=>current?.url?setPlaying(!playing):setPlaying(false)}>{playing?<Pause size={19} fill="currentColor"/>:<Play size={19} fill="currentColor"/>}</button><button onClick={()=>nextTrack(1)}><SkipForward size={19} fill="currentColor"/></button><button title="Повтор"><Repeat2 size={15}/></button></div><div className="progress-row"><span>0:00</span><input type="range" min="0" max="100" value={progress} onChange={e=>setProgress(Number(e.target.value))}/><span>{current?.duration || '0:00'}</span></div></div><div className="player-extra"><button><ListMusic size={17}/></button><Volume2 size={17}/><input type="range" min="0" max="100" value={volume} onChange={e=>setVolume(Number(e.target.value))}/></div></div>
    <audio ref={audioRef} onTimeUpdate={e=>{const a=e.currentTarget;setProgress(a.duration?Math.round(a.currentTime/a.duration*100):0)}} onEnded={()=>nextTrack(1)}/>
    <nav className="mobile-nav"><button className={page==='home'?'active':''} onClick={()=>setPage('home')}><Home size={20}/><span>Главная</span></button><button className={page==='search'?'active':''} onClick={()=>setPage('search')}><Search size={20}/><span>Поиск</span></button><button className={page==='library'?'active':''} onClick={()=>setPage('library')}><Library size={20}/><span>Библиотека</span></button></nav>
  </div>;
}
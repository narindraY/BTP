import { useState, useEffect, useRef, useCallback } from 'react';
import io from 'socket.io-client';
import axios from 'axios';
import { url, base_url } from '../../Utils/IP';

// ─── Helpers ───────────────────────────────────────────────────────────────

const parseMsg = (msg) => {
  if (typeof msg.contenu !== 'string') return msg;
  if (msg.contenu.split('|||').length === 4) {
    const [name, url, type, kind] = msg.contenu.split('|||');
    return { ...msg, contenu: name, fichier: { url, type, kind } };
  }
  if (msg.contenu.includes('|||')) {
    const [txt, url, type] = msg.contenu.split('|||');
    return { ...msg, contenu: txt, fichier: { url, type } };
  }
  try {
    const p = JSON.parse(msg.contenu);
    if (p?.f) return { ...msg, contenu: p.t, fichier: p.f };
  } catch (_) {}
  return msg;
};

const COLORS = ['#0c7ac4', '#46e789', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];
const colorFromName = (name = '') => {
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
  return COLORS[Math.abs(hash) % COLORS.length];
};
const initial = (name) => (name || '?')[0].toUpperCase();
const fmt = (d) => d ? new Date(d).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '';
const dateLabel = (d) => {
  if (!d) return '';
  const date = new Date(d);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  if (date.toDateString() === today.toDateString()) return "Aujourd'hui";
  if (date.toDateString() === yesterday.toDateString()) return 'Hier';
  return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });
};
const sameDay = (a, b) => a && b && new Date(a.date_creation).toDateString() === new Date(b.date_creation).toDateString();
const isMe = (msg, uid) => [msg.utilisateur_id, msg.emetteur_id].includes(uid);

// ─── Sous-composants ───────────────────────────────────────────────────────

const Avatar = ({ name, size = 'md' }) => (
  <div className={`${size === 'sm' ? 'w-8 h-8 text-xs' : 'w-10 h-10 text-sm'} rounded-full flex items-center justify-center text-white font-bold shadow flex-shrink-0`}
       style={{ backgroundColor: colorFromName(name) }}>{initial(name)}</div>
);

const DoubleCheck = ({ read }) => (
  <svg className={`h-3 w-3 ${read ? 'text-[var(--secondary)]' : 'text-gray-300'}`} viewBox="0 0 16 11" fill="none">
    <path d="M1 5.5L4.5 9L11 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    {read && <path d="M6 5.5L9.5 9L16 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.6"/>}
  </svg>
);

const TypingBubble = ({ name }) => (
  <div className="flex justify-start mt-2 animate-fadeIn">
    <div className="flex items-end gap-2">
      <Avatar name={name} size="sm" />
      <div className="bg-white px-4 py-3 rounded-2xl rounded-bl-none border border-gray-200 shadow-sm flex items-center gap-1">
        <span className="text-xs font-medium text-gray-500 mr-1">{name}</span>
        {[0, 0.15, 0.3].map((d, i) => (
          <span key={i} className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: `${d}s` }} />
        ))}
      </div>
    </div>
  </div>
);

// ─── Composant principal ───────────────────────────────────────────────────

export default function Chat() {
  const [discussions, setDiscussions] = useState([]);
  const [selected, setSelected] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [socket, setSocket] = useState(null);
  const [user, setUser] = useState(null);
  const [typing, setTyping] = useState(false);
  const [otherTyping, setOtherTyping] = useState(false);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  // Edit state
  const [editId, setEditId] = useState(null);
  const [editText, setEditText] = useState('');

  // Context menu state
  const [ctxMenu, setCtxMenu] = useState({ msg: null, x: 0, y: 0 });

  const timerRef = useRef(null);
  const bottomRef = useRef(null);
  const fileRef = useRef(null);
  const inputRef = useRef(null);
  const longPressRef = useRef(null);
  const token = localStorage.getItem('token');
  const isAdmin = user?.role === 'admin';
  const menuRef = useRef(null);

  // ─── Initialisation ──────────────────────────────────────────────────

  useEffect(() => {
    (async () => {
      try {
        const { data: u } = await axios.get(`${base_url}/user/profile`, { headers: { Authorization: `Bearer ${token}` } });
        setUser(u);
        const { data: d } = await axios.get(`${base_url}/chat/discussions`, { headers: { Authorization: `Bearer ${token}` } });
        setDiscussions(d);
        const sock = io(url);
        setSocket(sock);
        if (u.role !== 'admin') {
          let target = d[0];
          if (!target) {
            await axios.post(`${base_url}/chat/start`, { client_id: 1 }, { headers: { Authorization: `Bearer ${token}` } });
            const { data: ref } = await axios.get(`${base_url}/chat/discussions`, { headers: { Authorization: `Bearer ${token}` } });
            setDiscussions(ref); target = ref[0];
          }
          if (target) {
            setSelected(target);
            const { data: h } = await axios.get(`${base_url}/chat/history?discussion_id=${target.id_discussion}`, { headers: { Authorization: `Bearer ${token}` } });
            setMessages(h.map(parseMsg));
            sock.emit('join_discussion', target.id_discussion);
          }
        }
      } catch (e) { console.error(e); }
      finally { setLoading(false); }
    })();
    return () => socket?.close();
  }, [token]);

  // ─── Socket events ───────────────────────────────────────────────────

  useEffect(() => {
    if (!socket) return;
    const onMsg = (data) => {
      const m = parseMsg(data);
      if (m.discussion_id === selected?.id_discussion) {
        setMessages(p => [...p, m]);
        socket.emit('mark_as_read', { discussion_id: m.discussion_id });
      }
      setDiscussions(p => p.map(d => d.id_discussion === m.discussion_id ? { ...d, last_message: m.contenu } : d));
    };
    const onTyping = (data) => {
      if (data.discussion_id === selected?.id_discussion && data.utilisateur_id !== user?.id) setOtherTyping(data.nom || 'Quelqu\'un');
    };
    const onStopTyping = (data) => {
      if (data.discussion_id === selected?.id_discussion) setOtherTyping(false);
    };
    const onRead = (data) => {
      if (data.discussion_id === selected?.id_discussion) setMessages(p => p.map(m => ({ ...m, lu: 1 })));
    };
    const onEdited = (data) => {
      if (data.discussion_id === selected?.id_discussion)
        setMessages(p => p.map(m => m.id_message === data.id_message ? { ...m, contenu: data.contenu, is_edited: 1 } : m));
    };
    const onDeleted = (data) => {
      if (data.mode === 'everyone' && data.discussion_id === selected?.id_discussion)
        setMessages(p => p.map(m => m.id_message === data.id_message ? { ...m, is_deleted: 1, contenu: '' } : m));
      if (data.mode === 'self' && data.userId === user?.id)
        setMessages(p => p.filter(m => m.id_message !== data.id_message));
    };

    socket.on('receive_message', onMsg);
    socket.on('user_typing', onTyping);
    socket.on('user_stop_typing', onStopTyping);
    socket.on('messages_read', onRead);
    socket.on('message_edited', onEdited);
    socket.on('message_deleted', onDeleted);
    return () => {
      socket.off('receive_message'); socket.off('user_typing'); socket.off('user_stop_typing');
      socket.off('messages_read'); socket.off('message_edited'); socket.off('message_deleted');
    };
  }, [socket, selected, user]);

  // ─── Auto-scroll ─────────────────────────────────────────────────────

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages, otherTyping]);

  // Fermer le menu contextuel
  useEffect(() => {
    const close = (e) => {
      if (ctxMenu.msg && menuRef.current && !menuRef.current.contains(e.target)) setCtxMenu({ msg: null, x: 0, y: 0 });
    };
    document.addEventListener('mousedown', close);
    return () => document.removeEventListener('mousedown', close);
  }, [ctxMenu.msg]);

  // ─── Actions ─────────────────────────────────────────────────────────

  const openDiscussion = async (disc) => {
    setSelected(disc); setOtherTyping(false);
    try {
      const { data } = await axios.get(`${base_url}/chat/history?discussion_id=${disc.id_discussion}`, { headers: { Authorization: `Bearer ${token}` } });
      setMessages(data.map(parseMsg));
      socket?.emit('join_discussion', disc.id_discussion);
      socket?.emit('mark_as_read', { discussion_id: disc.id_discussion });
    } catch (e) { console.error(e); }
  };

  const onType = (e) => {
    setInput(e.target.value);
    if (!socket || !selected) return;
    if (!typing) { setTyping(true); socket.emit('typing', { discussion_id: selected.id_discussion, utilisateur_id: user?.id, nom: user?.nom }); }
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => { setTyping(false); socket.emit('stop_typing', { discussion_id: selected.id_discussion }); }, 2000);
  };

  const send = (e) => {
    e.preventDefault();
    if (!input.trim() || !selected || !user) return;

    if (editId) {
      // Mode édition : on modifie le message existant
      submitEdit(input);
      return;
    }

    socket.emit('send_message', { discussion_id: selected.id_discussion, emetteur_id: user.id, nom: user.nom, contenu: input, date_creation: new Date().toISOString(), lu: 0 });
    socket.emit('stop_typing', { discussion_id: selected.id_discussion });
    setTyping(false); setInput('');
  };

  const sendFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file || !selected || !user) return;
    setUploading(true);
    try {
      const fd = new FormData(); fd.append('file', file);
      const { data } = await axios.post(`${base_url}/chat/upload`, fd, { headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' } });
      socket.emit('send_message', { discussion_id: selected.id_discussion, emetteur_id: user.id, nom: user.nom, contenu: `${file.name}|||${data.url}|||${data.type}|||${file.type.startsWith('image/') ? 'img' : 'file'}`, date_creation: new Date().toISOString(), lu: 0 });
    } catch (err) { console.error(err); }
    finally { setUploading(false); e.target.value = ''; }
  };

  // ─── Edition ─────────────────────────────────────────────────────────

  const startEdit = () => {
    const { msg } = ctxMenu;
    if (msg) { setEditId(msg.id_message); setInput(msg.contenu); }
    setCtxMenu({ msg: null, x: 0, y: 0 });
    // Focus l'input
    setTimeout(() => inputRef.current?.focus(), 50);
  };

  const submitEdit = async (contenu) => {
    if (!contenu.trim() || !editId) return;
    try {
      await axios.put(`${base_url}/chat/message/${editId}`, { contenu }, { headers: { Authorization: `Bearer ${token}` } });
      socket.emit('edit_message', { id_message: editId, discussion_id: selected?.id_discussion, contenu });
      setMessages(p => p.map(m => m.id_message === editId ? { ...m, contenu, is_edited: 1 } : m));
    } catch (err) { console.error(err); }
    setEditId(null); setInput('');
  };

  const cancelEdit = () => { setEditId(null); setInput(''); };

  // ─── Suppression ─────────────────────────────────────────────────────

  const deleteMsg = async (mode) => {
    const { msg } = ctxMenu;
    setCtxMenu({ msg: null, x: 0, y: 0 });
    if (!msg) return;
    try {
      const { data } = await axios.delete(`${base_url}/chat/message/${msg.id_message}?mode=${mode}`, { headers: { Authorization: `Bearer ${token}` } });
      socket.emit('delete_message', data);
      if (mode === 'everyone') setMessages(p => p.map(m => m.id_message === msg.id_message ? { ...m, is_deleted: 1, contenu: '' } : m));
      if (mode === 'self') setMessages(p => p.filter(m => m.id_message !== msg.id_message));
    } catch (err) { console.error(err); }
  };

  // ─── Copier ──────────────────────────────────────────────────────────

  const copyMsg = () => {
    const { msg } = ctxMenu;
    setCtxMenu({ msg: null, x: 0, y: 0 });
    if (msg?.contenu) navigator.clipboard.writeText(msg.contenu).catch(() => {});
  };

  // ─── Contexte menu (clic droit / long-press) ─────────────────────────

  const openContextMenu = useCallback((msg, x, y) => {
    setCtxMenu({ msg, x, y });
    setEditId(null);
  }, []);

  const handleContextMenu = (e, msg) => {
    if (!isMe(msg, user?.id) || msg.is_deleted) return;
    e.preventDefault();
    openContextMenu(msg, e.clientX, e.clientY);
  };

  const handleTouchStart = (e, msg) => {
    if (!isMe(msg, user?.id) || msg.is_deleted) return;
    longPressRef.current = setTimeout(() => {
      const touch = e.touches[0];
      openContextMenu(msg, touch.clientX, touch.clientY);
    }, 500);
  };

  const handleTouchEnd = () => { clearTimeout(longPressRef.current); };
  const handleTouchMove = () => { clearTimeout(longPressRef.current); };

  // ─── Rendu des messages ──────────────────────────────────────────────

  const renderMessages = () => {
    const els = [];
    messages.forEach((raw, i) => {
      const msg = parseMsg(raw);
      const prev = i > 0 ? parseMsg(messages[i - 1]) : null;
      const mine = isMe(msg, user?.id);
      const grouped = prev && isMe(msg, user?.id) === isMe(prev, user?.id);
      const newDay = !sameDay(msg, prev);
      const isDeleted = msg.is_deleted;

      if (newDay) els.push(
        <div key={`d${i}`} className="flex items-center justify-center my-4">
          <span className="bg-gray-200/70 text-gray-500 text-[11px] font-semibold px-3 py-1 rounded-full">{dateLabel(msg.date_creation)}</span>
        </div>
      );

      els.push(
        <div key={i} className={`flex ${mine ? 'justify-end' : 'justify-start'} ${grouped && !newDay ? 'mt-0.5' : 'mt-3'} transition-all duration-300 ${!isDeleted ? 'animate-fadeIn' : ''}`}>
          <div className={`flex ${mine ? 'flex-row-reverse' : 'flex-row'} items-end gap-2 max-w-[75%]`}>
            {!grouped || newDay ? <Avatar name={msg.nom} size="sm" /> : <div className="w-8" />}
            <div className={`flex flex-col ${mine ? 'items-end' : 'items-start'}`}>
              {(!grouped || newDay) && !mine && !isDeleted && <span className="text-[10px] font-bold text-gray-500 mb-0.5 ml-1 uppercase">{msg.nom}</span>}

              {/* Bulle */}
              <div
                onContextMenu={(e) => handleContextMenu(e, msg)}
                onTouchStart={(e) => handleTouchStart(e, msg)}
                onTouchEnd={handleTouchEnd}
                onTouchMove={handleTouchMove}
                className={`relative transition-all duration-200
                  ${isDeleted
                    ? 'bg-gray-50 border border-dashed border-gray-200 px-4 py-3'
                    : mine
                      ? 'bg-gradient-to-br from-[#075e54] to-[#128C7E] text-white'
                      : 'bg-white text-gray-800 border border-gray-100'
                  }
                  ${!isDeleted ? 'shadow-md' : ''}
                  ${!mine && !isDeleted ? 'shadow-gray-200/50' : ''}
                  px-4 py-2.5
                  ${mine
                    ? 'rounded-[18px] rounded-br-[6px]'
                    : 'rounded-[18px] rounded-bl-[6px]'
                  }
                  ${!isDeleted && mine ? 'cursor-pointer hover:brightness-95' : ''}
                  ${editId === msg.id_message ? 'ring-2 ring-[var(--secondary)] ring-offset-2' : ''}
                `}
              >
                {/* Message supprimé */}
                {isDeleted ? (
                  <p className="text-gray-400 text-xs italic select-none">Ce message a été supprimé</p>
                ) : (
                  <>
                    <p className="whitespace-pre-wrap break-words">
                      {msg.fichier?.url && msg.fichier.kind === 'file' && <span className="mr-1">📎</span>}
                      {(!msg.fichier?.url || msg.fichier.kind === 'file') && msg.contenu}
                    </p>
                    {msg.fichier?.url && msg.fichier.type?.startsWith('image/') && (
                      <img src={`${url}${msg.fichier.url}`}
                        className="mt-1.5 max-w-60 rounded-lg cursor-pointer hover:opacity-90 transition"
                        onClick={() => window.open(`${url}${msg.fichier.url}`, '_blank')}
                        onError={(e) => { e.target.style.display = 'none'; }} />
                    )}
                    {msg.fichier?.url && !msg.fichier.type?.startsWith('image/') && (
                      <a href={`${url}${msg.fichier.url}`} target="_blank" rel="noopener noreferrer"
                        className={`mt-1.5 flex items-center gap-2 text-xs underline ${mine ? 'text-white/80' : 'text-[var(--secondary)]'}`}>
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
                        Télécharger
                      </a>
                    )}
                  </>
                )}
              </div>

              {/* Timestamp + (modifié) + double-check */}
              <div className="flex items-center gap-1 mt-0.5 px-1">
                <span className="text-[9px] text-gray-400">{fmt(msg.date_creation)}</span>
                {msg.is_edited ? <span className="text-[9px] text-gray-400 italic ml-0.5">(modifié)</span> : null}
                {mine && <DoubleCheck read={msg.lu} />}
              </div>
            </div>
          </div>
        </div>
      );
    });
    return els;
  };

  // ─── Menu contextuel flottant ────────────────────────────────────────

  const renderContextMenu = () => {
    if (!ctxMenu.msg) return null;
    const msg = ctxMenu.msg;
    return (
      <>
        {/* Overlay transparent */}
        <div className="fixed inset-0 z-40" onClick={() => setCtxMenu({ msg: null, x: 0, y: 0 })} />
        <div ref={menuRef}
          className="fixed z-50 bg-white rounded-2xl shadow-2xl border border-gray-100 py-1.5 min-w-[200px] overflow-hidden animate-scaleIn"
          style={{ left: Math.min(ctxMenu.x, window.innerWidth - 220), top: Math.min(ctxMenu.y, window.innerHeight - 260) }}
        >
          {/* Copier */}
          <button onClick={copyMsg} className="w-full flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition">
            <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"/></svg>
            Copier
          </button>
          <div className="border-t border-gray-100" />
          {/* Modifier */}
          <button onClick={startEdit} className="w-full flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition">
            <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/></svg>
            Modifier
          </button>
          <div className="border-t border-gray-100" />
          {/* Supprimer pour moi */}
          <button onClick={() => deleteMsg('self')} className="w-full flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition">
            <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/></svg>
            Supprimer pour moi
          </button>
          {/* Supprimer pour tous (pas pour les fichiers) */}
          {!msg.fichier?.url && (
            <>
              <div className="border-t border-gray-100" />
              <button onClick={() => deleteMsg('everyone')} className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-500 hover:bg-red-50 transition">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
                Supprimer pour tous
              </button>
            </>
          )}
        </div>
      </>
    );
  };

  // ─── Loader ──────────────────────────────────────────────────────────

  if (loading) return (
    <div className="flex items-center justify-center h-[calc(100vh-100px)]">
      <div className="w-10 h-10 border-4 border-[var(--secondary)] border-t-transparent rounded-full animate-spin" />
    </div>
  );

  // ─── Rendu principal ─────────────────────────────────────────────────

  return (
    <div className="flex h-[calc(100vh-100px)] bg-gradient-to-br from-gray-100 to-gray-200/70 rounded-2xl overflow-hidden shadow-2xl border border-gray-200/80">
      {/* Sidebar admin */}
      {isAdmin && (
        <div className="w-[280px] bg-white border-r border-gray-200 flex flex-col flex-shrink-0">
          <div className="p-4 border-b border-gray-100" style={{ backgroundColor: 'var(--primary)' }}>
            <h2 className="text-white text-lg font-bold">Discussions</h2>
            <p className="text-white/60 text-[11px] mt-0.5">{discussions.length} conversation(s)</p>
          </div>
          <div className="overflow-y-auto flex-1 custom-scrollbar">
            {!discussions.length && <div className="p-6 text-center text-gray-400 text-sm">Aucune discussion</div>}
            {discussions.map(d => (
              <div key={d.id_discussion} onClick={() => openDiscussion(d)}
                className={`flex items-center gap-3 p-3.5 cursor-pointer transition border-b border-gray-50 border-l-[3px] ${selected?.id_discussion === d.id_discussion ? 'bg-blue-50/70 border-l-[var(--secondary)]' : 'hover:bg-gray-50 border-l-transparent'}`}>
                <Avatar name={d.nom} />
                <div className="flex-1 min-w-0">
                  <h3 className={`text-sm font-semibold truncate ${selected?.id_discussion === d.id_discussion ? 'text-[var(--secondary)]' : 'text-gray-800'}`}>{d.nom || 'Client'}</h3>
                </div>
                {d.non_lu > 0 && <span className="bg-[var(--secondary)] text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">{d.non_lu}</span>}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Zone principale */}
      <div className="flex-1 flex flex-col bg-white overflow-hidden">
        {!selected ? (
          <div className="flex-1 flex flex-col items-center justify-center text-gray-400 bg-gradient-to-b from-gray-50/30 to-gray-100/30">
            <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mb-4">
              <svg className="w-10 h-10 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-gray-500 mb-1">Messagerie</h3>
            <p className="text-sm text-gray-400">Sélectionnez une discussion pour commencer</p>
          </div>
        ) : (
          <>
            {/* En-tête */}
            <div className="p-3.5 px-5 border-b border-gray-100 flex items-center justify-between bg-white shadow-sm z-10">
              <div className="flex items-center gap-3">
                <Avatar name={isAdmin ? selected.nom : 'Support'} />
                <div>
                  <h2 className="font-bold text-gray-800 text-sm">{isAdmin ? (selected.nom || 'Client') : 'Support Entreprise'}</h2>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className="w-1.5 h-1.5 bg-green-500 rounded-full" />
                    <span className="text-[10px] text-green-600 font-medium">En ligne</span>
                  </div>
                </div>
              </div>
              {isAdmin && <span className="text-[10px] text-gray-400 bg-gray-100 px-2 py-1 rounded-full">#{selected.id_discussion}</span>}
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-5 bg-gradient-to-b from-gray-50/30 to-gray-100/30 custom-scrollbar">
              {!messages.length ? (
                <div className="flex flex-col items-center justify-center h-full text-gray-400">
                  <svg className="w-16 h-16 mb-3 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/></svg>
                  <p className="text-sm font-medium">Aucun message pour l'instant</p>
                  <p className="text-xs mt-1">Envoyez le premier message !</p>
                </div>
              ) : renderMessages()}
              {otherTyping && <TypingBubble name={otherTyping} />}
              <div ref={bottomRef} />
            </div>

            {/* Input */}
            <form onSubmit={send} className="p-3.5 px-5 border-t border-gray-100 bg-white">
              {editId && (
                <div className="flex items-center gap-2 px-1 pb-2 -mt-1">
                  <svg className="w-3.5 h-3.5 text-[var(--secondary)] flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/></svg>
                  <span className="text-xs text-gray-500 flex-1">Modifier le message</span>
                  <button type="button" onClick={cancelEdit} className="text-gray-400 hover:text-gray-600 text-sm">✕</button>
                </div>
              )}
              <div className={`flex gap-2 items-center rounded-2xl px-4 py-2 transition-all border ${editId ? 'bg-white ring-2 ring-[var(--secondary)]/40 border-[var(--secondary)]' : 'bg-gray-100 border-transparent focus-within:ring-2 focus-within:ring-[var(--secondary)]/40 focus-within:bg-white focus-within:border-gray-200'}`}>
                <input ref={inputRef} type="text" value={input} onChange={onType}
                  placeholder={editId ? 'Modifiez votre message...' : isAdmin ? 'Écrivez votre réponse...' : 'Écrivez votre message...'}
                  className="flex-1 bg-transparent border-none py-1.5 focus:outline-none text-sm text-gray-700 placeholder-gray-400" />
                <button type="button" onClick={() => fileRef.current?.click()} disabled={uploading || !!editId}
                  className="text-gray-400 hover:text-gray-600 p-1.5 rounded-xl hover:bg-gray-200 disabled:opacity-30 transition-all flex-shrink-0">
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" /></svg>
                </button>
                <input type="file" ref={fileRef} onChange={sendFile} className="hidden" />
                <button type="submit" disabled={!input.trim() || uploading}
                  className="bg-gradient-to-br from-[#075e54] to-[#128C7E] text-white p-3.5 rounded-full shadow-xl shadow-[#128C7E]/40 hover:scale-110 hover:shadow-2xl hover:shadow-[#128C7E]/50 active:scale-95 transition-all flex-shrink-0">
                  {editId ? (
                    <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M12.586 4.586a2 2 0 112.828 2.828l-3 3A2 2 0 019 10.5V9a2 2 0 012-2h.5a2 2 0 001.086-.414z" /><path d="M4 13.5V16h2.5l7.5-7.5-2.5-2.5L4 13.5z" /></svg>
                  ) : (
                    <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" /></svg>
                  )}
                </button>
              </div>
            </form>
          </>
        )}
      </div>

      {/* Menu contextuel flottant */}
      {renderContextMenu()}

      {/* Styles globaux */}
      <style>{`
        .custom-scrollbar::-webkit-scrollbar{width:5px}
        .custom-scrollbar::-webkit-scrollbar-track{background:transparent}
        .custom-scrollbar::-webkit-scrollbar-thumb{background:#d1d5db;border-radius:10px}
        .custom-scrollbar::-webkit-scrollbar-thumb:hover{background:#9ca3af}
        @keyframes fadeIn{from{opacity:0}to{opacity:1}}
        @keyframes scaleIn{from{opacity:0;transform:scale(0.95)}to{opacity:1;transform:scale(1)}}
        .animate-fadeIn{animation:fadeIn 0.2s ease-out}
        .animate-scaleIn{animation:scaleIn 0.15s ease-out}
      `}</style>
    </div>
  );
}
// "use client";

// import Image from "next/image";
// import { useState } from "react";

// // ─── Navbar ───────────────────────────────────────────────────────────────────
// function Navbar({ onSearch }) {
//   const [query, setQuery] = useState("");

//   return (
//     <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4 py-2 bg-white dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800 h-14">
//       {/* Logo */}
//       <div className="flex items-center gap-2 min-w-[160px]">
//         <Image
//           className="dark:invert"
//           src="/youtube.png"
//           alt="YouTube Logo"
//           width={90}
//           height={20}
//           priority
//         />
//       </div>

//       {/* Search bar */}
//       <div className="flex flex-1 max-w-xl mx-4">
//         <input
//           type="text"
//           value={query}
//           onChange={(e) => setQuery(e.target.value)}
//           onKeyDown={(e) => e.key === "Enter" && onSearch?.(query)}
//           placeholder="Search"
//           className="w-full px-4 py-1.5 border border-zinc-300 dark:border-zinc-700 rounded-l-full bg-white dark:bg-zinc-800 text-sm text-zinc-800 dark:text-zinc-100 focus:outline-none focus:border-blue-500"
//         />
//         <button
//           onClick={() => onSearch?.(query)}
//           className="px-4 py-1.5 border border-l-0 border-zinc-300 dark:border-zinc-700 rounded-r-full bg-zinc-100 dark:bg-zinc-700 hover:bg-zinc-200 dark:hover:bg-zinc-600"
//         >
//           🔍
//         </button>
//       </div>

//       {/* Right icons */}
//       <div className="flex items-center gap-3 min-w-[160px] justify-end">
//         <button className="text-sm text-zinc-600 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white">
//           🎵 Studio
//         </button>
//         <div className="w-8 h-8 rounded-full bg-red-500 flex items-center justify-center text-white text-xs font-bold cursor-pointer">
//           YT
//         </div>
//       </div>
//     </nav>
//   );
// }

// // ─── Sidebar ──────────────────────────────────────────────────────────────────
// const sidebarItems = [
//   { icon: "🏠", label: "Home", id: "home" },
//   { icon: "🎬", label: "Shorts", id: "shorts" },
//   { icon: "📺", label: "Subscriptions", id: "subscriptions" },
//   { icon: "📊", label: "Video Tracker", id: "tracker" },
//   { icon: "👤", label: "Profiles", id: "profiles" },
//   { icon: "📂", label: "Library", id: "library" },
//   { icon: "🕑", label: "History", id: "history" },
//   { icon: "⚙️", label: "Settings", id: "settings" },
// ];

// function Sidebar({ activeTab, onTabChange }) {
//   return (
//     <aside className="fixed top-14 left-0 w-56 h-[calc(100vh-3.5rem)] bg-white dark:bg-zinc-900 border-r border-zinc-200 dark:border-zinc-800 overflow-y-auto z-40 hidden sm:block">
//       <ul className="py-2">
//         {sidebarItems.map((item) => (
//           <li key={item.id}>
//             <button
//               onClick={() => onTabChange(item.id)}
//               className={`w-full flex items-center gap-4 px-4 py-2.5 text-sm rounded-lg mx-1 transition-colors ${
//                 activeTab === item.id
//                   ? "bg-zinc-100 dark:bg-zinc-800 font-semibold text-zinc-900 dark:text-white"
//                   : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800"
//               }`}
//             >
//               <span className="text-lg">{item.icon}</span>
//               {item.label}
//             </button>
//           </li>
//         ))}
//       </ul>
//     </aside>
//   );
// }

// // ─── Header (page-level) ──────────────────────────────────────────────────────
// function Header({ title, subtitle }) {
//   return (
//     <div className="mb-6">
//       <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">{title}</h1>
//       {subtitle && (
//         <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">{subtitle}</p>
//       )}
//       <div className="mt-3 h-px bg-zinc-200 dark:bg-zinc-700" />
//     </div>
//   );
// }

// // ─── Profiles ─────────────────────────────────────────────────────────────────
// const PROFILES = [
//   { id: 1, name: "Alice Johnson", handle: "@alicejohnson", subs: "1.2M", avatar: "AJ", color: "bg-purple-500" },
//   { id: 2, name: "TechTalks", handle: "@techtalks", subs: "840K", avatar: "TT", color: "bg-blue-500" },
//   { id: 3, name: "Cozy Cooking", handle: "@cozycooking", subs: "3.1M", avatar: "CC", color: "bg-orange-400" },
//   { id: 4, name: "GameZone Pro", handle: "@gamezonepro", subs: "5.6M", avatar: "GZ", color: "bg-green-500" },
// ];

// function Profiles() {
//   const [followed, setFollowed] = useState([]);

//   const toggle = (id) =>
//     setFollowed((prev) =>
//       prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
//     );

//   return (
//     <div>
//       <Header title="Profiles" subtitle="Channels you may like" />
//       <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//         {PROFILES.map((p) => (
//           <div
//             key={p.id}
//             className="flex items-center gap-4 p-4 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl"
//           >
//             <div
//               className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0 ${p.color}`}
//             >
//               {p.avatar}
//             </div>
//             <div className="flex-1 min-w-0">
//               <p className="font-semibold text-sm text-zinc-900 dark:text-white truncate">{p.name}</p>
//               <p className="text-xs text-zinc-500 dark:text-zinc-400">{p.handle}</p>
//               <p className="text-xs text-zinc-400 dark:text-zinc-500">{p.subs} subscribers</p>
//             </div>
//             <button
//               onClick={() => toggle(p.id)}
//               className={`text-xs px-3 py-1.5 rounded-full font-medium transition-colors ${
//                 followed.includes(p.id)
//                   ? "bg-zinc-200 dark:bg-zinc-700 text-zinc-700 dark:text-zinc-300"
//                   : "bg-red-500 hover:bg-red-600 text-white"
//               }`}
//             >
//               {followed.includes(p.id) ? "Subscribed" : "Subscribe"}
//             </button>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }

// // ─── Video Tracker ────────────────────────────────────────────────────────────
// const INITIAL_VIDEOS = [
//   { id: 1, title: "Next.js 15 Full Course", channel: "Fireship", duration: "3:42:00", status: "Watching", progress: 60 },
//   { id: 2, title: "React Hooks Deep Dive", channel: "Theo", duration: "1:15:00", status: "Completed", progress: 100 },
//   { id: 3, title: "Tailwind CSS Tips", channel: "Kevin Powell", duration: "0:48:00", status: "Watch Later", progress: 0 },
//   { id: 4, title: "AI in 2025 Explained", channel: "Lex Fridman", duration: "2:10:00", status: "Watching", progress: 35 },
// ];

// const STATUS_COLORS = {
//   Watching: "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300",
//   Completed: "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300",
//   "Watch Later": "bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300",
// };

// function VideoTracker() {
//   const [videos, setVideos] = useState(INITIAL_VIDEOS);
//   const [filter, setFilter] = useState("All");
//   const [showForm, setShowForm] = useState(false);
//   const [newVideo, setNewVideo] = useState({ title: "", channel: "", duration: "", status: "Watch Later" });

//   const filters = ["All", "Watching", "Completed", "Watch Later"];
//   const filtered = filter === "All" ? videos : videos.filter((v) => v.status === filter);

//   const updateStatus = (id, status) =>
//     setVideos((prev) =>
//       prev.map((v) =>
//         v.id === id
//           ? { ...v, status, progress: status === "Completed" ? 100 : v.progress }
//           : v
//       )
//     );

//   const removeVideo = (id) => setVideos((prev) => prev.filter((v) => v.id !== id));

//   const addVideo = () => {
//     if (!newVideo.title) return;
//     setVideos((prev) => [
//       ...prev,
//       { ...newVideo, id: Date.now(), progress: 0 },
//     ]);
//     setNewVideo({ title: "", channel: "", duration: "", status: "Watch Later" });
//     setShowForm(false);
//   };

//   return (
//     <div>
//       <Header title="📊 Video Tracker" subtitle="Keep track of your YouTube watch progress" />

//       {/* Filter tabs */}
//       <div className="flex gap-2 mb-4 flex-wrap">
//         {filters.map((f) => (
//           <button
//             key={f}
//             onClick={() => setFilter(f)}
//             className={`px-3 py-1 text-sm rounded-full border transition-colors ${
//               filter === f
//                 ? "bg-red-500 text-white border-red-500"
//                 : "border-zinc-300 dark:border-zinc-600 text-zinc-600 dark:text-zinc-400 hover:border-zinc-500"
//             }`}
//           >
//             {f}
//           </button>
//         ))}
//         <button
//           onClick={() => setShowForm(!showForm)}
//           className="ml-auto px-3 py-1 text-sm rounded-full bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 hover:opacity-80 transition-opacity"
//         >
//           + Add Video
//         </button>
//       </div>

//       {/* Add form */}
//       {showForm && (
//         <div className="mb-4 p-4 bg-zinc-50 dark:bg-zinc-800 rounded-xl border border-zinc-200 dark:border-zinc-700 flex flex-col gap-2">
//           <input
//             placeholder="Video title *"
//             value={newVideo.title}
//             onChange={(e) => setNewVideo({ ...newVideo, title: e.target.value })}
//             className="px-3 py-2 text-sm rounded-lg border border-zinc-300 dark:border-zinc-600 bg-white dark:bg-zinc-900 text-zinc-800 dark:text-zinc-100"
//           />
//           <div className="flex gap-2">
//             <input
//               placeholder="Channel"
//               value={newVideo.channel}
//               onChange={(e) => setNewVideo({ ...newVideo, channel: e.target.value })}
//               className="flex-1 px-3 py-2 text-sm rounded-lg border border-zinc-300 dark:border-zinc-600 bg-white dark:bg-zinc-900 text-zinc-800 dark:text-zinc-100"
//             />
//             <input
//               placeholder="Duration (e.g. 1:30:00)"
//               value={newVideo.duration}
//               onChange={(e) => setNewVideo({ ...newVideo, duration: e.target.value })}
//               className="flex-1 px-3 py-2 text-sm rounded-lg border border-zinc-300 dark:border-zinc-600 bg-white dark:bg-zinc-900 text-zinc-800 dark:text-zinc-100"
//             />
//             <select
//               value={newVideo.status}
//               onChange={(e) => setNewVideo({ ...newVideo, status: e.target.value })}
//               className="px-3 py-2 text-sm rounded-lg border border-zinc-300 dark:border-zinc-600 bg-white dark:bg-zinc-900 text-zinc-800 dark:text-zinc-100"
//             >
//               <option>Watch Later</option>
//               <option>Watching</option>
//               <option>Completed</option>
//             </select>
//           </div>
//           <button
//             onClick={addVideo}
//             className="self-end px-4 py-1.5 text-sm bg-red-500 hover:bg-red-600 text-white rounded-full"
//           >
//             Save
//           </button>
//         </div>
//       )}

//       {/* Video list */}
//       <div className="flex flex-col gap-3">
//         {filtered.length === 0 && (
//           <p className="text-sm text-zinc-400 dark:text-zinc-500 text-center py-8">
//             No videos in this category yet.
//           </p>
//         )}
//         {filtered.map((v) => (
//           <div
//             key={v.id}
//             className="p-4 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl"
//           >
//             <div className="flex items-start justify-between gap-3">
//               <div className="flex-1 min-w-0">
//                 <p className="font-medium text-sm text-zinc-900 dark:text-white truncate">{v.title}</p>
//                 <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
//                   {v.channel} · {v.duration}
//                 </p>
//               </div>
//               <div className="flex items-center gap-2 flex-shrink-0">
//                 <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${STATUS_COLORS[v.status]}`}>
//                   {v.status}
//                 </span>
//                 <select
//                   value={v.status}
//                   onChange={(e) => updateStatus(v.id, e.target.value)}
//                   className="text-xs border border-zinc-300 dark:border-zinc-600 rounded-md px-1 py-0.5 bg-white dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300"
//                 >
//                   <option>Watch Later</option>
//                   <option>Watching</option>
//                   <option>Completed</option>
//                 </select>
//                 <button
//                   onClick={() => removeVideo(v.id)}
//                   className="text-zinc-400 hover:text-red-500 text-xs"
//                 >
//                   ✕
//                 </button>
//               </div>
//             </div>

//             {/* Progress bar */}
//             <div className="mt-3">
//               <div className="flex justify-between text-xs text-zinc-400 mb-1">
//                 <span>Progress</span>
//                 <span>{v.progress}%</span>
//               </div>
//               <div className="h-1.5 bg-zinc-200 dark:bg-zinc-700 rounded-full">
//                 <div
//                   className={`h-1.5 rounded-full transition-all ${
//                     v.progress === 100 ? "bg-green-500" : "bg-red-500"
//                   }`}
//                   style={{ width: `${v.progress}%` }}
//                 />
//               </div>
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }

// // ─── Home Feed (placeholder) ───────────────────────────────────────────────────
// function HomeFeed() {
//   return (
//     <div>
//       <Header title="Home" subtitle="Recommended for you" />
//       <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//         {[1, 2, 3, 4].map((i) => (
//           <div key={i} className="rounded-xl overflow-hidden border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800">
//             <div className="w-full h-36 bg-zinc-200 dark:bg-zinc-700 flex items-center justify-center text-zinc-400 text-sm">
//               Thumbnail {i}
//             </div>
//             <div className="p-3">
//               <p className="font-medium text-sm text-zinc-900 dark:text-white">Sample Video Title #{i}</p>
//               <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">Channel Name · 1.2M views · 2 days ago</p>
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }

// // ─── Footer ───────────────────────────────────────────────────────────────────
// function Footer() {
//   return (
//     <footer className="mt-12 pt-6 border-t border-zinc-200 dark:border-zinc-800 text-xs text-zinc-400 dark:text-zinc-600">
//       <div className="flex flex-wrap gap-x-4 gap-y-1 mb-2">
//         {["About", "Press", "Copyright", "Contact", "Terms", "Privacy", "Developers", "Advertise"].map((link) => (
//           <a key={link} href="#" className="hover:text-zinc-600 dark:hover:text-zinc-400 transition-colors">
//             {link}
//           </a>
//         ))}
//       </div>
//       <p>© 2025 YouTube Clone — Built with Next.js</p>
//     </footer>
//   );
// }

// // ─── Main Page ────────────────────────────────────────────────────────────────
// export default function Home() {
//   const [activeTab, setActiveTab] = useState("home");

//   const renderContent = () => {
//     switch (activeTab) {
//       case "tracker": return <VideoTracker />;
//       case "profiles": return <Profiles />;
//       default: return <HomeFeed />;
//     }
//   };

//   return (
//     <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 font-sans">
//       <Navbar onSearch={(q) => console.log("Search:", q)} />

//       <div className="flex pt-14">
//         <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />

//         {/* Main content area */}
//         <main className="flex-1 sm:ml-56 min-h-[calc(100vh-3.5rem)]">
//           <div className="max-w-4xl mx-auto px-4 py-6">
//             {renderContent()}
//             <Footer />
//           </div>
//         </main>
//       </div>
//     </div>
//   );
// }



import YouTubeUrlForm from "@/components/YouTubeUrlForm";


export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white">
      <div className="flex flex-col items-center justify-center flex-1 w-full max-w-2xl px-4">
        <div className="mb-8 inline-flex space-x-2 items-center">
          <h1 className="text-6xl font-bold text-center bg-red-600 rounded-md p-3">
            <span className="text-white">YouTube</span>
   
          </h1>
          <h1 className="text-6xl font-bold text-center">
            <span className="text-gray-800"> Player</span>
          </h1>
        </div>
        <main className="w-full">
          <YouTubeUrlForm />
        </main>
      </div>
    </div>
  );
}
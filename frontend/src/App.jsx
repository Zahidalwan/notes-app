// Import React hooks
import { useEffect, useState } from "react";

function App() {
  // State untuk menyimpan semua catatan
  const [notes, setNotes] = useState([]);

  // State tambahan untuk fitur pencarian 🔍
  const [searchQuery, setSearchQuery] = useState("");

  // URL API backend kamu
  const baseUrl = "https://notes-app-blush-mu.vercel.app";

  // =======================
  // 📥 Ambil semua catatan
  // =======================
  const fetchNotes = async () => {
    try {
      const res = await fetch(`${baseUrl}/notes`); // ambil data dari API
      const result = await res.json(); // ubah ke format JSON
      setNotes(result.data); // simpan data catatan ke state
    } catch (error) {
      console.log(error);
    }
  };

  // Jalankan fetchNotes() sekali saat halaman pertama kali dibuka
  useEffect(() => {
    fetchNotes();
  }, []);

  // =======================
  // ➕ Tambah catatan baru
  // =======================
  const addNote = async (newTitle, newContent) => {
    try {
      const res = await fetch(`${baseUrl}/notes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: newTitle, content: newContent }),
      });

      const result = await res.json();

      // Jika berhasil, tambahkan note baru ke state agar tampil langsung tanpa delay
      if (res.ok) setNotes([...notes, result.data]);
    } catch (error) {
      console.log(error);
    }
  };

  // =======================
  // ✏️ Update catatan
  // =======================
  const handleUpdateNote = async (id, updateTitle, updateContent) => {
    try {
      const res = await fetch(`${baseUrl}/notes/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: updateTitle, content: updateContent }),
      });

      const result = await res.json();

      // Update catatan di state (langsung berubah tanpa refetch)
      setNotes((prevNotes) =>
        prevNotes.map((note) => (note.id === id ? result.data : note))
      );
    } catch (error) {
      console.log(error);
    }
  };

  // =======================
  // ❌ Hapus catatan
  // =======================
  const handleDelete = async (id) => {
    try {
      const res = await fetch(`${baseUrl}/notes/${id}`, { method: "DELETE" });

      // Jika berhasil hapus, hilangkan dari state agar langsung hilang dari UI
      if (res.ok) setNotes((notes) => notes.filter((note) => note.id !== id));
    } catch (error) {
      console.log(error);
    }
  };

  // =======================
  // 🔍 Filter hasil pencarian
  // =======================
  const filteredNotes = notes.filter(
    (note) =>
      note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // =======================
  // 🧱 Tampilan utama aplikasi
  // =======================
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-28 pb-10 flex flex-col items-center">
        {/* Input pencarian */}
        <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />

        {/* Form untuk tambah catatan */}
        <NoteForm onAddNote={addNote} />

        {/* Daftar catatan (dengan filter pencarian) */}
        <NoteList
          notes={filteredNotes}
          onDelete={handleDelete}
          onUpdate={handleUpdateNote}
        />
      </main>
    </>
  );
}

export default App;

// ===============================
// 🔹 Komponen Navbar (header atas)
// ===============================
const Navbar = () => {
  return (
    <nav className="w-full fixed top-0 z-10 backdrop-blur bg-white/70 dark:bg-gray-800/70 shadow-sm border-b border-gray-200 dark:border-gray-700">
      <div className="container mx-auto flex justify-between items-center px-6 py-4">
        <div className="flex items-center gap-2">
          {/* Logo aplikasi */}
          <span className="font-semibold text-xl text-gray-800 dark:text-gray-100">
            MY Notes App
          </span>
        </div>
      </div>
    </nav>
  );
};

// =================================
// 🔎 Komponen Search Bar
// =================================
const SearchBar = ({ searchQuery, setSearchQuery }) => {
  return (
    <div className="container max-w-lg mb-6 px-5">
      <input
        type="text"
        placeholder="Search notes..."
        className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 p-3 text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-400"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)} // ubah nilai searchQuery saat user mengetik
      />
    </div>
  );
};

// =================================
// 📝 Form untuk menambah catatan baru
// =================================
const NoteForm = ({ onAddNote }) => {
  // State lokal untuk input judul & isi
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  // Saat form dikirim
  const handleSubmit = (e) => {
    e.preventDefault(); // supaya tidak reload
    onAddNote(title, content); // kirim ke App()
    setTitle(""); // reset input
    setContent("");
  };

  return (
    <section className="container max-w-lg bg-white dark:bg-gray-800 shadow-lg rounded-2xl p-6 mb-10">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {/* Input judul */}
        <input
          type="text"
          placeholder="Title"
          className="rounded-lg border border-gray-300 dark:border-gray-600 bg-transparent p-3 text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-400"
          required
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        {/* Input isi catatan */}
        <textarea
          placeholder="Write your note..."
          className="resize-y min-h-24 rounded-lg border border-gray-300 dark:border-gray-600 bg-transparent p-3 text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-400"
          required
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />

        {/* Tombol tambah */}
        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 transition text-white font-semibold rounded-lg py-3"
        >
          Add Note
        </button>
      </form>
    </section>
  );
};

// ==================================
// 📄 Komponen satu catatan (NoteItem)
// ==================================
const NoteItem = ({ note, onDelete, onUpdate }) => {
  // Mode edit / lihat
  const [isEditing, setIsEditing] = useState(false);

  // State untuk menyimpan perubahan saat edit
  const [titleEdit, setTitleEdit] = useState(note.title);
  const [contentEdit, setContentEdit] = useState(note.content);

  // Fungsi cancel edit
  const handleCancel = () => {
    setIsEditing(false);
    setTitleEdit(note.title);
    setContentEdit(note.content);
  };

  return (
    <div className="rounded-2xl shadow-md bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-5 hover:shadow-lg transition">
      {/* Jika sedang mode edit */}
      {isEditing ? (
        <>
          <input
            value={titleEdit}
            type="text"
            className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-transparent p-2 text-gray-800 dark:text-gray-100"
            onChange={(e) => setTitleEdit(e.target.value)}
          />
          <textarea
            value={contentEdit}
            className="w-full mt-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-transparent p-2 text-gray-800 dark:text-gray-100"
            onChange={(e) => setContentEdit(e.target.value)}
          />

          {/* Tombol aksi edit */}
          <div className="mt-4 flex gap-2">
            <button
              className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-1 rounded transition"
              onClick={handleCancel}
            >
              Cancel
            </button>
            <button
              className="bg-green-500 hover:bg-green-600 text-white px-4 py-1 rounded transition"
              onClick={() => {
                onUpdate(note.id, titleEdit, contentEdit); // kirim perubahan ke App()
                setIsEditing(false);
              }}
            >
              Save
            </button>
          </div>
        </>
      ) : (
        // Jika tidak sedang edit, tampilkan data normal
        <>
          <p className="font-semibold text-lg text-gray-800 dark:text-gray-100">
            {note.title}
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            ~{showFormattedDate(note.created_at)}
          </p>
          <p className="mt-2 text-gray-700 dark:text-gray-300">
            {note.content}
          </p>

          {/* Tombol edit & delete */}
          <div className="mt-4 flex gap-2">
            <button
              className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-1 rounded transition"
              onClick={() => setIsEditing(true)}
            >
              Edit
            </button>
            <button
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-1 rounded transition"
              onClick={() => onDelete(note.id)} // hapus catatan
            >
              Delete
            </button>
          </div>
        </>
      )}
    </div>
  );
};

// ====================================
// 📚 Komponen daftar semua catatan
// ====================================
const NoteList = ({ notes, onUpdate, onDelete }) => {
  return (
    <section className="container px-5">
      <h2 className="inline-flex items-center gap-2 text-2xl font-semibold mb-8 text-gray-800 dark:text-gray-100">
        <img src="/note.svg" alt="note icon" className="w-8 h-8" />
        Notes
      </h2>

      {/* Grid responsive untuk list catatan */}
      <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {notes.length > 0 ? (
          // Tampilkan setiap catatan
          notes.map((note) => (
            <NoteItem
              key={note.id}
              note={note}
              onUpdate={onUpdate}
              onDelete={onDelete}
            />
          ))
        ) : (
          // Jika kosong
          <p className="text-gray-500 dark:text-gray-400 text-center col-span-full">
            No notes found. Add one!
          </p>
        )}
      </div>
    </section>
  );
};

// =========================
// ⏰ Format tanggal catatan
// =========================
const showFormattedDate = (date) => {
  const options = {
    year: "numeric",
    month: "long",
    weekday: "long",
    day: "numeric",
  };
  return new Date(date).toLocaleDateString("id-ID", options);
};

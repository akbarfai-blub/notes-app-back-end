const express = require("express");
const cors = require("cors"); // Tambahkan ini
const app = express();
const port = 5000;

// Gunakan CORS middleware
app.use(cors());

// Data dummy yang digunakan
const notesData = [
  {
    id: "notes-jT-jjsyz61J8XKiI",
    title: "Welcome to Notes, Dimas!",
    body: "Welcome to Notes! This is your first note. You can archive it, delete it, or create new ones.",
    createdAt: "2022-07-28T10:03:12.594Z",
    archived: false,
  },
  // Tambahkan lebih banyak catatan sesuai kebutuhan
];

// Middleware untuk memparsing request body
app.use(express.json());

// Endpoint untuk mengambil semua catatan
app.get("/notes", (req, res) => {
  res.json(notesData);
});

// Endpoint untuk menambahkan catatan baru
app.post("/notes", (req, res) => {
  const { title, body } = req.body; // Ambil title dan body dari request body

  // Periksa apakah title dan body ada dalam request
  if (!title || !body) {
    return res.status(400).json({ error: "Title and body are required" });
  }

  const newNote = {
    id: `notes-${Date.now()}`,
    title: title, // Set title dari request body
    body: body, // Set body dari request body
    createdAt: new Date().toISOString(),
    archived: false,
  };

  notesData.push(newNote); // Tambahkan catatan baru ke array
  res.status(201).json(newNote); // Kirim respons dengan catatan yang lengkap
});

// Endpoint untuk menghapus catatan berdasarkan ID
app.delete("/notes/:id", (req, res) => {
  const { id } = req.params; // Mengambil ID dari parameter URL
  const noteIndex = notesData.findIndex((note) => note.id === id); // Cari catatan berdasarkan ID

  if (noteIndex !== -1) {
    // Hapus catatan dari array
    const deletedNote = notesData.splice(noteIndex, 1);
    return res
      .status(200)
      .json({ message: "Catatan berhasil dihapus", deletedNote });
  } else {
    return res.status(404).json({ message: "Catatan tidak ditemukan" });
  }
});

// Jalankan server
app.listen(port, () => {
  console.log(`Server berjalan di http://localhost:${port}`);
});

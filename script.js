// Fungsi untuk mengambil data catatan dari server
async function fetchNotes() {
  try {
    const response = await fetch("http://localhost:5000/notes"); // Ambil data dari backend
    if (!response.ok) {
      throw new Error("Gagal mengambil data catatan");
    }
    const data = await response.json(); // Parse response ke format JSON
    return data;
  } catch (error) {
    console.error(error);
    return [];
  }
}

// Fungsi untuk merender catatan
async function renderNotes() {
  const notes = await fetchNotes(); // Ambil catatan dari server
  notesList.innerHTML = ""; // Bersihkan daftar sebelum render ulang
  notes.forEach((note) => {
    const noteItem = document.createElement("note-item");
    noteItem.setAttribute("title", note.title);
    noteItem.setAttribute("body", note.body);
    noteItem.setAttribute("created-at", note.createdAt);
    notesList.appendChild(noteItem);
  });
}

// Custom element untuk menampilkan catatan
class NoteItem extends HTMLElement {
  static get observedAttributes() {
    return ["title", "body", "created-at"];
  }

  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  connectedCallback() {
    this.shadowRoot.innerHTML = `
      <style>
        div {
          border: 1px solid #ccc;
          padding: 16px;
          background-color: #f9f9f9;
        }

        h3 {
          margin: 0 0 10px 0;
        }

        small {
          color: #777;
        }
      </style>
      <div>
        <h3>${this.getAttribute("title") || ""}</h3>
        <p>${this.getAttribute("body") || ""}</p>
        <small>${
          this.getAttribute("created-at")
            ? new Date(this.getAttribute("created-at")).toLocaleDateString()
            : ""
        }</small>
      </div>
    `;
  }

  // Callback ini dipanggil setiap kali attribute berubah
  attributeChangedCallback(name, oldValue, newValue) {
    if (!this.shadowRoot) return;

    const h3 = this.shadowRoot.querySelector("h3");
    const p = this.shadowRoot.querySelector("p");
    const small = this.shadowRoot.querySelector("small");

    if (name === "title" && h3) {
      h3.textContent = newValue;
    }
    if (name === "body" && p) {
      p.textContent = newValue;
    }
    if (name === "created-at" && small) {
      small.textContent = new Date(newValue).toLocaleDateString();
    }
  }
}

// Memeriksa apakah 'note-item' sudah didefinisikan
if (!customElements.get("note-item")) {
  customElements.define("note-item", NoteItem);
}

// Fungsi untuk merender catatan
const notesList = document.getElementById("notes-list");

// Real-time Validation pada Form
const form = document.getElementById("add-note-form");
const titleInput = document.getElementById("note-title");
const bodyInput = document.getElementById("note-body");
const titleError = document.getElementById("title-error");
const bodyError = document.getElementById("body-error");

function validateTitle() {
  if (titleInput.value.trim() === "") {
    titleError.textContent = "Title is required.";
    titleError.style.display = "block";
    return false;
  }
  titleError.style.display = "none";
  return true;
}

function validateBody() {
  if (bodyInput.value.trim() === "") {
    bodyError.textContent = "Body is required.";
    bodyError.style.display = "block";
    return false;
  }
  bodyError.style.display = "none";
  return true;
}

// Event Listener untuk Real-time Validation
titleInput.addEventListener("input", validateTitle);
bodyInput.addEventListener("input", validateBody);

// Event submit dengan validasi dan pengiriman data ke backend
form.addEventListener("submit", async function (e) {
  e.preventDefault();

  const isTitleValid = validateTitle();
  const isBodyValid = validateBody();

  if (!isTitleValid || !isBodyValid) {
    return;
  }

  const title = titleInput.value;
  const body = bodyInput.value;

  const newNote = {
    title,
    body,
    createdAt: new Date().toISOString(),
    archived: false,
  };

  try {
    // Kirim catatan baru ke backend
    const response = await fetch("http://localhost:5000/notes", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newNote),
    });

    if (!response.ok) {
      throw new Error("Gagal menambah catatan baru");
    }

    // Reset form dan render ulang catatan setelah menambah catatan baru
    form.reset();
    renderNotes();
  } catch (error) {
    console.error(error);
  }
});

async function deleteNote(id) {
  try {
    const response = await fetch(`http://localhost:5000/notes/${id}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      throw new Error("Gagal menghapus catatan");
    }

    const result = await response.json();
    console.log(result.message);

    // Render ulang catatan setelah dihapus
    renderNotes();
  } catch (error) {
    console.error(error);
  }
}

async function deleteNote(id) {
  try {
    const response = await fetch(`http://localhost:5000/notes/${id}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      throw new Error("Gagal menghapus catatan");
    }

    const result = await response.json();
    console.log(result.message); // Tampilkan pesan sukses di console

    // Render ulang catatan setelah dihapus
    renderNotes();
  } catch (error) {
    console.error(error);
  }
}

async function renderNotes() {
  const notes = await fetchNotes(); // Ambil catatan dari server
  notesList.innerHTML = ""; // Bersihkan daftar sebelum render ulang

  notes.forEach((note) => {
    // Buat elemen catatan baru
    const noteItem = document.createElement("div"); // Ganti ke div untuk menampilkan secara normal
    const noteTitle = document.createElement("h3");
    const noteBody = document.createElement("p");
    const noteDate = document.createElement("small");

    // Tambahkan konten ke dalam catatan
    noteTitle.textContent = note.title || "Untitled";
    noteBody.textContent = note.body || "No content";
    noteDate.textContent = new Date(note.createdAt).toLocaleDateString();

    // Membuat tombol hapus
    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Delete";
    deleteButton.classList.add("delete-button");

    // Tambahkan event listener untuk tombol delete
    deleteButton.addEventListener("click", () => deleteNote(note.id));

    // Tambahkan elemen catatan ke dalam noteItem
    noteItem.appendChild(noteTitle);
    noteItem.appendChild(noteBody);
    noteItem.appendChild(noteDate);
    noteItem.appendChild(deleteButton); // Tambahkan tombol delete ke dalam noteItem

    // Tambahkan noteItem ke daftar catatan
    notesList.appendChild(noteItem);
  });
}

// Fungsi deleteNote
async function deleteNote(id) {
  try {
    const response = await fetch(`http://localhost:5000/notes/${id}`, {
      method: "DELETE",
    });
    if (!response.ok) {
      throw new Error("Gagal menghapus catatan");
    }
    const result = await response.json();
    console.log(result.message);
    renderNotes(); // Render ulang catatan setelah dihapus
  } catch (error) {
    console.error(error);
  }
}

// Render catatan pada awal pemuatan halaman
renderNotes();

# Anime List REST API

Midterm Project: Build a REST API with ExpressJS

- **Nama:** Regith Rayabi
- **NIM:** 20250040075
- **Tema:** Anime List

## Deskripsi

REST API sederhana untuk mengelola daftar anime, dibuat dengan Node.js dan Express 5. Data disimpan di array JavaScript (tanpa database), jadi data kembali ke kondisi awal setiap server di-restart.

Setiap anime punya field:

| Field      | Tipe                                 | Contoh         |
| ---------- | ------------------------------------ | -------------- |
| `id`       | number (dibuat otomatis oleh server) | `1`            |
| `title`    | string                               | `"Death Note"` |
| `genre`    | string                               | `"Thriller"`   |
| `episodes` | number                               | `37`           |
| `rating`   | number                               | `8.6`          |
| `status`   | string                               | `"completed"`  |

## Cara menjalankan

1. Pastikan Node.js sudah terpasang.
2. Install dependency:
   ```bash
   npm install
   ```
3. Jalankan server (mode development dengan nodemon):
   ```bash
   npm run dev
   ```
4. Buka `http://localhost:6767`

## Daftar route

| Method | Path                   | Keterangan                                   | Status        |
| ------ | ---------------------- | -------------------------------------------- | ------------- |
| GET    | `/`                    | Pesan selamat datang                         | 200           |
| GET    | `/anime`               | List semua anime                             | 200           |
| GET    | `/anime/:id`           | Ambil satu anime                             | 200, 404      |
| POST   | `/anime`               | Tambah anime baru                            | 201, 400      |
| PUT    | `/anime/:id`           | Update anime                                 | 200, 400, 404 |
| DELETE | `/anime/:id`           | Hapus anime (butuh token)                    | 200, 401, 404 |
| GET    | `/anime/genre{/:name}` | Filter berdasarkan genre, tanpa nama = semua | 200           |
| GET    | `/files/*path`         | Menampilkan path wildcard sebagai array      | 200           |
| GET    | (URL tak dikenal)      | Ditangani handler 404                        | 404           |

## Contoh request

**POST /anime** (body JSON, `id` dibuat server):

```json
{
  "title": "Naruto",
  "genre": "Action",
  "episodes": 220,
  "rating": 8.0,
  "status": "completed"
}
```

**DELETE /anime/1** butuh header:

```
x-auth-token: secret123
```

Tanpa header ini, server membalas `401 Unauthorized`.

**GET /anime/genre/Action** menampilkan anime bergenre Action (tidak peka huruf besar/kecil).

**GET /files/docs/2026/laporan.pdf** menghasilkan:

```json
{ "path": ["docs", "2026", "laporan.pdf"] }
```

## Format error

Semua error memakai format yang sama:

```json
{ "error": "pesan error" }
```

## Struktur folder

```
midterm-20250040075-RegithRayabi/
├── index.js          # menjalankan server: middleware, routes, 404, error handler
├── middleware.js     # logger, requireAuth, notFound, errorHandler
├── routes/
│   └── anime.js      # route anime + data array
├── screenshots/      # bukti tes tiap route
├── package.json
└── README.md
```

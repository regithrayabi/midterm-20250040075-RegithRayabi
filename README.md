# Anime List REST API

Midterm Project: Build a REST API with ExpressJS

- **Nama:** Regith Rayabi
- **NIM:** 20250040075
- **Tema:** Anime List

## Deskripsi

REST API sederhana untuk mengelola daftar anime dan studio animasi, dibuat dengan Node.js dan Express 5. Data disimpan di array JavaScript (tanpa database), jadi data kembali ke kondisi awal setiap server di-restart.

Ada dua resource, masing-masing dengan file router sendiri:

- `/anime` di `routes/anime.js` (15 data awal)
- `/studios` di `routes/studios.js` (5 data awal)

### Field anime

| Field      | Tipe                                 | Contoh         |
| ---------- | ------------------------------------ | -------------- |
| `id`       | number (dibuat otomatis oleh server) | `1`            |
| `title`    | string                               | `"Death Note"` |
| `genre`    | string                               | `"Thriller"`   |
| `episodes` | number                               | `37`           |
| `rating`   | number                               | `8.6`          |
| `status`   | string                               | `"completed"`  |

### Field studio

| Field        | Tipe                                 | Contoh         |
| ------------ | ------------------------------------ | -------------- |
| `id`         | number (dibuat otomatis oleh server) | `1`            |
| `name`       | string                               | `"MAPPA"`      |
| `city`       | string                               | `"Tokyo"`      |
| `founded`    | number                               | `2011`         |
| `famousWork` | string                               | `"Death Note"` |

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

### Umum

| Method | Path              | Keterangan                              | Status |
| ------ | ----------------- | --------------------------------------- | ------ |
| GET    | `/`               | Pesan selamat datang (nama dan tema)    | 200    |
| GET    | `/files/*path`    | Menampilkan path wildcard sebagai array | 200    |
| GET    | (URL tak dikenal) | Ditangani handler 404                   | 404    |

### Anime

| Method | Path                   | Keterangan                                   | Status        |
| ------ | ---------------------- | -------------------------------------------- | ------------- |
| GET    | `/anime`               | List semua anime                             | 200           |
| GET    | `/anime/:id`           | Ambil satu anime                             | 200, 404      |
| POST   | `/anime`               | Tambah anime baru                            | 201, 400      |
| PUT    | `/anime/:id`           | Update anime                                 | 200, 400, 404 |
| DELETE | `/anime/:id`           | Hapus anime (butuh token)                    | 200, 401, 404 |
| GET    | `/anime/genre{/:name}` | Filter berdasarkan genre, tanpa nama = semua | 200           |
| GET    | `/anime/search?title=` | Cari anime berdasarkan judul (bonus)         | 200, 400      |

### Studios (bonus)

| Method | Path           | Keterangan                 | Status        |
| ------ | -------------- | -------------------------- | ------------- |
| GET    | `/studios`     | List semua studio          | 200           |
| GET    | `/studios/:id` | Ambil satu studio          | 200, 404      |
| POST   | `/studios`     | Tambah studio baru         | 201, 400      |
| PUT    | `/studios/:id` | Update studio              | 200, 400, 404 |
| DELETE | `/studios/:id` | Hapus studio (butuh token) | 200, 401, 404 |

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

**POST /studios** (body JSON, `id` dibuat server):

```json
{
  "name": "Wit Studio",
  "city": "Tokyo",
  "founded": 2012,
  "famousWork": "Attack on Titan"
}
```

**DELETE /anime/1** dan **DELETE /studios/1** butuh header:

```
x-auth-token: secret123
```

Tanpa header ini, server membalas `401 Unauthorized`.

**GET /anime/genre/Action** menampilkan anime bergenre Action (tidak peka huruf besar/kecil). Tanpa nama (`/anime/genre`) menampilkan semua anime.

**GET /anime/search?title=death** menampilkan anime yang judulnya mengandung kata "death" (tidak peka huruf besar/kecil). Tanpa query `title`, server membalas `400`.

**GET /files/docs/2026/laporan.pdf** menghasilkan:

```json
{ "path": ["docs", "2026", "laporan.pdf"] }
```

## Format error

Semua error (400, 401, 404, 500) memakai format yang sama dan melewati satu error handler:

```json
{ "status": 404, "error": "Anime not found" }
```

## Urutan di `index.js`

```
logger -> express.json() -> routes -> notFound -> errorHandler
```

Error handler memakai 4 parameter dan ditaruh paling akhir, supaya bisa menangkap error dari semua middleware dan route di atasnya.

## Struktur folder

```
midterm-20250040075-RegithRayabi/
├── index.js          # menjalankan server: middleware, routes, 404, error handler
├── middleware.js     # logger, requireAuth, notFound, errorHandler
├── routes/
│   ├── anime.js      # route anime + data array
│   └── studios.js    # route studios + data array (bonus)
├── screenshots/      # bukti tes tiap route
├── package.json
└── README.md
```

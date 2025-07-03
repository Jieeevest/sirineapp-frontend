const STORAGE_KEY = "my_uploaded_images";

const defaultImages: string[] = [
  "https://img.freepik.com/premium-photo/blue-police-car-light-night-city-with-selective-focus-bokeh-black-background_636705-5794.jpg?semt=ais_hybrid",
  "/foto1.jpeg",
  "/foto2.jpeg",
  "/foto3.jpeg",
  "/foto4.jpeg",
  "/foto5.jpeg",
];

// Ambil semua gambar dari localStorage (atau default)
export function getImages(): string[] {
  if (typeof window === "undefined") return defaultImages;
  const stored = localStorage.getItem(STORAGE_KEY);
  return stored ? JSON.parse(stored) : defaultImages;
}

// Simpan array ke localStorage
export function saveImages(images: string[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(images));
}

// Tambahkan 1 gambar baru
export function addImage(imageUrl: string): void {
  const current = getImages();
  if (!current.includes(imageUrl)) {
    const updated = [...current, imageUrl];
    saveImages(updated);
  }
}

// Hapus gambar berdasarkan URL
export function removeImage(imageUrl: string): void {
  const current = getImages();
  const updated = current.filter((img) => img !== imageUrl);
  saveImages(updated);
}

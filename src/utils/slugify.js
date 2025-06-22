const slugify = (text) =>
  text
    .toString()
    .toLowerCase()
    .replace(/\s+/g, '-')      // Ganti spasi dengan -
    .replace(/[^\w\-]+/g, '')  // Hapus karakter non-alphanumeric
    .replace(/\-\-+/g, '-')    // Ganti -- dengan -
    .replace(/^-+/, '')        // Hapus - di awal
    .replace(/-+$/, '');       // Hapus - di akhir

module.exports = slugify;

# Gunakan image slim (lebih stabil daripada alpine)
FROM node:20-slim

# Set timezone (opsional tapi disarankan untuk Next.js dan date-fns)
ENV TZ=Asia/Jakarta

WORKDIR /app

# Salin hanya file dependency
COPY package*.json ./

# Install dependency dengan cache layer yang efisien
RUN npm install --force

# Update browserslist (optional, bisa dihapus kalau tidak perlu)
RUN npx update-browserslist-db@latest

# Salin semua file proyek
COPY . .

# Port yang digunakan oleh Next.js
EXPOSE 3030

# Jalankan development server
CMD ["npm", "run", "dev"]

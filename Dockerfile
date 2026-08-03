FROM node:20-alpine AS builder

WORKDIR /app

# Copier uniquement les fichiers nécessaires pour l'installation
COPY package.json package-lock.json tsconfig.json ./

# Installation des dépendances (y compris devDependencies pour la compilation)
RUN npm ci

# Copier le code source
COPY src ./src
COPY plugins ./plugins

# Compilation TypeScript
RUN npm run build

# ---
FROM node:20-alpine AS runner

WORKDIR /app

# Installation de dumb-init pour gérer correctement les signaux (SIGTERM etc.)
RUN apk add --no-cache dumb-init

ENV NODE_ENV=production

# Copier uniquement les fichiers de prod
COPY package.json package-lock.json ./
RUN npm ci --omit=dev

# Copier les sources compilées depuis le builder
COPY --from=builder /app/dist ./dist

# Créer un utilisateur non-root par sécurité
RUN addgroup -S nidalum && adduser -S nidalum -G nidalum
USER nidalum

EXPOSE 8080

CMD ["dumb-init", "node", "dist/server.js"]

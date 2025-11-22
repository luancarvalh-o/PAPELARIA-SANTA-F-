# Guia de Deploy - Papeleria Santa Fé

## 🚂 Railway (Recomendado)

### 1. Preparação

Certifique-se que seu código está no GitHub:
\`\`\`bash
git init
git add .
git commit -m "Initial commit"
git remote add origin <seu-repo>
git push -u origin main
\`\`\`

### 2. Criar Projeto no Railway

1. Acesse [railway.app](https://railway.app)
2. Login com GitHub
3. Clique em "New Project"
4. Selecione "Deploy from GitHub repo"
5. Escolha o repositório `papeleria-santafe`

### 3. Adicionar PostgreSQL

1. No dashboard do projeto, clique "+ New"
2. Selecione "Database" → "PostgreSQL"
3. Railway criará automaticamente:
   - Um banco PostgreSQL
   - A variável `DATABASE_URL`

### 4. Configurar Variáveis de Ambiente

Na aba "Variables" do seu serviço web, adicione:

\`\`\`
SESSION_SECRET=<gere-um-secret-forte-aleatorio>
NODE_ENV=production
\`\`\`

Para gerar um SESSION_SECRET forte:
\`\`\`bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
\`\`\`

### 5. Executar Migrações

#### Opção A: Via Railway CLI

\`\`\`bash
# Instale o Railway CLI
npm install -g @railway/cli

# Faça login
railway login

# Link ao projeto
railway link

# Execute as migrações
railway run psql $DATABASE_URL -f sql/create_tables.sql
railway run psql $DATABASE_URL -f sql/seed.sql
railway run npm run seed-admin
\`\`\`

#### Opção B: Conectar diretamente ao banco

1. No Railway, vá no serviço PostgreSQL
2. Clique em "Connect" → copie a connection string
3. Use um cliente PostgreSQL (TablePlus, pgAdmin, psql):

\`\`\`bash
psql "<connection-string>" -f sql/create_tables.sql
psql "<connection-string>" -f sql/seed.sql
\`\`\`

4. Depois execute o seed-admin no container web:

\`\`\`bash
railway run npm run seed-admin
\`\`\`

### 6. Verificar Deploy

1. Railway gerará uma URL pública
2. Clique em "View Logs" para verificar se está tudo ok
3. Acesse a URL e teste:
   - Login com admin@papeleriasantafe.com / Admin123!
   - Adicionar produtos ao carrinho
   - Finalizar compra via WhatsApp

### 7. Domínio Customizado (Opcional)

1. Na aba "Settings" do serviço web
2. Clique em "Generate Domain" ou "Custom Domain"
3. Configure seu DNS se usar domínio próprio

## 🐳 Docker (Alternativa)

### Build e Run Local

\`\`\`bash
# Build
docker build -t papeleria-santafe .

# Run (com PostgreSQL externo)
docker run -p 3000:3000 \
  -e DATABASE_URL="postgresql://..." \
  -e SESSION_SECRET="seu-secret" \
  -e NODE_ENV="production" \
  papeleria-santafe
\`\`\`

### Docker Compose

Crie um `docker-compose.yml`:

\`\`\`yaml
version: '3.8'

services:
  db:
    image: postgres:15-alpine
    environment:
      POSTGRES_DB: papeleria
      POSTGRES_USER: admin
      POSTGRES_PASSWORD: senha123
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"

  web:
    build: .
    ports:
      - "3000:3000"
    environment:
      DATABASE_URL: postgresql://admin:senha123@db:5432/papeleria
      SESSION_SECRET: seu-secret-aqui
      NODE_ENV: production
    depends_on:
      - db
    volumes:
      - ./uploads:/app/uploads

volumes:
  postgres_data:
\`\`\`

Execute:
\`\`\`bash
docker-compose up -d
\`\`\`

## ☁️ Outras Plataformas

### Vercel (Frontend + API Routes)

**Nota:** Vercel funciona melhor para projetos Next.js. Para este projeto Express, use Railway.

### Heroku

\`\`\`bash
# Login
heroku login

# Criar app
heroku create papeleria-santafe

# Adicionar PostgreSQL
heroku addons:create heroku-postgresql:mini

# Configurar variáveis
heroku config:set SESSION_SECRET=$(node -e "console.log(require('crypto').randomBytes(32).toString('hex'))")
heroku config:set NODE_ENV=production

# Deploy
git push heroku main

# Executar migrações
heroku pg:psql < sql/create_tables.sql
heroku pg:psql < sql/seed.sql
heroku run npm run seed-admin
\`\`\`

### Render

1. Acesse [render.com](https://render.com)
2. Crie um "Web Service" conectando seu GitHub
3. Adicione um "PostgreSQL" database
4. Configure as variáveis de ambiente
5. Deploy automático

## 🔧 Manutenção

### Backup do Banco

\`\`\`bash
# Railway
railway run pg_dump $DATABASE_URL > backup.sql

# Heroku
heroku pg:backups:capture
heroku pg:backups:download
\`\`\`

### Logs

\`\`\`bash
# Railway
railway logs

# Heroku
heroku logs --tail
\`\`\`

### Restart

\`\`\`bash
# Railway
railway restart

# Heroku
heroku restart
\`\`\`

## 📊 Monitoramento

Após deploy, monitore:
- ✅ Health check: `https://seu-dominio.com/api/health`
- ✅ Logs de erro no dashboard da plataforma
- ✅ Performance do banco de dados
- ✅ Uso de armazenamento (uploads/)

## ⚠️ Avisos Importantes

1. **Uploads em Produção**: O diretório `uploads/` é efêmero no Railway. Para produção real, integre com S3, Cloudinary ou similar.

2. **Sessões**: As sessões estão configuradas para usar o banco PostgreSQL, o que é perfeito para ambientes de produção.

3. **HTTPS**: Railway fornece HTTPS automaticamente. Certifique-se de usar `secure: true` nos cookies em produção (já configurado).

4. **Variáveis Sensíveis**: NUNCA commite arquivos `.env` no Git. Use variáveis de ambiente da plataforma.

## 🎉 Deploy Completo!

Após seguir estes passos, sua aplicação estará rodando em produção!

Teste todas as funcionalidades:
- ✅ Registro/Login
- ✅ Adicionar ao carrinho
- ✅ Finalizar compra (WhatsApp)
- ✅ Admin: adicionar produtos
- ✅ Perfil: editar dados

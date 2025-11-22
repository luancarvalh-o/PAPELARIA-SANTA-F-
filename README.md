# Papeleria Santa Fé - E-commerce Completo

E-commerce completo para papelaria com carrinho de compras, integração WhatsApp, painel administrativo e autenticação de usuários.

## 🚀 Tecnologias

### Backend
- Node.js + Express
- PostgreSQL
- bcrypt (autenticação)
- express-session (sessões)
- multer (upload de imagens)

### Frontend
- HTML5, CSS3, JavaScript puro
- Poppins (Google Fonts)
- localStorage (carrinho)

## 📋 Funcionalidades

### Usuários
- ✅ Registro e login de usuários
- ✅ Perfil editável
- ✅ Histórico de pedidos
- ✅ Carrinho persistente (localStorage)
- ✅ Finalização via WhatsApp

### Admin
- ✅ Adicionar produtos
- ✅ Editar produtos
- ✅ Deletar produtos
- ✅ Upload de imagens

### Integração WhatsApp
- ✅ Finalizar compra (envia lista de itens)
- ✅ Solicitar orçamento de serviços
- ✅ Contato direto

## 🛠️ Instalação Local

### Pré-requisitos
- Node.js 18+
- PostgreSQL 12+

### Passos

1. **Clone o repositório**
\`\`\`bash
git clone <seu-repositorio>
cd papeleria-santafe
\`\`\`

2. **Instale as dependências**
\`\`\`bash
npm install
\`\`\`

3. **Configure o banco de dados**

Crie um banco PostgreSQL e configure a variável de ambiente:
\`\`\`bash
export DATABASE_URL="postgresql://usuario:senha@localhost:5432/papeleria"
\`\`\`

4. **Execute os scripts SQL**
\`\`\`bash
psql $DATABASE_URL -f sql/create_tables.sql
psql $DATABASE_URL -f sql/seed.sql
\`\`\`

5. **Crie o usuário admin**
\`\`\`bash
npm run seed-admin
\`\`\`

Isso criará o usuário admin com as credenciais:
- Email: admin@papeleriasantafe.com
- Senha: Admin123!

6. **Configure variáveis de ambiente**

Crie um arquivo `.env` (opcional para desenvolvimento):
\`\`\`
DATABASE_URL=postgresql://usuario:senha@localhost:5432/papeleria
SESSION_SECRET=seu-secret-aqui
PORT=3000
NODE_ENV=development
\`\`\`

7. **Inicie o servidor**
\`\`\`bash
# Desenvolvimento
npm run dev

# Produção
npm start
\`\`\`

8. **Acesse a aplicação**
\`\`\`
http://localhost:3000
\`\`\`

## 🚂 Deploy no Railway

### Passo a Passo

1. **Crie uma conta no Railway**
   - Acesse [railway.app](https://railway.app)
   - Faça login com GitHub

2. **Crie um novo projeto**
   - Clique em "New Project"
   - Selecione "Deploy from GitHub repo"
   - Conecte seu repositório

3. **Adicione PostgreSQL**
   - No seu projeto, clique em "+ New"
   - Selecione "Database" → "PostgreSQL"
   - Railway criará automaticamente a variável `DATABASE_URL`

4. **Configure as variáveis de ambiente**
   - Vá em "Variables"
   - Adicione:
     \`\`\`
     SESSION_SECRET=<gere-um-secret-aleatorio-forte>
     NODE_ENV=production
     \`\`\`

5. **Execute as migrações**

Após o deploy inicial, execute os comandos no Railway CLI ou via shell do container:

\`\`\`bash
# Instale o Railway CLI
npm install -g @railway/cli

# Login
railway login

# Link ao projeto
railway link

# Execute as migrações
railway run psql $DATABASE_URL -f sql/create_tables.sql
railway run psql $DATABASE_URL -f sql/seed.sql
railway run npm run seed-admin
\`\`\`

Alternativamente, você pode criar um `railway.json` para automatizar:

\`\`\`json
{
  "build": {
    "builder": "NIXPACKS"
  },
  "deploy": {
    "startCommand": "node server/index.js",
    "restartPolicyType": "ON_FAILURE",
    "restartPolicyMaxRetries": 10
  }
}
\`\`\`

6. **Acesse sua aplicação**
   - Railway fornecerá uma URL pública
   - Exemplo: `https://papeleria-santafe.up.railway.app`

### Troubleshooting Railway

**Erro de conexão com banco:**
- Verifique se a variável `DATABASE_URL` está configurada
- Certifique-se que o PostgreSQL está rodando

**Sessões não persistem:**
- Verifique se `SESSION_SECRET` está configurado
- Certifique-se que a tabela `session` foi criada

**Uploads não funcionam:**
- Em produção, considere usar S3 ou similar
- Para testes, os uploads funcionarão temporariamente no Railway

## 🗂️ Estrutura do Projeto

\`\`\`
papeleria-santafe/
├── server/
│   ├── index.js              # Servidor principal
│   ├── db.js                 # Conexão PostgreSQL
│   ├── seed-admin.js         # Script para criar admin
│   ├── middleware/
│   │   └── auth.js           # Middleware de autenticação
│   └── routes/
│       ├── auth.js           # Rotas de autenticação
│       ├── users.js          # Rotas de usuários
│       ├── categories.js     # Rotas de categorias
│       ├── products.js       # Rotas de produtos
│       └── orders.js         # Rotas de pedidos
├── public/
│   ├── index.html            # Página inicial
│   ├── catalog.html          # Catálogo de produtos
│   ├── services.html         # Página de serviços
│   ├── contact.html          # Página de contato
│   ├── cart.html             # Carrinho de compras
│   ├── login.html            # Login/Registro
│   ├── profile.html          # Perfil do usuário
│   ├── admin/
│   │   └── new-product.html  # Adicionar produto (admin)
│   ├── scripts/
│   │   ├── auth.js           # Funções de autenticação
│   │   └── cart.js           # Funções do carrinho
│   └── styles/
│       └── global.css        # Estilos globais
├── sql/
│   ├── create_tables.sql     # Schema do banco
│   └── seed.sql              # Dados iniciais
├── uploads/                  # Diretório para imagens
├── package.json
├── Dockerfile
├── Procfile
└── README.md
\`\`\`

## 🔐 Segurança

- Senhas criptografadas com bcrypt
- Sessões armazenadas no PostgreSQL
- Middleware de autenticação para rotas protegidas
- Validação de uploads (tipo e tamanho)
- Helmet.js para headers de segurança

## 🎨 Design

- Cores principais: Azul (#113baf) e Laranja (#ff7d00)
- Fonte: Poppins (Google Fonts)
- Design responsivo (mobile-first)
- Cards com efeito hover
- Interface intuitiva

## 📱 WhatsApp Integration

O número configurado é: **(31) 3532-2210**

Para alterar, edite nos arquivos:
- `public/cart.html` (linha com `wa.me/5531353222210`)
- `public/services.html` (linha com `wa.me/5531353222210`)
- `public/contact.html` (linha com `wa.me/5531353222210`)

## 👤 Credenciais de Demonstração

**Admin:**
- Email: admin@papeleriasantafe.com
- Senha: Admin123!

**Usuário comum:**
Crie sua própria conta na página de registro.

## 🐛 Problemas Comuns

### Erro: "Cannot find module"
\`\`\`bash
npm install
\`\`\`

### Erro: "relation does not exist"
\`\`\`bash
# Execute as migrações novamente
psql $DATABASE_URL -f sql/create_tables.sql
\`\`\`

### Imagens não aparecem
- Verifique se o diretório `uploads/` existe
- Em produção, considere usar serviço de storage externo (S3, Cloudinary)

## 📝 TODO / Melhorias Futuras

- [ ] Integrar S3 para armazenamento de imagens
- [ ] Adicionar paginação no catálogo
- [ ] Dashboard admin mais completo
- [ ] Sistema de avaliações de produtos
- [ ] Notificações por email
- [ ] Recuperação de senha
- [ ] Carrinho no banco de dados (além do localStorage)

## 📄 Licença

Este projeto é de código aberto para fins educacionais.

## 🤝 Contribuindo

Contribuições são bem-vindas! Por favor:
1. Fork o projeto
2. Crie uma branch para sua feature
3. Commit suas mudanças
4. Push para a branch
5. Abra um Pull Request

## 📞 Suporte

Para dúvidas ou suporte:
- Email: contato@papeleriasantafe.com
- WhatsApp: (31) 3532-2210
\`\`\`

```text file=".env.example"
# Database
DATABASE_URL=postgresql://usuario:senha@localhost:5432/papeleria

# Session
SESSION_SECRET=seu-secret-forte-e-aleatorio-aqui

# Server
PORT=3000
NODE_ENV=development

# Optional: Storage (para produção)
# S3_BUCKET=seu-bucket
# S3_KEY=sua-key
# S3_SECRET=seu-secret
# S3_REGION=us-east-1

# 💾 Como Salvar o Projeto

## 📦 Opção 1: Backup Completo (Recomendado)

### **Usando Git (se tiver instalado)**
```bash
# Inicializar repositório (se ainda não tiver)
git init

# Adicionar todos os arquivos
git add .

# Fazer commit
git commit -m "Saldo+ v1.0 - Versão inicial completa"

# Opcional: Enviar para GitHub
git remote add origin https://github.com/seu-usuario/saldo-plus.git
git push -u origin main
```

### **Sem Git - Copiar Pasta**
1. Copiar toda a pasta `finance-manager`
2. Colar em local seguro:
   - OneDrive: `C:\Users\[seu-usuario]\OneDrive\Projetos\`
   - Google Drive: `C:\Users\[seu-usuario]\Google Drive\Projetos\`
   - HD Externo
   - Pendrive

**Nome sugerido:** `saldo-plus-v1.0-backup-[data]`

---

## 📁 Opção 2: Backup Essencial (Menor)

### **Arquivos Importantes**
Copiar apenas estas pastas/arquivos:

```
finance-manager/
├── src/                    # Código-fonte (ESSENCIAL)
├── electron/               # Código Electron (ESSENCIAL)
├── public/                 # Assets (ESSENCIAL)
├── package.json            # Dependências (ESSENCIAL)
├── package-lock.json       # Versões exatas (ESSENCIAL)
├── vite.config.js          # Configuração Vite (ESSENCIAL)
├── index.html              # HTML principal (ESSENCIAL)
├── DOCUMENTACAO.md         # Documentação (IMPORTANTE)
├── MANUAL_INSTALACAO.md    # Manual (IMPORTANTE)
├── MANUAL_USO.md           # Manual (IMPORTANTE)
└── README.md               # Readme (IMPORTANTE)
```

### **Pode IGNORAR (serão recriados):**
- `node_modules/` - Reinstalar com `npm install`
- `dist/` - Recriar com `npm run build`
- `dist-electron/` - Recriar com build
- `release/` - Recriar com build
- `distribuicao/` - Recriar com `gerar_exe.bat`

---

## ☁️ Opção 3: Backup na Nuvem

### **Google Drive**
1. Instalar Google Drive Desktop
2. Copiar pasta para `Google Drive\Projetos\`
3. Aguardar sincronização

### **OneDrive**
1. Copiar pasta para `OneDrive\Projetos\`
2. Aguardar sincronização

### **Dropbox**
1. Copiar pasta para `Dropbox\Projetos\`
2. Aguardar sincronização

---

## 🔄 Restaurar Projeto

### **Passo 1: Copiar Arquivos**
- Copiar pasta de backup para local de trabalho

### **Passo 2: Instalar Dependências**
```bash
cd finance-manager
npm install
```

### **Passo 3: Testar**
```bash
npm run dev
```

### **Passo 4: Build (se necessário)**
```bash
npm run build
```

---

## 📝 Checklist de Backup

Antes de fazer backup, verificar:

- [ ] Código está funcionando
- [ ] Build passou sem erros
- [ ] Executável foi gerado
- [ ] Manuais estão atualizados
- [ ] Documentação está completa

---

## 🎯 Recomendação Final

**Faça 3 backups:**
1. **Local:** HD externo ou pendrive
2. **Nuvem:** Google Drive ou OneDrive
3. **Git:** GitHub (privado ou público)

**Quando fazer backup:**
- ✅ Após cada versão importante (v1.0, v1.1, etc)
- ✅ Antes de grandes mudanças
- ✅ Semanalmente durante desenvolvimento ativo

---

## 📧 Compartilhar com Outros Desenvolvedores

### **Criar ZIP para envio**
1. Excluir `node_modules`, `dist`, `release`
2. Compactar pasta
3. Enviar ZIP

### **Instruções para quem receber**
```bash
# Extrair ZIP
# Abrir terminal na pasta
npm install
npm run dev
```

---

**Seu projeto está seguro! 🔒**

# 📘 Documentação Completa do Projeto: Finance Manager ($aldo+)

Este documento serve como referência central para desenvolvedores, administradores e usuários finais do sistema Finance Manager.

---

## 1. 🛠️ Cenário de Desenvolvimento

### Visão Geral Técnica
O projeto é uma aplicação web moderna construída com **React** e **Vite**, utilizando **Supabase** como backend (BaaS) para autenticação e banco de dados.

### Stack Tecnológica
*   **Frontend:** React 18+, Vite
*   **Linguagem:** JavaScript (ES6+)
*   **Estilização:** CSS Modules / Variáveis CSS (Design System próprio)
*   **Backend:** Supabase (PostgreSQL, Auth, Realtime)
*   **Bibliotecas Chave:**
    *   `recharts`: Visualização de dados (gráficos)
    *   `react-hot-toast`: Notificações
    *   `react-joyride`: Tutoriais guiados
    *   `supabase-js`: Cliente de conexão

### Estrutura de Pastas
```
src/
├── components/      # Componentes de UI (Dashboard, TransactionForm, etc.)
├── context/         # Gerenciamento de estado global (AuthContext, LanguageContext)
├── hooks/           # Hooks customizados (useFinancialSummary)
├── services/        # Camada de serviço (StorageService, loggingService)
├── utils/           # Utilitários e helpers (formatCurrency, defaultCategories)
└── App.jsx          # Componente raiz e roteamento
```

### Configuração de Ambiente (.env)
O projeto depende das seguintes variáveis de ambiente:
```env
VITE_SUPABASE_URL=https://seu-projeto.supabase.co
VITE_SUPABASE_ANON_KEY=sua-chave-anonima
VITE_ADMIN_EMAIL=seu-email-admin@exemplo.com
```

### Comandos Principais
*   `npm run dev`: Inicia servidor local (porta 5173)
*   `npm run build`: Gera versão de produção na pasta `dist`
*   `npm run electron:dev`: Inicia versão Desktop (Electron)

---

## 2. 🛡️ Cenário Administrativo

### Acesso e Permissões
O acesso administrativo é controlado via código (`supabaseClient.js`) e verificado no banco de dados.
*   **Super Admin:** Definido via variável de ambiente ou hardcoded para `pmirandabh@gmail.com`.
*   **Permissões:** Acesso total a todos os dados de usuários, logs de auditoria e configurações globais.

### Painel Administrativo
Localizado no menu "Administração" (visível apenas para admins), oferece:
1.  **Gestão de Usuários:**
    *   Listagem completa com paginação.
    *   Status (Ativo/Bloqueado).
    *   Ações: Bloquear/Desbloquear acesso, reenvio de email de confirmação.
2.  **Logs de Auditoria:**
    *   Registro de ações críticas (login, exclusão de dados, alterações de admin).
    *   Filtros por severidade (INFO, WARN, ERROR).

### Manutenção
*   **Backup:** Scripts `.bat` automatizados para backup local do código.
*   **Banco de Dados:** O Supabase gerencia backups automáticos diários (plano Pro) ou manuais via dashboard.

---

## 3. 👤 Cenário de Uso (Usuário Final)

### Fluxo Principal
1.  **Cadastro/Login:**
    *   Registro via email/senha com confirmação obrigatória.
    *   Login seguro com persistência de sessão.
2.  **Onboarding:**
    *   Tutorial guiado no primeiro acesso.
    *   Criação automática de categorias padrão (Alimentação, Moradia, Salário, etc.).

### Funcionalidades Chave
*   **Dashboard:** Visão rápida de saldo, receitas e despesas do mês.
*   **Transações:**
    *   Adicionar Receitas/Despesas.
    *   Recorrência (Mensal/Fixa).
    *   Edição e Exclusão.
*   **Análises:** Gráficos interativos de distribuição de gastos e evolução mensal.
*   **Configurações:**
    *   Personalização de categorias (criar, editar cores, excluir).
    *   Exportação/Importação de dados (Backup pessoal).

### Suporte
*   **Dúvidas:** O sistema possui dicas visuais (tooltips) e validações de formulário para guiar o usuário.
*   **Erros:** Notificações via "Toast" (pop-ups no canto da tela) informam sucesso ou falha de operações.

---

## 4. 🚀 Plano de Deploy (Lançamento)

### Opção A: Vercel (Recomendada)
1.  Conectar repositório GitHub à Vercel.
2.  Configurar variáveis de ambiente (`VITE_SUPABASE_URL`, etc.) no painel da Vercel.
3.  Deploy automático a cada push na branch `main`.
4.  **Importante:** Adicionar URL da Vercel na lista de "Redirect URLs" no painel do Supabase Auth.

### Opção B: Netlify Drop (Manual)
1.  Executar `npm run build` localmente.
2.  Arrastar pasta `dist` para o Netlify Drop.
3.  Configurar variáveis de ambiente no painel do Netlify.
4.  Atualizar URLs no Supabase.

---
**Data da Documentação:** 05/12/2025
**Versão do Sistema:** 1.0.0

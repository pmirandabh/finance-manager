# 📚 Documentação - Saldo+ v1.0

## 📋 Informações Básicas

**Nome:** Saldo+ (Saldo Plus)  
**Versão:** 1.0  
**Tipo:** Aplicativo Desktop (Electron + React)  
**Plataforma:** Windows  
**Desenvolvedor:** Paulo Miranda  
**Data:** Novembro 2025

---

## 🎯 O que é o Saldo+?

Aplicativo desktop para **gestão financeira pessoal mensal**. Permite controlar receitas, despesas, transações recorrentes e visualizar análises financeiras.

---

## ✨ Funcionalidades Principais

### **1. Gestão de Transações**
- Adicionar receitas e despesas
- Editar e excluir transações
- Observações/notas em cada transação
- Sistema de competência (mês de referência)
- Data de vencimento

### **2. Transações Recorrentes**
- Criar despesas/receitas mensais automáticas
- Geração automática para 3 meses
- Confirmação de pagamento
- Status: Atrasado, No prazo, Futuro

### **3. Categorias**
- 14 categorias padrão (9 despesas + 5 receitas)
- Criar categorias personalizadas
- Ícones e cores customizáveis
- Sistema Ativo/Inativo (ocultar categorias não utilizadas)

### **4. Dashboard**
- Saldo do mês
- Total de receitas e despesas
- Gráfico de pizza por categoria
- Listas colapsáveis de transações
- Pendências organizadas

### **5. Análises**
- Gráficos de evolução mensal
- Comparação de períodos
- Filtros avançados
- Estatísticas detalhadas

### **6. Backup e Portabilidade**
- Exportar dados em JSON
- Exportar dados em CSV (Excel)
- Importar dados
- Limpar dados

---

## 🏗️ Arquitetura Técnica

### **Stack Tecnológico**
- **Frontend:** React 18
- **Desktop:** Electron
- **Build:** Vite
- **Gráficos:** Recharts
- **Armazenamento:** Electron Store (arquivos locais)

### **Estrutura de Pastas**
```
finance-manager/
├── electron/          # Código Electron (main process)
├── src/
│   ├── components/    # Componentes React
│   ├── context/       # Context API (Auth)
│   ├── styles/        # CSS
│   └── utils/         # Funções auxiliares
├── dist/              # Build de produção
└── package.json       # Dependências
```

### **Componentes Principais**
- `App.jsx` - Componente principal
- `Dashboard.jsx` - Visão geral
- `TransactionForm.jsx` - Formulário de transações
- `RecurringTransactions.jsx` - Pendências
- `CategoryManager.jsx` - Gerenciamento de categorias
- `Analytics.jsx` - Análises e gráficos
- `DataManagement.jsx` - Backup/Restore

---

## 💾 Armazenamento de Dados

### **Localização**
- **Windows:** `%APPDATA%/finance-manager/`

### **Arquivos**
- `transactions_[usuario].json` - Transações do usuário
- `categories_[usuario].json` - Categorias do usuário
- `users.json` - Dados de autenticação

### **Formato de Dados**

**Transação:**
```json
{
  "id": "unique-id",
  "description": "Aluguel",
  "amount": 1500,
  "type": "expense",
  "categoryId": 3,
  "competenceMonth": "2025-11",
  "dueDate": "2025-11-05",
  "paymentDate": "2025-11-05",
  "isPaid": true,
  "isRecurring": true,
  "isTemplate": false,
  "templateId": null,
  "notes": "Observações",
  "createdDate": "2025-11-01T10:00:00.000Z"
}
```

**Categoria:**
```json
{
  "id": 1,
  "name": "Moradia",
  "icon": "🏠",
  "color": "#45b7d1",
  "type": "expense",
  "isDefault": true,
  "isActive": true
}
```

---

## 🔧 Comandos de Desenvolvimento

### **Instalar Dependências**
```bash
npm install
```

### **Modo Desenvolvimento**
```bash
npm run dev
```

### **Build de Produção**
```bash
npm run build
```

### **Executar App (sem build)**
```bash
npm start
```

### **Gerar Executável**
```bash
npm run build:win
```

---

## 🎨 Recursos Visuais

### **Tema**
- Dark mode premium
- Glassmorphism
- Gradientes (roxo e ciano)
- Animações suaves

### **Cores Principais**
- Primary: `#BB86FC` (Roxo)
- Secondary: `#03DAC6` (Ciano)
- Error: `#CF6679` (Vermelho)
- Background: `#121212` (Preto)

---

## 🔐 Segurança e Privacidade

- **Dados locais:** Tudo armazenado no computador do usuário
- **Sem internet:** Funciona 100% offline
- **Sem rastreamento:** Zero telemetria
- **Sem nuvem:** Privacidade total

---

## 📊 Limitações Conhecidas

1. **Dados locais apenas** - Não sincroniza entre dispositivos
2. **Sem recuperação de senha** - Se esquecer, precisa criar nova conta
3. **Recorrência mensal apenas** - Não tem trimestral/anual
4. **Sem anexos** - Não pode anexar comprovantes
5. **Moeda única** - Apenas R$ (Real)

---

## 🚀 Melhorias Futuras (v1.1+)

### **Planejado para v1.1**
- Metas/Orçamento por categoria
- Alertas de vencimento
- Busca de transações
- Atalhos de teclado

### **Planejado para v1.5**
- Parcelamento de compras
- Projeção de saldo futuro
- Mais gráficos

### **Planejado para v2.0**
- Múltiplas contas
- Investimentos básicos
- Sincronização (opcional)

---

## 📝 Changelog

### **v1.0 (27/11/2025)**
- ✅ Gestão completa de transações
- ✅ Transações recorrentes
- ✅ Categorias personalizadas
- ✅ Sistema Ativo/Inativo de categorias
- ✅ Dashboard com gráficos
- ✅ Análises avançadas
- ✅ Backup/Restore (JSON/CSV)
- ✅ Performance otimizada
- ✅ Validação de importação
- ✅ Loading states

---

## 🆘 Suporte

**Problemas conhecidos:**
- Nenhum crítico identificado

**Como reportar bugs:**
1. Descrever o problema
2. Passos para reproduzir
3. Screenshot (se possível)
4. Versão do Windows

**Contato:**
- Desenvolvedor: Paulo Miranda

---

## 📄 Licença

Uso pessoal e educacional.

---

**Desenvolvido com ❤️ por Paulo Miranda**

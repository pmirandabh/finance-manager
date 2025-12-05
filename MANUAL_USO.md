# 📖 Manual de Uso - Saldo+ v1.0

## 🎯 Visão Geral

O Saldo+ é dividido em 3 seções principais:
- **Visão Geral** - Dashboard e transações
- **Análises** - Gráficos e relatórios
- **Configurações** - Categorias e backup

---

## 🏠 Visão Geral (Dashboard)

### **Filtro de Mês**
- Setas ← → para navegar entre meses
- Mostra mês/ano atual

### **Cards de Resumo**
- **Receitas:** Total de receitas do mês
- **Despesas:** Total de despesas do mês
- **Saldo:** Diferença entre receitas e despesas

### **Saldo Atual**
- Verde: Positivo (receitas > despesas)
- Vermelho: Negativo (despesas > receitas)

### **Gráfico de Categorias**
- Pizza mostrando distribuição por categoria
- Toggle para alternar entre Despesas/Receitas
- Clique na categoria para ver detalhes

---

## ➕ Adicionar Transação

### **Formulário "Nova Transação"**

1. **Tipo**
   - Receita (dinheiro que entra)
   - Despesa (dinheiro que sai)

2. **Descrição**
   - Nome da transação
   - Exemplo: "Salário", "Aluguel", "Mercado"

3. **Valor**
   - Apenas números
   - Exemplo: 1500.00

4. **Categoria**
   - Selecionar da lista
   - Apenas categorias ativas aparecem

5. **Competência**
   - Mês de referência da transação
   - Padrão: Mês atual

6. **Vencimento** (Opcional)
   - Data limite para pagamento
   - Usado em pendências

7. **Recorrente Mensal**
   - ☑️ Marcar se repete todo mês
   - Exemplos: Aluguel, Salário, Contas

8. **Observações** (Opcional)
   - Notas adicionais
   - Exemplo: "Parcela 3/12"

9. **Clicar em "Adicionar"**

---

## 📋 Últimas Transações

### **Listas Colapsáveis**
- **Receitas** - Transações de entrada
- **Despesas** - Transações de saída

### **Expandir/Recolher**
- Clicar na seta ▶ para expandir
- Clicar na seta ▼ para recolher
- Lista permanece aberta após ações

### **Ações em Transações**
- **Editar:** Modificar dados da transação
- **Excluir:** Remover transação (pede confirmação)

---

## 📅 Transações Pendentes

### **O que são?**
Transações recorrentes ou manuais que ainda não foram pagas/recebidas.

### **Seções**
- **Receitas Pendentes** - Dinheiro a receber
- **Despesas Pendentes** - Contas a pagar

### **Status**
- 🟢 **No prazo:** Vencimento no mês atual
- 🟡 **Futuro:** Vencimento em meses futuros
- 🔴 **Atrasado:** Vencimento passou

### **Ações**
- **✅ Pagar/Receber:** Confirmar transação
- **🗑️ Excluir:** Remover pendência

---

## 📊 Análises

### **Filtros**
- **Período Inicial:** Data de início
- **Período Final:** Data de fim
- **Tipo:** Despesas, Receitas ou Ambos
- **Categorias:** Filtrar por categorias específicas

### **Gráficos**

1. **Pizza - Distribuição por Categoria**
   - Mostra % de cada categoria
   - Ordenado por maior valor

2. **Barras - Comparação Mensal**
   - Receitas vs Despesas por mês
   - Verde: Receitas
   - Vermelho: Despesas

3. **Linha - Evolução do Saldo**
   - Saldo acumulado ao longo do tempo
   - Verde: Positivo
   - Vermelho: Negativo

### **Estatísticas**
- Total de receitas
- Total de despesas
- Média mensal de gastos
- Categoria com maior gasto

---

## ⚙️ Configurações

### **Categorias**

#### **Gerenciar Categorias**
1. Ir em **Configurações** → **Categorias**
2. Duas abas: **Despesas** e **Receitas**

#### **Criar Nova Categoria**
1. Clicar em "+ Nova"
2. Escolher ícone
3. Digitar nome
4. Escolher cor
5. Clicar em "Salvar"

#### **Editar Categoria**
1. Clicar em "Editar"
2. Modificar dados
3. Clicar em "Salvar"

#### **Excluir Categoria**
1. Clicar em "Excluir"
2. Confirmar exclusão
3. **Atenção:** Só categorias personalizadas podem ser excluídas

#### **Ocultar/Reativar Categoria**
- **Ocultar:** Remove dos seletores (dados preservados)
- **Reativar:** Volta a aparecer nos seletores

**Seções:**
- **Ativas:** Aparecem nos seletores
- **Inativas:** Ocultas, mas dados preservados

---

### **Backup e Dados**

#### **Exportar JSON**
1. Ir em **Configurações** → **Backup**
2. Clicar em "Exportar JSON"
3. Escolher local para salvar
4. Arquivo: `backup_saldoplus_[data].json`

**Quando usar:**
- Backup antes de atualizar
- Transferir para outro computador
- Segurança dos dados

#### **Exportar CSV**
1. Clicar em "Exportar CSV"
2. Escolher local para salvar
3. Arquivo: `transacoes_[data].csv`

**Quando usar:**
- Abrir no Excel
- Análises externas
- Relatórios personalizados

#### **Importar JSON**
1. Clicar em "Importar JSON"
2. Selecionar arquivo de backup
3. Confirmar importação
4. Dados serão mesclados

**Atenção:** Importar substitui dados atuais!

#### **Limpar Dados**
1. Clicar em "Limpar Dados"
2. Confirmar ação
3. **CUIDADO:** Remove TODAS as transações!

**Recomendação:** Fazer backup antes!

---

## 💡 Dicas de Uso

### **Organização**
1. **Oculte categorias não utilizadas**
   - Mantém interface limpa
   - Facilita seleção

2. **Use observações**
   - Adicione detalhes importantes
   - Exemplo: "Parcela 3/12", "Reembolsável"

3. **Configure recorrências**
   - Economiza tempo
   - Não esquece contas fixas

### **Controle Financeiro**
1. **Atualize diariamente**
   - Adicione transações assim que acontecem
   - Evita esquecimentos

2. **Revise semanalmente**
   - Confira pendências
   - Pague contas no prazo

3. **Analise mensalmente**
   - Veja gráficos de evolução
   - Identifique gastos excessivos

### **Backup**
1. **Faça backup semanal**
   - Segurança dos dados
   - Proteção contra perda

2. **Guarde em nuvem**
   - Google Drive, OneDrive
   - Acesso de qualquer lugar

---

## ⌨️ Atalhos de Teclado

Atualmente não disponíveis (planejado para v1.1)

---

## ❓ Perguntas Frequentes

### **Como criar uma despesa recorrente?**
1. Adicionar transação normalmente
2. Marcar ☑️ "Recorrente Mensal"
3. Sistema cria automaticamente nos próximos meses

### **Posso editar uma transação recorrente?**
Sim! Cada mês é independente. Editar um mês não afeta os outros.

### **Como ocultar uma categoria?**
Configurações → Categorias → Clicar em "Ocultar"

### **Categorias ocultas perdem dados?**
Não! Transações antigas continuam visíveis. Apenas não aparecem nos seletores.

### **Posso usar em mais de um computador?**
Sim! Exporte o backup e importe no outro computador.

### **Como recuperar senha esquecida?**
Não há recuperação. Precisará criar nova conta.

### **Dados ficam na nuvem?**
Não! Tudo fica no seu computador. Privacidade total.

---

## 🎓 Tutoriais Rápidos

### **Cenário 1: Primeiro Uso**
1. Criar conta
2. Ocultar categorias não utilizadas
3. Adicionar salário (recorrente)
4. Adicionar contas fixas (recorrentes)
5. Adicionar gastos do mês
6. Fazer backup

### **Cenário 2: Uso Diário**
1. Abrir app
2. Adicionar transações do dia
3. Confirmar pendências pagas
4. Fechar app

### **Cenário 3: Revisão Mensal**
1. Ir em Análises
2. Ver gráficos do mês
3. Identificar categorias com mais gastos
4. Planejar próximo mês

---

## 📞 Suporte

**Dúvidas?**
- Consulte este manual
- Verifique seção de Perguntas Frequentes

**Problemas?**
- Consulte Manual de Instalação
- Seção "Solução de Problemas"

---

**Aproveite o Saldo+ e tenha controle total das suas finanças! 💰**

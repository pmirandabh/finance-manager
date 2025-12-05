# Gerenciador de Finanças

Aplicação desktop para gerenciar suas finanças pessoais, construída com Electron + React + Vite.

## 🚀 Como Usar

### Testar sem Instalar
Execute o arquivo `testar_app.bat` para testar a aplicação sem gerar o instalador.

### Gerar Executável
Execute o arquivo `gerar_exe.bat` para criar o instalador da aplicação.
O instalador será gerado na pasta `dist-electron`.

### Desenvolvimento
```bash
# Instalar dependências
npm install

# Executar em modo desenvolvimento
npm run electron:dev

# Construir para produção
npm run build

# Gerar executável
npm run dist
```

## 🔧 Solução de Problemas

### Tela em Branco ao Abrir
Se a aplicação abrir com tela em branco:
1. Verifique se o build foi feito corretamente (`npm run build`)
2. Abra o DevTools (Ctrl+Shift+I) para ver erros no console
3. Verifique se os arquivos estão na pasta `dist`

### Dados não Salvam
Os dados são salvos automaticamente em:
`C:\Users\[SEU_USUARIO]\AppData\Roaming\finance-manager\finance-data.json`

## 📝 Funcionalidades

- ✅ Adicionar receitas e despesas
- ✅ Visualizar saldo atual
- ✅ Histórico de transações
- ✅ Persistência automática de dados
- ✅ Interface moderna com glassmorphism

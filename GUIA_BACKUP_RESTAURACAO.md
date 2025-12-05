# 🛡️ Guia de Backup e Restauração - Saldo+

Este guia explica como salvar seu projeto com segurança e como colocá-lo para funcionar em outro computador (ou se formatar o atual).

---

## 1. Como Fazer Backup (Salvar)

Criamos um script automático para facilitar sua vida.

### 🚀 Opção 1: Backup Leve (Recomendado para E-mail)
1.  Use o arquivo: 👉 **`backup_projeto_v2.bat`**
2.  Gera um arquivo pequeno (~2MB).
3.  **Não** inclui `node_modules` (você baixa de novo com `npm install`).

### 📦 Opção 2: Backup COMPLETO (Igual ao seu de 500MB)
1.  Use o arquivo: 👉 **`backup_completo.bat`**
2.  Gera um arquivo grande (~300MB a 600MB).
3.  Inclui **TUDO** (node_modules, builds, executáveis).
4.  Ideal para salvar em HD Externo ou Pendrive.

### 💾 Onde Guardar:

### 💾 Onde Guardar:
Envie esse arquivo `.zip` para um local seguro:
*   ☁️ **Google Drive / OneDrive** (Recomendado)
*   📧 **Email** (Envie para você mesmo)
*   💾 **Pendrive / HD Externo**

> **Nota:** O backup **NÃO** inclui a pasta `node_modules` (que é muito pesada e desnecessária). Ela será baixada automaticamente na restauração.

---

## 2. Como Restaurar (Voltar a Usar)

Se você perdeu os arquivos ou trocou de computador, siga estes passos para voltar a programar.

### 📋 Pré-requisitos:
Você precisa ter o **Node.js** instalado no computador.
*   Baixe e instale: [https://nodejs.org/](https://nodejs.org/) (Versão LTS)

### 🚀 Passo a Passo:
1.  **Extraia o ZIP:** Pegue o arquivo de backup e extraia em uma pasta (ex: `Meus Documentos\Projetos\SaldoPlus`).
2.  **Abra o Terminal:**
    *   Entre na pasta extraída.
    *   Clique com o botão direito em um espaço vazio e escolha **"Abrir no Terminal"** (ou PowerShell).
3.  **Instale as Dependências:**
    *   Digite o comando abaixo e aperte Enter:
        ```bash
        npm install
        ```
    *   *Aguarde o download terminar (pode levar alguns minutos).*
4.  **Inicie o Projeto:**
    *   Digite:
        ```bash
        npm run dev
        ```
    *   O projeto vai abrir no seu navegador! 🎉

---

## 3. Comandos Úteis

| Comando | O que faz |
| :--- | :--- |
| `npm run dev` | Inicia o modo de desenvolvimento (para programar) |
| `npm run build` | Cria a versão final do site (para internet) |
| `npm run build:win` | Cria o instalador para Windows (.exe) |

---

**Dúvidas?** Consulte o arquivo `README.md` para mais detalhes técnicos.

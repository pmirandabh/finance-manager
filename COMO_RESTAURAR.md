# 🔄 Como Restaurar o Projeto em Outro Computador

Se você formatou o PC ou quer trabalhar em outro computador, siga estes passos:

## 1️⃣ Pré-requisitos (Instalar antes)

Você precisa ter o **Node.js** instalado.
1. Baixe em: [https://nodejs.org/](https://nodejs.org/) (Versão LTS recomendada)
2. Instale (só ir clicando em "Next")
3. Reinicie o computador após instalar.

---

## 2️⃣ Restaurar o Projeto

1. **Pegue o arquivo ZIP** do backup (ex: `Backup_Saldo+_v1.0...zip`).
2. **Extraia** o arquivo em uma pasta (ex: `Meus Documentos\Projetos\finance-manager`).
3. Abra essa pasta.

---

## 3️⃣ Instalar Dependências

Como o backup não salva a pasta pesada `node_modules`, precisamos baixá-la de novo.

1. Clique com o botão direito na pasta vazia dentro da janela e escolha **"Abrir no Terminal"** (ou PowerShell).
2. Digite o comando:
   ```bash
   npm install
   ```
3. Aguarde terminar (pode demorar uns minutos).

---

## 4️⃣ Voltar a Trabalhar

Agora que tudo está instalado:

- **Para programar:**
  ```bash
  npm run dev
  ```

- **Para gerar um novo executável:**
  ```bash
  npm run build:win
  ```

---

**Pronto!** Seu projeto está vivo novamente. 🚀

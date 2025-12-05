# 🚀 Guia de Lançamento Online (Deploy)

Parabéns! Com o projeto revisado e pronto, aqui está o passo a passo para colocar seu **Finance Manager** na internet para que qualquer pessoa possa acessar.

Recomendação de Hospedagem: **Vercel** (Gratuito, rápido e perfeito para React/Vite).

## 1. Preparação do Código (GitHub)
A maneira mais fácil de fazer deploy é conectando seu GitHub.
1.  Crie um repositório no [GitHub](https://github.com).
2.  Suba seu código para lá:
    ```bash
    git init
    git add .
    git commit -m "Versão final para lançamento"
    git branch -M main
    git remote add origin <SEU_LINK_DO_GITHUB>
    git push -u origin main
    ```

## 2. Configurando a Vercel
1.  Crie uma conta na [Vercel](https://vercel.com).
2.  Clique em **"Add New..."** -> **"Project"**.
3.  Selecione seu repositório do GitHub e clique em **Import**.
4.  **Configuração de Build:** A Vercel detecta Vite automaticamente. Não precisa mudar nada.
5.  **Variáveis de Ambiente (Environment Variables):**
    *   Abra a seção "Environment Variables".
    *   Adicione as mesmas chaves que estão no seu arquivo `.env`:
        *   `VITE_SUPABASE_URL`: (Sua URL do Supabase)
        *   `VITE_SUPABASE_ANON_KEY`: (Sua chave anônima do Supabase)
6.  Clique em **Deploy**.

## 3. Configurando o Supabase (Crítico!)
Para que o login funcione no site online, você precisa autorizar o novo endereço.
1.  Acesse seu painel do [Supabase](https://supabase.com).
2.  Vá em **Authentication** -> **URL Configuration**.
3.  Em **Site URL**, coloque o link que a Vercel gerou para você (ex: `https://finance-manager-paulo.vercel.app`).
4.  Em **Redirect URLs**, adicione também esse mesmo link.
5.  Clique em **Save**.

## 4. Teste Final
1.  Acesse o link do seu site.
2.  Tente fazer login/cadastro.
3.  Verifique se os dados carregam corretamente.

---

## 💡 Alternativa sem GitHub (Netlify Drop)
Se não quiser usar GitHub agora:
1.  Rode `npm run build` no seu terminal local. Isso cria uma pasta `dist`.
2.  Acesse [Netlify Drop](https://app.netlify.com/drop).
3.  Arraste a pasta `dist` para lá.
4.  O site vai para o ar. Depois, vá nas configurações do site no Netlify para adicionar as variáveis de ambiente (`VITE_SUPABASE_URL`, etc) e configure o Supabase igual ao passo 3.

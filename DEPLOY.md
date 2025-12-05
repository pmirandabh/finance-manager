# Guia de Deploy - Saldo+

Este guia explica como colocar o aplicativo Saldo+ online para acesso externo. Recomendamos usar a **Vercel** pela facilidade e compatibilidade com projetos Vite/React.

## Pré-requisitos

1.  Uma conta no [GitHub](https://github.com) (para hospedar o código).
2.  Uma conta na [Vercel](https://vercel.com) (pode criar usando o GitHub).
3.  O código do projeto salvo no seu computador.

## Passo 1: Subir o código para o GitHub

Se você ainda não tem um repositório Git:

1.  Crie um novo repositório no GitHub (ex: `saldo-plus`).
2.  No terminal do projeto, execute:
    ```bash
    git init
    git add .
    git commit -m "Versão inicial para deploy"
    git branch -M main
    git remote add origin https://github.com/SEU_USUARIO/saldo-plus.git
    git push -u origin main
    ```

## Passo 2: Configurar na Vercel

1.  Acesse [vercel.com/new](https://vercel.com/new).
2.  Selecione o repositório `saldo-plus` que você acabou de criar.
3.  Na tela de configuração ("Configure Project"):
    *   **Framework Preset:** Vite (deve detectar automaticamente).
    *   **Root Directory:** `./` (padrão).
    *   **Environment Variables:** Adicione as variáveis do Supabase:
        *   `VITE_SUPABASE_URL`: (Sua URL do Supabase)
        *   `VITE_SUPABASE_ANON_KEY`: (Sua chave Anon do Supabase)
4.  Clique em **Deploy**.

## Passo 3: Acessar o Aplicativo

Após alguns instantes, a Vercel fornecerá uma URL (ex: `https://saldo-plus.vercel.app`). Você pode compartilhar esse link com quem quiser dar acesso.

## Observações Importantes

*   **Autenticação:** Como o sistema usa Supabase Auth, certifique-se de que a URL do seu site (ex: `https://saldo-plus.vercel.app`) esteja adicionada na lista de **Redirect URLs** no painel do Supabase (Authentication -> URL Configuration -> Redirect URLs).
*   **Segurança:** As chaves `VITE_SUPABASE_URL` e `VITE_SUPABASE_ANON_KEY` são seguras para expor no frontend, mas certifique-se de que suas políticas RLS (Row Level Security) no Supabase estejam ativas e corretas (já configuramos isso).

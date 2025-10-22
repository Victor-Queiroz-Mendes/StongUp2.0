# StrongUp - Site estático

Estrutura básica de um site estático com páginas: Home, Produtos, Produto Detalhe, Carrinho, Checkout e Contato.

Como testar localmente:

- Usando Python (recomendado):

  - No Windows PowerShell, execute:

```powershell
cd c:\Users\3anoA\Desktop\StrongUp
python -m http.server 8000
```

- Abrir no navegador: http://localhost:8000

Observações:
- Os dados dos produtos são mockados em `js/produtos.js`.
- Carrinho usa `localStorage` para persistência local.
- Substitua as imagens em `images/` com as fotos reais.

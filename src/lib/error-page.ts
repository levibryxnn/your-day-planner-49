export function renderErrorPage(): string {
  return `<!doctype html>
<html lang="pt-BR">
  <head>
    <meta charset="utf-8" />
    <title>Rota — não foi possível carregar</title>
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <style>
      body { font: 15px/1.5 system-ui, -apple-system, sans-serif; background: #f9f7f2; color: #1c1917; display: grid; place-items: center; min-height: 100vh; margin: 0; padding: 1.5rem; }
      .card { max-width: 28rem; width: 100%; text-align: center; padding: 2rem; }
      .brand { display: inline-flex; align-items: center; gap: .5rem; font-weight: 700; margin-bottom: 1.5rem; }
      .dot { width: .65rem; height: .65rem; border-radius: 999px; background: #14532d; }
      h1 { font-size: 1.25rem; margin: 0 0 0.5rem; }
      p { color: #57534e; margin: 0 0 1.5rem; }
      .actions { display: flex; gap: 0.5rem; justify-content: center; flex-wrap: wrap; }
      a, button { padding: 0.65rem 1rem; border-radius: 0.75rem; font: inherit; cursor: pointer; text-decoration: none; border: 1px solid transparent; }
      .primary { background: #1c1917; color: #fff; }
      .secondary { background: #fff; color: #1c1917; border-color: #d6d3d1; }
    </style>
  </head>
  <body>
    <div class="card">
      <div class="brand"><span class="dot"></span>Rota</div>
      <h1>Não foi possível carregar esta página</h1>
      <p>O Rota encontrou um problema temporário. Tente novamente ou volte ao início.</p>
      <div class="actions">
        <button class="primary" onclick="location.reload()">Tentar novamente</button>
        <a class="secondary" href="/">Voltar ao início</a>
      </div>
    </div>
  </body>
</html>`;
}

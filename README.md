# Gerenciador de tarefas

Uma aplicação full stack simples para gerenciar tarefas: uma API **Hono** exposta via **tRPC** e um frontend **Next.js** com tipagem ponta a ponta.

## Tecnologias

- **Backend:** Hono no Node.js, tRPC v11 e Zod
- **Frontend:** Next.js (App Router), React 19, Tailwind CSS v4 e [terminal.css](https://github.com/letieu/terminal.css) com o tema Rosé Pine
- **Testes:** Vitest (backend e frontend), Testing Library e jsdom (frontend)
- **Ferramentas:** workspace pnpm e TypeScript

## Estrutura do projeto

```
.
├── backend/
│   └── src/
│       ├── index.ts              # Aplicação Hono, CORS, rota /trpc e inicialização do servidor
│       ├── trpc.ts               # Configuração do tRPC
│       ├── router.ts             # Router raiz (tipo AppRouter)
│       ├── routers/
│       │   └── tasks.router.ts   # Listagem e operações de criação, edição e exclusão
│       └── tests/
├── frontend/
│   └── src/
│       ├── app/                  # Layout, página e estilos globais
│       ├── components/tasks/     # Componentes para criar, editar, excluir e listar tarefas
│       └── lib/trpc.ts           # Cliente tRPC tipado
├── package.json                  # Scripts da raiz (pnpm)
└── pnpm-workspace.yaml
```

## Requisitos

- Node.js 20 ou superior
- Um gerenciador de pacotes: [pnpm](https://pnpm.io/installation) (recomendado), npm ou yarn

<details>
<summary>Como começar</summary>

### Com pnpm (recomendado)

```bash
pnpm install        # instala as dependências dos dois pacotes na raiz
pnpm dev            # inicia backend e frontend em paralelo
```

Para executar os serviços separadamente, use dois terminais:

```bash
pnpm dev:backend
pnpm dev:frontend
```

### Com npm

Os scripts da raiz usam pnpm. Com npm, instale as dependências dentro de cada pacote e execute os serviços em dois terminais:

```bash
# terminal 1: backend
cd backend
npm install
npm run dev

# terminal 2: frontend
cd frontend
npm install
npm run dev
```

### Com yarn

```bash
# terminal 1: backend
cd backend
yarn install
yarn dev

# terminal 2: frontend
cd frontend
yarn install
yarn dev
```

Os dois pacotes precisam ter suas dependências instaladas, pois o frontend importa os tipos do router do backend (e usa Zod e `@trpc/server` durante a checagem de tipos).

> O repositório contém apenas o `pnpm-lock.yaml`. Com npm ou yarn, as versões são resolvidas novamente e um `package-lock.json` ou `yarn.lock` será criado localmente; por isso, elas podem variar em relação à configuração com pnpm.

### Endereços

- Frontend: http://localhost:3000
- Backend: http://localhost:8787 (verificação de saúde em `GET /` e tRPC em `/trpc`)

</details>

<details>
<summary>Configuração</summary>

A aplicação já possui valores padrão e pode ser iniciada sem configuração adicional.

| Serviço | Variável | Padrão | Finalidade |
| --- | --- | --- | --- |
| Backend | `PORT` | `8787` | Porta da API |
| Backend | `FRONTEND_URL` | `http://localhost:3000` | Origem permitida pelo CORS |
| Frontend | `NEXT_PUBLIC_API_URL` | `http://localhost:8787` | URL base usada pelo cliente tRPC |

O backend lê as variáveis do ambiente (consulte `backend/.env.example`). Para configurar o frontend, use `frontend/.env.local`.

</details>

<details>
<summary>Scripts</summary>

### pnpm (na raiz do repositório)

| Comando | Descrição |
| --- | --- |
| `pnpm dev` | Inicia backend e frontend em modo de desenvolvimento |
| `pnpm dev:backend` | Inicia somente o backend |
| `pnpm dev:frontend` | Inicia somente o frontend |
| `pnpm build` | Compila os dois pacotes |
| `pnpm typecheck` | Verifica os tipos dos dois pacotes |
| `pnpm test` | Executa todos os testes |
| `pnpm test:back` | Executa somente os testes do backend |
| `pnpm test:front` | Executa somente os testes do frontend |

### npm / yarn (dentro de `backend/` ou `frontend/`)

| npm | yarn | Descrição |
| --- | --- | --- |
| `npm run dev` | `yarn dev` | Inicia o servidor de desenvolvimento |
| `npm run build` | `yarn build` | Gera a versão de produção |
| `npm start` | `yarn start` | Inicia a versão de produção compilada |
| `npm test` | `yarn test` | Executa os testes do pacote uma vez |

</details>

<details>
<summary>Testes</summary>

```bash
# pnpm, na raiz do repositório
pnpm test

# npm ou yarn, dentro de backend/ ou frontend/
npm test            # ou: yarn test
```

Para executar um arquivo específico, informe parte do nome:

```bash
pnpm test:front task-form        # pnpm
npm test -- task-form            # npm
yarn test task-form              # yarn
```

</details>

<details>
<summary>Build de produção</summary>

```bash
# pnpm
pnpm build
pnpm --filter backend start    # node dist/index.js
pnpm --filter frontend start   # next start

# npm ou yarn: execute dentro de cada pacote
cd backend  && npm run build && npm start     # ou: yarn build && yarn start
cd frontend && npm run build && npm start     # ou: yarn build && yarn start
```

</details>

<details>
<summary>Como funciona</summary>

- **Tipos compartilhados:** o frontend importa somente o tipo `AppRouter` do backend; o código do backend não é incluído no bundle do frontend. Alterações nos procedures são refletidas nos tipos e podem revelar incompatibilidades durante a compilação.
- **Renderização no servidor:** o componente de servidor busca a primeira página da lista via tRPC. A criação atualiza a lista com `router.refresh()`. Edição e exclusão atualizam a lista local após a mutation.
- **Paginação:** a lista carrega tarefas adicionais conforme o usuário rola a área de tarefas. A API usa um cursor numérico de deslocamento e retorna as tarefas mais recentes primeiro.
- **Armazenamento:** as tarefas ficam **em memória** e são perdidas quando o backend é reiniciado.

</details>

<details>
<summary>API</summary>

Todos os procedures ficam em `tasks` e são acessados em `/trpc`:

| Procedure | Tipo | Entrada |
| --- | --- | --- |
| `tasks.list` | Query | `{ cursor?, limit? }` (objeto opcional; limite padrão: `5`) |
| `tasks.create` | Mutation | `{ title, description? }` |
| `tasks.update` | Mutation | `{ id, title, description? }` |
| `tasks.delete` | Mutation | `id` |

IDs desconhecidos geram um erro tRPC com código `NOT_FOUND` nas operações de edição e exclusão.

</details>

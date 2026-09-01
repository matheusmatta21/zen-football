# zen-football

Monorepo (npm workspaces) do zen-football.

## Estrutura

```
apps/
  mobile/     App Expo (SDK 57, expo-router, uniwind)
packages/
  types/      Contratos compartilhados entre app e backend
```

- **`apps/`** — projetos que rodam ou são publicados.
- **`packages/`** — projetos que só existem para serem importados.

## Começando

```bash
npm install          # sempre na raiz, nunca dentro de apps/
npm start            # atalho para: npm start -w mobile
```

Outros atalhos da raiz: `npm run ios`, `npm run android`, `npm run web`, `npm run lint`.

> **Não rode `npx expo start` na raiz.** A raiz é só a coordenadora e não tem
> `main` no `package.json`, então o Expo cai no fallback antigo
> (`expo/AppEntry.js`) e falha com `Unable to resolve "../../App"`. Use os
> atalhos da raiz ou entre em `apps/mobile/`. Se isso acontecer, apague o
> `.expo/` que ficou na raiz.

## Trabalhando nos workspaces

A flag `-w` escolhe o projeto:

```bash
npm start -w mobile                       # roda um script
npm i expo-notifications -w mobile        # instala uma dependência
npx tsc --noEmit -p packages/types        # typecheck de um pacote
```

Entrar na pasta (`cd apps/mobile && npm start`) funciona igual para rodar
scripts. Só o `install` que é sempre da raiz — existe um único
`package-lock.json` e um único `node_modules`, na raiz.

## `@zen/types`

O `apps/mobile` importa o pacote pelo nome, não por caminho relativo:

```ts
import type { Match, MatchStatus } from "@zen/types";
```

Isso funciona porque o npm cria um symlink em `node_modules/@zen/types`
apontando para `packages/types/`. Não há build: o código-fonte TypeScript é lido
direto, então editar o pacote reflete no app na hora.

O pacote separa duas camadas:

- `football-data.ts` — os contratos brutos da [football-data.org
  v4](https://docs.football-data.org/general/v4/match.html), prefixados com
  `Fd`. Só o backend consome.
- `match.ts` — o contrato entre o nosso backend e o nosso app, mais as funções
  de normalização. É isto que o app importa.

A separação existe para que uma mudança de formato da football-data.org fique
contida no backend, sem vazar para as telas.

## Notas

- O Metro configura monorepo sozinho a partir do SDK 52 — não há
  `watchFolders` nem `nodeModulesPaths` para manter.
- No EAS Build, aponte o projeto para `apps/mobile`.

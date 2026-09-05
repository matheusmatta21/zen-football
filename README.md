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

## Catálogo de clubes

O modal e o onboarding carregam `GET /api/clubs` uma vez, com os clubes das
cinco ligas agrupados. Os accordions usam essa resposta e não fazem requisições.
`GET /api/teams?competitionId=...` continua disponível usando o mesmo catálogo.

O backend salva o catálogo em `CLUB_CATALOG_FILE` (por padrão,
`.cache/club-catalog.json` no diretório de execução). Cada liga expira após
24 horas. A atualização ocorre sob demanda, é compartilhada entre requisições
concorrentes e salva os resultados por liga. São cinco chamadas externas na
primeira carga completa; consultas com catálogo válido não consomem a cota.
Se a atualização falhar, o último catálogo completo é servido com `stale: true`.
Novas tentativas ficam bloqueadas por cinco minutos, inclusive após reiniciar.
Sem catálogo completo, `/api/clubs` responde 503 com `Retry-After: 300`.

No Fly.io, `fly.toml` monta o volume `club_catalog` em `/data`. Antes de publicar,
provisione esse volume de 1 GB em `gru` se ainda não existir:

```bash
fly volumes create club_catalog --app zen-football-api --region gru --size 1
```

O volume tem cobrança própria. Não foi criado nem houve deploy automaticamente.
Essa configuração atende uma única máquina/processo da API. Para várias
instâncias, será necessário armazenamento compartilhado e coordenação da
atualização; volumes independentes não compartilham o catálogo nem a cota.
O cache de clubes não limita as chamadas de partidas e de competições do time.

Testes de integração e persistência, a partir da raiz:

```bash
node --import tsx --test apps/api/tests/*.test.ts
```

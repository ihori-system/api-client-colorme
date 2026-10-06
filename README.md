api-client-colorme
===

Unofficial client for the カラーミーショップ API

## Prerequisites

- [GitHub CLI](https://cli.github.com/)

## Getting started

#### 1) Add or update `.npmrc`

```
//npm.pkg.github.com/:_authToken=${GITHUB_TOKEN}
@ihori-system:registry=https://npm.pkg.github.com
```

#### 2) Install package

*Make sure `gh` command is authenticated and has `read:packages` scope.*

```
GITHUB_TOKEN=$(gh auth token) npm install @ihori-system/api-client-colorme
```

## Usage

```typescript
import { ColormeApiClient } from '@ihori-system/api-client-colorme'

const client = new ColormeApiClient()

const { response } = await client.getShopV1()({ accessToken: 'YOUR_ACCESS_TOKEN' })

if (response.ok) {
  const json = await response.json()

  console.log(json.shop?.id) // e.g. PAXXXXXXXX
}
```

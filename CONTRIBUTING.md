## Development

### Prerequisites

- [Node.js](https://nodejs.org)

### Getting started

#### 1) Install dependencies

```sh
npm ci
```

## Deployment

#### 1) Create new tag

```sh
git checkout main
git pull
npm version {{major | minor | patch}}
git push
git push --tags
git checkout develop
git merge origin/main
git push
```
#### 2) Create new release

https://github.com/ihori-system/api-client-colorme/releases/new

## External documentation

- [カラーミーショップ API](https://developer.shop-pro.jp/docs/colorme-api)
- [カラーミーショップアプリストア API](https://app.shop-pro.jp/open_api)
- [undici](https://undici.nodejs.org/)
- [ESLint](https://eslint.org/)
- [ESLint Stylistic](https://eslint.style/)
- [Vitest](https://vitest.dev/)

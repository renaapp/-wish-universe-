# 🌟 Wish Universe

願いを宇宙に放つアプリ。

## セットアップ

```bash
npm install
npm run dev
```

## デプロイ手順（Vercel）

### 1. GitHubにPush

```bash
git init
git add .
git commit -m "first commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/wish-universe.git
git push -u origin main
```

### 2. Vercelに接続

1. https://vercel.com にアクセス（GitHubアカウントでログイン）
2. "Add New Project" → GitHubのリポジトリを選択
3. Framework Preset: **Vite** を選択
4. **Environment Variables** に以下を追加：
   - `VITE_ANTHROPIC_API_KEY` = あなたのAPIキー
5. "Deploy" をクリック

### 3. APIキーの取得

https://console.anthropic.com でAPIキーを発行。

## ローカルで動かす

`.env.local` を作成：

```
VITE_ANTHROPIC_API_KEY=sk-ant-xxxxxxxx
```

```bash
npm run dev
```

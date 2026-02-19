# KSP プロジェクト概要

## 概要
株式会社KSPの企業サイト（軽貨物配送業）。静的HTMLサイト（フレームワーク不使用）。

## 技術スタック
- HTML5 / CSS3 / Vanilla JavaScript
- Google Fonts: Noto Sans JP, Montserrat
- ビルドツール・バンドラー: なし（静的ファイル直接配信）
- TypeScript設定あり（Serena検出）だが、実際のソースはJS

## ファイル構成
```
├── index.html          # トップページ
├── business.html       # 事業内容
├── strength.html       # 強み・選ばれる理由
├── company.html        # 会社概要
├── contact.html        # お問い合わせ
├── privacy.html        # プライバシーポリシー
├── site.webmanifest    # PWA設定
├── css/style.css       # メインCSS
├── js/main.js          # メインJS（全機能集約）
└── images/             # 画像（hero-bg, 配送関連webp/png, favicon）
```

## ページ構成
### index.html（トップ）
- hero, services, strengths, testimonials, stats, flow, news, faq

### business.html（事業内容）
- page-hero + 7セクション（サービス詳細、CTA）

### strength.html（強み）
- page-hero + 5セクション（強み詳細、values、CTA）

### company.html（会社概要）
- page-hero + 4セクション（会社情報、CTA）

### contact.html（お問い合わせ）
- page-hero + 5セクション（フォーム、CTA）

### privacy.html（プライバシーポリシー）
- page-hero + 1セクション

## JavaScript機能 (js/main.js)
- ローディングスクリーン
- ヘッダースクロール制御（50px閾値で表示切替）
- ハンバーガーメニュー（モバイル対応）
- ページ遷移アニメーション
- スムーススクロール
- スクロールアニメーション（IntersectionObserver）
- カウンターアニメーション
- FAQ アコーディオン
- カードチルトエフェクト
- マグネティックボタン
- パララックス
- Back to Top ボタン
- お問い合わせフォーム処理
- 現在ページのナビゲーションハイライト

## ナビゲーション
- デスクトップ: header__nav
- モバイル: mobile-nav（ハンバーガートグル）
- フッター: footer__nav
- CTAボタン: 電話 (090-5340-0504) / メール (info@ksp-delivery.co.jp)

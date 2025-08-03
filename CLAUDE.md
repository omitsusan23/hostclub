# プロジェクト構成メモ

## 最近の修正履歴

### 2025-01-31 
- ReservationAddModalのレイアウト調整
  - 来店予約追加ラベルとナビゲーションの重なりを解消
  - ラベル部分: `env(safe-area-inset-top)` + padding
  - ナビゲーション: `env(safe-area-inset-top) + 64px`
  - コンテンツ: `env(safe-area-inset-top) + 120px`

- レイアウト間隔統一仕様策定
  - ヘッダー下のコンテンツ間隔統一
  - 標準仕様: `pt-[calc(env(safe-area-inset-top)+66px)]`
  - 適用対象: 現状、卓状況、来店予約、姫、成績ページ
  - その他の統一クラス: `p-4 pb-16` (左右下パディング)
  - SafeArea対応: `env(safe-area-inset-top)` でiOSノッチ対応

### 2025-02-03
- 戻るボタンスタイル統一
  - すべての「戻る」ボタンを来店予約追加ページのスタイルに統一
  - **白背景の場合**: `text-black text-base font-medium border-b border-black pb-0.5`
  - **黒背景の場合**: `text-white text-base font-medium border-b border-white pb-0.5`
  - **基準**: 来店予約追加ページ（ReservationAddModal）のスタイル
  - **実装方法**: モーダルではModalNavigationコンポーネントを使用

### 未解決の問題
- AvatarCropperで画像の位置移動（ドラッグ）が動作しない
  - react-easy-cropライブラリ使用
  - 原因調査済み、修正は未実施

## プロジェクト構成
（ここに構成説明を追加してください）
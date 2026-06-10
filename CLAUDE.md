# ECMO Newsletter Operations

## Google Drive アップロード

ニュースレターMDファイルをGoogle Driveに保存するには：

```bash
node /home/user/gdrive_tool/upload.mjs /home/user/operations/newsletters/<ファイル名>.md
```

### 必要な環境変数（プロジェクト設定で登録済み）
- `GDRIVE_CLIENT_ID`
- `GDRIVE_CLIENT_SECRET`
- `GDRIVE_REFRESH_TOKEN`

保存先：`06■Claude関連 / Claude Cowork / ecmo / operations / newsletters`
フォルダID：`1SwKwqh1F_cYCtg2JAoQjCmcIM9efqgP2`

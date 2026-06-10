import { google } from 'googleapis';
import { createReadStream } from 'fs';
import { basename } from 'path';

const CLIENT_ID = process.env.GDRIVE_CLIENT_ID;
const CLIENT_SECRET = process.env.GDRIVE_CLIENT_SECRET;
const REFRESH_TOKEN = process.env.GDRIVE_REFRESH_TOKEN;
const FOLDER_ID = '1SwKwqh1F_cYCtg2JAoQjCmcIM9efqgP2'; // 06■Claude関連/Claude Cowork/ecmo/operations/newsletters

if (!CLIENT_ID || !CLIENT_SECRET || !REFRESH_TOKEN) {
  console.error('エラー: 環境変数 GDRIVE_CLIENT_ID / GDRIVE_CLIENT_SECRET / GDRIVE_REFRESH_TOKEN が未設定です');
  process.exit(1);
}

const auth = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET);
auth.setCredentials({ refresh_token: REFRESH_TOKEN });

const drive = google.drive({ version: 'v3', auth });

const filePath = process.argv[2];
if (!filePath) {
  console.error('使い方: node upload.mjs <ファイルパス>');
  process.exit(1);
}

const fileName = basename(filePath);

async function uploadFile() {
  const existing = await drive.files.list({
    q: `name='${fileName}' and '${FOLDER_ID}' in parents and trashed=false`,
    fields: 'files(id, name)',
    supportsAllDrives: true,
    includeItemsFromAllDrives: true
  });

  const fileStream = createReadStream(filePath);
  const mimeType = 'text/markdown';

  if (existing.data.files?.length > 0) {
    const fileId = existing.data.files[0].id;
    const res = await drive.files.update({
      fileId,
      media: { mimeType, body: fileStream },
      supportsAllDrives: true,
      fields: 'id, name, webViewLink'
    });
    console.log(`✅ 更新完了: ${res.data.name}`);
    console.log(`   URL: ${res.data.webViewLink}`);
  } else {
    const res = await drive.files.create({
      requestBody: { name: fileName, parents: [FOLDER_ID] },
      media: { mimeType, body: fileStream },
      supportsAllDrives: true,
      fields: 'id, name, webViewLink'
    });
    console.log(`✅ アップロード完了: ${res.data.name}`);
    console.log(`   URL: ${res.data.webViewLink}`);
  }
}

uploadFile().catch(err => {
  console.error('エラー:', err.message);
  process.exit(1);
});

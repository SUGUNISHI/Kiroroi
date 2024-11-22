const express = require('express');
const multer = require('multer');
const AWS = require('aws-sdk');
const fs = require('fs');
const app = express();
const path = require('path');
const port = process.env.PORT || 3000;

// 
});

// Multer 설정 (파일 업로드)
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// 이미지 업로드 API
app.post('/api/upload', upload.single('image'), async (req, res) => {
  try {
    const file = req.file;
    const params = {
      Bucket: 'Kiroroi',
      Key: Date.now() + '-' + file.originalname,
      Body: file.buffer,
      ContentType: file.mimetype,
      ACL: 'public-read', // 파일을 퍼블릭으로 읽기 가능하게 설정
    };

    const s3Response = await s3.upload(params).promise();

    // 업로드된 파일 URL을 반환
    res.json({ fileUrl: s3Response.Location });
  } catch (err) {
    console.error('Error uploading file:', err);
    res.status(500).json({ error: 'Failed to upload image.' });
  }
});

// 업로드된 이미지 목록 가져오기
app.get('/api/photos', async (req, res) => {
  try {
    const params = {
      Bucket: 'Kiroroi',
    };

    const data = await s3.listObjectsV2(params).promise();
    const images = data.Contents.map(item => `https://f7388472221e58f7ca2363ac0c355295.r2.cloudflarestorage.com/${item.Key}`);
    res.json(images);
  } catch (err) {
    console.error('Error fetching photos:', err);
    res.status(500).json({ error: 'Failed to fetch photos.' });
  }
});

// 기본 라우팅
app.use(express.static(path.join(__dirname, 'public')));

// 서버 시작
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

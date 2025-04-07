const ffmpeg = require('fluent-ffmpeg');
const axios = require('axios');
const fs = require('fs');

// Chỉ định đường dẫn chính xác đến ffmpeg.exe
ffmpeg.setFfmpegPath('C:/ffmpeg/ffmpeg-7.1.1-essentials_build/bin/ffmpeg.exe'); // Cập nhật đường dẫn

// Hàm tách audio từ video
function extractAudio(videoPath, audioPath) {
    return new Promise((resolve, reject) => {
        ffmpeg(videoPath)
            .noVideo()
            .output(audioPath)
            .on('end', () => {
                console.log('Đã tách audio');
                resolve(audioPath);
            })
            .on('error', (err) => reject(err))
            .run();
    });
}

// Hàm chuyển audio sang text với AssemblyAI
async function audioToText(audioPath) {
    const apiKey = '953ca95b7b8349eabdc8b5cb9a342268'; // Thay bằng API key của bạn
    const headers = { authorization: apiKey };

    // Upload file audio
    const audioData = fs.readFileSync(audioPath);
    const uploadResponse = await axios.post(
        'https://api.assemblyai.com/v2/upload',
        audioData,
        {
            headers: {
                ...headers,
                'content-type': 'application/octet-stream'
            }
        }
    );
    const audioUrl = uploadResponse.data.upload_url;

    // Gửi yêu cầu transcribe
    const transcribeResponse = await axios.post(
        'https://api.assemblyai.com/v2/transcript',
        { audio_url: audioUrl },
        { headers }
    );
    const transcriptId = transcribeResponse.data.id;

    // Polling để lấy kết quả
    let transcript;
    while (true) {
        const result = await axios.get(
            `https://api.assemblyai.com/v2/transcript/${transcriptId}`,
            { headers }
        );
        if (result.data.status === 'completed') {
            transcript = result.data.text;
            break;
        } else if (result.data.status === 'error') {
            throw new Error('Transcription failed: ' + result.data.error);
        }
        await new Promise((resolve) => setTimeout(resolve, 1000));
    }

    return transcript || 'Không có nội dung thoại nào được nhận diện.';
}

// Hàm tạo mô tả bằng Cohere API
async function generateDescription(text) {
    try {
        if (!text || typeof text !== 'string') {
            throw new Error('Transcript không hợp lệ hoặc rỗng');
        }

        console.log('Transcript gửi đi:', text);

        const response = await axios.post(
            'https://api.cohere.ai/v1/chat',
            {
                model: 'command-r',
                message: `Dựa trên nội dung thoại từ trailer này: "${text}", hãy tạo một mô tả ngắn cho bộ phim, dưới 50 từ.`,
                max_tokens: 150,
                temperature: 0.7
            },
            {
                headers: {
                    Authorization: 'Bearer gkRb1KLVfUSdJKi0r4Np6A9OCvssCkaPcwTSk73l', // Thay bằng key của bạn
                    'Content-Type': 'application/json'
                }
            }
        );

        return response.data.text;
    } catch (error) {
        console.error('Chi tiết lỗi từ Cohere:', error.response ? error.response.data : error.message);
        throw error;
    }
}

// Hàm chính để xử lý trailer và tạo mô tả
async function processTrailer(trailerPath) {
    try {
        const audioPath = `./public/images/movies/${Date.now()}-audio.wav`;

        // Bước 1: Tách audio từ video
        await extractAudio(trailerPath, audioPath);

        // Bước 2: Chuyển audio sang text
        const transcript = await audioToText(audioPath);

        // Bước 3: Tạo mô tả từ text
        const description = await generateDescription(transcript);

        // Xóa file audio tạm thời
        fs.unlinkSync(audioPath);

        return description;
    } catch (error) {
        throw new Error('Lỗi xử lý trailer: ' + error.message);
    }
}

module.exports = { processTrailer };
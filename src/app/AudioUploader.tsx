"use client"

import React, { useState } from 'react';

const AudioUploader: React.FC = () => {
    const [file, setFile] = useState<File | null>(null);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const uploadedFile = event.target.files ? event.target.files[0] : null;

        if (uploadedFile && uploadedFile.size > 25 * 1024 * 1024) {
            alert('アップロードされたファイルが25MBを超えています。');
            return;
        }

        setFile(uploadedFile);
    };

    return (
        <div>
            <input type="file" accept="audio/*" onChange={handleFileChange} />
            {file && <p>選択されたファイル: {file.name}</p>}
        </div>
    );
};

export default AudioUploader;
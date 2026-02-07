import React, { useState } from 'react';

const ProtectedImage = ({ file, accessToken, className, style, alt }) => {
    // Start with the high-res thumbnail link
    const [imgSrc, setImgSrc] = useState(file.thumbnailLink ? file.thumbnailLink.replace('=s220', '=s800') : '');
    const [hasError, setHasError] = useState(false);

    const handleError = async () => {
        if (hasError || !accessToken) return; // Prevent infinite loops
        setHasError(true);

        try {
            console.log(`Attempting secure fetch for ${file.name}...`);
            // Fallback: Fetch the actual file content as a blob
            // Note: This fetches the FULL image, which can be heavy, but guarantees access.
            const response = await fetch(`https://www.googleapis.com/drive/v3/files/${file.id}?alt=media`, {
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                }
            });

            if (response.ok) {
                const blob = await response.blob();
                const objectUrl = URL.createObjectURL(blob);
                setImgSrc(objectUrl);
            } else {
                console.error("Secure fetch failed:", response.status);
            }
        } catch (err) {
            console.error("Error fetching protected image:", err);
        }
    };

    return (
        <img
            src={imgSrc}
            alt={alt}
            className={className}
            style={style}
            onError={handleError}
            loading="lazy"
            referrerPolicy="no-referrer"
        />
    );
};

export default ProtectedImage;

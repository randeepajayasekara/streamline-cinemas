export const generateQRCodeSVG = (text: string, size: number = 200): string => {
    const modules = 25;
    const moduleSize = size / modules;
    
    const data = text.split('').map(char => char.charCodeAt(0) % 2);
    
    const qrMatrix: boolean[][] = [];
    for (let i = 0; i < modules; i++) {
        qrMatrix[i] = [];
        for (let j = 0; j < modules; j++) {
            const index = (i * modules + j) % data.length;
            qrMatrix[i][j] = data[index] === 1;
        }
    }
    
    const finderPatterns = [
        [0, 0], [0, modules - 7], [modules - 7, 0]
    ];
    
    finderPatterns.forEach(([startRow, startCol]) => {
        for (let i = 0; i < 7; i++) {
            for (let j = 0; j < 7; j++) {
                if (startRow + i < modules && startCol + j < modules) {
                    const isBorder = i === 0 || i === 6 || j === 0 || j === 6;
                    const isInnerSquare = i >= 2 && i <= 4 && j >= 2 && j <= 4;
                    qrMatrix[startRow + i][startCol + j] = isBorder || isInnerSquare;
                }
            }
        }
    });
    
    let svgContent = `<svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">`;
    svgContent += `<rect width="${size}" height="${size}" fill="white"/>`;
    
    for (let i = 0; i < modules; i++) {
        for (let j = 0; j < modules; j++) {
            if (qrMatrix[i][j]) {
                const x = j * moduleSize;
                const y = i * moduleSize;
                svgContent += `<rect x="${x}" y="${y}" width="${moduleSize}" height="${moduleSize}" fill="black"/>`;
            }
        }
    }
    
    const logoSize = size * 0.2;
    const logoX = (size - logoSize) / 2;
    const logoY = (size - logoSize) / 2;
    
    svgContent += `<rect x="${logoX}" y="${logoY}" width="${logoSize}" height="${logoSize}" fill="white" stroke="black" stroke-width="2"/>`;
    svgContent += `<image href="https://i.ibb.co/DfSWFbSF/favicon-96x96.png" x="${logoX}" y="${logoY}" width="${logoSize}" height="${logoSize}"/>`;

    svgContent += '</svg>';
    
    return `data:image/svg+xml;base64,${btoa(svgContent)}`;
};

export const generateReservationId = (): string => {
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substr(2, 5);
    return `SC-${timestamp}-${random}`.toUpperCase();
};

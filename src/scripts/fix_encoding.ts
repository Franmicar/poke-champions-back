import fs from 'fs';
import path from 'path';

const langPath = '../frontend/src/assets/i18n/es-ES';
const files = fs.readdirSync(langPath);

files.forEach(file => {
    if (file.endsWith('.json')) {
        const filePath = path.join(langPath, file);
        const buffer = fs.readFileSync(filePath);
        
        // Detectar si es UTF-16LE (comienza con el BOM 0xFFFE)
        if (buffer[0] === 0xFF && buffer[1] === 0xFE) {
            console.log(`Converting ${file} from UTF-16LE to UTF-8...`);
            const content = buffer.toString('utf16le');
            fs.writeFileSync(filePath, content, 'utf8');
        } else {
            console.log(`${file} is already UTF-8 or other compatible encoding.`);
        }
    }
});

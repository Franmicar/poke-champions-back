import fs from 'fs';
import path from 'path';

const i18nRoot = '../frontend/src/assets/i18n';
const languages = ['en-US', 'es-ES', 'es-LA'];

languages.forEach(lang => {
    const langPath = path.join(i18nRoot, lang);
    if (!fs.existsSync(langPath)) return;
    
    const files = fs.readdirSync(langPath);
    files.forEach(file => {
        if (file.endsWith('.json')) {
            const filePath = path.join(langPath, file);
            let content = fs.readFileSync(filePath, 'utf8');
            
            // Eliminar BOM si existe (\ufeff)
            if (content.charCodeAt(0) === 0xFEFF) {
                console.log(`Removing BOM from ${lang}/${file}`);
                content = content.slice(1);
                fs.writeFileSync(filePath, content, 'utf8');
            }
        }
    });
});

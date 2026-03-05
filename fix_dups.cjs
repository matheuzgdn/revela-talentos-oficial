const fs = require('fs');
const path = require('path');

function fixDuplicates(dir) {
    fs.readdirSync(dir).forEach(file => {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            fixDuplicates(fullPath);
        } else if (fullPath.endsWith('.jsx') || fullPath.endsWith('.js')) {
            const content = fs.readFileSync(fullPath, 'utf8');

            const lines = content.split('\n');
            let found = false;
            let fixedContent = [];
            let modified = false;

            for (const line of lines) {
                if (line.includes('import { base44 } from "@/api/base44Client";')) {
                    if (!found) {
                        found = true;
                        fixedContent.push(line);
                    } else {
                        modified = true;
                    }
                } else {
                    fixedContent.push(line);
                }
            }

            if (modified) {
                fs.writeFileSync(fullPath, fixedContent.join('\n'));
                console.log('Fixed:', fullPath);
            }
        }
    });
}
fixDuplicates('./src');

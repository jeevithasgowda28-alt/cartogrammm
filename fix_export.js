const fs = require('fs');
let code = fs.readFileSync('app/project-info.tsx', 'utf8');

const newExport = `    const exportData = async () => {
        try {
            const userMap = members.reduce((acc, m) => {
                acc[m.uid] = m.username || m.displayName || m.uid;
                return acc;
            }, {} as Record<string, string>);

            let csvContent = "User Name,Entry Description,Categories,Main Category,Time Stamp,Location,Image URL\\n";
            
            for (const [entryId, entry] of Object.entries(rawEntries)) {
                const userName = userMap[entry.userId] || "Unknown";
                const description = (entry.title || entry.description || "").replace(/"/g, '""');
                
                let categories = "";
                if (entry.tags && Array.isArray(entry.tags)) {
                    categories = entry.tags.join(', ');
                } else if (entry.tags && typeof entry.tags === 'string') {
                    categories = entry.tags;
                } else {
                    categories = entry.category || "";
                }
                categories = categories.replace(/"/g, '""');
                
                const mainCategory = (entry.category || "").replace(/"/g, '""');
                
                let timeStamp = entry.createdAt || entry.timestamp || "";
                if (typeof timeStamp === 'number') {
                    const d = new Date(timeStamp);
                    timeStamp = \`\${d.toLocaleDateString('en-GB')}, \${d.toLocaleTimeString('en-GB')}\`;
                } else if (typeof timeStamp === 'string') {
                    const d = new Date(timeStamp);
                    if (!isNaN(d.getTime())) {
                        timeStamp = \`\${d.toLocaleDateString('en-GB')}, \${d.toLocaleTimeString('en-GB')}\`;
                    }
                }

                const loc = (entry.latitude && entry.longitude) ? \`\${entry.latitude}, \${entry.longitude}\` : "";
                const imgUrl = (entry.imageUrl || entry.image || "").replace(/"/g, '""');

                csvContent += \`"\${userName}","\${description}","\${categories}","\${mainCategory}","\${timeStamp}","\${loc}","\${imgUrl}"\\n\`;
            }

            const fileUri = FileSystem.documentDirectory + \`\${(project.name || "Project").replace(/\\s+/g, '_')}_Export.csv\`;
            await FileSystem.writeAsStringAsync(fileUri, csvContent, { encoding: FileSystem.EncodingType.UTF8 });
            await Sharing.shareAsync(fileUri, { UTI: 'public.comma-separated-values-text', mimeType: 'text/csv' });
        } catch (e) {
            Alert.alert("Export Error", "Failed to export data.");
        }
    };\`;

code = code.replace(/    const exportData = async \\(\\) => \\{[\\s\\S]*?Failed to export data\\.\\"\\);\\s*\\}\\s*\\};/, newExport);
fs.writeFileSync('app/project-info.tsx', code);
console.log('Update complete');

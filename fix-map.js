const fs = require('fs');
let content = fs.readFileSync('app/MapScreen.tsx', 'utf8');

// 1. Remove left chevron
content = content.replace(/<Pressable onPress=\{scrollLeft\}.*?>\s*<Ionicons name="chevron-back"[\s\S]*?<\/Pressable>/, '');

// 2. Fix entries badge (location -> documents-outline)
content = content.replace(/<Ionicons name="location" size=\{14\} color="#fff" \/>\s*<ThemeText style=\{\{ color: '#fff', fontSize: 11, fontWeight: '800' \}\}>\s*\{savedEntries\.filter\(e => e\.projectId === activeItem\.key\)\.length\}/, 
'<Ionicons name="documents-outline" size={14} color="#fff" />\n                    <ThemeText style={{ color: "#fff", fontSize: 11, fontWeight: "800" }}>\n                      {savedEntries.filter(e => e.projectId === activeItem.key).length}');

// 3. Make Logos round and padding slim
content = content.replace(/projectListItem: \{ flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', padding: 12, borderRadius: 16, marginBottom: 10, borderWidth: 1, borderColor: '#eee' \},/,
"projectListItem: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', padding: 8, borderRadius: 16, marginBottom: 10, borderWidth: 1, borderColor: '#eee' },");
content = content.replace(/projectIconBox: \{ width: 44, height: 44, borderRadius: 12, marginRight: 12, overflow: 'hidden' \},/,
"projectIconBox: { width: 44, height: 44, borderRadius: 22, marginRight: 12, overflow: 'hidden' },");

fs.writeFileSync('app/MapScreen.tsx', content);

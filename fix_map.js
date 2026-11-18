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

// 4. Remove old social row from BOTH popups (lines around refSocialRow)
content = content.replace(/<View style=\{styles\.refSocialRow\}>[\s\S]*?<Pressable style=\{styles\.refShareBtn\} onPress=\{\(e\) => \{ e\.stopPropagation\(\); handleShare\(activeItem\); \}\}>[\s\S]*?<\/Pressable>\s*<\/View>/, '');
content = content.replace(/<View style=\{styles\.refSocialRow\}>[\s\S]*?<Pressable style=\{styles\.refShareBtn\} onPress=\{\(\) => handleShare\(activeItem\)\}>[\s\S]*?<\/Pressable>\s*<\/View>/, '');

// 5. Change Category Pill for selectedPopEntry popup
content = content.replace(
  /<View style=\{\[styles\.popupCategoryBadge, \{ backgroundColor: selectedPopEntry\?\.color \|\| '#333', marginBottom: 0 \}\]\}>[\s\S]*?<\/View>/,
  '<View style={{ flex: 1 }} />'
);
content = content.replace(
  /<ThemeText style=\{styles\.popupTitle\}>\{selectedPopEntry\?\.name\}<\/ThemeText>/,
  `
              <View style={{ flexDirection: 'row', alignSelf: 'flex-start', alignItems: 'center', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 12, backgroundColor: (selectedPopEntry?.color || '#333') + '20', marginBottom: 8 }}>
                <Ionicons name={(selectedPopEntry?.icon || "location") as any} size={16} color={selectedPopEntry?.color || '#333'} />
                <ThemeText style={{ color: selectedPopEntry?.color || '#333', fontWeight: '800', fontSize: 15, marginLeft: 6 }}>{selectedPopEntry?.name}</ThemeText>
              </View>
`
);

// 6. Change Category Pill for activeItem popup
content = content.replace(
  /<ThemeText style=\{styles\.refTitle\}>\{activeItem\.label\}<\/ThemeText>/,
  `
                  <View style={{ flexDirection: 'row', alignSelf: 'flex-start', alignItems: 'center', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 12, backgroundColor: (activeItem.color || '#333') + '20', marginBottom: 8 }}>
                    <Ionicons name={activeItem.isProject ? (activeItem.icon || "map") : ((activeItem as any).icon || "location")} size={16} color={activeItem.color || '#333'} />
                    <ThemeText style={{ color: activeItem.color || '#333', fontWeight: '800', fontSize: 15, marginLeft: 6 }}>{activeItem.label}</ThemeText>
                  </View>
`
);

// 7. Add the Social row below footer for activeItem
content = content.replace(
  /Created by \{activeItem\?\.ownerId === auth\.currentUser\?\.uid \? "You" : "Community Member"\}[\s\S]*?<\/ThemeText>\s*<\/View>\s*<\/View>/,
  `$&
                  <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start', gap: 16, marginTop: 12, paddingTop: 12, borderTopWidth: 1, borderColor: '#eee' }}>
                    <Pressable 
                      style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}
                      onPress={(e) => { 
                        e.stopPropagation(); 
                        const currentLikes = activeItem.likes || 0;
                        const isCurrentlyLiked = likedItems[activeItem.key];
                        const newLikes = isCurrentlyLiked ? Math.max(0, currentLikes - 1) : currentLikes + 1;
                        
                        const globalPath = activeItem.isProject ? \`projects/\${activeItem.key}\` : \`projectEntries/\${activeProjectId}/\${activeItem.key}\`;
                        const userPath = activeItem.isProject && activeItem.ownerId ? \`users/\${activeItem.ownerId}/projects/\${activeItem.key}\` : null;
                        
                        update(ref(db, globalPath), { likes: newLikes });
                        if (userPath) update(ref(db, userPath), { likes: newLikes });
                        setLikedItems(prev => ({...prev, [activeItem.key]: !isCurrentlyLiked}));
                      }}
                    >
                      <Ionicons name={likedItems[activeItem.key] ? "heart" : "heart-outline"} size={20} color={likedItems[activeItem.key] ? "#ff4b4b" : "#666"} />
                      <ThemeText style={{ fontSize: 13, fontWeight: '700', color: likedItems[activeItem.key] ? '#ff4b4b' : '#666' }}>{activeItem.likes || 0}</ThemeText>
                    </Pressable>
                    <Pressable 
                      style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}
                      onPress={(e) => {
                        e.stopPropagation();
                        setDescVisible(false);
                        const chatId = activeItem.chatGroupId || (activeItem.isProject ? activeItem.key : activeProjectId);
                        if (chatId) {
                          router.push({ 
                            pathname: "/chat/[id]", 
                            params: { 
                              id: chatId, 
                              title: activeItem.label || "Project Chat",
                              isGroup: "true" 
                            } 
                          });
                        } else {
                          Alert.alert("Chat", "No chat group associated with this item.");
                        }
                      }}
                    >
                      <Ionicons name="chatbubble-outline" size={18} color="#666" />
                      <ThemeText style={{ fontSize: 13, fontWeight: '700', color: '#666' }}>{activeItem.comments || 0}</ThemeText>
                    </Pressable>
                    <Pressable style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                      <Ionicons name="flag-outline" size={18} color="#666" />
                    </Pressable>
                  </View>`
);

// 8. Add the Social row below footer for selectedPopEntry popup
content = content.replace(
  /Created by \{activeItem\?\.ownerId === auth\.currentUser\?\.uid \? "You" : "Community Member"\}[\s\S]*?<\/ThemeText>\s*<\/View>\s*<View style=\{\{ flexDirection: 'row', alignItems: 'center', gap: 4 \}\}>\s*<ThemeText style=\{styles\.refFooterText\}>\{new Date\(selectedPopEntry\.createdAt\)\.toLocaleDateString[\s\S]*?<\/ThemeText>\s*<\/View>\s*\)\}\s*<\/Pressable>/,
  `$&
                      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start', gap: 16, marginTop: 12, paddingTop: 12, borderTopWidth: 1, borderColor: '#eee' }}>
                        <Pressable 
                          style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}
                          onPress={(e) => { 
                            e.stopPropagation(); 
                            const currentLikes = activeItem.likes || 0;
                            const isCurrentlyLiked = likedItems[activeItem.key];
                            const newLikes = isCurrentlyLiked ? Math.max(0, currentLikes - 1) : currentLikes + 1;
                            
                            const globalPath = activeItem.isProject ? \`projects/\${activeItem.key}\` : \`projectEntries/\${activeProjectId}/\${activeItem.key}\`;
                            const userPath = activeItem.isProject && activeItem.ownerId ? \`users/\${activeItem.ownerId}/projects/\${activeItem.key}\` : null;
                            
                            update(ref(db, globalPath), { likes: newLikes });
                            if (userPath) update(ref(db, userPath), { likes: newLikes });
                            setLikedItems(prev => ({...prev, [activeItem.key]: !isCurrentlyLiked}));
                          }}
                        >
                          <Ionicons name={likedItems[activeItem.key] ? "heart" : "heart-outline"} size={20} color={likedItems[activeItem.key] ? "#ff4b4b" : "#666"} />
                          <ThemeText style={{ fontSize: 13, fontWeight: '700', color: likedItems[activeItem.key] ? '#ff4b4b' : '#666' }}>{activeItem.likes || 0}</ThemeText>
                        </Pressable>
                        <Pressable 
                          style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}
                          onPress={(e) => {
                            e.stopPropagation();
                            if (activeItem.chatGroupId) {
                              router.push({ pathname: "/chat/[id]", params: { id: activeItem.chatGroupId, name: activeItem.label } });
                            } else {
                              Alert.alert("Chat", "No chat group associated with this project.");
                            }
                          }}
                        >
                          <Ionicons name="chatbubble-outline" size={18} color="#666" />
                          <ThemeText style={{ fontSize: 13, fontWeight: '700', color: '#666' }}>{activeItem.comments || 0}</ThemeText>
                        </Pressable>
                        <Pressable style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                          <Ionicons name="flag-outline" size={18} color="#666" />
                        </Pressable>
                      </View>`
);

fs.writeFileSync('app/MapScreen.tsx', content);

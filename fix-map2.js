const fs = require('fs');
let content = fs.readFileSync('app/MapScreen.tsx', 'utf8');

// 1. Remove old social row from BOTH popups (lines around refSocialRow)
content = content.replace(/<View style=\{styles\.refSocialRow\}>[\s\S]*?<Pressable style=\{styles\.refShareBtn\} onPress=\{\(e\) => \{ e\.stopPropagation\(\); handleShare\(activeItem\); \}\}>[\s\S]*?<\/Pressable>\s*<\/View>/, '');
content = content.replace(/<View style=\{styles\.refSocialRow\}>[\s\S]*?<Pressable style=\{styles\.refShareBtn\} onPress=\{\(\) => handleShare\(activeItem\)\}>[\s\S]*?<\/Pressable>\s*<\/View>/, '');

// 2. Change Category Pill for selectedPopEntry popup
content = content.replace(
  /<View style=\{\[styles\.popupCategoryBadge, \{ backgroundColor: selectedPopEntry\?\.color \|\| '#333', marginBottom: 0 \}\]\}>[\s\S]*?<\/View>/,
  '<View style={{ flex: 1 }} />'
);
content = content.replace(
  /<ThemeText style=\{styles\.popupTitle\}>\{selectedPopEntry\?\.name\}<\/ThemeText>/,
  
              <View style={{ flexDirection: 'row', alignSelf: 'flex-start', alignItems: 'center', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 12, backgroundColor: (selectedPopEntry?.color || '#333') + '20', marginBottom: 8 }}>
                <Ionicons name={(selectedPopEntry?.icon || "location") as any} size={16} color={selectedPopEntry?.color || '#333'} />
                <ThemeText style={{ color: selectedPopEntry?.color || '#333', fontWeight: '800', fontSize: 15, marginLeft: 6 }}>{selectedPopEntry?.name}</ThemeText>
              </View>

);

// 3. Change Category Pill for activeItem popup
content = content.replace(
  /<ThemeText style=\{styles\.refTitle\}>\{activeItem\.label\}<\/ThemeText>/,
  
                  <View style={{ flexDirection: 'row', alignSelf: 'flex-start', alignItems: 'center', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 12, backgroundColor: (activeItem.color || '#333') + '20', marginBottom: 8 }}>
                    <Ionicons name={activeItem.isProject ? (activeItem.icon || "map") : ((activeItem as any).icon || "location")} size={16} color={activeItem.color || '#333'} />
                    <ThemeText style={{ color: activeItem.color || '#333', fontWeight: '800', fontSize: 15, marginLeft: 6 }}>{activeItem.label}</ThemeText>
                  </View>

);

// 4. Add the Social row below footer for activeItem
content = content.replace(
  /Created by \{activeItem\?\.ownerId === auth\.currentUser\?\.uid \? "You" : "Community Member"\}[\s\S]*?<\/ThemeText>\s*<\/View>\s*<\/View>/,
  $&
                  <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start', gap: 16, marginTop: 12, paddingTop: 12, borderTopWidth: 1, borderColor: '#eee' }}>
                    <Pressable style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                      <Ionicons name="heart-outline" size={20} color="#666" />
                      <ThemeText style={{ fontSize: 13, fontWeight: '700', color: '#666' }}>{activeItem.likes || 0}</ThemeText>
                    </Pressable>
                    <Pressable style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                      <Ionicons name="chatbubble-outline" size={18} color="#666" />
                      <ThemeText style={{ fontSize: 13, fontWeight: '700', color: '#666' }}>{activeItem.comments || 0}</ThemeText>
                    </Pressable>
                    <Pressable style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                      <Ionicons name="flag-outline" size={18} color="#666" />
                    </Pressable>
                  </View>
);

// 5. Add the Social row below footer for selectedPopEntry popup
// Find the closing View tag of the refFooter in the first modal.
content = content.replace(
  /Created by \{activeItem\?\.ownerId === auth\.currentUser\?\.uid \? "You" : "Community Member"\}[\s\S]*?<\/ThemeText>\s*<\/View>\s*<View style=\{\{ flexDirection: 'row', alignItems: 'center', gap: 4 \}\}>\s*<ThemeText style=\{styles\.refFooterText\}>\{new Date\(selectedPopEntry\.createdAt\)\.toLocaleDateString[\s\S]*?<\/ThemeText>\s*<\/View>\s*\)\}\s*<\/Pressable>/,
  $&
                      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start', gap: 16, marginTop: 12, paddingTop: 12, borderTopWidth: 1, borderColor: '#eee' }}>
                        <Pressable style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                          <Ionicons name="heart-outline" size={20} color="#666" />
                          <ThemeText style={{ fontSize: 13, fontWeight: '700', color: '#666' }}>{activeItem.likes || 0}</ThemeText>
                        </Pressable>
                        <Pressable style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                          <Ionicons name="chatbubble-outline" size={18} color="#666" />
                          <ThemeText style={{ fontSize: 13, fontWeight: '700', color: '#666' }}>{activeItem.comments || 0}</ThemeText>
                        </Pressable>
                        <Pressable style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                          <Ionicons name="flag-outline" size={18} color="#666" />
                        </Pressable>
                      </View>
);

fs.writeFileSync('app/MapScreen.tsx', content);

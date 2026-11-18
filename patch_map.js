const fs = require('fs');

function applyChanges() {
  const filePath = 'app/MapScreen.tsx';
  let lines = fs.readFileSync(filePath, 'utf8').split('\n');
  
  // Helper to find index
  const findLineIndex = (searchString, startFrom = 0) => {
    if (startFrom === -1) return -1;
    for (let i = startFrom; i < lines.length; i++) {
      if (lines[i] !== undefined && lines[i].includes(searchString)) return i;
    }
    return -1;
  };

  // 1. Remove left chevron
  const chevronStart = findLineIndex('<Pressable onPress={scrollLeft}');
  const chevronEnd = findLineIndex('</Pressable>', chevronStart);
  if (chevronStart !== -1 && chevronEnd !== -1 && lines[chevronStart].includes('chevron-back')) {
    lines.splice(chevronStart, chevronEnd - chevronStart + 1);
  }

  // 2. Fix entries badge (location -> documents-outline)
  const entriesBadgeIdx = findLineIndex('<Ionicons name="location" size={14} color="#fff" />', findLineIndex('activeItem.members'));
  if (entriesBadgeIdx !== -1) {
    lines[entriesBadgeIdx] = lines[entriesBadgeIdx].replace('name="location"', 'name="documents-outline"');
  }

  // 3. Make Logos round and padding slim
  const projectListItemIdx = findLineIndex('projectListItem: { flexDirection: \'row\'');
  if (projectListItemIdx !== -1) {
    lines[projectListItemIdx] = lines[projectListItemIdx].replace('padding: 12', 'padding: 8');
  }
  const projectIconBoxIdx = findLineIndex('projectIconBox: { width: 44, height: 44');
  if (projectIconBoxIdx !== -1) {
    lines[projectIconBoxIdx] = lines[projectIconBoxIdx].replace('borderRadius: 12', 'borderRadius: 22');
  }

  // 4. selectedPopEntry popup
  // a) Replace Category Pill
  const popPillStart = findLineIndex('{[styles.popupCategoryBadge');
  const popPillEnd = findLineIndex('</View>', popPillStart);
  if (popPillStart !== -1 && popPillEnd !== -1) {
    lines.splice(popPillStart, popPillEnd - popPillStart + 1, '                <View style={{ flex: 1 }} />');
  }

  const popTitleIdx = findLineIndex('<ThemeText style={styles.popupTitle}>{selectedPopEntry?.name}</ThemeText>');
  if (popTitleIdx !== -1) {
    lines.splice(popTitleIdx, 1, 
      `              <View style={{ flexDirection: 'row', alignSelf: 'flex-start', alignItems: 'center', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 12, backgroundColor: (selectedPopEntry?.color || '#333') + '20', marginBottom: 8 }}>`,
      `                <Ionicons name={(selectedPopEntry?.icon || "location") as any} size={16} color={selectedPopEntry?.color || '#333'} />`,
      `                <ThemeText style={{ color: selectedPopEntry?.color || '#333', fontWeight: '800', fontSize: 15, marginLeft: 6 }}>{selectedPopEntry?.name}</ThemeText>`,
      `              </View>`
    );
  }

  // b) Add Social row at bottom of selectedPopEntry
  const selectedPopFooterEnd = findLineIndex('</ScrollView>', findLineIndex('Created by {activeItem?.ownerId'));
  if (selectedPopFooterEnd !== -1) {
    lines.splice(selectedPopFooterEnd, 0, 
      `                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start', gap: 16, marginTop: 12, paddingTop: 12, borderTopWidth: 1, borderColor: '#eee' }}>`,
      `                      <Pressable style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>`,
      `                        <Ionicons name="heart-outline" size={20} color="#666" />`,
      `                        <ThemeText style={{ fontSize: 13, fontWeight: '700', color: '#666' }}>{activeItem?.likes || 0}</ThemeText>`,
      `                      </Pressable>`,
      `                      <Pressable style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>`,
      `                        <Ionicons name="chatbubble-outline" size={18} color="#666" />`,
      `                        <ThemeText style={{ fontSize: 13, fontWeight: '700', color: '#666' }}>{activeItem?.comments || 0}</ThemeText>`,
      `                      </Pressable>`,
      `                      <Pressable style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>`,
      `                        <Ionicons name="flag-outline" size={18} color="#666" />`,
      `                      </Pressable>`,
      `                    </View>`
    );
  }

  // 5. activeItem popup
  // a) Replace Category Pill
  const activeTitleIdx = findLineIndex('<ThemeText style={styles.refTitle}>{activeItem.label}</ThemeText>');
  if (activeTitleIdx !== -1) {
    lines.splice(activeTitleIdx, 1, 
      `                  <View style={{ flexDirection: 'row', alignSelf: 'flex-start', alignItems: 'center', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 12, backgroundColor: (activeItem.color || '#333') + '20', marginBottom: 8 }}>`,
      `                    <Ionicons name={activeItem.isProject ? (activeItem.icon || "map") : ((activeItem as any).icon || "location")} size={16} color={activeItem.color || '#333'} />`,
      `                    <ThemeText style={{ color: activeItem.color || '#333', fontWeight: '800', fontSize: 15, marginLeft: 6 }}>{activeItem.label}</ThemeText>`,
      `                  </View>`
    );
  }

  // b) Remove old social row
  const oldSocialStart = activeTitleIdx !== -1 ? findLineIndex('<View style={styles.refSocialRow}>', activeTitleIdx) : -1;
  const oldSocialEnd = oldSocialStart !== -1 ? findLineIndex('</View>', findLineIndex('name="share-social-outline"', oldSocialStart)) + 1 : -1;
  if (oldSocialStart !== -1 && oldSocialEnd !== -1) {
    lines.splice(oldSocialStart, oldSocialEnd - oldSocialStart);
  }

  // c) Add Social row at bottom of activeItem
  const activeFooterEnd = oldSocialStart !== -1 ? findLineIndex('</ScrollView>', oldSocialStart) : -1;
  if (activeFooterEnd !== -1) {
    lines.splice(activeFooterEnd, 0, 
      `                  <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start', gap: 16, marginTop: 12, paddingTop: 12, borderTopWidth: 1, borderColor: '#eee' }}>`,
      `                    <Pressable style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>`,
      `                      <Ionicons name="heart-outline" size={20} color="#666" />`,
      `                      <ThemeText style={{ fontSize: 13, fontWeight: '700', color: '#666' }}>{activeItem?.likes || 0}</ThemeText>`,
      `                    </Pressable>`,
      `                    <Pressable style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>`,
      `                      <Ionicons name="chatbubble-outline" size={18} color="#666" />`,
      `                      <ThemeText style={{ fontSize: 13, fontWeight: '700', color: '#666' }}>{activeItem?.comments || 0}</ThemeText>`,
      `                    </Pressable>`,
      `                    <Pressable style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>`,
      `                      <Ionicons name="flag-outline" size={18} color="#666" />`,
      `                    </Pressable>`,
      `                  </View>`
    );
  }

  fs.writeFileSync(filePath, lines.join('\n'));
  console.log("Successfully patched");
}

applyChanges();

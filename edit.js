const fs = require('fs');
const file = 'app/project-info.tsx';
let content = fs.readFileSync(file, 'utf8');

const stateInject =     const [showAllCategories, setShowAllCategories] = useState(false);
    const [challengeModalVisible, setChallengeModalVisible] = useState(false);
    const [challengeTitle, setChallengeTitle] = useState("");
    const [challengeDuration, setChallengeDuration] = useState("1");
    const [challengeUnit, setChallengeUnit] = useState('Weeks');
;
content = content.replace("    const [showAllCategories, setShowAllCategories] = useState(false);", stateInject);

const logicInject =     const handleStartChallenge = async () => {
        if (!challengeTitle.trim() || !challengeDuration.trim()) {
            Alert.alert("Error", "Please enter a title and duration.");
            return;
        }
        
        let ms = 0;
        const d = parseInt(challengeDuration);
        if (isNaN(d) || d <= 0) {
            Alert.alert("Error", "Duration must be a valid number greater than 0.");
            return;
        }
        
        if (challengeUnit === 'Minutes') ms = d * 60 * 1000;
        else if (challengeUnit === 'Hours') ms = d * 60 * 60 * 1000;
        else if (challengeUnit === 'Weeks') ms = d * 7 * 24 * 60 * 60 * 1000;
        else if (challengeUnit === 'Years') ms = d * 365 * 24 * 60 * 60 * 1000;
        
        const now = Date.now();
        const expiresAt = now + ms;
        const id = Date.now().toString();
        
        const challengeData = {
            id,
            title: challengeTitle,
            status: "active",
            createdAt: now,
            expiresAt,
            categoryId: "", 
            subCategoryName: ""
        };
        
        try {
            const { ref, set } = require('firebase/database');
            await set(ref(db, \projects/\/activeChallenges/\\), challengeData);
            setChallengeModalVisible(false);
            setChallengeTitle("");
            setChallengeDuration("1");
            setChallengeUnit("Weeks");
        } catch (e) {
            Alert.alert("Error", "Failed to start challenge");
        }
    };

    const handleCancelChallenge = async (id) => {
        try {
            const { ref, update } = require('firebase/database');
            await update(ref(db, \projects/\/activeChallenges/\\), { status: "cancelled", expiresAt: Date.now() });
        } catch (e) {
            Alert.alert("Error", "Failed to cancel challenge");
        }
    };

;
content = content.replace("    const exportData =", logicInject + "    const exportData =");

content = content.replace('onPress={() => Alert.alert("Start Challenge", "Challenge creation flow is coming soon!")}', 'onPress={() => setChallengeModalVisible(true)}');

const modalJsx = 
            {/* Challenge Modal */}
            <Modal visible={challengeModalVisible} transparent animationType="slide">
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Start Challenge</Text>
                        
                        <Text style={styles.label}>Challenge Title</Text>
                        <TextInput
                            style={styles.input}
                            value={challengeTitle}
                            onChangeText={setChallengeTitle}
                            placeholder="e.g. Weekend Mapping Sprint"
                            placeholderTextColor={BW.muted}
                        />

                        <Text style={styles.label}>Duration</Text>
                        <View style={{ flexDirection: 'row', gap: 10 }}>
                            <TextInput
                                style={[styles.input, { flex: 1 }]}
                                value={challengeDuration}
                                onChangeText={setChallengeDuration}
                                keyboardType="numeric"
                            />
                            <View style={{ flex: 2, flexDirection: 'row', backgroundColor: BW.soft, borderRadius: 20, overflow: 'hidden' }}>
                                {['Minutes', 'Hours', 'Weeks', 'Years'].map(u => (
                                    <Pressable
                                        key={u}
                                        style={{ flex: 1, paddingVertical: 14, alignItems: 'center', backgroundColor: challengeUnit === u ? BW.btn : 'transparent' }}
                                        onPress={() => setChallengeUnit(u as any)}
                                    >
                                        <Text style={{ fontSize: 10, fontWeight: '800', color: challengeUnit === u ? BW.btnText : BW.muted }}>{u}</Text>
                                    </Pressable>
                                ))}
                            </View>
                        </View>

                        {project?.activeChallenges && Object.keys(project.activeChallenges).length > 0 && (
                            <View style={{ marginTop: 24, maxHeight: 150 }}>
                                <Text style={[styles.label, { marginBottom: 12 }]}>Challenge History</Text>
                                <ScrollView showsVerticalScrollIndicator={false}>
                                    {Object.values(project.activeChallenges).sort((a, b) => b.createdAt - a.createdAt).map((ch: any) => {
                                        const isActive = ch.status === 'active' && Date.now() < ch.expiresAt;
                                        return (
                                            <View key={ch.id} style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: BW.soft }}>
                                                <View style={{ flex: 1 }}>
                                                    <Text style={{ fontSize: 14, fontWeight: '800', color: BW.text }}>{ch.title}</Text>
                                                    <Text style={{ fontSize: 11, color: BW.muted, marginTop: 4 }}>
                                                        {isActive ? \Expires \\ : (ch.status === 'cancelled' ? 'Cancelled' : 'Completed')}
                                                    </Text>
                                                </View>
                                                {isActive && (
                                                    <Pressable style={{ padding: 8, backgroundColor: '#FEE2E2', borderRadius: 8 }} onPress={() => handleCancelChallenge(ch.id)}>
                                                        <Text style={{ fontSize: 11, fontWeight: '800', color: '#DC2626' }}>Cancel</Text>
                                                    </Pressable>
                                                )}
                                            </View>
                                        );
                                    })}
                                </ScrollView>
                            </View>
                        )}

                        <View style={styles.modalActions}>
                            <Pressable style={styles.cancelBtn} onPress={() => setChallengeModalVisible(false)}>
                                <Text style={styles.cancelText}>Close</Text>
                            </Pressable>
                            <Pressable style={styles.saveBtn} onPress={handleStartChallenge}>
                                <Text style={styles.saveText}>Start Challenge</Text>
                            </Pressable>
                        </View>
                    </View>
                </View>
            </Modal>
;
content = content.replace("        </SafeAreaView>", modalJsx + "\n        </SafeAreaView>");

fs.writeFileSync(file, content);

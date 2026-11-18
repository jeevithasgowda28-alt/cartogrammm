const fs = require('fs');
const file = 'app/project-info.tsx';
let content = fs.readFileSync(file, 'utf8');

// Find the duplicated section. The duplication starts at     const exportData = async () => {
// and repeats the exportData, handleGenerateInsights, loading check, return ProjectInfo UI up to </SafeAreaView>

const targetStart = "    const exportData = async () => {\r\n        try {\r\n            let csvContent = `Project Name:,\\n`;\r\n";
const parts = content.split(targetStart);

if (parts.length > 2) {
    // It was duplicated! parts[1] contains the first instance, parts[2] contains the second instance
    // Let's re-join parts[0], targetStart, and parts[1] up to the first occurrence of </SafeAreaView>
    
    // Actually, wait! The multi_replace file output showed it duplicated all the way from const exportData 
    // to the end of the if (!project) return null; check and the entire eturn (<SafeAreaView... block.
    // Let's just restore the file from the last working backup if there's any, or write a safe regex.
    
    // Let's find exactly where the first const exportData is.
    const firstIndex = content.indexOf('const exportData = async () => {');
    const secondIndex = content.indexOf('const exportData = async () => {', firstIndex + 1);
    
    if (secondIndex !== -1) {
        // Find what was duplicated
        // It looks like const exportData = async () => { was injected at line 638, right after </MapView>\n                            </View>\n                        )}\n
        
        const removeStart = secondIndex;
        // The original file ended with </SafeAreaView>\n    );\n}\n\nconst getStyles = ...
        // So the duplicated part probably goes up to the next const getStyles or something.
        
        // Let's just cut out the entire block from the second const exportData up to the next                 {/* SECTION 3: CATEGORIES */}
        
        let removeEnd = content.indexOf('{/* SECTION 3: CATEGORIES */}', removeStart);
        if (removeEnd !== -1) {
            content = content.substring(0, removeStart) + content.substring(removeEnd);
            fs.writeFileSync(file, content, 'utf8');
            console.log("Fixed duplication!");
        } else {
            console.log("Could not find section 3 categories after second export data");
        }
    }
}

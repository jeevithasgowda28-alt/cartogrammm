const fs = require('fs');
const path = require('path');

function processFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let originalContent = content;

  // We only care if the file imports Text or TextInput from react-native
  const rnImportRegex = /import\s+{([^}]*)}\s+from\s+['"]react-native['"];/g;
  let match;
  let needsText = false;
  let needsTextInput = false;
  
  // We'll just check if Text or TextInput are used as components first
  if (content.includes('<Text') || content.includes('</Text>')) needsText = true;
  if (content.includes('<TextInput') || content.includes('</TextInput>')) needsTextInput = true;

  if (!needsText && !needsTextInput) return;

  // Replace component tags
  if (needsText) {
    content = content.replace(/<Text(\s|>)/g, '<ThemeText$1');
    content = content.replace(/<\/Text>/g, '</ThemeText>');
  }
  if (needsTextInput) {
    content = content.replace(/<TextInput(\s|>)/g, '<ThemeTextInput$1');
    content = content.replace(/<\/TextInput>/g, '</ThemeTextInput>');
  }

  // Update react-native imports
  let newRnImportReplaced = false;
  content = content.replace(rnImportRegex, (fullMatch, importList) => {
    let imports = importList.split(',').map(i => i.trim());
    
    // Remove Text and TextInput from react-native import
    imports = imports.filter(i => i !== 'Text' && i !== 'TextInput');
    
    if (imports.length === 0) {
      newRnImportReplaced = true;
      return ''; // Remove the whole import line if it's empty
    }
    newRnImportReplaced = true;
    return `import { ${imports.join(', ')} } from 'react-native';`;
  });

  // Calculate relative path to components
  const componentsDir = path.resolve(__dirname, 'components');
  let relativePath = path.relative(path.dirname(filePath), componentsDir);
  if (!relativePath.startsWith('.')) relativePath = './' + relativePath;
  relativePath = relativePath.replace(/\\/g, '/'); // Normalize slashes for imports

  // Add new imports
  let newImports = [];
  if (needsText) newImports.push(`import { ThemeText } from '${relativePath}/ThemeText';`);
  if (needsTextInput) newImports.push(`import { ThemeTextInput } from '${relativePath}/ThemeTextInput';`);
  
  if (newImports.length > 0) {
    // Insert new imports after the last import statement
    const lastImportIndex = content.lastIndexOf('import ');
    if (lastImportIndex !== -1) {
      const endOfLine = content.indexOf('\n', lastImportIndex);
      content = content.slice(0, endOfLine + 1) + newImports.join('\n') + '\n' + content.slice(endOfLine + 1);
    } else {
      content = newImports.join('\n') + '\n\n' + content;
    }
  }

  if (content !== originalContent) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Updated: ${filePath}`);
  }
}

function walkDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      if (file !== 'node_modules' && file !== '.expo') {
        walkDir(fullPath);
      }
    } else if (fullPath.endsWith('.tsx') && !fullPath.includes('ThemeText.tsx') && !fullPath.includes('ThemeTextInput.tsx') && !fullPath.includes('ThemeContext.tsx') && !fullPath.includes('_layout.tsx')) {
      processFile(fullPath);
    }
  }
}

walkDir(path.resolve(__dirname, 'app'));
walkDir(path.resolve(__dirname, 'components'));

console.log('Migration complete.');

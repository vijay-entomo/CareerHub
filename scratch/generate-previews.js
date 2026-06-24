const fs = require('fs');
const path = require('path');

const homePath = path.join(__dirname, '../src/app/(tabs)/home.tsx');
let homeRaw = fs.readFileSync(homePath, 'utf-8');

function createVariant(code, tabName) {
  return code.replace('export default function Home()', `export default function ${tabName}()`);
}

// ==========================================
// OPTION 1: CAREER (App Drawer)
// ==========================================
let careerCode = createVariant(homeRaw, 'Career');
careerCode = careerCode.replace('<MeshGradient />', 
  `{/* Dynamic Colored Top Block */}\n      <View style={[StyleSheet.absoluteFill, { backgroundColor: BANNER_DATA[activeIndex].bgColor, height: 450 }]} />`
);
// Make the header transparent
careerCode = careerCode.replace(
  `<BlurView intensity={80} tint="light" style={styles.fixedHeader}>`,
  `<View style={[styles.fixedHeader, { backgroundColor: 'transparent', borderWidth: 0 }]}>`
);
// ONLY replace the </BlurView> right before <ScrollView
careerCode = careerCode.replace(
  `</SafeAreaView>\n      </BlurView>\n\n      <ScrollView`,
  `</SafeAreaView>\n      </View>\n\n      <ScrollView`
);
// Make banner cards completely transparent
careerCode = careerCode.replace(
  '{ backgroundColor: bannerBg, marginRight: 16 }',
  '{ backgroundColor: "transparent", marginRight: 16, elevation: 0 }'
);
// Wrap feed in App Drawer
careerCode = careerCode.replace(
  '{/* Announcements Section */}',
  `<View style={{ backgroundColor: theme.background, borderTopLeftRadius: 40, borderTopRightRadius: 40, paddingTop: 32, marginTop: -20, paddingHorizontal: 0, paddingBottom: 100 }}>\n        {/* Announcements Section */}`
);
careerCode = careerCode.replace(
  '        {/* End of Feed Element */}\n        <View style={styles.endOfFeedContainer}>', 
  '        {/* End of Feed Element */}\n        <View style={styles.endOfFeedContainer}>'
);
careerCode = careerCode.replace(
  '        </View>\n      </ScrollView>\n    </View>',
  '        </View>\n      </View>\n      </ScrollView>\n    </View>'
);

// ==========================================
// OPTION 2: LEARN (Dynamic Glass Sync)
// ==========================================
let learnCode = createVariant(homeRaw, 'Learn');
learnCode = learnCode.replace(
  `<BlurView intensity={80} tint="light" style={styles.fixedHeader}>`,
  `{/* Dynamic Glass Header tied to active banner */}\n      <BlurView intensity={theme.mode === 'dark' ? 40 : 80} tint={theme.mode === 'dark' ? 'dark' : 'light'} style={[styles.fixedHeader, { backgroundColor: BANNER_DATA[activeIndex].bgColor + (theme.mode === 'dark' ? '60' : '40'), borderColor: BANNER_DATA[activeIndex].bgColor }]}>`
);

// ==========================================
// OPTION 3: MORE (Hero Image Bleed)
// ==========================================
let moreCode = createVariant(homeRaw, 'More');
moreCode = moreCode.replace('<MeshGradient />', 
  `{/* Hero Bleed Background */}\n      <View style={[StyleSheet.absoluteFill, { backgroundColor: BANNER_DATA[activeIndex].bgColor, height: 380 }]} />`
);
moreCode = moreCode.replace(
  '{ backgroundColor: bannerBg, marginRight: 16 }',
  '{ backgroundColor: "transparent", marginRight: 16 }'
);
moreCode = moreCode.replace(
  `<BlurView intensity={80} tint="light" style={styles.fixedHeader}>`,
  `<View style={[styles.fixedHeader, { backgroundColor: 'transparent', borderWidth: 0 }]}>`
);
moreCode = moreCode.replace(
  `</SafeAreaView>\n      </BlurView>\n\n      <ScrollView`,
  `</SafeAreaView>\n      </View>\n\n      <ScrollView`
);

fs.writeFileSync(path.join(__dirname, '../src/app/(tabs)/career.tsx'), careerCode);
fs.writeFileSync(path.join(__dirname, '../src/app/(tabs)/learn.tsx'), learnCode);
fs.writeFileSync(path.join(__dirname, '../src/app/(tabs)/more.tsx'), moreCode);

console.log("Successfully regenerated all 3 previews!");

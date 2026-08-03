import { useCommonStyles } from "@/hooks/use-common-styles";
import { useTheme } from "@/hooks/use-theme";
import React, { useState } from "react";
import { View, Text, Pressable, StyleSheet, ScrollView, Modal } from "react-native";
import { Bookmark, ChevronRight, Plus, Building2, Trash2 } from "lucide-react-native";
import { Header } from "../../components/Header";

import Animated, { useSharedValue, useAnimatedScrollHandler, Easing } from "react-native-reanimated";
import Svg, { Polygon } from 'react-native-svg';
import { MotiView } from 'moti';

export default function PathDetails() {
  const commonStyles = useCommonStyles();
  const theme = useTheme();
  const scrollY = useSharedValue(0);
  const [activeTab, setActiveTab] = useState(0);
  const [isOverviewExpanded, setIsOverviewExpanded] = useState(false);
  const [skillModal, setSkillModal] = useState<{ visible: boolean; skill: string; isAdded: boolean }>({ visible: false, skill: '', isAdded: false });
  const [addedSkills, setAddedSkills] = useState([
    'Python Programming', 'Machine Learning Basics', 'Data Preprocessing', 'Model Training & Evaluation', 'SQL & Database', 'Git & Version Control', 'TensorFlow / PyTorch', 'Communication Skills'
  ].map(name => ({ name, level: 'Beginner' })));
  const [pendingSkills, setPendingSkills] = useState(['Advanced Model Optimization', 'Production ML Systems', 'Monitoring & Observability']);

  const PROFICIENCY_COLORS = {
    Beginner: { base: '#4ADE80', bg: 'rgba(74, 222, 128, 0.1)', border: 'rgba(74, 222, 128, 0.2)' },
    Intermediate: { base: '#60A5FA', bg: 'rgba(96, 165, 250, 0.1)', border: 'rgba(96, 165, 250, 0.2)' },
    Advanced: { base: '#A78BFA', bg: 'rgba(167, 139, 250, 0.1)', border: 'rgba(167, 139, 250, 0.2)' },
    Expert: { base: '#FACC15', bg: 'rgba(250, 204, 21, 0.1)', border: 'rgba(250, 204, 21, 0.2)' },
  };

  const openSkillModal = (skill: string, isAdded: boolean) => {
    setSkillModal({ visible: true, skill, isAdded });
  };
  
  const closeSkillModal = () => {
    setSkillModal(prev => ({ ...prev, visible: false }));
  };

  const handleSelectProficiency = (level: string) => {
    if (!skillModal.isAdded) {
      setPendingSkills(prev => prev.filter(s => s !== skillModal.skill));
      setAddedSkills(prev => [...prev, { name: skillModal.skill, level }]);
    } else {
      setAddedSkills(prev => prev.map(s => s.name === skillModal.skill ? { ...s, level } : s));
    }
    closeSkillModal();
  };

  const handleRemoveSkill = () => {
    if (skillModal.isAdded) {
      setAddedSkills(prev => prev.filter(s => s.name !== skillModal.skill));
      setPendingSkills(prev => [...prev, skillModal.skill]);
    }
    closeSkillModal();
  };

  const ROLES = [
    "NLP Engineer",
    "Senior NLP Engineer",
    "ML Engineer (LLM Focus)",
    "NLP Research Scientist",
    "LLM Fine-tuning Specialist"
  ];

  const handleScroll = useAnimatedScrollHandler((event) => {
    scrollY.value = event.contentOffset.y;
  });

  return (
    <View style={commonStyles.container}>
      <Header 
        title="Career Path" 
        showBack={true} 
        scrollY={scrollY} 
        rightComponent={
          <Pressable style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: theme.mode === 'dark' ? 'rgba(255,255,255,0.08)' : 'rgba(15,23,42,0.05)', paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20, borderWidth: 1, borderColor: theme.mode === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(15,23,42,0.1)' }}>
            <Text style={{ fontFamily: theme.fonts.bold, fontWeight: 'bold', fontSize: 13, color: theme.text, marginRight: 6 }}>Save Path</Text>
            <Bookmark size={14} color={theme.text} />
          </Pressable>
        }
      />

      <Animated.ScrollView
        onScroll={handleScroll}
        scrollEventThrottle={16}
        contentContainerStyle={commonStyles.scrollContentFullBleed}
      >
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 24 }}>
          {ROLES.map((role, i) => {
            const isActive = activeTab === i;
            const isFirst = i === 0;
            const isLast = i === ROLES.length - 1;
            const height = 36;
            const arrowWidth = 12;
            const gap = 3;
            const bgColor = isActive ? '#FACC15' : (theme.mode === 'dark' ? '#1E1E2D' : '#F1F5F9');
            const textColor = isActive ? '#111827' : theme.textSecondary;

            return (
              <Pressable
                key={i}
                onPress={() => setActiveTab(i)}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginLeft: isFirst ? 0 : -(arrowWidth - gap),
                }}
              >
                {/* Left SVG Cutout */}
                {!isFirst && (
                  <Svg width={arrowWidth} height={height}>
                    <Polygon points={`0,0 ${arrowWidth},0 ${arrowWidth},${height} 0,${height} ${arrowWidth},${height/2}`} fill={bgColor} />
                  </Svg>
                )}

                {/* Main Body */}
                <View style={{
                  height,
                  backgroundColor: bgColor,
                  paddingLeft: isFirst ? 16 : 8,
                  paddingRight: isLast ? 16 : 8,
                  justifyContent: 'center',
                  borderTopLeftRadius: isFirst ? 18 : 0,
                  borderBottomLeftRadius: isFirst ? 18 : 0,
                  borderTopRightRadius: isLast ? 18 : 0,
                  borderBottomRightRadius: isLast ? 18 : 0,
                }}>
                  <Text style={{ fontFamily: isActive ? theme.fonts.bold : theme.fonts.medium, fontWeight: isActive ? "bold" : "500", fontWeight: isActive ? 'bold' : '500', fontSize: 13, color: textColor }}>
                    {role}
                  </Text>
                </View>

                {/* Right Arrow */}
                {!isLast && (
                  <Svg width={arrowWidth} height={height}>
                    <Polygon points={`0,0 ${arrowWidth},${height/2} 0,${height}`} fill={bgColor} />
                  </Svg>
                )}
              </Pressable>
            );
          })}
        </ScrollView>

        <View style={{ paddingHorizontal: 20 }}>
          {/* Title Card */}
          <View style={[commonStyles.card, { padding: 24, marginBottom: 16, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }]}>
            <View style={{ flex: 1 }}>
              <Text style={{ fontFamily: theme.fonts.bold, fontWeight: "bold", fontWeight: 'bold', fontSize: 24, color: theme.text, marginBottom: 4 }}>
                {ROLES[activeTab]}
              </Text>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <View style={{ backgroundColor: 'rgba(34, 197, 94, 0.1)', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 }}>
                  <Text style={{ fontFamily: theme.fonts.bold, fontWeight: "bold", fontWeight: 'bold', fontSize: 16, color: '#22C55E' }}>94% Match</Text>
                </View>
              </View>
            </View>
          </View>

        {/* Role Overview */}
        <View style={[commonStyles.card, { padding: 24, marginBottom: 16 }]}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <Text style={{ fontFamily: theme.fonts.bold, fontWeight: "bold", fontSize: 18, color: theme.text }}>Role Overview</Text>
            <Pressable onPress={() => setIsOverviewExpanded(!isOverviewExpanded)}>
              <Text style={{ fontFamily: theme.fonts.medium, fontWeight: "500", fontSize: 14, color: theme.textSecondary }}>
                {isOverviewExpanded ? "Read Less" : "Read More"}
              </Text>
            </Pressable>
          </View>
          <Text style={{ fontFamily: theme.fonts.regular, fontWeight: "normal", fontSize: 15, color: theme.textSecondary, lineHeight: 24, marginBottom: isOverviewExpanded ? 16 : 0 }}>
            As an AI/ML Engineer, you're entering the field ready to absorb best practices, machine learning algorithms, and development patterns. Your focus is building ML models and learning the machine learning lifecycle.
          </Text>
          
          {isOverviewExpanded && (
            <MotiView
              from={{ opacity: 0, translateY: -8 }}
              animate={{ opacity: 1, translateY: 0 }}
              transition={{ type: "timing", duration: 250, easing: Easing.out(Easing.ease) }}
            >
              <Text style={{ fontFamily: theme.fonts.regular, fontWeight: "normal", fontSize: 15, color: theme.textSecondary, lineHeight: 24, marginBottom: 16 }}>
                Companies expect AI/ML Engineers to demonstrate problem-solving skills and a proactive learning attitude while working with mentors. This role offers exposure to data preprocessing, model training, and deployment.
              </Text>
              <Text style={{ fontFamily: theme.fonts.regular, fontWeight: "normal", fontSize: 15, color: theme.textSecondary, lineHeight: 24 }}>
                You will collaborate closely with Data Scientists and Data Engineers to operationalize models and ensure they meet performance and scalability requirements in production environments.
              </Text>
            </MotiView>
          )}
        </View>

        {/* Market Insights */}
        <View style={[commonStyles.card, { padding: 24, marginBottom: 16 }]}>
          <Text style={{ fontFamily: theme.fonts.bold, fontWeight: "bold", fontWeight: 'bold', fontSize: 18, color: theme.text, marginBottom: 16 }}>Market Insights</Text>
          <Text style={{ fontFamily: theme.fonts.medium, fontWeight: "500", fontWeight: '500', fontSize: 12, color: theme.textSecondary, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 }}>Average Salary Range</Text>
          <View style={{ flexDirection: 'row', alignItems: 'baseline', marginBottom: 12 }}>
            <Text style={{ fontFamily: theme.fonts.black, fontWeight: "900", fontWeight: '900', fontSize: 32, color: theme.text }}>₱500K</Text>
            <Text style={{ fontFamily: theme.fonts.medium, fontWeight: "500", fontWeight: '500', fontSize: 16, color: theme.textSecondary, marginHorizontal: 8 }}>to</Text>
            <Text style={{ fontFamily: theme.fonts.black, fontWeight: "900", fontWeight: '900', fontSize: 32, color: '#FACC15' }}>₱800K</Text>
            <Text style={{ fontFamily: theme.fonts.medium, fontWeight: "500", fontWeight: '500', fontSize: 16, color: theme.textSecondary, marginLeft: 4 }}>/year</Text>
          </View>
          <View style={{ height: 6, backgroundColor: theme.mode === 'dark' ? 'rgba(255,255,255,0.1)' : '#E2E8F0', borderRadius: 3, marginBottom: 16 }}>
            <View style={{ position: 'absolute', left: '10%', right: '20%', top: -2, bottom: -2, backgroundColor: '#FACC15', borderRadius: 4 }} />
            <View style={{ position: 'absolute', left: '10%', top: -6, bottom: -6, width: 4, backgroundColor: theme.text, borderRadius: 2 }} />
            <View style={{ position: 'absolute', right: '20%', top: -6, bottom: -6, width: 4, backgroundColor: theme.text, borderRadius: 2 }} />
          </View>
          <Text style={{ fontFamily: theme.fonts.regular, fontWeight: "normal", fontWeight: 'normal', fontSize: 12, color: theme.textSecondary }}>This content is generated by AI and may contain historical data</Text>
        </View>

        {/* Required Skills */}
        <View style={[commonStyles.card, { padding: 24, marginBottom: 16 }]}>
          <Text style={{ fontFamily: theme.fonts.bold, fontWeight: "bold", fontWeight: 'bold', fontSize: 18, color: theme.text, marginBottom: 16 }}>Required Skills</Text>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10 }}>
            {addedSkills.map((skillObj, i) => {
              const p = PROFICIENCY_COLORS[skillObj.level as keyof typeof PROFICIENCY_COLORS] || PROFICIENCY_COLORS.Beginner;
              return (
                <Pressable key={i} onPress={() => openSkillModal(skillObj.name, true)} style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: p.bg, paddingHorizontal: 12, paddingVertical: 8, borderRadius: 20, borderWidth: 1, borderColor: p.border }}>
                  <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: p.base, marginRight: 8 }} />
                  <Text style={{ fontFamily: theme.fonts.medium, fontWeight: "500", fontSize: 13, color: theme.mode === 'dark' ? '#E2E8F0' : '#111827' }}>{skillObj.name}</Text>
                </Pressable>
              );
            })}
            {pendingSkills.map((skill, i) => (
              <Pressable key={i} onPress={() => openSkillModal(skill, false)} style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: theme.mode === 'dark' ? 'rgba(255,255,255,0.05)' : '#F1F5F9', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 20, borderWidth: 1, borderColor: theme.mode === 'dark' ? 'rgba(255,255,255,0.1)' : '#E2E8F0' }}>
                <Text style={{ fontFamily: theme.fonts.medium, fontWeight: "500", fontSize: 13, color: theme.text, marginRight: 6 }}>{skill}</Text>
                <Plus size={14} color={theme.textSecondary} />
              </Pressable>
            ))}
          </View>
        </View>

        {/* Traditional Responsibilities */}
        <View style={[commonStyles.card, { padding: 24, marginBottom: 16 }]}>
          <Text style={{ fontFamily: theme.fonts.bold, fontWeight: "bold", fontWeight: 'bold', fontSize: 18, color: theme.text, marginBottom: 20 }}>Traditional Responsibilities</Text>
          {[
            { title: 'Data Preparation', desc: 'Cleaning, transforming, and preparing datasets for model training under senior engineer supervision.' },
            { title: 'Model Development', desc: 'Building and training ML models using frameworks like TensorFlow and scikit-learn with guidance from team leads.' },
            { title: 'Model Evaluation', desc: 'Testing model performance using appropriate metrics and identifying areas for improvement.' },
            { title: 'Documentation', desc: 'Maintaining clear documentation of code, model architecture, and experimental results for team knowledge sharing.' },
            { title: 'Collaboration', desc: 'Working with data engineers and senior ML engineers to understand requirements and deliver solutions.' },
          ].map((item, i) => (
            <View key={i} style={{ marginBottom: i === 4 ? 0 : 20 }}>
              <Text style={{ fontFamily: theme.fonts.bold, fontWeight: "bold", fontWeight: 'bold', fontSize: 15, color: theme.text, marginBottom: 6 }}>{item.title}</Text>
              <Text style={{ fontFamily: theme.fonts.regular, fontWeight: "normal", fontWeight: 'normal', fontSize: 14, color: theme.textSecondary, lineHeight: 20 }}>{item.desc}</Text>
            </View>
          ))}
        </View>

        {/* Recommended Courses */}
        <View style={[commonStyles.card, { padding: 24, marginBottom: 16 }]}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
            <Text style={{ fontFamily: theme.fonts.bold, fontWeight: "bold", fontWeight: 'bold', fontSize: 18, color: theme.text }}>Recommended Courses</Text>
            <Pressable><Text style={{ fontFamily: theme.fonts.medium, fontWeight: "500", fontWeight: '500', fontSize: 14, color: theme.textSecondary }}>View All</Text></Pressable>
          </View>
          {[
            { title: 'Advanced Model Optimization', users: '5k+ Professionals', desc: 'Model Optimization' },
            { title: 'Production ML Systems', users: '3k+ Professionals', desc: 'MLOps & ML Infrastructure' },
            { title: 'Monitoring & Model Observability', users: '4k+ Professionals', desc: 'Machine Learning Systems' },
          ].map((course, i) => (
            <Pressable key={i} style={{ flexDirection: 'row', alignItems: 'center', marginBottom: i === 2 ? 0 : 20, paddingBottom: i === 2 ? 0 : 20, borderBottomWidth: i === 2 ? 0 : 1, borderBottomColor: theme.mode === 'dark' ? 'rgba(255,255,255,0.05)' : '#F1F5F9' }}>
              <View style={{ flex: 1 }}>
                <Text style={{ fontFamily: theme.fonts.bold, fontWeight: "bold", fontWeight: 'bold', fontSize: 16, color: theme.text, marginBottom: 6 }}>{course.title}</Text>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Text style={{ fontFamily: theme.fonts.medium, fontWeight: "500", fontWeight: '500', fontSize: 13, color: '#FACC15', marginRight: 8 }}>{course.users}</Text>
                  <View style={{ width: 4, height: 4, borderRadius: 2, backgroundColor: theme.textSecondary, marginRight: 8 }} />
                  <Text style={{ fontFamily: theme.fonts.regular, fontWeight: "normal", fontWeight: 'normal', fontSize: 13, color: theme.textSecondary }}>{course.desc}</Text>
                </View>
              </View>
              <ChevronRight size={20} color={theme.textSecondary} />
            </Pressable>
          ))}
        </View>

        {/* Recommended Jobs */}
        <View style={[commonStyles.card, { padding: 24, marginBottom: 16 }]}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
            <Text style={{ fontFamily: theme.fonts.bold, fontWeight: "bold", fontWeight: 'bold', fontSize: 18, color: theme.text }}>Recommended Jobs</Text>
            <Pressable><Text style={{ fontFamily: theme.fonts.medium, fontWeight: "500", fontWeight: '500', fontSize: 14, color: theme.textSecondary }}>View All</Text></Pressable>
          </View>
          {[
            { title: 'AI/ML Engineer', company: 'Google', date: '3/29/2026', match: 'High' },
            { title: 'Junior Machine Learning Engineer', company: 'Amazon', date: '4/01/2026', match: 'High' },
            { title: 'AI/ML Engineer', company: 'Microsoft', date: '4/03/2026', match: 'High' },
          ].map((job, i) => (
            <Pressable key={i} style={{ flexDirection: 'row', alignItems: 'center', marginBottom: i === 2 ? 0 : 20, paddingBottom: i === 2 ? 0 : 20, borderBottomWidth: i === 2 ? 0 : 1, borderBottomColor: theme.mode === 'dark' ? 'rgba(255,255,255,0.05)' : '#F1F5F9' }}>
              <View style={{ width: 48, height: 48, borderRadius: 12, backgroundColor: theme.mode === 'dark' ? '#2D2D3D' : '#F8FAFC', justifyContent: 'center', alignItems: 'center', marginRight: 16 }}>
                <Building2 size={24} color={theme.textSecondary} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{ fontFamily: theme.fonts.medium, fontWeight: "500", fontWeight: '500', fontSize: 13, color: theme.textSecondary, marginBottom: 4 }}>{job.company}</Text>
                <Text style={{ fontFamily: theme.fonts.bold, fontWeight: "bold", fontWeight: 'bold', fontSize: 16, color: theme.text }}>{job.title}</Text>
                <Text style={{ fontFamily: theme.fonts.regular, fontWeight: "normal", fontWeight: 'normal', fontSize: 12, color: theme.textSecondary, marginTop: 4 }}>Posted on: {job.date}</Text>
              </View>
              <View style={{ alignItems: 'flex-end' }}>
                <Text style={{ fontFamily: theme.fonts.black, fontWeight: "900", fontWeight: '900', fontSize: 16, color: theme.text }}>{job.match}</Text>
                <Text style={{ fontFamily: theme.fonts.medium, fontWeight: "500", fontWeight: '500', fontSize: 11, color: theme.textSecondary, marginBottom: 8 }}>Match</Text>
                <ChevronRight size={16} color={theme.textSecondary} />
              </View>
            </Pressable>
          ))}
        </View>

        </View>
      </Animated.ScrollView>

      {/* Skill Proficiency Modal */}
      <Modal visible={skillModal.visible} transparent animationType="fade" onRequestClose={closeSkillModal}>
        <Pressable style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center', padding: 24 }} onPress={closeSkillModal}>
          <Pressable style={[commonStyles.card, { width: '100%', maxWidth: 360, padding: 24, backgroundColor: theme.mode === 'dark' ? '#1E1E2D' : '#FFFFFF' }]} onPress={(e) => e.stopPropagation()}>
            <Text style={{ fontFamily: theme.fonts.medium, fontSize: 16, color: theme.textSecondary, marginBottom: 16 }}>
              Proficiency for {skillModal.skill}
            </Text>
            
            {[
              { label: "Beginner", color: "#4ADE80" },
              { label: "Intermediate", color: "#60A5FA" },
              { label: "Advanced", color: "#A78BFA" },
              { label: "Expert", color: "#FACC15" },
            ].map((level, i) => (
              <Pressable key={i} style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 12 }} onPress={() => handleSelectProficiency(level.label)}>
                <View style={{ width: 14, height: 14, borderRadius: 7, backgroundColor: level.color, marginRight: 16 }} />
                <Text style={{ fontFamily: theme.fonts.medium, fontSize: 18, color: theme.text }}>{level.label}</Text>
              </Pressable>
            ))}

            {skillModal.isAdded && (
              <>
                <View style={{ height: 1, backgroundColor: theme.mode === 'dark' ? 'rgba(255,255,255,0.1)' : '#E2E8F0', marginVertical: 12 }} />
                <Pressable style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 12 }} onPress={handleRemoveSkill}>
                  <Trash2 size={20} color="#EF4444" style={{ marginRight: 16 }} />
                  <Text style={{ fontFamily: theme.fonts.medium, fontSize: 18, color: "#EF4444" }}>Remove</Text>
                </Pressable>
              </>
            )}
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
}

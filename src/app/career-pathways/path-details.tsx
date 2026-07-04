import { useCommonStyles } from "@/hooks/use-common-styles";
import { useTheme } from "@/hooks/use-theme";
import React, { useState } from "react";
import { View, Text, Pressable, StyleSheet, ScrollView } from "react-native";
import { Bookmark, ChevronRight, Plus, Building2 } from "lucide-react-native";
import { Header } from "../../components/Header";
import Animated, { useSharedValue, useAnimatedScrollHandler } from "react-native-reanimated";
import Svg, { Polygon } from 'react-native-svg';

export default function PathDetails() {
  const commonStyles = useCommonStyles();
  const theme = useTheme();
  const scrollY = useSharedValue(0);
  const [activeTab, setActiveTab] = useState(0);

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
          <Pressable style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(250, 204, 21, 0.15)', paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20, borderWidth: 1, borderColor: 'rgba(250, 204, 21, 0.3)' }}>
            <Text style={{ fontFamily: theme.fonts.bold, fontWeight: "bold", fontWeight: 'bold', fontSize: 13, color: '#FACC15', marginRight: 6 }}>Save Path</Text>
            <Bookmark size={14} color="#FACC15" />
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
            <Text style={{ fontFamily: theme.fonts.bold, fontWeight: "bold", fontWeight: 'bold', fontSize: 18, color: theme.text }}>Role Overview</Text>
            <Pressable><Text style={{ fontFamily: theme.fonts.medium, fontWeight: "500", fontWeight: '500', fontSize: 14, color: theme.textSecondary }}>View All</Text></Pressable>
          </View>
          <Text style={{ fontFamily: theme.fonts.regular, fontWeight: "normal", fontWeight: 'normal', fontSize: 15, color: theme.textSecondary, lineHeight: 24, marginBottom: 16 }}>
            As an AI/ML Engineer, you're entering the field ready to absorb best practices, machine learning algorithms, and development patterns. Your focus is building ML models and learning the machine learning lifecycle.
          </Text>
          <Text style={{ fontFamily: theme.fonts.regular, fontWeight: "normal", fontWeight: 'normal', fontSize: 15, color: theme.textSecondary, lineHeight: 24 }}>
            Companies expect AI/ML Engineers to demonstrate problem-solving skills and a proactive learning attitude while working with mentors. This role offers exposure to data preprocessing, model training, and deployment.
          </Text>
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
            {['Python Programming', 'Machine Learning Basics', 'Data Preprocessing', 'Model Training & Evaluation', 'SQL & Database', 'Git & Version Control', 'TensorFlow / PyTorch', 'Communication Skills'].map((skill, i) => (
              <View key={i} style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(34, 197, 94, 0.1)', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 20, borderWidth: 1, borderColor: 'rgba(34, 197, 94, 0.2)' }}>
                <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: '#22C55E', marginRight: 8 }} />
                <Text style={{ fontFamily: theme.fonts.medium, fontWeight: "500", fontWeight: '500', fontSize: 13, color: theme.mode === 'dark' ? '#E2E8F0' : '#111827' }}>{skill}</Text>
              </View>
            ))}
            {['Advanced Model Optimization', 'Production ML Systems', 'Monitoring & Observability'].map((skill, i) => (
              <View key={i} style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: theme.mode === 'dark' ? 'rgba(255,255,255,0.05)' : '#F1F5F9', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 20, borderWidth: 1, borderColor: theme.mode === 'dark' ? 'rgba(255,255,255,0.1)' : '#E2E8F0' }}>
                <Text style={{ fontFamily: theme.fonts.medium, fontWeight: "500", fontWeight: '500', fontSize: 13, color: theme.text, marginRight: 6 }}>{skill}</Text>
                <Plus size={14} color={theme.textSecondary} />
              </View>
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
    </View>
  );
}

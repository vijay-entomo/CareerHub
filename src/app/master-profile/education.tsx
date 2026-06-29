import { Button } from "@/components/Button";
import { Checkbox } from "@/components/Checkbox";
import { FormActionRow } from "@/components/FormActionRow";
import { EmptyState } from "@/components/EmptyState";
import { Input } from "@/components/Input";
import { BorderRadius } from "@/constants/theme";
import { useCommonStyles } from "@/hooks/use-common-styles";
import { useTheme } from "@/hooks/use-theme";
import {
  Calendar,
  Check,
  ChevronDown,
  ChevronUp,
  GraduationCap,
  Pencil,
  Plus,
  Trash2,
} from "lucide-react-native";
import { AnimatePresence, MotiView } from "moti";
import { useEffect, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { Swipeable } from "react-native-gesture-handler";
import Animated, {
  FadeIn,
  FadeOut,
  FadeInDown,
  FadeOutUp,
  LinearTransition,
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";

type EducationItem = {
  id: string;
  institution: string;
  degree: string;
  fieldOfStudy: string;
  specialization?: string;
  startDate: string;
  endDate?: string;
  current: boolean;
};

const AccordionItem = ({
  edu,
  isExpanded,
  onToggle,
  onDelete,
  onEdit,
  theme,
  styles,
}: {
  edu: EducationItem;
  isExpanded: boolean;
  onToggle: () => void;
  onDelete: () => void;
  onEdit: () => void;
  theme: any;
  styles: any;
}) => {
  const [contentHeight, setContentHeight] = useState(0);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      height: withTiming(isExpanded ? contentHeight : 0, { duration: 300 }),
      opacity: withTiming(isExpanded ? 1 : 0, { duration: 250 }),
    };
  }, [isExpanded, contentHeight]);

  const renderRightActions = () => {
    return (
      <View style={styles.swipeActionsContainer}>
        <Pressable
          style={[styles.swipeAction, styles.editAction]}
          onPress={onEdit}
        >
          <Pencil size={20} color={theme.background} />
        </Pressable>
        <Pressable
          style={[styles.swipeAction, styles.deleteAction]}
          onPress={onDelete}
        >
          <Trash2 size={20} color="#fff" />
        </Pressable>
      </View>
    );
  };

  return (
    <View style={styles.swipeableContainer}>
      <Swipeable
        renderRightActions={renderRightActions}
        overshootRight={false}
        childrenContainerStyle={{ flex: 1 }}
        failOffsetY={[-5, 5]}
        activeOffsetX={[-10, 10]}
      >
        <View style={styles.accordionCard}>
          <Pressable onPress={onToggle}>
            <View style={styles.accordionHeader}>
              <View style={styles.accordionHeaderLeft}>
                <View style={styles.iconBox}>
                  <GraduationCap size={20} color={theme.text} />
                </View>
                <View style={{ flex: 1, paddingRight: 16 }}>
                  <Text style={styles.eduInstitution} numberOfLines={1}>
                    {edu.institution}
                  </Text>
                  <Text style={styles.eduDegree} numberOfLines={1}>
                    {edu.degree}{" "}
                    {edu.fieldOfStudy ? `in ${edu.fieldOfStudy}` : ""}
                  </Text>
                </View>
              </View>
              <View>
                {isExpanded ? (
                  <ChevronUp size={20} color={theme.textSecondary} />
                ) : (
                  <ChevronDown size={20} color={theme.textSecondary} />
                )}
              </View>
            </View>
          </Pressable>

          <Animated.View style={[{ overflow: "hidden" }, animatedStyle]}>
            <View
              onLayout={(e) => {
                const h = e.nativeEvent.layout.height;
                if (h > 0 && contentHeight !== h) {
                  setContentHeight(h);
                }
              }}
              style={[
                styles.accordionContent,
                { position: "absolute", width: "100%" },
              ]}
            >
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Institution</Text>
                <Text style={styles.detailValue}>{edu.institution}</Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Degree</Text>
                <Text style={styles.detailValue}>
                  {edu.degree} {edu.fieldOfStudy ? `in ${edu.fieldOfStudy}` : ""}
                </Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Timeline</Text>
                <Text style={styles.detailValue}>
                  {edu.startDate} - {edu.current ? "Present" : edu.endDate}
                </Text>
              </View>
              {edu.specialization && (
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Specialization</Text>
                  <Text style={styles.detailValue}>{edu.specialization}</Text>
                </View>
              )}
            </View>
          </Animated.View>
        </View>
      </Swipeable>
    </View>
  );
};

export default function Education({ onCountChange }: { onCountChange?: (count: number) => void }) {
  const theme = useTheme();
  const commonStyles = useCommonStyles();
  const styles = createStyles(theme);

  const [educations, setEducations] = useState<EducationItem[]>([
    {
      id: "1",
      institution: "Harvard University",
      degree: "Bachelor's",
      fieldOfStudy: "Computer Science",
      startDate: "Sep 2018",
      endDate: "Jun 2022",
      current: false,
    },
  ]);

  useEffect(() => {
    if (onCountChange) {
      onCountChange(educations.length);
    }
  }, [educations.length, onCountChange]);

  const [isAdding, setIsAdding] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  // Form State
  const [institution, setInstitution] = useState("");
  const [degree, setDegree] = useState("");
  const [fieldOfStudy, setFieldOfStudy] = useState("");
  const [specialization, setSpecialization] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [current, setCurrent] = useState(false);

  // Errors
  const [errors, setErrors] = useState<Record<string, string>>({});

  const resetForm = () => {
    setInstitution("");
    setDegree("");
    setFieldOfStudy("");
    setSpecialization("");
    setStartDate("");
    setEndDate("");
    setCurrent(false);
    setErrors({});
    setEditingId(null);
  };

  const handleEdit = (id: string) => {
    const edu = educations.find((e) => e.id === id);
    if (!edu) return;

    setInstitution(edu.institution);
    setDegree(edu.degree);
    setFieldOfStudy(edu.fieldOfStudy || "");
    setSpecialization(edu.specialization || "");
    setStartDate(edu.startDate);
    setEndDate(edu.endDate || "");
    setCurrent(edu.current);

    setEditingId(id);
    setIsAdding(true);
    setExpandedId(null);
  };

  const handleSave = () => {
    let newErrors: Record<string, string> = {};
    if (!institution.trim()) newErrors.institution = "Required";
    if (!degree.trim()) newErrors.degree = "Required";
    if (!startDate.trim()) newErrors.startDate = "Required";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const newItem: EducationItem = {
      id: editingId ? editingId : Date.now().toString(),
      institution,
      degree,
      fieldOfStudy,
      specialization,
      startDate,
      endDate: current ? undefined : endDate,
      current,
    };

    if (editingId) {
      setEducations(educations.map((e) => (e.id === editingId ? newItem : e)));
    } else {
      setEducations([newItem, ...educations]);
    }

    setIsAdding(false);
    resetForm();
  };

  const handleDelete = (id: string) => {
    setEducations(educations.filter((e) => e.id !== id));
  };

  const renderForm = () => (
    <View style={styles.formCard}>
      <Text style={styles.formTitle}>
        {editingId ? "Edit Education" : "Add Education"}
      </Text>

      <Input
        label="Institution Name *"
        placeholder="Ex: Harvard University"
        value={institution}
        onChangeText={(t) => {
          setInstitution(t);
          setErrors({ ...errors, institution: "" });
        }}
        error={errors.institution}
      />

      <Input
        label="Degree *"
        placeholder="Ex: Bachelor's"
        value={degree}
        onChangeText={(t) => {
          setDegree(t);
          setErrors({ ...errors, degree: "" });
        }}
        error={errors.degree}
      />

      <Input
        label="Field of study"
        placeholder="Ex: Computer Science"
        value={fieldOfStudy}
        onChangeText={setFieldOfStudy}
        Icon={ChevronDown}
      />

      <Input
        label="Specialization (Optional)"
        placeholder="Ex: Artificial Intelligence"
        value={specialization}
        onChangeText={setSpecialization}
      />

      <Input
        label="Start Date *"
        placeholder="MM/YYYY"
        value={startDate}
        onChangeText={(t) => {
          setStartDate(t);
          setErrors({ ...errors, startDate: "" });
        }}
        error={errors.startDate}
        Icon={Calendar}
      />

      <Input
        label="End Date"
        placeholder="MM/YYYY"
        value={endDate}
        onChangeText={setEndDate}
        Icon={Calendar}
        editable={!current}
      />

      <View style={{ marginBottom: 24, marginTop: 8 }}>
        <Checkbox
          checked={current}
          onChange={setCurrent}
          label="I am currently studying here"
        />
      </View>

      <FormActionRow
        onCancel={() => {
          setIsAdding(false);
          resetForm();
        }}
        onSave={handleSave}
      />
    </View>
  );

  return (
    <View style={styles.tabContainer}>
      {isAdding ? (
        <Animated.View
          key="form"
          layout={LinearTransition.springify().damping(18).stiffness(150)}
          entering={FadeInDown.springify().damping(18).stiffness(150)}
          exiting={FadeOutUp.duration(200)}
        >
          {renderForm()}
        </Animated.View>
      ) : (
        <Animated.View
          key="list"
          layout={LinearTransition.springify().damping(18).stiffness(150)}
          entering={FadeInDown.springify().damping(18).stiffness(150).delay(100)}
          exiting={FadeOutUp.duration(200)}
          style={styles.listContainer}
        >
          {educations.length === 0 ? (
            <EmptyState
              icon={GraduationCap}
              title="No Education Added"
              subtitle="Add your education to strengthen your profile."
              buttonText="Add Education"
              onAdd={() => setIsAdding(true)}
            />
          ) : (
            <>
              {educations.map((edu) => (
                <AccordionItem
                  key={edu.id}
                  edu={edu}
                  isExpanded={expandedId === edu.id}
                  onToggle={() => toggleExpand(edu.id)}
                  onDelete={() => handleDelete(edu.id)}
                  onEdit={() => handleEdit(edu.id)}
                  theme={theme}
                  styles={styles}
                />
              ))}

              <Pressable
                style={styles.addMoreButton}
                onPress={() => setIsAdding(true)}
              >
                <Plus
                  size={20}
                  color={theme.text}
                  style={{ marginRight: 8 }}
                />
                <Text style={styles.addMoreText}>Add Education</Text>
              </Pressable>
            </>
          )}
        </Animated.View>
      )}
    </View>
  );
}

const createStyles = (theme: any) =>
  StyleSheet.create({
    tabContainer: {},

    // Form Styles
    formCard: {
      backgroundColor: theme.backgroundElement,
      borderRadius: BorderRadius.card,
      padding: 20,
      borderWidth: 1,
      borderColor: theme.backgroundSelected,
    },
    formTitle: {
      fontSize: 20,
      fontFamily: theme.fonts.bold,
      color: theme.text,
      marginBottom: 20,
    },
    row: {
      flexDirection: "row",
    },
    flex1: {
      flex: 1,
    },
    spacer: {
      width: 16,
    },

    // List Styles
    listContainer: {
      gap: 16,
    },

    // Swipeable Styles
    swipeableContainer: {
      marginBottom: 0,
    },
    swipeActionsContainer: {
      flexDirection: "row",
      alignItems: "stretch",
      paddingLeft: 8,
    },
    swipeAction: {
      justifyContent: "center",
      alignItems: "center",
      width: 64,
      borderRadius: BorderRadius.card,
      marginLeft: 8,
    },
    editAction: {
      backgroundColor: theme.text,
    },
    deleteAction: {
      backgroundColor: "#FF3B30",
    },

    // Accordion Styles
    accordionCard: {
      backgroundColor: theme.backgroundElement,
      borderRadius: BorderRadius.card,
      borderWidth: 1,
      borderColor: theme.backgroundSelected,
      overflow: "hidden",
    },
    accordionHeader: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      padding: 16,
    },
    accordionHeaderLeft: {
      flexDirection: "row",
      alignItems: "center",
      flex: 1,
    },
    iconBox: {
      width: 48,
      height: 48,
      borderRadius: 12,
      backgroundColor: theme.backgroundSelected,
      alignItems: "center",
      justifyContent: "center",
      marginRight: 16,
    },
    eduInstitution: {
      fontSize: 16,
      fontFamily: theme.fonts.bold,
      color: theme.text,
      marginBottom: 4,
    },
    eduDegree: {
      fontSize: 14,
      fontFamily: theme.fonts.medium,
      color: theme.textSecondary,
    },
    accordionContent: {
      padding: 16,
      paddingTop: 0,
      marginTop: 8,
    },
    detailRow: {
      flexDirection: "column", // Stack label and value vertically
      paddingVertical: 12,
      borderTopWidth: 1,
      borderTopColor: theme.backgroundSelected,
      gap: 4,
    },
    detailLabel: {
      fontSize: 12,
      fontFamily: theme.fonts.bold,
      color: theme.textSecondary,
      textTransform: "uppercase", // Give it a nice sub-header look
      letterSpacing: 0.5,
    },
    detailValue: {
      fontSize: 15,
      fontFamily: theme.fonts.semiBold,
      color: theme.text,
      // No flex: 1 or textAlign right needed since it's a column now!
    },
    addMoreButton: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      paddingVertical: 16,
      backgroundColor: theme.backgroundElement,
      borderRadius: BorderRadius.card,
      borderWidth: 1,
      borderColor: theme.backgroundSelected,
      borderStyle: "dashed",
      marginTop: 8,
    },
    addMoreText: {
      fontSize: 16,
      fontFamily: theme.fonts.bold,
      color: theme.text,
    },
  });

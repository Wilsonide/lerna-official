export function calculateGrade(score: number) {
  if (score >= 70)
    return {
      grade: "A",
      remark: "Excellent",
    };

  if (score >= 60)
    return {
      grade: "B",
      remark: "Very Good",
    };

  if (score >= 50)
    return {
      grade: "C",
      remark: "Good",
    };

  if (score >= 45)
    return {
      grade: "D",
      remark: "Fair",
    };

  if (score >= 40)
    return {
      grade: "E",
      remark: "Pass",
    };

  return {
    grade: "F",
    remark: "Fail",
  };
}

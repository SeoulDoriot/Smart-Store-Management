/** AI question summary → sent to OWNER (daily or on-demand) */
export function aiQuestionSummary(
  questions: { question: string; answer: string; language: string }[]
): string {
  if (questions.length === 0) {
    return [
      `🤖 *AI Advisor Summary*`,
      ``,
      `No AI questions today\\.`,
    ].join("\n");
  }

  // Count topics
  const topicCount: Record<string, number> = {};
  questions.forEach((q) => {
    const text = q.question.toLowerCase();
    if (text.includes("acne")) topicCount["Acne"] = (topicCount["Acne"] ?? 0) + 1;
    else if (text.includes("oily")) topicCount["Oily Skin"] = (topicCount["Oily Skin"] ?? 0) + 1;
    else if (text.includes("dry")) topicCount["Dry Skin"] = (topicCount["Dry Skin"] ?? 0) + 1;
    else if (text.includes("sensitive")) topicCount["Sensitive Skin"] = (topicCount["Sensitive Skin"] ?? 0) + 1;
    else if (text.includes("dark spot") || text.includes("brightening"))
      topicCount["Dark Spots"] = (topicCount["Dark Spots"] ?? 0) + 1;
    else if (text.includes("sunscreen") || text.includes("spf") || text.includes("sun"))
      topicCount["Sun Protection"] = (topicCount["Sun Protection"] ?? 0) + 1;
    else if (text.includes("routine")) topicCount["Routine"] = (topicCount["Routine"] ?? 0) + 1;
    else topicCount["Other"] = (topicCount["Other"] ?? 0) + 1;
  });

  const sorted = Object.entries(topicCount).sort((a, b) => b[1] - a[1]);
  const topTopics = sorted
    .slice(0, 5)
    .map(([topic, count]) => `  • ${escape(topic)} — ${count} questions`)
    .join("\n");

  // Language breakdown
  const langCount: Record<string, number> = {};
  questions.forEach((q) => {
    const lang = q.language || "en";
    langCount[lang] = (langCount[lang] ?? 0) + 1;
  });
  const langBreakdown = Object.entries(langCount)
    .map(([lang, count]) => `${lang}: ${count}`)
    .join(", ");

  return [
    `🤖 *AI Advisor Summary*`,
    ``,
    `Total questions today: *${questions.length}*`,
    `Languages: ${escape(langBreakdown)}`,
    ``,
    `*Top Topics:*`,
    topTopics,
    ``,
    `_Check admin dashboard for full conversation logs\\._`,
  ].join("\n");
}

function escape(text: string): string {
  return text.replace(/([_*\[\]()~`>#+\-=|{}.!\\])/g, "\\$1");
}

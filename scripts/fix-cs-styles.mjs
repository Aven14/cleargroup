import fs from "fs";
import path from "path";

const dir = "src/app/clearsecurity/interne";
const files = [
  "agents/page.tsx",
  "detenus/page.tsx",
  "patrouilles/page.tsx",
  "debriefings/page.tsx",
  "planning/page.tsx",
  "alertes/page.tsx",
];

const reps = [
  ["mt-4 p-6 bg-white border border-gray-200 rounded-lg", "mt-4 panel-soft p-6"],
  ["mb-4 p-6 bg-white border border-gray-200 rounded-lg", "mb-4 panel-soft p-6"],
  ["p-6 text-center text-gray-500 bg-white border border-gray-200 rounded-lg", "panel-soft p-6 text-center text-muted"],
  ["p-6 bg-white border border-gray-200 rounded-lg", "panel-soft p-6"],
  ["text-lg font-bold text-gray-900", "text-lg font-bold text-ink"],
  ["font-bold text-gray-900", "font-bold text-ink"],
  ["text-gray-900", "text-ink"],
  ["text-gray-500", "text-muted"],
  ["text-gray-700", "text-muted"],
  ["text-gray-400", "text-muted/70"],
  ["text-gray-600", "text-muted"],
  ["block mb-2 text-sm font-medium text-gray-700", "label-caps block mb-2"],
  [
    "w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[80px]",
    "input-field w-full min-h-[80px]",
  ],
  [
    "w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500",
    "input-field w-full",
  ],
  [
    "flex-1 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 transition-colors",
    "btn-primary flex-1",
  ],
  [
    "px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 transition-colors",
    "btn-primary",
  ],
  ["mb-4 p-4 bg-gray-50 rounded", "mb-4 p-4 bg-primary-light/20 rounded"],
  ["p-4 bg-gray-50 rounded", "p-4 bg-primary-light/20 rounded"],
];

for (const file of files) {
  const fp = path.join(dir, file);
  let content = fs.readFileSync(fp, "utf8");
  for (const [from, to] of reps) {
    content = content.split(from).join(to);
  }
  fs.writeFileSync(fp, content);
  console.log("Updated", file);
}

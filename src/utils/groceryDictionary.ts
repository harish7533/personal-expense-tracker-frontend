const DICT_KEY = "grocery_dictionary";

type Dict = Record<string, string>;

function loadDict(): Dict {
  return JSON.parse(localStorage.getItem(DICT_KEY) || "{}");
}

function saveDict(dict: Dict) {
  localStorage.setItem(DICT_KEY, JSON.stringify(dict));
}

export function correctItemName(name: string): string {
  const dict = loadDict();
  return dict[name.toUpperCase()] || name;
}

export function trainGrocery(raw: string, corrected: string) {
  if (!raw || raw === corrected) return;
  const dict = loadDict();
  dict[raw.toUpperCase()] = corrected;
  saveDict(dict);
}

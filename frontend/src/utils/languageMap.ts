import type { Language } from '../types/execution.types';


export const languageToMonaco: Record<Language, string> = {
  java: 'java',
  python: 'python',
  c: 'c',
  cpp: 'cpp',
  javascript: 'javascript',
};

export const languageLabels: Record<Language, string> = {
  java: 'Java',
  python: 'Python',
  c: 'C',
  cpp: 'C++',
  javascript: 'JavaScript',
};

export const languageIcons: Record<Language, string> = {
  java: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/java/java-original.svg',
  python: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg',
  c: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/c/c-original.svg',
  cpp: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/cplusplus/cplusplus-original.svg',
  javascript: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg',
};

export const languageColors: Record<Language, { border: string; bg: string; text: string }> = {
  java:       { border: 'border-orange-500', bg: 'bg-orange-500/10', text: 'text-orange-400' },
  python:     { border: 'border-blue-400',   bg: 'bg-blue-400/10',   text: 'text-blue-400'   },
  c:          { border: 'border-sky-400',    bg: 'bg-sky-400/10',    text: 'text-sky-400'    },
  cpp:        { border: 'border-pink-500',   bg: 'bg-pink-500/10',   text: 'text-pink-400'   },
  javascript: { border: 'border-yellow-400', bg: 'bg-yellow-400/10', text: 'text-yellow-400' },
};

export const defaultSnippets: Record<Language, string> = {
  java: `public class Main {\n    public static void main(String[] args) {\n        System.out.println("Hello, World!");\n    }\n}`,
  python: `print("Hello, World!")`,
  c: `#include <stdio.h>\nint main() {\n    printf("Hello, World!\\n");\n    return 0;\n}`,
  cpp: `#include <iostream>\nint main() {\n    std::cout << "Hello, World!" << std::endl;\n    return 0;\n}`,
  javascript: `console.log("Hello, World!");`,
};

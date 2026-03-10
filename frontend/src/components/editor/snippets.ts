import type { Monaco } from '@monaco-editor/react';
import type * as MonacoType from 'monaco-editor';
import type { Language } from '../../types/execution.types';

type Range = MonacoType.IRange;
type Item = MonacoType.languages.CompletionItem;

function s(monaco: Monaco, range: Range, label: string, insertText: string, doc: string): Item {
  return {
    label,
    kind: monaco.languages.CompletionItemKind.Snippet,
    insertText,
    insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
    documentation: doc,
    detail: 'snippet',
    range,
  };
}

function java(monaco: Monaco, range: Range): Item[] {
  return [
    s(monaco, range, 'sout',    'System.out.println($1);',                                          'System.out.println()'),
    s(monaco, range, 'soutv',   'System.out.println("${1:var}: " + ${1:var});',                     'Print variable with label'),
    s(monaco, range, 'souf',    'System.out.printf("${1:%s}%n"${2:, args});',                       'System.out.printf()'),
    s(monaco, range, 'serr',    'System.err.println($1);',                                          'System.err.println()'),
    s(monaco, range, 'psvm',    'public static void main(String[] args) {\n\t$0\n}',                'main method'),
    s(monaco, range, 'main',    'public static void main(String[] args) {\n\t$0\n}',                'main method'),
    s(monaco, range, 'fori',    'for (int ${1:i} = 0; ${1:i} < ${2:n}; ${1:i}++) {\n\t$0\n}',     'for loop with index'),
    s(monaco, range, 'iter',    'for (${1:Type} ${2:item} : ${3:collection}) {\n\t$0\n}',           'enhanced for-each'),
    s(monaco, range, 'while',   'while (${1:condition}) {\n\t$0\n}',                               'while loop'),
    s(monaco, range, 'dowhile', 'do {\n\t$0\n} while (${1:condition});',                           'do-while loop'),
    s(monaco, range, 'ife',     'if (${1:condition}) {\n\t$2\n} else {\n\t$0\n}',                  'if-else'),
    s(monaco, range, 'ifn',     'if (${1:obj} == null) {\n\t$0\n}',                                'if null check'),
    s(monaco, range, 'inn',     'if (${1:obj} != null) {\n\t$0\n}',                                'if not null check'),
    s(monaco, range, 'try',     'try {\n\t$1\n} catch (${2:Exception} ${3:e}) {\n\t$0\n}',         'try-catch'),
    s(monaco, range, 'trycf',   'try {\n\t$1\n} catch (${2:Exception} ${3:e}) {\n\t$4\n} finally {\n\t$0\n}', 'try-catch-finally'),
    s(monaco, range, 'class',   'public class ${1:ClassName} {\n\t$0\n}',                           'class declaration'),
    s(monaco, range, 'pclass',  'public class ${1:Name} {\n\n\tpublic ${1:Name}(${2}) {\n\t\t$0\n\t}\n}', 'class with constructor'),
    s(monaco, range, 'iface',   'public interface ${1:Name} {\n\t$0\n}',                            'interface'),
    s(monaco, range, 'arr',     '${1:int}[] ${2:arr} = new ${1:int}[${3:size}];',                   'array declaration'),
    s(monaco, range, 'lst',     'ArrayList<${1:Type}> ${2:list} = new ArrayList<>();',              'ArrayList'),
    s(monaco, range, 'hmap',    'HashMap<${1:Key}, ${2:Value}> ${3:map} = new HashMap<>();',        'HashMap'),
    s(monaco, range, 'sc',      'Scanner ${1:sc} = new Scanner(System.in);',                       'Scanner'),
    s(monaco, range, 'sw',      'switch (${1:var}) {\n\tcase ${2:val}:\n\t\t$0\n\t\tbreak;\n\tdefault:\n\t\tbreak;\n}', 'switch'),
  ];
}

function python(monaco: Monaco, range: Range): Item[] {
  return [
    s(monaco, range, 'def',    'def ${1:name}(${2}):\n\t${0:pass}',                                       'function definition'),
    s(monaco, range, 'class',  'class ${1:Name}:\n\tdef __init__(self${2:, args}):\n\t\t${0:pass}',        'class definition'),
    s(monaco, range, 'for',    'for ${1:item} in ${2:iterable}:\n\t${0:pass}',                            'for loop'),
    s(monaco, range, 'fori',   'for ${1:i} in range(${2:10}):\n\t${0:pass}',                             'for range loop'),
    s(monaco, range, 'while',  'while ${1:condition}:\n\t${0:pass}',                                     'while loop'),
    s(monaco, range, 'if',     'if ${1:condition}:\n\t${0:pass}',                                        'if statement'),
    s(monaco, range, 'ife',    'if ${1:condition}:\n\t${2:pass}\nelse:\n\t${0:pass}',                    'if-else'),
    s(monaco, range, 'eif',    'elif ${1:condition}:\n\t${0:pass}',                                      'elif'),
    s(monaco, range, 'try',    'try:\n\t${1:pass}\nexcept ${2:Exception} as ${3:e}:\n\t${0:pass}',       'try-except'),
    s(monaco, range, 'tryf',   'try:\n\t${1:pass}\nexcept ${2:Exception} as ${3:e}:\n\t${4:pass}\nfinally:\n\t${0:pass}', 'try-except-finally'),
    s(monaco, range, 'with',   'with ${1:expr} as ${2:var}:\n\t${0:pass}',                               'with statement'),
    s(monaco, range, 'print',  'print(${1})',                                                            'print()'),
    s(monaco, range, 'inp',    '${1:var} = input("${2:prompt}: ")',                                      'input()'),
    s(monaco, range, 'lc',     '[${1:expr} for ${2:x} in ${3:iterable}]',                               'list comprehension'),
    s(monaco, range, 'lci',    '[${1:expr} for ${2:x} in ${3:iterable} if ${4:cond}]',                  'list comp with if'),
    s(monaco, range, 'main',   'if __name__ == "__main__":\n\t${0:main()}',                              '__main__ guard'),
    s(monaco, range, 'lam',    'lambda ${1:args}: ${0:expr}',                                           'lambda'),
    s(monaco, range, 'prop',   '@property\ndef ${1:name}(self):\n\treturn self._${1:name}',              '@property'),
  ];
}

function javascript(monaco: Monaco, range: Range): Item[] {
  return [
    s(monaco, range, 'log',     'console.log($1);',                                                     'console.log()'),
    s(monaco, range, 'logt',    "console.log('${1:label}:', $2);",                                      'console.log with label'),
    s(monaco, range, 'warn',    'console.warn($1);',                                                    'console.warn()'),
    s(monaco, range, 'err',     'console.error($1);',                                                   'console.error()'),
    s(monaco, range, 'fn',      'function ${1:name}(${2}) {\n\t${0}\n}',                                'function'),
    s(monaco, range, 'afn',     'const ${1:name} = (${2}) => {\n\t${0}\n};',                            'arrow function'),
    s(monaco, range, 'af',      '(${1}) => ${0}',                                                       'inline arrow'),
    s(monaco, range, 'for',     'for (let ${1:i} = 0; ${1:i} < ${2:n}; ${1:i}++) {\n\t${0}\n}',       'for loop'),
    s(monaco, range, 'forof',   'for (const ${1:item} of ${2:arr}) {\n\t${0}\n}',                      'for-of'),
    s(monaco, range, 'forin',   'for (const ${1:key} in ${2:obj}) {\n\t${0}\n}',                       'for-in'),
    s(monaco, range, 'fe',      '${1:arr}.forEach((${2:item}) => {\n\t${0}\n});',                      'forEach'),
    s(monaco, range, 'map',     '${1:arr}.map((${2:item}) => ${0})',                                    '.map()'),
    s(monaco, range, 'filter',  '${1:arr}.filter((${2:item}) => ${0})',                                '.filter()'),
    s(monaco, range, 'reduce',  '${1:arr}.reduce((${2:acc}, ${3:cur}) => {\n\t${0}\n}, ${4:init})',    '.reduce()'),
    s(monaco, range, 'class',   'class ${1:Name} {\n\tconstructor(${2}) {\n\t\t${0}\n\t}\n}',          'class'),
    s(monaco, range, 'try',     'try {\n\t${1}\n} catch (${2:e}) {\n\t${0}\n}',                        'try-catch'),
    s(monaco, range, 'prom',    'new Promise((resolve, reject) => {\n\t${0}\n})',                       'Promise'),
    s(monaco, range, 'async',   'async function ${1:name}(${2}) {\n\t${0}\n}',                          'async function'),
    s(monaco, range, 'aw',      'const ${1:result} = await ${0};',                                     'await'),
    s(monaco, range, 'imp',     "import ${1:name} from '${2:module}';",                                'import'),
    s(monaco, range, 'imd',     "import { ${1} } from '${2:module}';",                                 'import destructure'),
    s(monaco, range, 'sw',      "switch (${1:expr}) {\n\tcase ${2:val}:\n\t\t${0}\n\t\tbreak;\n\tdefault:\n\t\tbreak;\n}", 'switch'),
  ];
}

function c(monaco: Monaco, range: Range): Item[] {
  return [
    s(monaco, range, 'main',   '#include <stdio.h>\n\nint main() {\n\t${0}\n\treturn 0;\n}',           'main function'),
    s(monaco, range, 'pf',     'printf("${1:%s}\\n"${2:, args});',                                     'printf'),
    s(monaco, range, 'sf',     'scanf("${1:%d}", &${2:var});',                                         'scanf'),
    s(monaco, range, 'for',    'for (int ${1:i} = 0; ${1:i} < ${2:n}; ${1:i}++) {\n\t${0}\n}',        'for loop'),
    s(monaco, range, 'while',  'while (${1:condition}) {\n\t${0}\n}',                                  'while loop'),
    s(monaco, range, 'do',     'do {\n\t${0}\n} while (${1:condition});',                              'do-while'),
    s(monaco, range, 'if',     'if (${1:condition}) {\n\t${0}\n}',                                     'if'),
    s(monaco, range, 'ife',    'if (${1:condition}) {\n\t${2}\n} else {\n\t${0}\n}',                   'if-else'),
    s(monaco, range, 'sw',     'switch (${1:var}) {\n\tcase ${2:val}:\n\t\t${0}\n\t\tbreak;\n\tdefault:\n\t\tbreak;\n}', 'switch'),
    s(monaco, range, 'st',     'struct ${1:Name} {\n\t${0}\n};',                                       'struct'),
    s(monaco, range, 'inc',    '#include <${1:stdio.h}>',                                              '#include'),
    s(monaco, range, 'def',    '#define ${1:NAME} ${0}',                                               '#define'),
    s(monaco, range, 'arr',    '${1:int} ${2:arr}[${3:size}];',                                        'array'),
    s(monaco, range, 'fgets',  'fgets(${1:buf}, sizeof(${1:buf}), stdin);',                            'fgets (safe input)'),
    s(monaco, range, 'malloc', '${1:Type} *${2:ptr} = malloc(${3:n} * sizeof(${1:Type}));',            'malloc'),
  ];
}

function cpp(monaco: Monaco, range: Range): Item[] {
  return [
    s(monaco, range, 'main',    '#include <iostream>\nusing namespace std;\n\nint main() {\n\t${0}\n\treturn 0;\n}', 'main function'),
    s(monaco, range, 'cout',    'cout << ${1} << endl;',                                               'cout'),
    s(monaco, range, 'coutf',   'cout << "${1:label}: " << ${2} << endl;',                             'cout with label'),
    s(monaco, range, 'cin',     'cin >> ${1};',                                                        'cin'),
    s(monaco, range, 'for',     'for (int ${1:i} = 0; ${1:i} < ${2:n}; ${1:i}++) {\n\t${0}\n}',       'for loop'),
    s(monaco, range, 'forr',    'for (auto& ${1:item} : ${2:container}) {\n\t${0}\n}',                 'range-based for'),
    s(monaco, range, 'while',   'while (${1:condition}) {\n\t${0}\n}',                                 'while loop'),
    s(monaco, range, 'do',      'do {\n\t${0}\n} while (${1:condition});',                             'do-while'),
    s(monaco, range, 'ife',     'if (${1:condition}) {\n\t${2}\n} else {\n\t${0}\n}',                  'if-else'),
    s(monaco, range, 'sw',      'switch (${1:var}) {\n\tcase ${2:val}:\n\t\t${0}\n\t\tbreak;\n\tdefault:\n\t\tbreak;\n}', 'switch'),
    s(monaco, range, 'class',   'class ${1:Name} {\npublic:\n\t${1:Name}(${2});\n\t~${1:Name}();\n\nprivate:\n\t${0}\n};', 'class'),
    s(monaco, range, 'st',      'struct ${1:Name} {\n\t${0}\n};',                                      'struct'),
    s(monaco, range, 'try',     'try {\n\t${1}\n} catch (const ${2:exception}& ${3:e}) {\n\t${0}\n}', 'try-catch'),
    s(monaco, range, 'vec',     'vector<${1:int}> ${2:v};',                                            'vector'),
    s(monaco, range, 'map',     'map<${1:Key}, ${2:Value}> ${3:m};',                                   'map'),
    s(monaco, range, 'inc',     '#include <${1:iostream}>',                                            '#include'),
    s(monaco, range, 'ns',      'using namespace ${1:std};',                                           'using namespace'),
    s(monaco, range, 'pf',      'printf("${1:%s}\\n"${2:, args});',                                    'printf'),
  ];
}

export function getSnippets(lang: Language, monaco: Monaco, range: Range): Item[] {
  switch (lang) {
    case 'java':       return java(monaco, range);
    case 'python':     return python(monaco, range);
    case 'javascript': return javascript(monaco, range);
    case 'c':          return c(monaco, range);
    case 'cpp':        return cpp(monaco, range);
    default:           return [];
  }
}

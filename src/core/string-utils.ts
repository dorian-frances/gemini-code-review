export function format(template: string, ...args: any[]): string {
  return template.replace(/{(\d+)}/g, (match, index) => args[index] ?? match);
}

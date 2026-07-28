// re: https://github.com/tailwindlabs/tailwindcss/discussions/7554
// Helps give TailwindCSS intellisense when organizing classes outside of inline className attribute
export const tw = (
  strings: TemplateStringsArray,
  ...values: string[]
): string => {
  return strings.reduce(
    (result, stringPart, i) => result + stringPart + (values[i] || ''),
    '',
  )
}

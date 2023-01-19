export const makeCssVars = (
  prefix: string,
  obj: Record<string, any>
): string => {
  const properties = Object.entries(obj).map(([property, value]) => {
    const propertyName: string =
      property !== "DEFAULT" ? `${prefix}-${property}` : `${prefix}`;
    if (typeof value === "object") return makeCssVars(propertyName, value);
    return `${propertyName}: ${value};`;
  });

  return `${properties.join("")}`;
};

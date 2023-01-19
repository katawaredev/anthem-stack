type ValidationInputErrorProps = {
  id: string;
  errors?: string[] | string | null | undefined;
};

export default function ValidationErrorMessage({
  id,
  errors,
}: ValidationInputErrorProps) {
  if (!errors || errors.length == 0) return null;

  const className = "pt-1 text-red-700";

  if (typeof errors === "string")
    return (
      <div id={id} className={className}>
        {errors}
      </div>
    );

  if (errors.length == 1)
    return (
      <div id={id} className={className}>
        {errors[0]}
      </div>
    );

  return (
    <>
      {errors.map((error, i) => (
        <div key={error} id={`${id}[${i}]`} className={className}>
          {error}
        </div>
      ))}
    </>
  );
}

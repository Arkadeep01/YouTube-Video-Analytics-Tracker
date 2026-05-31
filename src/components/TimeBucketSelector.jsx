export default function TimeBucketSelector({
  bucket,
  setBucket,
  bucketUnit,
  setBucketUnit,
}) {
  // Define bucket unit options with separate label and value
  const bucketUnitOptions = [
    { value: "minutes", label: "Minutes" },
    { value: "hours", label: "Hours" },
    { value: "days", label: "Days" },
    { value: "weeks", label: "Weeks" },
    { value: "months", label: "Months" },
    { value: "years", label: "Years" },
  ];

  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm font-medium text-muted-foreground">
        Bucket
      </label>

      <div className="flex overflow-hidden rounded-xl border border-border bg-background">

        <input
          type="number"
          min="1"
          value={bucket}
          onChange={(e) =>
            setBucket(e.target.value)
          }
          className="w-24 border-r border-border bg-transparent px-4 py-3 outline-none"
        />

        <select
          value={bucketUnit}
          onChange={(e) =>
            setBucketUnit(
              e.target.value
            )
          }
          className="bg-transparent px-4 py-3 outline-none"
        >
          {bucketUnitOptions.map(
            (option) => (
              <option
                key={
                  option.value
                }
                value={
                  option.value
                }
              >
                {option.label}
              </option>
            )
          )}
        </select>
      </div>
    </div>
  );
}
import { NumberField, NumberFieldProps } from "react-admin";

export const MoneyField = (props: NumberFieldProps) => {
  return (
    <NumberField
      {...props}
      // textAlign="right"
      options={{ minimumFractionDigits: 2 }}
    />
  );
};

MoneyField.defaultProps = {
  textAlign: "right",
};

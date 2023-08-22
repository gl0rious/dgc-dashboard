import { DateFieldProps, DateField as RaDateField } from "react-admin";

export const DateField = (props: DateFieldProps) => {
  return <RaDateField {...props} locales="fr-FR" />;
};

// DateField.defaultProps = { locales: "en-gb" };

// export { _DateField as DateField };

import { TextInput as RaTextInput } from "react-admin";

export const MoneyInput = (props: any) => (
  <RaTextInput
    {...props}
    InputProps={{
      readOnly: true,
    }}
    fullWidth
    InputLabelProps={{ shrink: true }}
  />
);

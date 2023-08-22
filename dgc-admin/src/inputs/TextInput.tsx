import { TextInput as RaTextInput } from "react-admin";

export const TextInput = (props: any) => (
  <RaTextInput
    {...props}
    InputProps={{
      readOnly: true,
    }}
    fullWidth
    InputLabelProps={{ shrink: true }}
  />
);

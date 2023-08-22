import { DatePicker } from "@mui/x-date-pickers";
import { TextField, TextInput, useInput, useRecordContext } from "react-admin";
import dayjs from "dayjs";
import get from "lodash/get";

export const DateInput = (props: any) => {
  const { onBlur, onChange, source, ...rest } = props;
  const record = useRecordContext();
  const value = get(record, source);
  const _format = (value: any) => {
    return dayjs(value, ["DD/MM/YYYY", "YYYY-MM-DD"]);
  };
  const _parse = (value: any) => {
    return dayjs(value).format("DD/MM/YYYY");
  };
  // const onChange = (...event: any[]) => {
  //   console.log(event[0]?.target?.value);
  // };
  const {
    field,
    fieldState: { isTouched, invalid, error },
    formState: { isSubmitted },
    isRequired,
  } = useInput({
    onChange,
    onBlur,
    format: _format,
    parse: _parse,
    ...props,
  });

  return (
    <DatePicker
      views={["year", "month", "day"]}
      openTo="month"
      {...field}
      label={props.label}
      error={(isTouched || isSubmitted) && invalid}
      helperText={(isTouched || isSubmitted) && invalid ? error : ""}
      required={isRequired}
      {...rest}
      disabled={value === null}
    />
  );
};

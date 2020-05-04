import { FormControl, InputLabel, MenuItem, Select } from "@material-ui/core";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import startCase from "lodash-es/startCase";
import * as React from "react";

export interface SelectOption {
  text: string;
  value: string;
}

interface PropTypes {
  title: string;
  values: SelectOption[];
  handleChange?: any;
  id: string;
  defaultValue?: string;
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    formControl: {
      marginBottom: theme.spacing(1),
      minWidth: 120,
    },
  })
);

const SelectComponent: React.FC<PropTypes> = (props) => {
  const classes = useStyles();

  const [value, setValue] = React.useState<string | number>(
    props.defaultValue || ""
  );
  const [open, setOpen] = React.useState(false);

  React.useEffect(() => props.handleChange(value as string), [value]);

  const handleChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setValue(event.target.value as string);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleOpen = () => {
    setOpen(true);
  };

  return (
    <FormControl className={classes.formControl}>
      <InputLabel id={props.id}>{props.title}</InputLabel>
      <Select
        labelId={props.id}
        id={props.id + "-open-select"}
        open={open}
        onClose={handleClose}
        onOpen={handleOpen}
        value={value}
        onChange={handleChange}
      >
        {!props.defaultValue && (
          <MenuItem value="">
            <em>- Select one -</em>
          </MenuItem>
        )}

        {props.values?.map((item: SelectOption, key: number) => (
          <MenuItem key={key} value={item.value}>
            {startCase(item.text)}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default SelectComponent;

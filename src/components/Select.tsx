import { FormControl, InputLabel, MenuItem, Select } from "@material-ui/core";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import startCase from "lodash-es/startCase";
import * as React from "react";

interface Value {
  text: string;
  value: string;
}

interface PropTypes {
  title: string;
  values: Value[];
  handleChange: any;
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    formControl: {
      marginBottom: theme.spacing(1),
      minWidth: 120
    }
  })
);

const SelectComponent: React.FC<PropTypes> = props => {
  const classes = useStyles();

  const [value, setValue] = React.useState<string | number>("");
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
    <div>
      <FormControl className={classes.formControl}>
        <InputLabel id="open-select-label">{props.title}</InputLabel>
        <Select
          labelId="open-select-label"
          id="open-select"
          open={open}
          onClose={handleClose}
          onOpen={handleOpen}
          value={value}
          onChange={handleChange}
        >
          <MenuItem value="">
            <em>- Select one -</em>
          </MenuItem>
          {props.values.map((item: Value, key: number) => (
            <MenuItem key={key} value={item.value}>
              {startCase(item.text)}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </div>
  );
};

export default SelectComponent;

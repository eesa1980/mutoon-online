import LinearProgress from "@material-ui/core/LinearProgress";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import * as React from "react";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: "100%",
      "& > * + *": {
        marginTop: theme.spacing(2),
      },
    },
  })
);

export default function LinearDeterminate({ progress }: any) {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <LinearProgress variant="determinate" value={progress} />
    </div>
  );
}

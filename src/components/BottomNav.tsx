import BottomNavigation from "@material-ui/core/BottomNavigation";
import BottomNavigationAction from "@material-ui/core/BottomNavigationAction";
import { makeStyles } from "@material-ui/core/styles";
import Filter1Icon from "@material-ui/icons/Filter1";
import ForwardIcon from "@material-ui/icons/Forward";
import LoopIcon from "@material-ui/icons/Loop";
import PlayArrowIcon from "@material-ui/icons/PlayArrow";
import StopIcon from "@material-ui/icons/Stop";
import * as React from "react";
import { PlayType, Status } from "../enum";
import { ActiveBook, Settings } from "../model/state";

const useStyles = makeStyles({
  root: {
    position: "sticky",
    paddingBottom: "calc(env(safe-area-inset-bottom)",
    bottom: 0,
    left: 0,
    width: "100%",
    height: "calc(env(safe-area-inset-bottom) + 64px)",
  },
});

const BottomNav: React.FC<{
  onClickPlayHandler: any;
  onClickLoopHandler: any;
  activeBook: ActiveBook;
  settings: Settings;
}> = ({ onClickPlayHandler, activeBook, settings, onClickLoopHandler }) => {
  const classes = useStyles();

  const isPlaying = activeBook.status === Status.PLAYING;
  const StatusIcon = isPlaying ? StopIcon : PlayArrowIcon;
  const statusLabel = isPlaying ? "Stop" : "Play";

  let PlaytypeIcon;
  let playTypeLabel;

  switch (settings.playType) {
    case PlayType.PLAY_ONCE:
      PlaytypeIcon = Filter1Icon;
      playTypeLabel = "Play once";
      break;

    case PlayType.LOOPING:
      PlaytypeIcon = LoopIcon;
      playTypeLabel = "Loop";
      break;

    case PlayType.CONTINUOUS:
      PlaytypeIcon = ForwardIcon;
      playTypeLabel = "Continuous";
      break;

    default:
      break;
  }

  return (
    <BottomNavigation showLabels className={classes.root}>
      {activeBook.status === Status.PLAYING && (
        <BottomNavigationAction
          onClick={onClickPlayHandler}
          label={statusLabel}
          icon={<StatusIcon />}
        />
      )}
      <BottomNavigationAction
        onClick={onClickLoopHandler}
        label={playTypeLabel}
        icon={<PlaytypeIcon />}
      />
    </BottomNavigation>
  );
};

export default BottomNav;

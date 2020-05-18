import BottomNavigation from "@material-ui/core/BottomNavigation";
import BottomNavigationAction from "@material-ui/core/BottomNavigationAction";
import { makeStyles } from "@material-ui/core/styles";
import Filter1Icon from "@material-ui/icons/Filter1";
import ForwardIcon from "@material-ui/icons/Forward";
import LoopIcon from "@material-ui/icons/Loop";
import PauseIcon from "@material-ui/icons/Pause";
import PlayArrowIcon from "@material-ui/icons/PlayArrow";
import * as React from "react";
import { PlayType, State, Status } from "../redux/reducers";

const useStyles = makeStyles({
  root: {
    position: "sticky",
    paddingBottom: "env(safe-area-inset-bottom)",
    bottom: 0,
    left: 0,
    width: "100%",
    height: "calc(env(safe-area-inset-bottom) + 64px)",
  },
});

const BottomNav: React.FC<{
  onClickPlayHandler: any;
  onClickLoopHandler: any;
  audioState: State["audio"];
}> = ({ onClickPlayHandler, audioState, onClickLoopHandler }) => {
  const classes = useStyles();

  const isPlaying = audioState.status === Status.PLAYING;
  const StatusIcon = isPlaying ? PauseIcon : PlayArrowIcon;
  const statusLabel = isPlaying ? "Pause" : "Play";

  let PlaytypeIcon;
  let playTypeLabel;

  switch (audioState.playType) {
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
      <BottomNavigationAction
        onClick={onClickPlayHandler}
        label={statusLabel}
        icon={<StatusIcon />}
      />
      <BottomNavigationAction
        onClick={onClickLoopHandler}
        label={playTypeLabel}
        icon={<PlaytypeIcon />}
      />
    </BottomNavigation>
  );
};

export default BottomNav;

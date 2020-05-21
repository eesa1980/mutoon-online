import { User } from "netlify-identity-widget";
import { LoadingStatus, PlayType, Status } from "../enum";

export interface AudioState {
  page: number;
  loadingStatus: LoadingStatus;
}

interface Audio {
  [key: string]: AudioState | any;
}

export interface State {
  audio: Audio;
  user: User | {};
  activeBook: ActiveBook;
  settings: Settings;
}

export interface Settings {
  playType: PlayType;
}

export interface ActiveBook {
  id: string;
  title: string;
  status: Status;
}

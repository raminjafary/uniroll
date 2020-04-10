import { TemplateDef } from "uniroll-types";
export type Files = {
  [key: string]: string;
};

export type State = {
  files: Files;
};

export type Env = {
  templateHost?: string;
  inExtension: boolean;
  evalCodeInActiveTab?: (code: string, options: any) => void;
  compile(options: any): Promise<any>;
  save(state: State): Promise<void>;
  load(): Promise<State>;
  layout: Layout;
  downloadToLocal?: (dump: TemplateDef) => Promise<void>;
  uploadFromLocal?: () => Promise<TemplateDef>;
};
export const App: React.ComponentClass;
export const EnvContext: React.Context<Env>;
export function useEnv(): Env;

export type TabComponent = {
  id: string;
  displayName: string;
  component: React.ComponentType<{}>;
};

export type Layout = {
  leftTabs: TabComponent[];
  rightTabs: TabComponent[];
};

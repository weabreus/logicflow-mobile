import { SetStateAction, createContext } from "react";

type DriverContext = {
  driver: string;
  setDriver?: React.Dispatch<SetStateAction<string>>;
  driverStatus: "active" | "busy" | "inactive";
  setDriverStatus?: React.Dispatch<
    React.SetStateAction<"active" | "busy" | "inactive">
  >;
  activeTask?: { id: string | undefined; type: string | undefined };
  setActiveTask?: React.Dispatch<React.SetStateAction<{id: string; type: string;} | undefined>>;
};

const driverContext = createContext<DriverContext>({
  driver: "",
  setDriver: undefined,
  driverStatus: "inactive",
  setDriverStatus: undefined,
  activeTask: {
    id: undefined,
    type: undefined,
  },
  setActiveTask: undefined,
});

export default driverContext;

import { addUser } from "./User.seed";

export const updateSeedRunnable = (): void => {
    addUser();
};
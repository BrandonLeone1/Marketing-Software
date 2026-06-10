import { newUser } from "./newUser"

export type LoginProps = {
    loginUser: (newUser: newUser) => Promise<void>
}
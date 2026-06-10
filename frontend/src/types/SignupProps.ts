import { newUser } from "./newUser"

export type SignupProps = {
    signupUser: (newUser: newUser) => Promise<void>
}
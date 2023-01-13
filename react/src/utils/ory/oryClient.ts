import { Configuration, FrontendApi } from "@ory/client"

export const BASE_PATH = import.meta.env.VITE_ORY_URL || "http://127.0.0.1:4455"
export const frontEndOryApi = new FrontendApi(new Configuration({
    basePath: `${BASE_PATH}/.ory/kratos/public`,
    baseOptions: {
        withCredentials: true
    }
}))


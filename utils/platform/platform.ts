import { axiosApp } from "./config"
import { ApiResponse, PostAuthPayload, PostAuthRequest } from "./types"

export const getPaseto = async (supabaseToken: string): Promise<string> => {
    const req: PostAuthRequest = {
        supabaseToken
    }
    const authRes = await axiosApp.post<ApiResponse<PostAuthPayload>>("auth", req)

    return authRes.data.payload.token
}
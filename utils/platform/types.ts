export interface ApiResponse<T> {
    status: number
    message: string
    payload: T
}

export interface PostAuthPayload {
    token: string
}

export interface PostAuthRequest {
    supabaseToken: string
}

export const setPlatformPaseto = (paseto: string) => {
    localStorage.setItem("PLATFORM_PASETO", paseto)
}

export const getPlatformPaseto = (): string | null => {
    return localStorage.getItem("PLATFORM_PASETO")
}

export const removePlatformPaseto = () => {
    localStorage.removeItem("PLATFORM_PASETO")
}
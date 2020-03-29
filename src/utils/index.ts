export const logError = (s: string) => console.error(s);
export const logInfo = (s: string) => console.log(s);
export const logDetail = (s: string) => console.log(s);

export const logTrace = (s: string) => console.trace(s);

export function validateTime(time: number) : boolean {
    return (new Date(time)).getTime() > 0;
}

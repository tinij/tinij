export const logError = (s: string) => console.error(s);
export const logInfo = (s: string) => console.log(s);
export const logDetail = (s: string) => console.log(s);

export const logTrace = (s: string) => console.trace(s);

export function validateTime(time: number) : boolean {
    return (new Date(time)).getTime() > 0;
}

export function validateDateTime(time: Date) : boolean {
    let utcDate = new Date(new Date().toUTCString());
    
    console.log(utcDate);

    let previousDay = new Date(utcDate);
    let nextDay = new Date(utcDate);

    previousDay.setDate(previousDay.getDate() - 1);
    nextDay.setDate(nextDay.getDate() + 1);
    
    if (time.getTime() < previousDay.getTime() || time.getTime() > nextDay.getTime()) {
        return false;
    }
    return true;
}
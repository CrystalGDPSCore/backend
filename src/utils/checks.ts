import { Secret } from "../helpers/enums";

export function checkSecret(requestSecret: string, checkingSecret: Secret) {
    if (requestSecret == checkingSecret) {
        return true;
    }
    
    return false;
}
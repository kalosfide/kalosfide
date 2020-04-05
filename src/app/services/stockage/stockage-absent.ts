
    export function stockageAbsent(nom: string) {
        return window.sessionStorage[nom] === undefined ||
            window.sessionStorage[nom] === null ||
            window.sessionStorage[nom] === 'null' ||
            window.sessionStorage[nom] === 'undefined' ||
            window.sessionStorage[nom] === '';
    }

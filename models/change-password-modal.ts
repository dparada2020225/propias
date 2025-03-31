export const PasswordDefinition = {
    regexPasswordList: ["[0-9]","[a-z]","[A-Z]", "[^0-9a-zA-Z<>{}!¡[/]"],
    blacklist: ["<",">","[","]","!","¡","/","\\","{","}","´","`","^","°","&","~","#"],
    blacklistSv: ["~","<",">","!","/","[","]","{","}",";","#","ñ","´","`","^","°","&","#"],
    maxLength: 15,
    maxLengthSv: 15,
    minLength: 10,
    minLengthPA: 8
}

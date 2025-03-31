export enum EVersionHandler {
    ASSETS = 1
}


// Tener en cuenta que cada vez que se modifique el valor de ASSETS 
// se debe colocar la version correspondiente en los nombre de 
// las imagenes en las rutas indicadas.

// 1)-- assets/images/private/{profile}_logo_privado_{version}.png 
// 2)-- assets/images/public/{profile}_logo_login_{version}.png 
// 3)-- assets/images/public/{profile}_logo_{version}.png 
// 4)-- assets/images/logos/{profile}_bp_logo_1_{version}.png 
// 5)-- assets/images/logos/{profile}_bp_logo_{version}.png
// 6)-- assets/images/logos/{profile}_logo_{version}.png
// 7)-- assets/images/gif/LoaderBR/Loader_{profile}_${version}.png
// 8)-- assets/images/gif/LoaderBR/Loader_{profile}_${version}.gif
// 9)-- assets/images/favicon/favicon_{profile}_{version}.png 
// 10)-- assets/img/table_{version}.png 
// 11)-- assets/img/table-mobile_{version}.png
// 12)-- index.banpais.html - Lineas (23)
// 13)-- index.bisv.html - Lineas (80, 90)
// 14)-- index.bipa.html - Lineas (23, 86)
// 15)-- index.html - Lineas (75, 90)
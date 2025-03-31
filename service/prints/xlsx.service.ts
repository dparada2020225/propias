
import { Workbook, Worksheet } from 'exceljs';
import { saveAs } from 'file-saver';

/**
 * @author Sebastian Chicoma Sandmann
 *
 *  Clase abstracta para generación de reportes tipo csv y xlsx
 */

// Se declara la clase como clase Abstracta (esto para que esta sea el template base de los prints (clase padre))
export abstract class XlsxService {

 // Se declara el metodo generate, este metodo hace la construccion del excel - csv
    // List: Valores o resumen de cuentas que se mostrara del usuario
    // Data: que datos de USUARIO (nombre, numero de cuenta, etc.),
    // Filname: Nombre del archivo (como se exportara) en caso de que este parametro no sea enviado se le pondra como nombre "PRINT"
    // Type:  Que tipo sera el que se imprimira
    generate(list: any, data: any, filename = 'print', type: 'xlsx' | 'csv' = 'xlsx', ) {
        //Creamos una nuevo libro
        const workbook = new Workbook();

        //Propiedades del libro
        //Nombre
        //Fecha
        //Ultima Fecha
        workbook.creator = 'BYTE';
        workbook.created = new Date();
        workbook.lastPrinted = new Date();
        workbook.views = [
            {
                x: 0, y: 0, width: 10000, height: 20000,
                firstSheet: 0, activeTab: 1, visibility: 'visible'
            }
        ]

        // Creamos un Workbook and Add Worksheet
        let worksheet = workbook.addWorksheet('Sheet 1');


        //Construccion de body
        // Se le pasa como parametro: 
            //List
        this.buildBody(list, data, worksheet, type);

        let buffer: Promise<any> | undefined = undefined;

        if (type === 'csv') {
            buffer = workbook.csv.writeBuffer({ formatterOptions: { delimiter: ',' } });
        } else {
            buffer = workbook.xlsx.writeBuffer();
        }

        // export
        buffer.then((result) => {
            let blob = new Blob([result], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
            saveAs(blob, `${filename}.${type}`);
        });

    }

    // List: Valores o resumen de cuentas que se mostrara del usuario
    // Data: que datos de USUARIO (nombre, numero de cuenta, etc.),
    // worksheet: una nueva instanacia de Worksheet
    // Type:  Que tipo sera el que se imprimira
    abstract buildBody(list: any, data: any, worksheet: Worksheet, type: string ): void;
    // abstract buildBody(list: any, worksheet: any): void;

}
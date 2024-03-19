const electron = require('electron');


const { Tray, app, Menu } = electron;

const contextMenu = Menu.buildFromTemplate([
{
    label: 'Sair',
    click: () => {
        app.quit();
    }
}
]);

//SubClasse ChornoTray extend para Tray 
class ChronoTray extends Tray {
    constructor(iconPath, mainWindow) {
        super(iconPath); // aqui estou chamando o contrutor do Tray

        this.mainWindow = mainWindow;

        //Vamos utilizar o funcao bind() para que o metodo onCLick
        //tenha a sua palavra chave this associada ao escopo correcto. 
        // O metodo bind() cria uma nova funcao quando chamada tem 
        // sua palavra chave this definida com o valor definido
        this.on('click', this.onClick.bind(this));

        this.setContextMenu(contextMenu);
    }

    //METODO ESPECIFICO DA CLASSE ChronoTray
    onClick = (event, bounds) => {   
        // COORDENADAS DO ICONE DA BANDEJA
        // DISTRUTURÇÃO DE OBJECTO      
        const { x, y } = bounds;

        // DIMENSOES DA JANELA (lARGURA E ALTURA)

        const { width, height } = this.mainWindow.getBounds();

        if (this.mainWindow.isVisible()) {

            this.mainWindow.hide();

        } else {

            this.mainWindow.setBounds({
                // x: x >= 400 ? x - width / 2 : x,
                // y: y >= 300 ? y - height : y,
                x: 1050,
                y: y >= 300 ? y - height : y,
                width,
                height
            });

            this.mainWindow.show();
        }
    };

    
   

}


module.exports = ChronoTray;


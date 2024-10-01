function dividirTextoCada10Caracteres(texto) {
    let resultado = '';
    let palabras = texto.split(' '); // Dividimos el texto por espacios

    for (let i = 0; i < palabras.length; i++) {
        resultado += palabras[i];
        
        // Agregar un espacio si no es el final de la línea
        if ((i + 1) % 2 !== 0 && i !== palabras.length - 1) {
            resultado += ' ';
        }

        // Agregar un salto de línea cada dos palabras o al final
        if ((i + 1) % 2 === 0 || i === palabras.length - 1) {
            resultado += '\n';
        }
    }
    
    return resultado;
}

function mostrarCampoOtro() {
    const tipoIncidenteSelect = document.getElementById('tipo_incidente');
    const campoOtro = document.getElementById('campo_otro');

    if (tipoIncidenteSelect.value === "otros") {
        campoOtro.style.display = 'block'; // Muestra el campo de especificación
    } else {
        campoOtro.style.display = 'none'; // Oculta el campo de especificación
    }
}
function loadImage(url) {
    return new Promise(resolve => {
        const xhr = new XMLHttpRequest();
        xhr.open('GET', url, true);
        xhr.responseType = "blob";
        xhr.onload = function (e) {
            const reader = new FileReader();
            reader.onload = function(event) {
                const res = event.target.result;
                resolve(res);
            }
            const file = this.response;
            reader.readAsDataURL(file);
        }
        xhr.send();
    });
}
window.addEventListener('load', async () => {
    const form = document.querySelector('#form');
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        let areaReportante = document.getElementById('area_reportante').value;
        let nombres = document.getElementById('nombre').value;
        let dni_reportante = document.getElementById('dni_reportante').value;
        let areaIncidente = document.getElementById('area_inc').value;

        let fecha_incidente = document.getElementById('fecha_incidente').value;
        let hora_incidente = document.getElementById('hora_incidente').value;


        let comentarios = document.getElementById('comentarios').value;
        let medida_correctiva = document.getElementById('medida_correctiva').value; 
        let tercer_textarea = document.getElementById('tercer_textarea').value;

        let tipoIncidente = document.getElementById('tipo_incidente').value;
        let otroTipo = tipoIncidente === "otros" ? document.getElementById('otro_tipo').value : "";


        let nombre1 = document.getElementById('nombre1').value;
        let dni1 = document.getElementById('dni1').value;
        let nombre2= document.getElementById('nombre2').value;
        let dni2 = document.getElementById('dni2').value;


        let causas_incidente = document.querySelector('input[name="causas_incidente"]:checked').value;
         let causas_incidenteShort = '';
         switch (causas_incidente) {
             case 'Acto sub estandar':
                 causas_incidenteShort = 'Acto sub estandar';
                 break;
             case 'Condicion':
                 causas_incidenteShort = 'Condicion';
                 break;
             case 'Incidente':
                 causas_incidenteShort = 'Incidente';
                 break;
            case 'Incidente ambiental':
                 causas_incidenteShort = 'Incidente ambiental';
                 break;
         }

         let nivel_riesgo = document.querySelector('input[name="nivel_riesgo"]:checked').value;
         let nivel_riesgoShort = '';
         switch (nivel_riesgo) {
             case 'Alto':
                 nivel_riesgoShort = 'Alto';
                 break;
             case 'Medio':
                 nivel_riesgoShort = 'Medio';
                 break;
             case 'Bajo':
                 nivel_riesgoShort = 'Bajo';
                 break;
         }

        // Llamar a la función generatePDF con las variables necesarias
        generatePDF(
            areaReportante,
            nombres,
            dni_reportante, 
            areaIncidente,

            tipoIncidente,
            otroTipo,

            fecha_incidente,
            hora_incidente,

            causas_incidenteShort,
            nivel_riesgoShort,



            comentarios, 
            medida_correctiva,
            tercer_textarea,

            nombre1,
            nombre2,
            dni1,
            dni2
        
        );
    })
});

async function generatePDF(
    areaReportante,
    nombres,
    dni_reportante, 
    areaIncidente,

    tipoIncidente,
    otroTipo,

    fecha_incidente,
    hora_incidente,

    causas_incidente,
    nivel_riesgo,

    comentarios, 
    medida_correctiva,
    tercer_textarea,

    nombre1,
    nombre2,
    dni1,
    dni2
    ) {
    // Cargar la imagen JPG
    const image = await loadImage("formulario1.jpg");
        
    // Crear una nueva instancia de jsPDF
    const pdf = new jsPDF('p', 'pt', 'letter');

    // Agregar la imagen JPG al PDF
    pdf.addImage(image, 'PNG', 0, 0, 565, 792);

    // Obtener la fecha actual
    const date = new Date();
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); 
    const year = date.getFullYear().toString();
    

    // Obtener la hora actual
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const seconds = date.getSeconds().toString().padStart(2, '0');

    //Area reportante
    const areaRepor = dividirTextoCada10Caracteres(areaReportante);
    pdf.setFontSize(10);
    pdf.text(areaRepor, 80, 170);

    // ¡Ahora dividimos el nombre cada 10 caracteres!
    pdf.setFontSize(10);
    const nombresDivididos = dividirTextoCada10Caracteres(nombres);
    pdf.text(nombresDivididos, 190, 170); 
    pdf.setFontSize(10);

    //FIRMA
    pdf.text(`De: ${nombres}`, 315, 170);
    pdf.text(`DNI: ${dni_reportante}`, 315, 180); 
    const formattedTime = `${hours}:${minutes}:${seconds}`;
    pdf.text(`Hora: ${formattedTime}`, 315, 190);  
    const formattedDate = `${day}/${month}/${year}`;
    pdf.text(`Fecha: ${formattedDate}`, 315, 200);  

    //area incidente
    const maxLineWidth0 = 200; 
    const startX0 = 80;  
    const startY0 = 227; 
    const lineHeight0 = 14;  
    const splitText0 = pdf.splitTextToSize(areaIncidente, maxLineWidth0);
    for (let i = 0; i < splitText0.length; i++) {
        pdf.text(splitText0[i], startX0, startY0+ (i * lineHeight0));
    }

    //select

    // Suponiendo que ya tienes las variables tipoIncidente y otroTipo definidas
    pdf.setFontSize(10);

    // Manejo de cada tipo de incidente
    if (tipoIncidente === "caida_personas") {
        pdf.text(`1`, 140, 305);
    } else if (tipoIncidente === "caida_objetos") {
        pdf.text(`2`, 140, 305);
    } else if (tipoIncidente === "desprendimiento_rocas") {
        pdf.text(`3`, 140, 305);
    } else if (tipoIncidente === "choques_carga_descarga") {
        pdf.text(`4`, 140, 305);
    } else if (tipoIncidente === "choques_manipuleo") {
        pdf.text(`5`, 140, 305);
    } else if (tipoIncidente === "choques_transito") {
        pdf.text(`6`, 140, 305);
    } else if (tipoIncidente === "atrapado_maquinarias") {
        pdf.text(`7`, 140, 305);
    } else if (tipoIncidente === "atrapado_chutes") {
        pdf.text(`8`, 140, 305);
    } else if (tipoIncidente === "atrapado_succion") {
        pdf.text(`9`, 140, 305);
    } else if (tipoIncidente === "atrapado_derrumbe") {
        pdf.text(`10`, 140, 305);
    } else if (tipoIncidente === "atrapado_perforacion") {
        pdf.text(`11`, 140, 305);
    } else if (tipoIncidente === "golpes_detonacion") {
        pdf.text(`12`, 140, 305);
    } else if (tipoIncidente === "golpes_herramientas") {
        pdf.text(`13`, 140, 305);
    } else if (tipoIncidente === "exposicion_temperaturas") {
        pdf.text(`14`, 140, 305);
    } else if (tipoIncidente === "exposicion_energia") {
        pdf.text(`15`, 140, 305);
    } else if (tipoIncidente === "exposicion_radiaciones") {
        pdf.text(`16`, 140, 305);
    } else if (tipoIncidente === "exposicion_tormentas") {
        pdf.text(`17`, 140, 305);
    } else if (tipoIncidente === "exposicion_sustancias") {
        pdf.text(`18`, 140, 305);
    } else if (tipoIncidente === "exposicion_gases") {
        pdf.text(`19`, 140, 305);
    } else if (tipoIncidente === "exposicion_ingerir") {
        pdf.text(`20`, 140, 305);
    } else if (tipoIncidente === "esfuerzos_excesivos") {
        pdf.text(`21`, 140, 305);
    } else if (tipoIncidente === "otros") {
        pdf.text(dividirTextoCada10Caracteres(otroTipo), 85, 290); // Mantener en la misma posición
    }
    



    //fecha y hora incidentes
    pdf.setFontSize(10);
    pdf.text('Año - Mes - Dia', 330, 240);
    pdf.text(fecha_incidente, 330, 250);
    pdf.text(hora_incidente, 440, 250);

    //PARA MANEJAR LOS COMENTARIOS
    const maxLineWidth = 400; 
    const startX = 90;  
    const startY = 390; 
    const lineHeight = 14;  
    const splitText = pdf.splitTextToSize(comentarios, maxLineWidth);
    for (let i = 0; i < splitText.length; i++) {
        pdf.text(splitText[i], startX, startY + (i * lineHeight));
    }

    const maxLineWidth1 = 223; 
    const startX1 = 80;  
    const startY1 = 530; 
    const lineHeight1 = 14;  
    const splitText1 = pdf.splitTextToSize(medida_correctiva, maxLineWidth1);
    for (let i = 0; i < splitText1.length; i++) {
        pdf.text(splitText1[i], startX1, startY1 + (i * lineHeight1));
    }

    const maxLineWidth2 = 111.5; 
    const startX2 = 312 ;  
    const startY2= 530; 
    const lineHeight2 = 14;  
    const splitText2 = pdf.splitTextToSize(tercer_textarea, maxLineWidth2);
    for (let i = 0; i < splitText2.length; i++) {
        pdf.text(splitText2[i], startX2, startY2 + (i * lineHeight2));
    }

    //cheks

    

    if (causas_incidente === 'Acto sub estandar') {
        pdf.text('X', 305, 296);
    } else if (causas_incidente === 'Condicion') {
        pdf.text('X', 459, 296);
    } else if (causas_incidente === 'Incidente') {
        pdf.text('X', 305, 310);
    }else if (causas_incidente === 'Incidente ambiental') {
            pdf.text('X', 459, 311.3);
    }

    pdf.setFontSize(10); // Ajusta el tamaño de fuente si es necesario

    if (nivel_riesgo === 'Alto') {
        pdf.setTextColor(255, 0, 0); // Rojo para Alto
        pdf.text('X', 110, 356);
        pdf.text('X', 487, 535);
    } else if (nivel_riesgo === 'Medio') {
        pdf.setTextColor(128, 0, 128); // Morado para Medio
        pdf.text('X', 252, 356);
        pdf.text('X', 487, 550);
    } else if (nivel_riesgo === 'Bajo') {
        pdf.setTextColor(0, 0, 255); // Azul para Bajo
        pdf.text('X', 380, 356);
        pdf.text('X', 487, 562);
    }
    
    // Restablecer el color de texto a negro después de usar colores
    pdf.setTextColor(0, 0, 0); // Restablecer a negro si es necesario


    //FIRMAS FINALES
    pdf.text(`De: ${nombre1}`, 110, 650);
    pdf.text(`DNI: ${dni1}`, 110, 660); 
    const formattedTime1 = `${hours}:${minutes}:${seconds}`;
    pdf.text(`Hora: ${formattedTime1}`, 110, 670);  
    const formattedDate1 = `${day}/${month}/${year}`;
    pdf.text(`Fecha: ${formattedDate1}`, 110, 680);  

    pdf.text(`De: ${nombre2}`, 315, 650);
    pdf.text(`DNI: ${dni2}`, 315, 660); 
    const formattedTime2 = `${hours}:${minutes}:${seconds}`;
    pdf.text(`Hora: ${formattedTime2}`, 315, 670);  
    const formattedDate2 = `${day}/${month}/${year}`;
    pdf.text(`Fecha: ${formattedDate2}`, 315, 680);  

    // Guardar el archivo PDF
    pdf.save(`ReporteIncidentes${nombres}-${formattedDate}.pdf`);

    location.reload(); // Actualiza la página después de generar el PDF
}

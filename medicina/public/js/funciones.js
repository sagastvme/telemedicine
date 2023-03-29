//el contenedor donde todo ira cambiando
const contenedor = document.getElementById('contenedor');
//esta variable se usa para guardar los medicos a consultar que ha pedido el usuario
let medicosConfirmados = ''
//aqui guardo el emisor sin tener que pedirselo al servidor
let emisor = document.getElementsByTagName('h1')[0].innerHTML.split(' ')[1];
//aqui guardo el codigo de la consulta al que quiere introducir un mensaje
let valor = ''
function cambiarFotoPerfil(event){

    if(confirm('Esta seguro de que quiere cambiar la foto de perfil')){
        const file = event.target.files[0];

        const reader = new FileReader();
        reader.onload = function() {
            document.getElementById('miPerfil').src = reader.result;
        }
        reader.readAsDataURL(file);

        const formData = new FormData();
        formData.append('file', file);

        const xhr = new XMLHttpRequest();
        xhr.open('POST', 'fotoPerfil');
        xhr.send(formData);
    }



}
function borrarFoto(){
    if(confirm('Seguro que quiere borrar su foto')) {
        document.getElementById('miPerfil').src = 'fotosDePerfil/null.jpg';
        var xhttp = new XMLHttpRequest();

        xhttp.open("POST", "borrarFoto", true);
        xhttp.send();
        return false;
    }
}
function misDatos()
{
    //el boton que se usa para llamar a la funcion
    var perfil = document.getElementById('miPerfil');
    //los datos listados
    var datos = document.getElementById('datosListados');

    //si no esta creada la lista se crea
    if (datos === null) {
        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function () {

            if (this.readyState === 4 && this.status === 200) {

                contenedor.innerHTML = '';
                //recibo los datos con los metodos get del usuario
                var datosRecibidos = JSON.parse(this.responseText);
                //creo que la lista
                var lista = document.createElement('ul');
                //añado un id a la lista que creo
                lista.setAttribute('id', 'datosListados');
                if (datosRecibidos.length !== 7) {
                    var etiquetas = ['Correo electrónico: '
                        , 'Nombre: ', 'Apellidos: ',
                        'Número de teléfono: ', ' Fecha de nacimiento: ',
                        'Número de seguridad social: ',
                        'Especialidad de su médico de cabecera: ',
                        'Nombre de su médico de cabecera: ',
                        'Apellidos de su médico de cabecera: ',
                        'Fecha de nacimiento de su médico de cabecera: ']
                } else {
                    var etiquetas = ['Correo electrónico: '
                        , 'Nombre: ', 'Apellidos: ',
                        'Número de teléfono: ', ' Fecha de nacimiento: ',
                        'Número de colegiado: ', 'Especialidad: ']
                }

                for (i = 0; i < datosRecibidos.length; i++) {
                    //voy creando los elementos de la lista y los append
                    var fila = document.createElement('li');
                    fila.innerHTML = etiquetas[i] + datosRecibidos[i];
                    lista.appendChild(fila);
                }
                var fila = document.createElement('li');
                var lfoto = document.createElement('label');
                lfoto.setAttribute('for', 'foto')
                lfoto.innerHTML = 'Subir foto de perfil';
                fila.appendChild(lfoto)


                var foto = document.createElement('input');
                foto.setAttribute('type', 'file');
                foto.setAttribute('accept', "image/png, image/gif, image/jpeg")
                foto.setAttribute('id', 'foto')
                foto.addEventListener('change', cambiarFotoPerfil);
                fila.appendChild(foto)
                lista.appendChild(fila)


                var fila = document.createElement('li');
                var lfoto = document.createElement('button');
                lfoto.addEventListener('click', borrarFoto)
                lfoto.innerHTML = 'Borrar foto de perfil';
                fila.appendChild(lfoto)
                lista.appendChild(fila)
                contenedor.appendChild(lista);












            }
        };
        xhttp.open("POST", "misDatos", true);
        xhttp.send();
        return false;
    }
    datos.hidden = !datos.hidden;
}

function mensajear(event) {


    switch (event.target.innerHTML) {
        case 'Confirmar especialidad':
            imprimirMedicos();
            break;
        case 'Confirmar doctores':
            pedirDatosMensaje();
            break;
        case 'Confirmar consulta':
            crearConsulta();
            break;
    }
}

function imprimirEspecialidades() {
    var etiqueta = document.getElementById('etiqueta');
    if (etiqueta === null) {

        contenedor.innerHTML = ''

        datosRecibidos = crearArrayEspecialidades();
        var etiqueta = document.createElement('label');
        etiqueta.setAttribute('id', 'etiqueta')
        etiqueta.setAttribute('for', 'especialidades');
        etiqueta.innerHTML = 'Escoja la especialidad que necesita: ';

        contenedor.appendChild(etiqueta);
        var lista = document.createElement('select');
        lista.setAttribute('name', 'especialidades');
        lista.setAttribute('id', 'especialidades');
        for (i = 0; i < datosRecibidos.length; i++) {


            var fila = document.createElement('option');
            fila.value = datosRecibidos[i];
            fila.innerHTML = datosRecibidos[i];
            lista.appendChild(fila);

            contenedor.appendChild(lista);


        }
        var boton = document.createElement('button');
        boton.setAttribute('id', 'botonMensajear');
        boton.innerHTML = 'Confirmar especialidad';
        boton.addEventListener('click', mensajear)
        contenedor.appendChild(boton)
    } else {
        document.getElementById('etiqueta').hidden = !document.getElementById('etiqueta').hidden;
        document.getElementById('especialidades').hidden = !document.getElementById('especialidades').hidden;
        document.getElementById('botonMensajear').hidden = !document.getElementById('botonMensajear').hidden;
    }

}


function imprimirMedicos() {
    var especialidad_elegida = document.getElementById('especialidades').options[document.getElementById('especialidades').selectedIndex].text;

    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState === 4 && this.status === 200) {

            contenedor.innerHTML = ''

            var table = document.createElement('table');
            //recibo los datos con los metodos get del usuario
            var datosRecibidos = JSON.parse(this.responseText);
            Object.entries(datosRecibidos).forEach(([key, value]) => {
                var tr = document.createElement('tr')
                var td = document.createElement('td')
                var checkbox = document.createElement('input');
                checkbox.setAttribute('id', value);
                checkbox.setAttribute('value', key);
                checkbox.setAttribute('class', 'medicos');
                checkbox.setAttribute('type', 'checkbox');
                var label = document.createElement('label');
                label.setAttribute('for', value);
                label.innerHTML = value;

                td.appendChild(checkbox)
                td.appendChild(label);


                tr.appendChild(td)
                table.appendChild(tr);


            });
            contenedor.innerHTML = '';
            contenedor.appendChild(table);
            var boton = document.createElement('button');
            boton.setAttribute('id', 'botonMensajear');
            boton.innerHTML = 'Confirmar doctores';
            boton.addEventListener('click', mensajear)
            contenedor.appendChild(boton)

        }
    };
    xhttp.open("POST", "doctores?especialidad=" + especialidad_elegida, true);
    xhttp.send();
    return false;


}

function crearArrayEspecialidades() {
    datosRecibidos = [];
    datosRecibidos.push('Medicina general');
    datosRecibidos.push('Pediatría');
    datosRecibidos.push('Traumatología');
    datosRecibidos.push('Urgencias');
    datosRecibidos.push('Dermatología');
    datosRecibidos.push('Ginecología');
    datosRecibidos.push('Cardiología');
    datosRecibidos.push('Geriatría');

    return datosRecibidos;
}


function pedirDatosMensaje() {

    medicosConfirmados = comprobarCasillasMarcadas();

    if (medicosConfirmados === 'Empty') {
        alert('Debes elegir minimo a un medico')
        medicosConfirmados = comprobarCasillasMarcadas();
    } else {
        contenedor.innerHTML = ''
        var table = document.createElement('table');
        //emisor
        var tr = document.createElement('tr')
        var td = document.createElement('td')
        td.innerHTML = 'Emisor ' + emisor;
        tr.appendChild(td);
        table.appendChild(tr);

//receptor
        var tr = document.createElement('tr')
        var td = document.createElement('td')
        receptor = ''
        Object.entries(medicosConfirmados).forEach(([key, value]) => {
            receptor += key;
        });
        td.innerHTML = 'Receptor: ' + receptor;
        tr.appendChild(td);
        table.appendChild(tr);

//asunto

        var tr = document.createElement('tr')
        var td = document.createElement('td')
        var input = document.createElement('input');
        input.setAttribute('type', 'text');
        input.setAttribute('id', 'asunto');

        var label = document.createElement('label');
        label.setAttribute('for', 'asunto');
        label.innerHTML = 'Asunto:'
        td.appendChild(label)
        td.appendChild(input);
        tr.appendChild(td);
        table.appendChild(tr);


        //cuerpo
        var tr = document.createElement('tr')
        var td = document.createElement('td')
        var input = document.createElement('textarea');

        input.setAttribute('id', 'cuerpo');

        var label = document.createElement('label');
        label.setAttribute('for', 'cuerpo');
        label.innerHTML = 'Escriba aqui su primer mensaje:'
        td.appendChild(label)

        td.appendChild(input);
        tr.appendChild(td);
        table.appendChild(tr);
        contenedor.appendChild(table)
        var boton = document.createElement('button');
        boton.setAttribute('id', 'botonMensajear');
        boton.innerHTML = 'Confirmar consulta';
        boton.addEventListener('click', mensajear)
        contenedor.appendChild(boton)

    }
}

function comprobarCasillasMarcadas() {

    var confirmados = [];
    var entro = true;
    var casillas = document.getElementsByClassName('medicos');
    for (i = 0; i < casillas.length; i++) {
        if (casillas[i].checked) {
            confirmados[casillas[i].id] = casillas[i].value;
            entro = false;
        }
    }
    if (entro) {
        return 'Empty';
    }
    return confirmados;
}

function crearConsulta() {

    var asunto = document.getElementById('asunto').value
    var cuerpo = document.getElementById('cuerpo').value
    if (asunto === '' || cuerpo === '') {
        alert('Por favor compruebe que los datos no estén en blanco');
    } else {
        var medicosEnviar = '';
        Object.entries(medicosConfirmados).forEach(([key, value]) => {
            medicosEnviar += value + '_';
        });
        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function () {
            if (this.readyState === 4 && this.status === 200) {
                var datosRecibidos = JSON.parse(this.responseText);
                if (datosRecibidos[0] === 'true') {
                    var titulo = document.createElement('h2');
                    titulo.innerHTML = 'Enhorabuena tu consulta se ha creado correctamente';
                }
                contenedor.innerHTML = '';
                contenedor.appendChild(titulo);


            }
        };
        xhttp.open("POST", "crearconsulta?receptor=" + medicosEnviar + '&cuerpo=' + cuerpo + '&asunto=' + asunto, true);
        xhttp.send();
        return false;
    }
}

function crearBuscadorReceta() {
    var botonReceta = document.getElementById('lReceta');
    if (botonReceta === null) {
contenedor.innerHTML='';
        var label = document.createElement("label");
        label.setAttribute("for", "receta");
        label.setAttribute("id", "lReceta");
        label.innerHTML = 'Introduce el código de la receta';
        document.getElementById('contenedor').appendChild(label);

        var input = document.createElement("input");
        input.setAttribute("type", "number");
        input.setAttribute("id", "codReceta");
        document.getElementById('contenedor').appendChild(input);
        input.focus();
        var boton = document.createElement("button");
        boton.setAttribute("id", "botonReceta");
        boton.addEventListener('click', buscarReceta);
        boton.innerHTML = 'Consultar receta';
        document.getElementById('contenedor').appendChild(boton);
    } else {
        document.getElementById("codReceta").value = '';
        document.getElementById("codReceta").hidden = !document.getElementById("codReceta").hidden
        document.getElementById("lReceta").hidden = !document.getElementById("lReceta").hidden
       var boton= document.getElementById("botonReceta");
        if(boton){
            boton.remove();
        }else{
            var boton = document.createElement("button");
            boton.setAttribute("id", "botonReceta");
            boton.addEventListener('click', buscarReceta);
            boton.innerHTML = 'Consultar receta';
            document.getElementById('contenedor').appendChild(boton);
        }
        if (document.getElementById("listaReceta")) {
            document.getElementById("listaReceta").remove();
        }
        document.getElementById("codReceta").focus();
    }

}

function buscarReceta() {

    var codigo = document.getElementById('codReceta').value;
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState === 4 && this.status === 200) {
            if (document.getElementById('listaReceta')) {
                document.getElementById('listaReceta').remove();
            }

            var datosRecibidos = JSON.parse(this.responseText);

            if (datosRecibidos.length > 1) {
                var lista = document.createElement('ul');
//codReceta
                var elemento = document.createElement('li');
                elemento.innerHTML = 'Codigo de la receta: ' + datosRecibidos[0];
                elemento.setAttribute('id', datosRecibidos[0]);
                lista.appendChild(elemento);
//codPaciente
                elemento = document.createElement('li');
                elemento.innerHTML = 'Nombre del paciente: ' + datosRecibidos[1];
                elemento.setAttribute('id', datosRecibidos[1]);
                lista.appendChild(elemento);

                //nombre Medicamento
                elemento = document.createElement('li');
                elemento.innerHTML = 'Nombre del medicamento: ' + datosRecibidos[2];
                elemento.setAttribute('id', datosRecibidos[2]);
                lista.appendChild(elemento);
                //codigo Medico
                elemento = document.createElement('li');
                elemento.innerHTML = 'Nombre del medico: ' + datosRecibidos[3];
                elemento.setAttribute('id', datosRecibidos[3]);
                lista.appendChild(elemento);

                //dosis
                elemento = document.createElement('li');
                elemento.innerHTML = 'Dosis recetada: ' + datosRecibidos[4];
                elemento.setAttribute('id', datosRecibidos[4]);
                lista.appendChild(elemento);
                //cantidad
                elemento = document.createElement('li');
                elemento.innerHTML = 'Cantidad recetada: ' + datosRecibidos[5];
                elemento.setAttribute('id', datosRecibidos[5]);
                lista.appendChild(elemento);
                //motivo
                elemento = document.createElement('li');
                elemento.innerHTML = 'Motivo de la receta: ' + datosRecibidos[6];
                elemento.setAttribute('id', datosRecibidos[6]);
                lista.appendChild(elemento);

                elemento = document.createElement('li');
                elemento.innerHTML = 'Fecha de la receta: ' + datosRecibidos[7];
                elemento.setAttribute('id', datosRecibidos[7]);
                lista.appendChild(elemento);

                lista.setAttribute('id', 'listaReceta');
                document.getElementById('contenedor').appendChild(lista);
            } else {
                alert('no hay una receta asi');
                document.getElementById("codReceta").value = '';
                document.getElementById("codReceta").focus();
            }

        }
    };
    xhttp.open("POST", "consultarReceta?codigo=" + codigo, true);

    xhttp.send();
    return false;

}

function tusConsultas() {

    var lista = document.getElementById('listaConsultas');

    if (lista === null) {
        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function () {
            if (this.readyState === 4 && this.status === 200) {
                var datosRecibidos = JSON.parse(this.responseText);
                if (Object.keys(datosRecibidos).length>0) {
                    var lista = document.createElement('ul');
                    lista.setAttribute('id', 'listaConsultas');
                    Object.entries(datosRecibidos).forEach(([key, value]) => {
                        var ul = document.createElement('li');
                        var enlace = document.createElement('a');
                        enlace.setAttribute('href', '#');
                        enlace.innerHTML = value;
                        enlace.setAttribute('value', key);
                        enlace.addEventListener('click', mostrarConsulta);
                        ul.appendChild(enlace);
                        lista.appendChild(ul)
                    });
                    contenedor.innerHTML = '';
                    contenedor.appendChild(lista);
                }else{
                    contenedor.innerHTML = '';
                    var h2=document.createElement('h2');
                    h2.innerHTML ='Aún no tiene consultas';
                    contenedor.appendChild(h2);

                }
            }
        };
        xhttp.open("POST", "tusConsultas?", true);
        xhttp.send();
        return false;
    } else {
        lista.hidden = !lista.hidden;
    }

}

function mostrarConsulta(event) {
    valor = event.target.getAttribute('value');
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState === 4 && this.status === 200) {
            var datosRecibidos = JSON.parse(this.responseText);
            contenedor.innerHTML = '';
            var h1 = document.createElement('h1');
            h1.innerHTML = event.target.innerHTML;
            var lista = document.createElement('ol');
            lista.setAttribute('id', 'conversacion');

            Object.entries(datosRecibidos).forEach(([key, value]) => {


                var li = document.createElement('li');
                var imagen2=document.createElement('img');
                imagen2.setAttribute('src', datosRecibidos[key].Imagen);

                li.appendChild(imagen2)
                li.setAttribute('class', datosRecibidos[key].Leido);
                li.innerHTML += '[' + datosRecibidos[key].Fecha + ']' + datosRecibidos[key].Tipo + ' ' + datosRecibidos[key].Emisor + ': ' + datosRecibidos[key].Contenido




                lista.appendChild(li);

            });
            var boton = document.createElement('button')
            boton.addEventListener('click', enviarMensaje);
            boton.innerHTML = 'Enviar mensaje'
            var lmensaje = document.createElement('label')
            lmensaje.innerHTML = 'Escriba aqui su mensaje'
            lmensaje.setAttribute('for', 'mensaje')
            var mensaje = document.createElement('textarea')
            mensaje.setAttribute('id', 'mensaje')
            contenedor.appendChild(h1)
            contenedor.appendChild(lista)
            contenedor.appendChild(lmensaje)
            contenedor.appendChild(mensaje)

            contenedor.appendChild(boton)
            if (document.getElementById('manejadorRecetas')) {
                var boton = document.createElement('button')
                boton.addEventListener('click', recetar);
                boton.innerHTML = 'Crear receta'
                boton.setAttribute('id', 'recetarOriginal')
                boton.setAttribute('value', valor)
                contenedor.appendChild(boton)
            }
        }
    };
    xhttp.open("POST", "datosConsulta?consulta=" + valor, true);
    xhttp.send();
    return false;
}

function enviarMensaje() {
    var cuerpo = document.getElementById('mensaje').value;
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState === 4 && this.status === 200) {
            var datosRecibidos = JSON.parse(this.responseText);
            var li = document.createElement('li');
            li.setAttribute('class', datosRecibidos['Leido']);

            document.getElementById('mensaje').value = '';
            var imagen2=document.createElement('img');
            imagen2.setAttribute('src', datosRecibidos['Imagen']);

            li.appendChild(imagen2)
            li.innerHTML += '[' + datosRecibidos['Fecha'] + ']' + datosRecibidos['Tipo'] + ' ' + datosRecibidos['Emisor'] + ': ' + datosRecibidos['Contenido']

            document.getElementById('conversacion').appendChild(li);
        }
    };
    xhttp.open("POST", "insertarMensaje?codigo=" + valor + '&cuerpo=' + cuerpo, true);
    xhttp.send();
    return false;
}


function mensajearMedicos() {
    var etiqueta = document.getElementById('etiqueta');
    if (etiqueta === null) {

        contenedor.innerHTML = ''


        var etiqueta = document.createElement('label');
        etiqueta.setAttribute('id', 'etiqueta')
        etiqueta.setAttribute('for', 'especialidades');
        etiqueta.innerHTML = 'Escoja si va a escribir a un medico o paciente ';

        contenedor.appendChild(etiqueta);
        var lista = document.createElement('select');
        lista.setAttribute('name', 'tipo');
        lista.setAttribute('id', 'tipo');


        var fila = document.createElement('option');
        fila.value = 'Paciente';
        fila.innerHTML = 'Paciente';
        lista.appendChild(fila);

        contenedor.appendChild(lista);


        var fila = document.createElement('option');
        fila.value = 'Medico';
        fila.innerHTML = 'Medico';
        lista.appendChild(fila);

        contenedor.appendChild(lista);


        var boton = document.createElement('button');
        boton.setAttribute('id', 'botonMensajear');
        boton.innerHTML = 'Confirmar tipo';
        boton.addEventListener('click', mensajearM)
        contenedor.appendChild(boton)
    } else {
        document.getElementById('etiqueta').hidden = !document.getElementById('etiqueta').hidden;
        document.getElementById('tipo').hidden = !document.getElementById('tipo').hidden;
        document.getElementById('botonMensajear').hidden = !document.getElementById('botonMensajear').hidden;
    }
}

function mensajearM(event) {


    switch (event.target.innerHTML) {
        case 'Confirmar tipo':
            imprimirTipo();
            break;
        case 'Confirmar destinatarios':
            pedirDatosMensajeMedicos();
            break;
    }
}

function imprimirTipo() {
    var tipo = document.getElementById('tipo').options[document.getElementById('tipo').selectedIndex].text;
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState === 4 && this.status === 200) {

            contenedor.innerHTML = ''

            var table = document.createElement('table');
            //recibo los datos con los metodos get del usuario
            var datosRecibidos = JSON.parse(this.responseText);
            Object.entries(datosRecibidos).forEach(([key, value]) => {
                var tr = document.createElement('tr')
                var td = document.createElement('td')
                var checkbox = document.createElement('input');
                checkbox.setAttribute('id', value);
                checkbox.setAttribute('value', key);
                checkbox.setAttribute('class', 'destinatario');
                checkbox.setAttribute('type', 'checkbox');
                var label = document.createElement('label');
                label.setAttribute('for', value);
                label.innerHTML = value;

                td.appendChild(checkbox)
                td.appendChild(label);


                tr.appendChild(td)
                table.appendChild(tr);


            });
            contenedor.innerHTML = '';
            contenedor.appendChild(table);
            var boton = document.createElement('button');
            boton.setAttribute('id', 'botonMensajear');
            boton.innerHTML = 'Confirmar destinatarios';
            boton.addEventListener('click', mensajearM)
            contenedor.appendChild(boton)

        }
    };
    xhttp.open("POST", "sacarReceptores?tipo=" + tipo, true);
    xhttp.send();
    return false;


}

function comprobarCasillasMarcadasMedicos() {

    var confirmados = [];
    var entro = true;
    var casillas = document.getElementsByClassName('destinatario');
    for (i = 0; i < casillas.length; i++) {
        if (casillas[i].checked) {
            confirmados[casillas[i].id] = casillas[i].value;
            entro = false;
        }
    }
    if (entro) {
        return 'Empty';
    }
    return confirmados;
}

function pedirDatosMensajeMedicos() {

    medicosConfirmados = comprobarCasillasMarcadasMedicos();

    if (medicosConfirmados === 'Empty') {
        alert('Debes elegir minimo a un destinatario')
        medicosConfirmados = comprobarCasillasMarcadas();
    } else {
        contenedor.innerHTML = ''
        var table = document.createElement('table');
        //emisor
        var tr = document.createElement('tr')
        var td = document.createElement('td')
        td.innerHTML = 'Emisor ' + emisor;
        tr.appendChild(td);
        table.appendChild(tr);

//receptor
        var tr = document.createElement('tr')
        var td = document.createElement('td')
        receptor = ''
        Object.entries(medicosConfirmados).forEach(([key, value]) => {
            receptor += key;
        });
        td.innerHTML = 'Receptor: ' + receptor;
        tr.appendChild(td);
        table.appendChild(tr);

//asunto

        var tr = document.createElement('tr')
        var td = document.createElement('td')
        var input = document.createElement('input');
        input.setAttribute('type', 'text');
        input.setAttribute('id', 'asunto');

        var label = document.createElement('label');
        label.setAttribute('for', 'asunto');
        label.innerHTML = 'Asunto:'
        td.appendChild(label)
        td.appendChild(input);
        tr.appendChild(td);
        table.appendChild(tr);


        //cuerpo
        var tr = document.createElement('tr')
        var td = document.createElement('td')
        var input = document.createElement('textarea');

        input.setAttribute('id', 'cuerpo');

        var label = document.createElement('label');
        label.setAttribute('for', 'cuerpo');
        label.innerHTML = 'Escriba aqui su primer mensaje:'
        td.appendChild(label)

        td.appendChild(input);
        tr.appendChild(td);
        table.appendChild(tr);
        contenedor.appendChild(table)
        var boton = document.createElement('button');
        boton.setAttribute('id', 'botonMensajear');
        boton.innerHTML = 'Confirmar consulta';
        boton.addEventListener('click', mensajear)
        contenedor.appendChild(boton)

    }
}


function bandejaDeMensajes() {
    var lista = document.getElementById('conversacionBandeja');

    if (lista === null) {
        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function () {
            if (this.readyState === 4 && this.status === 200) {

                var datosRecibidos = JSON.parse(this.responseText);
                if (Object.keys(datosRecibidos).length>0) {
                    contenedor.innerHTML = '';
                    var lista = document.createElement('ol');
                    lista.setAttribute('id', 'conversacionBandeja');
                    Object.entries(datosRecibidos).forEach(([key, value]) => {
                        var li = document.createElement('li');
                        li.setAttribute('class', datosRecibidos[key].Leido);
                        li.innerHTML = datosRecibidos[key].Tipo + ' ' + datosRecibidos[key].Emisor + ': ' + datosRecibidos[key].Contenido
                        lista.appendChild(li);
                    });

                    contenedor.appendChild(lista)
                }else{
                    contenedor.innerHTML = '';
                    var h2=document.createElement('h2');
                    h2.innerHTML ='Aún no tiene mensajes';
                    contenedor.appendChild(h2);
                }

            }
        };
        xhttp.open("POST", "bandeja", true);
        xhttp.send();
        return false;
    } else {
        lista.hidden = !lista.hidden;
    }

}


function manejarRecetas() {


    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState === 4 && this.status === 200) {
            var datosRecibidos = JSON.parse(this.responseText);

            contenedor.innerHTML = '';
            if (datosRecibidos[0] !== 'false') {

                Object.entries(datosRecibidos).forEach(([key, value]) => {
                    var lista = document.createElement('table');
                    lista.setAttribute('id', datosRecibidos[key].Codigodelareceta);

                    var tr = document.createElement('th');
                    var td = document.createElement('td');
                    td.innerHTML = 'Codigo de la receta';
                    tr.appendChild(td);


                    td = document.createElement('td');
                    td.innerHTML = datosRecibidos[key].Codigodelareceta
                    tr.appendChild(td);
                    lista.appendChild(tr);


                    tr = document.createElement('tr');
                    td = document.createElement('td');
                    td.innerHTML = ' Paciente recetado'
                    tr.appendChild(td);
                    lista.appendChild(tr);

                    td = document.createElement('td');
                    td.innerHTML = datosRecibidos[key].Pacienterecetado
                    tr.appendChild(td);
                    lista.appendChild(tr);

                    tr = document.createElement('tr');
                    td = document.createElement('td');
                    td.innerHTML = 'Nombre del medicamento\''
                    tr.appendChild(td);
                    lista.appendChild(tr);

                    td = document.createElement('td');
                    td.innerHTML = datosRecibidos[key].Nombredelmedicamento
                    tr.appendChild(td);
                    lista.appendChild(tr);
                    tr = document.createElement('tr');
                    td = document.createElement('td');
                    td.innerHTML = ' Dosis recetada'
                    tr.appendChild(td);
                    lista.appendChild(tr);

                    td = document.createElement('td');
                    td.innerHTML = datosRecibidos[key].Dosis
                    tr.appendChild(td);
                    lista.appendChild(tr);
                    tr = document.createElement('tr');
                    td = document.createElement('td');
                    td.innerHTML = ' Cantidad recetada'
                    tr.appendChild(td);
                    lista.appendChild(tr);

                    td = document.createElement('td');
                    td.innerHTML = datosRecibidos[key].Cantidad
                    tr.appendChild(td);
                    lista.appendChild(tr);
                    tr = document.createElement('tr');
                    td = document.createElement('td');
                    td.innerHTML = 'Motivo de la receta'
                    tr.appendChild(td);
                    lista.appendChild(tr);

                    td = document.createElement('td');
                    td.innerHTML = datosRecibidos[key].Motivo
                    tr.appendChild(td);
                    lista.appendChild(tr);
                    tr = document.createElement('tr');
                    td = document.createElement('td');
                    td.innerHTML = ' Fecha de la receta'
                    tr.appendChild(td);
                    lista.appendChild(tr);

                    td = document.createElement('td');
                    td.innerHTML = datosRecibidos[key].Fecha
                    tr.appendChild(td);
                    tr.appendChild(td);
                    lista.appendChild(tr);
                    tr = document.createElement('tr');
                    td = document.createElement('td');
                    td.innerHTML = ' Conversacion'
                    tr.appendChild(td);
                    tr.appendChild(td);
                    lista.appendChild(tr);

                    td = document.createElement('td');
                    td.innerHTML = datosRecibidos[key].Conversacion
                    tr.appendChild(td);
                    lista.appendChild(tr);
                    var boton = document.createElement('button');

                    boton.innerHTML = 'Borrar receta con codigo ' + datosRecibidos[key].Codigodelareceta;
                    boton.setAttribute('value', datosRecibidos[key].Codigodelareceta);
                    boton.addEventListener('click', borrarReceta)
                    tr = document.createElement('tr');
                    td = document.createElement('td');
                    td.appendChild(boton)
                    tr.appendChild(td);
                    lista.appendChild(tr);
                    contenedor.appendChild(lista)
                });


            } else {
                var h2 = document.createElement('h2');
                h2.setAttribute('id', 'recetadas');
                h2.innerHTML = 'Usted no ha recetado nada aun '
                contenedor.appendChild(h2)
            }

        }
    };
    xhttp.open("POST", "recetasManejador", true);
    xhttp.send();
    return false;

}

function borrarReceta(event) {
    if (confirm('Esta seguro de que quiere borrar la receta ' + event.target.getAttribute('value'))) {
        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function () {
            if (this.readyState === 4 && this.status === 200) {
                var datosRecibidos = JSON.parse(this.responseText);
                alert('La receta con codigo'+event.target.getAttribute('value')+' se ha borrado correctamente');
                document.getElementById(event.target.getAttribute('value')).remove();

            }
        };
        xhttp.open("POST", "borrarReceta?codigo=" + event.target.getAttribute('value'), true);
        xhttp.send();
        return false;
    }
}

function recetar(event) {
    var codConversacion = (event.target.getAttribute('value'))
    var listaCreada = document.getElementById('listaRecetados');
    if (listaCreada === null) {
        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function () {

            if (this.readyState === 4 && this.status === 200) {
                //recibo los datos con los metodos get del usuario
                var datosRecibidos = JSON.parse(this.responseText)

                var lista = document.createElement('ul');
                if (datosRecibidos.length !== 0) {
                    Object.entries(datosRecibidos).forEach(([key, value]) => {
                        lista.setAttribute('id', 'listaRecetados');
                        var li = document.createElement('li');
                        var checkbox = document.createElement('input');
                        checkbox.setAttribute('type', 'checkbox');
                        checkbox.setAttribute('class', 'destinatario')
                        checkbox.setAttribute('value', value);
                        checkbox.setAttribute('id', key);
                        var label = document.createElement('label');
                        label.setAttribute('for', key);
                        label.innerHTML = value;
                        li.appendChild(checkbox)
                        li.appendChild(label)
                        lista.appendChild(li)
                    });
                    var h3 = document.createElement('h3')
                    h3.innerHTML = 'Elija a que paciente quiere recetar';
                    contenedor.appendChild(h3)

                    var boton = document.createElement('button');
                    boton.innerHTML = 'Recetar';
                    boton.setAttribute('id', 'botonReceta')
                    boton.addEventListener('click', segundoPasoReceta)
                    contenedor.appendChild(lista)
                    contenedor.appendChild(boton)
                } else {
                    alert('Usted no puede recetar porque esta hablando con otro medico')
                    event.target.remove();
                }
            }
        };
        xhttp.open("POST", "crearReceta?codigo=" + codConversacion, true);
        xhttp.send();
        return false;
    }
}

function segundoPasoReceta() {
    medicosConfirmados = comprobarCasillasMarcadasMedicos();

    if (medicosConfirmados === 'Empty') {
        alert('Debes elegir minimo a un destinatario')
        medicosConfirmados = comprobarCasillasMarcadas();
    } else {
        var h3 = document.getElementsByTagName('h3');
        h3[0].innerHTML = 'Rellene los datos de la receta';
        document.getElementById('botonReceta').remove();
        document.getElementById('listaRecetados').remove();

        Object.entries(medicosConfirmados).forEach(([key, value]) => {
            var table = document.createElement('table');
            table.setAttribute('id', key)
            var tr = document.createElement('tr')
            var td = document.createElement('td')
            var input = document.createElement('input');

            td.innerHTML = 'Emisor';
            tr.appendChild(td)
            td = document.createElement('td')

            input.setAttribute('type', 'text')
            input.setAttribute('readonly', 'true');
            input.value = emisor
            td.appendChild(input)
            tr.appendChild(td)
            table.appendChild(tr)

            tr = document.createElement('tr')
            td = document.createElement('td');
            td.innerHTML = 'Receptor';
            tr.appendChild(td)


            td = document.createElement('td')
            var checkbox = document.createElement('input');
            checkbox.setAttribute('id', 'receptor');
            checkbox.setAttribute('value', key)
            checkbox.setAttribute('type', 'text');

            checkbox.setAttribute('readonly', 'true');
            checkbox.value = value
            td.appendChild(checkbox)
            tr.appendChild(td)
            table.appendChild(tr);


            tr = document.createElement('tr');
            td = document.createElement('td');
            td.innerHTML = 'Nombre del medicamento';
            tr.appendChild(td)
            td = document.createElement('td');
            input = document.createElement('input');
            input.setAttribute('id', 'nombreMedicamento')
            input.setAttribute('type', 'text');
            td.appendChild(input);
            tr.appendChild(td)
            table.appendChild(tr)


            tr = document.createElement('tr');
            td = document.createElement('td');
            td.innerHTML = 'Dosis';
            tr.appendChild(td)
            td = document.createElement('td');
            input = document.createElement('input');
            input.setAttribute('id', 'dosis')
            input.setAttribute('type', 'text');
            td.appendChild(input);
            tr.appendChild(td)
            table.appendChild(tr)


            tr = document.createElement('tr');
            td = document.createElement('td');
            td.innerHTML = 'Cantidad';
            tr.appendChild(td)
            td = document.createElement('td');
            input = document.createElement('input');
            input.setAttribute('type', 'text');
            input.setAttribute('id', 'cantidad')
            td.appendChild(input);
            tr.appendChild(td)
            table.appendChild(tr)


            tr = document.createElement('tr');
            td = document.createElement('td');
            td.innerHTML = 'Motivo';
            tr.appendChild(td)
            td = document.createElement('td');
            input = document.createElement('input');
            input.setAttribute('type', 'text');
            input.setAttribute('id', 'motivo')
            td.appendChild(input);
            tr.appendChild(td)
            table.appendChild(tr)

            tr = document.createElement('tr');
            td = document.createElement('td');

            input = document.createElement('button');
            input.addEventListener('click', confirmarReceta);
            input.setAttribute('value', key)
            input.innerHTML = 'Confirmar receta';
            td.appendChild(input);
            tr.appendChild(td)
            table.appendChild(tr)


            contenedor.appendChild(table)

        });
    }
}

function confirmarReceta(event) {
    var nombreMedicamento = document.getElementById('nombreMedicamento').value
    var dosis = document.getElementById('dosis').value;
    var cantidad = document.getElementById('cantidad').value
    var motivo = document.getElementById('motivo').value
    var conversacion = document.getElementById('recetarOriginal').value
    var receptor = document.getElementById('receptor').getAttribute('value')

    if (nombreMedicamento === '' || dosis === '' || cantidad === '' || motivo === '' || conversacion === '' || receptor === '') {
        alert('Por favor revise que todos los datos estan rellenos')
    } else {
        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function () {
            if (this.readyState === 4 && this.status === 200) {
                idTabla = event.target.getAttribute('value')
                var tabla = document.getElementById(idTabla);
                tabla.innerHTML = ''
                var tr = document.createElement('th');
                tr.innerHTML = 'Su receta se ha creado perfectamente';
                tabla.appendChild(tr);
            }
        };
        xhttp.open("POST", "introducirReceta?nombre=" + nombreMedicamento
            + '&dosis=' + dosis + '&cantidad=' + cantidad + '&motivo=' + motivo +
            '&conversacion=' + conversacion + '&receptor=' + receptor, true);
        xhttp.send();
        return false;
    }

}

function borrarCuenta(){
   contenedor.innerHTML ='';
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState === 4 && this.status === 200) {
            contenedor.innerHTML='';
            var h2=document.createElement('h2');
            h2.innerHTML='Se le ha enviado un correo donde puede confirmar la extincion de su cuenta';
            contenedor.appendChild(h2)
      }
    };
    xhttp.open("POST", "borrarCuenta", true);
    xhttp.send();
    return false;
}
function manejarRecetasPaciente(){
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState === 4 && this.status === 200) {
            var datosRecibidos = JSON.parse(this.responseText);

            contenedor.innerHTML = '';
            if (datosRecibidos[0] !== 'false') {

                Object.entries(datosRecibidos).forEach(([key, value]) => {
                    var lista = document.createElement('table');
                    lista.setAttribute('id', datosRecibidos[key].Codigodelareceta);

                    var tr = document.createElement('th');
                    var td = document.createElement('td');
                    td.innerHTML = 'Codigo de la receta';
                    tr.appendChild(td);


                    td = document.createElement('td');
                    td.innerHTML = datosRecibidos[key].Codigodelareceta
                    tr.appendChild(td);
                    lista.appendChild(tr);


                    tr = document.createElement('tr');
                    td = document.createElement('td');
                    td.innerHTML = ' Paciente recetado'
                    tr.appendChild(td);
                    lista.appendChild(tr);

                    td = document.createElement('td');
                    td.innerHTML = datosRecibidos[key].Pacienterecetado
                    tr.appendChild(td);
                    lista.appendChild(tr);

                    tr = document.createElement('tr');
                    td = document.createElement('td');
                    td.innerHTML = 'Nombre del medicamento\''
                    tr.appendChild(td);
                    lista.appendChild(tr);

                    td = document.createElement('td');
                    td.innerHTML = datosRecibidos[key].Nombredelmedicamento
                    tr.appendChild(td);
                    lista.appendChild(tr);
                    tr = document.createElement('tr');
                    td = document.createElement('td');
                    td.innerHTML = ' Dosis recetada'
                    tr.appendChild(td);
                    lista.appendChild(tr);

                    td = document.createElement('td');
                    td.innerHTML = datosRecibidos[key].Dosis
                    tr.appendChild(td);
                    lista.appendChild(tr);
                    tr = document.createElement('tr');
                    td = document.createElement('td');
                    td.innerHTML = ' Cantidad recetada'
                    tr.appendChild(td);
                    lista.appendChild(tr);

                    td = document.createElement('td');
                    td.innerHTML = datosRecibidos[key].Cantidad
                    tr.appendChild(td);
                    lista.appendChild(tr);
                    tr = document.createElement('tr');
                    td = document.createElement('td');
                    td.innerHTML = 'Motivo de la receta'
                    tr.appendChild(td);
                    lista.appendChild(tr);

                    td = document.createElement('td');
                    td.innerHTML = datosRecibidos[key].Motivo
                    tr.appendChild(td);
                    lista.appendChild(tr);
                    tr = document.createElement('tr');
                    td = document.createElement('td');
                    td.innerHTML = ' Fecha de la receta'
                    tr.appendChild(td);
                    lista.appendChild(tr);

                    td = document.createElement('td');
                    td.innerHTML = datosRecibidos[key].Fecha
                    tr.appendChild(td);
                    tr.appendChild(td);
                    lista.appendChild(tr);
                    tr = document.createElement('tr');
                    td = document.createElement('td');
                    td.innerHTML = ' Conversacion'
                    tr.appendChild(td);
                    tr.appendChild(td);
                    lista.appendChild(tr);

                    td = document.createElement('td');
                    td.innerHTML = datosRecibidos[key].Conversacion
                    tr.appendChild(td);
                    lista.appendChild(tr);

                    tr.appendChild(td);
                    lista.appendChild(tr);
                    contenedor.appendChild(lista)
                });


            } else {
                var h2 = document.createElement('h2');
                h2.setAttribute('id', 'recetadas');
                h2.innerHTML = 'Usted no ha sido recetado nada aun '
                contenedor.appendChild(h2)
            }

        }
    };
    xhttp.open("POST", "manejarRecetasPaciente", true);
    xhttp.send();
    return false;
}
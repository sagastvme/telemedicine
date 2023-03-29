function formularioInicioSesion() {
    document.body.innerHTML = '';
    //encabezado
    var encabezado = document.createElement('h1');
    encabezado.innerHTML = 'LogIn';

    //formulario
    var formulario = document.createElement('form');
    //data-path se usa para poder las dobles llaves de twig y path de forma similar
    formulario.setAttribute('data-path', "{{ path('ctrl_login') }}");
    formulario.setAttribute('method', "POST");

    //label username
    var labelUsername = document.createElement('label');
    labelUsername.setAttribute('for', '_username');
    labelUsername.innerHTML = 'Email';


    //label password
    var labelPassword = document.createElement('label');
    labelPassword.setAttribute('for', '_password');
    labelPassword.innerHTML = 'Password';


    //input text
    var texto = document.createElement('input');
    texto.setAttribute('type', 'text');
    texto.setAttribute('name', '_username');
    texto.setAttribute('id', '_username');
    //input password
    var password = document.createElement('input');
    password.setAttribute('type', 'password');
    password.setAttribute('name', '_password');
    password.setAttribute('id', 'password');

    //submit
    var enviar = document.createElement('input');
    enviar.setAttribute('type', 'submit');
    enviar.setAttribute('value', 'Iniciar sesion');
    enviar.setAttribute('id', 'enviar');
    //enlace con formulario medico
    var enlaceM = document.createElement('a');
    enlaceM.setAttribute('href', '#');
    enlaceM.addEventListener('click', registrateFormularioMedico);
    enlaceM.innerHTML = 'Regístrate si eres un medico';


    //enlace con formulario paciente
    var enlaceP = document.createElement('a');
    enlaceP.setAttribute('href', '#');
    enlaceP.addEventListener('click', registrateFormularioPaciente);
    enlaceP.innerHTML = 'Regístrate si eres un paciente';



    //append elementos a formulario
    formulario.appendChild(labelUsername);

    formulario.appendChild(texto);
    formulario.appendChild(labelPassword);
    formulario.appendChild(password);

    formulario.appendChild(enviar);


    //etiqueta script
    var script = document.createElement('script');
    script.setAttribute('type', 'text/javascript');
    script.setAttribute('src', 'js/registrate.js')
    //junto todo al body
    document.body.appendChild(encabezado);
    document.body.appendChild(formulario);


    document.body.appendChild(script);

    document.body.appendChild(enlaceM);
    document.body.appendChild(enlaceP);

var boton=document.createElement('button');
boton.addEventListener('click', crearBuscadorReceta);
boton.setAttribute('id', 'receta');
boton.innerHTML='Consulta una receta';
document.body.appendChild(boton)



    var div=document.createElement('div');
div.setAttribute('id', 'contenedor');

document.body.appendChild(div)

}


function registrateFormularioPaciente() {
    document.body.innerHTML = '';
    //creo que el encabezado
    var encabezado = document.createElement('h1');

    encabezado.innerHTML = 'Registrese para ser paciente del gregorio maranon';
    document.body.append(encabezado);
    //creo el enlace para volver a la pagina de inicio sesion
    var enlaceIniciaSesion = document.createElement('a');
    enlaceIniciaSesion.innerHTML = 'Iniciar sesion';
    enlaceIniciaSesion.setAttribute('href', '#')
    enlaceIniciaSesion.addEventListener('click', formularioInicioSesion);


    //creo el formulario
    var form = document.createElement('form');

    form.setAttribute('enctype', 'multipart/form-data');
    form.setAttribute('id', 'formulario');
    //creo los inputs y labels necesarios para dar de confirmarCuenta al cliente
    form.addEventListener("submit", function (e) {
        e.preventDefault();
        var usuario = document.getElementById('usuario').value;
        var password = document.getElementById('password').value;
        var nombre = document.getElementById('nombre').value;
        var apellido = document.getElementById('apellido').value;
        var fecha = document.getElementById('fechaNac').value;
        var nss = document.getElementById('nss').value;
        var telefono = document.getElementById('telefono').value;

if(nss.length===10 && telefono.length===9) {
    const xhr = new XMLHttpRequest();

    xhr.onreadystatechange = function () {
        if (xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) {
            var datosRecibidos = JSON.parse(this.responseText);
            if (datosRecibidos[0] !== 'true') {
                alert(datosRecibidos[1]);
            } else {
                alert('Su perfil se ha creado, se le ha enviado un correo para que verifique su cuenta')
                formularioInicioSesion();
            }


        }
    };
    xhr.open('GET', 'alta?usuario=' + usuario + '&password=' +
        password + '&nombre=' + nombre + '&apellido=' + apellido + '&fecha=' + fecha + '&nss=' + nss + '&telefono=' + telefono, true);
    xhr.send();
}else{
    alert('Su numero de seguridad social deben ser 10 digitos y su numero telefonico de 9')
}
    });
    var lusuario = document.createElement('label')
    lusuario.setAttribute('for', 'usuario')
    lusuario.innerHTML = 'Email'

    var usuario = document.createElement('input');
    usuario.setAttribute('type', 'email');
    usuario.setAttribute('id', 'usuario');
    usuario.setAttribute('required', 'true');

    var lclave = document.createElement('label');
    lclave.setAttribute('for', 'password')
    lclave.innerHTML = 'Contrasena'

    var clave = document.createElement('input');
    clave.setAttribute('type', 'password');
    clave.setAttribute('id', 'password');
    clave.setAttribute('required', 'true');

    var lnombre = document.createElement('label');
    lnombre.setAttribute('for', 'nombre');
    lnombre.innerHTML = 'Nombre'

    var nombre = document.createElement('input');
    nombre.setAttribute('type', 'text');
    nombre.setAttribute('id', 'nombre');
    nombre.setAttribute('required', 'true');

    var lapellido = document.createElement('label');
    lapellido.setAttribute('for', 'apellido');
    lapellido.innerHTML = 'Apellido';

    var apellido = document.createElement('input');
    apellido.setAttribute('type', 'text');
    apellido.setAttribute('id', 'apellido');
    apellido.setAttribute('required', 'true');

    var lfechaNac = document.createElement('label');
    lfechaNac.setAttribute('for', 'fechaNac');
    lfechaNac.innerHTML = 'Fecha nacimiento';


    var fechaNac = document.createElement('input');
    fechaNac.setAttribute('type', 'date');
    fechaNac.setAttribute('id', 'fechaNac');
    fechaNac.setAttribute('required', 'true');
    var ltelefono = document.createElement('label');
    ltelefono.setAttribute('for', 'telefono');
    ltelefono.innerHTML = 'Telefono';

    var lnss = document.createElement('label');
    lnss.setAttribute('for', 'nss');
    lnss.innerHTML = 'Numero seguridad social';
    var nss = document.createElement('input');
    nss.setAttribute('type', 'number')
    nss.setAttribute('id', 'nss');
    nss.setAttribute('required', 'true');
    var telefono = document.createElement('input');
    telefono.setAttribute('type', 'number')
    telefono.setAttribute('id', 'telefono');
    telefono.setAttribute('required', 'true');


    var enviar = document.createElement('button');
    enviar.innerHTML = 'Registrarse';

    document.body.append(enlaceIniciaSesion);
    form.appendChild(lusuario);
    form.appendChild(usuario);

    form.appendChild(lclave);
    form.appendChild(clave);

    form.appendChild(lnombre);
    form.appendChild(nombre)

    form.appendChild(lapellido);
    form.appendChild(apellido);

    form.appendChild(lfechaNac);
    form.appendChild(fechaNac);

    form.appendChild(lnss);
    form.appendChild(nss);

    form.appendChild(ltelefono);
    form.appendChild(telefono);


    form.appendChild(enviar);
    document.body.appendChild(form);
}


function registrateFormularioMedico() {
    document.body.innerHTML = '';
    //creo que el encabezado
    var encabezado = document.createElement('h1');

    encabezado.innerHTML = 'Registrese para ser medico del gregorio maranon';
    document.body.append(encabezado);
    //creo el enlace para volver a la pagina de inicio sesion
    var enlaceIniciaSesion = document.createElement('a');
    enlaceIniciaSesion.innerHTML = 'Iniciar sesion';
    enlaceIniciaSesion.setAttribute('href', '#')
    enlaceIniciaSesion.addEventListener('click', formularioInicioSesion);


    //creo el formulario
    var form = document.createElement('form');

    form.setAttribute('enctype', 'multipart/form-data');
    form.setAttribute('id', 'formulario');
    //creo los inputs y labels necesarios para dar de confirmarCuenta al cliente
    form.addEventListener("submit", function (e) {
        e.preventDefault();
        var usuario = document.getElementById('usuario').value;
        var password = document.getElementById('password').value;
        var nombre = document.getElementById('nombre').value;
        var apellido = document.getElementById('apellido').value;
        var fecha = document.getElementById('fechaNac').value;
        var numColegiado = document.getElementById('numColegiado').value;
        var especialidad = document.getElementById('especialidad').value;
        var telefono = document.getElementById('telefono').value;

        if(numColegiado.length===10 && telefono.length===9
        && usuario.endsWith('@comem.es')) {
            const xhr = new XMLHttpRequest();

            xhr.onreadystatechange = function () {
                if (xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) {
                    var datosRecibidos = JSON.parse(this.responseText);
                    if (datosRecibidos[0] !== 'true') {
                        alert(datosRecibidos[1]);
                    } else {
                        alert('Su perfil se ha creado, se le ha enviado un correo para que verifique su cuenta')
                        formularioInicioSesion();
                    }


                }
            };
            xhr.open('GET', 'altaMedico?usuario=' + usuario + '&password=' +
                password + '&nombre=' + nombre + '&apellido=' + apellido + '&fecha=' + fecha + '&numColegiado=' + numColegiado+ '&especialidad=' + especialidad + '&telefono=' + telefono, true);
            xhr.send();
        }else{
            alert('Su numero de colegiado deben ser 10 digitos, su numero telefonico de 9 y su correo de medico debe' +
                ' acabar en @comem.es')
        }
    });
    var lusuario = document.createElement('label')
    lusuario.setAttribute('for', 'usuario')
    lusuario.innerHTML = 'Email'

    var usuario = document.createElement('input');
    usuario.setAttribute('type', 'email');
    usuario.setAttribute('id', 'usuario');
    usuario.setAttribute('required', 'true');


    var lclave = document.createElement('label');
    lclave.setAttribute('for', 'password')
    lclave.innerHTML = 'Contrasena'

    var clave = document.createElement('input');
    clave.setAttribute('type', 'password');
    clave.setAttribute('id', 'password');
    clave.setAttribute('required', 'true');


    var lnombre = document.createElement('label');
    lnombre.setAttribute('for', 'nombre');
    lnombre.innerHTML = 'Nombre'

    var nombre = document.createElement('input');
    nombre.setAttribute('type', 'text');
    nombre.setAttribute('id', 'nombre')
    nombre.setAttribute('required', 'true');


    var lapellido = document.createElement('label');
    lapellido.setAttribute('for', 'apellido');
    lapellido.innerHTML = 'Apellido';

    var apellido = document.createElement('input');
    apellido.setAttribute('type', 'text');
    apellido.setAttribute('id', 'apellido');
    apellido.setAttribute('required', 'true');


    var lfechaNac = document.createElement('label');
    lfechaNac.setAttribute('for', 'fechaNac');
    lfechaNac.innerHTML = 'Fecha nacimiento';


    var fechaNac = document.createElement('input');
    fechaNac.setAttribute('type', 'date');
    fechaNac.setAttribute('id', 'fechaNac');
    fechaNac.setAttribute('required', 'true');


    var lnumColegiado = document.createElement('label');
    lnumColegiado.setAttribute('for', 'numColegiado');
    lnumColegiado.innerHTML = 'Numero de colegiado';
    var numColegiado = document.createElement('input');
    numColegiado.setAttribute('type', 'number')
    numColegiado.setAttribute('id', 'numColegiado');
    numColegiado.setAttribute('required', 'true');


    var lespecialidad = document.createElement('label');
    lespecialidad.setAttribute('for', 'especialidad');
    lespecialidad.innerHTML = 'Especialidad';
    var especialidad = document.createElement('select');

// Opciones a agregar
    var opciones = [
        'Medicina general',
        'Pediatría',
        'Traumatología',
        'Urgencias',
        'Dermatología',
        'Ginecología',
        'Cardiología',
        'Geriatría'
    ];

// Recorrer las opciones y crear un elemento option para cada una
    opciones.forEach(function(opcion) {
        var option = document.createElement('option');
        option.value = opcion;
        option.text = opcion;
        especialidad.add(option);
    });
    especialidad.setAttribute('id', 'especialidad');
    especialidad.setAttribute('required', 'true');

    var ltelefono = document.createElement('label');
    ltelefono.setAttribute('for', 'telefono');
    ltelefono.innerHTML = 'Telefono';
    var telefono = document.createElement('input');
    telefono.setAttribute('type', 'number')
    telefono.setAttribute('id', 'telefono');
    telefono.setAttribute('required', 'true');

    var enviar = document.createElement('button');
    enviar.innerHTML = 'Registrarse';

    document.body.append(enlaceIniciaSesion);
    form.appendChild(lusuario);
    form.appendChild(usuario);

    form.appendChild(lclave);
    form.appendChild(clave);

    form.appendChild(lnombre);
    form.appendChild(nombre)

    form.appendChild(lapellido);
    form.appendChild(apellido);

    form.appendChild(lfechaNac);
    form.appendChild(fechaNac);


    form.appendChild(lnumColegiado);
    form.appendChild(numColegiado);

    form.appendChild(lespecialidad);
    form.appendChild(especialidad);



    form.appendChild(ltelefono);
    form.appendChild(telefono);


    form.appendChild(enviar);
    document.body.appendChild(form);
}


function darDeAltaPaciente() {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState === 4 && this.status === 200) {
            var datosRecibidos = JSON.parse(this.responseText);
            document.body.innerHTML = '';
            var enlaceIniciaSesion = document.createElement('a');
            enlaceIniciaSesion.innerHTML = 'Iniciar sesion';
            enlaceIniciaSesion.setAttribute('href', '#')
            enlaceIniciaSesion.addEventListener('click', formularioInicioSesion);


            // handle the successful JSON response here

        }
    };
    var usuario = document.getElementById('usuario').value;
    var password = document.getElementById('password').value;


    var nombre = document.getElementById('nombre').value;

    var apellido = document.getElementById('apellido').value;

    var fechaNac = document.getElementById('fechaNac').value;

    var nss = document.getElementById('nss').value;

    var telefono = document.getElementById('telefono').value;

    var fotoPerfil = document.getElementById('fotoPerfil').files[0];
    var form_data = new FormData(document.getElementsByTagName('form')[0]);

    enviar = new FormData();
    enviar.append('apellido', document.getElementById('apellido').value)
    enviar.append('usuario', document.getElementById('usuario').value)
    enviar.append('password', document.getElementById('password').value)
    enviar.append('nombre', document.getElementById('nombre').value)
    enviar.append('fechaNac', document.getElementById('fechaNac').value)
    enviar.append('nss', document.getElementById('nss').value)
    enviar.append('telefono', document.getElementById('telefono').value)
    enviar.append('fotoPerfil', document.getElementById('fotoPerfil').files[0])

    xhttp.open("POST", "alta?nombre=", true);

    xhttp.send(enviar);

}


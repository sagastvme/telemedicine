<?php

namespace App\Controller;

use App\Entity\Conversacion;
use App\Entity\Grupo;
use App\Entity\Medico;
use App\Entity\Mensaje;
use App\Entity\Paciente;
use App\Entity\Participante;
use App\Entity\Receta;
use App\Entity\Usuario;
use DateTime;
use Doctrine\DBAL\Exception\UniqueConstraintViolationException;
use Doctrine\Persistence\ManagerRegistry;
use PHPUnit\Exception;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Mailer\Exception\TransportExceptionInterface;
use Symfony\Component\Mailer\MailerInterface;
use Symfony\Component\Mime\Email;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Security\Core\Exception\AccessDeniedException;

class PortadaController extends AbstractController
{
    //renderizo el twig que va a ser spa
    #[Route('/portada', name: 'app_portada')]
    public function index(Request $request): Response
    {


        //con esto niego el acceso a los usuarios no verificados
        try {
            $this->denyAccessUnlessGranted('ROLE_USER_VERIFICADO');
            //le devuelvo el twig donde voy a usar todo spa
            return $this->render('portada/index.html.twig');
        }catch(AccessDeniedException $e) {
            return $this->render('med_login/index.html.twig');
        }
    }

    //esta ruta es para sacar los datos del usuario que lo pide
    #[Route('/misDatos', name: 'app_datos')]
    public function indexl(Request $request, ManagerRegistry $doctrine): Response
    {
        $usuario = $this->getUser();
        //me conecto a la bbdd
        $entityManager = $doctrine->getManager();

        //saco la info comun de los usuarios
        $usuario = $this->getUser();
        $infoUsuario = [];
        $infoUsuario[] = $usuario->getUsuario();
        $infoUsuario[] = $usuario->getNombre();
        $infoUsuario[] = $usuario->getApellido();
        $infoUsuario[] = $usuario->getTelefono();
        $infoUsuario[] = $usuario->getFechaNac()->format('Y-m-d');

        //si es médico solo voy a sacar los datos de la tabla medico
        if ($usuario->getTipo() == 'Medico') {

            $datosMedicos = $entityManager->getRepository(Medico::class)->findOneBy(array('codUsuario' => $usuario->getCodUsuario()));
            $infoUsuario[] = $datosMedicos->getNumColegiado();
            $infoUsuario[] = $datosMedicos->getEspecialidad();
        } //si es paciente sacare los datos de esta
        else {
            $datosPaciente = $entityManager->getRepository(Paciente::class)->findOneBy(array('codUsuario' => $usuario->getCodUsuario()));
            $infoUsuario[] = $datosPaciente->getNss();
            //aquí guardo al médico de cabecera y saco sus datos
            $medicoCabecera = $datosPaciente->getMedicoCabecera();
            $infoUsuario[] = $medicoCabecera->getEspecialidad();
            //aqua guardo al usuario al que apunta el medico
            $datosMedico = $medicoCabecera->getCodUsuario();
            $infoUsuario[] = $datosMedico->getNombre();
            $infoUsuario[] = $datosMedico->getApellido();
            //formatear fecha
            $infoUsuario[] = $datosMedico->getFechaNac()->format('Y-m-d');
        }
        return new JsonResponse($infoUsuario);
    }

    //esto sera para dar de confirmarCuenta a usuarios
    #[Route('/alta', name: 'app_alta')]
    public function formulario(Request $request, ManagerRegistry $doctrine, MailerInterface $mailer)
    {
        $entityManager = $doctrine->getManager();

        $usuarioRecibido = $request->get('usuario');
        $passwordRecibido = $request->get('password');
        $nombreRecibido = $request->get('nombre');
        $apellidoRecibido = $request->get('apellido');
        $fecha = new DateTime($request->get('fecha'));
        $nssRecibido = $request->get('nss');
        $telefonoRecibido = $request->get('telefono');
        $array = [];
        try {
            $usuario = new Usuario();
            $usuario->setUsuario($usuarioRecibido);
            $usuario->setConfirmado('N');
            $usuario->setTelefono($telefonoRecibido);
            $usuario->setClave($passwordRecibido);
            $usuario->setTipo('Paciente');
            $usuario->setApellido($apellidoRecibido);
            $usuario->setNombre($nombreRecibido);
            $usuario->setFechaNac($fecha);
            $usuario->setFotoPerfil('fotosDePerfil/null.jpg');
            $entityManager->persist($usuario);
            $paciente = new Paciente();

            $paciente->setCodUsuario($usuario);

            $medico = $entityManager->getRepository(Medico::class)->findAll();


            $paciente->setMedicoCabecera($medico[0]);
            $paciente->setNss($nssRecibido);
            $entityManager->persist($paciente);
            $entityManager->flush();


            $url = 'http:/' . $_SERVER['HTTP_HOST'];
            $url = $url . $this->generateUrl('app_confirmar', ['usuarioRecibido' => $usuarioRecibido]);
            $email = (new Email())
                ->from('gregoriomaranon@gmail.com')
                ->to($usuarioRecibido)
                ->subject('Confirma tu cuenta')
                ->html(
                    $this->renderView('confirmarCuenta/confirmar.html.twig', [
                        'url' => $url
                    ])
                );
            $mailer->send($email);


            $array[] = 'true';
            return new JsonResponse($array);

        } catch (UniqueConstraintViolationException $e) {

            $array[] = 'error';

            if (str_contains($e->getMessage(), 'usuario')) {
                $errorMessage = 'Ya existe un usuario con el correo electrónico especificado.';
            } else if (str_contains($e->getMessage(), 'nss')) {
                $errorMessage = 'Ya existe un usuario con el numero de seguridad social especificado.';

            } else {
                $errorMessage = 'Ya existe un usuario con el numero de telefono especificado.';

            }


            $array[] = $errorMessage;
            return new JsonResponse($array);
        }

    }

    //con esto saco los medicos que pertenecen a la especialidad que me está solicitando el usuario para crear la consulta
    #[Route('/doctores', name: 'app_doctores')]
    public function indexM(Request $request, ManagerRegistry $doctrine): Response
    {
        $entityManager = $doctrine->getManager();
        $datosMedicos = $entityManager->getRepository(Medico::class)->findBy(array('especialidad' => $request->get('especialidad')));
        $infoUsuario = [];
        foreach ($datosMedicos as $valor) {
            $usuario = $valor->getCodUsuario();
            $infoUsuario[$usuario->getCodUsuario()] = $usuario->getNombre() . ' ' . $usuario->getApellido() . ' ';
        }
        return new JsonResponse($infoUsuario);
    }

    //aquí voy a crear la consulta y el primer mensaje que debe introducir el usuario de manera obligatoria
    #[Route('/crearconsulta', name: 'app_crear_consulta')]
    public function crearConsulta(Request $request, ManagerRegistry $doctrine): Response
    {

        //con esto consigo los codigos de los usuarios a los que quiere escribir
        $receptores = $request->get('receptor');
        $identificadores = explode("_", $receptores);
        array_pop($identificadores);
        //ahora tengo que sacar los datos que le voy a pasar al metodo crearMensajes
        $motivo = $request->get('asunto');
        $cuerpo = $request->get('cuerpo');
        $infoUsuario = $this->crearMensajes($identificadores, $cuerpo, $motivo, $doctrine);
        return new JsonResponse($infoUsuario);
    }

    //este es un metodo para crear la conversacion mensaje y participantes necesarios, lo he hecho aparte para que sea mas legible
    public function crearMensajes(array $identificadores, string $cuerpo, string $motivo, ManagerRegistry $doctrine)
    {

        $entityManager = $doctrine->getManager();
        $fecha = new DateTime();
        //creo el grupo al que estaran unidas todas las conversaciones
        $conversacion = new Conversacion();
        $conversacion->setTema($motivo);
        $conversacion->setFechaInicio($fecha);
        $entityManager->persist($conversacion);


        //ahora voy a crear las multiples conversaciones
        //segun el número de receptores
        $participante = new Participante();
        $participante->setCodConversacion($conversacion);
        $participante->setCodUsuario($this->getUser());

        $entityManager->persist($participante);
        foreach ($identificadores as $a) {
            $receptor = $entityManager->
            getRepository(Usuario::class)->findOneBy(
                array('codUsuario' => $a));

            $participante = new Participante();
            $participante->setCodConversacion($conversacion);
            $participante->setCodUsuario($receptor);

            $entityManager->persist($participante);

        }
        $mensaje = new Mensaje();
        $mensaje->setCodConversacion($conversacion);
        $mensaje->setCodRemitente($this->getUser());
        $mensaje->setContenido($cuerpo);
        $mensaje->setLeido('N');
        $mensaje->setFechaHora($fecha);
        $entityManager->persist($mensaje);
        $entityManager->flush();
        $info = [];
        $info[] = 'true';
        return $info;
    }

    //aquí devuelvo los datos de la receta que me ha pedido el usuario
    #[Route('/consultarReceta', name: 'app_receta')]
    public function sacarDatos(Request $request, ManagerRegistry $doctrine): Response
    {
        $entityManager = $doctrine->getManager();
        //con esto consigo el codigo de la receta a consultar
        $codigo = $request->get('codigo');
        $infoUsuario = [];
        $receta = $entityManager->getRepository(Receta::class)->findOneBy(
            array('codReceta' => $codigo));
        if ($receta) {
            //codigo receta
            $infoUsuario[] = $receta->getCodReceta();
            //nombre del paciente de la receta

            $infoUsuario[] = $receta->getCodPaciente()->getCodUsuario()->getNombre() . ' ' . $receta->getCodPaciente()->getCodUsuario()->getApellido();
            //consigo el nombre del medicamento
            $infoUsuario[] = $receta->getNombreMedicamento();
            //nombre el code del médico
            $infoUsuario[] = $receta->getCodMedico()->getCodUsuario()->getNombre() . ' ' . $receta->getCodMedico()->getCodUsuario()->getApellido();
            //consigo la dosis
            $infoUsuario[] = $receta->getDosis();
            //consigo la cantidad
            $infoUsuario[] = $receta->getCantidad();

            //consigo el motivo
            $infoUsuario[] = $receta->getMotivo();

            //consigo la fecha

            $infoUsuario[] = $receta->getFechaHora()->format('Y-m-d');

        }
        return new JsonResponse($infoUsuario);
    }

    //devuelvo las consultas que me ha pedido el usuario donde este participa de forma resumida
    #[Route('/tusConsultas', name: 'app_consultas')]
    public function tusConsultas(Request $request, ManagerRegistry $doctrine): Response
    {
        $entityManager = $doctrine->getManager();
        //con esto saco las conversaciones en las que participa el usuario que solicita la info
        $conversaciones = $entityManager->getRepository(Participante::class)->findBy(
            array('codUsuario' => $this->getUser()));
        $info = [];
        foreach ($conversaciones as $a) {
            $info[$a->getCodConversacion()->getCodConversacion()] = $a->getCodConversacion()->getTema();
        }
        return new JsonResponse($info);
    }

    //saco los datos de la consulta que me han pasado
    #[Route('/datosConsulta', name: 'app_datos_detallados_consulta')]
    public function datosConsulta(Request $request, ManagerRegistry $doctrine): Response
    {
        //voy a sacar los mensajes de la consulta que me pasan
        $codigo = $request->get('consulta');
        $entityManager = $doctrine->getManager();

        $arrayM = [];

        $mensajes = $entityManager->getRepository(Mensaje::class)->findBy(
            array('codConversacion' => $codigo));

        foreach ($mensajes as $mensaje) {
            $mensaje->setLeido('Y');
            $entityManager->persist($mensaje);
            $entityManager->flush();
            $datos = [];
            $datos['Fecha'] = $mensaje->getFechaHora()->format("Y-m-d H:i");
            $datos['Contenido'] = $mensaje->getContenido();
            $datos['Emisor'] = $mensaje->getCodRemitente()->getNombre();
            $datos['Tipo'] = $mensaje->getCodRemitente()->getTipo();
            $datos['Leido'] = $mensaje->getLeido();
            $datos['Imagen'] = $mensaje->getCodRemitente()->getFotoPerfil();
            $arrayM[$mensaje->getCodMensaje()] = $datos;
        }
        return new JsonResponse($arrayM);
    }

    //aquí creo el mensaje nuevo que ha introducido el usuario
    #[Route('/insertarMensaje', name: 'insertarMensaje')]
    public function insertarMensaje(Request $request, ManagerRegistry $doctrine): Response
    {

        //creo el mensaje nuevo
        $entityManager = $doctrine->getManager();
        $cod = $request->get('codigo');
        $conversacion = $entityManager->getRepository(Conversacion::class)->findOneBy(array('codConversacion' => $cod));
        $cuerpo = $request->get('cuerpo');
        $fecha = new DateTime();
        $mensaje = new Mensaje();
        $mensaje->setCodConversacion($conversacion);
        $mensaje->setCodRemitente($this->getUser());
        $mensaje->setContenido($cuerpo);
        $mensaje->setLeido('N');
        $mensaje->setFechaHora($fecha);
        $entityManager->persist($mensaje);
        $entityManager->flush();

//voy a devolver los datos del mensaje que acaba de crear el usuario para en el js insertarlo y que vea que se ha creado
        //sin necesidad de refrescar la página
        $datos = [];
        $datos['Fecha'] = $mensaje->getFechaHora()->format("Y-m-d H:i");
        $datos['Contenido'] = $mensaje->getContenido();
        $datos['Emisor'] = $mensaje->getCodRemitente()->getNombre();
        $datos['Tipo'] = $mensaje->getCodRemitente()->getTipo();
        $datos['Leido'] = $mensaje->getLeido();
        $datos['Imagen'] = $mensaje->getCodRemitente()->getFotoPerfil();
        return new JsonResponse($datos);
    }


//aqui voy a imprimir a las personas a las que quiere escribir el medico segun sea paciente o medico
    #[Route('/sacarReceptores', name: 'app_tipos')]
    public function sacar(Request $request, ManagerRegistry $doctrine): Response
    {
        $tipo = $request->get('tipo');
        $entityManager = $doctrine->getManager();

        if ($tipo == 'Paciente') {
            $datosMedicos = $entityManager->getRepository(Paciente::class)->findAll();
        } else {
            $datosMedicos = $entityManager->getRepository(Medico::class)->findAll();
        }


        $infoUsuario = [];
        foreach ($datosMedicos as $valor) {
            $usuario = $valor->getCodUsuario();
            $infoUsuario[$usuario->getCodUsuario()] = $usuario->getNombre() . ' ' . $usuario->getApellido() . ' ';
        }
        return new JsonResponse($infoUsuario);
    }

    /**
     * @throws TransportExceptionInterface
     */
    #[Route('/bandeja', name: 'app_bandeja')]
    public function bandeja(Request $request, ManagerRegistry $doctrine, MailerInterface $mailer): Response
    {

        //voy a sacar los mensajes de la consulta que me pasan

        $entityManager = $doctrine->getManager();

        $arrayM = [];

        $participaciones = $entityManager->getRepository(Participante::class)->
        findBy(array('codUsuario' => $this->getUser()));

        foreach ($participaciones as $participacion) {
            $conversacion = $participacion->getCodConversacion();
            $mensajes = $entityManager->getRepository(Mensaje::class)->findBy(
                array('codConversacion' => $conversacion));
            foreach ($mensajes as $mensaje) {
                if ($mensaje->getCodRemitente() != $this->getUser()) {
                    $datos = [];
                    $datos['Contenido'] = substr($mensaje->getContenido(), 0, 3);
                    $datos['Emisor'] = $mensaje->getCodRemitente()->getNombre();
                    $datos['Tipo'] = $mensaje->getCodRemitente()->getTipo();
                    $datos['Leido'] = $mensaje->getLeido();
                    $arrayM[$mensaje->getCodMensaje()] = $datos;
                }
            }

        }


        return new JsonResponse($arrayM);
    }


    #[Route('/recetasManejador', name: 'app_manejador_recetas')]
    public function recetasManejador(Request $request, ManagerRegistry $doctrine): Response
    {

        //voy a sacar los mensajes de la consulta que me pasan

        $entityManager = $doctrine->getManager();

        $arrayM = [];
$medico=$entityManager->getRepository(Medico::class)->findOneBy(array('codUsuario'=>$this->getUser()));
if ($recetas = $entityManager->getRepository(Receta::class)->findBy(
            array('codMedico' => $medico))) {

            foreach ($recetas as $receta) {
                $datos = [];
                $datos['Codigodelareceta'] = $receta->getCodReceta();
                $datos['Pacienterecetado'] = $receta->getCodPaciente()->getCodUsuario()->getNombre() . ' ' . $receta->getCodPaciente()->getCodUsuario()->getApellido();
                $datos['Nombredelmedicamento'] = $receta->getNombreMedicamento();
                $datos['Dosis'] = $receta->getDosis();
                $datos['Cantidad'] = $receta->getCantidad();
                $datos['Motivo'] = $receta->getMotivo();
                $datos['Fecha'] = $receta->getFechaHora()->format('Y-m-d');
                $datos['Conversacion'] = $receta->getCodConversacion()->getTema();
                $arrayM[$receta->getCodReceta()] = $datos;
            }
        } else {
            $arrayM[] = 'false';
        }

        return new JsonResponse($arrayM);
    }


    #[Route('/borrarReceta', name: 'app_borrador_recetas')]
    public function borrarReceta(Request $request, ManagerRegistry $doctrine): Response
    {

        //voy a sacar los mensajes de la consulta que me pasan

        $entityManager = $doctrine->getManager();
        $codigo = $request->get('codigo');
        $arrayM = [];

        $recetas = $entityManager->getRepository(Receta::class)->findOneBy(
            array('codReceta' => $codigo));
        $entityManager->remove($recetas);
        $entityManager->flush();
        $arrayM[] = 'true';

        return new JsonResponse($arrayM);
    }

    #[Route('/crearReceta', name: 'app_crear_recetas')]
    public function crearReceta(Request $request, ManagerRegistry $doctrine): Response
    {

        //voy a sacar los mensajes de la consulta que me pasan

        $entityManager = $doctrine->getManager();
        $codigo = $request->get('codigo');
        $arrayM = null;

        $conversacion = $entityManager->getRepository(Conversacion::class)->findOneBy(
            array('codConversacion' => $codigo));

        $participantes = $entityManager->getRepository(Participante::class)->findBy(array('codConversacion' => $conversacion));

        $pacientes = [];

        if ($participantes) {
            foreach ($participantes as $participante) {
                if ($participante->getCodUsuario()->getTipo() == 'Paciente') {
                    $pacientes[$participante->getCodUsuario()->getCodUsuario()] = $participante->getCodUsuario()->getNombre();
                }
            }

            return new JsonResponse($pacientes);
        } else {
            return new JsonResponse($pacientes);
        }

    }


    #[Route('/introducirReceta', name: 'app_introducir_recetas')]
    public function introducirReceta(Request $request, ManagerRegistry $doctrine): Response
    {

        //voy a sacar los mensajes de la consulta que me pasan

        $entityManager = $doctrine->getManager();
        $nombre = $request->get('nombre');
        $dosis = $request->get('dosis');
        $cantidad = $request->get('cantidad');
        $motivo = $request->get('motivo');
        $conversacion = $request->get('conversacion');
        $receptor = $request->get('receptor');


        $codPaciente = $entityManager->getRepository(Paciente::class)->findOneBy(array('codUsuario' => $receptor));
        $fecha = new DateTime();
        $codConversacion = $entityManager->getRepository(Conversacion::class)->findOneBy(array('codConversacion' => $conversacion));
        $medico = $entityManager->getRepository(Medico::class)->findOneBy(array('codUsuario' => $this->getUser()));


        $receta = new Receta();
        $receta->setCodPaciente($codPaciente);
        $receta->setCodMedico($medico);
        $receta->setNombreMedicamento($nombre);
        $receta->setDosis($dosis);
        $receta->setCantidad($cantidad);
        $receta->setMotivo($motivo);

        $receta->setFechaHora($fecha);
        $receta->setCodConversacion($codConversacion);
        $entityManager->persist($receta);
        $entityManager->flush();


        $arrayM = [];

        return new JsonResponse($arrayM);
    }


    #[Route('/fotoPerfil', name: 'app_cambiar_foto')]
    public function uploadAction(Request $request, ManagerRegistry $doctrine)
    {
        $entityManager = $doctrine->getManager();
        $file = $request->files->get('file');

        if ($file) {
            // Obtener el nombre original del archivo
            $nombreOriginal = $file->getClientOriginalName();

            // Cambiar el nombre del archivo
            $nuevoNombre = $this->getUser()->getCodUsuario() . $this->getUser()->getNombre() . '.' . $file->guessExtension();

            // Mover el archivo a su nueva ubicación con el nuevo nombre
            $file->move($this->getParameter('fotosDePerfil'), $nuevoNombre);
            $this->getUser()->setFotoPerfil('fotosDePerfil/' . $nuevoNombre);
            $entityManager->persist($this->getUser());
            $entityManager->flush();
            // Devolver una respuesta HTTP 200 en caso de éxito
            return new Response('Archivo subido correctamente', 200);
        } else {
            // Devolver una respuesta HTTP 400 en caso de error
            return new Response('Error al subir el archivo', 400);
        }
    }


    #[Route('/borrarFoto', name: 'borrarFoto')]
    public function borrarFoto(Request $request, ManagerRegistry $doctrine)
    {
        $entityManager = $doctrine->getManager();

        $this->getUser()->setFotoPerfil('fotosDePerfil/null.jpg');
        $entityManager->persist($this->getUser());
        $entityManager->flush();
        // Devolver una respuesta HTTP 200 en caso de éxito
        return new Response('Archivo subido correctamente', 200);

    }


    //esto sera para dar de confirmarCuenta a usuarios
    #[Route('/altaMedico', name: 'app_alta_medico')]
    public function formularioMedico(Request $request, ManagerRegistry $doctrine, MailerInterface $mailer)
    {
        $entityManager = $doctrine->getManager();
        $usuarioRecibido = $request->get('usuario');
        $passwordRecibido = $request->get('password');
        $nombreRecibido = $request->get('nombre');
        $apellidoRecibido = $request->get('apellido');
        $fecha = new DateTime($request->get('fecha'));
        $numColegiado = $request->get('numColegiado');
        $especialidad = $request->get('especialidad');
        $telefonoRecibido = $request->get('telefono');
        $array = [];
        try {
            $usuario = new Usuario();
            $usuario->setUsuario($usuarioRecibido);
            $usuario->setConfirmado('N');
            $usuario->setTelefono($telefonoRecibido);
            $usuario->setClave($passwordRecibido);
            $usuario->setTipo('Medico');
            $usuario->setApellido($apellidoRecibido);
            $usuario->setNombre($nombreRecibido);
            $usuario->setFechaNac($fecha);
            $usuario->setFotoPerfil('fotosDePerfil/null.jpg');
            $entityManager->persist($usuario);
            $medico = new Medico();

            $medico->setCodUsuario($usuario);

            $medico->setNumColegiado($numColegiado);
            $medico->setEspecialidad($especialidad);

            $entityManager->persist($medico);
            $entityManager->flush();

            $url = 'http:/' . $_SERVER['HTTP_HOST'];
            $url = $url . $this->generateUrl('app_confirmar', ['usuarioRecibido' => $usuarioRecibido]);
            $email = (new Email())
                ->from('gregoriomaranon@gmail.com')
                ->to($usuarioRecibido)
                ->subject('Confirma tu cuenta')
                ->html(
                    $this->renderView('confirmarCuenta/confirmar.html.twig', [
                        'url' => $url
                    ])
                );
            $mailer->send($email);


            $array[] = 'true';
            return new JsonResponse($array);


        } catch (UniqueConstraintViolationException $e) {

            $array[] = 'error';

            if (str_contains($e->getMessage(), 'usuario')) {
                $errorMessage = $e->getMessage();
            } else if (str_contains($e->getMessage(), 'numColegiado')) {
                $errorMessage = $e->getMessage();

            } else {
                $errorMessage = $e->getMessage();
            }


            $array[] = $errorMessage;
            return new JsonResponse($array);
        } catch (TransportExceptionInterface $e) {
            $array[] = 'error';
            $array[] = $e->getMessage();
            return new JsonResponse($array);
        }


    }


    #[Route('/confirmar/{usuarioRecibido}', name: 'app_confirmar')]
    public function confirmarCuenta($usuarioRecibido, ManagerRegistry $doctrine)
    {

        $entityManager = $doctrine->getManager();
        $usuario = $entityManager->getRepository(Usuario::class)
            ->findOneBy(array('usuario' => $usuarioRecibido));
        $usuario->setConfirmado('Y');
        $entityManager->persist($usuario);
        $entityManager->flush();

        return $this->render('confirmarCuenta/bienvenida.html.twig', array('usuario' => $usuarioRecibido));
    }


    #[Route('/borrarCuenta', name: 'borrarCuenta')]
    public function borrarCuenta(ManagerRegistry $doctrine, MailerInterface $mailer)
    {

        $url = 'http:/' . $_SERVER['HTTP_HOST'];
        $url = $url . $this->generateUrl('borrarCuentaCommit', ['codigo' => $this->getUser()->getCodUsuario()]);
        $email = (new Email())
            ->from('gregoriomaranon@gmail.com')
            ->to($this->getUser()->getUsername())
            ->subject('Nos entristece verte ir')
            ->html(
                $this->renderView('borrarCuenta/borrar.html.twig', [
                    'url' => $url
                ])
            );
        $mailer->send($email);
        return new Response('mensaje enviado');
    }

    #[Route('/borrarCuentaDeVerdad/{codigo}', name: 'borrarCuentaCommit')]
    public function borrarCuentaCommit($codigo, ManagerRegistry $doctrine, MailerInterface $mailer)
    {

        $entityManager = $doctrine->getManager();
        $usuario = $entityManager->getRepository(Usuario::class)->findOneBy(array('codUsuario' => $codigo));
        if ($usuario->getTipo() == 'Paciente') {
            $heredada = $entityManager->getRepository(Paciente::class)->findOneBy(array('codUsuario' => $usuario));
            $recetas=$entityManager->getRepository(Receta::class)->findBy(array('codPaciente' =>$heredada));

        } else {
            $heredada = $entityManager->getRepository(Medico::class)->findOneBy(array('codUsuario' => $usuario));
            $recetas=$entityManager->getRepository(Receta::class)->findBy(array('codMedico' =>$heredada));
            $pacientesCabecera = $entityManager->getRepository(Paciente::class)->findBy(array('medicoCabecera' => $heredada));



            $medicoSuplente = $entityManager->getRepository(Medico::class)->findAll();
            foreach ($pacientesCabecera as $p) {
                if ($medicoSuplente[0] == $usuario) {

                    $p->setMedicoCabecera($medicoSuplente[1]);
                } else {
                    $p->setMedicoCabecera($medicoSuplente[0]);

                }
            }
        }
        foreach ($recetas as $r){
            $entityManager->remove($r);

        }

        $mensajes = $entityManager->getRepository(Mensaje::class)->findBy(array('codRemitente' => $usuario));

        foreach ($mensajes as $m) {
            $entityManager->remove($m);

        }
        $conversaciones = $entityManager->getRepository(Participante::class)->findBy(array('codUsuario' => $usuario));
        foreach ($conversaciones as $c) {
            $entityManager->remove($c);

        }

        $entityManager->remove($heredada);
        $entityManager->remove($usuario);
        $entityManager->flush();
        // Código anterior para eliminar la cuenta

// Crear una nueva respuesta con el HTML triste
        $html = '<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Adiós</title>
   <style>
    body {
      background-color: #2c3e50;
      color: #bdc3c7;
      font-family: Arial, sans-serif;
      text-align: center;
      padding-top: 100px;
    }

    h1 {
      font-size: 2.5em;
    }

    p {
      font-size: 1.5em;
    }
  </style>
</head>
<body>
  <h1>¡Adiós!</h1>
  <p>Nos entristece verte ir. ¡Gracias por utilizar nuestro servicio!</p>
</body>
</html>';

        return new Response($html);
    }

    #[Route('/manejarRecetasPaciente', name: 'manejarRecetasPaciente')]
    public function manejarRecetasPaciente(ManagerRegistry $doctrine)
    {
        $entityManager = $doctrine->getManager();

        $arrayM = [];
$paciente=$entityManager->getRepository(Paciente::class)->findOneBy(array('codUsuario'=>$this->getUser()));
        if ($recetas = $entityManager->getRepository(Receta::class)->findBy(
            array('codPaciente' => $paciente))) {

            foreach ($recetas as $receta) {
                $datos = [];
                $datos['Codigodelareceta'] = $receta->getCodReceta();
                $datos['Pacienterecetado'] = $receta->getCodPaciente()->getCodUsuario()->getNombre() . ' ' . $receta->getCodPaciente()->getCodUsuario()->getApellido();
                $datos['Nombredelmedicamento'] = $receta->getNombreMedicamento();
                $datos['Dosis'] = $receta->getDosis();
                $datos['Cantidad'] = $receta->getCantidad();
                $datos['Motivo'] = $receta->getMotivo();
                $datos['Fecha'] = $receta->getFechaHora()->format('Y-m-d');
                $datos['Conversacion'] = $receta->getCodConversacion()->getTema();
                $arrayM[$receta->getCodReceta()] = $datos;
            }
        } else {
            $arrayM[] = 'false';
        }

        return new JsonResponse($arrayM);
    }

}
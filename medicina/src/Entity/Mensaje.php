<?php
// src/Entity/Restaurante.php
namespace App\Entity;

use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Security\Core\User\UserInterface;

/**
 * @ORM\Entity @ORM\Table(name="mensajes")
 */
class Mensaje
{

    /**
     * @ORM\Id
     * @ORM\GeneratedValue
     * @ORM\Column(type="integer",name="codMensaje")
     */
    private $codMensaje;
    /**
     * @ORM\ManyToOne(targetEntity="Conversacion")
     * @ORM\JoinColumn(name="codConversacion", referencedColumnName="codConversacion")
     */
    private $codConversacion;
    /**
     * @ORM\ManyToOne(targetEntity="Usuario")
     * @ORM\JoinColumn(name="codRemitente", referencedColumnName="codUsuario")
     */
    private $codRemitente;
    /**
     * @ORM\Column(type="string",  name = "contenido")
     */
    private $contenido;
    /**
     * @ORM\Column(type="datetime",  name = "fechaHora")
     */
    private $fechaHora;
    /**
     * @ORM\Column(type="string",  name = "leido")
     */
    private $leido;

    /**
     * @return mixed
     */
    public function getCodMensaje()
    {
        return $this->codMensaje;
    }

    /**
     * @param mixed $codMensaje
     */
    public function setCodMensaje($codMensaje): void
    {
        $this->codMensaje = $codMensaje;
    }

    /**
     * @return mixed
     */
    public function getCodConversacion()
    {
        return $this->codConversacion;
    }

    /**
     * @param mixed $codConversacion
     */
    public function setCodConversacion($codConversacion): void
    {
        $this->codConversacion = $codConversacion;
    }

    /**
     * @return mixed
     */
    public function getCodRemitente()
    {
        return $this->codRemitente;
    }

    /**
     * @param mixed $codRemitente
     */
    public function setCodRemitente($codRemitente): void
    {
        $this->codRemitente = $codRemitente;
    }

    /**
     * @return mixed
     */
    public function getContenido()
    {
        return $this->contenido;
    }

    /**
     * @param mixed $contenido
     */
    public function setContenido($contenido): void
    {
        $this->contenido = $contenido;
    }

    /**
     * @return mixed
     */
    public function getFechaHora()
    {
        return $this->fechaHora;
    }

    /**
     * @param mixed $fechaHora
     */
    public function setFechaHora($fechaHora): void
    {
        $this->fechaHora = $fechaHora;
    }

    /**
     * @return mixed
     */
    public function getLeido()
    {
        return $this->leido;
    }

    /**
     * @param mixed $leido
     */
    public function setLeido($leido): void
    {
        $this->leido = $leido;
    }














}
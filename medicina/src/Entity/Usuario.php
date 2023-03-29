<?php
// src/Entity/Restaurante.php
namespace App\Entity;

use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Security\Core\Encoder\PasswordEncoderInterface;
use Symfony\Component\Security\Core\Encoder\UserPasswordEncoderInterface;
use Symfony\Component\Security\Core\User\UserInterface;

/**
 * @ORM\Entity @ORM\Table(name="usuario")
 */
class Usuario implements UserInterface, \Serializable
{
    /**
     * @ORM\Id
     * @ORM\GeneratedValue
     * @ORM\Column(type="integer",name="codUsuario")
     */
    private $codUsuario;
    /**
     * @ORM\Column(type="string", name = "usuario")
     */
    private $usuario;
    /**
     * @ORM\Column(type="string", name = "clave")
     */
    private $clave;
    /**
     * @ORM\Column(type="string",  name = "nombre")
     */
    private $nombre;
    /**
     * @ORM\Column(type="string",  name = "apellido")
     */
    private $apellido;
    /**
     * @ORM\Column(type="string", name = "confirmado")
     */
    private $confirmado;
    /**
     * @ORM\Column(type="date",  name = "fechaNac")
     */
    private $fechaNac;
    /**
     * @ORM\Column(type="integer",  name = "telefono")
     */
    private $telefono;

    /**
     * @return mixed
     */
    public function getCodUsuario()
    {
        return $this->codUsuario;
    }

    /**
     * @param mixed $codUsuario
     */
    public function setCodUsuario($codUsuario): void
    {
        $this->codUsuario = $codUsuario;
    }

    /**
     * @return mixed
     */
    public function getUsuario()
    {
        return $this->usuario;
    }

    /**
     * @param mixed $usuario
     */
    public function setUsuario($usuario): void
    {
        $this->usuario = $usuario;
    }

    /**
     * @return mixed
     */
    public function getClave()
    {
        return $this->clave;
    }

    /**
     * @param mixed $clave
     */
    public function setClave($clave)
    {
     $hashed=password_hash($clave, PASSWORD_ARGON2I);
        $this->clave = $hashed;
    }

    /**
     * @return mixed
     */
    public function getNombre()
    {
        return $this->nombre;
    }

    /**
     * @param mixed $nombre
     */
    public function setNombre($nombre): void
    {
        $this->nombre = $nombre;
    }

    /**
     * @return mixed
     */
    public function getApellido()
    {
        return $this->apellido;
    }

    /**
     * @param mixed $apellido
     */
    public function setApellido($apellido): void
    {
        $this->apellido = $apellido;
    }

    /**
     * @return mixed
     */
    public function getConfirmado()
    {
        return $this->confirmado;
    }

    /**
     * @param mixed $confirmado
     */
    public function setConfirmado($confirmado): void
    {
        $this->confirmado = $confirmado;
    }

    /**
     * @return mixed
     */
    public function getFechaNac()
    {
        return $this->fechaNac;
    }

    /**
     * @param mixed $fechaNac
     */
    public function setFechaNac($fechaNac): void
    {
        $this->fechaNac = $fechaNac;
    }

    /**
     * @return mixed
     */
    public function getTelefono()
    {
        return $this->telefono;
    }

    /**
     * @param mixed $telefono
     */
    public function setTelefono($telefono): void
    {
        $this->telefono = $telefono;
    }

    /**
     * @return mixed
     */
    public function getFotoPerfil()
    {
        return $this->fotoPerfil;
    }

    /**
     * @param mixed $fotoPerfil
     */
    public function setFotoPerfil($fotoPerfil): void
    {
        $this->fotoPerfil = $fotoPerfil;
    }

    /**
     * @ORM\Column(type="string",  name = "fotoPerfil")
     */
    private $fotoPerfil;
    /**
     * @ORM\Column(type="string",  name = "tipo")
     */
    private $tipo;

    /**
     * @return mixed
     */
    public function getTipo()
    {
        return $this->tipo;
    }

    /**
     * @param mixed $tipo
     */
    public function setTipo($tipo): void
    {
        $this->tipo = $tipo;
    }


    /**
     * @return mixed
     */


    public function serialize()
    {
        return serialize(array(
            $this->codUsuario,
            $this->usuario,
            $this->clave,
        ));
    }

    public function unserialize($serialized)
    {
        list (
            $this->codUsuario,
            $this->usuario,
            $this->clave,
            ) = unserialize($serialized);
    }


    public function getRoles()
    {
        if ($this->getConfirmado() == "N") {
            return array('ROLE_USER_NO_VERIFICADO');
        }
        return array('ROLE_USER_VERIFICADO', 'ROLE_USER_KROOS');
    }

    public function getPassword()
    {
        return $this->getClave();
    }

    public function getSalt()
    {
        return;
    }

    public function getUsername()
    {
        return $this->getUsuario();
    }

    public function eraseCredentials()
    {
        return;
    }
}
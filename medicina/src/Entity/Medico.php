<?php
// src/Entity/Restaurante.php
namespace App\Entity;

use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Security\Core\User\UserInterface;

/**
 * @ORM\Entity @ORM\Table(name="medico")
 */
class Medico
{

    /**
     * @ORM\Id
     * @ORM\GeneratedValue
     * @ORM\Column(type="integer",name="codMedico")
     */
    private $codMedico;

    /**
     * @return mixed
     */
    public function getCodMedico()
    {
        return $this->codMedico;
    }

    /**
     * @param mixed $codMedico
     */
    public function setCodMedico($codMedico): void
    {
        $this->codMedico = $codMedico;
    }

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
    public function getNumColegiado()
    {
        return $this->numColegiado;
    }

    /**
     * @param mixed $numColegiado
     */
    public function setNumColegiado($numColegiado): void
    {
        $this->numColegiado = $numColegiado;
    }

    /**
     * @return mixed
     */
    public function getEspecialidad()
    {
        return $this->especialidad;
    }

    /**
     * @param mixed $especialidad
     */
    public function setEspecialidad($especialidad): void
    {
        $this->especialidad = $especialidad;
    }

    /**
     * @ORM\ManyToOne(targetEntity="Usuario")
     * @ORM\JoinColumn(name="codUsuario", referencedColumnName="codUsuario")
     */
    private $codUsuario;
    /**
     * @ORM\Column(type="integer", name = "numColegiado")
     */
    private $numColegiado;
    /**
     * @ORM\Column(type="string",  name = "especialidad")
     */
    private $especialidad;


}
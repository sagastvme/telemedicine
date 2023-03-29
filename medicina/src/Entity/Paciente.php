<?php
// src/Entity/Restaurante.php
namespace App\Entity;

use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Security\Core\User\UserInterface;

/**
 * @ORM\Entity @ORM\Table(name="paciente")
 */
class Paciente
{
    /**
     * @return mixed
     */
    public function getCodPaciente()
    {
        return $this->codPaciente;
    }

    /**
     * @param mixed $codPaciente
     */
    public function setCodPaciente($codPaciente): void
    {
        $this->codPaciente = $codPaciente;
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
    public function getMedicoCabecera()
    {
        return $this->medicoCabecera;
    }

    /**
     * @param mixed $medicoCabecera
     */
    public function setMedicoCabecera($medicoCabecera): void
    {
        $this->medicoCabecera = $medicoCabecera;
    }

    /**
     * @return mixed
     */
    public function getNss()
    {
        return $this->nss;
    }

    /**
     * @param mixed $nss
     */
    public function setNss($nss): void
    {
        $this->nss = $nss;
    }

    /**
     * @ORM\Id
     * @ORM\GeneratedValue
     * @ORM\Column(type="integer",name="codPaciente")
     */
    private $codPaciente;
    /**
     * @ORM\ManyToOne(targetEntity="Usuario")
     * @ORM\JoinColumn(name="codUsuario", referencedColumnName="codUsuario")
     */
    private $codUsuario;
    /**
     * @ORM\ManyToOne(targetEntity="Medico")
     * @ORM\JoinColumn(name="medicoCabecera", referencedColumnName="codMedico")
     */
    private $medicoCabecera;
    /**
     * @ORM\Column(type="integer",  name = "nss")
     */
    private $nss;



}
<?php
// src/Entity/Restaurante.php
namespace App\Entity;

use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Security\Core\User\UserInterface;

/**
 * @ORM\Entity @ORM\Table(name="receta")
 */
class Receta
{
    /**
     * @ORM\Id
     * @ORM\GeneratedValue
     * @ORM\Column(type="integer",name="codReceta")
     */
    private $codReceta;
    /**
     * @ORM\ManyToOne(targetEntity="Paciente")
     * @ORM\JoinColumn(name="codPaciente", referencedColumnName="codPaciente")
     */
    private $codPaciente;
    /**
     * @ORM\ManyToOne(targetEntity="Medico")
     * @ORM\JoinColumn(name="codMedico", referencedColumnName="codMedico")
     */
    private $codMedico;
    /**
     * @ORM\Column(type="string",name="nombreMedicamento")
     */
    private $nombreMedicamento;
    /**
     * @ORM\Column(type="string", name = "dosis")
     */
    private $dosis;
    /**
     * @ORM\Column(type="string", name = "cantidad")
     */
    private $cantidad;
    /**
     * @ORM\Column(type="string", name = "motivo")
     */
    private $motivo;
    /**
     * @ORM\Column(type="date", name = "fechaHora")
     */
    private $fechaHora;
    /**
     * @ORM\ManyToOne(targetEntity="Conversacion")
     * @ORM\JoinColumn(name="codConversacion", referencedColumnName="codConversacion")
     */
    private $codConversacion;

    /**
     * @return mixed
     */
    public function getCodReceta()
    {
        return $this->codReceta;
    }

    /**
     * @param mixed $codReceta
     */
    public function setCodReceta($codReceta): void
    {
        $this->codReceta = $codReceta;
    }

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
    public function getNombreMedicamento()
    {
        return $this->nombreMedicamento;
    }

    /**
     * @param mixed $nombreMedicamento
     */
    public function setNombreMedicamento($nombreMedicamento): void
    {
        $this->nombreMedicamento = $nombreMedicamento;
    }

    /**
     * @return mixed
     */
    public function getDosis()
    {
        return $this->dosis;
    }

    /**
     * @param mixed $dosis
     */
    public function setDosis($dosis): void
    {
        $this->dosis = $dosis;
    }

    /**
     * @return mixed
     */
    public function getCantidad()
    {
        return $this->cantidad;
    }

    /**
     * @param mixed $cantidad
     */
    public function setCantidad($cantidad): void
    {
        $this->cantidad = $cantidad;
    }

    /**
     * @return mixed
     */
    public function getMotivo()
    {
        return $this->motivo;
    }

    /**
     * @param mixed $motivo
     */
    public function setMotivo($motivo): void
    {
        $this->motivo = $motivo;
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


}